# Mission Style Guide — DGSkills

> Lees dit voor je missiecontent schrijft. Elk onderdeel.
> Doel: content die klinkt zoals Yorin het zou zeggen, niet zoals een schoolboek.

---

## 1. Toon & Register

**Het principe:** Relaxte mentor. Naast de leerling zitten, niet boven ze staan.

Denk: docent die halverwege de les zegt "oké check dit even" — niet iemand die een toets aankondigt.

### Aanspreken
- Gebruik "je", niet "u" of "jij" (nadruk).
- Korte zinnen. Spreektaal. Geen omhaal.
- Geen introductiezinnen die uitleggen wat de leerling gaat leren.

### Goed vs. fout

| Fout | Goed |
|------|------|
| "In deze opdracht ga je leren over phishing." | "Je krijgt een verdacht mailtje. Wat doe je?" |
| "Bestudeer de onderstaande scenario's zorgvuldig." | "Check deze berichten — één ervan klopt niet." |
| "Zoals je in de vorige module hebt gezien..." | "Je weet al dat wachtwoorden hackbaar zijn. Maar hoe snel precies?" |
| "Probeer na te denken over de gevolgen." | "Wat gebeurt er als je op verzenden drukt?" |
| "Gefeliciteerd, je hebt deze opdracht succesvol afgerond!" | "Dat klopt. Nu weet je waarom lengte sterker is dan complexiteit." |

---

## 2. Tekst-maxima

Elke teksteenheid heeft een harde limiet. Als je het in minder woorden kunt zeggen: doe dat.

| Element | Maximum |
|---------|---------|
| Scenario-intro | 2 zinnen |
| Vraagstelling | 1 zin |
| Feedback bij goed antwoord | 1 zin (kern + waarom) |
| Feedback bij fout antwoord | 2 zinnen (erkenning + correctie) |
| Takeaway / tip | 1 zin per bullet |
| Ronde-introductie | 3 zinnen absolute max |

**Stelregel:** De scenario-tekst is de hoofdzaak. Uitleg mag nooit langer zijn dan het scenario zelf.

---

## 3. Feedbackregels

### Bij goed antwoord
Zeg nooit alleen "Goed gedaan!" Altijd: WAT klopt, en WAAROM.

> Goed: `'Klopt. Kijkgedrag en zoekopdrachten sturen de aanbevelingen — de rest is bijvangst.'`

> Fout: `'Goed gedaan! Dat is het juiste antwoord.'`

### Bij fout antwoord
Nooit: "Helaas, dat is niet juist." Dat leert niets en voelt neerbuigend.
Altijd: erken waarom het logisch klinkt, geef dan de kern van de correctie.

> Goed: `'Logisch dat je dat denkt, maar locatie en microfoon scoren juist het laagst. Kijk nog eens naar de balken.'`

> Fout: `'Helaas, dat is niet het juiste antwoord. Probeer het opnieuw.'`

### Feedback moet iets nieuws leren
Feedback herhaalt niet wat al in het scenario stond. Het voegt de verklaring of het principe toe.

---

## 4. Gamification-DNA

Elke missie bevat minimaal **2 van deze 4 elementen:**

1. **Competitie** — scorebord, tijdsdruk, vergelijking met anderen
2. **Directe feedback** — actie leidt onmiddellijk tot zichtbaar resultaat
3. **Keuzes met gevolgen** — een keuze verandert het verloop van het scenario
4. **Ontdekken** — leerling ontdekt iets zelf, het wordt niet uitgelegd

### Regels

- XP/score is zichtbaar en betekenisvol. Niet: "je hebt 50 XP verdiend". Wel: toon de score in context (ranglijst, voortgang, vergelijking).
- Badges voelen verdiend, niet decoratief. Een badge voor "je hebt de missie geopend" is waardeloos.
- Actie → reactie: als de leerling iets doet, ziet die direct het effect.
- Geen XP-farming: oppervlakkige interactie (doorklikken, random antwoorden) mag nooit beloond worden.

---

## 5. Anti-patronen

Concrete dingen die nooit mogen voorkomen, met voor/na.

### "In deze opdracht ga je leren over..."
Begin met de situatie, nooit met meta-uitleg over de opdracht.

> Voor: `"In deze missie ga je leren hoe phishing-aanvallen werken en hoe je ze herkent."`
> Na: `"Je inbox. Drie berichten. Eén ervan is niet wat het lijkt."`

### Generieke feedback zonder inhoud
> Voor: `"Goed gedaan!" / "Helaas, probeer opnieuw."`
> Na: `"Klopt — het slot-icoontje zegt niets over wie de site beheert."` / `"Bijna. HTTPS betekent dat de verbinding versleuteld is, niet dat de site te vertrouwen is."`

### Lange inleiding voor elke ronde
> Voor: `"In de volgende ronde ga je kennismaken met verschillende soorten wachtwoorden. Let goed op de eigenschappen van elk wachtwoord."`
> Na: `"Ronde 2. Vier wachtwoorden. Welke overleeft een aanval het langst?"`

### Uitleg die langer is dan het scenario
Als de context meer woorden gebruikt dan het scenario, draai je het om. Scenario is altijd de hoofdzaak.

### Voorgekauwd uitleggen wat de leerling moet ontdekken
> Voor: `"Bij social engineering spelen aanvallers in op emoties zoals angst en urgentie. Let hier op in het volgende scenario."`
> Na: `"Het bericht zegt dat je account binnen 24 uur wordt verwijderd. Wat doe je?"`

### Stakeholder-perspectieven die te algemeen zijn
> Voor: `"Als gebruiker vind ik privacy belangrijk."`
> Na: `"Ik merk dat ik niet kan stoppen met scrollen, zelfs als ik eigenlijk wil stoppen. Ik ga naar bed en denk: nog één video. Een uur later lig ik nog te scrollen."`

---

## 6. Voorbeeldfragmenten uit de Codebase

Echte voorbeelden die werken, met uitleg waarom.

---

### Phishing Fighter (ScenarioEngine) — directe feedback

```
feedbackCorrect: 'Scherp! Je ziet de subtiele en de opvallende signalen allebei.'
feedbackIncorrect: 'Sommige trucjes zijn moeilijk te spotten. Lees de uitleg goed — phishers worden steeds beter.'
```

Waarom het werkt: Direct. Erkent moeilijkheidsgraad zonder te betuttelen. Geen overbodige woorden.

---

### Wachtwoord Warrior (PuzzleLab) — feedback die dieper gaat

```
successMessage: 'Klopt! "abc123" wordt onmiddellijk gekraakt — het staat in elke woordenlijst die hackers gebruiken. Maar ook als het niet in een lijst stond: 6 tekens zijn bij 1 miljard pogingen per seconde in ~2 seconden uitgeput. Lengte is de belangrijkste factor.'
```

Waarom het werkt: Valideert het antwoord, voegt dan echt nieuwe informatie toe. Isoleert het kernprincipe (lengte) aan het einde.

---

### Encryption Expert (PuzzleLab) — kort en krachtig

```
successMessage: 'Goed gedaan! d2FjaHR3b29yZA== decodeert naar "wachtwoord". Base64 beschermt NIKS — gebruik het dus nooit als echte beveiliging.'
```

Waarom het werkt: Extreem kort. De kapitalen benadrukken de gotcha. Eén praktische takeaway, niet drie.

---

### Scroll Stopper (DebateArena) — herkenbaar scenario-intro

```
introDescription: 'Social media apps zijn bewust ontworpen om je zo lang mogelijk vast te houden. Infinite scroll, likes, notificaties — allemaal trucjes. Maar is dat erg? En wie mag daar iets van vinden?'
```

Waarom het werkt: Concrete voorbeelden, geen abstracte uitleg. Maakt de spanning expliciet. Eindigt met uitdagende vraag.

---

### Scroll Stopper — relatable stakeholder-perspectief

```
perspective: 'Ik merk dat ik niet kan stoppen met scrollen, zelfs als ik eigenlijk wil stoppen. Ik ga naar bed en denk: nog één video. Een uur later lig ik nog te scrollen. Het voelt niet alsof ík dat kies.'
```

Waarom het werkt: Eerste persoon. Concreet slaapscenario. Raakt aan locus of control zonder dat begrip te noemen.

---

### Website Bouwer (BuilderCanvas) — mentor-tip met metafoor

```
tip: 'Tags werken in paren: elke `<h1>` heeft een `</h1>`. Vergeet de sluit-tag niet, anders "lekt" je code.'
```

Waarom het werkt: Metafoor ("lekt") in plaats van technische taal. Voelt als iets wat een docent naast je zou zeggen.

---

### Website Bouwer — reflectie-instructie

```
tip: 'Doe alsof je het uitlegt aan een jongere broer of zus die nog nooit van HTML heeft gehoord. Simpel taalgebruik = echte begrip.'
```

Waarom het werkt: Concreet mentaal model. Stelt vereenvoudiging gelijk aan begrip — niet aan dom zijn.

---

## 7. Review-per-ronde Workflow

Claude schrijft content ronde voor ronde. Pas als een ronde goedgekeurd is, gaat het door naar de volgende.

### Stap 1 — Claude schrijft ronde 1
Eén ronde, inclusief scenario, vragen, en feedback. Nog niet verder.

### Stap 2 — Yorin scoort met dit template

```
Missie: [naam] | Ronde: [nummer]
Toon:         1-5  [opmerking]
Kortheid:     1-5  [opmerking]
Feedback:     1-5  [opmerking]
Gamification: 1-5  [opmerking]
Doorgang:     ja / nee / bijna
```

### Stap 3 — Claude past aan
Aanpassen totdat alle scores >= 4 zijn.

### Stap 4 — Door naar de volgende ronde
Pas als de huidige ronde doorgang "ja" krijgt.

---

> Onthoud: dit platform is niet een digitale les. Het is een game waar je iets van leert.
> Als het als huiswerk voelt, is het fout.
