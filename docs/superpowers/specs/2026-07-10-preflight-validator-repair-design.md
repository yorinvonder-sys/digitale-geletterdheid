# Ontwerp: preflight-validatorreparatie

## Doel

Herstel twee bestaande false negatives in de missieregistratie- en missiedoelcontroles, zonder missiegedrag of leerlinginhoud te wijzigen.

## Gekozen aanpak

1. Registreer `ethics-council` in de bestaande `TEMPLATE_ENGINES`-tabel met het bestaande component, de allowlist en de configmap.
2. Laat de doelcontrole twee geldige renderpaden accepteren:
   - een directe `MissionGoalBanner`; of
   - het gedeelde `IntroScreen` met `goal={MISSION_GOAL}`, dat intern de banner rendert.
3. Voeg procesgerichte regressietests toe die de echte controles uitvoeren en een succesvolle exitcode eisen.

## Afgewezen alternatieven

- De twee missies rechtstreeks aan `MissionGoalBanner` koppelen: dit dupliceert gedrag dat `IntroScreen` al correct levert.
- Beide scripts naar volledige TypeScript-AST-analyse ombouwen: robuuster op lange termijn, maar buiten verhouding voor deze afgebakende validatorbugs.

## Grenzen en risico

De wijziging raakt alleen ontwikkeltools en regressietests. Er veranderen geen leerdoelen, antwoorden, scores, authenticatie, databasekoppelingen of productie-instellingen. De bestaande 35 zachte registratiewaarschuwingen blijven zichtbaar en blokkeren de check niet.

## Bewijs

- De nieuwe regressietests falen vóór de reparatie om de twee oorzaken.
- `npm run check:mission-registration` slaagt na de reparatie.
- `npm run check:mission-goals` slaagt na de reparatie.
- De volledige AI-student-unittestset en `npm run doctor` blijven groen.
