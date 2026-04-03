# Risicoregister AI-agents — DGSkills

**Versie:** 1.0  
**Datum:** 3 april 2026  
**Classificatie:** HOOG RISICO (EU AI Act Annex III, punt 3b)  
**Verantwoordelijke:** DGSkills.app — KvK 81819889  

---

## 1. Context

DGSkills gebruikt Google Gemini (via Vertex AI, europe-west4) voor **56 AI-agents** die interacteren met minderjarigen (12-18 jaar). Het systeem beoordeelt leerresultaten en valt daarmee onder de HIGH RISK classificatie van de EU AI Act.

Dit register documenteert risico's per categorie, bestaande mitigaties en vereiste aanvullende maatregelen conform Art. 9 (risicomanagement), Art. 14 (menselijk toezicht) en Art. 15 (nauwkeurigheid).

## 2. Methodologie

**Risicobeoordeling:** Kans × Impact matrix

| | Laag Impact | Midden Impact | Hoog Impact | Kritiek Impact |
|---|---|---|---|---|
| **Hoge kans** | Midden | Hoog | Kritiek | Kritiek |
| **Midden kans** | Laag | Midden | Hoog | Kritiek |
| **Lage kans** | Laag | Laag | Midden | Hoog |

## 3. Agent-inventaris

| Groep | Aantal | Voorbeelden | AI-interactie |
|---|---|---|---|
| Review missions | 7 | cloud-cleaner, review-week-2, review-week-3 | Beoordeling van leerlingwerk |
| Builder missions | 19 | website-bouwer, podcast-producer, brand-builder | Creatieve co-creatie |
| Scenario missions | 10 | phishing-fighter, social-safeguard, factchecker | Interactieve scenario's |
| Puzzle missions | 5 | encryption-expert, wachtwoord-warrior | Logische puzzels |
| Simulation missions | 5 | privacy-by-design, bug-hunter | Code/systeem simulaties |
| Data missions | 15 | data-journalist, dashboard-designer | Data-analyse & onderzoek |
| Debate missions | 10 | schermtijd-coach, ai-ethicus | Discussie & reflectie |
| Tool guides | 7 | magister-master, word-wizard | Stapsgewijze instructie |
| Dedicated components | 8 | game-director, prompt-master, deepfake-detector | Missie-specifieke interactie |

**Totaal: 56 agents met unieke systemInstructions**

## 4. Risicoregister

### R1: Prompt Injection

| Aspect | Waarde |
|---|---|
| **Beschrijving** | Leerling manipuleert AI-gedrag via crafted input om systemInstruction te omzeilen |
| **Kans** | Midden — leerlingen (12-18) zijn technisch vaardig genoeg |
| **Impact** | Hoog — kan leiden tot ongepaste content, onjuiste beoordeling |
| **Huidige mitigaties** | Server-side prompt injection detectie (40+ patronen, NL+EN), systemInstruction wordt server-side bepaald via roleId (niet client-side), input sanitization |
| **Residueel risico** | **Midden** |
| **Vereiste maatregel** | Adversarial testing protocol specifiek voor minderjarigen (gepland) |

### R2: Ongepaste Content Generatie

| Aspect | Waarde |
|---|---|
| **Beschrijving** | AI genereert gewelddadige, seksuele of schadelijke content |
| **Kans** | Laag — Gemini heeft ingebouwde safety filters |
| **Impact** | Kritiek — betreft minderjarigen |
| **Huidige mitigaties** | Vertex AI safety settings, server-side `filterAiOutput()` post-processing filter voor minderjarigen, welzijnsmonitoring met hulplijnen (Kindertelefoon, 113) |
| **Residueel risico** | **Midden** |
| **Vereiste maatregel** | Documenteer exacte safety setting levels per agent, voeg output-logging toe voor steekproefsgewijze review |

### R3: Bevooroordeelde Beoordeling

| Aspect | Waarde |
|---|---|
| **Beschrijving** | AI beoordeelt oneerlijk op basis van taalgebruik, culturele achtergrond of spelling |
| **Kans** | Midden — taalmodellen hebben inherente bias |
| **Impact** | Hoog — raakt leerbeoordeling, kernfunctie onder AI Act |
| **Huidige mitigaties** | STEP_COMPLETE detectie server-side (Art. 12), teacher override service (Art. 14) |
| **Residueel risico** | **Hoog** |
| **Vereiste maatregel** | Teacher override UI volledig operationeel maken, bias-testing met diverse leerlingprofielen, monitoring dashboard voor AI-beoordelingspatronen |

### R4: Datalekken via AI

| Aspect | Waarde |
|---|---|
| **Beschrijving** | AI onthult persoonlijke gegevens van andere leerlingen in responses |
| **Kans** | Laag — agents hebben geen directe DB-toegang, context is per-sessie |
| **Impact** | Hoog — privacy-schending minderjarigen, AVG |
| **Huidige mitigaties** | Elke chat-sessie is geïsoleerd, geen cross-user context, RLS op database-niveau, data residency in EU (europe-west4) |
| **Residueel risico** | **Laag** |
| **Vereiste maatregel** | Geen aanvullende maatregelen nodig; monitoring continueren |

### R5: Emotionele Schade

| Aspect | Waarde |
|---|---|
| **Beschrijving** | AI reageert ongepast op leerling in nood (zelfbeschadiging, pesten, crisis) |
| **Kans** | Midden — leerlingen kunnen persoonlijke problemen delen |
| **Impact** | Kritiek — welzijn minderjarige |
| **Huidige mitigaties** | `useWellbeingMonitor` hook met patroondetectie, automatische hulplijnen (Kindertelefoon 0800-0432, 113 Zelfmoordpreventie, HALT), logging naar Supabase voor docentreview |
| **Residueel risico** | **Midden** |
| **Vereiste maatregel** | Periodieke review van wellbeing-alerts door docenten verplicht maken, escalatieprotocol documenteren |

### R6: Overmatig Vertrouwen op AI-beoordeling

| Aspect | Waarde |
|---|---|
| **Beschrijving** | Docent accepteert AI-beoordelingen zonder controle, leerling wordt onterecht beoordeeld |
| **Kans** | Hoog — docenten hebben beperkte tijd |
| **Impact** | Hoog — onjuiste leerbeoordeling |
| **Huidige mitigaties** | `teacherOverrideService` met RPC en RLS, `StepOverridePanel` in TeacherDashboard, server-side STEP_COMPLETE logging |
| **Residueel risico** | **Midden** |
| **Vereiste maatregel** | Monitoring dashboard met samenvattingsstatistieken (override-ratio, afwijkingspatronen), verplichte steekproefsgewijze review per periode |

### R7: Hallucinatie

| Aspect | Waarde |
|---|---|
| **Beschrijving** | AI geeft feitelijk onjuiste educatieve content |
| **Kans** | Midden — inherent aan taalmodellen |
| **Impact** | Midden — leert leerling verkeerde informatie |
| **Huidige mitigaties** | Missie-specifieke systemInstructions beperken scope, stapsgewijze missie-opbouw (geen open-ended Q&A), AI-transparantiebadge in chat |
| **Residueel risico** | **Midden** |
| **Vereiste maatregel** | Feitelijke claims in AI-output periodiek valideren, bronvermelding aanmoedigen in systemInstructions |

## 5. Risicomatrix Samenvatting

| Risico | Kans | Impact | Residueel | Status |
|---|---|---|---|---|
| R1: Prompt Injection | Midden | Hoog | **Midden** | Gemitigeerd, testing nodig |
| R2: Ongepaste Content | Laag | Kritiek | **Midden** | Gemitigeerd, logging nodig |
| R3: Bevooroordeelde Beoordeling | Midden | Hoog | **Hoog** | Override gebouwd, monitoring nodig |
| R4: Datalekken | Laag | Hoog | **Laag** | Adequaat gemitigeerd |
| R5: Emotionele Schade | Midden | Kritiek | **Midden** | Gemitigeerd, escalatie nodig |
| R6: Overmatig Vertrouwen | Hoog | Hoog | **Midden** | Override gebouwd, dashboard nodig |
| R7: Hallucinatie | Midden | Midden | **Midden** | Deels gemitigeerd |

## 6. Compliance Mapping

| EU AI Act Artikel | Vereiste | Implementatiestatus |
|---|---|---|
| **Art. 9** Risicomanagement | Doorlopend risicomanagement gedurende levenscyclus | ✅ Dit register |
| **Art. 14** Menselijk Toezicht | Menselijke override op AI-beslissingen | ✅ TeacherOverrideService + StepOverridePanel |
| **Art. 15** Nauwkeurigheid | Passend nauwkeurigheidsniveau | ⬜ Monitoring dashboard nodig |
| **Art. 12** Registratie | Automatische logging van AI-beslissingen | ✅ STEP_COMPLETE logging, audit_logs |
| **Art. 13** Transparantie | Gebruikers informeren over AI-gebruik | ✅ AI-transparantiebadge, AI-transparantieverklaring |

## 7. Adversarial Testing Protocol (Ontwerp)

### Scope
Test elke agentgroep op R1-R7 met specifieke focus op minderjarigen.

### Testaanpak
1. **Prompt injection:** 20 gerichte aanvalspogingen per agentgroep (jailbreak, roleplay, instruction override)
2. **Content safety:** 10 grensgevallen per agent (geweld, seksualiteit, drugs, zelfbeschadiging)
3. **Bias testing:** 5 identieke opdrachten met variërend taalgebruik (formeel, informeel, NT2-niveau)
4. **Emotionele triggers:** 5 scenario's met noodsignalen (gepest worden, eenzaamheid, zelfbeschadiging)
5. **Data probing:** 5 pogingen om andere leerlinggegevens te extraheren

### Frequentie
- Bij elke major model update (Gemini versiewisseling)
- Minimaal 1x per kwartaal
- Na significante wijzigingen in systemInstructions

### Rapportage
- Resultaten documenteren per agent met pass/fail per testcategorie
- Gefaalde tests escaleren naar development team
- Fix-verificatie binnen 5 werkdagen

---

## 8. Openstaande Acties

| # | Actie | Prioriteit | Deadline |
|---|---|---|---|
| 1 | Monitoring dashboard voor AI-beoordelingspatronen | Hoog | Q2 2026 |
| 2 | Eerste ronde adversarial testing uitvoeren | Hoog | Q2 2026 |
| 3 | Escalatieprotocol welzijnsalerts documenteren | Midden | Q2 2026 |
| 4 | Output-logging voor steekproefsgewijze review | Midden | Q3 2026 |
| 5 | Bias-testing met diverse leerlingprofielen | Midden | Q3 2026 |
| 6 | Safety setting levels per agent documenteren | Laag | Q3 2026 |

---

*Dit document wordt minimaal elk kwartaal gereviewed en bijgewerkt.*
