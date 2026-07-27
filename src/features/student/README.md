# Student

Deze folder bevat de leerlingzijde van de app: het hoofddashboard, de onboarding, de bibliotheek met eigen werk, docentberichten en welzijnssignalen.

Belangrijke ingangen:

- `ProjectZeroDashboard.tsx`
- `StudentOnboarding.tsx`
- `StudentLibrary.tsx`
- `BookPreview.tsx`
- `TeacherMessagePopup.tsx`
- `WellbeingAlert.tsx`
- `src/app/AuthenticatedApp.tsx`

`ProjectZeroDashboard.tsx` is de ingang, ondanks de naam: er is geen bestand dat naar de map is vernoemd. Het dashboard stelt zich samen uit de bouwstenen in `src/features/dashboard/`.

`WellbeingAlert.tsx` signaleert zorgen over een leerling richting de docent. Dat is gevoelige persoonsgegevensverwerking van minderjarigen: behandel wijzigingen aan wat er gesignaleerd wordt en aan wie als Rood.
