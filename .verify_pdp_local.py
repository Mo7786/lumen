"""Serve saved PDP HTML + live lumen-pdp.js under file/http and exercise arrows."""
import json
import http.server
import threading
import functools
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(r"C:\Users\mubas\Projects\lumen-lab")
HTML = (ROOT / ".verify-pdp.html").read_text(encoding="utf-8", errors="replace")
JS = (ROOT / ".verify-lumen-pdp.js").read_text(encoding="utf-8", errors="replace")
CSS_ATELIER = ""
atelier = ROOT / "shopify" / "assets" / "lumen-atelier.css"
if atelier.exists():
    CSS_ATELIER = atelier.read_text(encoding="utf-8", errors="replace")

STATE_JS = """() => {
  const gallery = document.querySelector('media-gallery');
  const candidates = [...document.querySelectorAll('slideshow-slide')];
  const displayNotNone = candidates.filter(el => getComputedStyle(el).display !== 'none');
  const active = candidates.filter(el => el.classList.contains('lumen-slide-active'));
  const frame = document.querySelector('slideshow-slides') || gallery;
  const frameBg = frame ? getComputedStyle(frame).backgroundColor : null;
  // sample corner-ish parent backgrounds around active image
  const img = document.querySelector('slideshow-slide.lumen-slide-active img') || document.querySelector('slideshow-slide img');
  let imgMeta = null;
  if (img) {
    const s = getComputedStyle(img);
    let el = img;
    const bgs = [];
    for (let i = 0; i < 5 && el; i++) {
      bgs.push({ tag: el.tagName, cls: String(el.className).slice(0,60), bg: getComputedStyle(el).backgroundColor });
      el = el.parentElement;
    }
    imgMeta = { br: s.borderRadius, bgs };
  }
  return {
    lumenIx: gallery ? gallery.dataset.lumenIx : null,
    arrowBtns: document.querySelectorAll('.lumen-arrows__btn').length,
    slideCount: candidates.length,
    displayNotNone: displayNotNone.length,
    activeCount: active.length,
    frameBg,
    imgMeta,
    lumenPdp: document.documentElement.classList.contains('lumen-pdp'),
  };
}"""


def main():
    # Rewrite asset URLs to keep CDN for images; inject our JS/CSS inline at end of body
    body = HTML
    # Ensure lumen-pdp runs: append fresh copy after any existing
    inject = (
        "<style id='lumen-atelier-local'>" + CSS_ATELIER + "</style>"
        + "<script id='lumen-pdp-local'>" + JS + "</script>"
    )
    if "</body>" in body:
        body = body.replace("</body>", inject + "</body>", 1)
    else:
        body += inject

    page_path = ROOT / ".verify-served.html"
    page_path.write_text(body, encoding="utf-8")

    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT))
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", 8765), handler)
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()

    result = {}
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        page = browser.new_page()
        try:
            page.goto(
                "http://127.0.0.1:8765/.verify-served.html",
                wait_until="domcontentloaded",
                timeout=20000,
            )
            page.wait_for_timeout(1200)
            # boot may need DOMContentLoaded; force if blocked by __lumenPdp from original script
            page.evaluate(
                """() => {
                  // if original deferred script set flag but failed gallery, allow re-run by clearing and eval local
                  const g = document.querySelector('media-gallery');
                  if (g && !document.querySelector('.lumen-arrows__btn')) {
                    window.__lumenPdp = false;
                  }
                }"""
            )
            # re-exec local script if arrows missing
            if page.locator(".lumen-arrows__btn").count() == 0:
                page.add_script_tag(content="window.__lumenPdp=false;")
                page.add_script_tag(content=JS)
                page.wait_for_timeout(800)

            s0 = page.evaluate(STATE_JS)
            result["ix0"] = s0
            result["arrow_btns"] = s0.get("arrowBtns")

            if page.locator(".lumen-arrows__btn--next").count():
                nxt = page.locator(".lumen-arrows__btn--next").first
                nxt.click(force=True)
                page.wait_for_timeout(400)
                s1 = page.evaluate(STATE_JS)
                result["ix1"] = s1
                nxt.click(force=True)
                page.wait_for_timeout(400)
                s2 = page.evaluate(STATE_JS)
                result["ix2"] = s2
            else:
                result["error"] = "no next arrow"
                s1 = s2 = {}

            page.screenshot(path=str(ROOT / ".verify-pdp.png"), full_page=False)
            ixs = [str(s0.get("lumenIx")), str(s1.get("lumenIx")), str(s2.get("lumenIx"))]
            only_one = all(
                (st or {}).get("displayNotNone") == 1 for st in (s0, s1, s2) if st
            )
            result["pass_arrows"] = (
                result.get("arrow_btns") == 2
                and ixs == ["0", "1", "2"]
                and only_one
                and all((st or {}).get("activeCount") == 1 for st in (s0, s1, s2) if st)
            )
            result["pass_arrows_detail"] = {
                "btns2": result.get("arrow_btns") == 2,
                "ix": ixs,
                "displayNotNone": [
                    (s0 or {}).get("displayNotNone"),
                    (s1 or {}).get("displayNotNone"),
                    (s2 or {}).get("displayNotNone"),
                ],
                "active": [
                    (s0 or {}).get("activeCount"),
                    (s1 or {}).get("activeCount"),
                    (s2 or {}).get("activeCount"),
                ],
                "frameBg": (s0 or {}).get("frameBg"),
                "imgMeta": (s0 or {}).get("imgMeta"),
            }
            # teal-ish heuristic: not rgb(0,0,0) pure black preferred; cream ~ rgb(244,241,234)
            fb = (s0 or {}).get("frameBg") or ""
            result["frame_note"] = fb
        except Exception as e:
            result["error"] = repr(e)
        finally:
            browser.close()
            httpd.shutdown()
    print(json.dumps(result, indent=2, default=str))


if __name__ == "__main__":
    main()
