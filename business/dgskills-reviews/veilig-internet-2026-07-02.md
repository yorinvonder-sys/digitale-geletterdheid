# Missie-review: veilig-internet (wave 20)

**Datum:** 2026-07-02
**Template:** scenario-engine
**Config:** `src/features/missions/templates/scenario-engine/configs/veilig-internet.ts`
**Bijzonderheid:** geïmporteerde externe opdracht (CC BY 3.0 NL, Noorderpoort/Wikiwijs), geland juni 2026.

## Samenvatting

Geen fixes nodig. Alle 10 registratiepunten compleet en consistent, scoring klopt exact (4×25=100), attributie is aanwezig én daadwerkelijk zichtbaar gerenderd op intro- en resultaatscherm, en alle vier scenario-rondes zijn feitelijk correct en didactisch sterk (niet-bang-makend, met expliciet handelingsperspectief).

## Stap A — Registratie & scenario-inhoud

### 10-punts registratiepatroon (import-checklist)

| # | Bestand | Status |
|---|---|---|
| 1 | `src/types.ts` (RoleId-union) | ✅ `'veilig-internet'` aanwezig (regel 27) |
| 2 | `src/config/agentRoleIds.ts` (AGENT_ROLE_IDS) | ✅ regel 26 |
| 3 | `src/config/slo-kerndoelen-mapping.ts` | ✅ regel 70: week 3, yearGroup 1, SLO 23A/21B, VSO 20A/18B |
| 4 | `src/config/curriculum.ts` | ✅ regel 113, geplaatst in leerjaar 1 |
| 5 | `src/config/agents/year1.tsx` (agent-rol) | ✅ regel 4015-4045, volledige kaart + visualPreview |
| 6 | `src/config/templateRegistry.ts` | ✅ regel 16, templateType `scenario-engine` |
| 7 | Config-bestand zelf | ✅ compleet, alle verplichte velden ingevuld |
| 8 | `briefingImage` asset | ✅ `/assets/agents/veilig-internet.svg` bestaat in `public/assets/agents/` |
| 9 | `attribution`-blok in config | ✅ bron, auteur, licentie, licentie-URL, bron-URL allemaal aanwezig |
| 10 | Attributie daadwerkelijk gerenderd | ✅ `ScenarioEngine.tsx:212,232` geeft `config.attribution` door aan zowel `IntroScreen` als `CompletionScreen` — geen dode data |

**Bevinding:** het 10-punts registratiepatroon is volledig en correct doorlopen. Geen ontbrekende koppeling gevonden.

### Agent-rol (year1.tsx)

`systemInstruction: ''` en `steps: []` — dit is een pure template-missie zonder chat-component. Geen AI-rol actief, dus **geen dormant-chat-issue van toepassing** (dat patroon geldt alleen bij missies met gevulde `systemInstruction`/`enableChat`). Bevestigd door afwezigheid van `veilig-internet` in `supabase/functions/` (geen server-side prompt nodig, want geen AI-interactie in deze missie).

### Scoring narekenen

4 rondes × maxScore 25 = 100. Config `maxScore: 100`. **Klopt exact**, geen scoringsbalans-mismatch (in tegenstelling tot een andere missie in deze batch met een 100-vs-90-mismatch).

### Valid-ids-consistentie

Geen `valid-ids`/`VALID_MISSION_IDS`-patroon gevonden dat op `scenario-engine`-missies van toepassing is (dat patroon hoort bij andere templates met externe scenario-validatie, bijv. debate-arena). Niet van toepassing hier — geen bevinding.

### Feitelijke check scenario's (welzijnsbril: niet bang-makend, handelingsperspectief)

**Ronde 1 — Phishing-signalen (select-correct, 6 items):**
Alle 4 correcte signalen (onbekend domein, tijdsdruk, mismatch-link, taalfouten) zijn actuele, correcte phishing-indicatoren. Item 6 (ongevraagde prijs) eveneens correct. Item 5 (docent stuurt opdracht via schoolplatform = NIET verdacht) is een sterke didactische keuze: voorkomt overgeneralisatie/paniek bij normaal schoolverkeer — precies de welzijnsbril die gevraagd werd.

**Ronde 2 — Wachtwoord & 2FA (binary-choice, 6 items):**
Item 2 promoot een lange, unieke wachtwoordzin als sterk voorbeeld — dit is actueel, correct advies (in lijn met NCSC/NIST-richtlijnen: lengte/uniciteit boven verplichte teken-complexiteit). Wachtwoordhergebruik (item 1) en zichtbaar opgeschreven wachtwoorden (item 5) correct als onveilig gemarkeerd. 2FA-items (3, 6) feitelijk correct omschreven als extra beveiligingslaag.

**Ronde 3 — Persoonsgegevens (select-correct, 6 items):**
Correcte scheiding: adres/geboortedatum/telefoonnummer/inlogmail = gevoelig; huisdierfoto/favoriete game = niet gevoelig. Geen overdreven "alles is gevaarlijk"-toon — juist genuanceerd (item 3, 5 relativeren bewust).

**Ronde 4 — Volgorde bij verdacht bericht (order-priority, 4 items):**
Volgorde stop → controleer → vraag hulp → meld/blokkeer is didactisch sound, geeft expliciet handelingsperspectief in plaats van alleen een waarschuwing. "Vraag een vertrouwde volwassene om hulp" (stap 3) is een goede, niet-stigmatiserende verwijzing.

**Conclusie feitelijke check:** geen onjuistheden, geen gedateerd advies, geen bang-makende framing gevonden. Welzijnsbril is goed toegepast — dit hoeft niet als fix behandeld te worden.

### Platform-inzicht (server-side vs. client chat-prompt)

Niet van toepassing: deze missie heeft geen chat-component (`systemInstruction: ''`), dus geen drift tussen server-side (`supabase/functions/_shared/systemInstructions.ts`) en client-fallback mogelijk.

## Stap B — UI/UX

- Geen `.ui-review/screenshots/`-map aanwezig voor deze missie — geen visuele verificatie mogelijk in deze wave.
- Geen treffer voor `veilig-internet` in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` (missie is later geland dan die audit-datum, dus logisch afwezig).

**Bevinding:** geen UI/UX-signaal beschikbaar; geen reden tot escalatie, wel een lacune in visuele dekking (niet uniek voor deze missie).

## Stap C — Rubric-scores

Schaal: 0-10 kwaliteit, 10 = uitstekend.

| Rubric | Score | Toelichting |
|---|---|---|
| Design | 9.0 | Consistente scenario-structuur, duidelijke iconen/emoji per item, attributie correct zichtbaar op intro+resultaat. Geen visuele verificatie mogelijk (geen screenshots) — lichte aftrek voor onzekerheid, niet voor een gevonden gebrek. |
| Didactiek | 9.5 | Feitelijk correct, actueel beveiligingsadvies; sterke welzijnsbril (niet-bang-makend, handelingsperspectief, relativering bij niet-gevoelige info); scoring en leerdoelen sluiten naadloos aan op de 4 rondes. |
| Techniek | 9.5 | Volledige 10-punts registratie, scoring klopt exact, attributie functioneel gerenderd (geen dode data), geen dormant-chat-risico (geen chat-component), geen valid-ids-inconsistentie. |

**triageScore** = (10-9.0)×0.3 + (10-9.5)×0.4 + (10-9.5)×0.3 = 0.3 + 0.2 + 0.15 = **0.65**

Lage triageScore = lage prioriteit voor vervolgactie (schaal: hoger = meer werk nodig). Deze missie behoeft geen fixes.

## Voorstel-blokken

Geen. Geen enkele bevinding vereist een code- of content-wijziging.

## Eindoordeel

**ALLOW** — missie is compleet, feitelijk correct, didactisch sterk en technisch consistent. Geen autoFixable of escalatie-waardige issues gevonden. Enige lacune (geen screenshots voor visuele verificatie) is geen blocker en geldt platform-breed.
