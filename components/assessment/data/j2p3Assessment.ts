
import { AssessmentTask, AssessmentConfig } from '../types';

export const J2P3_CONFIG: AssessmentConfig = {
    title: 'De Mediamakerij',
    description: 'Laat zien dat je digitale media kunt maken, beoordelen en verantwoord kunt delen!',
    introIcon: '🎬',
    themeColor: 'pink',
    introText: 'De school wil een gloednieuwe app en social media-campagne lanceren, maar het ontwerp zit vol fouten, het creatieve proces is een chaos en iemand heeft auteursrecht geschonden. Jij bent de Creatief Directeur die alles moet rechtzetten!',
    hybridAssessment: {
        autoWeight: 0.6,
        teacherWeight: 0.4,
        teacherChecklist: [
            { id: 'ux-awareness', label: 'Leerling kan UX-problemen herkennen en verbeteringen voorstellen.', required: true },
            { id: 'design-process', label: 'Leerling begrijpt de stappen van het design thinking proces.', required: true },
            { id: 'media-creatie', label: 'Leerling kan digitale media (beeld, video, audio) doelgericht inzetten.', required: true },
            { id: 'auteursrecht', label: 'Leerling kent de basisregels van auteursrecht en bronvermelding.' }
        ],
        teacherInstructions: 'Beoordeel of de leerling bewust omgaat met UX-design, het creatieve proces begrijpt en verantwoord omgaat met auteursrecht bij digitale media.'
    }
};

export const J2P3_ASSESSMENT: AssessmentTask[] = [
    // ─────────────────────────────────────────────────────────
    // MISSION 1: UX Detective
    // ─────────────────────────────────────────────────────────
    {
        id: 'j2p3-ux-detective',
        type: 'inspector',
        title: 'UX Detective',
        description: 'De nieuwe school-app heeft slechte reviews gekregen. Gebruikers klagen over het ontwerp. Vind de UX-problemen!',
        xpReward: 90,
        question: 'Bekijk dit scherm van de school-app. Welke UX-problemen kun je vinden?',
        image: 'SPECIAL:MOBILE_APP_UX_PROBLEMS',
        hotspots: [
            {
                id: 'tiny-button',
                x: 70, y: 80, width: 20, height: 8,
                label: 'Te kleine knop',
                correct: true,
                feedback: 'Goed gevonden! Deze knop is veel te klein om op een touchscreen te tikken. Knoppen moeten minimaal 44x44 pixels zijn volgens de richtlijnen voor mobiel design. Gebruikers met grotere vingers kunnen hier onmogelijk op tikken.'
            },
            {
                id: 'no-contrast',
                x: 10, y: 30, width: 80, height: 15,
                label: 'Lichtgrijze tekst op witte achtergrond',
                correct: true,
                feedback: 'Goed gezien! De lichtgrijze tekst op de witte achtergrond heeft te weinig contrast. Dit maakt het moeilijk leesbaar, vooral voor mensen met een visuele beperking. WCAG-richtlijnen vereisen een contrastratio van minimaal 4.5:1.'
            },
            {
                id: 'no-back-button',
                x: 0, y: 0, width: 15, height: 10,
                label: 'Geen terugknop',
                correct: true,
                feedback: 'Scherp opgemerkt! Er is geen terugknop of navigatie zichtbaar. Gebruikers kunnen niet terug naar het vorige scherm. Goede navigatie is essentieel voor een gebruiksvriendelijke app.'
            },
            {
                id: 'logo',
                x: 30, y: 2, width: 40, height: 8,
                label: 'Logo bovenaan',
                correct: false,
                feedback: 'Het logo is prima geplaatst. Dit is een standaard positie voor het logo in een app. Zoek naar problemen die de bruikbaarheid belemmeren.'
            }
        ]
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 2: Design Thinking Meester
    // ─────────────────────────────────────────────────────────
    {
        id: 'j2p3-design-thinking',
        type: 'rescuer',
        title: 'Design Thinking Meester',
        description: 'Het ontwerpteam werkt chaotisch. Zet de stappen van het design thinking proces in de juiste volgorde!',
        xpReward: 80,
        npcName: 'Projectleider',
        scenario: 'We willen een app maken voor leerlingen, maar het team doet alles door elkaar. De ene collega is al aan het bouwen terwijl de andere nog niet eens weet wat het probleem is. Wat is de juiste volgorde van het design thinking proces?',
        availableSteps: [
            { id: 'step-empathize', text: 'Inleven: Interview gebruikers en begrijp hun behoeften en frustraties.' },
            { id: 'step-define', text: 'Definiëren: Formuleer het kernprobleem dat je gaat oplossen.' },
            { id: 'step-ideate', text: 'Ideeën bedenken: Brainstorm zoveel mogelijk oplossingen zonder te oordelen.' },
            { id: 'step-prototype', text: 'Prototype maken: Bouw een snelle, eenvoudige versie van je beste idee.' },
            { id: 'step-test', text: 'Testen: Laat gebruikers je prototype uitproberen en verzamel feedback.' },
            { id: 'step-wrong-1', text: 'Meteen beginnen met bouwen zonder plan.' },
            { id: 'step-wrong-2', text: 'Alleen je eigen mening gebruiken in plaats van gebruikers te vragen.' }
        ],
        correctSequence: ['step-empathize', 'step-define', 'step-ideate', 'step-prototype', 'step-test']
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 3: Auteursrecht Spotter
    // ─────────────────────────────────────────────────────────
    {
        id: 'j2p3-copyright-spotter',
        type: 'inspector',
        title: 'Auteursrecht Spotter',
        description: 'Een leerling heeft een social media post gemaakt voor het schoolproject. Maar er is iets mis met het auteursrecht...',
        xpReward: 80,
        question: 'Bekijk deze social media post. Wat is er mis met het auteursrecht?',
        image: 'SPECIAL:SOCIAL_MEDIA_COPYRIGHT',
        hotspots: [
            {
                id: 'stolen-photo',
                x: 5, y: 15, width: 90, height: 55,
                label: 'Foto zonder bronvermelding',
                correct: true,
                feedback: 'Goed gevonden! De foto is van een professionele fotograaf en wordt zonder toestemming of bronvermelding gebruikt. Dit is een auteursrechtschending. Je mag niet zomaar andermans foto\'s gebruiken, zelfs niet voor schoolprojecten op social media. Gebruik licentievrije foto\'s of vraag toestemming en vermeld altijd de bron.'
            },
            {
                id: 'hashtags',
                x: 10, y: 80, width: 80, height: 10,
                label: 'Hashtags onderaan',
                correct: false,
                feedback: 'Hashtags gebruiken is normaal op social media en heeft niets met auteursrecht te maken. Kijk naar de afbeelding die gebruikt wordt.'
            },
            {
                id: 'post-text',
                x: 10, y: 72, width: 80, height: 8,
                label: 'De tekst van de post',
                correct: false,
                feedback: 'De tekst zelf is origineel geschreven en vormt geen probleem. Het auteursrechtprobleem zit bij het beeldmateriaal.'
            }
        ]
    }
];
