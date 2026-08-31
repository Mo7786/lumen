/*
 * LUMEN product visuals.
 * Uses the edited JPEGs in shopify-copy-paste/jpegs/, with a gradient
 * fallback if a file is missing. Exposed as window.LUMEN_PHOTOS.
 */
(function () {
  "use strict";

  var PHOTO_DIR = "shopify-copy-paste/jpegs/";

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

  function images(product) {
    if (product && product.images && product.images.length) return product.images;
    if (product && product.id) return [product.id + ".jpg"];
    return [];
  }

  function src(file) {
    return PHOTO_DIR + file;
  }

  function fallbackMarkup(product, extraClass) {
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

  function imgTag(product, file) {
    return (
      '<img class="product-visual__img" src="' +
      src(file) +
      '" alt="' +
      String(product.name || "LUMEN tool").replace(/"/g, "&quot;") +
      '" loading="lazy" decoding="async" />'
    );
  }

  function markup(product, extraClass) {
    var files = images(product);
    if (!files.length) return fallbackMarkup(product, extraClass);
    return (
      '<div class="product-visual has-visual has-photo ' +
      (extraClass || "") +
      '">' +
      imgTag(product, files[0]) +
      "</div>"
    );
  }

  function gallery(product, extraClass) {
    var files = images(product);
    if (files.length < 2) return markup(product, extraClass || "pdp__visual");
    var slides = files
      .map(function (file, i) {
        return (
          '<figure class="pdp-slide' +
          (i === 0 ? " is-active" : "") +
          '" data-slide="' +
          i +
          '">' +
          imgTag(product, file) +
          "</figure>"
        );
      })
      .join("");
    return (
      '<div class="pdp-gallery product-visual has-visual has-photo ' +
      (extraClass || "pdp__visual") +
      '" data-gallery>' +
      '<div class="pdp-gallery__track">' +
      slides +
      "</div>" +
      '<button class="pdp-gallery__btn pdp-gallery__btn--prev" type="button" data-gallery-prev aria-label="Previous image">\u2039</button>' +
      '<button class="pdp-gallery__btn pdp-gallery__btn--next" type="button" data-gallery-next aria-label="Next image">\u203a</button>' +
      '<p class="pdp-gallery__count" data-gallery-count>1 / ' +
      files.length +
      "</p>" +
      "</div>"
    );
  }

  function paint(el, product) {
    if (!el || !product) return;
    el.outerHTML = markup(product, el.className);
  }

  function hydratePlaceholders(root) {
    var scope = root || document;
    var lookup = window.LUMEN_PRODUCTS;
    if (!lookup) return;
    var nodes = scope.querySelectorAll("[data-photo-id]");
    for (var i = 0; i < nodes.length; i++) {
      var product = lookup.byId(nodes[i].getAttribute("data-photo-id"));
      if (!product) continue;
      var files = images(product);
      nodes[i].classList.add("product-visual", "has-visual");
      if (files.length) {
        nodes[i].classList.add("has-photo");
        nodes[i].innerHTML = imgTag(product, files[0]);
      } else {
        nodes[i].style.background = background(product);
        nodes[i].innerHTML =
          '<span class="product-visual__mark" aria-hidden="true">' +
          initials(product.name) +
          "</span>";
      }
    }
  }

  window.LUMEN_PHOTOS = {
    markup: markup,
    gallery: gallery,
    paint: paint,
    background: background,
    hydratePlaceholders: hydratePlaceholders,
    images: images
  };

  document.addEventListener("DOMContentLoaded", function () {
    hydratePlaceholders();
  });
})();
