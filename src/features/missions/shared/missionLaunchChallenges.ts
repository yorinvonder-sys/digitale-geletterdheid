export interface MissionLaunchChallengeOption {
    id: string;
    label: string;
    description: string;
    feedback: string;
    starterPrompt?: string;
}

export interface MissionLaunchChallenge {
    title: string;
    scenario: string;
    prompt: string;
    options: MissionLaunchChallengeOption[];
}

const MISSION_LAUNCH_CHALLENGES: Record<string, MissionLaunchChallenge> = {
    'prompt-master': {
        title: 'Prompt rescue',
        scenario: 'Een klasgenoot krijgt steeds saaie AI-antwoorden omdat de opdracht te vaag is.',
        prompt: 'Welke eerste zet maakt de prompt direct sterker?',
        options: [
            {
                id: 'doel',
                label: 'Doel scherpzetten',
                description: 'Vertel eerst precies wat de AI moet maken of uitleggen.',
                feedback: 'Sterk begin: een duidelijk doel voorkomt dat AI zomaar alle kanten opgaat.',
                starterPrompt: 'Ik wil een betere prompt maken. Help me eerst het doel van mijn opdracht scherp te formuleren.'
            },
            {
                id: 'context',
                label: 'Context toevoegen',
                description: 'Leg uit voor wie het antwoord is en waar het over gaat.',
                feedback: 'Slim: context maakt een prompt bruikbaar voor jouw situatie in plaats van algemeen.',
                starterPrompt: 'Help me context toevoegen aan mijn prompt: voor wie is het antwoord en wat moet de AI weten?'
            },
            {
                id: 'eisen',
                label: 'Eisen testen',
                description: 'Vraag om lengte, stijl, voorbeelden of stappen.',
                feedback: 'Goede kwaliteitszet: eisen maken het resultaat controleerbaar en makkelijker te verbeteren.',
                starterPrompt: 'Help me duidelijke eisen toevoegen aan mijn prompt, zoals lengte, stijl en voorbeelden.'
            }
        ]
    },
    'game-programmeur': {
        title: 'First mod',
        scenario: 'Je spel voelt nog standaard. Kies de eerste aanpassing die een speler meteen merkt.',
        prompt: 'Welke mod test je als eerste?',
        options: [
            {
                id: 'kleur',
                label: 'Kleur verandert',
                description: 'Laat de speler direct zien dat de code reageert.',
                feedback: 'Sterke start: kleur is snel te controleren en maakt variabelen zichtbaar.',
                starterPrompt: 'Maak de speler groen en leg kort uit welke variabele ik aanpas.'
            },
            {
                id: 'snelheid',
                label: 'Sneller bewegen',
                description: 'Voel meteen of de besturing beter of te moeilijk wordt.',
                feedback: 'Mooi experiment: snelheid dwingt je om te testen wat speelbaar blijft.',
                starterPrompt: 'Verhoog de snelheid van de speler een beetje en leg uit waar ik dat in de code zie.'
            },
            {
                id: 'grootte',
                label: 'Formaat tweaken',
                description: 'Maak het speelobject groter of kleiner en vergelijk het effect.',
                feedback: 'Goede ontwerpkeuze: grootte verandert zowel uiterlijk als moeilijkheid.',
                starterPrompt: 'Maak het speelobject groter en leg uit welk getal ik daarvoor verander.'
            }
        ]
    },
    'ai-trainer': {
        title: 'Label sprint',
        scenario: 'Het model leert pas iets als jouw voorbeelden scherp genoeg zijn.',
        prompt: 'Met welk voorbeeld train je het model het slimst?',
        options: [
            {
                id: 'duidelijk',
                label: 'Duidelijk voorbeeld',
                description: 'Een plastic flesje met het label Plastic.',
                feedback: 'Precies: een herkenbaar voorbeeld helpt het model de categorie snel vinden.',
                starterPrompt: 'Een plastic flesje hoort bij Plastic. Waarom is dit een duidelijk trainingsvoorbeeld?'
            },
            {
                id: 'twijfel',
                label: 'Twijfelgeval',
                description: 'Een drinkpak met plastic dop en kartonnen buitenkant.',
                feedback: 'Interessant: twijfelgevallen zijn nuttig zodra het model de basis al kent.',
                starterPrompt: 'Een drinkpak is een twijfelgeval. Welke kenmerken moet ik noemen om het goed te labelen?'
            },
            {
                id: 'fout',
                label: 'Bewuste fout',
                description: 'Een bananenschil met het label Plastic.',
                feedback: 'Handig als test, maar niet als eerste training: foute labels maken het model slechter.',
                starterPrompt: 'Leg uit waarom een bananenschil met label Plastic een slecht trainingsvoorbeeld is.'
            }
        ]
    },
    'chatbot-trainer': {
        title: 'Bot rescue',
        scenario: 'Een schoolchatbot geeft een vaag antwoord op een leerlingvraag.',
        prompt: 'Welke ingreep maakt de bot als eerste beter?',
        options: [
            {
                id: 'sleutelwoorden',
                label: 'Sleutelwoorden',
                description: 'Voeg woorden toe waarop de bot de vraag herkent.',
                feedback: 'Slim: betere herkenning voorkomt dat goede vragen in de fallback verdwijnen.',
                starterPrompt: 'Mijn schoolchatbot herkent de vraag nog niet goed. Welke sleutelwoorden moet ik toevoegen?'
            },
            {
                id: 'antwoord',
                label: 'Antwoord scherper',
                description: 'Maak het antwoord korter, concreter en vriendelijker.',
                feedback: 'Sterk: een bot is pas nuttig als het antwoord begrijpelijk en direct toepasbaar is.',
                starterPrompt: 'Verbeter dit chatbotantwoord zodat het kort, concreet en vriendelijk wordt.'
            },
            {
                id: 'fallback',
                label: 'Fallback redden',
                description: 'Schrijf wat de bot zegt als hij het niet zeker weet.',
                feedback: 'Goed voor veiligheid: een eerlijke fallback voorkomt verzonnen zekerheid.',
                starterPrompt: 'Schrijf een veilige fallback voor een schoolchatbot die niet zeker weet wat de leerling bedoelt.'
            }
        ]
    },
    'verhalen-ontwerper': {
        title: 'Story spark',
        scenario: 'Een verhaal begint pas te leven als de AI genoeg richting krijgt.',
        prompt: 'Welke vonk geef je als eerste aan je verhaal?',
        options: [
            {
                id: 'held',
                label: 'Held met doel',
                description: 'Begin bij iemand die iets wil bereiken.',
                feedback: 'Sterke haak: een duidelijk doel geeft de AI meteen verhaalrichting.',
                starterPrompt: 'Bedenk een verhaal over een leerling die een geheim digitaal probleem wil oplossen.'
            },
            {
                id: 'probleem',
                label: 'Probleem eerst',
                description: 'Start met een digitaal conflict of mysterie.',
                feedback: 'Mooi: een probleem maakt de eerste scene meteen actief.',
                starterPrompt: 'Bedenk een openingsscene waarin een schoolapp ineens iets vreemds doet.'
            },
            {
                id: 'twist',
                label: 'Twist kiezen',
                description: 'Geef de AI alvast een verrassende wending.',
                feedback: 'Creatief: een twist voorkomt dat het verhaal te voorspelbaar wordt.',
                starterPrompt: 'Bedenk een kort verhaal met de twist dat de AI niet de vijand is maar de waarschuwer.'
            }
        ]
    },
    'ai-tekengame': {
        title: 'Promptduel',
        scenario: 'De tekengame moet raden wat jij bedoelt. Een goede prompt maakt het verschil.',
        prompt: 'Welke tekenstrategie test je eerst?',
        options: [
            {
                id: 'vorm',
                label: 'Vorm eerst',
                description: 'Begin met simpele vormen die makkelijk te herkennen zijn.',
                feedback: 'Goed gekozen: vormherkenning is de basis voordat details belangrijk worden.',
                starterPrompt: 'Ik wil een AI-tekengame testen met simpele vormen. Welke vorm moet ik eerst tekenen en waarom?'
            },
            {
                id: 'context',
                label: 'Context geven',
                description: 'Voeg een omgeving of situatie toe aan je tekening.',
                feedback: 'Slim: context kan helpen, maar te veel omgeving kan de AI ook afleiden.',
                starterPrompt: 'Help me bepalen hoeveel context ik aan mijn tekening geef zonder de AI af te leiden.'
            },
            {
                id: 'contrast',
                label: 'Contrast maken',
                description: 'Maak het onderwerp duidelijk los van de achtergrond.',
                feedback: 'Sterk voor herkenning: contrast maakt het doelobject sneller leesbaar.',
                starterPrompt: 'Ik wil mijn tekening beter herkenbaar maken met contrast. Welke eerste test past daarbij?'
            }
        ]
    },
    'ai-beleid-brainstorm': {
        title: 'AI-huiswerkcrisis',
        scenario: 'De school ziet ineens dat leerlingen AI gebruiken voor huiswerk. Er moet een eerlijke regel komen.',
        prompt: 'Welke beleidsrichting onderzoek je eerst?',
        options: [
            {
                id: 'toestaan',
                label: 'Toestaan',
                description: 'AI mag, zolang leerlingen laten zien wat ze zelf hebben gedaan.',
                feedback: 'Open benadering: let goed op bewijs van eigen denken en gelijke kansen.',
                starterPrompt: 'Bedenk een eerlijke schoolregel waarin AI mag, maar leerlingen bewijs van eigen denken laten zien.'
            },
            {
                id: 'voorwaarden',
                label: 'Met voorwaarden',
                description: 'AI mag alleen bij sommige opdrachten of met bronvermelding.',
                feedback: 'Meest onderzoekbaar: voorwaarden maken ruimte voor leren en duidelijke grenzen.',
                starterPrompt: 'Bedenk voorwaarden voor AI-gebruik bij huiswerk die eerlijk, controleerbaar en leerzaam zijn.'
            },
            {
                id: 'verbieden',
                label: 'Verbieden',
                description: 'AI mag niet bij huiswerk zolang controle lastig is.',
                feedback: 'Duidelijke grens, maar onderzoek ook wat leerlingen dan niet meer leren over AI-gebruik.',
                starterPrompt: 'Onderzoek de voor- en nadelen van een tijdelijk AI-verbod bij huiswerk.'
            }
        ]
    },
    'data-verzamelaar': {
        title: 'Class mystery',
        scenario: 'Je klas wil weten hoe leerlingen meestal naar school komen, maar je eerste dataset kan scheef zijn.',
        prompt: 'Welke voorspelling durf je vooraf te doen?',
        options: [
            {
                id: 'fiets',
                label: 'Meeste fietsen',
                description: 'Je verwacht dat fietsen de grootste groep is.',
                feedback: 'Goede hypothese: straks check je of jouw klas lijkt op je verwachting.',
                starterPrompt: 'Mijn voorspelling is dat de meeste leerlingen met de fiets komen. Welke data moet ik verzamelen?'
            },
            {
                id: 'bus',
                label: 'Bus valt op',
                description: 'Je denkt dat openbaar vervoer belangrijker is dan mensen verwachten.',
                feedback: 'Interessante invalshoek: let straks op afstand tot school en reistijd.',
                starterPrompt: 'Mijn voorspelling is dat de bus vaker voorkomt dan verwacht. Welke kolommen heb ik nodig?'
            },
            {
                id: 'scheef',
                label: 'Dataset is scheef',
                description: 'Je verwacht dat je steekproef niet eerlijk verdeeld is.',
                feedback: 'Sterk datadenken: je kijkt niet alleen naar uitkomsten, maar ook naar betrouwbaarheid.',
                starterPrompt: 'Ik denk dat mijn dataset scheef kan zijn. Hoe controleer ik of mijn meting eerlijk is?'
            }
        ]
    }
};

export const getMissionLaunchChallenge = (missionId: string): MissionLaunchChallenge | undefined => {
    return MISSION_LAUNCH_CHALLENGES[missionId];
};
