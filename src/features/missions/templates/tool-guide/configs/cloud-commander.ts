import type { ToolGuideConfig } from '../ToolGuide';

export const cloudCommanderConfig: ToolGuideConfig = {
    missionId: 'cloud-commander',
    title: 'Cloud Commander',
    introEmoji: '☁️',
    introTitle: 'Cloud Commander',
    introDescription:
        'Leer werken met OneDrive op je school-iPad. Je slaat je bestanden op in de cloud, maakt mappen aan en deelt je werk met klasgenoten — zonder USB-stick of e-mail.',
    introFeatures: [
        'OneDrive openen en inloggen met je schoolaccount',
        'Een map aanmaken voor je schoolwerk',
        'Een bestand uploaden naar de cloud',
        'Je bestand veilig delen met een klasgenoot',
    ],
    toolName: 'OneDrive',
    toolIcon: '☁️',
    steps: [
        {
            id: 'stap-1-openen',
            title: 'OneDrive openen',
            instruction:
                'Open de **OneDrive**-app op je iPad. Je vindt hem op het beginscherm of in de **App Library** (de app-overzichtsmap op je iPad). Log in met je **schoolaccount** (je e-mailadres dat op school @leerling.schoolnaam.nl eindigt). Als je dat nog niet weet, vraag dan je docent.',
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
                'Maak een nieuwe map aan in OneDrive. Tik op het **+-icoon** rechtsonder in de navigatiebalk. Zie je het niet? Kijk dan rechtsboven in de toolbar. Kies **Map aanmaken**. Geef de map de naam **"School"**. Let op: gebruik precies die naam — hoofdletter S, geen spaties ervoor of erna.',
            tip: 'Een goede mappenstructuur spaart je later veel zoekwerk. Maak later ook submappen aan per vak, zoals "School/Nederlands" of "School/Wiskunde".',
            checklistItems: [
                { id: 'map-aangemaakt', label: 'Ik heb een nieuwe map aangemaakt' },
                { id: 'naam-correct', label: 'De map heet precies "School"' },
            ],
            verificationQuestion: {
                question:
                    'Je hebt net de map School op je school-iPad gemaakt en daarin een verslag. Thuis heb je die iPad niet bij je, maar je wilt het verslag op een schoolcomputer openen. Waar sla je het bestand op?',
                options: [
                    'Alleen op mijn iPad',
                    'In OneDrive',
                    'Op de schoolprinter',
                ],
                correctIndex: 1,
                allowRetry: true,
                retryHint:
                    'Nog niet. Denk aan de plek waar je het verslag ook kunt openen als je iPad niet bij je is. Kies daarna opnieuw.',
                explanation:
                    'Juist! OneDrive slaat je verslag op in de cloud — dat zijn servers van Microsoft. Daardoor kun je het op een ander apparaat openen, zolang je verbinding hebt met internet.',
            },
        },
        {
            id: 'stap-3-uploaden',
            title: 'Bestand uploaden',
            instruction:
                'Maak een **foto** van een object, je schrift of schoolboek — geen foto\'s van jezelf of klasgenoten. Ga terug naar OneDrive, open je **School**-map en tik op het **+-icoon**. Kies **Foto\'s uploaden** en selecteer de foto die je net hebt gemaakt. Wacht tot de upload klaar is — je ziet een groen vinkje als het gelukt is.',
            teacherCheck: 'Laat je docent zien welk soort foto je hebt geüpload en dat die in je School-map staat.',
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
                'Open het bestand en tik op **Delen** en **Koppelingsinstellingen**. Kies **Specifieke personen** (of **Personen die jij kiest**), niet Iedereen met de koppeling. Zet **Bewerken toestaan** uit als de klasgenoot alleen kijkt. Nodig één klasgenoot uit via het schoolaccount. Open daarna **Toegang beheren** en controleer de naam en het recht Bekijken.',
            teacherCheck: 'Laat je docent in Toegang beheren zien dat alleen de bedoelde klasgenoot toegang heeft en of die mag bekijken of bewerken.',
            tip: 'Een link is alleen veilig als de toegangsrechten kloppen. Geef alleen toegang aan de bedoelde persoon en kies **Bekijken**, tenzij samenwerken echt nodig is. Je kunt toegang later weer intrekken.',
            checklistItems: [
                { id: 'specifieke-personen', label: 'Ik heb "Specifieke personen" of "Personen die jij kiest" geselecteerd' },
                { id: 'rechten-gecontroleerd', label: 'Ik heb de juiste klasgenoot en het recht Bekijken of Bewerken gecontroleerd' },
            ],
            verificationQuestion: {
                question:
                    'Je wilt een foto van je schoolwerk delen met één klasgenoot. Die klasgenoot mag het bestand bekijken, maar niets wijzigen. Welke instelling kies je?',
                options: [
                    'Iedereen + bewerken',
                    'Specifieke personen + bekijken',
                    'Iedereen op internet',
                ],
                correctIndex: 1,
                allowRetry: true,
                retryHint:
                    'Nog niet. Kies de instelling waarmee alleen de bedoelde klasgenoot toegang krijgt en niets per ongeluk kan aanpassen.',
                explanation:
                    'Juist! Met Specifieke personen beperk je de toegang tot de klasgenoot die jij kiest. Met Bekijken kan diegene het bestand niet per ongeluk aanpassen.',
            },
        },
    ],
    maxScore: 50,
    badges: [
        {
            minScore: 45,
            emoji: '🏆',
            title: 'Cloud Expert',
            color: '#D97848',
        },
        {
            minScore: 30,
            emoji: '☁️',
            title: 'Cloud Commander',
            color: '#0B453F',
        },
        {
            minScore: 0,
            emoji: '🌱',
            title: 'Aan de slag',
            color: '#5F947D',
        },
    ],
    learningObjectives: [
        'De leerling herkent het verschil tussen lokale opslag en cloudopslag en benoemt één voordeel.',
        'De leerling past een mappenstructuur toe door een map aan te maken en een bestand daarin op te slaan.',
        'De leerling uploadt een bestand naar OneDrive en controleert of het uploaden is geslaagd.',
        'De leerling deelt een bestand met één specifieke ontvanger en stelt passende kijk- of bewerkrechten in.',
    ],
    takeaways: [
        'Je kunt OneDrive openen en inloggen met je schoolaccount',
        'Je snapt hoe je een map aanmaakt voor je schoolwerk',
        'Je kunt een foto of bestand uploaden naar de cloud',
        'Je weet hoe je een bestand deelt met specifieke personen en passende rechten',
        'Je begrijpt het verschil tussen opslaan op je apparaat en in de cloud',
    ],
};
