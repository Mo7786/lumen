/*
 * LUMEN shared layout.
 * Injects the site header (nav, currency switch, cart) and footer into the
 * [data-site-header] / [data-site-footer] placeholders on every page.
 */
(function () {
  "use strict";

  var NAV = [
    { href: "shop.html", label: "Shop" },
    { href: "about.html", label: "About" },
    { href: "science.html", label: "Tool care" },
    { href: "journal.html", label: "Journal" },
    { href: "faq.html", label: "FAQ" },
    { href: "contact.html", label: "Contact" }
  ];

  var LOGO =
    '<svg viewBox="0 0 32 32" width="28" height="28" role="img" aria-label="LUMEN" focusable="false">' +
    '<rect width="32" height="32" rx="8" fill="#07090c"/>' +
    '<circle cx="16" cy="16" r="9" fill="none" stroke="#5eead4" stroke-width="2"/>' +
    '<circle cx="16" cy="16" r="3.5" fill="#67e8f9"/>' +
    "</svg>";

  function currentFile() {
    var path = window.location.pathname.split("/").pop();
    return path || "index.html";
  }

  function headerMarkup() {
    var here = currentFile();
    var links = NAV.map(function (item) {
      var active = item.href === here ? ' aria-current="page"' : "";
      return '<a href="' + item.href + '"' + active + ">" + item.label + "</a>";
    }).join("");

    return (
      '<div class="container nav">' +
      '<a class="brand" href="index.html">' +
      LOGO +
      "<span>LUMEN</span>" +
      "</a>" +
      '<button class="nav-toggle" type="button" data-nav-toggle aria-label="Toggle menu" aria-expanded="false">' +
      '<span></span><span></span><span></span>' +
      "</button>" +
      '<nav class="nav-links" data-nav-links aria-label="Primary">' +
      links +
      "</nav>" +
      '<div class="nav-actions">' +
      '<label class="currency-picker">' +
      '<span class="sr-only">Currency</span>' +
      '<select data-currency aria-label="Currency"></select>' +
      "</label>" +
      '<a class="cart-link" href="cart.html" aria-label="Bag">' +
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>' +
      '<span class="cart-count" data-cart-count data-empty="true">0</span>' +
      "</a>" +
      "</div>" +
      "</div>"
    );
  }

  function footerMarkup() {
    var year = new Date().getFullYear();
    return (
      '<div class="container footer-grid">' +
      '<div class="footer-brand">' +
      '<a class="brand" href="index.html">' +
      LOGO +
      "<span>LUMEN</span></a>" +
      '<p class="muted">Glow tools and devices for simple at-home routines. Orders ship safely wrapped \u2014 not in a LUMEN-branded box.</p>' +
      "</div>" +
      '<div class="footer-col">' +
      "<h4>Shop</h4>" +
      '<a href="shop.html">All tools</a>' +
      '<a href="shop.html?category=devices">Devices</a>' +
      '<a href="shop.html?category=face">Face tools</a>' +
      '<a href="shop.html?category=kits">Kits</a>' +
      "</div>" +
      '<div class="footer-col">' +
      "<h4>Company</h4>" +
      '<a href="about.html">About</a>' +
      '<a href="journal.html">Journal</a>' +
      '<a href="science.html">Tool care</a>' +
      "</div>" +
      '<div class="footer-col">' +
      "<h4>Support</h4>" +
      '<a href="faq.html">FAQ</a>' +
      '<a href="shipping.html">Shipping &amp; returns</a>' +
      '<a href="contact.html">Contact</a>' +
      "</div>" +
      '<div class="footer-col">' +
      "<h4>Legal</h4>" +
      '<a href="privacy.html">Privacy</a>' +
      '<a href="terms.html">Terms</a>' +
      "</div>" +
      "</div>" +
      '<div class="container footer-base">' +
      "<span class=\"muted\">\u00a9 " +
      year +
      " LUMEN. Preview store \u2014 checkout is not live.</span>" +
      '<span class="muted">Beauty accessories, not medical devices.</span>' +
      "</div>"
    );
  }

  function populateCurrency() {
    var select = document.querySelector("[data-currency]");
    if (!select || !window.LUMEN_MONEY) return;
    var list = window.LUMEN_MONEY.list;
    var html = "";
    for (var code in list) {
      if (!Object.prototype.hasOwnProperty.call(list, code)) continue;
      html +=
        '<option value="' +
        code +
        '"' +
        (code === window.LUMEN_MONEY.code ? " selected" : "") +
        ">" +
        list[code].label +
        "</option>";
    }
    select.innerHTML = html;
    select.addEventListener("change", function () {
      window.LUMEN_MONEY.setCurrency(select.value);
    });
  }

  function wireMobileNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var header = document.querySelector(".site-header");
    if (!toggle || !header) return;
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    var links = document.querySelectorAll("[data-nav-links] a");
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function () {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    }
  }

  function init() {
    var header = document.querySelector("[data-site-header]");
    var footer = document.querySelector("[data-site-footer]");
    if (header) header.innerHTML = headerMarkup();
    if (footer) footer.innerHTML = footerMarkup();
    wireMobileNav();
  }

  // defer scripts run after parse, so the placeholders already exist.
  init();

  document.addEventListener("DOMContentLoaded", populateCurrency);
})();
