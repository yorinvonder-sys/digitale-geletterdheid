#!/usr/bin/env python3
"""Screenshot homepage at initial load to see what loading screen shows."""
from playwright.sync_api import sync_playwright
import os, time
os.makedirs('screenshots', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})

    # Navigate and capture the initial loading state (before JS finishes)
    page.goto('http://localhost:5173/', wait_until='commit')
    time.sleep(0.5)  # brief moment to see the skeleton
    page.screenshot(path='screenshots/loading-initial.png', full_page=True)
    print('Initial loading screenshot saved')

    # Wait for full load and take another
    page.wait_for_load_state('networkidle')
    time.sleep(3)
    page.screenshot(path='screenshots/loading-fully-loaded.png', full_page=True)
    print('Fully loaded screenshot saved')

    # Also check the favicon
    content = page.content()
    print(f'\nPage title: {page.title()}')
    
    # Check if any img with favicon.svg or logo.svg is rendered
    imgs = page.query_selector_all('img')
    for img in imgs:
        src = img.get_attribute('src')
        if src and ('svg' in src or 'logo' in src or 'duck' in src):
            print(f'  Image: src="{src}", alt="{img.get_attribute("alt")}"')

    browser.close()
print('Done')
