# AI-testklas — mail-detective (2026-07-30)

**Oordeel: `fix-eerst`**

Reden: één nieuwe bevinding van hoge ernst met gemeten bewijs — de missie is met volle score te halen zonder te weten wat phishing is.

| Leerling | Afgemaakt | Tijd | Score | Niveaufit | Binnen 30s geboeid |
|---|---|---|---|---|---|
| Taalzwakke Tess (mavo, A2/B1) | ✓ | 17 min | 100/100 | passend | ja |
| Concrete Milan (mavo, jaar 1) | ✓ | 12 min | 95/100 | passend | ja |
| Creatieve Cheater (vwo) | ✓ | 8 min | 100/100 | **te-makkelijk** | **nee** |

Opgegeven duur ~15 min. Traagste leerling 17 min — past binnen de les.

## Nieuwe bevindingen

### 1. Het antwoord staat in de vraag — HIGH
*Creatieve Cheater · DIDACTICS · OBJECTIVE · confidence 0.95 · `snapshot-2-fase1-voor-check.txt`*

In fase 1/4 tonen alle vier de antwoordkaarten hun verklarende "waarom is dit verdacht"-tekst al **voordat** je iets kiest. De drie juiste opties bevatten elk een signaalwoord ("maar", "niet op het domein van je school", "ander adres dan het echte"); de foute optie is neutraal geformuleerd. Door alleen op die woorden te scannen haal je 25/25 zonder de mail te lezen en zonder iets over phishing te weten.

Datzelfde patroon zit in fase 3, scenario 6, waar "(.exe-bestand)" letterlijk in de beschrijving staat.

**Gevolg:** het kerndoel van de missie — "ik herken signalen van phishing" — is te omzeilen in precies de oefening die ernaar genoemd is.
**Voorstel:** toon de verklaring pas ná het indienen, en herschrijf de kaarten neutraal zoals optie 4 nu al is.

### 2. De praktijkvraag telt niet mee — MEDIUM
*Creatieve Cheater · DIDACTICS · OBJECTIVE · confidence 0.85*

De verdiepingsvraag is de enige plek die toetst wat je écht doet bij een verdachte mail — letterlijk het doel op het introscherm. Maar hij telt niet mee in de score, blokkeert het afronden niet, en het resultaat staat nergens op het eindscherm. Bewust het gevaarlijkste antwoord kiezen ("Meteen klikken, want anders ben je je account kwijt") levert nog steeds 100/100 op. In `localStorage` staat wél `followUpCorrect: false`, maar dat wordt nergens gebruikt.

### 3. Introscherm belooft iets anders dan fase 4 levert — MEDIUM
*Taalzwakke Tess · DIDACTICS · OBJECTIVE · confidence 0.90*

Stap 4 op het introscherm belooft "ontdek welke trucs aanvallers gebruiken". Fase 4/4 heet "Hoe reageer je slim?" en gaat over veilige vervolgacties. Stappen 1–3 kloppen wel exact. Kleine inconsistentie, makkelijk te repareren.

### 4. Kernwoorden pas uitgelegd aan het eind — MEDIUM
*Taalzwakke Tess · LANGUAGE · SIMULATION · vraagt menselijke toetsing*

"Phishing" staat onuitgelegd in de doelstelling op het állereerste scherm, en wordt pas uitgelegd in de feedback van de laatste ronde. "Zweven" wordt drie keer gebruikt in de betekenis "je muis boven een link houden" zonder dat die betekenis ooit wordt gegeven — terwijl juist dat als leerpunt op het eindscherm staat. Tess kent "zweven" alleen als "in de lucht hangen".

Ook: "argwaan" (LOW) is te formeel voor deze doelgroep.

### 5. Rangschikken zonder maatstaf — MEDIUM
*Concrete Milan · DIDACTICS · SIMULATION · vraagt menselijke toetsing*

Fase 2 vraagt vijf mails te ordenen op gevaar, maar geeft vooraf geen regel om te bepalen wat gevaarlijker is: een `.exe`-bijlage of een verzoek om je wachtwoord. Milan gokte, koos verkeerd, en verloor 5 punten. De uitleg kwam pas achteraf als feedback. Dat is een vergelijkende denkstap terwijl de rest van de missie om herkennen vraagt.

### 6. Toegankelijkheid inconsistent tussen fases — LOW
*Concrete Milan · USABILITY · OBJECTIVE · confidence 0.90*

De Accepteren/Weigeren-knoppen in fase 3 tonen hun gekozen status alleen visueel, niet in de voorleesstructuur — terwijl fase 1 en 4 dat wél doen. Voor een leerling met een schermlezer is niet af te lezen wat al gekozen is.

## Waarnemingen zonder oordeel

Milan zag dat na afronden en opnieuw openen (zonder `reset=1`) het eindscherm en de opgeslagen status meteen terugkeren. Hij markeerde het zelf als mogelijk artefact van de preview-route en vroeg om bevestiging door een ontwikkelaar. Correct gehandeld — dit is geen bevinding tot iemand het buiten de preview reproduceert.

## Bekende bevindingen

Geen van de drie leerlingen liep tegen de twee bekende punten aan (8 items per scherm in ronde 1 en 4; overlap met phishing-fighter). Opvallend: Tess en Milan speelden die rondes zonder over de hoeveelheid te klagen. Dat weerlegt de bekende bevinding niet, maar het ondersteunt hem ook niet.

## Signalen voor het lesgeven

- **Meet niets:** met patroonherkenning haal je 100% zonder het onderwerp te snappen, en een fout antwoord op de enige praktijkvraag blijft onzichtbaar. Twee routes naar een volle score zonder aantoonbaar leerresultaat.
- **Landt niet bij iedereen:** de vwo-leerling vond het te makkelijk en was binnen 30 seconden niet geboeid.

## Niet getest

Serveropslag, XP en dashboardvoortgang: `NOT_RUN`.
