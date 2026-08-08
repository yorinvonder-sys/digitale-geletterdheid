# Model- en Denkniveau-Selectie — Verdieping

Aanvulling op de sectie in de root `CLAUDE.md`. Die sectie bevat wat je elke
sessie nodig hebt: sessiestart-check, modelpalet, taakclassificatie,
denkniveau-praktijk en de regels voor agents. Dit bestand bevat wat je erbij
pakt wanneer het aan de orde is — bij twijfel over kosten, bij escalatie, en
vóór afronding.

## Kostenregel

Beoordeel totale taakkosten, niet prijs per token. Luna en DeepSeek zijn alleen
goedkoper zolang de taak binnen hun risico- en effortplafond blijft. Schakel naar
Sol zodra extra herstelrondes of een te hoog effortniveau nodig zijn. Claude
Opus/Fable zijn onafhankelijke specialistische routes, geen goedkope fallback.

## Effort Escalation

| Route | Default | Escalate | Stop and reroute |
|---|---|---|---|
| DeepSeek V4 Flash | `low` | `high` for sanitized multi-file analysis | `max` or Rood -> Sol |
| Luna | `medium` | `high` for isolated Geel | `xhigh`/`max` -> Sol |
| Terra shadow | `medium` | `high` for complex shadow comparison | Never apply output directly |
| Sol | `high` | `xhigh` for Rood; `max` for security incidents | `ultra` requires manual justification |
| Opus 5 | `medium` build, `high` review | `xhigh` for Rood; `max` for security review | No family fallback |

## Escalatieregels

- Verhoog het denkniveau bij nieuwe onzekerheid, onverwachte dependency-effecten,
  productie-impact of securityrisico.
- Verlaag het niveau niet enkel om kosten te besparen zolang relevante risico's
  niet onderzocht zijn.
- Meer denkvermogen vervangt nooit runtimeproeven, tests, directe
  configuratiecontrole of onafhankelijke review.
- DeepSeek and Terra receive sanitized packets without tools; Luna may edit only
  non-Rood paths and never receives Bash. Internal OpenCode maintenance uses Sol.
- Groen bouwen, linten of `npm audit` bewijst geen runtimecompatibiliteit of
  veiligheid.
- Verifieer kritieke claims via de echte downstream consumer en het werkelijk
  bereikbare productiepad.
- Een model mag zijn eigen kritieke wijziging niet als enige reviewer goedkeuren.
- Voor auth, RLS, security, dependencies, migraties en productieconfiguratie is
  een onafhankelijke read-only eindreview verplicht vóór merge.
- Wijzig draft/ready-status, merge-status, externe configuratie of productie
  alleen als de gebruiker daar expliciet om vraagt.
- Ordinary release evidence is created by Sol `xhigh`, reviewed by Opus 4.8
  `xhigh`, and decided by the user.
- Security-incident remediation is created by Sol `max`, blind-reviewed by
  Fable 5 `max` and Opus 5 `max`, reconciled by Sol, and decided by the user.

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
