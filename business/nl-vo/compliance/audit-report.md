# Compliance Audit Rapport - DGSkills.app (Februari 2026)

Statusoverzicht van de compliance-audit op basis van de actuele implementatie.

## 1. AVG / GDPR Audit

| ID | Onderwerp | Status | Bevindingen / Bewijs |
|:---|:---|:---|:---|
| AVG-01 | Rolverdeling | **Voldaan** | Future Architect als Verwerker, school als Verwerkingsverantwoordelijke (privacyverklaring). |
| AVG-02 | Rechtsgrondslag | **Voldaan** | Grondslagen en onderwijscontext beschreven in privacyverklaring. |
| AVG-03 | Informatieplicht | **Voldaan** | Privacyverklaring en privacymodal beschikbaar en toegankelijk. |
| AVG-04 | Rechten | **Voldaan** | Export, verwijdering en verzoek verwerkingsbeperking (Art. 18) technisch beschikbaar. |
| AVG-05 | Dataminimalisatie | **Voldaan** | Geen BSN/adres; analytics geaggregeerd en consent-gated. |
| AVG-06 | Bewaartermijnen | **Voldaan** | Cleanup actief voor auditlogs, studentactiviteiten en analytics-aggregaten. |
| AVG-07 | Beveiliging | **Voldaan** | TLS, RBAC via Firestore rules, aanvullende endpoint-validatie en rate limiting. |
| AVG-08 | Datalocatie | **Voldaan** | Opslag en primaire verwerking op `europe-west1` (EER). |
| AVG-09 | Subverwerkers | **Voldaan** | Overzicht subverwerkers in privacydocumentatie. |
| AVG-10 | DPIA Support | **Voldaan** | DPIA-supportdocumenten beschikbaar voor scholen. |
| AVG-11 | Minderjarigen (<16) | **Voldaan** | Juridische toelichting toegevoegd in privacy/cookie documentatie (AVG/UAVG context). |

## 2. Cookies & ePrivacy Audit

| ID | Onderwerp | Status | Bevindingen / Bewijs |
|:---|:---|:---|:---|
| C-01 | Toestemming | **Voldaan** | Niet-essentiele analytics wordt alleen verwerkt na expliciete consent-check in code. |
| C-02 | Gelijkwaardigheid | **Voldaan** | Keuze "Alleen essentieel" en "Alles accepteren" gelijkwaardig beschikbaar. |
| C-03 | Transparantie | **Voldaan** | Cookiebeleid geactualiseerd naar first-party analytics (geen GA). |
| C-04 | Intrekken | **Voldaan** | Consentstatus kan worden gereset via UI. |

## 3. EU AI Act Audit (HIGH RISK — Annex III punt 3(b))

> **Classificatiecorrectie (23 feb 2026):** DGSkills is een **hoog-risico AI-systeem** onder Annex III punt 3(b): "AI-systemen bedoeld voor evaluatie van leerresultaten, ook wanneer die worden gebruikt om het leerproces te sturen." De eerdere classificatie als "Limited Risk" was onjuist. Zie `eu-ai-act-conformiteitsplan.md` voor het volledige conformiteitsplan.

| ID | Onderwerp | Status | Bevindingen / Bewijs |
|:---|:---|:---|:---|
| AI-01 | Transparantie (Art. 13 + 50) | **Voldaan** | AI-gebruik en doeleinden expliciet beschreven; AI-content gelabeld met provenance metadata. |
| AI-02 | Labeling (Art. 50) | **Voldaan** | AI-functionaliteit herkenbaar gepresenteerd; disclaimer "AI-gegenereerd — kan fouten bevatten". |
| AI-03 | Risicobeheersysteem (Art. 9) | **Niet voldaan** | Individuele maatregelen aanwezig maar geen formeel, gedocumenteerd risicobeheersysteem. |
| AI-04 | Technische documentatie (Art. 11) | **Niet voldaan** | Geen formeel Annex IV technisch documentatiedossier. |
| AI-05 | Logging (Art. 12) | **Voldaan** | Audit logging via `auditService.ts` met AI-interactie metadata (zonder PII). |
| AI-06 | Menselijk toezicht (Art. 14) | **Gedeeltelijk** | Docent is eindverantwoordelijk, maar STEP_COMPLETE kan nog niet door docent worden overruled. |
| AI-07 | Nauwkeurigheid/Robuustheid (Art. 15) | **Gedeeltelijk** | Safety settings, prompt sanitizer en welzijnsprotocol aanwezig; geen formele nauwkeurigheidsmetrieken. |
| AI-08 | QMS (Art. 17) | **Niet voldaan** | Geen formeel kwaliteitsmanagementsysteem. |
| AI-09 | Conformiteitsverklaring (Art. 47) | **Niet voldaan** | Nog niet opgesteld. Deadline: 2 augustus 2026. |
| AI-10 | CE-markering (Art. 48) | **Niet voldaan** | Nog niet aangebracht. |
| AI-11 | EU-databank registratie (Art. 49) | **Niet voldaan** | EU-databank nog in ontwikkeling. |
| AI-12 | Vertex AI migratie | **Voldaan** | Gemigreerd van Gemini Developer API (ToS verboden voor <18) naar Vertex AI (europe-west4, enterprise ToS). |

## 4. Security Hardening

| ID | Onderwerp | Status | Bevindingen / Bewijs |
|:---|:---|:---|:---|
| SEC-01 | CSP scripts | **Voldaan** | Inline scripts verplaatst naar extern bootstrap-bestand; `script-src` zonder `unsafe-inline`. |
| SEC-02 | Reset-flow | **Voldaan** | Password reset endpoint retourneert geen plaintext wachtwoord meer. |
| SEC-03 | Toegangsregels | **Voldaan** | Read rules aangescherpt voor brede collecties (school-scoped toegang). |

---

## Eindoordeel
DGSkills is geclassificeerd als **hoog-risico AI-systeem** onder de EU AI Act (Annex III punt 3(b)). Het AVG-compliance profiel is sterk (alle AVG-checks voldaan). De EU AI Act compliance vereist nog substantieel werk: 5 van 12 checks zijn niet voldaan, 2 gedeeltelijk. De kritieke Vertex AI-migratie is uitgevoerd. Zie `eu-ai-act-conformiteitsplan.md` voor het volledige actieplan richting de deadline van 2 augustus 2026.
