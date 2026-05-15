# DGSkills Design Audit

Generated: 2026-05-04T18:02:33.714Z
Base URL: http://127.0.0.1:5173
Chrome: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
Design source: `/Users/yorinvonder/Downloads/ai-lab---future-architect/design.md`

## Summary

- Updated: 2
- Partial: 26
- Not updated: 34
- Routes audited: 62
- Discovery: enabled

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
| `/dev/mission-capture?mission=website-bouwer` | desktop | 48 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Weinig design.md tokengebruik zichtbaar (2 gemeten stijldeclaraties). |
| `/dev/mission-capture?mission=website-bouwer` | mobile | 59 | partial | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden. |
| `/dev/mission-capture?mission=data-journalist` | desktop | 55 | partial | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden. |
| `/dev/mission-capture?mission=data-journalist` | mobile | 55 | partial | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden. |
| `/dev/mission-capture?mission=prompt-master` | desktop | 68 | partial | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden. |
| `/dev/mission-capture?mission=prompt-master` | mobile | 68 | partial | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden. |
| `/dev/mission-capture?mission=game-programmeur` | desktop | 48 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #faf9f0). |
| `/dev/mission-capture?mission=game-programmeur` | mobile | 48 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #faf9f0). |
| `/dev/mission-capture?mission=ai-tekengame` | desktop | 53 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #faf9f0). |
| `/dev/mission-capture?mission=ai-tekengame` | mobile | 53 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #faf9f0). |
| `/dev/mission-capture?mission=data-detective` | desktop | 62 | partial | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden. |
| `/dev/mission-capture?mission=data-detective` | mobile | 62 | partial | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden. |
| `/dev/mission-capture?mission=deepfake-detector` | desktop | 60 | partial | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden. |
| `/dev/mission-capture?mission=deepfake-detector` | mobile | 60 | partial | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden. |
| `/dev/mission-capture?mission=cloud-cleaner` | desktop | 79 | partial | Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.<br>Geen primaire DGSkills-screenshotbron uit design.md zichtbaar. |
| `/dev/mission-capture?mission=cloud-cleaner` | mobile | 79 | partial | Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.<br>Geen primaire DGSkills-screenshotbron uit design.md zichtbaar. |
| `/dev/mission-capture?mission=pitch-police` | desktop | 56 | partial | Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #faf9f0).<br>Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden. |
| `/dev/mission-capture?mission=pitch-police` | mobile | 39 | not-updated | Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #faf9f0).<br>Weinig design.md tokengebruik zichtbaar (13 gemeten stijldeclaraties). |
| `/login` | desktop | 92 | partial | Interactieve doelen kleiner dan 44px gevonden: button "Wachtwoord vergeten? Stuur resetlink" 242x16; a "Privacy" 45x15; a "Cookies" 48x15. |
| `/login` | mobile | 92 | partial | Interactieve doelen kleiner dan 44px gevonden: button "Wachtwoord vergeten? Stuur resetlink" 242x16; a "Privacy" 45x15; a "Cookies" 48x15. |
| `/pilot` | desktop | 44 | not-updated | Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).<br>Veel oude Tailwind-kleurfamilies gevonden (79 matches, bijv. bg-slate-50, border-slate-100, text-slate-500, text-indigo-600, bg-indigo-50). |
| `/pilot` | mobile | 44 | not-updated | Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).<br>Veel oude Tailwind-kleurfamilies gevonden (77 matches, bijv. bg-slate-50, border-slate-100, text-slate-500, text-indigo-600, bg-indigo-50). |
| `/ict/privacy/cookies` | desktop | 57 | partial | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000). |
| `/ict/privacy/cookies` | mobile | 58 | partial | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000). |
| `/ict/privacy/policy` | desktop | 57 | partial | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000). |
| `/ict/privacy/policy` | mobile | 58 | partial | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000). |
| `/ict/privacy/ai` | desktop | 48 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000). |
| `/ict/privacy/ai` | mobile | 48 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000). |
| `/scholen` | desktop | 76 | partial | Homepage gebruikt niet zichtbaar de lockup volgens design.md.<br>Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens. |
| `/scholen` | mobile | 76 | partial | Homepage gebruikt niet zichtbaar de lockup volgens design.md.<br>Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens. |
| `/compliance-hub` | desktop | 62 | partial | Veel oude Tailwind-kleurfamilies gevonden (264 matches, bijv. bg-slate-50, border-slate-100, text-slate-500, text-indigo-600, bg-indigo-50).<br>H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines. |
| `/compliance-hub` | mobile | 62 | partial | Veel oude Tailwind-kleurfamilies gevonden (264 matches, bijv. bg-slate-50, border-slate-100, text-slate-500, text-indigo-600, bg-indigo-50).<br>H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines. |
| `/ict/privacy` | desktop | 22 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000). |
| `/ict/privacy` | mobile | 22 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000). |
| `/ict` | desktop | 66 | partial | Veel oude Tailwind-kleurfamilies gevonden (109 matches, bijv. text-slate-500, text-slate-900, text-indigo-600, bg-indigo-600, bg-indigo-700).<br>Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens. |
| `/ict` | mobile | 59 | partial | Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).<br>Veel oude Tailwind-kleurfamilies gevonden (98 matches, bijv. text-slate-900, text-slate-500, bg-slate-50, border-slate-100, bg-slate-100). |
| `/compliance/dpa-dgskills-v4.html` | desktop | 16 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Outfit is niet zichtbaar als primaire fontfamilie. |
| `/compliance/dpa-dgskills-v4.html` | mobile | 4 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Outfit is niet zichtbaar als primaire fontfamilie. |
| `/ict/technisch` | desktop | 39 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000). |
| `/ict/technisch` | mobile | 39 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000). |
| `/ict/support` | desktop | 29 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000). |
| `/ict/support` | mobile | 29 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000). |
| `/compliance/school-compliance-guide.html` | desktop | 18 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Outfit is niet zichtbaar als primaire fontfamilie. |
| `/compliance/school-compliance-guide.html` | mobile | 12 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Outfit is niet zichtbaar als primaire fontfamilie. |
| `/compliance/dpia-support-dgskills-v1.html` | desktop | 16 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Outfit is niet zichtbaar als primaire fontfamilie. |
| `/compliance/dpia-support-dgskills-v1.html` | mobile | 16 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Outfit is niet zichtbaar als primaire fontfamilie. |
| `/compliance/checklist` | desktop | 24 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000). |
| `/compliance/checklist` | mobile | 24 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000). |
| `/compliance/slo-rapport` | desktop | 38 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000). |
| `/compliance/slo-rapport` | mobile | 38 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000). |
| `/slo-kerndoelen-digitale-geletterdheid` | desktop | 52 | not-updated | Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).<br>Weinig design.md tokengebruik zichtbaar (15 gemeten stijldeclaraties). |
| `/slo-kerndoelen-digitale-geletterdheid` | mobile | 52 | not-updated | Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).<br>Weinig design.md tokengebruik zichtbaar (15 gemeten stijldeclaraties). |
| `/ict/integraties` | desktop | 29 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000). |
| `/ict/integraties` | mobile | 29 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000). |
| `/ict/implementatiegids` | desktop | 29 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Veel oude Tailwind-kleurfamilies gevonden (126 matches, bijv. bg-slate-50, text-slate-500, text-indigo-600, text-slate-900, text-slate-600). |
| `/ict/implementatiegids` | mobile | 27 | not-updated | Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.<br>Veel oude Tailwind-kleurfamilies gevonden (126 matches, bijv. bg-slate-50, text-slate-500, text-indigo-600, text-slate-900, text-slate-600). |
| `/digitale-geletterdheid-vo` | desktop | 47 | not-updated | Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).<br>Weinig design.md tokengebruik zichtbaar (8 gemeten stijldeclaraties). |
| `/digitale-geletterdheid-vo` | mobile | 47 | not-updated | Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).<br>Weinig design.md tokengebruik zichtbaar (8 gemeten stijldeclaraties). |

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

Score: **48** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Weinig design.md tokengebruik zichtbaar (2 gemeten stijldeclaraties).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Lage palet-overlap met homepage (2/10 tokenkleuren).

Signalen: Outfit=true, tokengebruik=2, oude kleurclasses=3, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-website-bouwer-desktop.png`
Oude kleurclasses: `bg-slate-50`, `border-indigo-200`, `text-slate-500`

### /dev/mission-capture?mission=website-bouwer (mobile)

Score: **59** - **partial**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Interactieve doelen kleiner dan 44px gevonden: button 18x18; button "INSTRUCTIES" 195x40; button "PREVIEW" 195x40.

Warnings:
- Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens.
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=82, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-website-bouwer-mobile.png`

### /dev/mission-capture?mission=data-journalist (desktop)

Score: **55** - **partial**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Interactieve doelen kleiner dan 44px gevonden: button 18x18; input 223x32; input 223x32.

Warnings:
- Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens.
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=155, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-data-journalist-desktop.png`

### /dev/mission-capture?mission=data-journalist (mobile)

Score: **55** - **partial**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Interactieve doelen kleiner dan 44px gevonden: button 18x18; input 332x32; input 332x32.

Warnings:
- Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens.
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=155, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-data-journalist-mobile.png`

### /dev/mission-capture?mission=prompt-master (desktop)

Score: **68** - **partial**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Kleine nav/footer-links gevonden (1); check handmatig of de klikruimte minimaal 44px is.

Signalen: Outfit=true, tokengebruik=67, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-prompt-master-desktop.png`

### /dev/mission-capture?mission=prompt-master (mobile)

Score: **68** - **partial**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Kleine nav/footer-links gevonden (1); check handmatig of de klikruimte minimaal 44px is.

Signalen: Outfit=true, tokengebruik=67, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-prompt-master-mobile.png`

### /dev/mission-capture?mission=game-programmeur (desktop)

Score: **48** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #faf9f0).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Interactieve doelen kleiner dan 44px gevonden: button 28x28.

Warnings:
- Beperkt design.md tokengebruik zichtbaar (27 gemeten stijldeclaraties).
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=27, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-game-programmeur-desktop.png`

### /dev/mission-capture?mission=game-programmeur (mobile)

Score: **48** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #faf9f0).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Interactieve doelen kleiner dan 44px gevonden: button 28x28.

Warnings:
- Beperkt design.md tokengebruik zichtbaar (27 gemeten stijldeclaraties).
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=27, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-game-programmeur-mobile.png`

### /dev/mission-capture?mission=ai-tekengame (desktop)

Score: **53** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #faf9f0).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- Beperkt design.md tokengebruik zichtbaar (22 gemeten stijldeclaraties).
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=22, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-ai-tekengame-desktop.png`

### /dev/mission-capture?mission=ai-tekengame (mobile)

Score: **53** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #faf9f0).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- Beperkt design.md tokengebruik zichtbaar (22 gemeten stijldeclaraties).
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=22, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-ai-tekengame-mobile.png`

### /dev/mission-capture?mission=data-detective (desktop)

Score: **62** - **partial**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Interactieve doelen kleiner dan 44px gevonden: button 40x40.

Warnings:
- Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens.
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=91, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-data-detective-desktop.png`

### /dev/mission-capture?mission=data-detective (mobile)

Score: **62** - **partial**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Interactieve doelen kleiner dan 44px gevonden: button 40x40.

Warnings:
- Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens.
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=91, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-data-detective-mobile.png`

### /dev/mission-capture?mission=deepfake-detector (desktop)

Score: **60** - **partial**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Interactieve doelen kleiner dan 44px gevonden: button 40x40; button "Vraag hulp" 109x28; button "Hint nodig?" 99x20.

Warnings:
- Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens.
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=59, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-deepfake-detector-desktop.png`

### /dev/mission-capture?mission=deepfake-detector (mobile)

Score: **60** - **partial**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Interactieve doelen kleiner dan 44px gevonden: button 40x40; button "Vraag hulp" 38x26; button "Hint nodig?" 99x20.

Warnings:
- Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens.
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=59, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-deepfake-detector-mobile.png`

### /dev/mission-capture?mission=cloud-cleaner (desktop)

Score: **79** - **partial**

Issues:
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Kleine nav/footer-links gevonden (1); check handmatig of de klikruimte minimaal 44px is.

Signalen: Outfit=true, tokengebruik=112, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-cloud-cleaner-desktop.png`

### /dev/mission-capture?mission=cloud-cleaner (mobile)

Score: **79** - **partial**

Issues:
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Kleine nav/footer-links gevonden (1); check handmatig of de klikruimte minimaal 44px is.

Signalen: Outfit=true, tokengebruik=110, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-cloud-cleaner-mobile.png`

### /dev/mission-capture?mission=pitch-police (desktop)

Score: **56** - **partial**

Issues:
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #faf9f0).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines.
- Beperkt design.md tokengebruik zichtbaar (44 gemeten stijldeclaraties).
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Kleine nav/footer-links gevonden (1); check handmatig of de klikruimte minimaal 44px is.

Signalen: Outfit=true, tokengebruik=44, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-pitch-police-desktop.png`

### /dev/mission-capture?mission=pitch-police (mobile)

Score: **39** - **not-updated**

Issues:
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #faf9f0).
- Weinig design.md tokengebruik zichtbaar (13 gemeten stijldeclaraties).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Kleine nav/footer-links gevonden (1); check handmatig of de klikruimte minimaal 44px is.
- Mogelijk afgekapt tekstblok gevonden (1 voorbeelden).
- Lage palet-overlap met homepage (3/10 tokenkleuren).

Signalen: Outfit=true, tokengebruik=13, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/dev-mission-capture-mission-pitch-police-mobile.png`

### /login (desktop)

Score: **92** - **partial**

Issues:
- Interactieve doelen kleiner dan 44px gevonden: button "Wachtwoord vergeten? Stuur resetlink" 242x16; a "Privacy" 45x15; a "Cookies" 48x15.

Warnings:
-

Signalen: Outfit=true, tokengebruik=71, oude kleurclasses=1, logo=true, productbeelden=false
Screenshot: `screenshots/login-desktop.png`
Oude kleurclasses: `text-slate-500`

### /login (mobile)

Score: **92** - **partial**

Issues:
- Interactieve doelen kleiner dan 44px gevonden: button "Wachtwoord vergeten? Stuur resetlink" 242x16; a "Privacy" 45x15; a "Cookies" 48x15.

Warnings:
-

Signalen: Outfit=true, tokengebruik=71, oude kleurclasses=1, logo=true, productbeelden=false
Screenshot: `screenshots/login-mobile.png`
Oude kleurclasses: `text-slate-500`

### /pilot (desktop)

Score: **44** - **not-updated**

Issues:
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Veel oude Tailwind-kleurfamilies gevonden (79 matches, bijv. bg-slate-50, border-slate-100, text-slate-500, text-indigo-600, bg-indigo-50).
- Interactieve doelen kleiner dan 44px gevonden: input 1x1; a "privacyverklaring" 97x15; a "Compliance Hub" 93x15.

Warnings:
- H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines.
- Beperkt design.md tokengebruik zichtbaar (36 gemeten stijldeclaraties).
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=36, oude kleurclasses=79, logo=true, productbeelden=false
Screenshot: `screenshots/pilot-desktop.png`
Oude kleurclasses: `bg-slate-50`, `border-slate-100`, `text-slate-500`, `text-indigo-600`, `bg-indigo-50`, `text-slate-900`, `text-slate-600`, `border-slate-200`, `ring-indigo-200`, `border-indigo-500`

### /pilot (mobile)

Score: **44** - **not-updated**

Issues:
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Veel oude Tailwind-kleurfamilies gevonden (77 matches, bijv. bg-slate-50, border-slate-100, text-slate-500, text-indigo-600, bg-indigo-50).
- Interactieve doelen kleiner dan 44px gevonden: input 1x1; a "privacyverklaring" 97x15; a "Compliance Hub" 93x15.

Warnings:
- H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines.
- Beperkt design.md tokengebruik zichtbaar (36 gemeten stijldeclaraties).
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=36, oude kleurclasses=77, logo=true, productbeelden=false
Screenshot: `screenshots/pilot-mobile.png`
Oude kleurclasses: `bg-slate-50`, `border-slate-100`, `text-slate-500`, `text-indigo-600`, `bg-indigo-50`, `text-slate-900`, `text-slate-600`, `border-slate-200`, `ring-indigo-200`, `border-indigo-500`

### /ict/privacy/cookies (desktop)

Score: **57** - **partial**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Interactieve doelen kleiner dan 44px gevonden: a "Terug naar Security & Privacy" 247x24; button "Klik hier om de cookie-banner opnieuw te tonen" 369x24.

Warnings:
- Beperkt design.md tokengebruik zichtbaar (28 gemeten stijldeclaraties).
- Nog oude Tailwind-kleurfamilies zichtbaar (31 matches).
- Geen zichtbare nav/header gevonden.

Signalen: Outfit=true, tokengebruik=28, oude kleurclasses=31, logo=false, productbeelden=false
Screenshot: `screenshots/ict-privacy-cookies-desktop.png`
Oude kleurclasses: `bg-slate-50`, `text-slate-500`, `text-indigo-600`, `border-slate-200`, `text-slate-900`, `text-slate-600`, `text-slate-800`, `text-indigo-800`

### /ict/privacy/cookies (mobile)

Score: **58** - **partial**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Interactieve doelen kleiner dan 44px gevonden: a "Terug naar Security & Privacy" 247x24.

Warnings:
- Beperkt design.md tokengebruik zichtbaar (28 gemeten stijldeclaraties).
- Nog oude Tailwind-kleurfamilies zichtbaar (31 matches).
- Geen zichtbare nav/header gevonden.

Signalen: Outfit=true, tokengebruik=28, oude kleurclasses=31, logo=false, productbeelden=false
Screenshot: `screenshots/ict-privacy-cookies-mobile.png`
Oude kleurclasses: `bg-slate-50`, `text-slate-500`, `text-indigo-600`, `border-slate-200`, `text-slate-900`, `text-slate-600`, `text-slate-800`, `text-indigo-800`

### /ict/privacy/policy (desktop)

Score: **57** - **partial**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Interactieve doelen kleiner dan 44px gevonden: a "Terug naar Security & Privacy" 247x24; a "hun website" 87x18.

Warnings:
- Beperkt design.md tokengebruik zichtbaar (23 gemeten stijldeclaraties).
- Nog oude Tailwind-kleurfamilies zichtbaar (29 matches).
- Geen zichtbare nav/header gevonden.

Signalen: Outfit=true, tokengebruik=23, oude kleurclasses=29, logo=false, productbeelden=false
Screenshot: `screenshots/ict-privacy-policy-desktop.png`
Oude kleurclasses: `bg-slate-50`, `text-slate-500`, `text-indigo-600`, `border-slate-200`, `bg-indigo-100`, `text-slate-900`, `text-slate-600`, `bg-slate-100`, `border-slate-100`, `text-slate-800`

### /ict/privacy/policy (mobile)

Score: **58** - **partial**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Interactieve doelen kleiner dan 44px gevonden: a "Terug naar Security & Privacy" 247x24.

Warnings:
- Beperkt design.md tokengebruik zichtbaar (23 gemeten stijldeclaraties).
- Nog oude Tailwind-kleurfamilies zichtbaar (29 matches).
- Geen zichtbare nav/header gevonden.

Signalen: Outfit=true, tokengebruik=23, oude kleurclasses=29, logo=false, productbeelden=false
Screenshot: `screenshots/ict-privacy-policy-mobile.png`
Oude kleurclasses: `bg-slate-50`, `text-slate-500`, `text-indigo-600`, `border-slate-200`, `bg-indigo-100`, `text-slate-900`, `text-slate-600`, `bg-slate-100`, `border-slate-100`, `text-slate-800`

### /ict/privacy/ai (desktop)

Score: **48** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Weinig design.md tokengebruik zichtbaar (17 gemeten stijldeclaraties).
- Interactieve doelen kleiner dan 44px gevonden: a "Terug naar Security & Privacy" 247x24; a "privacy@dgskills.app" 136x17.

Warnings:
- Nog oude Tailwind-kleurfamilies zichtbaar (20 matches).
- Geen zichtbare nav/header gevonden.

Signalen: Outfit=true, tokengebruik=17, oude kleurclasses=20, logo=false, productbeelden=false
Screenshot: `screenshots/ict-privacy-ai-desktop.png`
Oude kleurclasses: `bg-slate-50`, `text-slate-500`, `text-indigo-600`, `border-slate-200`, `bg-purple-100`, `text-slate-900`, `text-slate-600`, `bg-indigo-50`, `border-indigo-100`, `text-indigo-900`

### /ict/privacy/ai (mobile)

Score: **48** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Weinig design.md tokengebruik zichtbaar (17 gemeten stijldeclaraties).
- Interactieve doelen kleiner dan 44px gevonden: a "Terug naar Security & Privacy" 247x24; a "privacy@dgskills.app" 136x17.

Warnings:
- Nog oude Tailwind-kleurfamilies zichtbaar (20 matches).
- Geen zichtbare nav/header gevonden.

Signalen: Outfit=true, tokengebruik=17, oude kleurclasses=20, logo=false, productbeelden=false
Screenshot: `screenshots/ict-privacy-ai-mobile.png`
Oude kleurclasses: `bg-slate-50`, `text-slate-500`, `text-indigo-600`, `border-slate-200`, `bg-purple-100`, `text-slate-900`, `text-slate-600`, `bg-indigo-50`, `border-indigo-100`, `text-indigo-900`

### /scholen (desktop)

Score: **76** - **partial**

Issues:
- Homepage gebruikt niet zichtbaar de lockup volgens design.md.

Warnings:
- Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens.
- Kleine nav/footer-links gevonden (1); check handmatig of de klikruimte minimaal 44px is.
- Mogelijk afgekapt tekstblok gevonden (5 voorbeelden).

Signalen: Outfit=true, tokengebruik=263, oude kleurclasses=0, logo=true, productbeelden=true
Screenshot: `screenshots/scholen-desktop.png`
Designbeelden: `/screenshots/new-dashboard-missions.png`, `/screenshots/student-dashboard.webp`

### /scholen (mobile)

Score: **76** - **partial**

Issues:
- Homepage gebruikt niet zichtbaar de lockup volgens design.md.

Warnings:
- Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens.
- Kleine nav/footer-links gevonden (1); check handmatig of de klikruimte minimaal 44px is.
- Mogelijk afgekapt tekstblok gevonden (8 voorbeelden).

Signalen: Outfit=true, tokengebruik=328, oude kleurclasses=0, logo=true, productbeelden=true
Screenshot: `screenshots/scholen-mobile.png`
Designbeelden: `/screenshots/new-dashboard-missions.png`, `/screenshots/prompt-master.webp`, `/screenshots/student-progress-xp.webp`, `/screenshots/student-dashboard.webp`, `/screenshots/student-dashboard.webp`

### /compliance-hub (desktop)

Score: **62** - **partial**

Issues:
- Veel oude Tailwind-kleurfamilies gevonden (264 matches, bijv. bg-slate-50, border-slate-100, text-slate-500, text-indigo-600, bg-indigo-50).

Warnings:
- H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines.
- Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Kleine nav/footer-links gevonden (12); check handmatig of de klikruimte minimaal 44px is.

Signalen: Outfit=true, tokengebruik=108, oude kleurclasses=264, logo=true, productbeelden=false
Screenshot: `screenshots/compliance-hub-desktop.png`
Oude kleurclasses: `bg-slate-50`, `border-slate-100`, `text-slate-500`, `text-indigo-600`, `bg-indigo-50`, `text-slate-900`, `text-slate-600`, `text-slate-400`, `bg-slate-100`, `border-indigo-200`

### /compliance-hub (mobile)

Score: **62** - **partial**

Issues:
- Veel oude Tailwind-kleurfamilies gevonden (264 matches, bijv. bg-slate-50, border-slate-100, text-slate-500, text-indigo-600, bg-indigo-50).

Warnings:
- H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines.
- Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Kleine nav/footer-links gevonden (12); check handmatig of de klikruimte minimaal 44px is.

Signalen: Outfit=true, tokengebruik=108, oude kleurclasses=264, logo=true, productbeelden=false
Screenshot: `screenshots/compliance-hub-mobile.png`
Oude kleurclasses: `bg-slate-50`, `border-slate-100`, `text-slate-500`, `text-indigo-600`, `bg-indigo-50`, `text-slate-900`, `text-slate-600`, `text-slate-400`, `bg-slate-100`, `border-indigo-200`

### /ict/privacy (desktop)

Score: **22** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Veel oude Tailwind-kleurfamilies gevonden (50 matches, bijv. text-slate-500, text-indigo-600, text-slate-900, text-slate-600, bg-indigo-50).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Interactieve doelen kleiner dan 44px gevonden: a "Lees onze AI-Transparantieverklaring" 268x18; a "→ Volledige Privacyverklaring" 205x20; a "→ Cookiebeleid" 107x20.

Warnings:
- H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines.
- Beperkt design.md tokengebruik zichtbaar (20 gemeten stijldeclaraties).
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=20, oude kleurclasses=50, logo=false, productbeelden=false
Screenshot: `screenshots/ict-privacy-desktop.png`
Oude kleurclasses: `text-slate-500`, `text-indigo-600`, `text-slate-900`, `text-slate-600`, `bg-indigo-50`, `border-indigo-100`, `bg-emerald-50`, `border-emerald-100`, `text-emerald-600`, `text-indigo-800`

### /ict/privacy (mobile)

Score: **22** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Veel oude Tailwind-kleurfamilies gevonden (50 matches, bijv. text-slate-500, text-indigo-600, text-slate-900, text-slate-600, bg-indigo-50).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Interactieve doelen kleiner dan 44px gevonden: a "Lees onze AI-Transparantieverklaring" 268x18; a "→ Volledige Privacyverklaring" 205x20; a "→ Cookiebeleid" 107x20.

Warnings:
- H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines.
- Beperkt design.md tokengebruik zichtbaar (20 gemeten stijldeclaraties).
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=20, oude kleurclasses=50, logo=false, productbeelden=false
Screenshot: `screenshots/ict-privacy-mobile.png`
Oude kleurclasses: `text-slate-500`, `text-indigo-600`, `text-slate-900`, `text-slate-600`, `bg-indigo-50`, `border-indigo-100`, `bg-emerald-50`, `border-emerald-100`, `text-emerald-600`, `text-indigo-800`

### /ict (desktop)

Score: **66** - **partial**

Issues:
- Veel oude Tailwind-kleurfamilies gevonden (109 matches, bijv. text-slate-500, text-slate-900, text-indigo-600, bg-indigo-600, bg-indigo-700).

Warnings:
- Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Kleine nav/footer-links gevonden (12); check handmatig of de klikruimte minimaal 44px is.
- Mogelijk afgekapt tekstblok gevonden (1 voorbeelden).

Signalen: Outfit=true, tokengebruik=52, oude kleurclasses=109, logo=true, productbeelden=false
Screenshot: `screenshots/ict-desktop.png`
Oude kleurclasses: `text-slate-500`, `text-slate-900`, `text-indigo-600`, `bg-indigo-600`, `bg-indigo-700`, `bg-slate-50`, `border-slate-100`, `bg-slate-100`, `bg-indigo-500`, `text-slate-600`

### /ict (mobile)

Score: **59** - **partial**

Issues:
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Veel oude Tailwind-kleurfamilies gevonden (98 matches, bijv. text-slate-900, text-slate-500, bg-slate-50, border-slate-100, bg-slate-100).

Warnings:
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Kleine nav/footer-links gevonden (7); check handmatig of de klikruimte minimaal 44px is.
- Mogelijk afgekapt tekstblok gevonden (1 voorbeelden).

Signalen: Outfit=true, tokengebruik=48, oude kleurclasses=98, logo=true, productbeelden=false
Screenshot: `screenshots/ict-mobile.png`
Oude kleurclasses: `text-slate-900`, `text-slate-500`, `bg-slate-50`, `border-slate-100`, `bg-slate-100`, `bg-indigo-500`, `text-indigo-600`, `text-slate-600`, `border-slate-200`, `text-slate-400`

### /compliance/dpa-dgskills-v4.html (desktop)

Score: **16** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Outfit is niet zichtbaar als primaire fontfamilie.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #f8fafc, app #ffffff).
- Weinig design.md tokengebruik zichtbaar (0 gemeten stijldeclaraties).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- H1 kleur #312e81 wijkt af van ink/teal.
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Lage palet-overlap met homepage (0/10 tokenkleuren).

Signalen: Outfit=false, tokengebruik=0, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/compliance-dpa-dgskills-v4.html-desktop.png`

### /compliance/dpa-dgskills-v4.html (mobile)

Score: **4** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Outfit is niet zichtbaar als primaire fontfamilie.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #f8fafc, app #ffffff).
- Weinig design.md tokengebruik zichtbaar (0 gemeten stijldeclaraties).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Horizontale overflow: scrollWidth 535px tegenover viewport 390px.

Warnings:
- H1 kleur #312e81 wijkt af van ink/teal.
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Lage palet-overlap met homepage (0/10 tokenkleuren).

Signalen: Outfit=false, tokengebruik=0, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/compliance-dpa-dgskills-v4.html-mobile.png`

### /ict/technisch (desktop)

Score: **39** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines.
- Beperkt design.md tokengebruik zichtbaar (24 gemeten stijldeclaraties).
- Nog oude Tailwind-kleurfamilies zichtbaar (45 matches).
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=24, oude kleurclasses=45, logo=false, productbeelden=false
Screenshot: `screenshots/ict-technisch-desktop.png`
Oude kleurclasses: `bg-slate-50`, `text-slate-500`, `text-indigo-600`, `text-slate-900`, `text-slate-600`, `bg-indigo-600`, `border-slate-200`, `text-emerald-500`, `bg-indigo-900`, `bg-indigo-500`

### /ict/technisch (mobile)

Score: **39** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines.
- Beperkt design.md tokengebruik zichtbaar (23 gemeten stijldeclaraties).
- Nog oude Tailwind-kleurfamilies zichtbaar (44 matches).
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=23, oude kleurclasses=44, logo=false, productbeelden=false
Screenshot: `screenshots/ict-technisch-mobile.png`
Oude kleurclasses: `bg-slate-50`, `text-slate-500`, `text-indigo-600`, `text-slate-900`, `text-slate-600`, `bg-indigo-600`, `border-slate-200`, `text-emerald-500`, `bg-indigo-900`, `border-indigo-900`

### /ict/support (desktop)

Score: **29** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Veel oude Tailwind-kleurfamilies gevonden (51 matches, bijv. bg-slate-50, text-slate-500, text-indigo-600, text-slate-900, text-slate-600).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines.
- Beperkt design.md tokengebruik zichtbaar (21 gemeten stijldeclaraties).
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=21, oude kleurclasses=51, logo=false, productbeelden=false
Screenshot: `screenshots/ict-support-desktop.png`
Oude kleurclasses: `bg-slate-50`, `text-slate-500`, `text-indigo-600`, `text-slate-900`, `text-slate-600`, `border-slate-200`, `text-emerald-600`, `border-slate-100`, `text-slate-400`, `bg-blue-50`

### /ict/support (mobile)

Score: **29** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Veel oude Tailwind-kleurfamilies gevonden (51 matches, bijv. bg-slate-50, text-slate-500, text-indigo-600, text-slate-900, text-slate-600).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines.
- Beperkt design.md tokengebruik zichtbaar (21 gemeten stijldeclaraties).
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=21, oude kleurclasses=51, logo=false, productbeelden=false
Screenshot: `screenshots/ict-support-mobile.png`
Oude kleurclasses: `bg-slate-50`, `text-slate-500`, `text-indigo-600`, `text-slate-900`, `text-slate-600`, `border-slate-200`, `text-emerald-600`, `border-slate-100`, `text-slate-400`, `bg-blue-50`

### /compliance/school-compliance-guide.html (desktop)

Score: **18** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Outfit is niet zichtbaar als primaire fontfamilie.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #ffffff, app #000000).
- Weinig design.md tokengebruik zichtbaar (0 gemeten stijldeclaraties).
- Interactieve doelen kleiner dan 44px gevonden: a "Bekijk Template" 130x19; a "Bekijk Document" 137x19.

Warnings:
- H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines.
- H1 kleur #3730a3 wijkt af van ink/teal.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Lage palet-overlap met homepage (0/10 tokenkleuren).

Signalen: Outfit=false, tokengebruik=0, oude kleurclasses=0, logo=true, productbeelden=false
Screenshot: `screenshots/compliance-school-compliance-guide.html-desktop.png`

### /compliance/school-compliance-guide.html (mobile)

Score: **12** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Outfit is niet zichtbaar als primaire fontfamilie.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #ffffff, app #000000).
- Weinig design.md tokengebruik zichtbaar (0 gemeten stijldeclaraties).
- Horizontale overflow: scrollWidth 473px tegenover viewport 390px.

Warnings:
- H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines.
- H1 kleur #3730a3 wijkt af van ink/teal.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Lage palet-overlap met homepage (0/10 tokenkleuren).

Signalen: Outfit=false, tokengebruik=0, oude kleurclasses=0, logo=true, productbeelden=false
Screenshot: `screenshots/compliance-school-compliance-guide.html-mobile.png`

### /compliance/dpia-support-dgskills-v1.html (desktop)

Score: **16** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Outfit is niet zichtbaar als primaire fontfamilie.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #f8fafc, app #ffffff).
- Weinig design.md tokengebruik zichtbaar (0 gemeten stijldeclaraties).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- H1 kleur #064e3b wijkt af van ink/teal.
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Lage palet-overlap met homepage (0/10 tokenkleuren).

Signalen: Outfit=false, tokengebruik=0, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/compliance-dpia-support-dgskills-v1.html-desktop.png`

### /compliance/dpia-support-dgskills-v1.html (mobile)

Score: **16** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Outfit is niet zichtbaar als primaire fontfamilie.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #f8fafc, app #ffffff).
- Weinig design.md tokengebruik zichtbaar (0 gemeten stijldeclaraties).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- H1 kleur #064e3b wijkt af van ink/teal.
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Lage palet-overlap met homepage (0/10 tokenkleuren).

Signalen: Outfit=false, tokengebruik=0, oude kleurclasses=0, logo=false, productbeelden=false
Screenshot: `screenshots/compliance-dpia-support-dgskills-v1.html-mobile.png`

### /compliance/checklist (desktop)

Score: **24** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Veel oude Tailwind-kleurfamilies gevonden (229 matches, bijv. bg-slate-50, border-slate-100, text-slate-900, text-slate-500, bg-slate-900).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Interactieve doelen kleiner dan 44px gevonden: button 20x20; button 20x20; button 20x20.

Warnings:
- H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines.
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=49, oude kleurclasses=229, logo=false, productbeelden=false
Screenshot: `screenshots/compliance-checklist-desktop.png`
Oude kleurclasses: `bg-slate-50`, `border-slate-100`, `text-slate-900`, `text-slate-500`, `bg-slate-900`, `bg-slate-800`, `text-slate-700`, `bg-emerald-50`, `text-emerald-700`, `bg-indigo-50`

### /compliance/checklist (mobile)

Score: **24** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Veel oude Tailwind-kleurfamilies gevonden (229 matches, bijv. bg-slate-50, border-slate-100, text-slate-900, text-slate-500, bg-slate-900).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Interactieve doelen kleiner dan 44px gevonden: button "Print / Opslaan als PDF" 169x32; button 20x20; button 20x20.

Warnings:
- H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines.
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=49, oude kleurclasses=229, logo=false, productbeelden=false
Screenshot: `screenshots/compliance-checklist-mobile.png`
Oude kleurclasses: `bg-slate-50`, `border-slate-100`, `text-slate-900`, `text-slate-500`, `bg-slate-900`, `bg-slate-800`, `text-slate-700`, `bg-emerald-50`, `text-emerald-700`, `bg-indigo-50`

### /compliance/slo-rapport (desktop)

Score: **38** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Veel oude Tailwind-kleurfamilies gevonden (97 matches, bijv. bg-slate-50, border-slate-100, text-slate-900, text-slate-500, text-slate-600).

Warnings:
- H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines.
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Kleine nav/footer-links gevonden (1); check handmatig of de klikruimte minimaal 44px is.
- Mogelijke nested-card patronen gevonden (6 voorbeelden).

Signalen: Outfit=true, tokengebruik=45, oude kleurclasses=97, logo=true, productbeelden=false
Screenshot: `screenshots/compliance-slo-rapport-desktop.png`
Oude kleurclasses: `bg-slate-50`, `border-slate-100`, `text-slate-900`, `text-slate-500`, `text-slate-600`, `text-slate-400`, `border-slate-50`, `bg-blue-50`, `text-blue-700`, `bg-emerald-50`

### /compliance/slo-rapport (mobile)

Score: **38** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Veel oude Tailwind-kleurfamilies gevonden (97 matches, bijv. bg-slate-50, border-slate-100, text-slate-900, text-slate-500, text-slate-600).

Warnings:
- H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines.
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Kleine nav/footer-links gevonden (1); check handmatig of de klikruimte minimaal 44px is.
- Mogelijke nested-card patronen gevonden (6 voorbeelden).

Signalen: Outfit=true, tokengebruik=45, oude kleurclasses=97, logo=true, productbeelden=false
Screenshot: `screenshots/compliance-slo-rapport-mobile.png`
Oude kleurclasses: `bg-slate-50`, `border-slate-100`, `text-slate-900`, `text-slate-500`, `text-slate-600`, `text-slate-400`, `border-slate-50`, `bg-blue-50`, `text-blue-700`, `bg-emerald-50`

### /slo-kerndoelen-digitale-geletterdheid (desktop)

Score: **52** - **not-updated**

Issues:
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Weinig design.md tokengebruik zichtbaar (15 gemeten stijldeclaraties).
- Interactieve doelen kleiner dan 44px gevonden: input 1x1; a "privacyverklaring" 90x13.

Warnings:
- Nog oude Tailwind-kleurfamilies zichtbaar (30 matches).
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=15, oude kleurclasses=30, logo=true, productbeelden=false
Screenshot: `screenshots/slo-kerndoelen-digitale-geletterdheid-desktop.png`
Oude kleurclasses: `border-slate-100`, `text-slate-600`, `text-slate-900`, `bg-indigo-600`, `bg-indigo-700`, `border-slate-200`, `bg-slate-50`, `bg-emerald-600`, `text-emerald-600`, `text-slate-700`

### /slo-kerndoelen-digitale-geletterdheid (mobile)

Score: **52** - **not-updated**

Issues:
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Weinig design.md tokengebruik zichtbaar (15 gemeten stijldeclaraties).
- Interactieve doelen kleiner dan 44px gevonden: input 1x1; a "privacyverklaring" 90x13.

Warnings:
- Nog oude Tailwind-kleurfamilies zichtbaar (30 matches).
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=15, oude kleurclasses=30, logo=true, productbeelden=false
Screenshot: `screenshots/slo-kerndoelen-digitale-geletterdheid-mobile.png`
Oude kleurclasses: `border-slate-100`, `text-slate-600`, `text-slate-900`, `bg-indigo-600`, `bg-indigo-700`, `border-slate-200`, `bg-slate-50`, `bg-emerald-600`, `text-emerald-600`, `text-slate-700`

### /ict/integraties (desktop)

Score: **29** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Veel oude Tailwind-kleurfamilies gevonden (84 matches, bijv. bg-slate-50, text-slate-500, text-indigo-600, text-slate-900, text-slate-600).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines.
- Beperkt design.md tokengebruik zichtbaar (34 gemeten stijldeclaraties).
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=34, oude kleurclasses=84, logo=false, productbeelden=false
Screenshot: `screenshots/ict-integraties-desktop.png`
Oude kleurclasses: `bg-slate-50`, `text-slate-500`, `text-indigo-600`, `text-slate-900`, `text-slate-600`, `border-slate-200`, `border-slate-100`, `text-slate-400`, `bg-emerald-100`, `text-emerald-700`

### /ict/integraties (mobile)

Score: **29** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Veel oude Tailwind-kleurfamilies gevonden (84 matches, bijv. bg-slate-50, text-slate-500, text-indigo-600, text-slate-900, text-slate-600).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines.
- Beperkt design.md tokengebruik zichtbaar (34 gemeten stijldeclaraties).
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.

Signalen: Outfit=true, tokengebruik=34, oude kleurclasses=84, logo=false, productbeelden=false
Screenshot: `screenshots/ict-integraties-mobile.png`
Oude kleurclasses: `bg-slate-50`, `text-slate-500`, `text-indigo-600`, `text-slate-900`, `text-slate-600`, `border-slate-200`, `border-slate-100`, `text-slate-400`, `bg-emerald-100`, `text-emerald-700`

### /ict/implementatiegids (desktop)

Score: **29** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Veel oude Tailwind-kleurfamilies gevonden (126 matches, bijv. bg-slate-50, text-slate-500, text-indigo-600, text-slate-900, text-slate-600).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Interactieve doelen kleiner dan 44px gevonden: a "support@dgskills.app" 144x17; a "support@dgskills.app" 144x17; a "privacyverklaring" 97x15.

Warnings:
- H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines.
- Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens.
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Mogelijke nested-card patronen gevonden (8 voorbeelden).

Signalen: Outfit=true, tokengebruik=62, oude kleurclasses=126, logo=false, productbeelden=false
Screenshot: `screenshots/ict-implementatiegids-desktop.png`
Oude kleurclasses: `bg-slate-50`, `text-slate-500`, `text-indigo-600`, `text-slate-900`, `text-slate-600`, `bg-indigo-50`, `text-indigo-700`, `bg-emerald-50`, `text-emerald-700`, `border-slate-200`

### /ict/implementatiegids (mobile)

Score: **27** - **not-updated**

Issues:
- Geen `<main>` gevonden; publieke pageshell/designstructuur ontbreekt waarschijnlijk.
- Veel oude Tailwind-kleurfamilies gevonden (126 matches, bijv. bg-slate-50, text-slate-500, text-indigo-600, text-slate-900, text-slate-600).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.
- Interactieve doelen kleiner dan 44px gevonden: a "support@dgskills.app" 144x17; a "support@dgskills.app" 144x17; a "privacyverklaring" 97x15.

Warnings:
- H1 font-weight is 700; homepage-richting vraagt zware afgeronde headlines.
- Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens.
- Geen zichtbare nav/header gevonden.
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Mogelijk afgekapt tekstblok gevonden (1 voorbeelden).
- Mogelijke nested-card patronen gevonden (8 voorbeelden).

Signalen: Outfit=true, tokengebruik=62, oude kleurclasses=126, logo=false, productbeelden=false
Screenshot: `screenshots/ict-implementatiegids-mobile.png`
Oude kleurclasses: `bg-slate-50`, `text-slate-500`, `text-indigo-600`, `text-slate-900`, `text-slate-600`, `bg-indigo-50`, `text-indigo-700`, `bg-emerald-50`, `text-emerald-700`, `border-slate-200`

### /digitale-geletterdheid-vo (desktop)

Score: **47** - **not-updated**

Issues:
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Weinig design.md tokengebruik zichtbaar (8 gemeten stijldeclaraties).
- Interactieve doelen kleiner dan 44px gevonden: input 1x1; a "privacyverklaring" 90x13.

Warnings:
- Nog oude Tailwind-kleurfamilies zichtbaar (30 matches).
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Mogelijke nested-card patronen gevonden (6 voorbeelden).

Signalen: Outfit=true, tokengebruik=8, oude kleurclasses=30, logo=true, productbeelden=false
Screenshot: `screenshots/digitale-geletterdheid-vo-desktop.png`
Oude kleurclasses: `border-slate-100`, `text-slate-600`, `text-slate-900`, `bg-indigo-600`, `bg-indigo-700`, `border-slate-200`, `bg-slate-50`, `text-indigo-600`, `bg-slate-900`, `text-slate-300`

### /digitale-geletterdheid-vo (mobile)

Score: **47** - **not-updated**

Issues:
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Weinig design.md tokengebruik zichtbaar (8 gemeten stijldeclaraties).
- Interactieve doelen kleiner dan 44px gevonden: input 1x1; a "privacyverklaring" 90x13.

Warnings:
- Nog oude Tailwind-kleurfamilies zichtbaar (30 matches).
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Mogelijke nested-card patronen gevonden (6 voorbeelden).

Signalen: Outfit=true, tokengebruik=8, oude kleurclasses=30, logo=true, productbeelden=false
Screenshot: `screenshots/digitale-geletterdheid-vo-mobile.png`
Oude kleurclasses: `border-slate-100`, `text-slate-600`, `text-slate-900`, `bg-indigo-600`, `bg-indigo-700`, `border-slate-200`, `bg-slate-50`, `text-indigo-600`, `bg-slate-900`, `text-slate-300`
