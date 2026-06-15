#!/usr/bin/env python3
"""Screenshot the homepage to verify spacing."""
from playwright.sync_api import sync_playwright
import os

os.makedirs('screenshots', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})

    page.goto('http://localhost:5173/')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(3000)

    # Scroll to top and screenshot the hero area
    page.evaluate('window.scrollTo(0, 0)')
    page.wait_for_timeout(500)

    page.screenshot(path='screenshots/home-hero-spacing.png', full_page=True)
    print('Screenshot saved to screenshots/home-hero-spacing.png')

    # Check if the text exists and has mt-6 class
    content = page.content()
    if 'mt-6' in content:
        print('✅ mt-6 class found on page')
    if 'Digitale geletterdheid' in content:
        print('✅ Text found on page')
    if 'duck-acid' in content:
        print('✅ duck-acid class found')

    browser.close()
print('Done')
