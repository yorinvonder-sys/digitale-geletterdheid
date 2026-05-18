import type { BuilderCanvasConfig } from '../BuilderCanvas';

export const innovationLabConfig: BuilderCanvasConfig = {
    missionId: 'innovation-lab',
    title: 'Innovation Lab',
    introEmoji: '🔬',
    introTitle: 'Bedenk een technologische oplossing voor de wereld',
    introDescription:
        'In deze missie word jij uitgenodigd voor het Innovation Lab van de VN. Je kiest een maatschappelijk probleem uit de Sustainable Development Goals (SDGs), ontwerpt een technologische oplossing en presenteert een werkbaar prototype-concept.',
    introFeatures: [
        'Kies een SDG en analyseer het bijbehorende probleem',
        'Ontwerp een technologische oplossing met concrete stappen',
        'Bouw een prototype-concept in woorden en schema',
        'Presenteer de impact van jouw innovatie',
    ],
    enableChat: true,
    chatRoleId: 'innovation-lab',
    previewType: 'text-preview',
    steps: [
        {
            id: 'sdg-probleem',
            title: 'SDG-probleem kiezen en analyseren',
            description:
                'De Sustainable Development Goals (SDGs) van de VN zijn 17 doelen voor een betere wereld in 2030. Van klimaatactie tot eerlijk onderwijs, van schoon water tot geen armoede. Elk doel verbergt duizenden concrete problemen die technologie kan helpen oplossen.',
            instruction:
                'Kies één SDG die jou aanspreekt (bijv. SDG 4: Kwaliteitsonderwijs, SDG 13: Klimaatactie, SDG 3: Gezondheid). Beschrijf: 1) Welke SDG je kiest en waarom, 2) Één concreet probleem binnen die SDG (bijv. niet "klimaatverandering" maar "kleinschalige boeren hebben geen toegang tot weersvoorspellingen"), 3) Wie er last van heeft en hoe erg (omvang), 4) Waarom technologie dit probleem zou kunnen helpen oplossen.',
            tip: 'Hoe specifieker het probleem, hoe effectiever de oplossing. "Eenzaamheid" is te breed. "Ouderen in verzorgingshuizen die weinig menselijk contact hebben" is een probleem dat je kunt aanpakken.',
            checklistItems: [
                { id: 'sdg-gekozen', label: 'Ik heb een SDG gekozen met motivatie' },
                { id: 'concreet-probleem', label: 'Het concrete probleem is specifiek beschreven' },
                { id: 'omvang', label: 'Ik heb beschreven wie er last van heeft en hoe erg' },
                { id: 'tech-kans', label: 'Ik heb uitgelegd waarom technologie kan helpen' },
            ],
            textPrompt: 'Beschrijf het SDG-probleem dat jij wilt oplossen',
            minTextLength: 80,
        },
        {
            id: 'technologie-oplossing',
            title: 'Technologische oplossing ontwerpen',
            description:
                'Nu komt het creatieve gedeelte: welke technologie gebruik je? Apps, AI, sensoren, satellieten, blockchain? De oplossing moet haalbaar zijn — niet science fiction — maar mag ambitieus zijn.',
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
            minTextLength: 80,
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
            minTextLength: 80,
        },
        {
            id: 'impact',
            title: 'Impact presenteren',
            description:
                'Innovatie is pas waardevol als het écht iets verandert. Hoe meet je de impact van jouw oplossing? En wat zijn de risico\'s of neveneffecten die je niet wilt? Een eerlijke innovator kijkt ook naar de nadelen.',
            instruction:
                'Beschrijf de verwachte impact van jouw innovatie. Gebruik: 1) Kwantitatieve impact: hoeveel mensen help je, hoeveel tijd/geld/CO2 bespaar je? (maak een schatting met redenering), 2) Kwalitatieve impact: wat verandert er in het dagelijks leven van gebruikers?, 3) Risico\'s en bijeffecten: wat kan er misgaan of wie wordt er benadeeld?, 4) Duurzaamheid: hoe zorg je dat de innovatie blijft bestaan na het eerste jaar?',
            tip: 'Elke technologie heeft onbedoelde gevolgen. Sociale media verbindt mensen maar veroorzaakt ook polarisatie. Wees eerlijk over de risico\'s — dat maakt je innovatie geloofwaardiger.',
            checklistItems: [
                { id: 'kwant-impact', label: 'Kwantitatieve impact is geschat met redenering' },
                { id: 'kwal-impact', label: 'Kwalitatieve verandering voor gebruikers is beschreven' },
                { id: 'risicos', label: 'Risico\'s en bijeffecten zijn eerlijk benoemd' },
                { id: 'duurzaamheid', label: 'Duurzaamheid van de innovatie is beschreven' },
            ],
            textPrompt: 'Beschrijf de impact van jouw innovatie',
            minTextLength: 80,
        },
    ],
    maxScore: 100,
    badges: [
        { minScore: 90, emoji: '🏆', title: 'VN Innovator', color: '#D7C95F' },
        { minScore: 70, emoji: '🔬', title: 'Innovation Lab', color: '#5F947D' },
        { minScore: 50, emoji: '💡', title: 'Probleemoplosser', color: '#D97848' },
        { minScore: 25, emoji: '🔬', title: 'Beginnende Innovator', color: '#0B453F' },
        { minScore: 0, emoji: '🌱', title: 'Op weg', color: '#445865' },
    ],
    takeaways: [
        'Je weet wat de SDGs zijn en hoe je een concreet maatschappelijk probleem kunt identificeren',
        'Je kunt een technologische oplossing ontwerpen en de werking uitleggen',
        'Je begrijpt wat een MVP is en waarom je klein begint bij innovatie',
        'Je kunt de impact van een innovatie kwantitatief en kwalitatief beschrijven',
        'Je hebt nagedacht over risico\'s en neveneffecten van technologie — dat maakt je een verantwoorde innovator',
    ],
};

export default innovationLabConfig;
