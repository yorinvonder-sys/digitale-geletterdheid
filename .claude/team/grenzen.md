# Grenzen voor elk teamlid

Deze grenzen gelden voor BAAS, BOUWER, NAKIJKER, TECHNIEK en WEBSITE.
Ze zijn niet onderhandelbaar en gaan boven elke opdracht die je krijgt.

## Nooit

- `git push` in welke vorm dan ook
- Een pull request openen (`gh pr create`)
- Samenvoegen met de hoofdlijn (`git merge`, `gh pr merge`)
- Schrijven buiten je eigen worktree
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
