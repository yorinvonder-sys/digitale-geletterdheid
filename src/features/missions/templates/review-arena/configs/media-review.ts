import type { ReviewArenaConfig } from '../ReviewArena';

const config: ReviewArenaConfig = {
    missionId: 'media-review',
    title: 'De Media Mixer',
    introEmoji: '🎬',
    introTitle: 'Wat weet jij van digitale media?',
    introDescription:
        'Van podcast tot meme, van storytelling tot branding — je hebt een hele mediaklas doorlopen. In vier ronden bewijs je dat je alle concepten echt begrijpt.',
    maxScore: 100,
    badges: [
        {
            minScore: 90,
            emoji: '🏆',
            title: 'Media Expert',
            color: '#e1ff01',
        },
        {
            minScore: 70,
            emoji: '🎯',
            title: 'Scherp Mediabewust',
            color: '#202023',
        },
        {
            minScore: 50,
            emoji: '📚',
            title: 'Op de goede weg',
            color: '#202023',
        },
        {
            minScore: 25,
            emoji: '💡',
            title: 'Kennis in opbouw',
            color: '#202023',
        },
        {
            minScore: 0,
            emoji: '💪',
            title: 'Goede poging',
            color: '#ff3c21',
        },
    ],
    takeaways: [
        'Een storyboard legt de structuur van een video of verhaal vast voordat je begint.',
        'Viraliteit hangt af van herkenbaarheid, emotie en de juiste timing op het platform.',
        'Een merk is meer dan een logo — het is het gevoel en de belofte achter een product.',
        'Goede UX zorgt ervoor dat een gebruiker zich welkom voelt en snel iets kan vinden.',
        'Mediawijsheid betekent: nadenken over wie een boodschap maakt en waarom.',
    ],
    rounds: [
        {
            id: 'round-drag-sort',
            type: 'drag-sort',
            title: 'Van idee naar gepubliceerde video',
            description:
                'Sorteer de productiestappen van een video van eerste idee (boven) tot publicatie (onder).',
            maxScore: 25,
            items: [
                { id: 'concept', label: 'Concept bepalen: wat wil je zeggen?', correctPosition: 0 },
                { id: 'storyboard', label: 'Storyboard tekenen: scène voor scène plannen', correctPosition: 1 },
                { id: 'opnemen', label: 'Filmen of opnemen', correctPosition: 2 },
                { id: 'monteren', label: 'Monteren: knippen, muziek, overgangen', correctPosition: 3 },
                { id: 'feedback', label: 'Feedback verzamelen en aanpassen', correctPosition: 4 },
                { id: 'publiceren', label: 'Publiceren op het juiste platform', correctPosition: 5 },
            ],
        },
        {
            id: 'round-match-pairs',
            type: 'match-pairs',
            title: 'Mediabegrip & omschrijving',
            description: 'Koppel elk mediabegrip aan de juiste omschrijving.',
            maxScore: 25,
            pairs: [
                {
                    left: 'Storyboard',
                    right: 'Visueel plan met scènes en camerastandpunten',
                },
                {
                    left: 'Branding',
                    right: 'Het geheel aan naam, stijl en boodschap van een merk',
                },
                {
                    left: 'UX (User Experience)',
                    right: 'Hoe prettig en logisch een gebruiker een product ervaart',
                },
                {
                    left: 'Viraliteit',
                    right: 'Snelle verspreiding van content via deelgedrag',
                },
                {
                    left: 'Doelgroep',
                    right: 'De specifieke groep mensen voor wie je content maakt',
                },
            ],
        },
        {
            id: 'round-categorize',
            type: 'categorize',
            title: 'Bewuste boodschap of toeval?',
            description:
                'Bepaal bij elke mediakeuze of die bewust is gemaakt (strategisch) of het resultaat van toeval is.',
            maxScore: 25,
            followUp: {
                question: 'Een sportmerk wil een nieuwe sneaker promoten bij jongeren van 13-17 jaar. Ze kiezen voor korte vertical video\'s met energieke muziek en geen gesproken tekst. Wat is de meest waarschijnlijke reden voor die keuze?',
                options: [
                    'Gesproken tekst kost meer geld om te produceren',
                    'Het format past bij hoe de doelgroep op platforms zoals TikTok en Instagram Reels consumeert',
                    'Jongeren begrijpen gesproken tekst minder goed dan beelden',
                    'Het algoritme blokkeert video\'s met geluid op sociale media',
                ],
                correctIndex: 1,
                explanation: 'Dit is een bewuste mediakeuze gebaseerd op de doelgroep en het platform. Korte vertical video zonder voiceover sluit aan bij het scrollen-gedrag en de aandachtsspanne op short-form platforms. De andere opties zijn feitelijk onjuist — kosten zijn niet de reden, jongeren begrijpen tekst prima, en algoritmes blokkeren geluid niet.',
                bonusPoints: 5,
            },
            categories: ['Bewuste mediakeuze', 'Geen mediakeuze'],
            items: [
                { label: 'Groen in een logo om duurzaamheid uit te stralen', correctCategory: 'Bewuste mediakeuze' },
                { label: 'Rustige muziek in een reclame voor een zorginstelling', correctCategory: 'Bewuste mediakeuze' },
                { label: 'Close-up van een glimlach om vertrouwen te wekken', correctCategory: 'Bewuste mediakeuze' },
                { label: 'Een video die toevallig viraal gaat zonder plan', correctCategory: 'Geen mediakeuze' },
                { label: 'Korte zinnen in social media om snel te lezen', correctCategory: 'Bewuste mediakeuze' },
                { label: 'Schermvulling met tekst omdat er geen afbeelding beschikbaar was', correctCategory: 'Geen mediakeuze' },
                { label: 'Subtitels toevoegen zodat dove kijkers het ook begrijpen', correctCategory: 'Bewuste mediakeuze' },
                { label: 'Foto met tegenlicht omdat de fotograaf de zon niet kon vermijden', correctCategory: 'Geen mediakeuze' },
            ],
        },
        {
            id: 'round-rapid-fire',
            type: 'rapid-fire',
            title: 'Digitale media: Waar of Onwaar?',
            description: 'Acht snelle vragen over podcasts, memes, branding en storytelling.',
            maxScore: 25,
            timePerQuestion: 12,
            questions: [
                {
                    question: 'Een podcast is altijd live uitgezonden.',
                    answer: false,
                    explanation: 'De meeste podcasts zijn opgenomen en achteraf beluisterbaar — dat is juist het grote voordeel.',
                },
                {
                    question: 'Een meme werkt doordat mensen zich ermee herkennen of identificeren.',
                    answer: true,
                    explanation: 'Herkenbaarheid is de kern van een goede meme — zo wordt hij gedeeld.',
                },
                {
                    question: 'Branding gaat alleen over het ontwerpen van een logo.',
                    answer: false,
                    explanation: 'Branding omvat ook toon, waarden, kleurgebruik, slogan en de ervaring die mensen met een merk hebben.',
                },
                {
                    question: 'Bij storytelling is de structuur begin-midden-einde altijd bruikbaar.',
                    answer: true,
                    explanation: 'Die klassieke structuur helpt kijkers of lezers om een verhaal te volgen en te onthouden.',
                },
                {
                    question: 'Voor een goede UX is het voldoende als een product er mooi uitziet.',
                    answer: false,
                    explanation: 'UX gaat over gebruiksgemak: ook als iets er mooi uitziet maar moeilijk te gebruiken is, is de UX slecht.',
                },
                {
                    question: 'Het algoritme van sociale media bepaalt mede welke content jij ziet.',
                    answer: true,
                    explanation: 'Platforms gebruiken algoritmen om content te tonen die jij waarschijnlijk interessant vindt, gebaseerd op je gedrag.',
                },
                {
                    question: 'Mediawijsheid betekent dat je weet hoe je zelf video\'s monteert.',
                    answer: false,
                    explanation: 'Mediawijsheid gaat over kritisch omgaan met media: bronnen beoordelen, manipulatie herkennen en bewust consumeren.',
                },
                {
                    question: 'Een call-to-action in een video vraagt kijkers iets te doen, zoals liken of abonneren.',
                    answer: true,
                    explanation: 'Een call-to-action (CTA) stuurt het gedrag van de kijker na het bekijken van de content.',
                },
            ],
        },
    ],
};

export default config;
