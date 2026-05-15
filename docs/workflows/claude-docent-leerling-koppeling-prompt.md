# Claude Prompt — Docent-Leerling Koppeling

Gebruik deze prompt als Claude vooral de functionele samenhang tussen docentdashboard en leerlingervaring moet verbeteren.

Kopieer alles tussen `---PROMPT START---` en `---PROMPT END---`.

---PROMPT START---

Je werkt in deze repository als de primaire builder.

## Doel

Verbeter de functionele koppeling tussen het docentendashboard en de leerlingervaring in DGSkills.

De kernvraag is:
kan een docent in het dashboard echt sturen op wat leerlingen zien, kunnen starten, afronden en terugkrijgen?

Los dus vooral disconnects op tussen:
- focus mode
- missie-beschikbaarheid
- klasinstellingen
- docentberichten
- missievoortgang
- nulmeting / assessment / reporting
- leerlingdashboard en leerlingnavigatie

## Lees eerst

Minimaal:
- `CLAUDE.md`
- `AuthenticatedApp.tsx`
- `components/TeacherDashboard.tsx`
- relevante bestanden in `src/features/teacher/`
- `components/ProjectZeroDashboard.tsx`
- `components/StudentAIChat.tsx`
- `components/StudentLibrary.tsx`
- `services/teacherService.ts`
- `services/missionService.ts`
- `services/authService.ts`
- `services/supabase.ts`
- `types.ts`
- `config/missions.ts`
- `config/curriculum.ts`
- `src/features/teacher/MissionProgressPanel.tsx`
- `src/features/teacher/SLOClassOverview.tsx`
- `src/features/teacher/CLAUDE.md`
- `SECURITY.md`

## Hoofdfocus

Werk toe naar een docentdashboard dat duidelijk en betrouwbaar gekoppeld is aan de leerlingkant.

Controleer en verbeter minimaal:
- welke docentinstellingen effect hebben op leerlingen
- of dat effect zichtbaar, logisch en consistent is
- of teacher-side data dezelfde bron van waarheid gebruikt als student-side voortgang
- of docentacties veilig zijn binnen school-/klasgrenzen

## Wat je concreet moet onderzoeken en waar nodig moet verbeteren

1. Focus mode:
   - klopt de koppeling tussen teacher toggle, classroom config en student gedrag?
   - is voor docenten duidelijk wat focus mode precies doet aan de leerlingkant?

2. Mission availability:
   - sluiten enabled missions en klasinstellingen aan op wat leerlingen echt kunnen openen?
   - voorkom mismatch tussen teacher settings en student dashboard

3. Teacher messages:
   - sluit verzenden in het docentdashboard aan op de student message flow?
   - is de targeting op leerling, klas en broadcast logisch en veilig?

4. Progress and reporting:
   - gebruik docentweergave dezelfde semantiek als de leerlingvoortgang?
   - voorkom tegenstrijdigheid tussen `missionsCompleted`, `missionProgress`, nulmeting en SLO-overzichten

5. Teacher understanding of student reality:
   - maak duidelijker wat een leerling nu ziet, waar die vastloopt of wat nog niet beschikbaar is

## Randvoorwaarden

- Breek geen auth-, MFA-, role- of RLS-logica
- Respecteer school- en klasisolatie strikt
- Geen data van andere scholen of klassen tonen of exporteren
- Geen generieke mock-oplossingen
- Gebruik bestaande services, types en tabellen waar mogelijk
- Als je een schemawijziging nodig hebt, houd die minimaal en leg exact uit waarom
- Als completion- of reporting-semantiek verandert, benoem de impact expliciet

## Verwachte aanpak

1. Traceer de huidige teacher-to-student dataflows.
2. Benoem kort de grootste disconnects.
3. Kies de kleinste set wijzigingen met de meeste productimpact.
4. Implementeer de fixes.
5. Verifieer docent- en leerlingflow samen.
6. Doe redelijke checks of tests.

## Acceptatiecriteria

- Docentacties hebben voorspelbaar en begrijpelijk effect op de leerlingkant.
- Focus mode, mission settings en messaging voelen niet langer losgekoppeld.
- Voortgang en reporting gebruiken consistente betekenis.
- Een docent kan beter inschatten wat een leerling nu echt ziet of kan doen.
- Security- en tenantgrenzen blijven intact.

## Werkregels

- Maak of gebruik altijd een branch met prefix `claude/`
- Werk toe naar een PR naar `main`
- Hou wijzigingen klein en logisch
- Benoem eerlijk welke tests je wel en niet hebt gedaan

## Verplichte eindoutput

Schrijf na afloop een complete PR-beschrijving in exact dit formaat:

## Doel
[Welke gebruikers- of productuitkomst levert deze PR op?]

## Wat Is Veranderd
[De belangrijkste wijzigingen, kort en concreet]

## Tests
[Commands, handmatige checks, of duidelijk waarom iets niet getest is]

## Risico's
[Regressierisico's, aannames, open punten]

## Graag Op Letten
[Waar Codex extra scherp op moet reviewen]

---PROMPT END---
