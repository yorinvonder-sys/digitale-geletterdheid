# Toetsmatrix AVG & AI Act Compliance - DGSkills.app

Dit document dient als intern referentiekader voor de compliance-audit van DGSkills.app (Februari 2026).

## 1. AVG / GDPR (Verordening EU 2016/679)

| ID | Controlepunt | Wettelijke Basis | Criterium voor DGSkills |
|:---|:---|:---|:---|
| AVG-01 | **Rolverdeling** | Art. 4(7), 4(8), 28 | School is Verwerkingsverantwoordelijke; DGSkills is Verwerker. Moet expliciet in DPA staan. |
| AVG-02 | **Rechtsgrondslag** | Art. 6 | Meestal 'Publieke taak' (voor scholen) of 'Gerechtvaardigd belang'. DGSkills moet dit faciliteren. |
| AVG-03 | **Informatieplicht** | Art. 13, 14 | Duidelijke privacyverklaring toegankelijk vóór gegevensverzameling (login/registratie). |
| AVG-04 | **Rechten Betrokkenen** | Art. 15 - 22 | In-app functies voor inzage (export) en verwijdering (vergetelheid). |
| AVG-05 | **Minimale Gegevens** | Art. 5(1)(c) | Alleen strikt noodzakelijke data voor leerproces (geen BSN, geen adres indien mogelijk). |
| AVG-06 | **Bewaartermijnen** | Art. 5(1)(e) | Data niet langer bewaren dan nodig. Automatische opschoning inrichten. |
| AVG-07 | **Beveiliging** | Art. 32 | Versleuteling (HTTPS/TLS), database-regels, toegangsbeheer (docent vs leerling). |
| AVG-08 | **Datalocatie** | Art. 44 - 50 | Opslag binnen de EER (bijv. Google Cloud `europe-west1`). |
| AVG-09 | **Subverwerkers** | Art. 28(2) | Lijst van subverwerkers (Supabase, Google AI) moet beschikbaar zijn. |
| AVG-10 | **DPIA** | Art. 35 | DGSkills moet school ondersteunen bij het uitvoeren van een DPIA. |
| AVG-11 | **Minderjarigen <16** | Art. 8 AVG / UAVG | Juridische basis en waarborgen voor minderjarigen expliciet vastgelegd in privacydocumentatie. |
| AVG-12 | **Beperking verwerking** | Art. 18 AVG | Betrokkene moet verwerkingsbeperking kunnen aanvragen; workflow en logging vereist. |

## 2. Cookies & ePrivacy (Telecommunicatiewet / ePrivacy Richtlijn)

| ID | Controlepunt | Wettelijke Basis | Criterium voor DGSkills |
|:---|:---|:---|:---|
| C-01 | **Toestemming** | Art. 11.7a Tw | Voorafgaande toestemming voor niet-essentiële cookies (zoals analytics). |
| C-02 | **Gelijkwaardigheid** | AP Richtlijnen | 'Weigeren' moet even makkelijk zijn als 'Accepteren' (geen dark patterns). |
| C-03 | **Transparantie** | Art. 13 AVG | Overzicht van welke cookies, doel, en bewaartermijn. |
| C-04 | **Intrekken** | Art. 7(3) AVG | Toestemming moet op elk moment eenvoudig ingetrokken kunnen worden. |
| C-05 | **Consent Enforcement** | Art. 11.7a Tw | Niet-essentiele analytics mag pas na expliciete consent technisch actief worden. |

## 3. EU AI Act (Verordening EU 2024/1689)

*Focus op transparantieplichten (Art. 50) voor AI-systemen met beperkt risico.*

| ID | Controlepunt | Wettelijke Basis | Criterium voor DGSkills |
|:---|:---|:---|:---|
| AI-01 | **Transparantie** | Art. 50(1) | Gebruikers moeten weten dat ze met AI communiceren (Chat/Feedback). |
| AI-02 | **Output Labeling** | Art. 50(2) | AI-gegenereerde content moet als zodanig herkenbaar zijn (disclaimer/watermerk). |
| AI-03 | **Risico-uitleg** | Art. 4 (AI Literacy) | Uitleg over de beperkingen (fouten/hallucinaties) en menselijke controle. |
| AI-04 | **Datagebruik AI** | Privacy-by-design | Expliciet vermelden dat input niet wordt gebruikt voor training (bij API-gebruik). |
| AI-05 | **Menselijk Toezicht** | Art. 14 (indien hoog) | Docent moet eindbeslissing hebben over leerling-beoordeling (Human-in-the-loop). |
| AI-06 | **Dataminimalisatie AI** | Art. 5(1)(c) AVG | Alleen noodzakelijke context naar AI-endpoints; geen vrije tekst in analytics/audit waar niet nodig. |

## 4. Onderwijs-specifiek (Convenant Digitale Onderwijsmiddelen)

| ID | Controlepunt | Basis | Criterium voor DGSkills |
|:---|:---|:---|:---|
| EDU-01 | **Verwerkersovereenkomst** | Model 4.0 | Gebruik van het standaardmodel van het Privacyconvenant Onderwijs. |
| EDU-02 | **Geen Commercie** | Convenant | Geen advertenties of commerciële profilering van minderjarigen. |
| EDU-03 | **School-scoped toegang** | Onderwijsnorm / AVG art. 32 | Gegevens zichtbaar op need-to-know basis per school/klas. |
