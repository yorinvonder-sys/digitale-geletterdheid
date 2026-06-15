#!/usr/bin/env python3
"""Visual check: Screenshot 6 DGSkills missions to verify duck branding."""
from playwright.sync_api import sync_playwright
import os

MISSIONS = [
    ('prompt-master', 'Standalone — Prompt Master (AI builder)'),
    ('magister-master', 'Tool-Guide — Magister Master'),
    ('data-detective', 'Scenario-Engine — Data Detective'),
    ('deepfake-detector', 'Standalone — Deepfake Detector'),
    ('game-director', 'Standalone — Game Director (canvas game)'),
    ('wachtwoord-warrior', 'Puzzle-Lab — Wachtwoord Warrior'),
]

os.makedirs('screenshots', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 800})

    for mid, desc in MISSIONS:
        url = f'http://localhost:5173/dev/mission-preview?mission={mid}'
        print(f'\n=== {desc} ==')
        print(f'URL: {url}')

        page.goto(url)
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(2000)  # extra wait for React hydration

        # Take screenshot
        fname = f'screenshots/mission-{mid}.png'
        page.screenshot(path=fname, full_page=True)
        print(f'Screenshot saved: {fname}')

        # Check for duck-branding elements
        content = page.content()

        # Check for duck logo
        duck_logo = 'dgskills-duck-logo-mark.webp' in content
        print(f'  🦆 Duck logo present: {duck_logo}')

        # Check for old smiley (should NOT be present)
        old_smiley = 'favicon.svg' in content or 'old-smiley' in content
        print(f'  ❌ Old smiley present: {old_smiley}')

        # Check for DuckMark component
        duck_mark = 'duck-logo-mark' in content
        print(f'  🦆 DuckMark rendered: {duck_mark}')

        # Check for new brand colors in classNames
        duck_coral = 'duck-coral' in content
        duck_acid = 'duck-acid' in content
        duck_ink = 'duck-ink' in content
        print(f'  🎨 duck-coral class: {duck_coral}')
        print(f'  🎨 duck-acid class: {duck_acid}')
        print(f'  🎨 duck-ink class: {duck_ink}')

        # Check for OLD colors (should be minimal)
        old_coral = '#D97848' in content
        old_cream = '#FCF6EA' in content
        old_line = '#E7D8BD' in content
        if old_coral or old_cream or old_line:
            print(f'  ⚠️  Remaining old hex colors:')
            if old_coral: print(f'      #D97848 (old coral)')
            if old_cream: print(f'      #FCF6EA (old cream)')
            if old_line: print(f'      #E7D8BD (old line)')

        # Check for emoji icons in UI (not in config strings)
        # Check the visible text for emoji patterns
        try:
            title_el = page.query_selector('[class*="mission-goal"], [class*="goal-banner"], h1, h2')
            if title_el:
                goal_text = title_el.inner_text()
                print(f'  📝 Visible goal text: {goal_text[:80]}')
        except:
            pass

    browser.close()

print('\n=== Check complete ===')
print('Screenshots saved to screenshots/ folder')
