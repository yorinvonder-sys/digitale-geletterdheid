# Projectcontext — DGSkills / AI Lab

## Wat is DGSkills?

DGSkills (dgskills.app) is een AI-gestuurd platform voor **digitale geletterdheid** in het Nederlandse voortgezet onderwijs. Leerlingen leren via interactieve **missies** over onderwerpen als cybersecurity, AI-ethiek, mediawijsheid en datageletterdheid — begeleid door een AI-assistent.

## Doelgroep

| Rol | Beschrijving |
|-----|-------------|
| **Leerlingen** | VO, leerjaar 1-6, 12-18 jaar (minderjarig → extra privacyeisen) |
| **Docenten** | Informatica, digitale geletterdheid, mentoren |
| **ICT-coördinatoren** | Beslissers voor aanschaf, compliance-gericht |
| **Schoolbesturen** | Budget, verwerkersovereenkomst |

## Kernarchitectuur

- **Frontend:** React 19 + TypeScript + Vite, Tailwind CSS, Framer Motion
- **Backend:** Supabase (PostgreSQL, Auth, RLS, Edge Functions)
- **AI:** Google Gemini via Vertex AI (europe-west4), server-side only
- **Hosting:** Vercel (frontend), Supabase (backend + edge functions)
- **Auth:** Supabase Auth met RLS als primaire access control

## SLO-koppeling

Het platform sluit aan bij het **SLO-curriculum Digitale Geletterdheid**:
- Digitale vaardigheden
- Informatievaardigheden
- Mediawijsheid
- Computational thinking
- ICT-basisvaardigheden

Elke missie is gekoppeld aan specifieke SLO-leerdoelen.

## Classificatie

- **EU AI Act:** HIGH RISK (Annex III, punt 3b — AI voor beoordeling leerresultaten)
- **AVG:** Verwerking persoonsgegevens minderjarigen, DPIA verplicht
- **Data residency:** EER/EU-projectregio (server-side, waar contractueel vastgelegd)

## Businessmodel

- SaaS voor scholen, per-leerling licentie
- Pilot → schoollicentie → bestuurlicentie
- Solo founder: Yorin Vonder (KvK 81819889)
