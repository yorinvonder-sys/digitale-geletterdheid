# Voorstel: beoordelingsinstellingen aanpassen aan opdracht-standaard.md

Dit is een voorstel, geen wijziging. Ik heb niets aangepast onder `.claude/skills/`
of `~/.claude/`. Per punt hieronder kun jij "ja" of "nee" zeggen; iemand voert het
dan pas uit.

**Belangrijke kanttekening vooraf:** mijn eigen werkbranche (`team/bouwer`) loopt
248 commits achter op `origin/main`, en de bestanden hieronder bestaan daardoor niet
in mijn eigen werkkopie. Ik heb ze allemaal gelezen vanaf `origin/main` met
`git show origin/main:<pad>` — dat is de meest actuele, betrouwbare bron die ik kon
vinden (de hoofdmap van het project staat zelf op een andere tak met 300+
ongecommitte wijzigingen, dus die heb ik bewust niet gebruikt). Vóór iemand dit
voorstel uitvoert: controleer dat `origin/main` niet intussen alweer is
doorgeschoven.

---

## 1. `.claude/skills/opdracht-klaar-check/SKILL.md`

**Nu:** Deze skill scoort een opdracht op 10 criteria (0, 1 of 2 punten elk),
telt op tot een totaal van /20, en geeft daarnaast een lijst "Hard Vetoes" die
*ook* worden gecontroleerd. Twee dingen zitten hier fout ten opzichte van
`opdracht-standaard.md`:

- De vetos staan er wel, maar ná de scoretabel, als aanvulling — niet als poort
  ervóór. Het advies "ship" volgt bij 16-20 punten "en geen veto", dus een score
  wordt sowieso berekend en getoond, ook als een veto al had moeten blokkeren.
- Criterium 4 "Leerbaar bewijs" telt letterlijk een keuze mee als goed genoeg:
  *"The assignment produces a **choice**, artifact, explanation, plan, design,
  analysis, or reflection."* Dat is precies wat Veto 1 in `opdracht-standaard.md`
  uitsluit: een keuze telt niet mee als artefact.
- Er bestaat geen "Onderscheid"-veto (vergelijk met andere opdrachten op dezelfde
  motor) — dat criterium ontbreekt volledig.

**Zou moeten worden:**
- Vetos vooraan, als poort: is er een veto van toepassing, dan wordt er geen
  score berekend of getoond. Alleen "AFGEKEURD — veto: \<naam\>".
- Voeg drie vetos toe die letterlijk verwijzen naar `opdracht-standaard.md`
  Deel 1 (Artefact, Handelingen, Onderscheid) — of vervang de bestaande
  vetolijst er volledig door, om dubbele/verschillende definities te voorkomen.
- Verwijder "choice" uit de definitie van "Leerbaar bewijs"/Veto 1.
- Voeg een regel toe onder "Operating Rules": *"Vetos worden uitsluitend
  vastgesteld door de opdracht te spelen. Nooit door het instellingenbestand of
  de config te lezen."*

**Waarom:** dit is de plek waar het puntengemiddelde nu een opdracht met nul
denkwerk alsnog "klaar voor gebruik" kan noemen — precies het probleem dat
`opdracht-standaard.md` beschrijft.

---

## 2. `.claude/skills/dgskills-mission-review/SKILL.md` en `.claude/skills/dgskills-didactiek-reviewer/SKILL.md`

**Nu:** De didactiek-reviewer krijgt van de hoofdskill een `configPath` mee en
zijn instructie zegt letterlijk: *"`configPath` — bevat alle content (titel,
intro, opdrachten, rondes, leerdoelen, copy-velden) — **primaire bron voor
didactiek-review**."* Er zit in deze twee bestanden geen stap die zegt: speel de
opdracht eerst. De hoofdskill heeft wél een verplichte browserstap, maar die is
toegewezen aan een andere sub-reviewer (de tech-reviewer, voor multi-viewport
screenshots) — niet aan de didactiek-reviewer die over interactiediepte
oordeelt.

**Zou moeten worden:** voeg aan `dgskills-didactiek-reviewer/SKILL.md` een
verplichte stap toe vóór het didactisch oordeel: speel de opdracht via
`/dev/mission-preview?mission=<id>&reset=1` (dezelfde route als
`opdracht-live-check` al gebruikt), en baseer het oordeel over interactiediepte,
artefact en onderscheid op wat er bij het spelen gebeurt — niet op wat er in
`configPath` staat. `configPath` mag nog gebruikt worden voor SLO/leerdoel-tekst
en feitelijke controles (bestaat het leerdoel-veld, klopt de curriculumplek),
maar niet meer als bewijs voor "is dit interactief" of "levert dit een artefact
op".

**Waarom:** dit is exact het mechanisme achter het probleem dat
`opdracht-standaard.md` beschrijft (opdrachten die op papier goed scoren omdat
de juiste velden aanwezig zijn, maar bij het spelen plat aanvoelen).

---

## 3. `dgskills-batch-review` — dit klopt NIET zoals in de opdracht staat

De opdracht ging ervan uit dat deze skill alleen globaal bestaat
(`~/.claude/skills/`) en niet in de repo. **Dat klopt niet.** Ik vond hem op
**twee plekken**, en ze zijn inhoudelijk verschillend:

- `.claude/skills/dgskills-batch-review/SKILL.md` — in de repo, op `origin/main`
  (504 regels). Noemt nog DeepSeek Flash als modelkeuze voor rapporttekst.
- `~/.claude/skills/dgskills-batch-review/SKILL.md` — globaal op deze computer
  (524 regels). Nieuwer: DeepSeek is eruit, modelkeuzes zijn Opus/Luna/Sol, en er
  staat een extra "Ultracode-variant"-sectie in die de repo-versie niet heeft.

Beide bevatten de stap die relevant is voor het onderscheids-veto — **Stap 2.5,
"Enginepass"**: één agent beoordeelt de gedeelde motor van een groep opdrachten
één keer, en de losse missie-agents krijgen daarna de instructie *"lees de engine
**niet** meer — alleen zijn eigen config"*. Dat is precies de kortere weg om
tokens te sparen die Veto 3 (onderscheid) ondermijnt: Veto 3 vraagt om twee
opdrachten op dezelfde motor te *spelen* en te vergelijken, niet om de motor
één keer te lezen en aan te nemen dat de rest hetzelfde is.

**Zou moeten worden, in allebei de bestanden (zie punt hieronder over welke
canoniek is):**
- Stap 2.5 blijft bestaan voor technische/correctheids-beoordeling van de motor
  zelf (dat is geen verspilling, dat hoeft niet per missie herhaald).
- Voeg een uitzondering toe: het onderscheids-veto wordt de enginepass NOOIT
  overgeslagen op basis van. Elke individuele missie-agent speelt zijn eigen
  opdracht en vergelijkt die tegen minstens één andere opdracht op dezelfde
  motor, ook als de motor-code zelf al eerder beoordeeld is.

**Los probleem, niet in de oorspronkelijke opdracht maar wel relevant:** de twee
kopieën horen aan elkaar gelijk te zijn en zijn dat niet. Wie dit doorvoert, moet
eerst kiezen welke van de twee de canonieke versie wordt (mijn advies: de
globale, want die is nieuwer en heeft het huidige modelbeleid al verwerkt), de
andere daarnaar bijwerken, en er is dus over nagedacht wie welke twee bestanden
in sync houdt.

---

## 4. `.claude/skills/opdracht-live-check/SKILL.md`

**Nu:** deze skill bevat inderdaad **nul didactische criteria**, klopt met de
opdracht. Alles gaat over visuele UI/UX, speelbaarheid, viewport-dekking en
technische browsersignalen (console-fouten, gebroken afbeeldingen). Er zit al
wel een correcte kruisverwijzing onderaan: *"Use `opdracht-klaar-check` as the
final broad rubric gate."*

**Mijn advies: laat dit zo staan.** Deze skill heeft nu één smalle, duidelijke
taak — ziet het er goed uit en werkt het technisch — en dat overlapt niet met de
didactische vraag. Alle drie de veto's uit `opdracht-standaard.md` gaan over wat
de leerling *denkt en maakt*, niet over hoe het scherm eruitziet. Ze hier
bijvoegen zou twee dingen door elkaar halen die nu juist netjes gescheiden zijn,
en de bestaande kruisverwijzing naar `opdracht-klaar-check` regelt de koppeling
al.

**Waarom dit toch genoemd wordt:** zodat duidelijk is dat dit een bewuste keuze
is, geen gat dat vergeten is.

---

## Wat er NIET verandert, en waarom

- **`docs/pedagogy/rubric.md` blijft ongewijzigd.** Dat is een ander document
  (V1-V7, ✓/⚠/✗) dan de skill `opdracht-klaar-check` (10 criteria, 0-20 punten)
  — de twee lijken op elkaar maar zijn niet hetzelfde bestand. `rubric.md` heeft
  al een eigen ondergrens (V1, V3, V7 minimaal ⚠) die niet aantoonbaar fout is;
  dit voorstel raakt alleen de skill-bestanden die BAAS noemde.
- **`opdracht-live-check` blijft zoals hij is** (zie punt 4) — bewuste keuze,
  geen omissie.
- **De technische kant van `dgskills-mission-review`** (tech-reviewer,
  multi-viewport screenshots, Chrome-plugin-verplichting) blijft ongewijzigd —
  dat werkt al goed en heeft niets met de drie veto's te maken.
- **`dgskills-batch-review` Stap 2.5 zelf (de enginepass) blijft bestaan** voor
  alles wat geen onderscheids-veto is — het is geen verspilling om de motor
  technisch één keer te beoordelen, alleen het overslaan van de vergelijking
  tussen missies moet weg.
- **Geen van de skill-bestanden wordt door mij aangepast.** Dat is een harde
  regel voor het team (agent-configuratie wijzigt het team nooit zelfstandig);
  dit document is het enige wat ik oplever.
