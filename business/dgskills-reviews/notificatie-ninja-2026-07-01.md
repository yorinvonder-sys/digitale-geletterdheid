# Mission-fixer rapport — cyclus 1

**Mission ID:** notificatie-ninja
**Rapport-bron:** `business/dgskills-reviews/notificatie-ninja-2026-06-17.md`
**Fix-pass op:** review van 2026-06-17 (M4 batch-review-pipeline wave-2), 2 weken later opnieuw doorlopen als M4 wave-5 fix-inhaalslag
**Whitelist:**
- `src/features/missions/templates/scenario-engine/configs/notificatie-ninja.ts`
- `src/config/templateRegistry.ts` (alleen entry notificatie-ninja)
- `src/config/agents/year1.tsx`, `year2.tsx`, `year3.tsx` (alleen agent-rol entry notificatie-ninja)
- `src/config/slo-kerndoelen-mapping.ts` (alleen entry notificatie-ninja)
- `src/config/curriculum.ts` (alleen entry notificatie-ninja)
- `src/config/missionGoals.ts` (alleen entry notificatie-ninja)

## ✅ Toegepaste fixes (0)

Geen. Zie toelichting hieronder.

## ⏭️ Geskipte voorstellen (5)

- `notificatie-ninja.ts` — **geen machine-leesbaar voorstel:** Design-review "Visual Precision Gate — unverified" (ronde 2 mobiel). Alleen een rapporteer-actie ("dynamische verificatie op localhost:5173 na merge"), geen before/after code-blok.
- `notificatie-ninja.ts:154-248` — **geen machine-leesbaar voorstel:** Didactiek criterium 4 (cognitieve load ronde 2, 8 items order-priority). Rapport geeft alleen prosa ("overweeg te splitsen... of te beperken tot top-3"), geen concreet, ondubbelzinnig before/after-blok. Conform oriëntatie: structureel-didactisch → escalatie tenzij een concreet before/after-blok voorligt. Dat ontbreekt hier. Zie escalatie hieronder.
- `notificatie-ninja.ts:88, 149, 303` — **n.v.t.-voorstel:** Didactiek criterium 5 (vocabulary). Rapport zelf: "Geen blocking — uitleg-na-keuze is het gewenste patroon." Vage suggestie ("overweeg terminologie terug te brengen") zonder concreet before/after-blok — geen fix-actie.
- `notificatie-ninja.ts` (alle 4 rondes) — **geen machine-leesbaar voorstel + geen concrete ronde-aanwijzing:** `showConfidence` ontbreekt. Vergeleken met `phishing-fighter.ts:60` — patroon is mechanisch (`showConfidence: true` na `maxScore`). Maar het rapport specificeert niet concreet óp welke ronde(s) dit toegepast moet worden ("op geen enkele ronde... gemiste kans" is een algemene constatering, geen instructie voor een specifieke ronde). Conform oriëntatie ("toepasbaar als het rapport concreet aangeeft op welke rondes") is dit niet concreet genoeg om zelfstandig te beslissen welke ronde(s) de scaffolding krijgen — dat is een didactische keuze.
- `notificatie-ninja.ts:421` — **stale-check: before-snippet bestaat nog (regel 421), maar bewust niet toegepast** — zie escalatie hieronder (ronde 4, absolute claim over apps).

## ⚠️ Escalatie nodig (2)

- **Pedagogische content-beslissing (Yorin):** Didactiek criterium 7, ronde 4 item 6 `explanation` (`notificatie-ninja.ts:421`). Rapport geeft een letterlijk before/after-blok: "Radicale maatregelen werken zelden lang..." → "Voor de meeste mensen werkt dit tijdelijk; bewust gebruik leer je niet door iets weg te gooien, maar door te oefenen met instellingen." Dit is een **ronde 4 / absolute-claim-over-apps-casus** — conform expliciete oriëntatie-instructie voor deze fix-pass blijft dit type bevinding escalatie, ook mét een geleverd before/after-blok, omdat een eerdere gelijksoortige beslissing hierover al bij Yorin lag. Niet zelfstandig toegepast.
- **Structureel-didactische herziening (Yorin):** Didactiek criterium 4, ronde 2 (`rangschik-manipulatie`, `notificatie-ninja.ts:154-248`) — 8-items order-priority-ronde voor leerjaar 1 (12-13 jaar). Rapport signaleert cognitieve-overload-risico maar levert geen concreet before/after-blok (splitsen in twee rondes van 4, of reduceren tot top-3, zijn beide structuurwijzigingen die de `correctPosition`-logica en scoring van de hele ronde raken — dit is een ontwerpbeslissing, geen mechanische edit).

## Volgende stap

Alle bevindingen uit het rapport van 2026-06-17 zijn ofwel zonder concreet before/after-blok (geskipt conform anti-patroon "voorstellen uit prosa niet toepassen"), ofwel expliciet aangewezen als blijvende escalatie (ronde 4 absolute claim, ronde 2 structurele cognitieve-load-herziening). Er zijn dus **geen code-wijzigingen toegepast** in deze fix-pass.

Escaleer naar Yorin voor de twee open punten hierboven — fixer kan dit niet autonoom oplossen binnen de scope van machine-leesbare voorstellen.

---

*Gegenereerd door M4 batch-review-pipeline wave-5 (fix-inhaalslag), cyclus 1, 2026-07-01. Fix-pass op review van 2026-06-17.*
