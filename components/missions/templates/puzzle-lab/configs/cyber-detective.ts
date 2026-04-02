import type { PuzzleLabConfig } from '../puzzleLabTypes';

const config: PuzzleLabConfig = {
    missionId: 'cyber-detective',
    title: 'Cyber Detective',
    introEmoji: '🔍',
    introTitle: 'Cyber Detective',
    introDescription:
        'Een bedrijf is gehackt en hun klantendata is op het dark web opgedoken. Jij bent ingeschakeld als digitaal forensisch onderzoeker. Analyseer de logbestanden, identificeer de aanvalsmethode en stel een forensisch rapport op.',
    introFeatures: [
        'Analyseer serverlogbestanden en identificeer verdachte patronen',
        'Herken verschillende soorten cyberaanvallen',
        'Begrijp hoe digitaal bewijs wordt verzameld',
        'Stel een forensisch rapport op met tijdlijn en aanbevelingen',
    ],
    maxScore: 100,
    puzzles: [
        {
            id: 'loganalyse',
            title: 'Analyseer de serverlogboeken',
            type: 'multiple-choice',
            description:
                'Je hebt toegang tot de serverlogboeken van het gehackte bedrijf. Bekijk de volgende regels:\n\n```\n2024-01-22 02:47:13 | IP: 185.234.xx.xx | LOGIN FAILED | user: admin\n2024-01-22 02:47:15 | IP: 185.234.xx.xx | LOGIN FAILED | user: admin\n2024-01-22 02:47:17 | IP: 185.234.xx.xx | LOGIN FAILED | user: admin\n2024-01-22 02:47:31 | IP: 185.234.xx.xx | LOGIN SUCCESS | user: admin\n2024-01-22 02:48:02 | IP: 185.234.xx.xx | DOWNLOAD | bestand: klanten_export.csv\n```\n\nWat voor type aanval zie je hier?',
            clues: [
                'Let op het tijdstip: de aanval vond plaats om 02:47 — midden in de nacht.',
                'Hetzelfde IP-adres probeert meerdere keren in te loggen in korte tijd.',
                'Na meerdere mislukte pogingen lukt het uiteindelijk wél.',
            ],
            extraClues: [
                'Bij een brute-force aanval probeert een computer automatisch duizenden wachtwoorden per minuut tot het juiste gevonden is.',
                'De aanvaller downloadde de klantendatabase direct nadat hij toegang had — dat was zijn doel.',
            ],
            revealExtraAfterAttempts: 2,
            options: [
                'Phishing — de aanvaller stuurde een nep-e-mail',
                'Brute force — het wachtwoord werd geraden door veel te proberen',
                'SQL-injectie — de database werd aangevallen via een formulier',
                'Social engineering — iemand werd overgehaald het wachtwoord te geven',
            ],
            answer: 'Brute force — het wachtwoord werd geraden door veel te proberen',
            caseSensitive: false,
            maxAttempts: 3,
            points: 25,
            successMessage:
                'Correct! Dit is een brute-force aanval. Hetzelfde IP-adres probeerde het wachtwoord van admin automatisch in hoog tempo — tot het raak was. Dit soort aanval is te herkennen aan veel mislukte inlogpogingen in korte tijd, vanaf hetzelfde IP.',
            hintCost: 4,
        },
        {
            id: 'bewijsketen',
            title: 'Welk spoor is geldig bewijs?',
            type: 'multiple-choice',
            description:
                'Na de inbraak moet de forensisch analist het bewijs veiligstellen. Maar digitaal bewijs is kwetsbaar — het moet op de juiste manier worden opgeslagen, anders is het onbruikbaar voor de rechtbank.\n\nWelke actie is CORRECT voor het veiligstellen van digitaal bewijs?',
            clues: [
                'Digitaal bewijs moet onveranderd blijven — elke wijziging maakt het onbruikbaar voor justitie.',
                'Een "forensische kopie" is een exacte kopie van de originele schijf — bit voor bit.',
                'Originele systemen worden niet gebruikt voor onderzoek — je werkt altijd op een kopie.',
            ],
            extraClues: [
                'De bewijsketen ("chain of custody") houdt bij wie het bewijs heeft aangeraakt en wanneer.',
                'Een hash-waarde (zoals MD5 of SHA-256) bewijst dat een bestand niet is gewijzigd na het kopiëren.',
            ],
            revealExtraAfterAttempts: 2,
            options: [
                'Direct inloggen op de gehackte server en de logbestanden bekijken',
                'De logbestanden kopiëren naar een USB-stick en de originelen verwijderen',
                'Een forensische kopie maken van de server en de hash-waarde vastleggen',
                'De server uitzetten zodat de aanvaller geen toegang meer heeft',
            ],
            answer: 'Een forensische kopie maken van de server en de hash-waarde vastleggen',
            caseSensitive: false,
            maxAttempts: 3,
            points: 25,
            successMessage:
                'Juist! Een forensische kopie bewaard de data ongewijzigd, en de hash-waarde bewijst later dat er niets is aangepast. Zo is het bewijs geldig voor de rechtbank. Direct werken op het origineel of bestanden verwijderen vernietigt bewijs.',
            hintCost: 4,
        },
        {
            id: 'aanvalsmethoden',
            title: 'Herken de aanvalsmethode',
            type: 'multiple-choice',
            description:
                'Naast brute force zijn er meer aanvalsmethoden. Lees het volgende e-mailbericht dat een medewerker ontving:\n\n---\n**Van:** it-support@bedrijff.nl\n**Onderwerp:** Dringende actie vereist — reset uw wachtwoord\n\n*"Geachte medewerker, uw account loopt risico. Klik hier om uw wachtwoord te resetten: http://bedrijff.nl/reset"*\n\n---\n\nWat voor aanval is dit?',
            clues: [
                'Let op het e-mailadres: "bedrijff.nl" — het echte bedrijf heet "bedrijf.nl".',
                'De e-mail creëert urgentie: "dringend", "risico" — dit is een klassieke manipulatietechniek.',
                'De link gaat naar een nepwebsite die lijkt op de echte.',
            ],
            extraClues: [
                'Bij phishing doet de aanvaller alsof hij een betrouwbare partij is (IT-afdeling, bank, overheid) om inloggegevens te stelen.',
                'Het verschil met brute force: phishing manipuleert MENSEN, brute force aanvalt het systeem direct.',
            ],
            revealExtraAfterAttempts: 2,
            options: [
                'Brute force — het wachtwoord wordt automatisch geraden',
                'Malware — er wordt schadelijke software geïnstalleerd',
                'Phishing — de aanvaller doet zich voor als een betrouwbare partij',
                'DDoS — de server wordt overspoeld met verzoeken',
            ],
            answer: 'Phishing — de aanvaller doet zich voor als een betrouwbare partij',
            caseSensitive: false,
            maxAttempts: 3,
            points: 25,
            successMessage:
                'Goed gezien! Dit is phishing. Kenmerken: een nep-domeinnaam (bedrijff.nl), urgentietaal en een verdachte link. Phishing is verantwoordelijk voor meer dan 80% van alle succesvolle cyberaanvallen — het aanvallen van mensen is makkelijker dan het aanvallen van systemen.',
            hintCost: 4,
        },
        {
            id: 'rapport-tijdlijn',
            title: 'Zet de tijdlijn in de juiste volgorde',
            type: 'text-input',
            description:
                'Voor het forensisch rapport moet je de tijdlijn van de aanval reconstrueren. Hieronder staan 4 gebeurtenissen door elkaar. Geef de juiste volgorde door de nummers in te typen (bijv: 2-4-1-3).\n\n1. Aanvaller downloadt klantendatabase\n2. Aanvaller start brute-force aanval op adminaccount\n3. Klantdata verschijnt op het dark web\n4. Aanvaller logt succesvol in na 28 mislukte pogingen',
            clues: [
                'Eerst moet je toegang proberen te krijgen voordat je iets kunt doen.',
                'Je kunt pas data stelen nadat je bent ingelogd.',
                'Data op het dark web is het eindresultaat — dat gebeurt na de diefstal.',
            ],
            extraClues: [
                'De logische volgorde is: aanval starten → toegang verkrijgen → stelen → verkopen/publiceren.',
            ],
            revealExtraAfterAttempts: 2,
            answer: ['2-4-1-3'],
            caseSensitive: false,
            maxAttempts: 5,
            points: 25,
            successMessage:
                'Correct! De tijdlijn: (2) brute-force gestart → (4) succesvol ingelogd → (1) database gedownload → (3) data op dark web. Dit is de aanvalsketen die je in een forensisch rapport vastlegt. Een goede tijdlijn helpt bedrijven en politie begrijpen wat er is gebeurd.',
            hintCost: 3,
        },
    ],
    badges: [
        {
            minScore: 90,
            emoji: '🏆',
            title: 'Hoofd Forensisch Analist',
            color: '#F59E0B',
        },
        {
            minScore: 70,
            emoji: '🔍',
            title: 'Senior Cyber Detective',
            color: '#6B7280',
        },
        {
            minScore: 40,
            emoji: '🕵️',
            title: 'Junior Onderzoeker',
            color: '#10B981',
        },
        {
            minScore: 0,
            emoji: '📋',
            title: 'Stagiair Forensics',
            color: '#3B82F6',
        },
    ],
    takeaways: [
        'Brute-force aanvallen zijn te herkennen aan veel mislukte inlogpogingen in korte tijd — automatische vergrendeling na X pogingen helpt dit stoppen.',
        'Digitaal bewijs moet onveranderd blijven: werk altijd op forensische kopieën en leg hash-waarden vast om manipulatie aan te tonen.',
        'Phishing is de meest voorkomende aanvalsmethode — aanvallers manipuleren mensen omdat dat makkelijker is dan systemen hacken.',
        'Een forensische tijdlijn laat zien hoe een aanval stap voor stap verliep — dit helpt bedrijven, politie en rechtbanken.',
        'Elk digitaal incident laat sporen na in logbestanden: tijdstippen, IP-adressen en acties zijn de vingerafdrukken van een aanval.',
    ],
};

export default config;
