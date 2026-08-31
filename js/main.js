/*
 * LUMEN page logic.
 * Renders the featured grid, shop (filters + search), and product detail pages,
 * plus reveal-on-scroll animations. Cart state lives in cart.js.
 */
(function () {
  "use strict";

  function money(usd) {
    return window.LUMEN_MONEY ? window.LUMEN_MONEY.format(usd) : "$" + Number(usd).toFixed(2);
  }

  function catalog() {
    return window.LUMEN_PRODUCTS;
  }

  function visual(product, extraClass) {
    return window.LUMEN_PHOTOS
      ? window.LUMEN_PHOTOS.markup(product, extraClass)
      : '<div class="product-visual"></div>';
  }

  function gallery(product) {
    return window.LUMEN_PHOTOS && window.LUMEN_PHOTOS.gallery
      ? window.LUMEN_PHOTOS.gallery(product, "pdp__visual")
      : visual(product, "pdp__visual");
  }

  function closest(node, sel) {
    while (node && node.nodeType !== 1) node = node.parentNode;
    return node && node.closest ? node.closest(sel) : null;
  }

  function productCard(product) {
    var href = "product.html?id=" + product.id;
    var badge = product.badge
      ? '<span class="product-card__badge">' + product.badge + "</span>"
      : "";
    return (
      '<article class="product-card reveal is-visible">' +
      '<a class="product-card__media" href="' +
      href +
      '" aria-label="' +
      product.name +
      '">' +
      visual(product) +
      badge +
      "</a>" +
      '<div class="product-card__body">' +
      '<a class="product-card__title" href="' +
      href +
      '">' +
      product.name +
      "</a>" +
      '<p class="product-card__cat muted">' +
      catalog().categoryLabel(product.category) +
      "</p>" +
      '<div class="product-card__foot">' +
      '<span class="price" data-money="' +
      product.price +
      '">' +
      money(product.price) +
      "</span>" +
      '<button class="btn btn-ghost btn-sm" type="button" data-add-to-cart="' +
      product.id +
      '">Add</button>' +
      "</div>" +
      "</div>" +
      "</article>"
    );
  }

  function renderFeatured() {
    var mount = document.querySelector("[data-featured]");
    if (!mount || !catalog()) return;
    mount.innerHTML = catalog()
      .featured()
      .map(productCard)
      .join("");
  }

  /* ---------- Shop ---------- */

  function renderShop() {
    var grid = document.querySelector("[data-shop-grid]");
    if (!grid || !catalog()) return;

    var filtersEl = document.querySelector("[data-filters]");
    var searchEl = document.querySelector("[data-search]");
    var countEl = document.querySelector("[data-result-count]");

    var params = new URLSearchParams(window.location.search);
    var state = {
      category: params.get("category") || "all",
      query: (params.get("q") || "").trim()
    };
    var cats = catalog().categories;
    if (state.category !== "all" && !catalog().inCategory(state.category).length) {
      state.category = "all";
    }

    if (filtersEl) {
      var buttons = [{ id: "all", label: "All" }].concat(cats);
      filtersEl.innerHTML = buttons
        .map(function (c) {
          return (
            '<button class="filter-btn" type="button" data-filter="' +
            c.id +
            '"' +
            (c.id === state.category ? ' aria-pressed="true"' : ' aria-pressed="false"') +
            ">" +
            c.label +
            "</button>"
          );
        })
        .join("");
    }

    if (searchEl && state.query) searchEl.value = state.query;

    function matches(p) {
      if (state.category !== "all" && p.category !== state.category) return false;
      if (!state.query) return true;
      var q = state.query.toLowerCase();
      return (
        p.name.toLowerCase().indexOf(q) !== -1 ||
        (p.short || "").toLowerCase().indexOf(q) !== -1 ||
        catalog().categoryLabel(p.category).toLowerCase().indexOf(q) !== -1
      );
    }

    function draw() {
      var list = catalog().all.filter(matches);
      if (list.length) {
        grid.innerHTML = list.map(productCard).join("");
      } else {
        grid.innerHTML =
          '<p class="empty-state muted">No tools match that search. Try another term or clear the filter.</p>';
      }
      if (countEl) {
        countEl.textContent =
          list.length + (list.length === 1 ? " product" : " products");
      }
      if (filtersEl) {
        var fbtns = filtersEl.querySelectorAll("[data-filter]");
        for (var i = 0; i < fbtns.length; i++) {
          fbtns[i].setAttribute(
            "aria-pressed",
            fbtns[i].getAttribute("data-filter") === state.category ? "true" : "false"
          );
        }
      }
      if (window.LUMEN_MONEY) window.LUMEN_MONEY.refresh(grid);
      observeReveals(grid);
      syncUrl();
    }

    function syncUrl() {
      var p = new URLSearchParams();
      if (state.category !== "all") p.set("category", state.category);
      if (state.query) p.set("q", state.query);
      var qs = p.toString();
      try {
        history.replaceState(null, "", qs ? "?" + qs : window.location.pathname);
      } catch (err) {}
    }

    if (filtersEl) {
      filtersEl.addEventListener("click", function (e) {
        var btn = closest(e.target, "[data-filter]");
        if (!btn) return;
        state.category = btn.getAttribute("data-filter");
        draw();
      });
    }
    if (searchEl) {
      searchEl.addEventListener("input", function () {
        state.query = searchEl.value.trim();
        draw();
      });
    }

    draw();
  }

  /* ---------- Product detail ---------- */

  function renderProduct() {
    var mount = document.querySelector("[data-product-page]");
    if (!mount || !catalog()) return;

    var id = new URLSearchParams(window.location.search).get("id");
    var product = id ? catalog().byId(id) : null;

    if (!product) {
      mount.innerHTML =
        '<div class="pdp-missing reveal is-visible">' +
        "<h1>Product not found</h1>" +
        '<p class="muted">That tool isn\u2019t in the catalog. Browse the full collection instead.</p>' +
        '<a class="btn btn-primary" href="shop.html">Shop all tools</a>' +
        "</div>";
      var related = document.querySelector("[data-related]");
      if (related) related.closest(".section").style.display = "none";
      document.title = "Product not found — LUMEN";
      return;
    }

    document.title = product.name + " — LUMEN";

    var box = (product.box || [])
      .map(function (b) {
        return "<li>" + b + "</li>";
      })
      .join("");

    mount.innerHTML =
      '<div class="pdp">' +
      '<div class="pdp__media">' +
      gallery(product) +
      "</div>" +
      '<div class="pdp__info reveal is-visible">' +
      '<p class="eyebrow">' +
      catalog().categoryLabel(product.category) +
      (product.badge ? " \u00b7 " + product.badge : "") +
      "</p>" +
      "<h1>" +
      product.name +
      "</h1>" +
      '<p class="pdp__price"><span class="price" data-money="' +
      product.price +
      '">' +
      money(product.price) +
      "</span></p>" +
      '<p class="pdp__desc">' +
      product.description +
      "</p>" +
      '<div class="pdp__buy">' +
      '<div class="qty-stepper">' +
      '<button class="qty-btn" type="button" data-qty-dec aria-label="Decrease quantity">\u2212</button>' +
      '<input class="qty-input" data-qty-input type="text" inputmode="numeric" value="1" aria-label="Quantity" />' +
      '<button class="qty-btn" type="button" data-qty-inc aria-label="Increase quantity">+</button>' +
      "</div>" +
      '<button class="btn btn-primary btn-shine" type="button" data-add-to-cart="' +
      product.id +
      '">Add to bag</button>' +
      "</div>" +
      '<dl class="pdp__specs">' +
      "<dt>Materials</dt><dd>" +
      product.materials +
      "</dd>" +
      "<dt>How to use</dt><dd>" +
      product.use +
      "</dd>" +
      (box ? "<dt>In the box</dt><dd><ul>" + box + "</ul></dd>" : "") +
      "</dl>" +
      '<p class="muted pdp__note">Beauty accessory, not a medical device. Follow the included guide.</p>' +
      "</div>" +
      "</div>";

    renderRelated(product);
    if (window.LUMEN_MONEY) window.LUMEN_MONEY.refresh(mount);
  }

  function renderRelated(product) {
    var mount = document.querySelector("[data-related]");
    if (!mount) return;
    var same = catalog()
      .inCategory(product.category)
      .filter(function (p) {
        return p.id !== product.id;
      });
    var others = catalog().all.filter(function (p) {
      return p.category !== product.category;
    });
    var list = same.concat(others).slice(0, 4);
    mount.innerHTML = list.map(productCard).join("");
    if (window.LUMEN_MONEY) window.LUMEN_MONEY.refresh(mount);
    observeReveals(mount);
  }

  /* ---------- Qty stepper ---------- */

  document.addEventListener("click", function (e) {
    var dec = closest(e.target, "[data-qty-dec]");
    var inc = closest(e.target, "[data-qty-inc]");
    if (!dec && !inc) return;
    var input = document.querySelector("[data-qty-input]");
    if (!input) return;
    var n = parseInt(input.value, 10) || 1;
    n = inc ? n + 1 : Math.max(1, n - 1);
    input.value = n;
  });

  document.addEventListener("input", function (e) {
    if (e.target && e.target.hasAttribute("data-qty-input")) {
      var cleaned = e.target.value.replace(/[^0-9]/g, "");
      e.target.value = cleaned;
    }
  });

  document.addEventListener("blur", function (e) {
    if (e.target && e.target.hasAttribute && e.target.hasAttribute("data-qty-input")) {
      if (!parseInt(e.target.value, 10)) e.target.value = "1";
    }
  }, true);

  /* ---------- Reveal on scroll ---------- */

  var observer = null;

  function observeReveals(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      for (var i = 0; i < nodes.length; i++) nodes[i].classList.add("is-visible");
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
      );
    }
    for (var j = 0; j < nodes.length; j++) observer.observe(nodes[j]);
  }

  // Safety net: if anything blocks the observer, reveal everything.
  window.addEventListener("load", function () {
    window.setTimeout(function () {
      var hidden = document.querySelectorAll(".reveal:not(.is-visible)");
      for (var i = 0; i < hidden.length; i++) hidden[i].classList.add("is-visible");
    }, 700);
  });

  /* ---------- PDP gallery ---------- */

  function stepGallery(galleryEl, dir) {
    var slides = galleryEl.querySelectorAll("[data-slide]");
    if (!slides.length) return;
    var current = 0;
    for (var i = 0; i < slides.length; i++) {
      if (slides[i].classList.contains("is-active")) current = i;
    }
    var next = (current + dir + slides.length) % slides.length;
    for (var j = 0; j < slides.length; j++) {
      slides[j].classList.toggle("is-active", j === next);
    }
    var count = galleryEl.querySelector("[data-gallery-count]");
    if (count) count.textContent = next + 1 + " / " + slides.length;
  }

  document.addEventListener("click", function (e) {
    var prev = closest(e.target, "[data-gallery-prev]");
    var next = closest(e.target, "[data-gallery-next]");
    if (!prev && !next) return;
    var galleryEl = closest(e.target, "[data-gallery]");
    if (!galleryEl) return;
    e.preventDefault();
    stepGallery(galleryEl, next ? 1 : -1);
  });

  /* ---------- Contact form ---------- */

  function wireContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (form.elements.name && form.elements.name.value) || "";
      var email = (form.elements.email && form.elements.email.value) || "";
      var message = (form.elements.message && form.elements.message.value) || "";
      var subject = "LUMEN — message from " + (name || "the site");
      var body =
        "Name: " + name + "\nEmail: " + email + "\n\n" + message;
      window.location.href =
        "mailto:hello@lumenlab.shop?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderFeatured();
    renderShop();
    renderProduct();
    wireContactForm();
    observeReveals(document);
  });
})();
