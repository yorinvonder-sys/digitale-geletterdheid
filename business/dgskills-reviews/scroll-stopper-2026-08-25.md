# Review: Scroll Stopper (scroll-stopper)
Datum: 2026-08-25 · templateType: debate-arena

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 6.5/10
- **Warning — stakeholderkleur-contrast (gedeeld engine-defect, raakt deze missie):** STAKEHOLDER_COLORS bevat `#e1ff01`; met 4 stakeholders in deze config raakt dat mogelijk niet elke index, maar de mapping is positioneel (index 4 = duck-acid geel) en deze config heeft 4 stakeholders (index 0-3), dus het gele knop-contrastprobleem raakt `scroll-stopper` in de huidige opzet niet direct — wel bij een toekomstige 5e stakeholder. Info-niveau, geen fix nu nodig.
- **Warning (gedeeld):** `ArguePhase`-kwaliteitsindicator (rood voor zowel "Uitstekend" als "Te kort", geel-op-wit voor "Basis") is een engine-defect dat elke debate-arena-missie raakt, inclusief deze.
- Content is consistent qua toon: 4 heldere, onderscheidende stakeholders (tiener, ontwerper, psycholoog, politicus) met korte, invoelbare perspectieven — goed voor leerjaar 1.
- Positieomschrijvingen zijn kort en scherp afgebakend van elkaar.

## Didactiek — score 7.5/10
- Sterk: vier stakeholders met écht verschillende belangen (persoonlijk, commercieel, wetenschappelijk, beleidsmatig) — dwingt tot afwegen, geen stroman.
- `keyArgument` per stakeholder is scherp en direct bruikbaar in leerlingargumentatie.
- `counterArgument` is een geldig glijdende-schaal-tegenargument, past bij leerjaar 1-niveau (niet te abstract).
- Takeaways zijn concreet en één ervan bevat een normatieve conclusie ("Regelgeving werkt het best op Europees niveau") die als feit wordt gepresenteerd terwijl het een politiek standpunt van één stakeholder (De Vries) is — dit hoort als perspectief, niet als afsluitende waarheid.
- SLO-koppeling (23B, 21B / vso 20A, 20B) past bij mediawijsheid + welzijn-thema; logisch voor "verslavend app-design".
- Slechts 2 reflectionQuestions (niet 3) — dit betekent dat het gedeelde 110-punten-scoringsdefect (engine-bevinding) déze missie NIET raakt; maxScore 100 blijft consistent met de fase-optelling.

## Tech — score 8/10
- Config is compleet en type-consistent (DebateArenaConfig): stakeholders, positions, badges, takeaways allemaal aanwezig en goed gevuld.
- Wiring correct in alle vier bronnen: `templateRegistry.ts` (enableChat: true, chatRoleId gezet), `slo-kerndoelen-mapping.ts`, `curriculum.ts` (leerjaar 1), `missionGoals.ts` (primaryGoal/criteria/evidence aanwezig en inhoudelijk passend).
- Missie-specifieke risico's zijn beperkt tot wat de gedeelde engine al blokkerend meldt (dubbele voltooiknop-klik, destructieve "opnieuw proberen"-knop bij <40%) — dat zijn engine-brede defecten, geen scroll-stopper-specifieke fout.
- Geen missie-eigen technische fouten gevonden in de config zelf.

## Voorstellen
Geen mechanische auto-fixes nodig binnen de whitelist voor deze missie — de gevonden issues zitten in de gedeelde engine (CompletionScreen.tsx, DebateArena.tsx, ArguePhase.tsx, ExplorePhase.tsx) en vallen buiten de scope van dit config-bestand.

Enige inhoudelijke suggestie (niet mechanisch, ter overweging voor Yorin):

Voor: `takeaways: [..., 'Regelgeving werkt het best op Europees niveau.']`
Na: `takeaways: [..., 'Kamerlid De Vries pleit voor Europese samenwerking als sleutel — andere partijen kijken hier anders naar.']`
Reden: voorkomt dat één stakeholder-standpunt als objectieve conclusie overkomt.

## Samenvatting en verdict
Scroll Stopper is een inhoudelijk sterke debat-missie met vier goed onderscheiden stakeholders en een scherp tegenargument. De config zelf bevat geen missie-eigen technische fouten en is correct gewired in alle vier configuratiebronnen. De belangrijkste risico's (dubbele voltooiknop, destructieve retry-knop) zitten in de gedeelde debate-arena-engine en zijn al als blocking gemeld in de enginebeoordeling — die vereisen een aparte engine-fix, geen missie-specifieke actie. Enige contentpunt: één takeaway presenteert een politiek standpunt als feit.

**Verdict: ok** (missie-eigen niveau; engine-blockers gelden platform-breed en worden apart opgelost).
