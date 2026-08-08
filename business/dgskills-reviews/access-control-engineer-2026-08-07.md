# Review: Access Control Engineer (leerjaar 2, periode 2)

**Datum:** 2026-08-07
**Component:** `src/features/missions/AccessControlEngineerMission.tsx` (723 regels, handcrafted — geen config/engine-scheiding)
**Curriculum:** leerjaar 2, periode 2 "Programmeren & Computational Thinking" (`src/config/curriculum.ts:184-201`)
**SLO-entry:** `src/config/slo-kerndoelen-mapping.ts:123` — `sloKerndoelen: ['21A','23A']`, `sloVsoKerndoelen: ['18A','20A']`

## Samenvatting

De missie is technisch solide gebouwd (state-restore, TypeScript, DUCK-tokens), maar heeft twee **blocking** didactische lekken waardoor een leerling de volledige missie kan afronden zonder de inhoud te doorgronden: (1) Stap 1 telt élke aangevinkte regel mee — ook de twee bewust-veilige regels — zodat "3 problemen vinden" met willekeurige klikken lukt; (2) in Stap 3 toont de "Uitleg"-knop het verwachte testresultaat **vóórdat** de test is uitgevoerd, waardoor een leerling het juiste antwoord kan aflezen en vervolgens Stap 2 dienovereenkomstig kan instellen zonder ooit een rechten-afweging te maken. Daarnaast zijn er twee reken-bevestigde WCAG AA contrastfouten (`text-duck-ink/60` en de rode "Fout"-badge) die door de hele missie heen terugkomen. De twee openstaande punten uit de vorige ronde zijn hieronder expliciet afgehandeld: het SLO 22B-punt is **weerlegd**, het 24-knoppen-punt is **bevestigd** (telling klopt) maar het "structureel herontwerp"-oordeel wordt genuanceerd tot een warning i.p.v. blocking.

---

## Design

**Score: 2/5**

### Bevindingen

1. **[blocking] Contrastfout `text-duck-ink/60` op wit/duck-bg — faalt WCAG AA (4.5:1)**
   `text-duck-ink/60` wordt herhaaldelijk gebruikt voor leesbare (niet-decoratieve) tekst op witte kaarten en op de `bg-duck-bg`-pagina-achtergrond, bv. `src/features/missions/AccessControlEngineerMission.tsx:424` (introtekst), `:492` (voortgang), `:511`, `:560`, `:587`, `:668`.
   Berekend (WCAG relative-luminance formule, geen schatting): `duck-ink` (#202023) op 60% dekking over wit (#FFFFFF) geeft een gemengde kleur ≈ rgb(121,121,123), luminantie ≈ 0,1917 → contrast t.o.v. wit = **4,35:1**. Op `duck-bg` (#F2F1EC) is het nog lager: ≈ **4,15:1**. Beide onder de vereiste 4,5:1 voor normale tekst (`text-sm`/`text-xs` is geen "grote tekst").
   ```json
   {"fixSnippet":{"before":"text-duck-ink/60","after":"text-duck-ink/70"}}
   ```
   Geverifieerd: `duck-ink` op 70% over wit geeft luminantie ≈ 0,1565 → contrast ≈ **5,09:1** (ruim boven AA).

2. **[blocking] Contrastfout: witte tekst op `bg-duck-error` ("Fout"-badge) — faalt WCAG AA**
   `src/features/missions/AccessControlEngineerMission.tsx:624-630`: `resultaat === 'fout' ? 'bg-duck-error text-white'`. Berekend: `duck-error` (#FF3C21) luminantie ≈ 0,2460; wit-op-error contrast = (1,05)/(0,2460+0,05) = **3,55:1** — onder de 4,5:1-eis (badge-tekst is `text-xs font-bold`, niet "large text" volgens WCAG-definitie 18pt/14pt-bold ≥ 14px×1.2, hier gaat het om 12px).
   Voorstel: gebruik `text-duck-ink` i.p.v. `text-white` op deze badge. Geverifieerd: `duck-ink` op `duck-error` geeft contrast ≈ **4,59:1** (haalt net AA). De "Correct"-badge (`bg-duck-ink text-white`, regel 624-628) is prima: contrast ≈ 16,3:1.

3. **[warning] Stap 2 — 24 losse toggle-knoppen op één scherm (zie ook "Openstaande punten" hieronder)**
   `src/features/missions/AccessControlEngineerMission.tsx:519-556`: 6 `RESOURCES` × 4 rollen = 24 individuele knoppen, elk zonder gegroepeerd label/legenda anders dan de kaart-structuur. Voor leerjaar 2 is dit een hoge informatiedichtheid op één scherm, ook al is de content per resource-kaart gechunkt. Geen `aria-pressed`, dus screenreader-gebruikers krijgen alleen de visuele ring-indicator als signaal van actieve staat, niet de daadwerkelijke toggle-status.
   ```json
   {"fixSnippet":{"before":"<button key={rol} onClick={...} className={...}>","after":"<button key={rol} onClick={...} aria-pressed={actief} className={...}>"}}
   ```

4. **[warning] Kleurgebruik risicoType-badges (design-consistentie, niet blocking)**
   `:459-465`: `privacy` en `toegang` krijgen identieke kleur (`bg-duck-ink text-white`), alleen `authenticatie` wijkt af (`bg-duck-acid`). Niet functioneel een probleem (tekstlabel is aanwezig, dus geen kleur-only-signalering), maar het onderscheid tussen drie risicotypes wordt visueel gereduceerd tot twee kleuren — mist duidelijkheid.

5. **[pass] Tap-targets** — bijna alle interactieve elementen gebruiken `min-h-[44px]`/`min-w-[44px]` consistent (bv. regels 366, 496, 534, 616). Voldoet aan de norm.

6. **[pass] Visual Precision Gate (statisch)** — layout is consistent per stap, geen overlap-patronen zichtbaar in de JSX-structuur, spacing volgt `space-y-*`/`gap-*` consequent. Geen Chrome-plugin bewijs beschikbaar in deze ronde (geen dynamische verificatie uitgevoerd) — markeer als **unverified**, niet als geslaagd bewijs.

---

## Didactiek

**Score: 1.5/5**

### Bevindingen

1. **[blocking] Stap 1 — "problemen vinden" is niet inhoudelijk gevalideerd**
   `src/features/missions/AccessControlEngineerMission.tsx:284` (`aantalProblemen = state.gevondenProblemen.length`) en `:290` (`stap1Klaar = aantalProblemen >= 3`) tellen élke toggle mee, óók de twee bewust-veilige regels (`r5`, `r6`, `isVeilig: true`, regels 112-126). `toggleProbleem` (`:297-314`) voegt de regel-id toe aan `gevondenProblemen` ongeacht `isVeilig`. Een leerling kan drie willekeurige regels aanvinken (inclusief de veilige) en direct doorgaan naar Stap 2 — de coach-hint bij een foute selectie (`:307-308`) is louter informatief en blokkeert niets.
   Voorstel: filter `stap1Klaar` op daadwerkelijk-onveilige, correct geïdentificeerde regels:
   ```json
   {"fixSnippet":{
     "before":"const aantalProblemen = state.gevondenProblemen.length;\n    ...\n    const stap1Klaar = aantalProblemen >= 3;",
     "after":"const aantalCorrecteProblemen = state.gevondenProblemen.filter(id => ONVEILIGE_REGELS.find(r => r.id === id)?.isVeilig === false).length;\n    ...\n    const stap1Klaar = aantalCorrecteProblemen >= 3;"
   }}
   ```

2. **[blocking] Stap 3 — "Uitleg"-knop verklapt het antwoord vóór de test wordt uitgevoerd**
   `src/features/missions/AccessControlEngineerMission.tsx:645-660`: de knop `Uitleg`/`Verberg` (`onClick={() => setShowTestResult(...)}`, regel 645-650) is **niet** afhankelijk van `resultaat` — een leerling kan hem klikken vóórdat "Test uitvoeren" ooit is ingedrukt. Het detail-blok (`:653-660`) toont dan direct `scenario.verwachtResultaat` ("Toegang verlenen" / "Geblokkeerd") én de volledige `uitleg`-tekst die het juiste antwoord beargumenteert. Gecombineerd met bevinding 1 hierboven en de zwakke poort van Stap 2 (`stap2Klaar` bij `:291` telt alleen *of* een resource is ingesteld, niet *of* dat correct is) kan een leerling: (a) drie willekeurige regels aanvinken in Stap 1, (b) naar Stap 3 gaan, per scenario op "Uitleg" klikken om het juiste antwoord af te lezen, (c) teruggaan naar Stap 2 en exact de rollen instellen die bij de afgelezen antwoorden horen, (d) alle tests laten slagen — zonder ooit zelfstandig een rechten-afweging te hebben gemaakt. Dit is de kern van "kan een leerling de volle score halen zonder inhoudelijk werk?" — het antwoord is hier ja.
   Voorstel: toon `verwachtResultaat` pas nadat de test is uitgevoerd (`resultaat !== null && resultaat !== undefined`); vóór dat moment mag de knop alleen de scenario-vraag herhalen, niet het antwoord.
   ```json
   {"fixSnippet":{
     "before":"{toonDetail && (\n    <div className=\"bg-duck-bg px-4 py-3 border-t border-duck-ink/15\">\n        <p className=\"text-xs text-duck-ink/60\">\n            <strong>Verwacht:</strong> {scenario.verwachtResultaat === 'toegang' ? 'Toegang verlenen' : 'Geblokkeerd'}\n        </p>\n        <p className=\"text-xs text-duck-ink/60 mt-1\">{scenario.uitleg}</p>\n    </div>\n)}",
     "after":"{toonDetail && resultaat != null && (\n    <div className=\"bg-duck-bg px-4 py-3 border-t border-duck-ink/15\">\n        <p className=\"text-xs text-duck-ink/60\">\n            <strong>Verwacht:</strong> {scenario.verwachtResultaat === 'toegang' ? 'Toegang verlenen' : 'Geblokkeerd'}\n        </p>\n        <p className=\"text-xs text-duck-ink/60 mt-1\">{scenario.uitleg}</p>\n    </div>\n)}\n{toonDetail && resultaat == null && (\n    <div className=\"bg-duck-bg px-4 py-3 border-t border-duck-ink/15\">\n        <p className=\"text-xs text-duck-ink/60\">Voer eerst de test uit om de uitleg te zien.</p>\n    </div>\n)}"
   }}
   ```

3. **[pass] Taalniveau** — Nederlands, korte zinnen, concrete voorbeelden (Emma, Dhr. Bakker), passend bij 13-14 jaar. Vaktermen ("authenticatie") worden direct in gewone taal uitgelegd (`:95`, `:109`). Voldoet.

4. **[pass] Coach-driedeling erkenning/korte uitleg/challenge** — `COACH_HINTS` (`:216-244`) volgt het patroon: erkenning van fout (`stap1_fout_veilig`), korte uitleg, en een impliciete challenge om verder te zoeken. Goed toegepast, al ondermijnd door bevinding 1/2 hierboven (de hint blokkeert niets).

5. **[warning] VSO-variant is louter tekstueel verkort, geen structurele aanpassing**
   `isVso` (`:294`) verandert alleen introtekst (`:414-417`) en instructie (`:512-515`, `:588-591`) — de onderliggende 24-knoppen-dichtheid in Stap 2 en de zes testscenario's in Stap 3 blijven ongewijzigd voor dagbesteding-profiel. Voor een VSO-dagbesteding-doelgroep is alleen tekst-verkorting waarschijnlijk onvoldoende compensatie voor de cognitieve belasting van Stap 2 (zie punt hieronder).

---

## Techniek

**Score: 4/5**

### Bevindingen

1. **[pass] State-restore / autosave** — gebruikt `useMissionAutoSave<MissionState>('access-control-engineer', {...})` (`:267-276`) conform het vaste patroon uit `src/hooks/useMissionAutoSave.ts`. `handleVoltooi` (`:348-352`) roept `clearSave()` + `onComplete(true)` aan — voortgang wordt correct opgeruimd bij afronding, en tussentijds herladen herstelt state via de hook. Geen custom state-persistentie-logica die van het patroon afwijkt.

2. **[pass] Typering** — volledig getypeerd (`User`, `Regel`, `ToegangsRegel`, `TestScenario`, `MissionState`), geen `any`. Rol-unions zijn consistent (`'leerling' | 'docent' | 'admin' | 'gast'`) over alle interfaces.

3. **[pass] Geen XSS/injectie-risico** — geen `dangerouslySetInnerHTML`, geen AI-interactie/externe input in deze missie (puur client-side simulatie met statische data), dus de mission-CLAUDE.md-eis rond prompt-injection/sanitisatie is hier niet van toepassing (geen AI-laag aanwezig).

4. **[warning] Ontbrekend `aria-pressed` op alle toggle-knoppen**
   Rol-toggles (`:534-551`) en regel-selectie (`:436-467`) communiceren actieve staat alleen via `className`-kleurverschil, niet via `aria-pressed`. Zie ook Design-bevinding 3.

5. **[pass] Geen dead code / geen ongebruikte imports** — alle geïmporteerde iconen (`ArrowLeft, ArrowRight, Shield, CheckCircle2, XCircle, Lock, Unlock, AlertTriangle, Eye, RotateCcw, MessageCircle`) worden daadwerkelijk gebruikt in de JSX.

6. **[info] Geen build/typecheck lokaal gedraaid in deze reviewronde** — deze beoordeling is statisch (bestand gelezen, geen `npm run build`/`tsc` uitgevoerd). Component compileert naar verwachting gezien correcte typing, maar dit is niet experimenteel geverifieerd in deze pass.

---

## Openstaande punten — expliciete afhandeling

### 1. "SLO 22B (Programmeren) mismatch — de opdracht bevat geen programmeeractiviteit."

**Verdict: weerlegd**

Bewijs: `src/config/slo-kerndoelen-mapping.ts:123` bevat het actuele SLO-entry voor deze missie:
```
{ id: 'access-control-engineer', title: 'Access Control Engineer', week: 2, yearGroup: 2, sloKerndoelen: ['21A', '23A'], sloVsoKerndoelen: ['18A', '20A'] },  // -22B/-19A: geen code-activiteit (rollen/rechten configureren + testen, geen programmeren)
```
De missie-eigen SLO-mapping claimt géén 22B — dit is al expliciet uitgesloten, met een inline comment die precies de reden benoemt die het openstaande punt aandraagt. `22B` staat wél in de **periode-brede** `sloFocus` in `src/config/curriculum.ts:185` (`['21A','22A','22B','23A']`), maar dat is de aggregatie over álle elf missies in periode 2 (o.a. `algorithm-architect`, `web-developer`, `bug-hunter`, `code-reviewer` — die wél programmeren) — niet een claim per missie. Er is dus geen mismatch tussen wat deze missie doet (rollen/rechten configureren en testen, geen code) en wat hij claimt (21A Digitale systemen, 23A Veiligheid & privacy). Het punt lijkt te zijn ontstaan door de periode-`sloFocus` te verwarren met de missie-specifieke mapping.

### 2. "Cognitieve belasting stap 2: 24 toggle-knoppen voor leerjaar 2 — structureel herontwerp nodig."

**Verdict: bevestigd (telling klopt), oordeel genuanceerd naar warning**

Bewijs: `src/features/missions/AccessControlEngineerMission.tsx:128-165` (`RESOURCES`, 6 items) × `:531` (`(['leerling','docent','admin','gast'] as const)`, 4 rollen) = 24 individuele toggle-knoppen, gerenderd in `:519-556`. De telling is correct.

Nuance: de knoppen zijn niet ongestructureerd — ze zijn gegroepeerd in 6 losse kaarten (één per resource, met titel + beschrijving), elk met slechts 4 knoppen. Dat is een gebruikelijk patroon (vergelijkbaar met een permissie-matrix) en niet per se bovenmatig voor leerjaar 2, mits de leerling niet alles tegelijk hoeft te overzien — wat hier het geval is dankzij de kaart-chunking en de verticale scroll. Een volledig "structureel herontwerp" (bv. één-resource-per-scherm wizard) is daarom niet strikt noodzakelijk, maar een lichte verbetering is gerechtvaardigd: voeg `aria-pressed` toe (ontbreekt nu, zie Techniek-bevinding 4) en overweeg een voortgangsindicator per kaart ("3 van 6 resources ingesteld") om de dichtheid behapbaarder te maken. Voor het VSO-dagbesteding-profiel (`isVso`) is de dichtheid wél een aandachtspunt, omdat alleen de tekst wordt verkort en de 24-knoppen-structuur ongewijzigd blijft (zie Didactiek-bevinding 5) — daar weegt het argument voor structurele aanpassing zwaarder.

---

## Eindoordeel

**fix-eerst** — de twee blocking didactische lekken (Stap 1 correctheidscheck, Stap 3 antwoord-verklapping) en de twee blocking contrastfouten moeten worden opgelost vóór deze missie naar leerlingen mag. Geen van de vier vereist een architecturale herbouw; alle vier zijn gerichte, lokale fixes binnen het bestaande component.
