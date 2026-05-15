# DGSkills Design Audit

Generated: 2026-05-04T18:11:25.259Z
Base URL: http://127.0.0.1:5173
Chrome: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
Design source: `/Users/yorinvonder/Downloads/ai-lab---future-architect/design.md`

## Summary

- Updated: 0
- Partial: 2
- Not updated: 0
- Routes audited: 2
- Discovery: disabled

Homepage baseline:
- Body background: `#faf9f0`
- H1 color: `#08283b`
- Token colors seen: 10
- Old color classes: 0
- Lockup logo: false

## Routes

| Route | Viewport | Score | Status | Main notes |
| --- | --- | ---: | --- | --- |
| `/` | desktop | 76 | partial | Homepage gebruikt niet zichtbaar de lockup volgens design.md.<br>Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens. |
| `/dev/mission-capture?mission=game-programmeur` | desktop | 75 | partial | Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.<br>Beperkt design.md tokengebruik zichtbaar (41 gemeten stijldeclaraties). |

## Details

### / (desktop)

Score: **76** - **partial**

Issues:
- Homepage gebruikt niet zichtbaar de lockup volgens design.md.

Warnings:
- Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens.
- Kleine nav/footer-links gevonden (1); check handmatig of de klikruimte minimaal 44px is.
- Mogelijk afgekapt tekstblok gevonden (5 voorbeelden).

Signalen: Outfit=true, tokengebruik=263, oude kleurclasses=0, logo=true, productbeelden=true
Screenshot: `screenshots/home-desktop.png`
Designbeelden: `/screenshots/new-dashboard-missions.png`, `/screenshots/student-dashboard.webp`

### /dev/mission-capture?mission=game-programmeur (desktop)

Score: **75** - **partial**

Issues:
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- Beperkt design.md tokengebruik zichtbaar (41 gemeten stijldeclaraties).
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=41, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-game-programmeur-desktop.png`
