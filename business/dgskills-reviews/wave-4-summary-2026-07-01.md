# Batch-review wave 4 — fix-inhaalslag (2026-07-01)

Wave 4 was een inhaalslag. We hebben oude voorstellen uit reviews van 17 juni alsnog uitgevoerd. Sommige missies zijn nu klaar, andere missies hebben nog open punten voor jou. (Modus: sweep, waveSize 5, fix-pass op bestaande rapporten.)

| Missie | Fixes toegepast | Codex-gate | Eindstatus | Open punten voor Yorin |
| :--- | :--- | :--- | :--- | :--- |
| game-director | 8 fixes (chat-rol gekoppeld via roleId, Level-1 voltooiingscheck via reachedGoal, hover-knop, mobiel canvas min-hoogte, aria-label, dashboard-SLO naar 22B conform autoritaire mapping, goalCriteria min 5, types aangescherpt) | ALLOW | fixed | geen |
| print-pro | 4 fixes (3 badge-kleuren gedifferentieerd, docent-check stap 1, verificatievraag stap 2, maxScore 55→60 + topbadge 60 als herstel van Codex-BLOCK: 4e vraag maakte 60 haalbaar) | BLOCK→ALLOW | fixed | geen (engine-punt naar gedeelde lijst) |
| network-navigator | 1 fix (6 hardcoded hex-kleuren uit grafiekdata, engine kiest nu zelf kleuren) | ALLOW | blocked | keuze goalCriteria-type: config zegt 'rounds-complete', agent-bestand 'steps-complete' — welke is canoniek? |
| reflection-report | 0 fixes (voorgestelde token-swap teruggedraaid: duck-coral bestaat niet als kleur) | geen gate | blocked | 1) missie-doel zegt essay schrijven maar template is een debat (productkeuze) 2) systemInstruction staat client-side (verificatie nodig) 3) kleur-swap vereist design-beslissing |
| policy-maker | 0 fixes (alle voorstellen verouderd/technisch onjuist/buiten scope) | geen gate | blocked | 1) badge-kleur-aanpak template-breed 2) missie-doel belooft schrijfstap die template niet heeft 3) systemInstruction client-side 4) promptSanitizer-verificatie |

### Escalaties voor Yorin

- **network-navigator**: Kies welk goalCriteria-type de juiste is. De config zegt 'rounds-complete', maar het agent-bestand zegt 'steps-complete'.
- **reflection-report**: 1) Het missie-doel zegt dat de leerling een essay schrijft, maar de template is een debat. Welk product moet het worden? 2) De systemInstruction staat aan de client-kant. Moet dat zo blijven of moet het naar de server? 3) De kleur-swap kan niet door omdat de kleur niet bestaat. Jij moet een design-beslissing nemen over een nieuwe kleur.
- **policy-maker**: 1) De badge-kleur-aanpak moet voor de hele template worden bepaald. 2) Het missie-doel belooft een schrijfstap die de template niet heeft. 3) De systemInstruction staat aan de client-kant. 4) De promptSanitizer moet worden geverifieerd.
