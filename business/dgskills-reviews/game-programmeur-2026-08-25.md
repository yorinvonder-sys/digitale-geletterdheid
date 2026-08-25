# Missie-review: Game Programmeur

**Datum:** 2026-08-25
**templateType:** agent-role (handcrafted, eigen deterministische engine)
**Locatie:** leerjaar 1, periode 2 ("AI & Creatie")

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## 🎨 Design review

### ✅ Geslaagd
- Canvas-game vult het beschikbare vlak via `resize()` met meerdere fallbacks (`window.innerWidth`, `documentElement.clientWidth`, `body.clientWidth`, minimum 800×600) — voorkomt een 0×0-canvas in de iframe-preview.
- Score-UI (`#ui`) blijft zichtbaar boven de canvas met duidelijke contrastkleur en tekstschaduw.
- Kleurenpalet van de game (`playerColor`, `obstacleColor`, `skyColor1/2`, `groundColor`, `grassColor`) is consistent met de duck-thema-kleuren elders in de missie-preview (`#e1ff01` iconkleur, lab-sage/lab-coral in de `visualPreview`).
- `briefingImage` en `visualPreview`-mockup zijn aanwezig en geven een correcte verwachting van de game (canvas + score + `player.jump()`-hint).

### ⚠️ Aandachtspunten
- Geen losse design-blocking issues gevonden binnen de config-scope van deze missie.

### ❌ Blocking issues
- Geen.

### Score
**8.5/10** — solide, functioneel canvas-design zonder duck-tokens-overtredingen binnen de missie-eigen bestanden.

---

## 📚 Didactiek review

### ✅ Geslaagd
- `primaryGoal` en `missionObjective` zijn helder en action-based: leerling onderzoekt code en maakt een speelbare remix over uiterlijk, besturing én moeilijkheid.
- De 5 stappen (Kleur → Fysica → Snelheid → Geluid → Uiterlijk) volgen een logische opbouw van eenvoudig (kleur) naar samengesteld inzicht (uiterlijk + reflectie), en elke stap heeft een concreet voorbeeld-commando (`examplePrompt`) dat de leerling direct kan typen.
- SLO-koppeling aanwezig en past bij "code lezen/aanpassen": `22A`/`22B` (vo), `19A` (vso), in lijn met periode-focus `sloFocus: ['21D','22A','22B','23B','23C']`.
- `evidence`-veld in `missionGoals.ts` is toetsbaar: leerling moet zichtbaar aangepast gedrag tonen én kunnen uitleggen welke opdracht dat veroorzaakte — sluit aan bij het "AI-as-copilot"-principe (leerling stuurt, snapt het effect).

### ⚠️ Aandachtspunten
- `goalCriteria: { type: 'steps-complete', min: 5 }` vereist alle 5 stappen (geen marge), terwijl vergelijkbare missies in dezelfde periode vaak `min: 3` gebruiken. In combinatie met `difficulty: 'Hard'` is dit waarschijnlijk bewust, maar het is de striktste eis van de periode — het is de moeite waard om te bevestigen dat dit bedoeld is en niet een kopieerfout van een strengere sjabloon-missie.

### ❌ Blocking issues
- Geen.

### SLO-fit oordeel
Claim (code lezen/aanpassen, digitale creatie) komt overeen met de werkelijke opdracht: de leerling leest bestaande spelcode, herkent variabelen en observeert het effect van gerichte aanpassingen. Fit is correct.

### Score
**8/10** — heldere leerdoelen en toetsbare evidence; enige onzekerheid over de striktheid van `min: 5`.

---

## 🔧 Tech review

### Static analyse

#### ✅ Geslaagd
- `applyGameCommand()` (`src/services/gameCommands.ts`) is een goed gedocumenteerde, deterministische regex-parser die alleen bekende `let X = …;`-declaraties wijzigt — kan de rest van de game nooit breken. Dit is een bewuste architectuurkeuze (zie bekende valkuilen) en geen tekortkoming.
- Variabelenamen in `initialCode` (`src/config/agents/year1.tsx`, regel ~1196-1204: `playerColor`, `jumpForce`, `gravity`, `obstacleColor`, `obstacleSpeed`, `skyColor1/2`, `groundColor`, `grassColor`) komen exact overeen met de namen die `gameCommands.ts` verwacht — geen stille mismatch tussen config en engine.
- `useAgentLogic.ts` roept `applyGameCommand()` eerst aan (regel 671) en valt pas terug op de server-side AI-call (`useNonStreamingResponse`, regel 740) wanneer de deterministische parser `null` teruggeeft — precies het gedrag dat de systemInstruction als vangnet beschrijft.
- Undo-functionaliteit en cloud-sync van `activeGameCode` (regels 547-549, 1096) zijn aanwezig, zodat voortgang niet verloren gaat bij een reload.
- Stap-nummering in `gameCommands.ts` (`stepId: 1..5`) komt overeen met de 5 `steps`-items in de agent-config (Kleur/Fysica/Snelheid/Geluid/Uiterlijk).

#### ⚠️ Aandachtspunten
- De speler-kleur-tak in `gameCommands.ts` is de *default* fallback wanneer geen ander doelwoord (achtergrond/obstakel/gras/grond) wordt herkend. Een leerling die per ongeluk een kleurnaam typt die eigenlijk bij een ander onderdeel hoort (bv. "maak de lucht rood en de obstakels blauw" in één zin) krijgt slechts één wijziging — geen blocking bug, wel een grens van de simpele command-parser die de moeite waard is om te kennen bij toekomstig onderhoud.

#### ❌ Blocking issues
- Geen.

### Dynamic verificatie
Niet uitgevoerd in deze pass (geen dev-server-context in deze review-run); alleen static analyse.

### Score
**8.5/10** — robuuste, goed gedocumenteerde engine met correcte config/engine-koppeling.

---

## Voorstellen

Geen mechanische autofixes nodig — er zijn geen concrete voor/na-wijzigingen binnen de whitelist-scope (`templateRegistry.ts`, `agents/year*.tsx`, `slo-kerndoelen-mapping.ts`, `curriculum.ts`, `missionGoals.ts`) die een bevinding op blocking- of warning-niveau oplossen. Enige open punt (`min: 5` vs. `min: 3` bij vergelijkbare missies) is een bevestigingsvraag aan Yorin, geen code-fout.

---

## Samenvatting & verdict

Game Programmeur is een technisch en didactisch stevige missie: een bewust deterministische command-engine (geen AI-rewrite) die exact aansluit op de variabelen in de meegeleverde game-code, met een duidelijke, oplopende stappenreeks en toetsbare leerdoelen. Er zijn geen blocking issues in design, didactiek of tech gevonden binnen de scope van deze review.

**Verdict: OK** — geen fix-eerst of herontwerp nodig.
