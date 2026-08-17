"""Minimal gallery fixture for lumen-pdp arrows (bundled chromium; chrome channel optional)."""
import json
import os
import re
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(r"C:\Users\mubas\Projects\lumen-lab")
# Prefer local fixed asset; fall back to downloaded live copy.
_local_js = ROOT / "shopify" / "assets" / "lumen-pdp.js"
_live_js = ROOT / ".verify-lumen-pdp.js"
JS = (
    _local_js.read_text(encoding="utf-8", errors="replace")
    if _local_js.exists()
    else _live_js.read_text(encoding="utf-8", errors="replace")
)
# Fixture runs under about:blank — force PDP boot paths.
JS = re.sub(
    r"function onPdp\(\)\s*\{\s*return location\.pathname\.indexOf\([\"']/products/[\"']\)\s*!==\s*-1;\s*\}",
    "function onPdp(){return true;}",
    JS,
)
CSS = (ROOT / "shopify" / "assets" / "lumen-atelier.css").read_text(
    encoding="utf-8", errors="replace"
)
HTML_SRC = (ROOT / ".verify-pdp.html").read_text(encoding="utf-8", errors="replace")

m = re.search(r"(<media-gallery[\s\S]*?</media-gallery>)", HTML_SRC, re.I)
gallery = m.group(1) if m else "<media-gallery></media-gallery>"
gallery = re.sub(r"<script[\s\S]*?</script>", "", gallery, flags=re.I)

FIXTURE = f"""<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>{CSS}</style>
<style>
  body {{ margin:0; background:#0c1016; }}
  media-gallery {{ display:block; width:480px; height:480px; }}
  slideshow-slides {{ display:block; width:100%; height:100%; }}
  slideshow-slide {{ display:flex; width:100%; height:100%; }}
  slideshow-slide img {{ width:100%; height:100%; object-fit:contain; }}
</style>
</head>
<body>
{gallery}
<script>history.replaceState(null,'','/products/tool-gua');</script>
<script>{JS}</script>
</body>
</html>
"""

STATE = """() => {
  const gallery = document.querySelector('media-gallery');
  const candidates = [...document.querySelectorAll('slideshow-slide')];
  const displayNotNone = candidates.filter(el => getComputedStyle(el).display !== 'none');
  const active = candidates.filter(el => el.classList.contains('lumen-slide-active'));
  const frame = document.querySelector('slideshow-slides') || gallery;
  return {
    lumenIx: gallery ? gallery.dataset.lumenIx : null,
    arrowBtns: document.querySelectorAll('.lumen-arrows__btn').length,
    slideCount: candidates.length,
    displayNotNone: displayNotNone.length,
    activeCount: active.length,
    frameBg: frame ? getComputedStyle(frame).backgroundColor : null,
    galleryBg: gallery ? getComputedStyle(gallery).backgroundColor : null,
    lumenPdp: document.documentElement.classList.contains('lumen-pdp'),
  };
}"""


def launch_browser(p):
    # System Chrome — bundled playwright browsers are not installed in this env.
    b = p.chromium.launch(channel="chrome", headless=True, timeout=15000)
    return b, "chrome"


def main():
    print("start", flush=True)
    result = {}
    t0 = time.time()
    with sync_playwright() as p:
        print("pw", flush=True)
        browser, which = launch_browser(p)
        result["browser"] = which
        print("launched", which, flush=True)
        page = browser.new_page()
        try:
            page.set_content(FIXTURE, wait_until="domcontentloaded", timeout=20000)
            page.wait_for_timeout(700)
            s0 = page.evaluate(STATE)
            result["ix0"] = s0
            n = page.locator(".lumen-arrows__btn").count()
            result["arrow_btns"] = n
            print("arrows", n, "ix", s0.get("lumenIx"), flush=True)
            if n >= 2:
                page.locator(".lumen-arrows__btn--next").click(force=True)
                page.wait_for_timeout(250)
                s1 = page.evaluate(STATE)
                result["ix1"] = s1
                page.locator(".lumen-arrows__btn--next").click(force=True)
                page.wait_for_timeout(250)
                s2 = page.evaluate(STATE)
                result["ix2"] = s2
                ixs = [
                    str(s0.get("lumenIx")),
                    str(s1.get("lumenIx")),
                    str(s2.get("lumenIx")),
                ]
                only_one = all(s.get("displayNotNone") == 1 for s in (s0, s1, s2))
                act = all(s.get("activeCount") == 1 for s in (s0, s1, s2))
                result["pass_arrows"] = (
                    n == 2 and ixs == ["0", "1", "2"] and only_one and act
                )
                result["detail"] = {
                    "ix": ixs,
                    "displayNotNone": [
                        s0["displayNotNone"],
                        s1["displayNotNone"],
                        s2["displayNotNone"],
                    ],
                    "active": [
                        s0["activeCount"],
                        s1["activeCount"],
                        s2["activeCount"],
                    ],
                    "frameBg": s0.get("frameBg"),
                    "galleryBg": s0.get("galleryBg"),
                }
            else:
                result["pass_arrows"] = False
                result["error"] = "arrow count != 2 after boot"

            page.screenshot(path=str(ROOT / ".verify-pdp.png"))

            # Live check with early commit + short selector wait (shop HTML is slow).
            if os.environ.get("SKIP_LIVE") == "1":
                result["live_skipped"] = True
                print(json.dumps(result, indent=2, default=str), flush=True)
                browser.close()
                print("elapsed", round(time.time() - t0, 2), flush=True)
                sys.exit(0 if result.get("pass_arrows") else 1)

            try:
                print("live goto", flush=True)
                page.goto(
                    "https://9b5bbe-hg.myshopify.com/products/tool-gua?v=ready-1",
                    wait_until="commit",
                    timeout=20000,
                )
                page.wait_for_selector("media-gallery", state="attached", timeout=20000)
                page.wait_for_timeout(1500)
                live = page.evaluate(STATE)
                live["title"] = page.title()
                live["url"] = page.url
                live["arrowBtnsLive"] = page.locator(".lumen-arrows__btn").count()
                if live["arrowBtnsLive"] >= 2:
                    page.locator(".lumen-arrows__btn--next").click(force=True)
                    page.wait_for_timeout(400)
                    live1 = page.evaluate(STATE)
                    page.locator(".lumen-arrows__btn--next").click(force=True)
                    page.wait_for_timeout(400)
                    live2 = page.evaluate(STATE)
                    live["ix_seq"] = [
                        str(live.get("lumenIx")),
                        str(live1.get("lumenIx")),
                        str(live2.get("lumenIx")),
                    ]
                    live["display_seq"] = [
                        live.get("displayNotNone"),
                        live1.get("displayNotNone"),
                        live2.get("displayNotNone"),
                    ]
                    live["pass_live_arrows"] = (
                        live["arrowBtnsLive"] == 2
                        and live["ix_seq"] == ["0", "1", "2"]
                        and all(x == 1 for x in live["display_seq"])
                    )
                result["live"] = live
                page.screenshot(path=str(ROOT / ".verify-pdp-live.png"))
            except Exception as e:
                result["live_error"] = repr(e)
        except Exception as e:
            result["error"] = repr(e)
        finally:
            browser.close()
    result["elapsed"] = round(time.time() - t0, 2)
    print(json.dumps(result, indent=2, default=str), flush=True)
    sys.exit(0 if result.get("pass_arrows") else 1)


if __name__ == "__main__":
    main()
