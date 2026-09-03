# Speelronde J3P2 — 6 missies, 19-20 augustus 2026

Voor elke missie zijn 3-4 gesimuleerde leerlingprofielen in de interne browser gedraaid: een eerlijke leerling, een gokker/sjoemelaar, een struggler en, waar beschikbaar, een tablet/telefoon-run. Daarna is alles tegengelezen. Hoofdbeeld: alle zes missies krijgen het advies “eerst repareren” en risico Rood; elke missie bevat minstens één blokkerend probleem. De belangrijkste oorzaak is een gedeelde motorfout: onder de 40%-drempel belandt de leerling op een dood eindscherm zonder uitweg. Verder beloont de puzzle-lab-motor gokken en verklappen sommige aanwijzingen het antwoord. De review-arena-scoring is onbetrouwbaar bij herladen. Noot vooraf: iPad/mobiel is voor de meeste missies niet gemeten; de geautomatiseerde browsermetingen zijn halverwege gestopt op verzoek van Yorin omdat het venster de focus stal. Alleen cyber-detective en encryption-expert hebben nog een volledige tablet/telefoon-meting.

| Missie | Motor | Advies | Risico | Bevestigde blokkers/majors/minors |
|---|---|---|---|---|
| cyber-detective | puzzle-lab | Eerst repareren | Rood | 1 blokker, 3 majors, 2 minors |
| encryption-expert | puzzle-lab | Eerst repareren | Rood | 1 blokker, 5 majors, 2 minors |
| phishing-fighter | scenario-engine | Eerst repareren | Rood | 1 blokker, 1 major, 2 minors |
| security-auditor | puzzle-lab | Eerst repareren | Rood | 1 blokker, 6 majors, 3 minors |
| digital-forensics | scenario-engine | Eerst repareren | Rood | 1 blokker, 0 majors, 2 minors |
| security-review | review-arena | Eerst repareren | Rood | 1 blokker, 1 major, 3 minors |

In de tabel: een blokker is een blokkerend probleem, een major is groot, een minor is klein.

## Gedeelde motorproblemen (één reparatie helpt veel missies)

- **Dood eindscherm onder de 40%-drempel** — in alle zes J3P2-missies live bevestigd. De enige knop is uitgeschakeld, er is geen terug- of herkansknop, en herladen zet de leerling op hetzelfde scherm terug. De docent ziet de mislukte poging nooit. Zelfde motorfout als in J3P1; één reparatie in de gedeelde eindscherm-laag dekt vrijwel het hele platform.
- **Puzzle-lab beloont gokken** — foute pogingen kosten geen punten, gratis extra aanwijzingen na fouten verklappen antwoorden bijna letterlijk terwijl de betaalde hint blijft staan, overslaan kan vanaf het begin, en open vragen keuren alleen trefwoorden + lengte. Missie-eigen verklappers: cyber-detective’s voorbeeld is het antwoord; encryption-expert’s aanwijzing spelt “VEILIG” letter voor letter en de wachtwoordcheck accepteert “Aaaaaaaaaaa1!”; security-auditor’s aanwijzing bij puzzel 1 verklapt het antwoord van puzzel 4.
- **Review-arena match-pairs-bank** — in security-review bevestigd: één bewuste foute koppeling + herladen legt de ronde vast op 20/25 zonder één koppel te maken. Omgekeerd houdt een leerling die eerst misklikt en daarna alles goed doet 0/25 over. Ook zegt de tekst “Acht vragen” bij 10 vragen en is er een technische waarschuwing opgetreden.
- **Scenario-engine is juist gok-bestendig** — phishing-fighter en digital-forensics: alles-aanvinken en overal-hetzelfde geven 0 punten. Zwakke punten zijn didactisch: onduidelijk rangschikcriterium, één misklik halveert een ronde, en bij phishing-fighter is er een mogelijk herlaad-probleem op de verdiepingsvraag (onbevestigd; de geautomatiseerde verificatie vervalt).

## Aanbevolen volgorde van repareren

1. **Repareer het dode eindscherm in de gedeelde laag.** Dit helpt alle zes missies: cyber-detective, encryption-expert, phishing-fighter, security-auditor, digital-forensics en security-review.
2. **Repareer de match-pairs-scoring van de review-arena.** Dit helpt security-review; een leerling raakt anders na herladen ten onrechte punten kwijt.
3. **Repareer de puzzle-lab-gokprikkels en missie-eigen verklappers.** Dit helpt cyber-detective, encryption-expert en security-auditor.
4. **Kleine tekstfixes, zoals “Acht vragen” in de review-arena.** Dit helpt security-review, waar de rondetekst “Acht snelle vragen” zegt terwijl er 10 vragen zijn.

## Correcties uit de tegenlezing (20 aug)
De onafhankelijke tegenlezing bevestigt 30 van de 36 dragende claims, waaronder het dode eindscherm (dat volgens de code óók in de echte app geldt, niet alleen in de testomgeving). Twee claims zijn afgezwakt: bij phishing-fighter en security-review kan een leerling die slim sjoemelt (de koppelronde-truc combineren met gokgeluk) nét boven de 40%-grens komen (41/100) — "sjoemelen loont niet" is daar dus te sterk geformuleerd. Bij encryption-expert klopte één detail niet: het geaccepteerde zwakke wachtwoord bevatte naast de herhaalde letters ook een cijfer en een symbool; de kern (de controle kijkt niet naar herkenbare woorden of patronen) blijft staan.
