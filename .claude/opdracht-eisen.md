# Opdracht-eisen: verplichte doorloop voor nieuwe leerling-opdrachten

**Lees dit vóór de eerste regel code van een nieuwe of substantieel herschreven
leerling-opdracht (missie, demo-taak, lesactiviteit).**

Dit bestand is een *route*, geen tweede rubric. De eisen zelf staan in de skills en
documenten waarnaar hier verwezen wordt — dat blijft de bron. Kopieer eisen hier niet
naartoe; dan lopen ze uit elkaar.

Geldt niet voor: tekstuele correcties, kleurwijzigingen of andere mechanische edits in
een bestaande opdracht.

---

## De zes poorten

Doorloop in volgorde. Een poort is pas klaar als het stop-criterium gehaald is.

| # | Poort | Roep aan | Klaar als |
|---|---|---|---|
| 1 | Intake | `docs/agent/dgskills-mission-factory.md` § Missie Intake | Doelgroep, leerjaar, niveau, "waarom nu", scope en risicolabel Groen/Geel/Rood staan op papier |
| 2 | Ontwerp | skill `opdracht-ontwerp-check` + `docs/pedagogy/rubric.md` | Ontwerp-score ≥ 16/20, geen harde blokker, en rubriekvragen V1 (authenticiteit), V3 (denkorde) en V7 (leerbaar bewijs) minimaal ⚠ |
| 3 | Differentiatie | dit bestand, § Differentiatie-eis | Basis, kern én verdieping zijn benoemd in de briefing |
| 4 | Bouwen | skill `dgskills-mission-author` (handmatig) of `dgskills-build-mission` (autonoom) | De 7 invarianten uit die skill zijn geland |
| 5 | Review | skill `dgskills-mission-review` → `opdracht-live-check` → `opdracht-klaar-check` | Verdict `ship`, geen veto |
| 6 | Veiligheid | dit bestand, § Veiligheidspoort | Het juiste niveau is doorlopen |

Poort 5 in die volgorde: eerst de drie sub-reviewers (didactiek, design, techniek), dan
het live student-playthrough voor browserbewijs, dan pas de brede eindrubric — die laatste
heeft dat bewijs nodig.

---

## Differentiatie-eis (poort 3)

Naast het bestaande missie-brede label `difficulty: easy | medium | hard`
(`src/types.ts`, `src/config/missionMeta.ts`) moet elke nieuwe opdracht *binnen* zichzelf
drie routes benoemen.

| Route | Voor wie | Eis |
|---|---|---|
| **Basis (vangnet)** | De leerling die vastloopt | Minstens één extra scaffold-stap die de AI-coach aanbiedt ná een vastloper: een voorbeeld, een invulzin of een stappenhulp — zonder het antwoord weg te geven |
| **Kern (verplicht)** | Iedereen | Het leerbare bewijs uit rubriekvraag V7. Dit is wat de opdracht "af" maakt |
| **Verdieping (optioneel)** | De leerling die meer wil | Een taak op een hógere Bloom-orde dan de kern (kern analyseren → verdieping evalueren of creëren) — niet meer van hetzelfde |

Twee harde regels:

- **Verdieping is nooit XP-verplicht.** XP is een competentiesignaal, geen prikkel
  (rubriekvraag V5). Een leerling die de kern haalt, heeft de opdracht af.
- **Een oplopende levelreeks is pas verdieping als het laatste niveau optioneel is.**
  Zijn alle levels nodig om de opdracht af te ronden (of om de badge te krijgen), dan is
  het een sequentie, geen differentiatie — en ontbreekt de verdiepingsroute nog.
- **Basis is geen aparte, makkelijkere opdracht.** Het is dezelfde taak met meer
  ondersteuning. Mavo, havo en vwo delen dezelfde missies; het verschil zit in de
  begeleiding, niet in de taak (`business/nl-vo/didactische-onderbouwing.md`
  § Differentiatie).

Neem dit blok letterlijk op in de missie-briefing:

```
Differentiatie
- Basis (vangnet):
- Kern (verplicht bewijs):
- Verdieping (hogere Bloom-orde):
- Niveau-notitie mavo/havo/vwo:
```

---

## Veiligheidspoort (poort 6)

Welk niveau je nodig hebt, hangt af van wat de opdracht raakt:

| Situatie | Verplicht |
|---|---|
| Gewone opdracht, geen nieuwe dataverwerking | Criterium 10 van `opdracht-klaar-check` volstaat |
| Nieuwe leerlinginvoer of een nieuw AI-endpoint | + skill `dgskills-compliance-check` |
| Gevoelig onderwerp, persoonsgegevens, of een claim richting scholen | + skill `dgskills-jurist-check` |

Risicolabel Rood uit poort 1 (auth, Supabase, AI-endpoints, leerlingdata, secrets,
productie-instellingen) betekent altijd minimaal `dgskills-compliance-check`.

De vaste kindveiligheidsregels — prompt injection, XSS, systeeminstructie server-side
houden, welzijnssignalen doorverwijzen — staan in `src/features/missions/CLAUDE.md` en in
`dgskills-mission-author`. Die gelden onverkort, ook bij een Groene opdracht.

---

## Harde blokkers

Deze overrulen elke score. Bron: `opdracht-ontwerp-check` (vóór bouwen) en
`opdracht-klaar-check` (na bouwen).

**Vóór bouwen — niet beginnen als:**
- er geen waarneembaar leerdoel is;
- er geen leerbaar bewijs uitkomt;
- de AI het antwoord zou geven in plaats van coachen;
- de opdracht om persoonlijke of gevoelige leerlinggegevens vraagt;
- de taak te breed is voor één les of één missie.

**Na bouwen — niet shippen als:**
- er geen leerbaar bewijs is;
- de AI het kernantwoord weggeeft of het werk van de leerling doet;
- de opdracht onspeelbaar is op mobiel of tablet;
- een belangrijke knop of voortgangsindicator verborgen, afgeknipt of onbruikbaar is;
- een privacy-, security- of minderjarigenkwestie open staat;
- zichtbare UI is veranderd zonder browserbewijs over vier viewports (desktop, tablet
  portrait, tablet landscape, mobiel).

---

## Let op bij poort 4

`dgskills-mission-author` en `dgskills-mission-fixer` noemen nog paden zonder
`src/`-prefix (`components/missions/`, `config/curriculum.ts`). De repo gebruikt
`src/features/missions/` en `src/config/curriculum.ts`. Volg de paden uit
`.claude/skill-router.md` en `src/features/missions/CLAUDE.md`; die kloppen wel.
