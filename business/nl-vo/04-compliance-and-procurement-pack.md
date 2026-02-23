# Compliance- en inkooppakket (NL VO)

Dit document bundelt wat scholen meestal nodig hebben voor privacy-, security- en inkoopbeoordeling.

## 1) AVG-kernstukken

### Verwerkersovereenkomst (DPA) checklist

- Rollen en verantwoordelijkheden (verwerkingsverantwoordelijke/verwerker) benoemd.
- Verwerkingsdoeleinden expliciet beschreven.
- Categorieen persoonsgegevens benoemd.
- Bewaartermijnen vastgelegd.
- Subverwerkerslijst en meldplicht wijzigingen opgenomen.
- Rechten van betrokkenen (inzage/verwijdering/correctie) geregeld.
- Datalekmeldproces en termijnen vastgelegd.
- Exit-regeling inclusief datateruggave/verwijdering opgenomen.

### Privacydocumentatie

- Privacyverklaring (schoolgericht) beschikbaar.
- Datastroomoverzicht beschikbaar:
  - bron van data;
  - verwerking;
  - opslag;
  - verwijdering;
  - toegang/rollen.

## 2) Security baseline (voor inkoopgesprekken)

- Authenticatie via Supabase Authentication (SSO via Microsoft/Google).
- Autorisatie op basis van rollen (docent/leerling) en server-side checks.
- API-keys server-side afgeschermd (geen client-side secrets).
- Logging en rate-limiting op kritieke endpoints.
- Datatransport via TLS.
- Functionele scheiding tussen frontend en backend proxy.

## 3) Incidentrespons (datalek/security incident)

### Reactietijden

- Detectie en triage: binnen 4 uur na signaal.
- Eerste update aan schoolcontact: binnen 24 uur.
- Definitieve incidentrapportage: binnen 5 werkdagen.

### Proces

1. Incident registreren en classificeren.  
2. Impact bepalen (welke data, welke doelgroep, welke omvang).  
3. Maatregelen nemen (containment + herstel).  
4. School informeren met feiten en vervolgstappen.  
5. Preventieve maatregelen implementeren en evalueren.

## 4) DPIA-ondersteuning (templatevragen)

Scholen kunnen onderstaande vragen invullen met ondersteuning:
- Welk doel heeft de verwerking in onderwijscontext?
- Welke persoonsgegevens zijn strikt noodzakelijk?
- Welke risico's bestaan voor leerlingen?
- Welke maatregelen beperken risico's?
- Hoe worden rechten van leerlingen/ouders ondersteund?

## 5) Inkooppakket: aan te leveren documenten

- DPA (template + invulbare bijlage).
- Privacyverklaring en begrijpelijke privacy-uitleg (schoolversie).
- Datastroomoverzicht (bron -> verwerking -> opslag -> verwijdering -> toegang).
- Technische en organisatorische beveiligingsmaatregelen (TOMs).
- Incidentresponsprocedure.
- Subverwerkersoverzicht.
- Contactgegevens FG/privacy/security aanspreekpunt.

## 6) Procurement-ready checklist (intern)

- Juridische documenten versiebeheer op orde.
- Eenduidige product- en prijsbijlagen beschikbaar.
- Security FAQ up-to-date.
- Standaard antwoorden op onderwijsinkoopvragen voorbereid.
