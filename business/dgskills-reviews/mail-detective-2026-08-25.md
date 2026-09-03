# Rubric-review: Mail Detective (mail-detective)

**Datum:** 2026-08-25
**templateType:** helpdesk-shift
**AI-gedrag & privacy:** aparte veiligheids-pass (zie sweep-rapport)

## 🎨 Design review — score 8/10

### ✅ Geslaagd
- 12 mails met natuurlijke variatie in toon, afzendernaam, onderwerp en opmaak — geen herkenbaar sjabloon dat het antwoord verklapt.
- Vlaggen (`vlaggen[]`) zijn consistent gestructureerd en dekken alle relevante plekken (afzender, onderwerp, tekst, link, bijlage) zonder visuele bias richting het juiste antwoord (bevestigd door engine-bevinding "verklap: schoon").
- Badges (Helpdeskheld/Scherpe Blik/Goed Begonnen/Blijf Oefenen) volgen het bestaande duck-kleurenpatroon.

### ⚠️ Aandachtspunten
- Geen config-eigen designgebreken gevonden; de engine-brede toegankelijkheidsbevindingen (leesvenster zonder dialog-semantiek, contrast op `text-duck-ink/50` en `text-duck-error` op `bg-duck-error/10`, niet-visuele navigatielaag) raken deze missie omdat ze alle 12 mails via `MailPane`/`OfficeShift` renderen, maar zijn engine-niveau en dus al vastgesteld — geen aparte config-bevinding nodig.

### ❌ Blocking issues
Geen op config-niveau.

## 📚 Didactiek review — score 7/10

### ✅ Geslaagd
- Leerdoelen zijn concreet en toetsbaar (herkent signalen, kiest handeling onder tijdsdruk, onderscheidt schijn-verdacht-maar-echt van onschuldig-maar-nep, ziet concreet gevolg).
- SLO-koppeling logisch: `23A` (veiligheid & privacy) hoofddoel, VSO `18B`/`20A` (mediawijsheid + digitale veiligheid) — past bij phishingherkenning.
- Sterke didactische keuze: expliciete "twijfelgevallen" (mail 4, 9, 12) waarbij haast of een net-niet-kloppend detail NIET automatisch verdacht is — dit voorkomt het aanleren van overdreven wantrouwen en traint precies leerdoel 3 ("schijn-verdacht maar echt" vs "onschuldig maar nep").
- Curriculumplek (leerjaar 1, periode 3, week 3) logisch naast de andere privacy/veiligheidsmissies van die week.
- `missionGoals.ts`-entry (`primaryGoal`, `criteria`, `evidence`) is helder en leeftijdspassend geformuleerd.

### ⚠️ Aandachtspunten
- **Leerdoel 4 wordt niet betrouwbaar getoetst.** De missie belooft dat een foute keuze "een concreet, zichtbaar gevolg heeft" en dat kosten (accountverlies, geldverlies) er echt toe doen — maar de gedeelde scoring-engine weegt alleen `veiligeAccounts` mee in het schooldeel van de score (zie engine-bevinding, `scoring.ts:66-71`). `geldKwijt` (bijv. €1.250 bij mail 7, €85 bij mail 11) en `meldingen` tellen scoretechnisch nul. Voor déze config betekent dat: een leerling die stelselmatig verkeerd kiest, kan alsnog de voltooiingsdrempel halen zonder de link tussen "foute keuze → schade" echt te ervaren in zijn score. Dit is een engine-fix, geen config-fix, maar het ondermijnt wel specifiek leerdoel 4 van déze missie.
- Twijfelgevallen (mail 4 en 9) zijn didactisch sterk bedoeld, maar zonder de reactietekst-laag (engine-bevinding: `InterruptionOverlay`-reactie wordt nooit getoond) mist de leerling voor onderbrekingen de nabespreking-context die dat soort nuance verduidelijkt. Voor de 12 mails zelf werkt de nabespreking via `ShiftDebrief`/`BewijsBlok` wél.

### SLO-fit oordeel
Claim (23A: veiligheid & privacy) komt overeen met de werkelijke inhoud van de missie. Geen overclaim.

### ❌ Blocking issues
Geen op didactiek-config-niveau; de bevinding hierboven is een engine-bevinding die deze missie's leerdoel 4 concreet raakt.

## 🔧 Tech review — score 4/10

### Static analyse

#### ✅ Geslaagd
- Config volgt het `HelpdeskShiftConfig`-type strikt; alle 12 mail-objecten hebben consistente velden (`id`, `juisteActie`, `tell`, `uitleg`, `gevolg`, `vlaggen`).
- `registry`/`slo-kerndoelen-mapping`/`curriculum`/`missionGoals`-entries zijn onderling consistent (zelfde id, geen typefouten, geen dubbele registratie).

#### ⚠️ Aandachtspunten
- Config-eigen risico dat de engine-bevinding "poortlogica hangt aan naam-koppeling zonder validatie" (`OfficeShift.tsx:90`, `office.mailPerDesk[mail.id]`) concreet maakt: dit rapport heeft géén los `office.ts`/desk-mapping-bestand voor `mail-detective` geopend (buiten scope van de gevraagde bestandenlijst) — verifieer bij een eventuele fix dat alle 12 `mail.id`'s (1 t/m 12) een bestaand bureau in `mailPerDesk` hebben, anders loopt de dienst onherstelbaar vast op precies dat bericht.

#### ❌ Blocking issues (overgenomen van de gedeelde engine, van toepassing op elke helpdesk-shift-missie inclusief deze)
1. **`onComplete` stuurt geen score door** (`HelpdeskShift.tsx:125`) — de score die de motor voor deze 12 mails berekent, komt nooit in het docentenrapport terecht.
2. **Puntentelling niet gokbestendig** (`scoring.ts:66`) — doorgerekend op déze config (12 mails, 7× doorlaten/5× melden, start 12 accounts): "altijd doorlaten" scoort 63/100, "altijd melden" scoort 59/100 — beide ruim over de voltooiingsdrempel van 40%, zonder één mail te lezen.

### Dynamic verificatie
Niet uitgevoerd — geen dev-server-sessie in deze pass; static analyse + engine-bevindingen volstaan voor het oordeel op config-niveau.

### Score
4/10 — de config zelf is technisch schoon, maar de missie draait op een gedeelde engine met twee blocking bevindingen die de score-integriteit en het docentenrapport van precies déze missie raken.

## Voorstellen

Geen van de blocking/warning-bevindingen valt binnen de mission-config whitelist (`mail-detective.ts`, `templateRegistry.ts`-entry, SLO/curriculum/missionGoals-entries) — alle fixes zitten in de gedeelde engine (`HelpdeskShift.tsx`, `scoring.ts`, `InterruptionOverlay.tsx`, `OfficeShift.tsx`, `MailPane.tsx`, `SchoolStatus.tsx`). Er zijn daarom geen auto-fixable voor/na-snippets binnen de scope van dit rapport; deze horen bij de engine-fix voor `helpdesk-shift` als geheel (raakt ook andere helpdesk-shift-missies).

Enige config-niveau aanbeveling (geen code-wijziging, wel voor de configauteur bij een toekomstige revisie): overweeg voor mail 4 en mail 9 een `gevolg.melden`-tekst toe te voegen zodra de engine-fix voor onderbrekingsreacties er is, zodat "melden bij IT als voorzichtige keuze" ook in de nabespreking expliciet bevestigd wordt — nu staat dat alleen in `uitleg`.

## Samenvatting & verdict

De 12 mail-scenario's zelf zijn sterk: realistische variatie, goed gekozen twijfelgevallen, en een verklap-vrije vlaggenstructuur. Het probleem zit niet in deze config maar in de gedeelde `helpdesk-shift`-engine die de config aandrijft: de score die de motor voor Mail Detective berekent bereikt het docentenrapport niet, en de score is niet gokbestendig — een leerling kan zonder te lezen slagen. Beide zijn blocking en raken het leerdoel van déze missie rechtstreeks (leerdoel 2 en 4).

**Verdict: fix-eerst** (engine-niveau, niet in mail-detective.ts zelf op te lossen).

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).
