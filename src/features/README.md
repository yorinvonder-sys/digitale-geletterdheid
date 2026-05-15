# Features

`src/features/` bevat lichtgewicht feature slices: productdomeinen met eigen componenten, lokale types, data en subcomponents waar dat nuttig is.

Gebruik deze regels bij nieuw werk:

- Zet domeinspecifieke UI in de featurefolder.
- Zet breed herbruikbare bouwstenen in `src/components/ui/` of `src/components/app-shell/`.
- Houd gedeelde Supabase, AI, analytics en exportlogica in `src/services/`.
- Gebruik `@/features/<feature>/...` imports voor featurecode.
- Voeg alleen een feature-README toe bij hoog-risico of complexe flows.

Cross-feature imports zijn voorlopig toegestaan voor compositieflows zoals AI Lab, teacher previews en missies. Documenteer nieuwe crossings liever hier of in `ARCHITECTURE.md` dan ze stilzwijgend te verspreiden.
