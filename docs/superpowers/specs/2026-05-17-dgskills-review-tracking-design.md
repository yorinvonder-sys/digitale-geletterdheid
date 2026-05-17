# DGSkills Review Tracking Design

Datum: 2026-05-17

## Doel

DGSkills missiereviews moeten voortaan structureel bijgehouden worden in een vaste bron van waarheid, zodat Yorin en Codex altijd kunnen zien welke opdrachten al volledig gereviewed zijn, welk bewijs bestaat, wat nog onzeker is en welke batch als volgende aan de beurt is.

De eerste reviewbatch na dit ontwerp is J2 P1 Data & Informatie.

## Gekozen Aanpak

We gebruiken de aanbevolen lichte proceslaag:

- `docs/audits/dgskills-mission-review-dashboard.md` is de menselijke bron van waarheid.
- `AGENTS.md` krijgt een korte instructie dat Codex dit dashboard altijd eerst moet lezen bij DGSkills opdracht-/missiereviews.
- Na elke nieuwe periodereview of hercheck werkt Codex het dashboard bij.

Er komt nu geen JSON-, TS- of database-statusregistry. Dat is pas nodig als we later automatische dashboards, scripts of UI-overzichten willen bouwen.

## Dashboardafspraken

Het dashboard blijft menselijk leesbaar en bevat minimaal:

- status per periode;
- status per opdracht;
- bewijsbasis;
- hoofdblokker;
- eerstvolgende actie;
- link naar perioderapporten zoals `docs/audits/dgskills-j2p1-workability-audit-YYYY-MM-DD.md`.

De statuswaarden blijven:

- `niet gestart`
- `static-only`
- `browser smoke`
- `werkbaarheidsreview`
- `fix nodig`
- `hercheck nodig`
- `release-kandidaat`

Het Yorin-oordeel per opdracht blijft:

- `ship`
- `fix-eerst`
- `menselijke keuze nodig`

## Standaard Codex-Gedrag

Bij elke DGSkills opdracht-/missiereview moet Codex eerst:

1. `docs/audits/dgskills-mission-review-dashboard.md` lezen.
2. De relevante periode en opdrachtstatus opzoeken.
3. Bestaande perioderapporten raadplegen als die in het dashboard genoemd zijn.
4. Pas daarna code, configs, browserchecks of nieuwe rapportage uitvoeren.

Na een review of hercheck moet Codex:

1. Een perioderapport toevoegen of bijwerken.
2. Het dashboard bijwerken met de nieuwe status, bewijsbasis, blocker en eerstvolgende actie.
3. Expliciet melden wat nog niet bewezen is, inclusief echte iPad/Safari als dat niet getest is.

## Niet In Scope

- Geen productfixes.
- Geen automatische statusgenerator.
- Geen database- of Supabase-wijzigingen.
- Geen volledige nieuwe missiereview in deze spec.

## Acceptatiecriteria

Deze trackingaanpak is goed ingevoerd wanneer:

- `AGENTS.md` Codex verplicht om het dashboard eerst te lezen bij DGSkills missiereviews.
- Het dashboard de centrale statusbron blijft voor alle 96 curriculum-/reviewopdrachten.
- Nieuwe perioderapporten het dashboard als input en output gebruiken.
- De eerstvolgende reviewscope expliciet J2 P1 Data & Informatie is.

## Self-Review

- Geen placeholders of open `TODO`s.
- Scope blijft beperkt tot reviewtracking en standaard Codex-gedrag.
- De gekozen aanpak is bewust menselijk leesbaar en niet zwaarder dan nodig.
