# DGSkills Design Audit

Generated: 2026-05-04T18:07:06.047Z
Base URL: http://127.0.0.1:5173
Chrome: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
Design source: `/Users/yorinvonder/Downloads/ai-lab---future-architect/design.md`

## Summary

- Updated: 2
- Partial: 18
- Not updated: 2
- Routes audited: 22
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
| `/` | mobile | 76 | partial | Homepage gebruikt niet zichtbaar de lockup volgens design.md.<br>Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens. |
| `/dev/student-dashboard-capture` | desktop | 89 | updated | Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.<br>Kleine nav/footer-links gevonden (3); check handmatig of de klikruimte minimaal 44px is. |
| `/dev/student-dashboard-capture` | mobile | 92 | updated | Geen primaire DGSkills-screenshotbron uit design.md zichtbaar. |
| `/dev/mission-capture?mission=website-bouwer` | desktop | 62 | partial | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden. |
| `/dev/mission-capture?mission=website-bouwer` | mobile | 62 | partial | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden. |
| `/dev/mission-capture?mission=data-journalist` | desktop | 58 | partial | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden. |
| `/dev/mission-capture?mission=data-journalist` | mobile | 58 | partial | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden. |
| `/dev/mission-capture?mission=prompt-master` | desktop | 71 | partial | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden. |
| `/dev/mission-capture?mission=prompt-master` | mobile | 71 | partial | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden. |
| `/dev/mission-capture?mission=game-programmeur` | desktop | 49 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Weinig design.md tokengebruik zichtbaar (18 gemeten stijldeclaraties). |
| `/dev/mission-capture?mission=game-programmeur` | mobile | 49 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Weinig design.md tokengebruik zichtbaar (18 gemeten stijldeclaraties). |
| `/dev/mission-capture?mission=ai-tekengame` | desktop | 63 | partial | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden. |
| `/dev/mission-capture?mission=ai-tekengame` | mobile | 63 | partial | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden. |
| `/dev/mission-capture?mission=data-detective` | desktop | 65 | partial | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden. |
| `/dev/mission-capture?mission=data-detective` | mobile | 65 | partial | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden. |
| `/dev/mission-capture?mission=deepfake-detector` | desktop | 63 | partial | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden. |
| `/dev/mission-capture?mission=deepfake-detector` | mobile | 63 | partial | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden. |
| `/dev/mission-capture?mission=cloud-cleaner` | desktop | 79 | partial | Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.<br>Geen primaire DGSkills-screenshotbron uit design.md zichtbaar. |
| `/dev/mission-capture?mission=cloud-cleaner` | mobile | 79 | partial | Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.<br>Geen primaire DGSkills-screenshotbron uit design.md zichtbaar. |
| `/dev/mission-capture?mission=pitch-police` | desktop | 73 | partial | Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.<br>H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines. |
| `/dev/mission-capture?mission=pitch-police` | mobile | 57 | partial | Weinig design.md tokengebruik zichtbaar (14 gemeten stijldeclaraties).<br>Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden. |

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

### / (mobile)

Score: **76** - **partial**

Issues:
- Homepage gebruikt niet zichtbaar de lockup volgens design.md.

Warnings:
- Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens.
- Kleine nav/footer-links gevonden (1); check handmatig of de klikruimte minimaal 44px is.
- Mogelijk afgekapt tekstblok gevonden (8 voorbeelden).

Signalen: Outfit=true, tokengebruik=328, oude kleurclasses=0, logo=true, productbeelden=true
Screenshot: `screenshots/home-mobile.png`
Designbeelden: `/screenshots/new-dashboard-missions.png`, `/screenshots/prompt-master.webp`, `/screenshots/student-progress-xp.webp`, `/screenshots/student-dashboard.webp`, `/screenshots/student-dashboard.webp`

### /dev/student-dashboard-capture (desktop)

Score: **89** - **updated**

Issues:
-

Warnings:
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Kleine nav/footer-links gevonden (3); check handmatig of de klikruimte minimaal 44px is.

Signalen: Outfit=true, tokengebruik=184, oude kleurclasses=0, logo=true, productbeelden=false
Screenshot: `screenshots/dev-student-dashboard-capture-desktop.png`

### /dev/student-dashboard-capture (mobile)

Score: **92** - **updated**

Issues:
-

Warnings:
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=220, oude kleurclasses=0, logo=true, productbeelden=false
Screenshot: `screenshots/dev-student-dashboard-capture-mobile.png`

### /dev/mission-capture?mission=website-bouwer (desktop)

Score: **62** - **partial**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Interactieve doelen kleiner dan 44px gevonden: button 18x18; button "INSTRUCTIES" 720x40; button "PREVIEW" 720x40.

Warnings:
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=99, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-website-bouwer-desktop.png`

### /dev/mission-capture?mission=website-bouwer (mobile)

Score: **62** - **partial**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Interactieve doelen kleiner dan 44px gevonden: button 18x18; button "INSTRUCTIES" 195x40; button "PREVIEW" 195x40.

Warnings:
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=83, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-website-bouwer-mobile.png`

### /dev/mission-capture?mission=data-journalist (desktop)

Score: **58** - **partial**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Interactieve doelen kleiner dan 44px gevonden: button 18x18; input 223x32; input 223x32.

Warnings:
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=156, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-data-journalist-desktop.png`

### /dev/mission-capture?mission=data-journalist (mobile)

Score: **58** - **partial**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Interactieve doelen kleiner dan 44px gevonden: button 18x18; input 332x32; input 332x32.

Warnings:
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=156, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-data-journalist-mobile.png`

### /dev/mission-capture?mission=prompt-master (desktop)

Score: **71** - **partial**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Kleine nav/footer-links gevonden (1); check handmatig of de klikruimte minimaal 44px is.

Signalen: Outfit=true, tokengebruik=68, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-prompt-master-desktop.png`

### /dev/mission-capture?mission=prompt-master (mobile)

Score: **71** - **partial**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Kleine nav/footer-links gevonden (1); check handmatig of de klikruimte minimaal 44px is.

Signalen: Outfit=true, tokengebruik=68, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-prompt-master-mobile.png`

### /dev/mission-capture?mission=game-programmeur (desktop)

Score: **49** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Weinig design.md tokengebruik zichtbaar (18 gemeten stijldeclaraties).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Interactieve doelen kleiner dan 44px gevonden: button 28x28.

Warnings:
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=18, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-game-programmeur-desktop.png`

### /dev/mission-capture?mission=game-programmeur (mobile)

Score: **49** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Weinig design.md tokengebruik zichtbaar (18 gemeten stijldeclaraties).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Interactieve doelen kleiner dan 44px gevonden: button 28x28.

Warnings:
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=18, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-game-programmeur-mobile.png`

### /dev/mission-capture?mission=ai-tekengame (desktop)

Score: **63** - **partial**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- Beperkt design.md tokengebruik zichtbaar (25 gemeten stijldeclaraties).
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=25, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-ai-tekengame-desktop.png`

### /dev/mission-capture?mission=ai-tekengame (mobile)

Score: **63** - **partial**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- Beperkt design.md tokengebruik zichtbaar (25 gemeten stijldeclaraties).
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=25, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-ai-tekengame-mobile.png`

### /dev/mission-capture?mission=data-detective (desktop)

Score: **65** - **partial**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Interactieve doelen kleiner dan 44px gevonden: button 40x40.

Warnings:
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=92, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-data-detective-desktop.png`

### /dev/mission-capture?mission=data-detective (mobile)

Score: **65** - **partial**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Interactieve doelen kleiner dan 44px gevonden: button 40x40.

Warnings:
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=92, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-data-detective-mobile.png`

### /dev/mission-capture?mission=deepfake-detector (desktop)

Score: **63** - **partial**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Interactieve doelen kleiner dan 44px gevonden: button 40x40; button "Vraag hulp" 109x28; button "Hint nodig?" 99x20.

Warnings:
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=60, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-deepfake-detector-desktop.png`

### /dev/mission-capture?mission=deepfake-detector (mobile)

Score: **63** - **partial**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Interactieve doelen kleiner dan 44px gevonden: button 40x40; button "Vraag hulp" 38x26; button "Hint nodig?" 99x20.

Warnings:
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=60, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-deepfake-detector-mobile.png`

### /dev/mission-capture?mission=cloud-cleaner (desktop)

Score: **79** - **partial**

Issues:
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Kleine nav/footer-links gevonden (1); check handmatig of de klikruimte minimaal 44px is.

Signalen: Outfit=true, tokengebruik=113, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-cloud-cleaner-desktop.png`

### /dev/mission-capture?mission=cloud-cleaner (mobile)

Score: **79** - **partial**

Issues:
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Kleine nav/footer-links gevonden (1); check handmatig of de klikruimte minimaal 44px is.

Signalen: Outfit=true, tokengebruik=111, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-cloud-cleaner-mobile.png`

### /dev/mission-capture?mission=pitch-police (desktop)

Score: **73** - **partial**

Issues:
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Kleine nav/footer-links gevonden (1); check handmatig of de klikruimte minimaal 44px is.

Signalen: Outfit=true, tokengebruik=45, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-pitch-police-desktop.png`

### /dev/mission-capture?mission=pitch-police (mobile)

Score: **57** - **partial**

Issues:
- Weinig design.md tokengebruik zichtbaar (14 gemeten stijldeclaraties).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Kleine nav/footer-links gevonden (1); check handmatig of de klikruimte minimaal 44px is.

Signalen: Outfit=true, tokengebruik=14, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-pitch-police-mobile.png`
