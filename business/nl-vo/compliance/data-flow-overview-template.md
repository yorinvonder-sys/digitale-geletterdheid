# Datastroomoverzicht template (schoolversie)

## Doel

Dit document maakt voor school, FG en inkoop inzichtelijk welke gegevens worden verwerkt, waarom, hoe lang en met welke beveiliging.

## 1) Verwerkingsactiviteiten

| Stap | Omschrijving | Systeem | Verwerker/verantwoordelijke |
|---|---|---|---|
| Invoer | Leerling/docent maakt account of wordt toegevoegd | dgskills.app | School (verantwoordelijke), leverancier (verwerker) |
| Gebruik | Leerling maakt opdrachten en interacties | dgskills.app | School + leverancier |
| Analyse | Voortgang en activiteit in dashboards | dgskills.app | School + leverancier |
| Rapportage | Rapportages aan docent/schoolleiding | dgskills.app | School + leverancier |
| Exit | Datateruggave en verwijdering na contracteinde | dgskills.app + back-up processen | Leverancier |

## 2) Datacategorieen en doelbinding

| Datacategorie | Voorbeelden | Doel | Grondslag (school) | Bewaartermijn |
|---|---|---|---|---|
| Accountdata | naam, schoolmail, rol, account-ID | toegang en autorisatie | publieke taak / overeenkomst | gedurende contract + afgesproken na-termijn |
| Gebruiksdata | loginmomenten, activiteit, voortgang | onderwijsuitvoering en begeleiding | publieke taak / gerechtvaardigd belang | gedurende schooljaar + afgesproken termijn |
| Inhoudelijke interactie | antwoorden, feedback, opdrachten | leerproces en evaluatie | publieke taak | volgens schoolbeleid en contract |
| Supportdata | tickets, incidentnotities | support en kwaliteitsverbetering | gerechtvaardigd belang | conform supportretentiebeleid |

## 3) Toegang en rollen

| Rol | Toegangsniveau | Beperkingen |
|---|---|---|
| Leerling | eigen opdrachten en feedback | geen toegang tot klas- of schoolbrede data |
| Docent | eigen klassen en voortgangsoverzichten | geen toegang buiten toegewezen groepen |
| Schoolbeheerder | schoolbrede operationele rapportages | geen toegang tot technische beheerlogs buiten noodzaak |
| Leverancier support | tijdelijk en taakgericht bij incident/support | toegang op need-to-know basis, gelogd |

## 4) Opslag en doorgifte

- Primaire opslaglocatie: Supabase (AWS eu-central-1, Frankfurt, Duitsland — EER).
- Back-up opslaglocatie: Supabase point-in-time recovery (zelfde regio, eu-central-1).
- Doorgifte buiten EER: Nee. AI-verwerking via Google Vertex AI in europe-west4 (Eemshaven, Nederland). Geen persoonsgegevens verlaten de EER.
- Subverwerkers: zie subverwerkersbijlage.

## 5) Beveiligingsmaatregelen (samenvatting)

- Toegangsbeveiliging met rolgebaseerde autorisatie.
- Versleuteld transport (TLS).
- Logging op kritieke gebeurtenissen.
- Incidentprocedure met vaste meldtermijnen.
- Periodieke beoordeling van toegangsrechten.

## 6) Rechten van betrokkenen

- Inzage/correctie/verwijdering via schoolcontactpunt.
- Leverancier ondersteunt school bij afhandeling binnen afgesproken termijnen.
- Escalatiepad voor privacyvragen: privacy@dgskills.app → Yorin von der Osten (intern privacy-aanspreekpunt). Bij incidenten: security@dgskills.app.

## 7) Exit en verwijdering

- School kan export van relevante data aanvragen.
- Na contracteinde: verwijdering binnen afgesproken termijn volgens DPA.
- Bevestiging van verwijdering op verzoek beschikbaar.
