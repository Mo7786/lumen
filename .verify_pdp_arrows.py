import json
import sys
from playwright.sync_api import sync_playwright

URL = "https://9b5bbe-hg.myshopify.com/products/tool-gua?v=ready-1"
SHOT = r"C:\Users\mubas\Projects\lumen-lab\.verify-pdp.png"

STATE_JS = """() => {
  const gallery = document.querySelector('media-gallery');
  const candidates = [...document.querySelectorAll('slideshow-slide')];
  const displayNotNone = candidates.filter(el => getComputedStyle(el).display !== 'none');
  const active = candidates.filter(el => el.classList.contains('lumen-slide-active'));
  const frame =
    document.querySelector('slideshow-slides') ||
    document.querySelector('media-gallery') ||
    document.querySelector('slideshow-component');
  const frameBg = frame ? getComputedStyle(frame).backgroundColor : null;
  // sample pixels via canvas not available; use CSS vars / backgrounds
  const root = getComputedStyle(document.documentElement);
  const imgs = [...document.querySelectorAll('slideshow-slide.lumen-slide-active img, slideshow-slide img')]
    .slice(0, 2)
    .map(img => {
      const s = getComputedStyle(img);
      const p = img.parentElement ? getComputedStyle(img.parentElement) : null;
      return {
        br: s.borderRadius,
        bg: s.backgroundColor,
        parentBg: p ? p.backgroundColor : null,
        parentBr: p ? p.borderRadius : null,
      };
    });
  return {
    lumenIx: gallery ? gallery.dataset.lumenIx : null,
    windowLumenIx: typeof window.lumenIx !== 'undefined' ? window.lumenIx : null,
    arrowBtns: document.querySelectorAll('.lumen-arrows__btn').length,
    slideCount: candidates.length,
    displayNotNone: displayNotNone.length,
    activeCount: active.length,
    frameBg,
    imgs,
    lumenPdp: document.documentElement.classList.contains('lumen-pdp'),
  };
}"""


def main():
    result = {}
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        page = browser.new_page()
        try:
            # commit is earliest; network to this shop is slow
            page.goto(URL, wait_until="commit", timeout=20000)
            page.wait_for_selector("media-gallery", timeout=20000)
            page.wait_for_selector(".lumen-arrows__btn", timeout=15000)
            page.wait_for_timeout(800)
            s0 = page.evaluate(STATE_JS)
            result["ix0"] = s0
            result["arrow_btns"] = s0.get("arrowBtns")

            nxt = page.locator(".lumen-arrows__btn--next").first
            nxt.click(force=True)
            page.wait_for_timeout(500)
            s1 = page.evaluate(STATE_JS)
            result["ix1"] = s1

            nxt.click(force=True)
            page.wait_for_timeout(500)
            s2 = page.evaluate(STATE_JS)
            result["ix2"] = s2

            page.screenshot(path=SHOT, full_page=False)
            result["screenshot"] = SHOT

            ixs = [str(s0.get("lumenIx")), str(s1.get("lumenIx")), str(s2.get("lumenIx"))]
            only_one = all(st.get("displayNotNone") == 1 for st in (s0, s1, s2))
            result["pass_arrows"] = (
                result["arrow_btns"] == 2
                and ixs == ["0", "1", "2"]
                and only_one
                and all(st.get("activeCount") == 1 for st in (s0, s1, s2))
            )
            result["pass_arrows_detail"] = {
                "btns2": result["arrow_btns"] == 2,
                "ix": ixs,
                "displayNotNone": [s0.get("displayNotNone"), s1.get("displayNotNone"), s2.get("displayNotNone")],
                "active": [s0.get("activeCount"), s1.get("activeCount"), s2.get("activeCount")],
                "frameBg": s2.get("frameBg") or s0.get("frameBg"),
                "imgs": s0.get("imgs"),
            }
        except Exception as e:
            result["error"] = repr(e)
        finally:
            browser.close()
    print(json.dumps(result, indent=2, default=str))
    sys.exit(0 if result.get("pass_arrows") else 1)


if __name__ == "__main__":
    main()
