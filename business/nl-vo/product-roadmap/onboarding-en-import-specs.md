# Functionele Specificaties — In-app Onboarding & CSV Import

**Versie:** 1.0
**Datum:** 3 april 2026
**Auteur:** DGSkills Productteam
**Status:** Functionele spec — klaar voor implementatie

---

## Overzicht

Dit document beschrijft drie samenhangende features die de drempel voor nieuwe docenten verlagen en het dagelijkse gebruik voor ervaren gebruikers verbeteren:

- **A.** In-app docent onboarding wizard
- **B.** CSV bulk import voor leerlingen
- **C.** Printbare voortgangsrapporten

---

## A. In-app docent onboarding wizard

### Gebruikersverhaal

Als nieuwe docent wil ik direct na mijn eerste inlog stap-voor-stap worden begeleid zodat ik binnen 10 minuten mijn eerste klas klaar heb staan en de eerste missie kan starten — zonder handleiding te hoeven lezen.

### Trigger en condities

De wizard wordt getoond wanneer:
- De ingelogde gebruiker de rol `teacher` heeft.
- De gebruiker nog nooit eerder is ingelogd (controleerbaar via een veld `onboarding_completed` op het gebruikersprofiel in Supabase, of via de aanwezigheid van klassen in de database).
- De gebruiker de wizard niet eerder heeft overgeslagen én `onboarding_skipped_at` is nog niet gezet.

De wizard wordt **niet** getoond wanneer:
- De gebruiker al klassen heeft aangemaakt.
- De gebruiker `onboarding_completed = true` heeft in het profiel.
- De gebruiker actief heeft gekozen voor "Later instellen".

### Stappen

#### Stap 1 — Welkom (geschatte tijd: 30 seconden)

**Doel:** Context geven, niet overweldigen.

**Inhoud:**
- Grote koptekst: "Welkom bij DGSkills, [voornaam]!"
- Korte zin: "Je bent er bijna. In 4 stappen heb je je eerste klas klaar."
- Voortgangsbalk: stap 1 van 4 actief.
- Knop: "Aan de slag →"
- Tekstlink: "Later instellen" (slaat `onboarding_skipped_at` op, sluit de wizard)

**Geen formuliervelden op deze stap.**

---

#### Stap 2 — Maak je eerste klas aan

**Doel:** Een klas aanmaken zodat leerlingen eraan kunnen worden gekoppeld.

**Formuliervelden:**

| Veld | Type | Verplicht | Validatie |
|------|------|-----------|-----------|
| Klasnaam | Tekst | Ja | Min. 2 tekens, max. 50 tekens |
| Leerjaar | Select (1 t/m 6) | Ja | — |
| Niveau | Select (vmbo-b / vmbo-k / vmbo-gt / havo / vwo / gemengd) | Ja | — |
| Schooljaar | Read-only (automatisch huidig schooljaar) | — | — |

**Gedrag:**
- De klasnaam wordt automatisch aangevuld met het geselecteerde niveau en leerjaar als hulp (bijv. "1 Havo A"), maar is bewerkbaar.
- Verzenden slaat de klas op via Supabase en gaat direct naar stap 3.
- Foutmelding bij leeg verplicht veld: inline, rood, onder het veld.

---

#### Stap 3 — Voeg leerlingen toe

**Doel:** Leerlingen koppelen aan de klas.

**Twee opties naast elkaar aangeboden:**

**Optie A — CSV uploaden (aanbevolen)**
- Knop "Upload CSV-bestand"
- Kort uitgelegd: "Zet voornaam, achternaam en optioneel e-mailadres in een CSV-bestand."
- Koppeling naar downloadbare voorbeeld-CSV.
- Na upload: preview tabel (zie Deel B voor volledige spec).

**Optie B — Handmatig toevoegen**
- Eenvoudig formulier: voornaam, achternaam, optioneel e-mail.
- Knop: "Leerling toevoegen" (voegt rij toe aan preview tabel).
- Maximaal 5 leerlingen handmatig tijdens de wizard; meer via "Beheer klas" na afronding.

**Overslaan toegestaan:** Knop "Nu overslaan, later toevoegen" gaat door naar stap 4. De klas staat dan leeg maar is aangemaakt.

---

#### Stap 4 — Kies je eerste missie

**Doel:** Docenten laten zien wat er mogelijk is en direct een startpunt geven.

**Inhoud:**
- Koptekst: "Welke missie past bij je klas?"
- Drie kaarten met aanbevolen missies op basis van het leerjaar dat in stap 2 is gekozen.
- Elke kaart toont: missienaam, korte beschrijving (max. 2 regels), SLO-kerndoel, moeilijkheidsgraad, geschatte tijd.
- Selecteer één missie — de kaart krijgt een markering.
- Knop: "Sla op als eerste missie →" (koppelt de missie aan de klas als aanbevolen startmissie).
- Tekstlink: "Alle missies bekijken" (opent de missiebibliotheek in een nieuw tabblad, wizard blijft open).

**Overslaan toegestaan.**

---

#### Stap 5 — Klaar!

**Doel:** Afsluiting, oriëntatie op het dashboard.

**Inhoud:**
- Koptekst: "Je klas staat klaar. Zo werkt je dashboard:"
- Drie icoontjes met korte uitleg (max. 1 regel per item):
  1. Overzicht: "Zie wie actief is en welke missies zijn afgerond."
  2. Leerlingkaart: "Klik op een leerling voor gedetailleerde voortgang."
  3. Rapportage: "Exporteer een rapport voor rapporten of oudergesprekken."
- Knop: "Naar mijn dashboard →" (sluit de wizard, zet `onboarding_completed = true`)
- Na afsluiting: tooltips op de drie benoemde dashboardelementen zichtbaar voor 30 seconden (Framer Motion fade-in, na 30 sec fade-out of bij klik wegklikbaar).

---

### Technische specificaties

**Routing:**
- De wizard is een modal overlay op de huidige route, niet een aparte route.
- State wordt beheerd in een lokale `useOnboardingWizard` hook.
- De wizard mag niet worden omzeild door directe URL-navigatie als `onboarding_completed = false`.

**State management:**
- `currentStep: number` (1–5)
- `classData: { name, yearGroup, level }` (formulierdata)
- `students: StudentRow[]` (preview tabel)
- `selectedMissionId: RoleId | null`
- `isSkipped: boolean`

**Componenten (nieuw aan te maken):**

| Component | Locatie | Beschrijving |
|-----------|---------|-------------|
| `OnboardingWizard.tsx` | `components/onboarding/` | Container met step-router |
| `WizardStep.tsx` | `components/onboarding/` | Herbruikbare stap-wrapper met progress bar |
| `CreateClassStep.tsx` | `components/onboarding/` | Stap 2 formulier |
| `AddStudentsStep.tsx` | `components/onboarding/` | Stap 3 met CSV + handmatig |
| `ChooseMissionStep.tsx` | `components/onboarding/` | Stap 4 missieselectie |
| `WizardComplete.tsx` | `components/onboarding/` | Stap 5 afsluiting |
| `useOnboardingWizard.ts` | `hooks/` | State management hook |

**Database:**
- Voeg `onboarding_completed: boolean` en `onboarding_skipped_at: timestamptz` toe aan het gebruikersprofiel in Supabase.
- Migratie nodig in `supabase/migrations/`.

**Design:**
- Wizard is een gecentreerde modal (max-width: 640px op desktop, fullscreen op mobiel).
- Progress bar bovenaan: gekleurde dots of segmentbalk, actieve stap gemarkeerd.
- Elke stap: grote titeltekst, subtext, dan inhoud, dan actieknoppen onderaan.
- "Later instellen" en "Overslaan" zijn altijd tekstlinks, niet knoppen — om de primaire flow te benadrukken.
- Animaties: slide-transition bij stapwisseling (Framer Motion `AnimatePresence`).
- "Later opnieuw bekijken" is bereikbaar via het profielmenu → "Introductie herhalen". Dit zet `onboarding_completed = false`.

---

## B. CSV bulk import voor leerlingen

### Gebruikersverhaal

Als docent wil ik een CSV-bestand uploaden met de gegevens van mijn klas zodat ik niet 30 leerlingaccounts handmatig hoef aan te maken.

### CSV-formaat

**Verplichte kolommen:**

| Kolomnaam | Type | Vereist | Beschrijving |
|-----------|------|---------|-------------|
| `voornaam` | Tekst | Ja | Voornaam van de leerling |
| `achternaam` | Tekst | Ja | Achternaam of familienaam |

**Optionele kolommen:**

| Kolomnaam | Type | Beschrijving |
|-----------|------|-------------|
| `email` | E-mailadres | Optioneel — leerlingen kunnen ook zonder e-mail inloggen (gebruikersnaam + wachtwoord) |
| `leerlingnummer` | Tekst | Intern leerlingnummer van de school — niet verplicht maar handig voor koppeling met administratiesystemen |
| `klas` | Tekst | Klasnaam (bijv. "2HV1") — bij bulk-import voor meerdere klassen in één bestand |

**Scheidingsteken:** Komma (`,`) als standaard. Automatische detectie van puntkomma (`;`) als alternatief. Tab-separated values worden ook geaccepteerd.

**Encoding:** UTF-8. Bij detectie van andere encoding: foutmelding met uitleg.

**Voorbeeldbestand (te downloaden vanuit de UI):**
```
voornaam,achternaam,email,leerlingnummer,klas
Emma,Jansen,,1234,2HA
Liam,de Vries,liam@school.nl,1235,2HA
Fatima,Öztürk,,1236,2HB
```

---

### Validatieregels

**Per rij, vóór import:**

| Regel | Foutmelding |
|-------|------------|
| `voornaam` leeg | "Voornaam ontbreekt op rij [x]" |
| `achternaam` leeg | "Achternaam ontbreekt op rij [x]" |
| `email` aanwezig maar ongeldig formaat | "Ongeldig e-mailadres op rij [x]: [waarde]" |
| `email` al in gebruik in de klas | "Dit e-mailadres is al gekoppeld aan een leerling in deze klas: [email]" |
| `leerlingnummer` duplicaat binnen import | "Leerlingnummer [x] komt meerdere keren voor" |
| Rij volledig leeg | Rij overgeslagen, geen fout |
| Meer dan 500 rijen in één bestand | "Maximaal 500 leerlingen per import. Splits het bestand op in meerdere bestanden." |

**Globale validatie:**
- Minimaal 1 geldige rij vereist.
- Kolomnamen hoofdletterongevoelig (`Voornaam`, `voornaam`, `VOORNAAM` zijn alle geldig).
- Extra kolommen worden genegeerd zonder foutmelding.

---

### UI-flow

**Stap 1 — Upload**
- Grote dropzone ("Sleep je CSV-bestand hierheen") + knop "Bestand kiezen".
- Bestandsgrootte max. 5 MB.
- Na selectie: bestand wordt client-side ingelezen en geparseerd (geen upload naar server op dit punt).

**Stap 2 — Preview tabel**
- Eerste 10 rijen van het geïmporteerde bestand worden getoond.
- Boven de tabel: "[x] leerlingen gevonden — [y] fout(en)"
- Rijen met fouten zijn rood gemarkeerd, foutmelding rechts van de rij.
- Knoppen: "Annuleren" | "Corrigeer fouten eerst" (als er fouten zijn) | "Importeer [x] leerlingen →" (disabled als er fouten zijn)
- Optie: "Fouten overslaan en de rest importeren" — importeert alleen geldige rijen.

**Stap 3 — Bevestiging**
- Progressindicator tijdens import (Supabase inserts).
- Resultaatmelding: "[x] leerlingen succesvol toegevoegd. [y] overgeslagen (duplicaten)."
- Automatisch gegenereerde inloggegevens per leerling worden direct getoond in een downloadbare PDF ("Loginkaartjes printen").

---

### Privacyvereisten

- Het CSV-bestand wordt **uitsluitend client-side geparseerd** met `papaparse` of vergelijkbare library — het bestand zelf wordt nooit naar externe servers verzonden.
- Alleen de geëxtraheerde velden worden via Supabase opgeslagen.
- Geen data wordt opgeslagen vóórdat de docent op "Importeer" klikt.
- De verwerking valt onder de bestaande Verwerkersovereenkomst en DPIA.
- Leerlingnummers worden opgeslagen als niet-herleidbaar intern ID — niet als primaire identificator voor AI-interacties.
- Log de import-actie (wie, wanneer, hoeveel rijen) in de audit log — vereist voor AI Act Art. 12.

---

### Edge cases

| Situatie | Gedrag |
|---------|--------|
| Naam met speciale tekens (Ö, ü, ñ, ') | Volledig geaccepteerd als UTF-8 |
| Naam met cijfers (bijv. "Jan2") | Geaccepteerd met waarschuwing (geen blokkade) |
| Lege rijen tussen data | Overgeslagen, geen fout |
| Alleen een header-rij | "Geen leerlingen gevonden in dit bestand" |
| Windows-stijl regeleinden (CRLF) | Automatisch afgehandeld door parser |
| Puntkomma als scheidingsteken | Automatisch gedetecteerd |
| Tab als scheidingsteken | Automatisch gedetecteerd |
| BOM (byte order mark) aan begin van bestand | Automatisch verwijderd door parser |
| Leerling bestaat al op basis van `leerlingnummer` | Markeren als duplicaat; docent kiest of ze worden overgeslagen of bijgewerkt |

---

### Technische componenten

| Component/bestand | Locatie | Beschrijving |
|-------------------|---------|-------------|
| `CsvImport.tsx` | `components/teacher/` | Hoofd-UI voor upload, preview, bevestiging |
| `CsvDropzone.tsx` | `components/teacher/` | Dropzone component |
| `CsvPreviewTable.tsx` | `components/teacher/` | Preview tabel met validatiemarkering |
| `useCsvImport.ts` | `hooks/` | Parsing, validatie, import-logica |
| `csvParser.ts` | `utils/` | Wrappers om `papaparse` |
| Supabase edge function | `supabase/functions/importStudents/` | Server-side bulkinsert met RLS |

**Dependency:** `papaparse` (MIT-licentie, geen bekende CVEs, actief onderhouden). Toevoegen via `npm install papaparse`.

---

## C. Printbare voortgangsrapporten

### Gebruikersverhaal

Als docent wil ik een print-vriendelijk rapport per leerling kunnen genereren zodat ik het kan gebruiken bij 10-minutengesprekken met ouders of als onderbouwing bij een voortgangsbespreking.

### Inhoud van het rapport

**Koptekst (per pagina):**
- School logo placeholder (vervangbaar via instellingen)
- "Voortgangsrapport Digitale Geletterdheid"
- Schoolnaam + klas (uit docentprofiel)
- Periode: [startdatum] – [einddatum] (instelbaar)
- Gegenereerd op: [datum]

**Leerlinggegevens:**
- Voornaam en achternaam
- Klas en leerjaar
- Leerlingnummer (indien ingevuld)

**Samenvatting:**
- XP behaald in de periode
- Level bereikt
- Aantal missies gestart
- Aantal missies afgerond
- Taakafronding: [x]%

**SLO-voortgang:**

Tabel met de 9 SLO-kerndoelen:

| Kerndoel | Omschrijving | Missies gemaakt | Gedekt |
|---------|-------------|-----------------|--------|
| 21A | Digitale systemen | [x] | ✓ / — |
| 21B | Media & Informatie | [x] | ✓ / — |
| ... | ... | ... | ... |

**Afgeronde missies:**
Lijst van de afgeronde missies met naam, datum en moeilijkheidsgraad.

**Sterke punten:**
Automatisch gegenereerde tekst op basis van de drie kerndoelen met de meeste afgeronde missies.
Voorbeeld: "Emma heeft sterke resultaten behaald op het gebied van AI (kerndoel 21D) en Digitaal burgerschap (kerndoel 23A)."

**Aandachtspunten:**
Automatisch gegenereerde tekst op basis van kerndoelen met weinig of geen activiteit.
Voorbeeld: "Kerndoel 23B (Digitaal welzijn) is nog niet aan bod gekomen. Overweeg de missies 'Scroll Stopper' of 'Schermtijd Coach' in te plannen."

**Voetnoot:**
"Dit rapport is gegenereerd via DGSkills (dgskills.app). DGSkills is een AI-ondersteund leerplatform voor digitale geletterdheid."

---

### Opmaak en print-CSS

**Formaat:** A4 staand.

**Print-CSS vereisten:**
- Gebruik `@media print` voor printspecifieke stijlen.
- Verberg navigatie, knoppen, tooltips en andere UI-elementen.
- Zorg voor `page-break-avoid` op tabelrijen en lijstonderdelen.
- Achtergrondkleuren printen: gebruik `print-color-adjust: exact` zodat de SLO-tabel leesbaar blijft.
- Lettergrootte: 11pt voor bodytekst, 14pt voor tussenkopjes, 18pt voor koptekst.
- Marges: 2 cm rondom.
- Maximaal 2 pagina's per leerling (bij veel missies: alleen eerste 10 missies tonen, rest samenvatten als "en [x] andere missies").

**Logo placeholder:**
- Standaard: DGSkills-logo.
- Optioneel: schoollogo uploaden via instellingenpagina (opgeslagen in Supabase Storage).
- Als schoollogo aanwezig: gebruik schoollogo in koptekst, DGSkills-logo in voetnoot.

---

### UI voor rapportgeneratie

**Toegangspunt:** Docentdashboard → "Mijn Klas" → leerlingnaam → knop "Rapport genereren"

**Ook beschikbaar als bulk-export:** "Mijn Klas" → "Exporteer rapporten voor hele klas" → genereert één PDF per leerling in een ZIP-bestand.

**Instellingen per rapport:**
- Selecteer periode (standaard: huidig schooljaar; aanpasbaar naar kwartaal, periode of vrije selectie)
- Toon/verberg leerlingnummer
- Toon/verberg XP en level (sommige scholen willen gamification niet in een officieel rapport)

**Export-opties:**

| Optie | Beschrijving |
|-------|-------------|
| PDF downloaden | Client-side gegenereerd via `window.print()` of `react-to-pdf` |
| Afdrukdialoog openen | `window.print()` met print-CSS actief |
| Kopieer als tekst | Platte tekst zonder opmaak, bruikbaar in e-mails of andere documenten |

**Dependency voor PDF:** Gebruik `window.print()` als primaire methode (geen extra dependency). Als rijkere PDF-export gewenst is: `@react-pdf/renderer` (MIT-licentie). Beslissing in de implementatiefase.

---

### Technische componenten

| Component/bestand | Locatie | Beschrijving |
|-------------------|---------|-------------|
| `StudentReport.tsx` | `components/teacher/` | Hoofd-rapport component (print-ready) |
| `SloProgressTable.tsx` | `components/teacher/` | Herbruikbare SLO-voortgangstabel |
| `ReportSettings.tsx` | `components/teacher/` | Periode-selector en weergave-opties |
| `useStudentReport.ts` | `hooks/` | Data ophalen voor rapport |
| `reportUtils.ts` | `utils/` | Sterke punten / aandachtspunten genereren |
| Print-stijlen | `styles/print.css` of inline `@media print` in component | Print-specifieke CSS |

---

## Prioriteit en fasering

| Feature | Urgentie | Reden | Geschatte implementatietijd |
|---------|---------|-------|---------------------------|
| **B. CSV Import** | Hoog | Geblokkeer bij >15 leerlingen — wordt nu al beloofd in de quickstart-gids | 3–4 dagen |
| **A. Onboarding wizard** | Hoog | Drempelverlagend voor nieuwe docenten in de pilot | 4–5 dagen |
| **C. Printbare rapporten** | Middel | Gevraagd in pilot-feedback; belangrijk voor verlenging | 2–3 dagen |

**Aanbevolen volgorde:** B → A → C. CSV-import heeft de meeste directe impact op adoptie.
