# AI-testklas — Simulation Lab-batch

Datum: 11 juli 2026  
Scope: alle vijf geregistreerde `simulation-lab`-missies, acht persona's en hun voorkeursapparaten.

## Resultaat

| Missie | Browserruns | Voltooid | Technische fouten | Unieke problemen |
|---|---:|---:|---:|---:|
| `privacy-by-design` | 10 | 10 | 0 | 0 |
| `bug-hunter` | 10 | 10 | 0 | 0 |
| `code-reviewer` | 10 | 10 | 0 | 0 |
| `ai-spiegel` | 10 | 10 | 0 | 0 |
| `algorithm-architect` | 10 | 10 | 0 | 0 |
| **Totaal** | **50** | **50** | **0** | **0** |

Alle 50 refreshcontroles behielden de opgeslagen voortgang en dezelfde zichtbare stap. Desktop, mobiel, iPad portrait en iPad landscape zijn afgedekt.

## Verbeteringen tijdens de review

- Een zichtbare instelling wordt vóór de vragen daadwerkelijk bediend, zodat de simulatie en niet alleen de quiz wordt getest.
- Alle antwoord-, parameter-, navigatie- en verdiepingsknoppen hebben een touchhoogte van minimaal 44 CSS-pixels.
- De gedeelde verdiepingsopties en de knop `Vorige` zijn van 40 naar minimaal 44 pixels gebracht.
- Browseracties zijn aan de actieve vraag gescopeerd; identieke optie-indexen in eerdere vragen kunnen geen verkeerde klik meer veroorzaken.
- Simulation Lab heeft nu expliciet autosave- en refreshbewijs.
- De rapportwriter maakt een ontbrekende bovenliggende rapportmap zelf aan.

## Grenzen

De runs gebruiken uitsluitend de lokale previewroute met synthetische persona's. Authenticated staging en server-side voortgang zijn niet uitgevoerd. Runtime-artefacten met screenshots, traces en telemetry staan bewust in de genegeerde `test-results/`-map en worden niet gecommit.
