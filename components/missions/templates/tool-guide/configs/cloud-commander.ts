import type { ToolGuideConfig } from '../ToolGuide';

export const cloudCommanderConfig: ToolGuideConfig = {
    missionId: 'cloud-commander',
    title: 'Cloud Commander',
    introEmoji: '☁️',
    introTitle: 'Cloud Commander',
    introDescription:
        'Je iPad kapot, thuis vergeten, of gewoon een ander apparaat nodig — je bestanden zijn er gewoon, op elk scherm. Dat is wat de cloud doet.',
    introFeatures: [
        'Inloggen met het juiste account — zodat het jóuw cloud is',
        'Bestanden organiseren voordat de chaos begint',
        'Iets uploaden en zien dat het meteen beschikbaar is',
        'Werk delen zonder bijlagen, zonder gedoe',
    ],
    toolName: 'OneDrive',
    toolIcon: '☁️',
    steps: [
        {
            id: 'stap-1-openen',
            title: 'OneDrive openen',
            instruction:
                'Open de **OneDrive**-app op je iPad. Je vindt hem op het beginscherm of in de App Library. Log in met je **schoolaccount** (je e-mailadres dat op school @leerling.schoolnaam.nl eindigt). Als je dat nog niet weet, vraag dan je docent.',
            tip: 'Gebruik altijd je schoolaccount — niet je persoonlijke Gmail of iCloud. Zo weet je zeker dat je bestanden veilig staan en de school toegang heeft als dat nodig is.',
            checklistItems: [
                { id: 'app-gevonden', label: 'Ik heb de OneDrive-app gevonden op mijn iPad' },
                { id: 'ingelogd', label: 'Ik ben ingelogd met mijn schoolaccount' },
            ],
        },
        {
            id: 'stap-2-map',
            title: 'Map aanmaken',
            instruction:
                'Maak een nieuwe map aan in OneDrive. Tik op het **+-icoon** (rechtsboven of rechtsonder) en kies **Map aanmaken**. Geef de map de naam **"School"**. Let op: gebruik precies die naam — hoofdletter S, geen spaties ervoor of erna.',
            tip: 'Een goede mappenstructuur spaart je later veel zoekwerk. Maak later ook submappen aan per vak, zoals "School/Nederlands" of "School/Wiskunde".',
            checklistItems: [
                { id: 'map-aangemaakt', label: 'Ik heb een nieuwe map aangemaakt' },
                { id: 'naam-correct', label: 'De map heet precies "School"' },
            ],
            verificationQuestion: {
                question: 'Waar worden je bestanden opgeslagen als je ze uploadt naar OneDrive?',
                options: [
                    'Op mijn iPad, zodat ik ze altijd bij me heb',
                    'In de cloud, op servers van Microsoft',
                    'Op de printer van school',
                ],
                correctIndex: 1,
                explanation:
                    'Juist! OneDrive slaat je bestanden op in de cloud — dat zijn servers van Microsoft. Daardoor kun je ze op elk apparaat openen, zolang je verbinding hebt met internet.',
            },
        },
        {
            id: 'stap-3-uploaden',
            title: 'Bestand uploaden',
            instruction:
                'Maak een **foto** met de camera-app van je iPad (of kies een bestaande foto uit je Foto\'s). Ga terug naar OneDrive, open je **School**-map en tik op het **+-icoon**. Kies **Foto\'s uploaden** en selecteer de foto die je net hebt gemaakt. Wacht tot de upload klaar is — je ziet een groen vinkje als het gelukt is.',
            tip: 'Je kunt ook documenten, pdf\'s en andere bestanden uploaden. Handig voor huiswerk of opdrachten die je later wilt inleveren.',
            checklistItems: [
                { id: 'foto-gemaakt', label: 'Ik heb een foto gemaakt of gekozen' },
                { id: 'geupload', label: 'De foto staat nu in mijn School-map in OneDrive' },
            ],
        },
        {
            id: 'stap-4-delen',
            title: 'Bestand delen',
            instruction:
                'Open het bestand dat je net hebt geüpload. Tik op het **deelicoon** (een vierkantje met een pijltje omhoog) of hou je vinger op het bestand en kies **Delen**. Kies **Koppeling kopiëren** of **Persoon uitnodigen**. Als je een koppeling kopieert, stuur die dan via Teams of Magister naar een klasgenoot.',
            tip: 'Een deellink is veiliger dan je bestand als bijlage sturen. De ontvanger kan het bestand altijd bekijken met de meest recente versie — en jij bepaalt wie toegang heeft.',
            checklistItems: [
                { id: 'deellink', label: 'Ik heb een deellink aangemaakt of iemand uitgenodigd' },
                { id: 'link-verstuurd', label: 'Ik heb de link gedeeld met een klasgenoot' },
            ],
            verificationQuestion: {
                question: 'Wat is het voordeel van delen via een link in plaats van een bijlage sturen?',
                options: [
                    'Een link is sneller te typen dan een e-mailadres',
                    'De ontvanger ziet altijd de nieuwste versie van het bestand',
                    'Je hebt geen internet nodig om een link te sturen',
                ],
                correctIndex: 1,
                explanation:
                    'Klopt — als je iets aanpast na het versturen, ziet de ontvanger via de link automatisch de nieuwste versie. Een bijlage is altijd een momentopname.',
            },
        },
    ],
    maxScore: 60,
    badges: [
        {
            minScore: 55,
            emoji: '🏆',
            title: 'Cloud Expert',
            color: '#D97757',
        },
        {
            minScore: 40,
            emoji: '☁️',
            title: 'Cloud Commander',
            color: '#3B82F6',
        },
        {
            minScore: 0,
            emoji: '🌱',
            title: 'Aan de slag',
            color: '#10B981',
        },
    ],
    takeaways: [
        'De cloud betekent: je bestanden zitten niet op jouw iPad maar op servers van Microsoft.',
        'Een goede mappenstructuur aanleggen nu spaart je tien minuten zoeken later.',
        'Uploaden duurt een paar seconden — en dan is het op elk apparaat beschikbaar.',
        'Een deellink is slimmer dan een bijlage: de ontvanger ziet altijd de nieuwste versie.',
        'Je privéaccount en je schoolaccount zijn gescheiden — houd dat zo.',
    ],
};
