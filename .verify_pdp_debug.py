import json
from playwright.sync_api import sync_playwright

URL = "https://9b5bbe-hg.myshopify.com/products/tool-gua?v=ready-2"

BEFORE = """() => {
  const g = document.querySelector('media-gallery');
  const all = [...g.querySelectorAll('slideshow-slide')].map((el, i) => ({
    i,
    display: getComputedStyle(el).display,
    active: el.classList.contains('lumen-slide-active'),
    parent: el.parentElement && el.parentElement.tagName,
    inZoom: !!el.closest('zoom-dialog, dialog'),
  }));
  return {
    ix: g.dataset.lumenIx,
    sync: g.dataset.lumenSyncing,
    all,
    arrows: document.querySelectorAll('.lumen-arrows__btn').length,
  };
}"""

AFTER = """() => {
  const g = document.querySelector('media-gallery');
  return {
    ix: g.dataset.lumenIx,
    sync: g.dataset.lumenSyncing,
    active: [...g.querySelectorAll('slideshow-slide')].map((el, i) => ({
      i,
      display: getComputedStyle(el).display,
      active: el.classList.contains('lumen-slide-active'),
      inZoom: !!el.closest('zoom-dialog, dialog'),
    })),
  };
}"""


def main():
    with sync_playwright() as p:
        b = p.chromium.launch(channel="chrome", headless=True)
        page = b.new_page()
        page.goto(URL, wait_until="commit", timeout=20000)
        page.wait_for_function(
            "() => document.querySelectorAll('.lumen-arrows__btn').length >= 2",
            timeout=25000,
        )
        page.wait_for_timeout(1000)
        print("BEFORE", json.dumps(page.evaluate(BEFORE), indent=2))
        page.locator(".lumen-arrows__btn--next").click(force=True)
        page.wait_for_timeout(600)
        print("AFTER1", json.dumps(page.evaluate(AFTER), indent=2))
        page.locator(".lumen-arrows__btn--next").click(force=True)
        page.wait_for_timeout(600)
        print("AFTER2", json.dumps(page.evaluate(AFTER), indent=2))
        # force goSlide via dataset
        page.evaluate(
            """() => {
              const g = document.querySelector('media-gallery');
              g.dataset.lumenIx = '1';
              g.dataset.lumenSyncing = '0';
              // click next again
              document.querySelector('.lumen-arrows__btn--next').click();
            }"""
        )
        page.wait_for_timeout(600)
        print("AFTER_FORCE", json.dumps(page.evaluate(AFTER), indent=2))
        b.close()


if __name__ == "__main__":
    main()
