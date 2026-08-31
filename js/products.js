/*
 * LUMEN product catalog.
 * Matches the live Shopify store (20 glow tools). Prices are USD.
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
      "id": "tool-roller",
      "name": "Jade Dual Roller",
      "category": "face",
      "price": 28,
      "accent": "#5eead4",
      "short": "The OG cool-down.",
      "description": "The OG cool-down. A dual-head jade roller — big end for cheeks and forehead, small end for around the eyes — for that fresh, de-puffed morning feeling. Keep it in the fridge for an extra icy hit that helps your eye cream and moisturizer sink in. Pure tool, no formula, endlessly reusable.",
      "materials": "Natural jade, metal frame",
      "use": "Chill it in the fridge for a cooler feel. Glide the large head outward across cheeks, jaw and forehead; use the small head gently under the eyes. Roll for 2–3 minutes, then wipe dry.",
      "box": ["Jade dual roller"],
      "images": ["tool-roller.jpg", "tool-roller-2.jpg", "tool-roller-3.jpg", "tool-roller-4.jpg"]
    },
    {
      "id": "tool-mirror",
      "name": "LED Compact Mirror",
      "category": "makeup",
      "price": 29.95,
      "accent": "#f0abfc",
      "short": "Perfect light, anywhere.",
      "description": "Perfect light, anywhere. This foldable compact has a built-in LED ring for even, flattering light plus a magnified side for detail work — so your brows, liner and lipstick look right before you leave. Folds flat and slips into any bag.",
      "materials": "Glass mirror, ABS, USB-C",
      "use": "Charge it, then flip it open and switch on the LED ring. Use the standard side for full-face and the magnified side for detail. Wipe the lenses clean and fold flat to store.",
      "box": ["LED compact", "USB-C cable"],
      "images": ["tool-mirror.jpg", "tool-mirror-2.jpg"]
    },
    {
      "id": "tool-neck-led",
      "name": "LED Neck & Jaw Wand",
      "category": "devices",
      "price": 54.97,
      "accent": "#67e8f9",
      "short": "Give your neck the same love as your face.",
      "description": "Give your neck the same love as your face. This LED wand has a curved head shaped to hug the neck and jawline for short, relaxing upward glides — the step most routines forget. A feel-good beauty accessory for at-home massage, not a medical device.",
      "materials": "ABS body, LED head, USB-C",
      "use": "Apply a little cream or oil to your neck and jaw. Glide the curved head upward from collarbone to jaw. Keep sessions short, then wipe the head clean.",
      "box": ["LED neck & jaw wand", "USB-C cable", "Guide"],
      "images": ["tool-neck-led.jpg", "tool-neck-led-2.jpg"]
    },
    {
      "id": "tool-pads",
      "name": "Silicone Cleansing Scrubber",
      "category": "cleansing",
      "price": 15.95,
      "accent": "#99f6e4",
      "short": "Same silicone scrubber as Soft Silicone Face Brush — shop that listing instead.",
      "description": "This is the same soft silicone face scrubber as Soft Silicone Face Brush. We’ve merged them into one product so you don’t buy duplicates. Please shop Soft Silicone Face Brush.",
      "materials": "Soft silicone",
      "use": "Use the Soft Silicone Face Brush listing for the current photos and add-to-bag options.",
      "box": ["Product", "Guide"],
      "images": ["tool-pads.jpg"]
    },
    {
      "id": "tool-brow",
      "name": "Precision Brow Razor Set",
      "category": "makeup",
      "price": 15,
      "accent": "#f0abfc",
      "short": "Snatched brows and baby-smooth skin, on demand.",
      "description": "Snatched brows and baby-smooth skin, on demand. This multi-pack of precision razors tidies up brow shape and whisks away peach fuzz so makeup sits smoother. Keep a fresh one in every bag. Use light pressure on dry skin and swap them out often for safety.",
      "materials": "See product photos and included guide.",
      "use": "On clean, dry skin, hold the skin taut. Glide the razor at a low angle using light strokes. Cover the blade and replace with a fresh one regularly.",
      "box": ["Precision brow razors"],
      "images": ["tool-brow.jpg", "tool-brow-2.jpg"]
    },
    {
      "id": "tool-lash",
      "name": "Soft-Touch Lash Curler",
      "category": "makeup",
      "price": 17.49,
      "accent": "#f0abfc",
      "short": "Wide-awake eyes in one squeeze.",
      "description": "Wide-awake eyes in one squeeze. This rose-gold curler is shaped to hug the natural curve of your lash line for a lifted, fanned-out look that makes mascara pop. Cushioned grip, a gentle silicone pad, and spare pads included so it lasts.",
      "materials": "See product photos and included guide.",
      "use": "Before mascara, line the curler at the base of your lashes. Squeeze gently, then walk it out toward the tips. Swap in a fresh pad when the old one wears down.",
      "box": ["Soft-touch lash curler", "Replacement pads"],
      "images": ["tool-lash.jpg", "tool-lash-2.jpg"]
    },
    {
      "id": "tool-sponges",
      "name": "Makeup Sponge Set",
      "category": "makeup",
      "price": 14.95,
      "accent": "#f0abfc",
      "short": "Blend like a pro, on repeat.",
      "description": "Blend like a pro, on repeat. Soft teardrop sponges — flat edge for precision, rounded base for cheeks — that bounce foundation and concealer into a seamless, airbrushed finish. Dampen for a dewy look, or use dry for more coverage. Choose your pack size: 12, 20, 35 or 50.",
      "materials": "See product photos and included guide.",
      "use": "Dampen the sponge and squeeze out the excess water. Bounce (don't drag) product across the skin. Wash after use and let it fully air-dry.",
      "box": ["12 makeup sponges"],
      "images": ["tool-sponges.jpg", "tool-sponges-2.jpg"]
    },
    {
      "id": "tool-scalp-comb",
      "name": "Electric LED Scalp Massager",
      "category": "devices",
      "price": 79.99,
      "accent": "#67e8f9",
      "short": "Scalp care that feels like a treat.",
      "description": "Scalp care that feels like a treat. This electric massager pairs moving nodes with red and blue light modes for a genuinely relaxing scalp session at home — a lovely way to wind down after a long day. A beauty accessory for at-home massage, not a medical treatment; just follow the manual.",
      "materials": "ABS body, chrome nodes, USB-C",
      "use": "Part dry or damp hair so the nodes reach your scalp. Switch on, pick a mode, and move slowly across the scalp. Keep sessions short, then wipe the nodes clean.",
      "box": ["LED scalp massager", "USB-C cable", "Guide"],
      "images": ["tool-scalp-comb.jpg"]
    },
    {
      "id": "tool-steamer",
      "name": "Nano Facial Mister",
      "category": "face",
      "price": 28.5,
      "accent": "#5eead4",
      "short": "A pocket-sized hydration hit.",
      "description": "A pocket-sized hydration hit. This nano mister throws an ultra-fine mist that lands soft on the skin — perfect for reviving makeup, cooling down, or a mid-afternoon refresh at your desk. Fill it with clean water, spritz, and go. Keep a comfy distance from your eyes.",
      "materials": "ABS body, water tank, USB-C",
      "use": "Fill the tank with clean water. Hold it about a hand's width away and mist over your face or makeup. Empty and dry the tank between uses.",
      "box": ["Nano facial mister", "USB-C cable"],
      "images": ["tool-steamer.jpg", "tool-steamer-2.jpg", "tool-steamer-3.jpg"]
    },
    {
      "id": "tool-eye-wand",
      "name": "LED Contour Beauty Wand",
      "category": "devices",
      "price": 52.49,
      "accent": "#67e8f9",
      "short": "The glow wand your FYP won't stop talking about.",
      "description": "The glow wand your FYP won't stop talking about. A handheld red-light-style wand for short, relaxing passes around the eyes, cheeks and lips — the kind of quick ritual that fits between meetings. Travel-friendly and easy to hold. A beauty accessory, not a medical device; just follow the manual.",
      "materials": "Metal handle, LED head, USB-C",
      "use": "Start on clean skin with a little serum or moisturizer. Switch on and glide slowly around the eyes, cheeks and mouth. Keep sessions short as the guide suggests, then wipe the head clean.",
      "box": ["LED contour wand", "USB-C cable", "Guide"],
      "images": ["tool-eye-wand.jpg", "tool-eye-wand-2.jpg"]
    },
    {
      "id": "kit-glow-tools",
      "name": "Glow Tools Starter",
      "category": "kits",
      "price": 50.8,
      "accent": "#5eead4",
      "badge": "Kit",
      "short": "Your glow starter pack: cleanse with the soft silicone brush, then de-puff with the ice roller.",
      "description": "Your glow starter pack: cleanse with the soft silicone brush, then de-puff with the ice roller. Two tools, one routine.",
      "materials": "See product photos and included guide.",
      "use": "Cleanse with the silicone brush and your favorite cleanser. Rinse, then roll the frozen ice roller across face and neck to de-puff. Rinse each tool and let them dry.",
      "box": ["Ice roller", "Silicone face brush"],
      "images": ["kit-glow-tools.jpg"]
    },
    {
      "id": "kit-stone",
      "name": "Stone Facial Gift Set",
      "category": "kits",
      "price": 49.95,
      "accent": "#5eead4",
      "featured": true,
      "badge": "Kit",
      "short": "Two icons, one ritual.",
      "description": "Two icons, one ritual. Classic stone tools (not the electric gua sha) for sculpt-and-de-puff: sweep with the gua sha, roll to refresh. Gift-ready pair.",
      "materials": "See product photos and included guide.",
      "use": "Apply a facial oil so the stones glide smoothly. Sweep the gua sha upward and outward along the jaw and cheeks. Finish with the roller to cool and de-puff, then wipe both dry.",
      "box": ["Dual roller", "Stone gua sha", "Guide"],
      "images": ["kit-stone.jpg", "kit-stone-2.jpg", "kit-stone-3.jpg", "kit-stone-4.jpg"]
    },
    {
      "id": "tool-pore",
      "name": "Ultra Bubble Pore Cleanser",
      "category": "devices",
      "price": 54.95,
      "accent": "#67e8f9",
      "short": "That satisfying deep-clean feeling, at home.",
      "description": "That satisfying deep-clean feeling, at home. This handheld soft cleanser has a 3-speed adjustment so you can match the intensity to how your skin feels — gentler for dry days, mid for normal, stronger for oilier areas. It helps unclog the look of pores, lift dry surface skin, and support clearer-looking skin when used with your usual cleanser. Start on the lowest setting and keep it moving. A beauty tool, not a medical device.",
      "materials": "ABS body, silicone head, USB-C",
      "use": "Cleanse and lightly dampen your skin first. Start on the mildest speed and glide — never hold it in one spot. Rinse the head and let it dry.",
      "box": ["Bubble pore cleanser", "USB-C cable", "Guide"],
      "images": ["tool-pore.jpg", "tool-pore-2.jpg"]
    },
    {
      "id": "tool-derma",
      "name": "Hydra Stamp 0.25mm",
      "category": "devices",
      "price": 26.97,
      "accent": "#67e8f9",
      "short": "A gentle 0.25mm cosmetic stamp for fans of a serious skincare routine.",
      "description": "A gentle 0.25mm cosmetic stamp for fans of a serious skincare routine. The fine-tip head is designed to prep the skin's surface so your favorite serum feels like it goes further. This is a personal-use cosmetic tool — not a medical device. Hygiene comes first: sanitize before and after every use, never share, keep the cap on for storage, and skip broken, irritated or infected skin.",
      "materials": "Stainless tips, ABS handle",
      "use": "Sanitize the head and start on clean, dry skin. Press gently across the area with light pressure only, following the included guide. Apply your serum, then sanitize and re-cap the head for storage.",
      "box": ["Hydra stamp 0.25mm", "Cap", "Hygiene card"],
      "images": ["tool-derma.jpg", "tool-derma-2.jpg"]
    },
    {
      "id": "tool-scalp",
      "name": "Heatless Curl Set",
      "category": "hair",
      "price": 17.95,
      "accent": "#a5b4fc",
      "short": "Soft curls, zero heat damage.",
      "description": "Soft curls, zero heat damage. A flexible satin curling rod plus two matching scrunchies and a claw clip — wrap, sleep (or wait a few hours), and wake up with soft waves. No hot tools, no burn risk, and the satin is gentle on hair. Pick your colour; set includes the rod, 2 scrunchies, and 1 clip.",
      "materials": "Satin-wrapped foam, clips",
      "use": "Clip the rod at the crown, then wrap dry or slightly damp hair around each side. Secure the ends with the scrunchies and leave in for a few hours or overnight. Unwrap gently and loosen with fingers — no heat needed.",
      "box": ["Curl rod", "2 scrunchies", "Claw clip"],
      "images": ["tool-scalp.jpg", "tool-scalp-2.jpg", "tool-scalp-3.jpg", "tool-scalp-4.jpg", "tool-scalp-5.jpg", "tool-scalp-6.jpg", "tool-scalp-7.jpg", "tool-scalp-8.jpg", "tool-scalp-9.jpg"]
    },
    {
      "id": "tool-ice-roller",
      "name": "Ice Face Roller",
      "category": "face",
      "price": 24.49,
      "accent": "#5eead4",
      "featured": true,
      "short": "The freezer beauty hack that actually feels amazing.",
      "description": "The freezer beauty hack that actually feels amazing. Fill the mold, freeze it, and roll cool relief across your face, under-eyes and neck for an instant wake-up-and-de-puff moment. Refillable and reusable, so there's no melting mess. Skip broken or irritated skin.",
      "materials": "Silicone ice mold",
      "use": "Fill the mold with water and freeze until solid. Twist it onto the handle and roll gently over face, eyes and neck. Rinse the mold and pop it back in the freezer for next time.",
      "box": ["Ice roller mold"],
      "images": ["tool-ice-roller.jpg", "tool-ice-roller-2.jpg", "tool-ice-roller-3.jpg", "tool-ice-roller-4.jpg", "tool-ice-roller-5.jpg", "tool-ice-roller-6.jpg"]
    },
    {
      "id": "tool-ice-globes",
      "name": "Facial Cryo Sticks",
      "category": "face",
      "price": 36.95,
      "accent": "#5eead4",
      "short": "Facialist-style contour, minus the appointment.",
      "description": "Facialist-style contour, minus the appointment. A set of 2 stainless-steel Facial Cryo Sticks with cool liquid inside and white handles — teardrop heads that hold temperature so every pass over cheeks, jaw and brows feels like a mini spa moment. For cold: freeze them. For hot: warm them in hot water (not boiling). Run one cool and one warm for contrast, or use both the same way. Ships as a set of 2.",
      "materials": "Stainless steel, cooling fluid",
      "use": "Cold: place the sticks in the freezer until chilled. Hot: warm them in hot (not boiling) water. Apply a little oil or moisturizer, then sweep each head outward and up along cheeks, jaw and brows. Wipe the heads dry after your session.",
      "box": ["2 cryo sticks"],
      "images": ["tool-ice-globes.jpg", "tool-ice-globes-2.jpg"]
    },
    {
      "id": "tool-brush",
      "name": "Soft Silicone Face Brush",
      "category": "face",
      "price": 16,
      "accent": "#5eead4",
      "short": "Cleanse like you mean it — gently.",
      "description": "Cleanse like you mean it — gently. Soft silicone bristles turn your everyday cleanser into a satisfying little massage that helps lift away the day's makeup and grime, minus the harsh scrub. Same tool as a silicone face scrubber pad — one listing, one scrubber. It rinses clean in seconds and dries fast on its hang loop, so it stays fresher than a bristle brush.",
      "materials": "Soft silicone, ABS",
      "use": "Wet your face and the brush, then add your cleanser. Massage in small circles across the skin. Rinse, shake out, and hang to air-dry.",
      "box": ["Silicone face brush"],
      "images": ["tool-brush.jpg", "tool-brush-2.jpg", "tool-brush-5.jpg"]
    },
    {
      "id": "tool-led",
      "name": "LED Mini Face Mask",
      "category": "devices",
      "price": 98.99,
      "accent": "#67e8f9",
      "featured": true,
      "badge": "Hero",
      "short": "Press play on your at-home glow session.",
      "description": "Press play on your at-home glow session. This wireless LED mask sits over your whole face with multiple colour modes (red, blue, green and mixes), so you can relax hands-free through a full cycle — USB-C rechargeable, no cords. A feel-good beauty accessory for light sessions on the sofa, not a medical device. Just follow the included timing guide.",
      "materials": "ABS shell, silicone face seal, USB-C",
      "use": "Cleanse and fully dry your skin — no product underneath. Put on the mask, choose a color mode, and relax for the recommended time. Remove, then carry on with your serum and moisturizer.",
      "box": ["LED mask", "USB-C cable", "Quick-start card"],
      "images": ["tool-led.jpg", "tool-led-2.jpg"]
    },
    {
      "id": "tool-gua",
      "name": "Electric Gua Sha Massager",
      "category": "devices",
      "price": 47.95,
      "accent": "#67e8f9",
      "featured": true,
      "badge": "Popular",
      "short": "Your gua sha ritual, upgraded.",
      "description": "Your gua sha ritual, upgraded. This electric massager adds gentle warmth and vibration to the classic sculpting motion, so your serum glides and your evening wind-down feels like a mini at-home facial. In the box: the device, a comb-style accessory, and your choice of 1 meridian essential oil (default) or 3 oils — these ship as supplier accessory bottles, not LUMEN-branded formulas. A relaxing beauty tool for face and neck massage, not a medical device. Arrives safely wrapped — not in a LUMEN-branded box.",
      "materials": "Cream body, rose-gold accents, USB-C",
      "use": "Start on clean skin with a few drops of the included oil (or your own moisturizer). Switch on, pick a heat/vibration level, and glide upward and outward along jaw, cheeks and neck. Massage for 5–10 minutes, then wipe the heads clean and let them dry.",
      "box": ["Electric gua sha", "USB-C cable", "Guide"],
      "images": ["tool-gua.jpg", "tool-gua-2.jpg", "tool-gua-3.jpg"]
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
