# Missie Review: reflection-report

**ID:** reflection-report  
**Datum:** 2026-06-17  
**Template:** debate-arena  
**Leerjaar/Periode:** J3 P4 (havo/vwo — Meesterproef)  
**SLO:** 23B (Digitale burgerschap — zelfreflectie en persoonlijke ontwikkeling)  
**Reviewer:** Sonnet 4.6  

**Eén-zin verdict:** De missie heeft een sterk thematisch concept en solide template-infrastructuur, maar blokkeert op een fundamentele doelstelling-mismatch (agent-flow vs. debate-arena template), ontbreekt een `missionGoal`, en bevat hardcoded hex-kleuren in de agent-config.

---

## 🎨 Design review

### ✅ Goed
- Template gebruikt consequent `duck-*` design tokens (`duck-bg`, `duck-ink`, `duck-gray`, `duck-acid`) in DebateArena.tsx.
- Responsive layout via `max-w-md mx-auto` + `p-4` — werkt op mobiel.
- Loading state aanwezig (spinner via `LoadingScreen`), error state aanwezig (config-niet-gevonden scherm met terugknop).
- Terugknop in error state heeft duidelijke tekst ("Terug") — geen icoon-only.
- `useMissionAutoSave` aanwezig → restart-safe.

### ⚠️ Aandachtspunten

**1. Hardcoded hex in badge-kleuren (config)**  
`reflection-report.ts` regels 101, 107, 113, 119 gebruiken hardcoded hex in `color`-veld van badges:

```
// src/features/missions/templates/debate-arena/configs/reflection-report.ts:101
color: '#e1ff01',   // zou duck-acid moeten zijn
color: '#ff3c21',   // zou duck-coral / lab-coral moeten zijn
color: '#202023',   // zou duck-ink moeten zijn
```

**Voorstel:** Koppel badge-kleuren aan tokens of constanten in plaats van hex. Als de `color`-veld een string is die direct als `style.background` wordt gebruikt, verwissel naar CSS-variable references of verwijder het veld als de CompletionScreen zijn eigen badge-kleuring regelt.

**2. Hardcoded hex in agent visualPreview (year3.tsx)**  
De `visualPreview` in `src/config/agents/year3.tsx` gebruikt `lab-coral` Tailwind-klassen (`from-lab-coral to-lab-coral`) — maar `lab-coral` is een legacy token. Conform CLAUDE.md stack-conventies: nieuwe componenten gebruiken `duck-*` tokens.

```ts
// src/config/agents/year3.tsx (visualPreview van reflection-report)
// Huidig:
className="w-full h-full bg-gradient-to-br from-lab-coral to-lab-coral ..."
// Voorstel:
className="w-full h-full bg-gradient-to-br from-duck-coral to-duck-coral ..."
// (mits duck-coral bestaat — anders: from-duck-accent/80 to-duck-accent)
```

**3. `agent.color` hardcoded hex**  
`src/config/agents/year3.tsx`, de color-property van het agent-object:
```ts
color: '#e1ff01',
```
Dit is platformbreed consistent (alle agents doen dit), maar bij themawisseling breken deze waarden. Geen blocker, wel technische schuld.

**4. Visual — niet geverifieerd (geen screenshot)**  
Geen screenshots aanwezig in `screenshots/assignments/reflection-report/`. Visuele beoordeling van IntroScreen-copy-fit, badge-rendering en mobile-states kon niet worden gedaan. Browser QA is openstaand item uit de triage-audit van 2026-06-15.

### ❌ Blokkers
Geen harde UI-blokkers gevonden op basis van statische analyse.

---

## 📚 Didactiek review

### ✅ Goed
- Stakeholders zijn leeftijdsadequaat beschreven: Lena (leerling, 16 jaar) heeft een herkenbaar perspectief; Dhr. Kamphuis (HR) maakt de relevantie voor de arbeidsmarkt concreet.
- Vocabulaire is geschikt voor bovenbouw havo/vwo J3; geen onverklaarde vaktermen.
- Counter-argument (concurrentiepositie-redenering) is realistisch en prikkelend — niet triviaal te weerleggen, goed voor cognitieve uitdaging.
- Reflectievragen zijn open en activerend: "Wat heb jij de afgelopen jaren het meest geleerd — en was dat wat je verwachtte?"
- Wellbeing-protocol aanwezig in systemInstruction (via SYSTEM_INSTRUCTION_SUFFIX + expliciet in de systemInstructions.ts).
- SLO 23B is inhoudelijk passend: debat over de waarde van zelfreflectie raakt digitale burgerschap rechtstreeks.
- Vier takeaways zijn concreet en actiegericht.

### ⚠️ Aandachtspunten

**5. Introductietekst iets aan de lange kant voor J3 intro**  
`introDescription` (reflection-report.ts, regel 9):  
> "Drie jaar informatica zitten erop. Maar wat heb je eigenlijk geleerd — en wat zegt dat over wie jij bent als digitale burger? Debatteer mee over de waarde van zelfreflectie en persoonlijke groei."

Dit zijn 46 woorden — binnen de norm (<80w intro voor jr3), maar de tweede zin ("Debatteer mee...") herhält de titel. Suggestie: vat samen in één scherpe zin.

**6. Ontbrekende `explorationQuiz` en `argumentQualityIndicators`**  
De `DebateArenaConfig`-interface definieert twee optionele velden die de didactische kwaliteit verhogen:
- `explorationQuiz?: FollowUpQuestion` — een kennistoets na het lezen van stakeholders
- `argumentQualityIndicators?: boolean` — feedback op argumentkwaliteit

Beide ontbreken in `reflection-report.ts`. Dit is geen blocker, maar de triage-audit van 2026-06-15 vlagde dit als aandachtspunt. Voor een capstone-missie (P4 Meesterproef) die reflecterend denken centraal stelt, zou minimaal een `explorationQuiz` helpen om diepgang te bevorderen voor leerlingen gaan debatteren.

**7. Bloom-balans: nadruk op evalueren, weinig scaffolding**  
De missie vraagt evalueren (positie kiezen, argumenten bouwen) en analyseren (counter-argument beantwoorden). Geen recall of begripstoets als opstap. Voor J3 havo/vwo bij Meesterproef-niveau is dit acceptabel; echter ontbreekt er scaffolding voor leerlingen die voor het eerst serieus debatteren. De `argumentPrompts` ("Ik vind dat...", "Mijn ervaring of redenering is...") helpen maar zijn minimaal.

### ❌ Blokkers

**BLOKKER 1 — Fundamentele doelstelling-mismatch (ESCALATIE: niet auto-fixbaar)**

De agent-entry in `src/config/agents/year3.tsx` beschrijft een volledig ander leerproces dan de debate-arena template implementeert:

| | Agent-entry (year3.tsx) | Debate-arena template |
|---|---|---|
| **Taak** | Schrijf een reflectieverslag (essay) | Debatteer over de waarde van reflectie |
| **Interactie** | Chat-gebaseerde begeleiding in 3 stappen | 6 fasen: explore → position → argue → challenge → reflect → results |
| **Output** | Persoonlijk reflectieverslag van de leerling | Positie + argumenten in een debat-format |
| **AI-rol** | Reflectie Coach (stap-voor-stap schrijfbegeleiding) | AI als chat-assistent naast het debat (enableChat: true) |
| **SLO-bewijs** | Leerling schrijft verslag → bewijs van zelfreflectie | Leerling debatteert over reflectie → reflecteert over reflectie |

De `missionObjective` in year3.tsx luidt: *"Schrijf een reflectieverslag waarin je je leerproces beschrijft, je sterke en zwakke punten analyseert..."* — maar de template doet dat niet. De debate-arena laat leerlingen debatteren óver de waarde van reflectie, niet zelfreflectie uitvoeren.

De systemInstruction in year3.tsx is ook volledig gericht op essay-schrijven (3 stappen: leermomenten beschrijven, sterke/zwakke punten, vooruitblik), maar de template-flow heeft geen essay-schrijfstap.

**Dit is een architecturele mismatch die vraagt om een keuze:**
- Optie A: Verander de template naar `ScenarioEngine` of `BuilderCanvas` zodat de chat-coach-flow klopt met de essay-schrijfopdracht.
- Optie B: Herschrijf de agent-entry + missionObjective zodat die kloppen bij de debate-arena (debatteren over reflectie, niet schrijven over reflectie).
- Optie C: Splits de missie in twee: een debate-arena missie ("Moet informatica zelfreflectie bevatten?") en een BuilderCanvas essay-missie ("Schrijf je reflectieverslag").

**BLOKKER 2 — Ontbrekende `missionGoal`**

`DebateArena.tsx` regel 176 roept `getMissionGoal(config.missionId)` aan als fallback wanneer `config.missionGoal` undefined is:
```ts
goal={config.missionGoal ?? getMissionGoal(config.missionId)}
```

`getMissionGoal('reflection-report')` retourneert undefined (geen entry in `src/config/missionGoals.ts`), en `config.missionGoal` is ook niet ingevuld in `reflection-report.ts`. Afhankelijk van hoe `IntroScreen` omgaat met `goal={undefined}` kan dit een leeg goal-blok renderen of een runtime-fout veroorzaken.

**Voorstel (voor de debate-arena variant van de missie):**
```ts
// src/features/missions/templates/debate-arena/configs/reflection-report.ts
// Na regel 9 (introDescription), voeg toe:
missionGoal: {
    primaryGoal: 'Bouw een gefundeerd standpunt op over de rol van zelfreflectie in informaticaonderwijs.',
    objectives: [
        'Analyseer vier verschillende perspectieven op zelfreflectie in het onderwijs',
        'Kies en verdedig een eigen positie met onderbouwde argumenten',
        'Evalueer een tegenargument en pas je standpunt aan op basis van redenering',
        'Reflecteer op wat dit debat onthult over jouw eigen leerproces',
    ],
},
```

---

## 🔧 Tech review

### ✅ Goed
- `useMissionAutoSave` correct gebruikt op regel 141 — restart-safe.
- Dynamic import in `DebateArena.tsx` (regel 362) heeft `.catch(() => setLoadError(true))` — error state afgevangen.
- Loading state aanwezig (`LoadingScreen` component, regel 381).
- `enableChat: true` in templateRegistry, `chatRoleId: 'reflection-report'` in agentRoleIds — chat-routing correct geconfigureerd.
- TS types zijn correct: `DebateArenaConfig`, `DebateArenaState`, `ArgumentEntry` volledig getypeerd.
- Geen `: any` of `@ts-ignore` gezien in de gelezen code.
- `@/` imports consistent gebruikt (regels 3–8, 13).
- User-input (claim, evidence, counterResponse, reflectionAnswers) wordt uitsluitend via React state beheerd en gerenderd als tekst — geen `dangerouslySetInnerHTML` op gebruikersinput.

### ⚠️ Aandachtspunten

**8. Argument minimum-drempel (20 tekens) is laag voor capstone-niveau**  
```ts
// DebateArena.tsx:114-116
const validArgs = state.arguments.filter(
    (a) => a.claim.trim().length >= 20 && a.evidence.trim().length >= 20
);
```
20 tekens ("ok dat vind ik goed" = 21 tekens) voldoet als "valid argument". Voor een Meesterproef-niveau missie is dit te laag. Overweeg 60-80 tekens minimaal, of schakel `argumentQualityIndicators: true` in.

**9. `systemInstruction` in year3.tsx niet via `roleId` op server**  
De systemInstruction staat hardcoded inline in `src/config/agents/year3.tsx` (client-side). De templateRegistry verwijst naar `chatRoleId: 'reflection-report'` die in `agentRoleIds.ts` is geregistreerd en vermoedelijk server-side via `supabase/functions/_shared/systemInstructions.ts` wordt afgehandeld. Dit is correct voor de chat-component.

Echter: de inline `systemInstruction` in year3.tsx (client-side agent-definitie) is een andere instructie dan die in `systemInstructions.ts`. Het is niet duidelijk welke daadwerkelijk de chat aanroept. Als de client-side systemInstruction ook naar de AI-aanroep wordt gestuurd, is dat een security-risico (client-side prompt).

**ESCALATIE:** Verifieer welk systeem de systemInstruction naar het AI-model stuurt — server-side via `systemInstructions.ts` (veilig) of client-side via `year3.tsx` (onveilig). Zorg dat de definitieve instructie server-side staat.

**10. `calcScore` duplicatie in results-render**  
```ts
// DebateArena.tsx:191 (binnen JSX)
score: Math.round((Math.min(state.arguments.filter(a => a.claim.trim().length >= 20 && ...)...) / 3) * 50)
```
De score-logica is gedupliceerd in de `phases`-array voor weergave (regel 191) t.o.v. de `calcScore`-functie (regels 114-117). Bij een drempelwijziging moeten beide plekken worden bijgewerkt. Geen blocker, wel technische schuld.

**Voorstel:**
```ts
// DebateArena.tsx — vervang de inline berekening op regel 191 door:
score: (() => {
    const validArgs = state.arguments.filter(a => a.claim.trim().length >= 20 && a.evidence.trim().length >= 20);
    return Math.round((Math.min(validArgs.length, 3) / 3) * 50);
})(),
// Of beter: extraheer calcArgumentScore() als helper en gebruik in beide plekken.
```

### ❌ Blokkers
Geen harde tech-blokkers buiten de al genoemde ESCALATIE (punt 9) en het ontbrekende missionGoal (al als didactiek-blokker genoemd).

---

## Samenvatting

| Probleem | Type | Ernst |
|---|---|---|
| Fundamentele template/doel-mismatch (essay-flow vs. debat-template) | ESCALATIE | Blokker |
| Ontbrekende `missionGoal` + geen entry in missionGoals.ts | Auto-fixbaar | Blokker |
| systemInstruction client- vs. server-side onduidelijkheid | ESCALATIE | Security |
| Hardcoded hex in badge-kleuren (configs/reflection-report.ts) | Auto-fixbaar | ⚠️ |
| Legacy `lab-coral` in visualPreview (year3.tsx) | Auto-fixbaar | ⚠️ |
| Ontbrekende `explorationQuiz` + `argumentQualityIndicators` | Auto-fixbaar | ⚠️ |
| Argument-drempel 20 tekens te laag voor capstone | Auto-fixbaar | ⚠️ |
| `calcScore`-logica gedupliceerd in results-render | Auto-fixbaar | ⚠️ (tech debt) |
| Intro-copy iets redundant (minor) | Auto-fixbaar | ℹ️ |
| Geen browser QA / screenshots | Openstaand | ⚠️ |
