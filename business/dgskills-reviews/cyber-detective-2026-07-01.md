# Missiereview: Cyber Detective (`cyber-detective`)

**Datum:** 2026-07-01
**Template:** puzzle-lab
**Leerjaar:** 3 (havo/vwo) — Periode 2: Cybersecurity & Privacy
**SLO-kerndoelen:** 23A, 21A (autoritatieve bron: `slo-kerndoelen-mapping.ts`)

## Samenvatting

| Rubric | Score | Verdict |
|---|---|---|
| Design | 6.5/10 | Geen visueel bewijs beschikbaar; config-only beoordeling |
| Didactiek | 8/10 | Sterk opgebouwde puzzelreeks, correcte antwoordmodellen |
| Techniek | 5/10 | Broken asset + volledig dormante chat-persona |

**Triage-score:** 5.15 → **fix-eerst**

## Bronnen gelezen

- `src/features/missions/templates/puzzle-lab/configs/cyber-detective.ts`
- `src/config/agents/year3.tsx` (agent-role entry, regel 554-609)
- `src/config/slo-kerndoelen-mapping.ts:165`
- `src/config/curriculum.ts:270` (periode 2, cybersecurity-cluster)
- `src/config/missionGoals.ts:421-429`
- `src/config/templateRegistry.ts:25` (`templateType: 'puzzle-lab'`)
- `docs/audits/student-missions-ui-ux-review-2026-06-30.md` — **geen vermelding gevonden**
- `.ui-review/` screenshots-map — **niet aanwezig**

## Stap B — Visueel bewijs

Geen screenshots-directory en geen vermelding in de UI/UX-audit van 2026-06-30. Design-score is daarom uitsluitend op basis van de config beoordeeld (kleurtoken-gebruik, structuur), niet op gerenderd resultaat.

---

## Design (6.5/10)

### Bevindingen

1. **Legacy kleurtoken in agent-role visualPreview** (`src/config/agents/year3.tsx:568`)
   `bg-gradient-to-br from-lab-coral to-lab-coral` — een gradient van dezelfde kleur naar zichzelf is een no-op (levert een vlakke kleur, geen gradient). Bovendien is `lab-coral` een legacy-token (project-conventie: nieuwe componenten gebruiken `duck-*`). Dit is echter de **agent-role-kaart** (year3.tsx), niet de puzzle-lab-engine zelf — missie-specifiek te fixen.
2. **Puzzle-lab engine styling** — niet geïnspecteerd (engine-issues vallen buiten scope van deze missiereview per instructie).
3. Badge-kleuren (`#e1ff01`, `#202023`) zijn hex-literals, consistent met het patroon in andere puzzle-lab missies (geen missie-specifieke afwijking, dus niet gerapporteerd als issue).

### Issues

| # | Ernst | Omschrijving | Bestand |
|---|---|---|---|
| D1 | Laag | `from-lab-coral to-lab-coral` gradient is een no-op + legacy token | `src/config/agents/year3.tsx:568` |

---

## Didactiek (8/10)

### Bevindingen

De puzzelreeks is pedagogisch sterk opgebouwd: elke puzzel volgt herkenning → korte uitleg → challenge, met stapsgewijze clues (`clues` → `extraClues` na 2 pogingen) die zelfstandig redeneren stimuleren zonder het antwoord weg te geven.

**Antwoordmodellen geverifieerd (feitelijk correct):**
- **Puzzel 1 (brute force)**: logboek toont 3× LOGIN FAILED, zelfde IP, binnen 4 seconden, gevolgd door LOGIN SUCCESS en directe download. Correct geclassificeerd als brute-force (niet phishing/SQL-injectie/social engineering — er is geen phishing-mail of formulier-input in de log).
- **Puzzel 2 (bewijsketen)**: "forensische kopie + hash-waarde vastleggen" is het juridisch/technisch correcte antwoord (chain-of-custody-principe); de afleiders (direct inloggen op origineel, originelen verwijderen, server uitzetten) zijn elk aantoonbaar bewijs-vernietigend.
- **Puzzel 3 (phishing)**: e-mail met typo-domein (`bedrijff.nl` vs `bedrijf.nl`), urgentietaal en verdachte link — ondubbelzinnig phishing, correct onderscheiden van brute force (systeem vs. mens).
- **Puzzel 4 (tijdlijn)**: `2-4-1-3` = brute-force gestart → succesvol ingelogd → database gedownload → dark web. Logisch sluitend (je kunt niet downloaden vóór inloggen, niet publiceren vóór downloaden).

**Puntentelling nagerekend:** 25+25+25+25 = 100, komt exact overeen met `maxScore: 100`. Geen scoring-inconsistentie.

**Badge-drempels:** 0/40/70/90 — oplopend en niet-overlappend, consistent met vergelijkbare puzzle-lab missies.

**missionGoals-entry** (`primaryGoal`, `criteria`, `evidence`) sluit inhoudelijk aan bij de daadwerkelijke puzzels (aanvalsmethode herkennen, bewijsmethode kiezen, volgorde reconstrueren) — geen drift tussen doel en uitvoering.

### Issues

Geen substantiële didactische issues gevonden. Kleine observatie: `takeaways` (5 items) zijn behoorlijk dicht op elkaar qua informatiedichtheid voor een afsluitend scherm, maar dit is consistent met het patroon in vergelijkbare missies — niet missie-specifiek afwijkend, dus niet als issue geteld.

---

## Techniek (5/10)

### Bevindingen

1. **Broken asset-referentie**: `briefingImage: '/assets/agents/cyber-detective.webp'` (`src/config/agents/year3.tsx:564`) verwijst naar een bestand dat **niet bestaat** in `public/assets/agents/` (repo-brede zoekactie leverde nul treffers op voor `cyber-detective.webp` of enige variant). De briefing-kaart toont hierdoor een gebroken afbeelding of fallback.
2. **Dormante chat-persona**: de agent-role bevat een volledig uitgewerkte `systemInstruction` (~60 regels) met rol-persona ("ervaren Cyber Detective"), pedagogische aanpak, inhoudelijke focus en drie `STEP_COMPLETE`-triggers (`src/config/agents/year3.tsx`, regels na 578). Echter: `enableChat` staat **niet** aan voor deze rol (geverifieerd: geen match in het volledige agent-blok), en `templateRegistry.ts:25` bevestigt `templateType: 'puzzle-lab'` — de missie draait dus volledig via de puzzel-engine, niet via chat. Deze `systemInstruction` wordt nooit aan een leerling getoond en is dode configuratie (bekend patroon: "template-missie zonder `enableChat` = dormante rol").

### Issues

| # | Ernst | Omschrijving | Bestand |
|---|---|---|---|
| T1 | Hoog | Broken image: `briefingImage` verwijst naar niet-bestaand `.webp`-bestand | `src/config/agents/year3.tsx:564` |
| T2 | Medium | Volledige `systemInstruction` (chat-persona + STEP_COMPLETE-logica) is dormant zonder `enableChat`; ~60 regels dode config | `src/config/agents/year3.tsx` |

---

## Voorstel-blokken

### Voorstel D1 — gradient no-op fixen

**Bestand:** `src/config/agents/year3.tsx`

**Before:**
```tsx
<div className="w-full h-full bg-gradient-to-br from-lab-coral to-lab-coral flex items-center justify-center relative overflow-hidden">
```

**After:**
```tsx
<div className="w-full h-full bg-lab-coral flex items-center justify-center relative overflow-hidden">
```

**Reden:** een gradient van kleur X naar kleur X is functioneel identiek aan een vlakke achtergrondkleur, maar kost een onnodige gradient-berekening en is verwarrend voor toekomstige onderhouders. Vervang door de vlakke kleur die het feitelijk al is (token blijft ongewijzigd — legacy-token buiten scope van deze fix).

### Voorstel T1 — briefingImage: verifieer/herstel pad

**Bestand:** `src/config/agents/year3.tsx:564`

**Before:**
```tsx
briefingImage: '/assets/agents/cyber-detective.webp',
```

**After:** *(niet automatisch toepasbaar — vereist een daadwerkelijk asset)*

**Reden:** dit is geen mechanische fix. Er moet een `cyber-detective.webp`-bestand worden gegenereerd/geüpload naar `public/assets/agents/`, óf het pad moet naar een bestaand asset wijzen. Vlaggen voor menselijke actie (niet autoFixable).

### Voorstel T2 — dormante systemInstruction

Niet automatisch fixbaar binnen scope van deze review: vereist een productbeslissing (activeer `enableChat` als aanvullende chat-laag op de puzzel-engine, óf verwijder de dode `systemInstruction`/`STEP_COMPLETE`-triggers als de missie bewust puzzel-only blijft). Gevlagd voor escalatie, niet autoFixable.

---

## Escalaties (niet autoFixable)

- **T1**: ontbrekend `.webp`-asset — vereist assetgeneratie/-upload, geen code-fix.
- **T2**: architectuurkeuze (chat activeren vs. dode instructie verwijderen) — productbeslissing, geen mechanische fix.
