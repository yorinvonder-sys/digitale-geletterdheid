import type { OfficeConfig } from '../officeTypes';

/**
 * De kantoorindeling van de helpdesk-ochtend.
 *
 * De bureaus staan bewust ver uit elkaar: afstand is tijd. Naar de verkeerde
 * hoek lopen kost je het bericht dat aan de andere kant binnenkomt, en dat is
 * precies de afweging die deze missie wil oefenen — niet elk bericht is even
 * dringend.
 */
const office: OfficeConfig = {
    afmeting: { breedte: 9, diepte: 7 },
    startPositie: { x: 0, z: 4 },
    // Ruim genomen: een leerling moet niet op een centimeter hoeven staan.
    // Bij 1,6 meter liep een speeltest twee keer vast omdat je precies goed
    // moest gaan staan om iets te kunnen doen.
    bereik: 2.6,
    loopsnelheid: 3.4,

    desks: [
        { id: 'balie', naam: 'Balie', positie: { x: 0, z: 2 }, rotatie: 0 },
        { id: 'lerarenkamer', naam: 'Roos Jansen', positie: { x: -6, z: 1 }, rotatie: 90 },
        { id: 'administratie', naam: 'Administratie', positie: { x: 6, z: 1 }, rotatie: -90 },
        { id: 'directie', naam: 'Directie', positie: { x: -5, z: -4 }, rotatie: 135 },
        { id: 'mediatheek', naam: 'Mediatheek', positie: { x: 5, z: -4 }, rotatie: -135 },
        { id: 'conciërge', naam: 'Conciërge', positie: { x: 0, z: -5 }, rotatie: 180 },
    ],

    stations: [
        { id: 'koffie', soort: 'koffie', positie: { x: -8, z: -5.5 }, label: 'Koffie' },
        { id: 'telefoon', soort: 'telefoon', positie: { x: 8, z: 4 }, label: 'Telefoon' },
        { id: 'usb', soort: 'usb', positie: { x: -2.5, z: -1 }, label: 'Op de vloer' },
        { id: 'itkast', soort: 'itkast', positie: { x: 8, z: -5.5 }, label: 'Serverkast' },
        { id: 'versnipperaar', soort: 'versnipperaar', positie: { x: -8, z: 4 }, label: 'Versnipperaar' },
    ],

    focus: {
        // Na een stuk of zeven onderdelen merk je dat je scherpte terugloopt.
        daalPerStap: 7,
        drempelVoorbeeld: 50,
        koffieHerstel: 45,
    },

    /**
     * Welk bericht op welk bureau binnenkomt. Verspreid over de ruimte, zodat
     * de leerling blijft bewegen en soms moet kiezen welk scherm hij eerst doet.
     */
    mailPerDesk: {
        1: 'lerarenkamer',
        2: 'balie',
        3: 'mediatheek',
        4: 'conciërge',
        5: 'administratie',
        6: 'balie',
        7: 'directie',
        8: 'lerarenkamer',
        9: 'mediatheek',
        10: 'mediatheek',
        11: 'administratie',
        12: 'directie',
    },

    onderbrekingen: [
        {
            id: 'telefoontje-systeembeheer',
            soort: 'telefoon',
            naBericht: 3,
            plek: 'telefoon',
            aanhef: 'De telefoon gaat',
            tekst: [
                '"Goedemorgen, je spreekt met Mark van de systeembeheerder. We zien vanochtend rare inlogpogingen op het schoolnetwerk."',
                '"Ik ben nu bezig het dicht te zetten, maar ik heb daarvoor even het beheerderswachtwoord nodig. Kun je dat voorlezen? Het is nogal haastig, de rector staat naast me."',
            ],
            keuzes: [
                {
                    id: 'wachtwoord-geven',
                    label: 'Het wachtwoord voorlezen — hij klinkt betrouwbaar',
                    veilig: false,
                    reactie:
                        'Je leest het voor. Een half uur later blijkt niemand van de systeembeheerder gebeld te hebben. Het beheerdersaccount is overgenomen.',
                    gevolgMelding: 'Beheerderswachtwoord door de telefoon gegeven. Account overgenomen.',
                    accountsKwijt: 2,
                },
                {
                    id: 'terugbellen',
                    label: 'Zeggen dat je terugbelt op het nummer dat je zelf kent',
                    veilig: true,
                    reactie:
                        'Je zegt dat je terugbelt via het nummer uit je eigen lijst. De beller wordt boos en hangt op. Dat zegt genoeg.',
                },
                {
                    id: 'doorverbinden',
                    label: 'Hem doorverbinden met de rector',
                    veilig: false,
                    reactie:
                        'Je verbindt door. De rector heeft het druk, gelooft het verhaal, en geeft zijn eigen wachtwoord.',
                    gevolgMelding: 'Beller doorverbonden met de rector, die zijn wachtwoord gaf.',
                    accountsKwijt: 1,
                },
            ],
            tell: 'Wie je écht belt vanuit de systeembeheerder vraagt nooit om een wachtwoord, en haast is altijd het drukmiddel.',
            uitleg:
                'Oplichting gaat lang niet altijd via de mail. Aan de telefoon werkt het zelfs beter, want je hoort een stem en je voelt de haast. De vaste regel: je geeft nooit een wachtwoord door, en je belt zelf terug op een nummer dat je al kende — niet op het nummer dat de beller je geeft.',
        },
        {
            id: 'usb-op-de-vloer',
            soort: 'usb',
            naBericht: 7,
            plek: 'usb',
            aanhef: 'Er ligt een USB-stick op de vloer',
            tekst: [
                'Op de gang, vlak bij de kopieerruimte, ligt een USB-stick. Er zit een sticker op met de tekst "Salarissen 2026 — vertrouwelijk".',
                'Niemand in de buurt lijkt hem kwijt te zijn.',
            ],
            keuzes: [
                {
                    id: 'insteken',
                    label: 'In je computer steken om te zien van wie hij is',
                    veilig: false,
                    reactie:
                        'Je steekt hem in. Er opent niets zichtbaars, maar diezelfde middag doen drie computers vreemd. Er stond schadelijke software op.',
                    gevolgMelding: 'Onbekende USB-stick ingestoken. Drie computers besmet.',
                    accountsKwijt: 3,
                },
                {
                    id: 'inleveren',
                    label: 'Ongeopend bij de systeembeheerder inleveren',
                    veilig: true,
                    reactie:
                        'Je levert hem in zonder hem aan te sluiten. De systeembeheerder kan hem veilig onderzoeken op een losse computer.',
                },
                {
                    id: 'weggooien',
                    label: 'Weggooien, dan is niemand er iets mee',
                    veilig: false,
                    reactie:
                        'Weggooien is veiliger dan insteken, maar nu weet niemand dat iemand deze stick hier heeft neergelegd — en dat was waarschijnlijk expres.',
                    gevolgMelding: 'USB-stick weggegooid; de poging is nooit gemeld.',
                },
            ],
            tell: 'Een gevonden stick met een verleidelijk label is een klassieke val: hij is neergelegd om opgeraapt te worden.',
            uitleg:
                'Niet elke aanval komt via het internet binnen. Een stick met "Salarissen" erop is aas: de aanvaller rekent erop dat iemand nieuwsgierig wordt. Zodra je hem aansluit kan er software starten zonder dat je iets ziet gebeuren. Nooit aansluiten, altijd inleveren.',
        },
        {
            id: 'collega-onder-druk',
            soort: 'collega',
            naBericht: 10,
            plek: 'balie',
            aanhef: 'Meneer De Wit staat naast je',
            tekst: [
                '"Sorry dat ik zo binnenval, maar ik sta over vier minuten voor de klas en ik kan niet inloggen. Kun jij even snel mijn wachtwoord resetten en het me geven?"',
                'Hij heeft zijn schoolpas niet bij zich. "Die ligt in mijn jas, in het lokaal. Je kent me toch?"',
            ],
            keuzes: [
                {
                    id: 'snel-resetten',
                    label: 'Snel resetten — je kent hem, en hij heeft haast',
                    veilig: false,
                    reactie:
                        'Je reset het wachtwoord. Het was inderdaad meneer De Wit. Maar volgende week doet iemand hetzelfde trucje aan de balie, en dan is het niet een collega.',
                    gevolgMelding: 'Wachtwoord gereset zonder controle van de identiteit.',
                    accountsKwijt: 1,
                },
                {
                    id: 'pas-ophalen',
                    label: 'Vragen of hij zijn pas even ophaalt',
                    veilig: true,
                    reactie:
                        'Hij moppert, maar hij haalt zijn pas. Twee minuten later is hij ingelogd. De regel geldt voor iedereen, juist als het druk is.',
                },
                {
                    id: 'collega-bellen',
                    label: 'Zijn mentorcollega bellen om te bevestigen dat hij het is',
                    veilig: true,
                    reactie:
                        'Je belt kort met een collega die hem kent en bevestigt. Ook goed: je hebt de identiteit gecontroleerd via een tweede weg.',
                },
            ],
            tell: 'Tijdsdruk plus "je kent me toch" is precies het recept waarmee mensen regels laten overslaan.',
            uitleg:
                'Dit heet meeliften op vertrouwen: iemand gebruikt haast en bekendheid om jou een regel te laten overslaan. Het lastige is dat het meestal echt een collega is — juist daarom werkt het. Een regel die alleen geldt als het uitkomt, is geen regel. Controleer wie iemand is via een tweede weg, hoe vervelend dat op dat moment ook is.',
        },
    ],
};

export default office;
