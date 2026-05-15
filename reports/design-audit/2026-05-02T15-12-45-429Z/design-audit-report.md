# DGSkills Design Audit

Generated: 2026-05-02T15:12:47.466Z
Base URL: http://127.0.0.1:5180
Chrome: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
Design source: `/Users/yorinvonder/Downloads/ai-lab---future-architect/design.md`

## Summary

- Updated: 2
- Partial: 0
- Not updated: 2
- Routes audited: 4
- Discovery: disabled

Homepage baseline:
- Body background: `#faf9f0`
- H1 color: `#08283b`
- Token colors seen: 10
- Old color classes: 0
- Lockup logo: true

## Routes

| Route | Viewport | Score | Status | Main notes |
| --- | --- | ---: | --- | --- |
| `/` | desktop | 86 | updated | Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens.<br>Kleine nav/footer-links gevonden (11); check handmatig of de klikruimte minimaal 44px is. |
| `/` | mobile | 90 | updated | Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens.<br>Kleine nav/footer-links gevonden (6); check handmatig of de klikruimte minimaal 44px is. |
| `/ict` | desktop | 27 | not-updated | Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).<br>Weinig design.md tokengebruik zichtbaar (0 gemeten stijldeclaraties). |
| `/ict` | mobile | 27 | not-updated | Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).<br>Weinig design.md tokengebruik zichtbaar (0 gemeten stijldeclaraties). |

## Details

### / (desktop)

Score: **86** - **updated**

Issues:
-

Warnings:
- Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens.
- Kleine nav/footer-links gevonden (11); check handmatig of de klikruimte minimaal 44px is.
- Mogelijk afgekapt tekstblok gevonden (6 voorbeelden).

Signalen: Outfit=true, tokengebruik=296, oude kleurclasses=0, logo=true, productbeelden=true
Designbeelden: `/screenshots/new-dashboard-missions.png`, `/screenshots/prompt-master.webp`, `/screenshots/ai-trainer.webp`, `/screenshots/new-dashboard-missions.png`, `/screenshots/student-progress-xp.webp`, `/screenshots/new-dashboard-missions.png`, `/screenshots/student-progress-xp.webp`

### / (mobile)

Score: **90** - **updated**

Issues:
-

Warnings:
- Globale bodykleur #faf9f0 wijkt af, maar de pagina gebruikt wel nieuwe designtokens.
- Kleine nav/footer-links gevonden (6); check handmatig of de klikruimte minimaal 44px is.
- Mogelijk afgekapt tekstblok gevonden (2 voorbeelden).

Signalen: Outfit=true, tokengebruik=258, oude kleurclasses=0, logo=true, productbeelden=true
Designbeelden: `/screenshots/new-dashboard-missions.png`, `/screenshots/prompt-master.webp`, `/screenshots/new-dashboard-missions.png`, `/screenshots/student-progress-xp.webp`, `/screenshots/new-dashboard-missions.png`, `/screenshots/student-progress-xp.webp`

### /ict (desktop)

Score: **27** - **not-updated**

Issues:
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Weinig design.md tokengebruik zichtbaar (0 gemeten stijldeclaraties).
- Veel oude Tailwind-kleurfamilies gevonden (110 matches, bijv. text-slate-900, text-slate-500, text-indigo-600, bg-indigo-600, bg-indigo-700).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Kleine nav/footer-links gevonden (12); check handmatig of de klikruimte minimaal 44px is.
- Mogelijk afgekapt tekstblok gevonden (1 voorbeelden).
- Lage palet-overlap met homepage (0/10 tokenkleuren).

Signalen: Outfit=true, tokengebruik=0, oude kleurclasses=110, logo=false, productbeelden=false
Oude kleurclasses: `text-slate-900`, `text-slate-500`, `text-indigo-600`, `bg-indigo-600`, `bg-indigo-700`, `bg-slate-50`, `border-slate-100`, `bg-slate-100`, `bg-indigo-500`, `text-slate-600`

### /ict (mobile)

Score: **27** - **not-updated**

Issues:
- Pagina-achtergrond gebruikt geen cream/paper/creamDeep (body #faf9f0, app #000000).
- Weinig design.md tokengebruik zichtbaar (0 gemeten stijldeclaraties).
- Veel oude Tailwind-kleurfamilies gevonden (99 matches, bijv. text-slate-900, text-slate-500, bg-slate-50, border-slate-100, bg-slate-100).
- Geen nieuw logo.svg of logo-lockup.svg in de zichtbare header gevonden.

Warnings:
- Geen primaire DGSkills-screenshotbron uit design.md zichtbaar.
- Kleine nav/footer-links gevonden (7); check handmatig of de klikruimte minimaal 44px is.
- Mogelijk afgekapt tekstblok gevonden (1 voorbeelden).
- Lage palet-overlap met homepage (0/10 tokenkleuren).

Signalen: Outfit=true, tokengebruik=0, oude kleurclasses=99, logo=false, productbeelden=false
Oude kleurclasses: `text-slate-900`, `text-slate-500`, `bg-slate-50`, `border-slate-100`, `bg-slate-100`, `bg-indigo-500`, `text-indigo-600`, `text-slate-600`, `border-slate-200`, `text-slate-400`
