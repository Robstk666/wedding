from playwright.sync_api import sync_playwright

def verify_modern_features():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            page.goto("http://localhost:3000")
            page.wait_for_load_state("networkidle")

            # 1. Screenshot cursor (we simulate mouse move to trigger cursor)
            page.mouse.move(500, 500)
            page.wait_for_timeout(500) # Wait for spring animation
            page.screenshot(path="verification/modern_cursor.png")
            print("Cursor screenshot taken.")

            # 2. Scroll to trigger text animation (framer-motion)
            page.evaluate("window.scrollTo(0, window.innerHeight * 1.5)")
            page.wait_for_timeout(1000) # Wait for animation

            # Check if text is visible (opacity 1)
            # In framer-motion, it might handle styles directly, so we screenshot to verify visuals
            page.screenshot(path="verification/modern_text_reveal.png")
            print("Text reveal screenshot taken.")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_modern_features()
