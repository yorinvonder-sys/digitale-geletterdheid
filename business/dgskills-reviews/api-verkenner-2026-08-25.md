# Review: API Verkenner — 2026-08-25

**Missie-ID:** `api-verkenner` · **TemplateType:** `data-viewer`

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## Design — score 8/10

**Bevindingen:**
- De drie datasets (tabel, staafgrafiek, document-cards) zijn goed gekozen en variëren visueel; geen herhaling van hetzelfde formaat.
- Kleurgebruik in de staafgrafiek (`#ff3c21` voor de twee hoogste, `#202023` voor de rest) is functioneel maar niet expliciet toegelicht aan de leerling — de leerling moet zelf afleiden dat kleur "opvallend hoog" betekent. Geen blocking, wel een gemiste kans op duidelijkheid.
- Badge-drempels (0/40/65/85) zijn consistent met het platformbrede patroon.
- Bekende engine-bevinding die dit ontwerp raakt (zie gedeeld engine-rapport): bij een score onder 40% komt de leerling vast te zitten op het resultatenscherm zonder terugweg — dit is een engine-defect, niet iets in deze config, maar het beïnvloedt wél of leerlingen die zwak scoren de missie ooit kunnen afronden.

## Didactiek — score 8/10

**Bevindingen:**
- Sterke opbouw: van "wat is een JSON-sleutel" (concreet, herkenbaar) naar "hoeveel API-calls stuurt een app" (vergelijkend inzicht) naar "hoe lees en bouw ik een API-URL" (transfer/toepassing). Goede scaffolding.
- Vraag q3 en q6 zijn tekst-observatievragen met keyword-scoring — passend bij het abstractieniveau (leerjaar 2).
- q8 vraagt om een nieuwe URL te construeren op basis van een patroon (charizard i.p.v. pikachu) — mooie transfertoets, geen kale herhaling.
- SLO-koppeling (`slo-kerndoelen-mapping.ts:107`) motiveert expliciet waarom 21A i.p.v. 21D is gekozen ("APIs begrijpen = systeemkennis, geen AI") — consistent en navolgbaar.
- Kleine inconsistentie: q1 en q5 zijn number-input met decimale antwoorden (1.4 en 12.7). Niet gecontroleerd is of de DataViewer-engine bij number-input een tolerantie hanteert voor afronding (bijv. 12,67 vs 12,7) — dit is een engine-vraag, niet specifiek aan deze config, dus hier alleen gemeld, niet als bevinding meegerekend.
- `missionGoals.ts`-entry is helder en dekt de kernstof (JSON-veld aanwijzen, URL-parameter, API-sleutel).

## Tech — score 9/10

**Bevindingen:**
- Config is syntactisch en structureel in orde: `missionId` consistent over `templateRegistry.ts`, `slo-kerndoelen-mapping.ts`, `curriculum.ts` en `missionGoals.ts`.
- Geen missie-specifieke engine-bugs gevonden buiten wat het gedeelde engine-rapport al vaststelt. De twee blocking bevindingen uit dat rapport (geen `onRetry` bij falen, `clearSave()` vóór bevestigde serveropslag) gelden generiek voor alle data-viewer-missies, dus ook voor `api-verkenner` — maar zijn geen config-fout van deze missie en vallen buiten de whitelist voor auto-fix.
- `correctAnswer` bij number-input vragen (1.4 en 12.7) is numeriek correct berekend (14.2 − 12.8 = 1.4; 38 ÷ 3 ≈ 12.67 → afgerond 12.7 — let op: 12.7 is een afronding, geen exacte deling; als de engine op exacte match toetst kan dit tot een net-mis leiden bij een leerling die 12.67 of 12.6 invoert).

---

## Voorstellen

Geen voorstellen binnen de auto-fix-whitelist voor deze missie — de config zelf bevat geen mechanische fouten. De twee blocking bevindingen (geen retry-pad bij falen, premature `clearSave()`) zitten in de gedeelde engine (`DataViewer.tsx`) en vallen buiten de scope van deze missie-config; zie het gedeelde engine-rapport voor die fix.

Eén punt van aandacht zonder concrete code-wijziging (geen bevestigde engine-tolerantie bekend):
- Vraag `q5-verschil-instagram-wikipedia` (`api-verkenner.ts`) vraagt "hoeveel keer meer" met `correctAnswer: 12.7`, een afgerond antwoord van 38÷3=12,666... Als de DataViewer number-input-vergelijking geen tolerantie hanteert, kan een leerling die exact rekent (12.67) worden afgekeurd. Dit is te verifiëren in de engine, niet in deze config aan te passen zonder engine-kennis.

---

## Samenvatting & verdict

De content van `api-verkenner` is stevig: heldere opbouw, correcte SLO-motivatie, afwisselende datasets en goede transfervragen. Er zijn geen missie-specifieke bugs in de config. De twee blocking issues die de missie treffen (vastlopen onder 40%, dataverlies bij mislukte opslag) zitten in de gedeelde `data-viewer`-engine en zijn al vastgelegd in het engine-rapport — ze zijn niet via deze missie-config op te lossen.

**Verdict: ok** (content-niveau; engine-blockers gelden platformbreed en worden centraal opgelost).
