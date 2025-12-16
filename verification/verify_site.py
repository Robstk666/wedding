from playwright.sync_api import sync_playwright

def verify_wedding_site():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the site
        try:
            page.goto("http://localhost:3000")

            # Wait for content to load
            page.wait_for_selector("text=Анна & Сергей")

            # Screenshot Hero section
            page.screenshot(path="verification/hero.png")
            print("Hero screenshot taken.")

            # Scroll down to trigger animation
            # Since the page is very tall (500vh), we scroll a bit
            page.evaluate("window.scrollTo(0, window.innerHeight * 1.5)")

            # Wait for animation to settle (text fade in)
            page.wait_for_timeout(2000)

            # Screenshot Scrollytelling section
            page.screenshot(path="verification/scrollytelling.png")
            print("Scrollytelling screenshot taken.")

            # Scroll to bottom for RSVP
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            page.wait_for_timeout(1000)

            page.screenshot(path="verification/rsvp.png")
            print("RSVP screenshot taken.")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_wedding_site()
