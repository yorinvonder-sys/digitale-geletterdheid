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
