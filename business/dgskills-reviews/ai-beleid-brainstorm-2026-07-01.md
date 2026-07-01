# Fix-pass rapport — ai-beleid-brainstorm — 2026-07-01

**Mission ID:** ai-beleid-brainstorm
**Fix-pass op:** `business/dgskills-reviews/ai-beleid-brainstorm-2026-06-17.md` (M4 batch-review, 17 juni 2026)
**Cyclus:** 1 (wave 6, fix-inhaalslag)
**Whitelist:**
- `src/config/agents/year1.tsx` (alleen agent-rol-entry ai-beleid-brainstorm)
- `src/config/agents/year2.tsx`, `year3.tsx` (n.v.t. — missie zit alleen in year1)
- `src/config/templateRegistry.ts` (n.v.t. — geen entry, agent-role-missie zonder template-config)
- `src/config/slo-kerndoelen-mapping.ts` (alleen ai-beleid-brainstorm-entry)
- `src/config/curriculum.ts` (alleen ai-beleid-brainstorm-entry)
- `src/config/missionGoals.ts` (alleen ai-beleid-brainstorm-entry)

---

## ✅ Toegepaste fixes (1)

- `src/config/missionGoals.ts:130` — comment-blok met 3 impliciete leerdoelen (Bloom-actiewerkwoorden: benoemt / formuleert / evalueert) toegevoegd boven de `ai-beleid-brainstorm`-entry. Puur documentatie, geen functionele wijziging — `MissionGoal`-type (`src/features/missions/templates/shared/types.ts:17-21`) heeft geen `learningObjectives`-veld, dus het rapport's eigen voorstel (comment i.p.v. type-veld) was correct. (sectie: didactiek, criterium 3)

---

## ⏭️ Geskipte voorstellen (0)

Geen — beide overige whitelist-relevante rapport-punten (Bloom-reflectievraag, AI-as-copilot fallback) waren prosa-suggesties zonder concreet before/after-codeblok, dus geen parseerbare fix-actie (conform instructie: alleen machine-leesbare voorstel-blokken toepassen).

---

## ⚠️ Escalatie nodig (5)

Alle onderstaande punten waren al vooraf als escalatie aangemerkt in de opdracht-context of staan buiten de whitelist voor deze missie. Geen van deze is dit cyclus zelfstandig gefixt.

1. **Design token swap `lab-coral`/`lab-teal` → duck** (`src/config/agents/year1.tsx:3724,3736,3739,3740`) — **blijft escalatie, ondanks whitelist-match.** Dit bestand staat technisch in de whitelist (agent-rol-entry year1.tsx), maar de opdracht-context markeert dit expliciet als een reeds eerder geëscaleerde visuele-identiteitswijziging waar Yorin over beslist. Extra bevestiging: `duck-coral`/`duck-teal` bestaan niet als tokens — het duck-palet in `tailwind.shared.js:8-15` heeft alleen `bg/bgLight/ink/acid/gray/error`. Het rapport's eigen voorstel gebruikt overigens wél bestaande tokens (`duck-error`/`duck-ink`, technisch uitvoerbaar), maar de aard van de wijziging (kleur-identiteit van de briefing-kaart) blijft een designbeslissing → **niet toegepast, escalatie naar Yorin.**
2. **Ontbrekende `aria-label` op stemknop** (`src/features/ai-lab/previews/AiBeleidBrainstormPreview.tsx:675`) — component-bestand staat niet in de whitelist voor deze missie (whitelist bevat alleen config-bestanden). **Scope-uitbreiding nodig** als dit gefixt moet worden.
3. **SLO-inconsistentie `ProjectZeroDashboard.tsx:142`** (`sloKerndoelen: ['23B','23C']` vs. autoritaire mapping) — geverifieerd: `src/config/slo-kerndoelen-mapping.ts:51` heeft voor ai-beleid-brainstorm `sloKerndoelen: ['21D','23C']` met comment `// 23B→21D: gaat over AI-regels, niet persoonlijk welzijn`. De centrale mapping is dus zelf al correct; het datalek zit uitsluitend in `ProjectZeroDashboard.tsx`, dat buiten de whitelist valt. **Scope-uitbreiding nodig** om dit te fixen.
4. **`studentName` niet opgeslagen in `ai_beleid_feedback`-insert** (`src/services/teacherService.ts:558-576`) — raakt database-insert-logica en persoonsgegevens-herleidbaarheid → categorie data/persoonsgegevens, conform instructie NOOIT autonoom fixen. **Directe Yorin-escalatie.**
5. **`any`-type in `stemOpIdee` RPC-return** (`src/services/teacherService.ts:641`) — technische kwaliteitsverbetering buiten whitelist (teacherService.ts). Laag risico, kan meelopen met punt 4 als dat bestand toch wordt aangepakt.

---

## Volgende stap

Eén fix toegepast (documentatie-only, geen build-impact verwacht). Re-run M2 review (cyclus 2/3) is optioneel gezien de overige 5 punten allemaal buiten scope/whitelist vallen en niet door een herhaalde M2-pass worden opgelost — ze vereisen ofwel Yorin's directe beslissing (design-token-identiteit, persoonsgegevens-insert) ofwel een expliciete scope-uitbreiding van de whitelist (aria-label, SLO-dashboard-sync, RPC-type). Aanbeveling: bundel punt 2 + 3 (beide kleine, niet-risicovolle fixes buiten whitelist) als één scope-uitbreidingsverzoek aan de orchestrator/Yorin; punt 1 en 4 blijven losse Yorin-beslissingen.
