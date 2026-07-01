# Batch-review wave 6 — fix-inhaalslag (2026-07-01)

Wave 6 was het derde deel van de inhaalslag. We hebben missies aangepakt waar eerder al 1 fix was gedaan, maar waar nog meer open stond. Alle vier de missies houden open punten voor jou en staan daarom op blocked. (Modus: sweep, fix-pass op bestaande rapporten.)

| Missie | Fixes toegepast | Codex-gate | Eindstatus | Open punten voor Yorin |
| :--- | :--- | :--- | :--- | :--- |
| research-project | 3 fixes (zwaarste open vraag q8 telt nu 10 punten mee, som exact 100; introtitel naar leerlingperspectief; verouderde kleur naar bestaand donker token) | ALLOW | blocked | 1) chat aanzetten voor de Onderzoekscoach in dataset 3? (productkeuze) 2) systemInstruction client-side (verificatie) |
| digital-forensics | 0 fixes netto — de timestamp-'fix' van de agent is teruggedraaid nadat Codex natelde dat hij juist NIEUWE inconsistenties maakte | BLOCK (fix teruggedraaid) | blocked | 1) verhaallijn ronde 1 vs ronde 2 — kies één consistent verhaal 2) kleuren agent-preview (design) 3) SLO 21C past niet in periode-focus J3-P2 (curriculum-keuze) |
| phishing-fighter | 1 fix (leerdoelen-array toegevoegd); gradient-kleurswap teruggedraaid (identiteitsbeslissing) | ALLOW | blocked | kaart-kleuren: duck-palet heeft geen warm equivalent voor goud/koraal — design-beslissing |
| ai-beleid-brainstorm | 2 fixes (Bloom-leerdoelen gedocumenteerd; dashboard-SLO 23B→21D conform mapping) | ALLOW | blocked | 1) kaart-kleuren (design) 2) aria-label stemknop (klein, ander bestand) 3) leerlingnaam wordt niet opgeslagen bij feedback-insert (database, jouw beslissing) |

### Escalaties voor Yorin

- **research-project**: 1) Moeten we de chat aanzetten voor de Onderzoekscoach in dataset 3? Dit is een productkeuze. 2) De systemInstruction staat aan de client-kant. Moet dat zo blijven?
- **digital-forensics**: 1) De verhaallijn in ronde 1 en ronde 2 klopt niet met elkaar. Er zijn verschillende gebruikers, tijden en aantallen; de titel zegt "vijf mislukte pogingen", maar de log toont er vier. Kies één consistent verhaal. 2) De kleuren in de agent-preview zijn een design-kwestie. 3) SLO 21C past niet in de periode-focus J3-P2. Dit is een curriculum-keuze.
- **phishing-fighter**: De kaart-kleuren kunnen niet worden aangepast: het duck-palet heeft geen warme kleur die goud of koraal vervangt. Jij moet een design-beslissing nemen.
- **ai-beleid-brainstorm**: 1) De kaart-kleuren zijn een design-kwestie. 2) Het aria-label voor de stemknop moet worden toegevoegd (klein, ander bestand). 3) De leerlingnaam wordt niet opgeslagen bij het invoegen van feedback. De docent ziet dus niet wie wat heeft ingestuurd. Dit is een database-kwestie en jouw beslissing.

## Engine-brede punten (alle waves)

1. scenario-engine FeedbackBanner: 'Volgende ronde'-knop wit-op-geel, contrast ~1.3:1 (onleesbaar) — raakt ALLE scenario-missies
2. tool-guide engine toont learningObjectives nergens, terwijl missies het veld invullen
3. data-viewer: 4 a11y/design-punten (gradient, accent-kleur, aria-sort, aria-label filterveld)
4. debate-arena: badge-kleur #202023 in alle 4 configs identiek; CSS-variabelen-brug ontbreekt; argumentPrompts is een dood veld
5. CompletionScreen/SimpleChart: kleur-tokenisatie vereist echte constanten i.p.v. losse hex
6. duck-palet mist warme kleuren (coral/teal/goud) — elke kleur-swap van oude kaarten is daardoor een design-beslissing; twee developer-schermen gebruiken al niet-bestaande duck-kleuren (apart taakje aangemaakt)
7. shared PhaseHeader: aria-live op scoreweergave (toegankelijkheid)

## Stand van de wachtrij

- **5 fixed** · **26 blocked (wachten op Yorin)** · **68 pending**
- **Volgende wave (7)**: ai-bias-detective, ai-trainer, code-review-2, cyber-detective, data-detective
