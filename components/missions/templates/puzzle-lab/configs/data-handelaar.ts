import type { PuzzleLabConfig } from '../puzzleLabTypes';

const config: PuzzleLabConfig = {
    missionId: 'data-handelaar',
    title: 'De Data Handelaar',
    introEmoji: '🕵️',
    introTitle: 'De Data Handelaar',
    introDescription:
        'Je bent undercover bij DataDeal BV — een bedrijf dat stiekem persoonsgegevens verkoopt. Je hebt interne documenten onderschept. Jouw missie: vind de AVG-overtredingen, begrijp de regels en rapporteer de feiten.',
    introFeatures: [
        'Analyseer een onderschepte bedrijfse-mail op AVG-overtredingen',
        'Ontdek welke data extra beschermd is onder de wet',
        'Begrijp de rechten die mensen hebben over hun eigen data',
        'Stel een onderzoeksrapport op met de gevonden overtredingen',
    ],
    maxScore: 100,
    puzzles: [
        {
            id: 'bewijsstuk-a',
            title: 'Bewijsstuk A — De interne e-mail',
            type: 'multiple-choice',
            description:
                'Je onderschept een interne e-mail bij DataDeal BV:\n\n---\n**Van:** directeur@datadeal.nl\n**Aan:** verkoop@datadeal.nl\n\n*"Hi team, we hebben van FitTrack 50.000 gebruikersprofielen ontvangen — locatiedata, hartslag en slaappatronen. De gebruikers weten hier niks van maar dat hoeft ook niet — ze hebben de algemene voorwaarden geaccepteerd. Verkoop ze door aan verzekeraar HealthPlus."*\n\n---\n\nWelke AVG-overtreding is dit PRIMAIR?',
            clues: [
                'De AVG zegt: je mag data alleen verwerken voor het doel waarvoor het is verzameld.',
                'FitTrack verzamelde de data voor de sportapp — niet om door te verkopen aan verzekeraars.',
                '"Algemene voorwaarden accepteren" is geen geldige toestemming voor doorverkoop van gezondheidsdata.',
            ],
            extraClues: [
                'Gezondheidsdata (hartslag, slaap) zijn "bijzondere persoonsgegevens" — die zijn extra beschermd en mogen alleen met expliciete toestemming worden verwerkt.',
                'Doelbinding = AVG-artikel 5: je mag data alleen gebruiken voor het doel waarvoor het is verzameld.',
            ],
            revealExtraAfterAttempts: 2,
            options: [
                'De data werd niet goed beveiligd opgeslagen',
                'De data wordt gebruikt voor een ander doel dan waarvoor het verzameld is (schending van doelbinding)',
                'De e-mail werd verstuurd zonder versleuteling',
                'Het bedrijf heeft geen privacyverklaring op de website',
            ],
            answer: 'De data wordt gebruikt voor een ander doel dan waarvoor het verzameld is (schending van doelbinding)',
            caseSensitive: false,
            maxAttempts: 3,
            points: 25,
            successMessage:
                'Juist! Dit is schending van het doelbindingsbeginsel (AVG art. 5). Gebruikers gaven toestemming voor de sportapp — niet voor doorverkoop aan verzekeraars. Bovendien zijn hartslag en slaapdata "bijzondere persoonsgegevens" waarvoor expliciete toestemming vereist is.',
            hintCost: 4,
        },
        {
            id: 'bewijsstuk-b',
            title: 'Bewijsstuk B — Het klantprofiel',
            type: 'multiple-choice',
            description:
                'Je vindt een klantprofiel in de database van DataDeal BV:\n\n---\n**KLANTPROFIEL #4892**\nNaam: Emma de Vries, 14 jaar\nSchool: Stedelijk College\nZoekgeschiedenis: "hoe word ik populair", "ben ik te dik", "crush tips"\nPsychologisch profiel: "onzeker, beïnvloedbaar"\nDoelgroep: Influencer-marketing campagnes\n\n---\n\nWelke AVG-overtreding is hier het meest ernstig?',
            clues: [
                'Emma is 14 jaar — zij is een minderjarige.',
                'De AVG geeft kinderen extra bescherming bij online diensten.',
                'Het profiel bevat "beïnvloedbaar" als kenmerk — dit wordt gebruikt voor gerichte reclame.',
            ],
            extraClues: [
                'De AVG verbiedt profilering van kinderen voor marketingdoeleinden.',
                'Zoekgeschiedenissen en psychologische profielen zijn gevoelige data die niet zonder expliciete toestemming van ouders verzameld mogen worden bij minderjarigen.',
            ],
            revealExtraAfterAttempts: 2,
            options: [
                'Er staat geen telefoonnummer in het profiel, dus het is onvolledig',
                'De schoolnaam had niet opgeslagen mogen worden',
                'Een minderjarige wordt geprofileerd voor marketingdoeleinden zonder toestemming van ouders',
                'Het profiel bevat spelfouten in de naam',
            ],
            answer: 'Een minderjarige wordt geprofileerd voor marketingdoeleinden zonder toestemming van ouders',
            caseSensitive: false,
            maxAttempts: 3,
            points: 25,
            successMessage:
                'Correct! Kinderen (onder 16 jaar in Nederland) hebben extra AVG-bescherming. Profileren van kinderen voor marketing is verboden zonder ouderlijke toestemming. Het psychologisch profiel ("beïnvloedbaar") en de zoekgeschiedenissen zijn bovendien bijzonder gevoelige data.',
            hintCost: 4,
        },
        {
            id: 'rechten-betrokkenen',
            title: 'Wat mogen burgers eisen?',
            type: 'multiple-choice',
            description:
                'Liam hoort dat zijn gezondheidsdata is doorverkocht door DataDeal BV zonder zijn toestemming. Hij wil actie ondernemen.\n\nWat heeft Liam het DIRECTE RECHT om te doen onder de AVG?',
            clues: [
                'De AVG geeft iedereen rechten over hun eigen persoonsgegevens.',
                'Recht op inzage: je mag opvragen welke data een bedrijf over jou heeft.',
                'Recht op verwijdering ("recht om vergeten te worden"): je mag vragen je data te wissen.',
            ],
            extraClues: [
                'Andere AVG-rechten: recht op correctie, recht op beperking van verwerking, recht op dataportabiliteit.',
                'Als een bedrijf niet meewerkt, kun je een klacht indienen bij de Autoriteit Persoonsgegevens (AP) — de Nederlandse privacywaakhond.',
            ],
            revealExtraAfterAttempts: 2,
            options: [
                'Liam kan niets doen want hij heeft de algemene voorwaarden geaccepteerd',
                'Liam kan het bedrijf vragen zijn data in te zien en te verwijderen',
                'Liam kan pas actie ondernemen als er schade is aangetoond',
                'Liam moet eerst een advocaat inhuren voordat hij rechten heeft',
            ],
            answer: 'Liam kan het bedrijf vragen zijn data in te zien en te verwijderen',
            caseSensitive: false,
            maxAttempts: 3,
            points: 25,
            successMessage:
                'Juist! De AVG geeft Liam het recht op inzage (welke data heeft het bedrijf?) en het recht op verwijdering. Het bedrijf moet binnen 30 dagen reageren. Als ze niet meewerken, kan Liam een klacht indienen bij de Autoriteit Persoonsgegevens.',
            hintCost: 4,
        },
        {
            id: 'rapport-conclusie',
            title: 'Schrijf de conclusie van het rapport',
            type: 'text-input',
            description:
                'Je onderzoek is klaar. Schrijf de conclusie van je rapport in één zin. De conclusie moet:\n\n• De naam van het bedrijf bevatten (DataDeal BV)\n• Ten minste één AVG-artikel of AVG-principe benoemen\n• Beschrijven welke groep het meest risico loopt\n\nVoorbeeldstructuur: "[Bedrijf] overtreedt [principe/artikel] doordat [handeling], wat [groep] benadeelt."',
            clues: [
                'Noem het doelbindingsbeginsel of artikel 5 van de AVG.',
                'De meest kwetsbare groep in dit onderzoek zijn de minderjarigen.',
                'De kern van de overtreding: data wordt gebruikt voor een ander doel dan waarvoor het is verzameld.',
            ],
            extraClues: [
                'Voorbeeld: "DataDeal BV overtreedt het doelbindingsbeginsel (AVG art. 5) door gezondheidsdata door te verkopen zonder toestemming, waardoor minderjarigen zoals Emma bijzonder risico lopen."',
            ],
            revealExtraAfterAttempts: 3,
            answer: [],
            validator: (input: string) => {
                const s = input.toLowerCase();
                const hasCompany = s.includes('datadeal');
                const hasAvg = s.includes('avg') || s.includes('doelbinding') || s.includes('privac') || s.includes('artikel 5') || s.includes('toestemming');
                const hasGroup = s.includes('minderjarig') || s.includes('kind') || s.includes('gebruiker') || s.includes('emma') || s.includes('betrokkene');
                return hasCompany && hasAvg && hasGroup && s.length >= 40;
            },
            caseSensitive: false,
            maxAttempts: 8,
            points: 25,
            successMessage:
                'Goed rapport! Je hebt de kern van de zaak samengevat: het bedrijf, de overtreden regel en de benadeelde groep. Zo ziet een echte AVG-rapportage eruit. De Autoriteit Persoonsgegevens kan op basis van zo\'n rapport een onderzoek starten en boetes opleggen tot 20 miljoen euro.',
            hintCost: 3,
        },
    ],
    badges: [
        {
            minScore: 90,
            emoji: '🏆',
            title: 'Hoofd Data-Inspecteur',
            color: '#D7C95F',
        },
        {
            minScore: 70,
            emoji: '🕵️',
            title: 'Senior Undercover Agent',
            color: '#445865',
        },
        {
            minScore: 40,
            emoji: '📋',
            title: 'Privacy Onderzoeker',
            color: '#5F947D',
        },
        {
            minScore: 0,
            emoji: '🔎',
            title: 'Stagiair Inspectie',
            color: '#0B453F',
        },
    ],
    takeaways: [
        'Doelbinding (AVG art. 5): data mag alleen gebruikt worden voor het doel waarvoor het is verzameld — doorverkoop zonder toestemming is verboden.',
        'Gezondheidsdata en zoekgeschiedenissen zijn "bijzondere persoonsgegevens" — die krijgen extra bescherming onder de AVG.',
        'Kinderen onder 16 jaar hebben extra privacybescherming: profilering voor marketing zonder ouderlijke toestemming is verboden.',
        'De AVG geeft iedereen rechten: inzage, correctie, verwijdering en de mogelijkheid klacht in te dienen bij de Autoriteit Persoonsgegevens.',
        '"Algemene voorwaarden accepteren" is geen geldige toestemming voor alles — toestemming moet specifiek, vrij en geïnformeerd zijn.',
    ],
};

export default config;
