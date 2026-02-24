
import { AssessmentTask, AssessmentConfig } from '../types';

export const J3P2_CONFIG: AssessmentConfig = {
    title: 'De Cyber Vault',
    description: 'Verdedig een bedrijf tegen een cyberaanval en bewijs je cybersecurity-kennis!',
    introIcon: '🔐',
    themeColor: 'red',
    introText: 'ALARM! Het technologiebedrijf NovaTech wordt aangevallen door hackers. Phishing-mails worden verstuurd naar medewerkers, de website heeft beveiligingslekken en het incident response team weet niet wat ze moeten doen. Jij bent ingehuurd als cybersecurity-specialist. Identificeer de dreigingen, volg het juiste protocol en bescherm het bedrijf voordat gevoelige klantdata op straat komt te liggen!',
    hybridAssessment: {
        autoWeight: 0.6,
        teacherWeight: 0.4,
        teacherChecklist: [
            { id: 'threat-recognition', label: 'Leerling kan digitale dreigingen herkennen (phishing, malware, social engineering).', required: true },
            { id: 'encryption-understanding', label: 'Leerling begrijpt het basisprincipe van encryptie en waarom HTTPS belangrijk is.', required: true },
            { id: 'incident-response', label: 'Leerling kent de stappen van een incident response procedure.', required: true },
            { id: 'security-practices', label: 'Leerling kan concrete beveiligingsmaatregelen benoemen en toepassen (sterke wachtwoorden, 2FA, updates).', required: true }
        ],
        teacherInstructions: 'Docent valideert of de leerling niet alleen de dreigingen herkent, maar ook kan uitleggen HOE een aanval werkt en WAAROM bepaalde maatregelen effectief zijn. Let op of de leerling de stappen van incident response kan beredeneren. De AI-score toetst herkenning; de docentscore toetst begrip en praktische toepassing.'
    }
};

export const J3P2_ASSESSMENT: AssessmentTask[] = [
    // ─────────────────────────────────────────────────────────
    // MISSION 1: Phishing Mail Identificeren
    // ─────────────────────────────────────────────────────────
    {
        id: 'phishing-mail-1',
        type: 'inspector',
        title: 'Phishing Mail Identificeren',
        description: 'Een medewerker van NovaTech heeft een verdachte e-mail ontvangen. Vind de aanwijzingen dat het phishing is!',
        xpReward: 90,
        question: 'Bekijk deze e-mail die een medewerker heeft ontvangen. Er zijn meerdere rode vlaggen die wijzen op phishing. Klik op het meest verdachte element.',
        image: 'SPECIAL:PHISHING_EMAIL',
        hotspots: [
            {
                id: 'fake-sender',
                x: 10, y: 8, width: 60, height: 8,
                label: 'Verdacht afzenderadres',
                correct: true,
                feedback: 'Uitstekend! Het afzenderadres is "security@n0vatech-support.ru" — dit lijkt op NovaTech maar is het niet. Let op: het domein bevat een nul in plaats van een "o", en het eindigt op .ru. Echte bedrijfsmails komen altijd van het officiële domein.'
            },
            {
                id: 'urgent-language',
                x: 10, y: 35, width: 80, height: 12,
                label: 'Urgente taal en dreiging',
                correct: true,
                feedback: 'Goed gezien! De mail gebruikt paniekzaaiende taal: "URGENT: Uw account wordt binnen 24 uur vergrendeld!" Phishing-mails creëren altijd urgentie zodat je niet nadenkt voordat je klikt.'
            },
            {
                id: 'fake-link',
                x: 20, y: 65, width: 55, height: 10,
                label: 'Nep-link naar valse website',
                correct: true,
                feedback: 'Scherp! De link toont "https://novatech.com/verify" maar als je eroverheen hovert, zie je dat de echte URL "http://n0vatech-phish.xyz/steal" is. Controleer ALTIJD de werkelijke URL voordat je ergens op klikt.'
            },
            {
                id: 'logo-area',
                x: 10, y: 15, width: 20, height: 15,
                label: 'Bedrijfslogo',
                correct: false,
                feedback: 'Het logo ziet er op het eerste gezicht echt uit, maar phishers kopiëren logo\'s makkelijk. De echte rode vlaggen zitten in het afzenderadres, de urgente taal en de verdachte link.'
            }
        ]
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 2: Incident Response Protocol
    // ─────────────────────────────────────────────────────────
    {
        id: 'incident-response-1',
        type: 'rescuer',
        title: 'Incident Response Protocol',
        description: 'NovaTech is gehackt! Volg het incident response protocol in de juiste volgorde.',
        xpReward: 100,
        npcName: 'CISO Martinez',
        scenario: 'De hack is bevestigd: aanvallers hebben toegang tot het klantenbestand van NovaTech. Er is geen tijd te verliezen! Als Chief Information Security Officer heb ik jou nodig om het incident response protocol correct uit te voeren. Eén fout en de schade wordt onherstelbaar. Zet de stappen in de juiste volgorde!',
        availableSteps: [
            { id: 'step-detect', text: 'Detecteren: bevestig de aanval door logs te analyseren en de omvang vast te stellen.' },
            { id: 'step-contain', text: 'Inperken: isoleer de getroffen systemen van het netwerk om verdere verspreiding te voorkomen.' },
            { id: 'step-eradicate', text: 'Elimineren: verwijder de malware, sluit de kwetsbaarheid en reset gecompromitteerde accounts.' },
            { id: 'step-recover', text: 'Herstellen: breng systemen weer online vanaf schone back-ups en monitor op nieuwe activiteit.' },
            { id: 'step-lessons', text: 'Evalueren: documenteer het incident, analyseer wat er misging en verbeter het beveiligingsbeleid.' },
            { id: 'step-wrong-1', text: 'De servers direct uitzetten en alles wissen zonder bewijs te bewaren.' },
            { id: 'step-wrong-2', text: 'Het incident negeren en hopen dat de hackers vanzelf weggaan.' }
        ],
        correctSequence: ['step-detect', 'step-contain', 'step-eradicate', 'step-recover', 'step-lessons']
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 3: Website Beveiligingslek
    // ─────────────────────────────────────────────────────────
    {
        id: 'website-lek-1',
        type: 'inspector',
        title: 'Website Beveiligingslek',
        description: 'De website van NovaTech heeft ernstige beveiligingslekken. Vind de kwetsbaarheden in het inlogformulier!',
        xpReward: 110,
        question: 'Bekijk dit inlogformulier van de NovaTech-website. Er zitten meerdere beveiligingsproblemen in. Klik op de meest kritieke kwetsbaarheid.',
        image: 'SPECIAL:WEBSITE_SECURITY_FORM',
        hotspots: [
            {
                id: 'sql-injection',
                x: 15, y: 35, width: 65, height: 12,
                label: 'SQL-injectie kwetsbaarheid',
                correct: true,
                feedback: 'Uitstekend gevonden! Het invoerveld accepteert direct SQL-code zoals "\' OR 1=1 --". Dit betekent dat een aanvaller de database kan uitlezen of manipuleren. Invoer moet ALTIJD worden gevalideerd en geparametriseerd om SQL-injectie te voorkomen.'
            },
            {
                id: 'no-https',
                x: 10, y: 3, width: 75, height: 8,
                label: 'Geen HTTPS-verbinding',
                correct: true,
                feedback: 'Goed gezien! De URL begint met "http://" in plaats van "https://". Dat betekent dat wachtwoorden onversleuteld over het netwerk worden verstuurd. Iedereen op hetzelfde netwerk kan meelezen. Een inlogpagina moet ALTIJD HTTPS gebruiken.'
            },
            {
                id: 'visible-password',
                x: 15, y: 52, width: 65, height: 12,
                label: 'Wachtwoord zichtbaar als platte tekst',
                correct: true,
                feedback: 'Scherp opgemerkt! Het wachtwoordveld toont de tekst in platte tekst (type="text" in plaats van type="password"). Iedereen die meekijkt kan het wachtwoord lezen. Het veld moet gemaskeerd zijn met sterretjes of puntjes.'
            },
            {
                id: 'submit-button',
                x: 25, y: 72, width: 45, height: 10,
                label: 'Inlogknop',
                correct: false,
                feedback: 'De knop zelf is niet het probleem. De kwetsbaarheden zitten in hoe de data wordt verzonden (geen HTTPS), hoe invoer wordt verwerkt (SQL-injectie) en hoe het wachtwoord wordt getoond (platte tekst).'
            }
        ]
    }
];
