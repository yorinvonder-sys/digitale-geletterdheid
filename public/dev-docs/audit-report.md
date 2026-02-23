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

## 3. EU AI Act Audit (Limited Risk - Art. 50)

| ID | Onderwerp | Status | Bevindingen / Bewijs |
|:---|:---|:---|:---|
| AI-01 | Transparantie | **Voldaan** | AI-gebruik en doeleinden expliciet beschreven in privacy-informatie. |
| AI-02 | Labeling | **Voldaan** | AI-functionaliteit herkenbaar gepresenteerd in product. |
| AI-03 | Risico-uitleg | **Voldaan** | Beperkingen en zorgvuldig gebruik van AI zijn toegelicht voor gebruikers. |
| AI-04 | Datagebruik | **Voldaan** | Dataminimalisatie toegepast; geen marketingprofilering. |
| AI-05 | Menselijk Toezicht | **Voldaan** | Docent blijft eindverantwoordelijk; geen geautomatiseerde besluitvorming met rechtsgevolg. |

## 4. Security Hardening

| ID | Onderwerp | Status | Bevindingen / Bewijs |
|:---|:---|:---|:---|
| SEC-01 | CSP scripts | **Voldaan** | Inline scripts verplaatst naar extern bootstrap-bestand; `script-src` zonder `unsafe-inline`. |
| SEC-02 | Reset-flow | **Voldaan** | Password reset endpoint retourneert geen plaintext wachtwoord meer. |
| SEC-03 | Toegangsregels | **Voldaan** | Read rules aangescherpt voor brede collecties (school-scoped toegang). |

---

## Eindoordeel
DGSkills beschikt nu over een aantoonbaar versterkt compliance-profiel met verbeterde consent-enforcement, strengere securitymaatregelen en heldere documentatie voor minderjarigen en AI-verwerking.
