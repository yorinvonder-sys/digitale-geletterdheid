# Grenzen voor elk teamlid

Deze grenzen gelden voor BAAS, BOUWER, NAKIJKER, TECHNIEK en WEBSITE.
Ze zijn niet onderhandelbaar en gaan boven elke opdracht die je krijgt.

## Nooit

- `git push` in welke vorm dan ook
- Een pull request openen (`gh pr create`)
- Samenvoegen met de hoofdlijn (`git merge`, `gh pr merge`)
- Schrijven buiten je eigen worktree
  (één uitzondering: het gedeelde statusbestand in de hoofdmap, zie hieronder)
- De worktree van een ander teamlid aanraken
- De productie-database of de live site muteren
- `git reset --hard`, `git clean -f`, `git checkout --` of `git stash drop`
- Sleutels, tokens of `.env`-inhoud lezen, tonen of doorsturen

Als een opdracht een van deze dingen vereist: melden aan BAAS en stoppen.
BAAS legt het bij Yorin neer. Nooit zelf beslissen.

## Altijd

- Werk binnen je eigen worktree
- Leg werk vast op je eigen tak met `git add <pad>` per bestand — nooit
  `git add .` of `git add -A`
- Meld vastlopen in plaats van te gokken
- Werk je status bij in `.claude/team/status.md` bij start en bij afronding
- Schrijf je status naar het GEDEELDE statusbestand in de hoofdmap van het
  project, met het absolute pad dat je bij het opstarten kreeg. Dat is de enige
  plek buiten je eigen worktree waar je mag schrijven.
- Bij twijfel over een risicolabel: kies de zwaardere kleur

## Hoe je binnen je eigen worktree blijft

Het verbod hierboven is niet genoeg — deze fout wordt gemaakt zonder dat je het
merkt. Werk daarom zo:

1. Stel bij het opstarten je worktree-root één keer vast en bewaar die:
   `WT="$(git rev-parse --show-toplevel)"`
2. Bouw ELK pad daaruit op. Ook paden voor lezen, ook "even snel" iets opzoeken.
   Typ nooit een absoluut projectpad met de hand.
3. Krijg je van een zoekopdracht of een onderaannemer een absoluut pad terug,
   dan is dat GEEN vrijbrief om daar te schrijven. Zet het eerst om naar een pad
   onder jouw `$WT`.
4. `cd` in een shellcommando altijd naar `$WT`, nooit naar de hoofdmap van het
   project — ook niet voor een leesactie, want de werkdirectory blijft hangen.
5. Klopt een regelnummer uit een zoekresultaat niet met wat je in het bestand
   ziet, dan lees je twee verschillende kopieën door elkaar. Stop en controleer
   welke boom je te pakken hebt voordat je iets wijzigt.
6. Draai na je eerste wijziging `git status` en bevestig dat die in jouw
   worktree is geland, niet ergens anders.

## Wanneer tegenlezing verplicht is

Risicolabels staan in `AGENTS.md` § Risk Labels. Bepaal de kleur voordat je
begint, niet achteraf.

| Situatie | Keurmeester | Sol |
|---|---|---|
| Rood, elke omvang | verplicht | verplicht |
| Groot (meer dan 3 bestanden of meer dan ~150 regels), elke kleur | verplicht | alleen bij Rood |
| Groen of Geel, en klein | adviserend | nee |

Bij Rood is omvang geen maat. Een wijziging van één regel aan een
toegangsregel is Rood en wordt tegengelezen.

Keurmeester roep je aan met de Agent-tool, `subagent_type: "keurmeester"`.
Sol roept de Keurmeester zelf aan; jij roept Sol nooit rechtstreeks aan.

## Wat je met Sol nooit deelt

Sol loopt via een externe dienst. Alles wat hij krijgt verlaat deze computer.
Nooit meesturen: sleutels, tokens, wachtwoorden, `.env`-inhoud, echte
leerlinggegevens. Code en migratiebestanden mogen wel.

## Hulp inschakelen

Hulp inschakelen is de regel, niet de uitzondering.

Zoek nooit zelf door meer dan een handvol bestanden. Moet je breed zoeken,
stuur er een verkenner op af en laat die één antwoord terugbrengen. Je eigen
aandacht is het schaarse goed; die bewaar je voor de beslissing, niet voor het
zoeken.

### Kies het model op het soort werk

| Wat je laat doen | Model |
|---|---|
| Opzoeken waar iets staat · statuscontroles · veel kleine vragen achter elkaar | Haiku |
| Een component schrijven volgens een duidelijke opdracht | Sonnet |
| Iets naspelen in de browser en rapporteren wat je ziet | Sonnet |
| Bedenken hoe iets eruit moet zien · kiezen tussen aanpakken · smaak | Opus |
| Tegenlezen van zwaar of risicovol werk | Opus |

Kies op de aard van de taak, niet op hoe belangrijk hij voelt. Een belangrijke
opzoekvraag blijft een opzoekvraag.

Let op bij Haiku: goedkoop maar oppervlakkig. Voor "in welk bestand staat X"
prima. Voor "waar hoort dit thuis" niet, want daar zit een oordeel in verstopt
dat je er niet in ziet zitten.

### Stop bij een oordeelsvraag

Blijkt onderweg dat een opdracht niet over uitvoeren gaat maar over smaak of
oordeel, stop dan en meld het bij BAAS. Bouw niet door.

Je wordt niet gevraagd te beoordelen of je zelf goed genoeg bent voor een taak
— dat kan niemand betrouwbaar over zichzelf. Je wordt gevraagd het soort taak
te herkennen. Dat is een waarneming, geen zelfoordeel.

### Een melding van een hulpkracht is een hypothese

Meldt een hulpkracht dat een bestand ontbreekt, dat iets kapot is, of dat iets
niet bestaat: controleer dat zelf voordat je erop handelt. Zeker voordat je op
grond daarvan iets gaat schrijven of weggooien.

Dat is hier eerder misgegaan: er is bijna code "hersteld" die er gewoon nog
stond, op gezag van een melding die niemand had nagekeken.

### Twee begrenzingen

Nooit twee hulpkrachten tegelijk in hetzelfde bestand.

Nooit twee tegelijk in de browser. Ze delen er één, en dan klikken ze elkaars
tabbladen om.

### Een hulpkracht erft jouw grenzen

Alles hierboven onder "Nooit" geldt onverkort voor wie jij inschakelt. Je kunt
via een hulpkracht niet doen wat je zelf niet mag.
