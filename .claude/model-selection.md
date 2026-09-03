# Model- en Denkniveau-Selectie — Verdieping

Aanvulling op de sectie in de root `CLAUDE.md`. Die sectie bevat wat je elke
sessie nodig hebt: sessiestart-check, modelpalet, taakclassificatie,
denkniveau-praktijk en de regels voor agents. Dit bestand bevat wat je erbij
pakt wanneer het aan de orde is — bij twijfel over kosten, bij escalatie, en
vóór afronding.

## Kostenregel

Beoordeel totale taakkosten, niet prijs per token. Opus 5 low/medium kan
goedkoper zijn dan Sonnet high/xhigh wanneer het minder herstelpogingen,
redeneertokens en toolrondes kost. Kies Sonnet voor eenvoudig volume; Opus
wanneer de taak werkelijk redeneerkwaliteit vereist.

## Escalatieregels

- Verhoog het denkniveau bij nieuwe onzekerheid, onverwachte dependency-effecten,
  productie-impact of securityrisico.
- Verlaag het niveau niet enkel om kosten te besparen zolang relevante risico's
  niet onderzocht zijn.
- Meer denkvermogen vervangt nooit runtimeproeven, tests, directe
  configuratiecontrole of onafhankelijke review.
- Groen bouwen, linten of `npm audit` bewijst geen runtimecompatibiliteit of
  veiligheid.
- Verifieer kritieke claims via de echte downstream consumer en het werkelijk
  bereikbare productiepad.
- Een model mag zijn eigen kritieke wijziging niet als enige reviewer goedkeuren.
- Voor auth, RLS, security, dependencies, migraties en productieconfiguratie is
  een onafhankelijke read-only eindreview verplicht vóór merge.
- Wijzig draft/ready-status, merge-status, externe configuratie of productie
  alleen als de gebruiker daar expliciet om vraagt.

## Zelfevaluatie vóór uitvoering

De Front-door triage in `CLAUDE.md` dekt taaktype, omkeerbaarheid en of een stap
een beslissing of ontwerp verbergt. Stel daar bovenop alleen vast: welke
kritieke domeinen worden geraakt, welk bewijs de taak vereist, en of
onafhankelijke review nodig is.

## Zelfevaluatie ná uitvoering

Geen aparte verificatieronde en geen "dubbelcheck je werk"-instructies — die
leiden tot over-verificatie. Verifieer tijdens het werk en controleer vóór
afronding alleen dit: zijn alle eisen echt uitgevoerd; welke claims zijn direct
bewezen versus alleen afgeleid; draaien de tests écht in CI (en kunnen
branchnamen of conditionele workflows dat omzeilen); welke risicopaden en
configuratiescopes zijn ongetest gebleven; is een onafhankelijke reviewer nodig
vóór merge.

## Rapportage

Vermeld alleen: gekozen classificatie (als relevant); uitgevoerd bewijs/tests;
resterende onzekerheden; nodige onafhankelijke review; en een duidelijke
conclusie — gereed / gereed onder voorwaarden / niet gereed.

## Modelpalet

| Model | Kies bij |
|---|---|
| Haiku 4.5 | Bulkwerk, classificatie, goedkope read-only subagents. Let op: 200K context i.p.v. 1M. Nooit voor code die gemerged wordt. |
| Sonnet 5 | Teksten, docs, styling, afgebakende componentwijzigingen, repetitief onderhoud. |
| Opus 5 | Standaard voor echte codewijzigingen en alles in de kritieke domeinen. |
| Fable 5 | Niet gebruiken in deze repo (stand juli 2026). De securityclassifier geeft hoge false positives op auth-, RLS- en security-adjacent werk en routeert dan stil door naar een zwakker model — precies de kritieke domeinen van dit project, tegen dubbel tarief ($10/$50 vs $5/$25). Opus 5 scoort bovendien hoger op codeerbenchmarks. Herbeoordeel als de false-positive-rate aantoonbaar is opgelost. |

## Taakclassificatie

| Model + niveau | Wanneer |
|---|---|
| Sonnet 5 low/medium | Teksten, documentatie, eenvoudige styling, kleine componentwijzigingen, repetitief werk, duidelijk afgebakend onderhoud. |
| Opus 5 low | Standaard voor normale codewijzigingen, overzichtelijke bugs, reguliere implementatie. |
| Opus 5 medium | Complexe features, frontendinteracties, animaties, state-samenwerking, normale PR-reviews, wijzigingen over meerdere bestanden. |
| Opus 5 high | Supabase, auth, rollen, sessies, dependencies, CI/CD, Vercel-config, performanceproblemen, architectuur, moeilijk reproduceerbare regressies. |
| Opus 5 xhigh | Grote productie-impact, complexe securityvragen, dependencyconflicten, database-/datamigraties, regressies over meerdere systemen of branches. Ook: agentische codeertaken over veel bestanden. |
| Opus 5 max | Zelden. Alleen wanneer correctheid zwaarder weegt dan kosten én latency, en er geen tweede reviewer beschikbaar is. |

Denkniveau-gebruik in de praktijk:

- `high` is de default; ga daar niet standaard boven zitten.
- Voor agentisch codeerwerk begin je op `xhigh` en werk je omláág zodra het werkt.
- `low` en `medium` presteren op Opus 5 uitzonderlijk goed tegen een fractie van
  de tokens. Test omlaag voordat je omhoog escaleert.
- `max` is niet "veiliger" — het leidt vaker tot overthinking en diminishing
  returns. Een onafhankelijke tweede reviewer op `xhigh` is sterker dan één
  reviewer op `max`.
- Op `xhigh`/`max`: reken op een ruim outputbudget, anders kapt het werk af.

## Agents en subagents

Kies model + denkniveau per subagent apart; erf niet automatisch het niveau van
de hoofdsessie.

- Zoeken, inventariseren, read-only verkenning: Haiku 4.5 of Sonnet 5, `low`.
- Implementerende subagent op niet-kritieke code: Opus 5 `low`/`medium`.
- Subagent die auth, RLS, migraties of productieconfiguratie raakt: Opus 5
  `high` minimaal — dezelfde ondergrens als de hoofdsessie.
- Onafhankelijke eindreview: Opus 5 `xhigh`, en het mag niet dezelfde agent zijn
  die de wijziging schreef.
- Delegeer alleen wanneer de opbrengst de overhead overtreft. Een subagent
  herbouwt zijn context, rapporteert terug, en jij leest die rapportage — voor
  een paar bestandslezingen of een simpele edit is dat verlies. Gebruik geen
  subagent om je eigen werk te verifiëren; verificatie hoort in de hoofdloop.

## Beknoptheid

Opus 5 schrijft standaard langere antwoorden én langere bestanden dan eerdere
modellen. Een lager denkniveau lost dat niet op — dat vergt een expliciete
instructie. Houd zichtbare antwoorden en rapportage kort, en beperk
Markdown-deliverables tot de inhoud: geen vulsecties, geen herhaalde
samenvattingen, geen boilerplate.
