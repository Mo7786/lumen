/*
 * LUMEN currency helper.
 * Formats every [data-money] element (value = USD amount) and supports a
 * lightweight preview currency switch. Rates are approximate, for display only.
 * Exposed as window.LUMEN_MONEY.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "lumen-currency";

  // Approximate display rates relative to USD. Preview only.
  var CURRENCIES = {
    USD: { symbol: "$", rate: 1, label: "USD" },
    EUR: { symbol: "\u20ac", rate: 0.92, label: "EUR" },
    GBP: { symbol: "\u00a3", rate: 0.79, label: "GBP" },
    CAD: { symbol: "C$", rate: 1.37, label: "CAD" },
    AUD: { symbol: "A$", rate: 1.52, label: "AUD" }
  };

  var current = "USD";
  try {
    var stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && CURRENCIES[stored]) current = stored;
  } catch (e) {}

  function meta() {
    return CURRENCIES[current] || CURRENCIES.USD;
  }

  function format(usd) {
    var value = Number(usd);
    if (!isFinite(value)) value = 0;
    var m = meta();
    var converted = value * m.rate;
    return m.symbol + converted.toFixed(2);
  }

  function refresh(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll("[data-money]");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = format(nodes[i].getAttribute("data-money"));
    }
  }

  function setCurrency(code) {
    if (!CURRENCIES[code]) return;
    current = code;
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch (e) {}
    refresh();
    document.dispatchEvent(
      new CustomEvent("lumen:currency", { detail: { code: code } })
    );
  }

  window.LUMEN_MONEY = {
    format: format,
    refresh: refresh,
    setCurrency: setCurrency,
    list: CURRENCIES,
    get code() {
      return current;
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    refresh();
  });
})();
