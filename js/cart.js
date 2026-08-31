/*
 * LUMEN cart (localStorage demo).
 * Handles cart state, the header badge, add-to-cart buttons (event delegation),
 * and rendering the cart page. Checkout is intentionally a preview stub.
 * Exposed as window.LUMEN_CART.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "lumen-cart";
  var SHIP_KEY = "lumen-ship";
  var SHIPPING = {
    standard: { label: "Standard (10\u201325 days)", price: 6.95 },
    faster: { label: "Faster (~6\u201312 days)", price: 12.95 }
  };

  function read() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      var obj = raw ? JSON.parse(raw) : {};
      return obj && typeof obj === "object" ? obj : {};
    } catch (e) {
      return {};
    }
  }

  function write(map) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch (e) {}
    emit();
  }

  function readShip() {
    try {
      var s = window.localStorage.getItem(SHIP_KEY);
      return SHIPPING[s] ? s : "standard";
    } catch (e) {
      return "standard";
    }
  }

  function writeShip(code) {
    if (!SHIPPING[code]) return;
    try {
      window.localStorage.setItem(SHIP_KEY, code);
    } catch (e) {}
  }

  function items() {
    var map = read();
    var out = [];
    var lookup = window.LUMEN_PRODUCTS;
    for (var id in map) {
      if (!Object.prototype.hasOwnProperty.call(map, id)) continue;
      var product = lookup ? lookup.byId(id) : null;
      if (!product) continue;
      out.push({ product: product, qty: Math.max(1, parseInt(map[id], 10) || 1) });
    }
    out.sort(function (a, b) {
      return a.product.name.localeCompare(b.product.name);
    });
    return out;
  }

  function count() {
    var map = read();
    var n = 0;
    for (var id in map) {
      if (Object.prototype.hasOwnProperty.call(map, id)) {
        n += Math.max(0, parseInt(map[id], 10) || 0);
      }
    }
    return n;
  }

  function subtotal() {
    return items().reduce(function (sum, it) {
      return sum + it.product.price * it.qty;
    }, 0);
  }

  function add(id, qty) {
    var lookup = window.LUMEN_PRODUCTS;
    if (lookup && !lookup.byId(id)) return;
    var map = read();
    map[id] = Math.max(1, (parseInt(map[id], 10) || 0) + (parseInt(qty, 10) || 1));
    write(map);
  }

  function setQty(id, qty) {
    var map = read();
    var n = parseInt(qty, 10) || 0;
    if (n <= 0) {
      delete map[id];
    } else {
      map[id] = n;
    }
    write(map);
  }

  function remove(id) {
    var map = read();
    delete map[id];
    write(map);
  }

  function clear() {
    write({});
  }

  function emit() {
    updateBadge();
    document.dispatchEvent(new CustomEvent("lumen:cart", { detail: { count: count() } }));
  }

  function updateBadge() {
    var n = count();
    var badges = document.querySelectorAll("[data-cart-count]");
    for (var i = 0; i < badges.length; i++) {
      badges[i].textContent = n;
      badges[i].setAttribute("data-empty", n === 0 ? "true" : "false");
    }
  }

  function money(usd) {
    return window.LUMEN_MONEY ? window.LUMEN_MONEY.format(usd) : "$" + Number(usd).toFixed(2);
  }

  function toast(message) {
    var el = document.querySelector("[data-toast]");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("data-toast", "");
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("is-visible");
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(function () {
      el.classList.remove("is-visible");
    }, 2200);
  }

  function renderCartPage() {
    var mount = document.querySelector("[data-cart-page]");
    if (!mount) return;
    var list = items();

    if (!list.length) {
      mount.innerHTML =
        '<div class="cart-empty reveal is-visible">' +
        "<h1>Your bag is empty</h1>" +
        '<p class="muted">Add a few glow tools to get started.</p>' +
        '<a class="btn btn-primary" href="shop.html">Shop the collection</a>' +
        "</div>";
      return;
    }

    var rows = list
      .map(function (it) {
        var p = it.product;
        var visual = window.LUMEN_PHOTOS
          ? window.LUMEN_PHOTOS.markup(p, "cart-item__visual")
          : "";
        return (
          '<div class="cart-item" data-cart-row="' +
          p.id +
          '">' +
          visual +
          '<div class="cart-item__info">' +
          '<a class="cart-item__name" href="product.html?id=' +
          p.id +
          '">' +
          p.name +
          "</a>" +
          '<p class="muted">' +
          window.LUMEN_PRODUCTS.categoryLabel(p.category) +
          "</p>" +
          '<button class="linklike" type="button" data-cart-remove="' +
          p.id +
          '">Remove</button>' +
          "</div>" +
          '<div class="cart-item__qty">' +
          '<button class="qty-btn" type="button" data-cart-dec="' +
          p.id +
          '" aria-label="Decrease quantity">\u2212</button>' +
          '<span class="qty-value" data-cart-qty>' +
          it.qty +
          "</span>" +
          '<button class="qty-btn" type="button" data-cart-inc="' +
          p.id +
          '" aria-label="Increase quantity">+</button>' +
          "</div>" +
          '<div class="cart-item__price">' +
          money(p.price * it.qty) +
          "</div>" +
          "</div>"
        );
      })
      .join("");

    var ship = readShip();
    var shipOptions = Object.keys(SHIPPING)
      .map(function (code) {
        var s = SHIPPING[code];
        return (
          '<label class="ship-option">' +
          '<input type="radio" name="ship" value="' +
          code +
          '"' +
          (code === ship ? " checked" : "") +
          " />" +
          "<span>" +
          s.label +
          "</span>" +
          '<span class="ship-price">' +
          money(s.price) +
          "</span>" +
          "</label>"
        );
      })
      .join("");

    mount.innerHTML =
      '<div class="cart-layout">' +
      '<div class="cart-items">' +
      "<h1>Your bag</h1>" +
      rows +
      "</div>" +
      '<aside class="cart-summary card-soft">' +
      "<h2>Summary</h2>" +
      '<div class="summary-row"><span>Subtotal</span><span data-summary-subtotal></span></div>' +
      '<div class="summary-ship"><p class="eyebrow">Shipping</p>' +
      shipOptions +
      "</div>" +
      '<div class="summary-row summary-total"><span>Total</span><span data-summary-total></span></div>' +
      '<button class="btn btn-primary btn-shine" type="button" data-checkout>Checkout</button>' +
      '<p class="muted summary-note">Checkout is disabled in this preview. Prices are approximate in your selected currency.</p>' +
      "</aside>" +
      "</div>";

    updateSummary();
  }

  function updateSummary() {
    var mount = document.querySelector("[data-cart-page]");
    if (!mount) return;
    var sub = subtotal();
    var ship = SHIPPING[readShip()] || SHIPPING.standard;
    var subEl = mount.querySelector("[data-summary-subtotal]");
    var totEl = mount.querySelector("[data-summary-total]");
    if (subEl) subEl.textContent = money(sub);
    if (totEl) totEl.textContent = money(sub + ship.price);
  }

  function closest(node, sel) {
    while (node && node.nodeType !== 1) node = node.parentNode;
    return node && node.closest ? node.closest(sel) : null;
  }

  // Event delegation for all cart interactions.
  document.addEventListener("click", function (e) {
    var t = closest(e.target, "[data-add-to-cart],[data-cart-remove],[data-cart-inc],[data-cart-dec],[data-checkout]");
    if (!t) return;

    if (t.hasAttribute("data-add-to-cart")) {
      var qtyInput = document.querySelector("[data-qty-input]");
      var qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
      add(t.getAttribute("data-add-to-cart"), qty);
      var product = window.LUMEN_PRODUCTS.byId(t.getAttribute("data-add-to-cart"));
      toast((product ? product.name : "Item") + " added to bag");
      return;
    }
    if (t.hasAttribute("data-cart-remove")) {
      remove(t.getAttribute("data-cart-remove"));
      renderCartPage();
      return;
    }
    if (t.hasAttribute("data-cart-inc")) {
      var idInc = t.getAttribute("data-cart-inc");
      setQty(idInc, (read()[idInc] || 1) + 1);
      renderCartPage();
      return;
    }
    if (t.hasAttribute("data-cart-dec")) {
      var idDec = t.getAttribute("data-cart-dec");
      setQty(idDec, (read()[idDec] || 1) - 1);
      renderCartPage();
      return;
    }
    if (t.hasAttribute("data-checkout")) {
      toast("Checkout isn't live in this preview yet.");
      return;
    }
  });

  document.addEventListener("change", function (e) {
    if (e.target && e.target.name === "ship") {
      writeShip(e.target.value);
      updateSummary();
    }
  });

  document.addEventListener("lumen:currency", function () {
    renderCartPage();
  });

  window.LUMEN_CART = {
    items: items,
    count: count,
    subtotal: subtotal,
    add: add,
    setQty: setQty,
    remove: remove,
    clear: clear
  };

  document.addEventListener("DOMContentLoaded", function () {
    updateBadge();
    renderCartPage();
  });
})();
