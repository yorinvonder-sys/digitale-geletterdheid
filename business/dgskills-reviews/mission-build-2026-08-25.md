# Missie-review: mission-build (De Bouw)

**Datum:** 2026-08-25
**TemplateType:** tool-guide
**AI-gedrag & privacy:** aparte veiligheids-pass (zie sweep-rapport).

## Design — score 7/10

De config bevat alleen copy/structuur (geen inline styling), dus veel design-criteria zijn engine-gedreven. Geen missie-specifieke design-afwijkingen gevonden.

- ✅ Copy-lengte per stap is passend voor leerjaar 1 periode 4 (korte instructies, duidelijke bullets).
- ✅ Consistente structuur met andere `tool-guide`-missies (title/instruction/tip/checklistItems/verificationQuestion).
- ⚠️ Stap 4 (`stap-4-delen`) heeft 4 checklist-items terwijl stap 1–3 er 3 hebben — geen probleem op zich, maar het maakt de laatste stap zichtbaar zwaarder zonder dat de UI dat visueel signaleert (geen aparte weging in copy). Cosmetisch, geen blocker.
- Engine-brede Visual Precision Gate (alignment/overlap/text-fit) is niet apart geverifieerd voor deze missie — geen Chrome-plugin bewijs beschikbaar in deze pass; markeer als **unverified**, niet als fail.

## Didactiek — score 6/10

- ✅ Sterke pedagogische kern: "de kern bouwen, niet het hele project" is goed uitgelegd met concrete tegenvoorbeelden (vijf lege pagina's vs. één werkende pagina).
- ✅ Peer-testing stap (stap 3) is didactisch sterk: expliciete instructie "jij zegt niets" traint een waardevolle vaardigheid (observeren i.p.v. verdedigen).
- ✅ Verificatievragen testen begrip van het concept (kern vs. oppervlakkig), niet losse feitjes.
- ❌ **Blocking (via engine, concreet voor deze missie):** de engine-bevinding "scoring is niet gokbestendig" en "kennisbonus is gratis bij allowRetry" raakt deze missie direct: `maxScore: 60`, badge-drempel `Bouwmeester` bij 55 en `Bouwer` bij 40 zijn beide met puur doorklikken haalbaar zonder dat een leerling daadwerkelijk iets bouwt, test of deelt. Voor een missie die draait om "je hebt écht iets gemaakt en getest" is dit een didactisch zwaarwegend gat — precies het gedrag dat de missie wil voorkomen (leeg product, geen echte test) wordt door de scoring niet tegengehouden. Dit is een engine-bevinding, geen missie-specifieke fix.
- ⚠️ `teacherCheck` staat alleen op stap 4, niet op stap 2 (de kern bouwen) of stap 3 (de test) — de docent verifieert dus pas aan het eind of de kern zelf ooit écht gebouwd is; als de checklist-items bij stap 2/3 zonder controle worden aangevinkt, ziet de docent dat pas laat.

## Tech — score 8/10

- ✅ Config is syntactisch correct en volgt het `ToolGuideConfig`-contract.
- ✅ Registry-entries kloppen: `templateRegistry.ts:105` (`tool-guide`), `curriculum.ts:133` (leerjaar1/periode4), `slo-kerndoelen-mapping.ts:91` (22A/21A, vso 19A/18A), `missionGoals.ts:349` (`steps-complete`, min 4).
- ⚠️ `missionGoals.ts` zegt `min: 4` (steps-complete) terwijl de missie 4 stappen heeft — dit vereist dus dat alle 4 stappen compleet zijn, wat consistent is met de config. Geen fout, alleen genoteerd ter bevestiging.
- Engine-bevindingen die deze missie ook raken (niet apart te fixen op missie-niveau): state-herstel zonder validate-callback (crash-risico bij configwijziging) en `handleComplete` zonder dubbelklik-guard. Genoteerd, geen actie vereist in `mission-build.ts` zelf.

## Voorstellen

Geen mechanische auto-fix mogelijk binnen de missie-eigen whitelist-bestanden: de kernbevinding (gokbestendige scoring, kennisbonus-misbruik) zit in de gedeelde `ToolGuide.tsx`-engine, niet in `mission-build.ts` of de registry-entries. Er is geen voor/na-snippet binnen de whitelist die dit oplost.

Eén optionele, niet-blocking suggestie binnen de whitelist (niet toegepast, want geen bug):

```ts
// voor (mission-build.ts, stap 2 — teacherCheck ontbreekt)
{
    id: 'stap-2-kern',
    ...
    verificationQuestion: { ... },
},

// na — teacherCheck toevoegen zodat de docent ook de kern zelf kan controleren, niet alleen het eindresultaat
{
    id: 'stap-2-kern',
    ...
    teacherCheck:
        'Laat je docent de kern van je project zien vóórdat je verdergaat. De docent controleert: het werkt van begin tot eind en er staat jouw eigen inhoud in, geen voorbeeldtekst.',
    verificationQuestion: { ... },
},
```

## Samenvatting en verdict

De inhoudelijke kwaliteit van `mission-build` is sterk: heldere didactische kern (bouw de kern, test zonder uit te leggen, deel testbaar), passende taal voor leerjaar 1, correcte registry-wiring. Het enige zwaarwegende probleem — scoring zonder inhoudelijke controle, waardoor een leerling zonder iets te bouwen toch de hoogste badge haalt — zit in de gedeelde `ToolGuide`-engine en is al vastgesteld in de enginebeoordeling; dit is geen missie-specifiek defect en dus geen auto-fixable item op missieniveau.

**Verdict: ok** (didactisch en technisch gezond op missie-niveau; het engine-brede scoring-gat wordt niet opnieuw als missie-specifieke blocker geteld — zie escalations).
