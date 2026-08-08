# UX Detective — formele review J2P3

**Datum:** 2026-08-08
**Template:** `data-viewer`
**Verdict:** ALLOW — geen open Blocker/High
**Scores:** Design 8/10 · Didactiek 8/10 · Techniek 8/10

## Scope en bewijs

- Design → Didactiek → Techniek beoordeeld op bron en werkende flow.
- Lokale start-, flow-, feedback- en eindstaat bewezen op desktop, tablet portrait, tablet landscape en mobile.
- De 16 herhaalde viewport/state-captures zijn gehasht op bron-SHA `41c1583c8782486da2b2fb50b19646ee4102e86a`.
- Productieflow op deployment `5807156586`: start, fout/herstel, completion op 75/100, reload en dashboardprogress.
- Exact productieaccount: één voltooide rij en 25 XP; na cleanup nul auth-, progress-, activity- en XP-resten.

## Beoordeling

- **Design:** tabellen, grafieken, invoer en feedback blijven bruikbaar op alle vier viewports.
- **Didactiek:** de leerling onderzoekt echte usability-data en krijgt directe vraagfeedback. Een geldige maar laag scorende poging voltooit de missie niet.
- **Techniek:** `aria-live` meldt feedback en de completion-gate volgt het echte resultaat (`DataViewer.tsx:463`, `DataViewer.tsx:474`, `DataViewer.tsx:900`).

## Bevindingen

1. **High — opgelost:** een poging kon eerder afronden zonder voldoende score. PR #294 koppelt afronding aan de resultaatstatus.
2. **Medium — open:** geldige observaties met nul punten krijgen tekst die kan suggereren dat het antwoord niet meetelt; inhoudelijk onderscheid tussen geldigheid en score kan scherper.
3. **Medium — hypothese:** de strengere betekenis-/lengtecheck kan uitzonderlijk beknopte, geldige Nederlandse antwoorden afwijzen. Symbolenrijke en langere antwoorden werkten; brede taalvariantdekking ontbreekt.
4. **Low — open:** een paar labels en toelichtingen zijn relatief dicht op mobile.

## Restpunt

Echte iPad-check nodig; Chromium-viewports bewijzen geen fysieke Safari/iPad-weergave.
