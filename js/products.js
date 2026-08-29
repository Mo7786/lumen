/*
 * LUMEN product catalog.
 * Single source of truth for all pages. Prices are USD.
 * Exposed globally as window.LUMEN_PRODUCTS with a small lookup API.
 */
(function () {
  "use strict";

  var CATEGORIES = [
    { id: "devices", label: "Devices" },
    { id: "face", label: "Face tools" },
    { id: "cleansing", label: "Cleansing" },
    { id: "hair", label: "Hair" },
    { id: "makeup", label: "Makeup" },
    { id: "kits", label: "Kits" }
  ];

  var PRODUCTS = [
    {
      id: "tool-led",
      name: "LED Mini Face Mask",
      category: "devices",
      price: 98.99,
      accent: "#67e8f9",
      featured: true,
      badge: "Hero",
      short: "Multi-color LED sessions at home, powered over USB.",
      description:
        "A lightweight at-home LED mask with multiple color modes and simple timed sessions. Follow the included timing guide and keep sessions short to start.",
      materials: "ABS shell, silicone face seal, USB-C cable",
      use: "Charge fully, pick a color mode, and follow the included session length. Wipe the inside with a soft dry cloth after use.",
      box: ["LED mask", "USB-C cable", "Quick-start card"]
    },
    {
      id: "tool-wand",
      name: "LED Therapy Wand",
      category: "devices",
      price: 54.0,
      accent: "#5eead4",
      short: "Handheld LED wand for targeted glow routines.",
      description:
        "A pocket-size LED wand with a warm and cool light mode for quick, targeted sessions. A cosmetic accessory — not a medical device.",
      materials: "Aluminium body, glass lens, USB-C",
      use: "Glide slowly over clean skin for the recommended time. Charge with the supplied cable only.",
      box: ["LED wand", "USB-C cable", "Guide"]
    },
    {
      id: "tool-hydra",
      name: "Hydra Micro Stamp",
      category: "devices",
      price: 32.0,
      accent: "#a5b4fc",
      short: "Gentle micro-stamp for serum layering.",
      description:
        "A fine micro-stamp for pressing serums into the surface of the skin. For personal use only — do not share, and sanitize before and after every use.",
      materials: "Stainless tips, ABS handle",
      use: "Sanitize, press gently in small sections, then apply your serum. Store clean and dry.",
      box: ["Micro stamp", "Cap", "Hygiene card"]
    },
    {
      id: "tool-eye",
      name: "Warm Eye Massager",
      category: "devices",
      price: 46.0,
      accent: "#7dd3fc",
      short: "Gentle warmth and vibration for the eye area.",
      description:
        "A soft, warming massager for the delicate eye area with a light vibration mode. Keep sessions short and comfortable.",
      materials: "Silicone tips, ABS body, USB-C",
      use: "Charge, choose a mode, and move gently around the orbital bone — never on the eyelid.",
      box: ["Eye massager", "USB-C cable", "Guide"]
    },
    {
      id: "tool-gua",
      name: "Electric Gua Sha",
      category: "face",
      price: 39.99,
      accent: "#5eead4",
      featured: true,
      badge: "Popular",
      short: "Warming, vibrating gua sha for a guided facial routine.",
      description:
        "A modern take on the classic gua sha with gentle warmth and vibration. Always use with a slip (oil or cream) and work upward and outward.",
      materials: "Zinc alloy head, ABS handle, USB-C",
      use: "Apply a slip, warm the head, then sweep upward and outward. Rinse the head and dry after use.",
      box: ["Electric gua sha", "USB-C cable", "Sample slip", "Guide"]
    },
    {
      id: "tool-ice-roller",
      name: "Ice Face Roller",
      category: "face",
      price: 24.0,
      accent: "#67e8f9",
      featured: true,
      short: "Cooling roller to refresh and de-puff.",
      description:
        "A gel-core roller you chill in the freezer for a cooling morning refresh. Do not use on broken or irritated skin.",
      materials: "Gel core, ABS roller, TPR handle",
      use: "Freeze for a few hours, then roll gently over clean skin. Wipe dry and return to the freezer.",
      box: ["Ice roller", "Storage sleeve"]
    },
    {
      id: "tool-ice-globes",
      name: "Ice Globes (Pair)",
      category: "face",
      price: 28.0,
      accent: "#7dd3fc",
      short: "A pair of cooling glass globes for facial massage.",
      description:
        "Two glass globes filled with cooling fluid for a soothing facial massage. Chill before use and handle with care.",
      materials: "Borosilicate glass, cooling fluid",
      use: "Chill in the fridge, then glide over clean skin. Do not freeze solid or drop.",
      box: ["2 ice globes", "Protective pouch"]
    },
    {
      id: "tool-jade",
      name: "Jade Roller",
      category: "face",
      price: 18.0,
      accent: "#86efac",
      short: "Classic dual-ended stone roller.",
      description:
        "A traditional dual-ended stone roller for a calming facial routine. Natural stone patterning varies piece to piece.",
      materials: "Natural stone, metal frame",
      use: "Use with a slip, roll upward and outward, rinse and store dry.",
      box: ["Jade roller"]
    },
    {
      id: "tool-stone-gua",
      name: "Stone Gua Sha",
      category: "face",
      price: 16.0,
      accent: "#a7f3d0",
      short: "Hand-cut stone gua sha for contouring strokes.",
      description:
        "A hand-cut stone gua sha shaped for jaw, cheek, and brow strokes. Always use with a slip and never drag on dry skin.",
      materials: "Natural stone",
      use: "Apply a slip and sweep upward. Rinse after use and store dry.",
      box: ["Stone gua sha", "Pouch"]
    },
    {
      id: "tool-silicone",
      name: "Silicone Cleansing Brush",
      category: "cleansing",
      price: 22.0,
      accent: "#5eead4",
      short: "Soft silicone brush for a gentle daily cleanse.",
      description:
        "A soft silicone cleansing brush with fine bristles for a gentle daily cleanse. Rinse and air-dry after every use.",
      materials: "Medical-grade silicone, ABS, USB-C",
      use: "Add cleanser, move in small circles, rinse the brush, and air-dry.",
      box: ["Cleansing brush", "USB-C cable"]
    },
    {
      id: "tool-scalp",
      name: "Silicone Scalp Brush",
      category: "cleansing",
      price: 14.0,
      accent: "#67e8f9",
      short: "Silicone scalp brush for shampoo days.",
      description:
        "A grippy silicone scalp brush that works lather through the hair for a refreshing wash-day massage.",
      materials: "Silicone, ABS handle",
      use: "Use on a lathered scalp in gentle circles, then rinse and dry.",
      box: ["Scalp brush"]
    },
    {
      id: "tool-pad",
      name: "Exfoliating Silicone Pad",
      category: "cleansing",
      price: 12.0,
      accent: "#99f6e4",
      short: "Reusable dual-texture cleansing pad.",
      description:
        "A reusable dual-texture silicone pad — one soft side, one lightly textured side — for a gentle cleanse.",
      materials: "Silicone",
      use: "Use with cleanser, rinse well, and air-dry. Replace when the surface wears.",
      box: ["2 silicone pads"]
    },
    {
      id: "tool-heatless",
      name: "Heatless Curl Set",
      category: "hair",
      price: 16.0,
      accent: "#a5b4fc",
      short: "Overnight heatless curl rod and clips.",
      description:
        "A soft curl rod with clips to shape waves overnight — no heat needed. Results vary by hair type and length.",
      materials: "Satin-wrapped foam, clips",
      use: "Wrap damp-to-dry hair around the rod, secure with clips, and unwind in the morning.",
      box: ["Curl rod", "2 clips", "Scrunchie"]
    },
    {
      id: "tool-scalp-massager",
      name: "Scalp Massager Pro",
      category: "hair",
      price: 19.0,
      accent: "#7dd3fc",
      short: "Vibrating scalp massager for wash day.",
      description:
        "A handheld vibrating scalp massager for a relaxing wash-day routine. Use on wet or dry hair.",
      materials: "Silicone nubs, ABS body, USB-C",
      use: "Move slowly across the scalp in sections. Rinse the head and dry after use.",
      box: ["Scalp massager", "USB-C cable"]
    },
    {
      id: "tool-detangle",
      name: "Detangling Wet Brush",
      category: "hair",
      price: 13.0,
      accent: "#86efac",
      short: "Flexible bristles for wet or dry detangling.",
      description:
        "A flexible-bristle brush that glides through knots on wet or dry hair with less tugging.",
      materials: "Nylon bristles, ABS handle",
      use: "Start at the ends and work up to the roots. Rinse occasionally and air-dry.",
      box: ["Detangling brush"]
    },
    {
      id: "tool-compact",
      name: "Lighted Travel Compact",
      category: "makeup",
      price: 26.0,
      accent: "#67e8f9",
      short: "Rechargeable mirror with soft LED ring.",
      description:
        "A slim rechargeable compact mirror with a soft LED ring and 1x/3x sides for makeup on the go.",
      materials: "Glass mirror, ABS, USB-C",
      use: "Charge, flip open, and choose your magnification. Wipe the mirror with a soft cloth.",
      box: ["Compact mirror", "USB-C cable"]
    },
    {
      id: "tool-sponge",
      name: "Blender Sponge Set",
      category: "makeup",
      price: 11.0,
      accent: "#f0abfc",
      short: "Latex-free blending sponges (set of 3).",
      description:
        "A set of three latex-free sponges for blending base products to a soft finish. Wash regularly for hygiene.",
      materials: "Latex-free foam",
      use: "Dampen, bounce to blend, wash after use, and air-dry fully.",
      box: ["3 sponges"]
    },
    {
      id: "tool-brow",
      name: "Precision Brow Blade (3-pack)",
      category: "makeup",
      price: 9.0,
      accent: "#fca5a5",
      short: "Fine brow tidy-up blades with safety comb.",
      description:
        "Three precision brow blades with a safety comb for tidying stray hairs between appointments. Personal use only.",
      materials: "Stainless blade, ABS handle",
      use: "Hold skin taut and sweep gently at a low angle. Replace blades when dull.",
      box: ["3 brow blades"]
    },
    {
      id: "tool-lash",
      name: "Heated Lash Curler",
      category: "makeup",
      price: 21.0,
      accent: "#fbbf24",
      short: "Gentle heated curler for a lasting lift.",
      description:
        "A slim heated lash curler that warms to give lashes a soft, lasting lift. Test warmth on skin before use.",
      materials: "Silicone comb, ABS body, USB-C",
      use: "Warm up, comb through lashes from base to tip, and hold briefly at the root.",
      box: ["Heated lash curler", "USB-C cable"]
    },
    {
      id: "kit-stone",
      name: "Stone Ritual Kit",
      category: "kits",
      price: 44.0,
      accent: "#5eead4",
      featured: true,
      badge: "Kit",
      short: "Roller, gua sha, and a slip to start a stone routine.",
      description:
        "A starter kit pairing a stone roller and gua sha with a sample slip and a simple routine card — everything to begin a calming stone ritual.",
      materials: "Natural stone tools, sample slip, cotton pouch",
      use: "Apply the slip, roll and sweep upward and outward, then rinse and store the tools dry.",
      box: ["Stone roller", "Stone gua sha", "Sample slip", "Pouch", "Routine card"]
    }
  ];

  function byId(id) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === id) return PRODUCTS[i];
    }
    return null;
  }

  function categoryLabel(id) {
    for (var i = 0; i < CATEGORIES.length; i++) {
      if (CATEGORIES[i].id === id) return CATEGORIES[i].label;
    }
    return id;
  }

  function inCategory(id) {
    return PRODUCTS.filter(function (p) {
      return p.category === id;
    });
  }

  function featured() {
    var list = PRODUCTS.filter(function (p) {
      return p.featured;
    });
    return list.length ? list : PRODUCTS.slice(0, 4);
  }

  window.LUMEN_PRODUCTS = {
    all: PRODUCTS,
    categories: CATEGORIES,
    byId: byId,
    categoryLabel: categoryLabel,
    inCategory: inCategory,
    featured: featured
  };
})();
