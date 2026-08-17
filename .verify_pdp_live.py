"""One-shot live PDP arrow + frame verify after deploy."""
import json
import re
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

URL = "https://9b5bbe-hg.myshopify.com/products/tool-gua?v=ready-3"
SHOT = Path(r"C:\Users\mubas\Projects\lumen-lab\.verify-pdp-live.png")

STATE = """() => {
  const gallery = document.querySelector('media-gallery');
  const host = gallery && (gallery.querySelector('slideshow-component > slideshow-slides')
    || gallery.querySelector('slideshow-slides'));
  const candidates = host
    ? [...host.querySelectorAll(':scope > slideshow-slide')]
    : [...document.querySelectorAll('media-gallery slideshow-slides > slideshow-slide')];
  const displayNotNone = candidates.filter(el => getComputedStyle(el).display !== 'none');
  const active = candidates.filter(el => el.classList.contains('lumen-slide-active'));
  const frame = host || gallery;
  const img = (candidates.find(el => el.classList.contains('lumen-slide-active')) || candidates[0] || {}).querySelector
    ? (candidates.find(el => el.classList.contains('lumen-slide-active')) || candidates[0]).querySelector('img')
    : null;
  let cornerHint = null;
  if (img) {
    const canvas = document.createElement('canvas');
    const w = Math.min(img.naturalWidth || 0, 64);
    const h = Math.min(img.naturalHeight || 0, 64);
    if (w && h) {
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      try {
        ctx.drawImage(img, 0, 0, w, h);
        const tl = ctx.getImageData(2, 2, 1, 1).data;
        const tr = ctx.getImageData(w - 3, 2, 1, 1).data;
        const bl = ctx.getImageData(2, h - 3, 1, 1).data;
        cornerHint = {
          tl: [tl[0], tl[1], tl[2]],
          tr: [tr[0], tr[1], tr[2]],
          bl: [bl[0], bl[1], bl[2]],
        };
      } catch (e) {
        cornerHint = { error: String(e) };
      }
    }
  }
  return {
    lumenIx: gallery ? gallery.dataset.lumenIx : null,
    presentation: gallery ? gallery.getAttribute('data-presentation') : null,
    arrowBtns: document.querySelectorAll('.lumen-arrows__btn').length,
    slideCount: candidates.length,
    displayNotNone: displayNotNone.length,
    activeCount: active.length,
    frameBg: frame ? getComputedStyle(frame).backgroundColor : null,
    galleryBg: gallery ? getComputedStyle(gallery).backgroundColor : null,
    lumenPdp: document.documentElement.classList.contains('lumen-pdp'),
    cornerHint,
  };
}"""


def is_cream(rgb):
    if not rgb or len(rgb) < 3:
        return False
    r, g, b = rgb[:3]
    return r > 220 and g > 210 and b > 200 and abs(r - g) < 30 and (r + g + b) / 3 > 215


def main():
    result = {}
    t0 = time.time()
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True, timeout=15000)
        page = browser.new_page()
        try:
            page.goto(URL, wait_until="commit", timeout=20000)
            page.wait_for_function(
                "() => document.querySelectorAll('.lumen-arrows__btn').length >= 2",
                timeout=25000,
            )
            page.wait_for_timeout(1100)
            s0 = page.evaluate(STATE)
            result["ix0"] = s0

            # Native DOM click — matches real user click; Playwright force-click was a no-op here.
            page.evaluate(
                "() => document.querySelector('.lumen-arrows__btn--next').click()"
            )
            page.wait_for_timeout(450)
            s1 = page.evaluate(STATE)
            result["ix1"] = s1
            page.evaluate(
                "() => document.querySelector('.lumen-arrows__btn--next').click()"
            )
            page.wait_for_timeout(450)
            s2 = page.evaluate(STATE)
            result["ix2"] = s2
            page.screenshot(path=str(SHOT), full_page=False)

            ixs = [str(s0.get("lumenIx")), str(s1.get("lumenIx")), str(s2.get("lumenIx"))]
            only_one = all(s.get("displayNotNone") == 1 for s in (s0, s1, s2))
            act = all(s.get("activeCount") == 1 for s in (s0, s1, s2))
            arrows_ok = (
                s0.get("arrowBtns") == 2
                and ixs == ["0", "1", "2"]
                and only_one
                and act
            )
            corners = s0.get("cornerHint") or {}
            cream = any(
                is_cream(corners.get(k)) for k in ("tl", "tr", "bl") if corners.get(k)
            )
            frame = s0.get("frameBg") or ""
            near_black = frame in ("rgb(0, 0, 0)", "rgba(0, 0, 0, 1)")
            result["pass_arrows"] = arrows_ok
            result["frameBg"] = frame
            result["cream_corners"] = cream
            result["ix"] = ixs
            result["pass"] = arrows_ok and not cream
            bits = []
            bits.append(
                "arrows OK 0→1→2 single-slide"
                if arrows_ok
                else f"arrows FAIL ix={ixs} visible={ [s.get('displayNotNone') for s in (s0,s1,s2)] }"
            )
            bits.append("frame pure black" if near_black else f"frame {frame}")
            bits.append("cream corners" if cream else "corners not cream")
            result["reason"] = "; ".join(bits)
        except Exception as e:
            result["error"] = repr(e)
            result["pass"] = False
            result["reason"] = f"live verify error: {e}"
        finally:
            browser.close()
    result["elapsed"] = round(time.time() - t0, 2)
    print(json.dumps(result, indent=2, default=str))


if __name__ == "__main__":
    main()
