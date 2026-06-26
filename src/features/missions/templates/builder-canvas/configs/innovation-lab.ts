import type { BuilderCanvasConfig } from '../BuilderCanvas';

export const innovationLabConfig: BuilderCanvasConfig = {
    missionId: 'innovation-lab',
    title: 'Innovation Lab',
    introEmoji: '🔬',
    introTitle: 'Bedenk een technologische oplossing voor het dagelijks leven',
    introDescription:
        'In deze missie bedenk jij een technologische oplossing voor een alledaags probleem — op school, in de sport, bij een hobby, thuis of in het dagelijks leven. Je werkt als innovator die met Design Thinking van probleem naar prototype gaat.',
    introFeatures: [
        'Kies een concreet alledaags probleem en analyseer het',
        'Ontwerp een technologische oplossing met concrete stappen',
        'Bouw een prototype-concept in woorden en schema',
        'Presenteer de impact van jouw innovatie',
    ],
    enableChat: true,
    chatRoleId: 'innovation-lab',
    previewType: 'text-preview',
    steps: [
        {
            id: 'probleem-kiezen',
            title: 'Probleem kiezen en analyseren',
            description:
                'Technologie kan alledaagse problemen oplossen — op school, in de sport, bij een hobby of thuis. Goede innovatie begint bij een concreet probleem dat iemand écht ervaart.',
            instruction:
                'Kies één alledaags probleem dat jou of mensen om je heen bezighoudt. Beschrijf: 1) Wat is het probleem precies? (bijv. niet "school is saai" maar "ik vergeet altijd welke spullen ik mee moet nemen"), 2) Wie heeft er last van en hoe erg is het?, 3) Waarom bestaat het probleem nu nog? (wat ontbreekt er?), 4) Waarom zou technologie dit probleem kunnen helpen oplossen?',
            tip: 'Hoe specifieker het probleem, hoe effectiever de oplossing. "Vergeten" is te breed. "Sporters die na de training niet weten wat ze de volgende dag moeten eten om te herstellen" is een probleem dat je kunt aanpakken.',
            checklistItems: [
                { id: 'probleem-gekozen', label: 'Ik heb een concreet alledaags probleem beschreven' },
                { id: 'concreet-probleem', label: 'Het probleem is specifiek genoeg (niet te breed)' },
                { id: 'omvang', label: 'Ik heb beschreven wie er last van heeft en hoe erg' },
                { id: 'tech-kans', label: 'Ik heb uitgelegd waarom technologie kan helpen' },
            ],
            textPrompt: 'Beschrijf het alledaagse probleem dat jij wilt oplossen',
        },
        {
            id: 'technologie-oplossing',
            title: 'Technologische oplossing ontwerpen',
            description:
                'Nu komt het creatieve gedeelte: welke technologie gebruik je? Apps, AI, sensoren, slimme apparaten? De oplossing moet haalbaar zijn — niet science fiction — maar mag ambitieus zijn.',
            instruction:
                'Ontwerp je technologische oplossing. Beschrijf: 1) Wat is het product of systeem? (app, platform, sensor-netwerk, AI-tool), 2) Hoe werkt het? (beschrijf de technologie in begrijpelijke taal), 3) Wie zijn de gebruikers en hoe gebruiken ze het?, 4) Welke bestaande technologie gebruik je als basis? (je hoeft niet alles zelf uit te vinden), 5) Wat is het meest innovatieve element van jouw oplossing?',
            tip: 'De beste innovaties combineren bestaande technologie op een nieuwe manier. WhatsApp heruitvond SMS niet — het gebruikte het internet voor berichten. Welke bestaande technologie combineer jij?',
            checklistItems: [
                { id: 'product', label: 'Het product of systeem is concreet beschreven' },
                { id: 'werking', label: 'De technologische werking is uitgelegd' },
                { id: 'gebruikers', label: 'Gebruikers en gebruik zijn beschreven' },
                { id: 'innovatie', label: 'Het meest innovatieve element is benoemd' },
            ],
            textPrompt: 'Beschrijf je technologische oplossing',
        },
        {
            id: 'prototype-concept',
            title: 'Prototype-concept uitwerken',
            description:
                'Een prototype-concept is niet het eindproduct — het is een werkbare eerste versie die je kunt testen. Een goede MVP (Minimum Viable Product) heeft de kernfunctie en niets meer.',
            instruction:
                'Beschrijf het MVP (Minimum Viable Product) van jouw innovatie. Beantwoord: 1) Wat is de kernfunctie die de oplossing moet hebben om nuttig te zijn? (alles wat er niet voor nodig is, gooi je weg), 2) Hoe ziet de allereerste testversie eruit? (beschrijf het zo concreet mogelijk), 3) Wie zou je uitnodigen om de eerste versie te testen?, 4) Wat zou je meten om te weten of je prototype werkt?',
            tip: 'Het MVP van Airbnb was een simpele website met foto\'s van één appartement. Geen app, geen kaart, geen reviews. Alleen de kernfunctie: "Wil iemand dit huren?" Dat was genoeg om te testen.',
            checklistItems: [
                { id: 'kernfunctie', label: 'De kernfunctie is beschreven (en al het overbodige is weggelaten)' },
                { id: 'eerste-versie', label: 'De allereerste testversie is concreet beschreven' },
                { id: 'testgebruikers', label: 'De testgebruikers zijn benoemd' },
                { id: 'meetmethode', label: 'Ik heb beschreven wat ik meet om succes te bepalen' },
            ],
            textPrompt: 'Beschrijf je prototype-concept en MVP',
        },
        {
            id: 'impact',
            title: 'Impact presenteren',
            description:
                'Innovatie is pas waardevol als het écht iets verandert. Hoe meet je de impact van jouw oplossing? En wat zijn de risico\'s of neveneffecten die je niet wilt? Een eerlijke innovator kijkt ook naar de nadelen.',
            instruction:
                'Beschrijf de verwachte impact van jouw innovatie. Gebruik: 1) Kwantitatieve impact (= in cijfers): hoeveel mensen help je, hoeveel tijd/geld bespaar je? (maak een schatting met redenering), 2) Kwalitatieve impact (= in woorden): wat verandert er in het dagelijks leven van gebruikers?, 3) Risico\'s en bijeffecten: wat kan er misgaan of wie wordt er benadeeld?, 4) Duurzaamheid — hoe de innovatie blijft bestaan: hoe zorg je dat het na het eerste jaar verder gaat?',
            tip: 'Elke technologie heeft onbedoelde gevolgen. Sociale media verbindt mensen maar veroorzaakt ook polarisatie. Wees eerlijk over de risico\'s — dat maakt je innovatie geloofwaardiger.',
            checklistItems: [
                { id: 'kwant-impact', label: 'Kwantitatieve impact is geschat met redenering' },
                { id: 'kwal-impact', label: 'Kwalitatieve verandering voor gebruikers is beschreven' },
                { id: 'risicos', label: 'Risico\'s en bijeffecten zijn eerlijk benoemd' },
                { id: 'duurzaamheid', label: 'Duurzaamheid van de innovatie is beschreven' },
            ],
            textPrompt: 'Beschrijf de impact van jouw innovatie',
        },
    ],
    maxScore: 100,
    badges: [
        { minScore: 90, emoji: '🏆', title: 'Top Innovator', color: '#e1ff01' },
        { minScore: 70, emoji: '🔬', title: 'Innovation Lab', color: '#202023' },
        { minScore: 50, emoji: '💡', title: 'Probleemoplosser', color: '#ff3c21' },
        { minScore: 25, emoji: '🔬', title: 'Beginnende Innovator', color: '#202023' },
        { minScore: 0, emoji: '🌱', title: 'Op weg', color: '#202023' },
    ],
    takeaways: [
        'Je kunt een concreet alledaags probleem identificeren en beschrijven wie er last van heeft',
        'Je kunt een technologische oplossing ontwerpen en de werking uitleggen',
        'Je begrijpt wat een MVP is en waarom je klein begint bij innovatie',
        'Je kunt de impact van een innovatie kwantitatief en kwalitatief beschrijven',
        'Je hebt nagedacht over risico\'s en neveneffecten van technologie — dat maakt je een verantwoorde innovator',
    ],
};

export default innovationLabConfig;
