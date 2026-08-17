/*
 * LUMEN product visuals.
 * The catalog ships without bitmap photography, so product imagery is rendered
 * as on-brand gradient panels keyed to each product's accent color. This keeps
 * the repo text-only (no binary assets) and avoids broken <img> requests.
 * Exposed as window.LUMEN_PHOTOS.
 */
(function () {
  "use strict";

  function hexToRgb(hex) {
    var h = String(hex || "#5eead4").replace("#", "");
    if (h.length === 3) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }
    var n = parseInt(h, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function rgba(hex, a) {
    var c = hexToRgb(hex);
    return "rgba(" + c.r + "," + c.g + "," + c.b + "," + a + ")";
  }

  // Deterministic background so a product always renders the same panel.
  function background(product) {
    var accent = (product && product.accent) || "#5eead4";
    return (
      "radial-gradient(120% 120% at 22% 18%, " +
      rgba(accent, 0.55) +
      " 0%, rgba(7,9,12,0) 55%)," +
      "radial-gradient(120% 120% at 82% 88%, " +
      rgba(accent, 0.35) +
      " 0%, rgba(7,9,12,0) 60%)," +
      "linear-gradient(150deg, #0c1118 0%, #070a0e 100%)"
    );
  }

  function initials(name) {
    var parts = String(name || "LUMEN").trim().split(/\s+/).slice(0, 2);
    return parts
      .map(function (p) {
        return p.charAt(0).toUpperCase();
      })
      .join("");
  }

  // Fill a placeholder element with the product's visual.
  function paint(el, product) {
    if (!el || !product) return;
    el.style.setProperty("--accent", product.accent || "#5eead4");
    el.style.background = background(product);
    el.classList.add("has-visual");
    if (!el.querySelector(".product-visual__mark")) {
      var mark = document.createElement("span");
      mark.className = "product-visual__mark";
      mark.textContent = initials(product.name);
      mark.setAttribute("aria-hidden", "true");
      el.appendChild(mark);
    }
  }

  // Return HTML string for a product visual panel (used by cards / detail).
  function markup(product, extraClass) {
    var accent = (product && product.accent) || "#5eead4";
    return (
      '<div class="product-visual has-visual ' +
      (extraClass || "") +
      '" style="--accent:' +
      accent +
      ";background:" +
      background(product) +
      '">' +
      '<span class="product-visual__mark" aria-hidden="true">' +
      initials(product && product.name) +
      "</span>" +
      "</div>"
    );
  }

  function hydratePlaceholders(root) {
    var scope = root || document;
    var lookup = window.LUMEN_PRODUCTS;
    if (!lookup) return;

    // Elements that opt in explicitly.
    var nodes = scope.querySelectorAll("[data-photo-id]");
    for (var i = 0; i < nodes.length; i++) {
      var product = lookup.byId(nodes[i].getAttribute("data-photo-id"));
      if (product) paint(nodes[i], product);
    }

    // Defensive: replace any legacy product <img> so nothing 404s.
    var imgs = scope.querySelectorAll('img[src*="images/products/"]');
    for (var j = 0; j < imgs.length; j++) {
      var img = imgs[j];
      var id = (img.getAttribute("src") || "")
        .replace(/^.*images\/products\//, "")
        .replace(/\.[a-z0-9]+$/i, "");
      var p = lookup.byId(id) || { name: img.alt, accent: "#5eead4" };
      var div = document.createElement("div");
      div.className = "product-visual has-visual";
      if (img.parentNode) img.parentNode.replaceChild(div, img);
      paint(div, p);
    }
  }

  window.LUMEN_PHOTOS = {
    markup: markup,
    paint: paint,
    background: background,
    hydratePlaceholders: hydratePlaceholders
  };

  document.addEventListener("DOMContentLoaded", function () {
    hydratePlaceholders();
  });
})();
