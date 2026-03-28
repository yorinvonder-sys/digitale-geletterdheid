# Curriculum Priority Audit — 2026-03-28

## Doel

Een actuele prioritering maken op basis van de huidige codebase, zodat verdere productontwikkeling niet alleen technisch maar ook curriculair en didactisch gericht gebeurt.

## Bronnen

- `config/curriculum.ts`
- `config/slo-kerndoelen-mapping.ts`
- `config/agents.tsx`
- `business/nl-vo/didactische-onderbouwing.md`
- `business/nl-vo/slo-gap-analyse.md`

## Huidige telling uit de actuele mapping

Tellingen per leerjaar en regulier kerndoel, opnieuw uitgelezen uit `config/slo-kerndoelen-mapping.ts` op 2026-03-28:

| Kerndoel | J1 | J2 | J3 |
|---|---:|---:|---:|
| 21A | 11 | 3 | 6 |
| 21B | 7 | 11 | 3 |
| 21C | 3 | 5 | 4 |
| 21D | 8 | 5 | 5 |
| 22A | 12 | 13 | 6 |
| 22B | 3 | 10 | 8 |
| 23A | 5 | 3 | 7 |
| 23B | 8 | 6 | 7 |
| 23C | 11 | 7 | 8 |

## Belangrijkste observatie

De eerder aanbevolen versterkingen zijn grotendeels zichtbaar in de actuele codebase:
- `data-speurder` versterkt `21C` in J1
- `website-bouwer` versterkt `22B` in J1
- `wachtwoord-warrior` versterkt `23A` in J2
- `network-navigator` helpt `21A` in J2

Daardoor zijn de eerdere kritieke gaten niet verdwenen, maar wel minder scherp dan in de oudere gap-analyse.

## Nieuwe prioritering

### Prioriteit 1 — J2 brug tussen systemen, veiligheid en programmeren

`21A` en `23A` in J2 staan nu beide op 3. Dat is beter dan voorheen, maar nog steeds dun vergeleken met de rest van het jaar. Juist in J2 ontstaat de koppeling tussen:
- netwerken en systemen
- privacy by design
- wachtwoorden, accountveiligheid
- praktisch programmeren

Aanbevolen ontwikkelrichting:
- maak een extra J2-missie of reviewlaag waarin systeemkennis, online veiligheid en programmeerlogica samenkomen
- denk aan een missie rond accountbeveiliging, toestemmingen, instellingen, of netwerkfouten in een realistische schoolsituatie

### Prioriteit 2 — J1 programmeren verder verbreden buiten games

`22B` in J1 is verbeterd naar 3, maar blijft smal. De aanwezigheid van `website-bouwer` helpt veel, maar de leerlijn is nog steeds kwetsbaar als programmeren te veel met games geassocieerd blijft.

Aanbevolen ontwikkelrichting:
- versterk J1 met nog een programmeercontext die niet game-gedreven is
- voorbeelden: formulieren, simpele webinteractie, logische beslissingen, schooltools, of robot-/proceslogica

### Prioriteit 3 — J1 data explicieter laten terugkomen in leerlingervaring

`21C` in J1 staat nu op 3. Curriculair is dat een duidelijke verbetering, maar productmatig is het nog steeds een domein dat makkelijk ondergesneeuwd raakt naast AI en mediawijsheid.

Aanbevolen ontwikkelrichting:
- versterk zichtbaarheid van data in opdrachten en dashboards
- laat leerlingen explicieter verzamelen, vergelijken, ordenen en interpreteren
- zorg dat docenten deze voortgang makkelijk kunnen aanwijzen

### Prioriteit 4 — Documentatie en salesclaims bijwerken op actuele dekking

De oude gap-analyse benoemt nog de eerdere kritieke staat. Dat document blijft nuttig als historisch onderlegger, maar voor schoolcommunicatie moet duidelijker worden benoemd dat enkele gaten inmiddels productmatig zijn aangepakt.

Aanbevolen ontwikkelrichting:
- maak een korte update of addendum waarin de nieuwe stand van zaken helder wordt benoemd
- houd onderscheid tussen "historische gap-analyse" en "huidige productstatus"

## Praktische aanbeveling voor eerstvolgende producttaak

Als één taak nu de meeste gecombineerde winst moet opleveren, dan is dit de beste kandidaat:

**Bouw een J2-missie of reviewopdracht die `21A`, `23A` en `22B` verbindt in één realistische schoolsituatie.**

Waarom:
- versterkt twee nog dunne J2-kerndoelen tegelijk
- sluit aan op bestaande programmeerperiode in J2
- is goed verkoopbaar richting scholen
- vergroot praktische relevantie voor leerlingen
- helpt docentrapportage inhoudelijk sterker te worden

## Samenvatting in gewone taal

De grootste gaten zijn niet meer zo groot als in de oudere analyse, omdat er al gerichte missies zijn toegevoegd. De slimste volgende stap is nu niet nóg een losse missie erbij, maar een sterkere brug in leerjaar 2 tussen systemen, veiligheid en programmeren. Dat levert tegelijk didactische winst, betere SLO-balans en sterkere schoolcommunicatie op.
