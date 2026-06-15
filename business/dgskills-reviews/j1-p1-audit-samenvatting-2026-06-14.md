# J1-P1 Audit — Geconsolideerde Samenvatting

**Batch:** Leerjaar 1, Periode 1 — "Digitale Basisvaardigheden"
**Datum:** 2026-06-14
**Pipeline:** dgskills-mission-review v1.0 · 5 missies · 3 reviewers per missie + Codex M1-gate

---

## Oordeel per missie

| # | missionId | Titel | Oordeel | Top blocker |
|---|-----------|-------|---------|-------------|
| 1 | `magister-master` | Magister Meester | **fix-eerst** | duck-namespace tokens engine-breed + maxScore: 60 → 55 |
| 2 | `cloud-commander` | Cloud Commander | **fix-eerst** | maxScore: 60 → 50 (badge "Cloud Expert" onbereikbaar) |
| 3 | `word-wizard` | Word Wizard | **fix-eerst** | iOS M365-licentievereiste niet vermeld; maxScore: 60 → 55 |
| 4 | `slide-specialist` | Slide Specialist | **fix-eerst** | "Zetelen" en "Animatievenster" bestaan niet in iOS PowerPoint |
| 5 | `print-pro` | Print Pro ⚠️ | **fix-eerst** | Geen `learningObjectives`; multi-platform stap 2 kognitief overbelastend |

**Alle 5 missies: fix-eerst.** Geen enkele missie is ship-ready zonder fixes.

---

## Engine-breed blokker (raakt alle 5 missies)

**Prioriteit 0 — Fix eerst, vóór alles.**

`tailwind.shared.js:8-15` — de `duck`-namespace mist 4 tokens:
```js
// Toevoegen aan duck-object:
coral: '#D97848',
muted: '#445865',
line: '#E7D8BD',
creamDeep: '#F3E4CB',
```

**Impact:** Alle StepCard-kleurelementen (stap-teller-dot, checklist-headers, verificatievraag-labels, teacher-check achtergrond, focus-ring) renderen transparant op alle 5 ToolGuide-missies. Dit is de enige fix die alle 5 missies tegelijk unlock.

**Bijkomend:** `focus-visible:ring-duck-coral` in `ToolGuide.tsx:234,342,374` werkt daarna automatisch → WCAG 2.1 AA 2.4.7 opgelost.

---

## Config-fixes per missie (na engine-fix)

### Magister Meester
| Prio | File | Fix |
|------|------|-----|
| HIGH | `magister-master.ts:117` | `maxScore: 60` → `maxScore: 55` |
| MED | `magister-master.ts` | Voeg `learningObjectives`-array toe (4 Bloom-geformuleerde doelen) |
| LOW | `magister-master.ts` | Voeg Bloom-3 reflectiemoment toe aan takeaways/stap 4 |

### Cloud Commander
| Prio | File | Fix |
|------|------|-----|
| HIGH | `cloud-commander.ts:86` | `maxScore: 60` → `maxScore: 50`; badge-drempels aanpassen (minScore 55→45, 40→30) |
| HIGH | `cloud-commander.ts:55-61` | Stap 3 foto-instructie: begrens tot schoolcontent ("geen portretfoto's"), voeg `teacherCheck` toe |
| MED | `cloud-commander.ts` | Voeg `learningObjectives`-array toe |
| LOW | `cloud-commander.ts:34` | iPad +-icoon locatie eenduidiger ("rechtsonder") |

### Word Wizard
| Prio | File | Fix |
|------|------|-----|
| HIGH | `word-wizard.ts:47` | Vermeld M365-licentievereiste + "penseel-icoon" → "`A`-knop" |
| HIGH | `word-wizard.ts:104` | `maxScore: 60` → `maxScore: 55` |
| HIGH | `word-wizard.ts:71` | "Klik" → "Tik"; foto-instructie beperken tot schoolcontent |
| MED | `word-wizard.ts` | Voeg `learningObjectives`-array toe |
| LOW | `word-wizard.ts:92` | VerificationQuestion stap 4 upgraden naar Bloom-3 |

### Slide Specialist
| Prio | File | Fix |
|------|------|-----|
| HIGH | `slide-specialist.ts:83` | "Zetelen" → "Schuiven" (overgang bestaat niet in PowerPoint) |
| HIGH | `slide-specialist.ts:71` | "Animatievenster" → "Afspelen / Diavoorstelling" (feature bestaat niet op iPad) |
| HIGH | `slide-specialist.ts:110-117` | `badge[1].color: '#ff3c21'` → `'#202023'` (rood voor succes-badge is misleidend) |
| HIGH | `slide-specialist.ts:104` | `maxScore: 60` → `maxScore: 55` |
| MED | `slide-specialist.ts:23` | "klik" → "tik" |
| MED | `slide-specialist.ts` | Voeg `learningObjectives`-array toe |
| MED | `slide-specialist.ts:47` | Stap 2 inkorten (<60w) + afbeelding-instructie naar vrije bron |

### Print Pro ⚠️
| Prio | File | Fix |
|------|------|-----|
| HIGH | `print-pro.ts` | Voeg `learningObjectives`-array toe (blocking didactische eis) |
| HIGH | `print-pro.ts:47` | Herschrijf stap 2 naar platform-keuzelijst (<45w) |
| HIGH | `slo-kerndoelen-mapping.ts:32` | Voeg `23A`/`20A` toe aan SLO-claim (inhoud bevat al 23A-materiaal) |
| HIGH | `print-pro.ts:104` | `maxScore: 60` → `maxScore: 55` |
| MED | `print-pro.ts:20` | Voeg `teacherCheck` toe aan stap 1 (self-declare item) |
| LOW | Toekomstig | Overweeg platform-keuze-interactie in stap 1 (engine-aanpassing) |
| LOW | `print-pro.ts` | Badge-kleuren differentiëren (alle drie #202023 nu) |

---

## Crosscutting patronen (geldt voor alle 5 missies)

1. **Geen `learningObjectives`** — alle 5 configs missen dit veld. Systematische toevoeging is een één-sessie-taak: 5 arrays met 4 Bloom-geformuleerde doelen per missie.
2. **maxScore inconsistentie** — alle 5 configs claimen `maxScore: 60` maar engine-max varieert (50-55pt). Systematisch rechtzetten.
3. **Bloom 1-2 only** — alle 5 missies hebben uitsluitend recall/begrip-vragen. Minimaal 1 Bloom-3 vraag per missie aanbevolen.
4. **Foto-privacy** — cloud-commander, word-wizard en slide-specialist vragen leerlingen eigen foto's/afbeeldingen te gebruiken zonder instructie over schoolcontent. Systematische fix: altijd een specifiek vrije bronnen-instructie toevoegen.
5. **Badge-kleur chaos** — inkonsistente hex-waarden over de configs; sommige rood (error), sommige ink, sommige aangepast. Systematisch: definieer 3 standaard badge-kleuren in de config-documentatie.

---

## Prioriteitsvolgorde voor de fix-sessie

**Fase 1 — Engine fix (1 bestand, blokkeert alle 5):**
1. `tailwind.shared.js` — duck-namespace tokens toevoegen

**Fase 2 — Config fixes (per missie, parallelliseerbaar):**
2. Alle `maxScore`-correcties (5 bestanden, triviale 1-regelwijzigingen)
3. Alle `learningObjectives`-arrays (5 bestanden, copy-schrijfwerk)
4. Slide-specialist specifieke fouten ("Zetelen", "Animatievenster", badge-kleur)
5. Cloud-commander + word-wizard foto-privacy instructies
6. Print-pro SLO-uitbreiding (23A/20A) + stap 2 rewrite
7. Word-wizard iOS M365-licentievereiste

**Fase 3 — Visuele QA (na fixes):**
8. Multi-viewport verificatie op localhost:5173 (desktop/iPad/mobiel)
9. Echte iPad-check: iOS Word inhoudsopgave-route; iOS PowerPoint Animaties-tab
10. Print-pro: visuele check stap 2 multi-platform layout op 375px

---

## Codex M1-gate status

| Missie | Codex-verdict | Status |
|--------|---------------|--------|
| magister-master | BLOCK (placeholder → opgelost) | ✅ Gate ingevuld |
| cloud-commander | BLOCK (placeholder → opgelost) | ✅ Gate ingevuld |
| word-wizard | BLOCK (placeholder → opgelost) | ✅ Gate ingevuld |
| slide-specialist | BLOCK (inconsistenties gecorrigeerd) | ✅ Gate ingevuld |
| print-pro | BLOCK (visuele QA scope uitgebreid) | ✅ Gate ingevuld |

---

## Demo-zin voor schoolbestuur

"We hebben alle vijf startmissies van leerjaar 1 grondig gereviewed op UX, didactiek, SLO-aansluiting en technische correctheid. De structuur is solide — de stap-voor-stap opbouw werkt didactisch — maar we hebben een handvol concrete correcties gevonden die we nu doorvoeren vóórdat leerlingen ermee aan de slag gaan. Daarna is de fundering voor Digitale Basisvaardigheden klaar om te starten."
