import type { PasswordFortressConfig } from '../passwordFortressTypes';

const DAY = 86_400;
const YEAR = 31_536_000;

const config: PasswordFortressConfig = {
    missionId: 'wachtwoord-fortress',
    title: 'Wachtwoord Fortress',
    introEmoji: '🏰',
    introTitle: 'Wachtwoord Fortress',
    introDescription:
        'In Wachtwoord Warrior leerde je hoe aanvallers denken — nu ga je dat zelf toepassen. Je bouwt een wachtwoord-fort en wij sturen er vier gesimuleerde kraakaanvallen op af, van botte rekenkracht tot gelekte wachtwoordlijsten. Je ziet live hoe lang elke aanval over jouw fort doet. Overleef alle vier de rondes! Let op: gebruik nooit je échte wachtwoord — verzin er hier eentje. Alles blijft in je browser.',
    missionGoal: {
        primaryGoal: 'Ik bouw een wachtwoord-fort dat vier soorten kraakaanvallen overleeft.',
        criteria: {
            type: 'rounds-complete',
            min: 3,
            description: 'Minimaal drie van de vier aanvalsrondes overleefd — de laatste ronde (credential stuffing) is altijd verplicht.',
        },
        evidence: 'Uitleg over brute-force, woordenboekaanvallen, leetspeak-variaties en credential stuffing — en waarom jouw wachtwoord ze weerstaat.',
    },
    introFeatures: [
        'Zie live hoe lang elke aanval over jouw wachtwoord doet',
        'Versla brute-force, woordenboek-, leetspeak- en credential-stuffing-aanvallen',
        'Ontdek waarom lengte wint van "slimme" tekens',
        'Bouw stap voor stap een vrijwel onkraakbare passphrase',
    ],
    maxScore: 100,
    pointsPerRound: 25,
    hintCost: 5,
    skipAfterAttempts: 6,
    rounds: [
        {
            id: 'ronde-brute-force',
            title: 'De kraakcomputer',
            story:
                'De eerste aanvaller rolt een kraakcomputer voor je poort: 1 miljard pogingen per seconde, alle combinaties één voor één. Bouw een fort dat de aanval minstens 1 dag tegenhoudt.',
            attacks: ['brute-force'],
            targetSeconds: DAY,
            targetLabel: 'minstens 1 dag',
            hints: [
                'Lengte is de krachtigste factor: elk extra teken vermenigvuldigt het aantal combinaties.',
                'Probeer 11+ kleine letters, of 8+ tekens met hoofdletters en cijfers gemixt.',
            ],
            clearedLesson:
                'Lengte wint! Elk extra teken maakt brute-force exponentieel trager: 6 tekens kraak je in seconden, 12 tekens duren eeuwen.',
        },
        {
            id: 'ronde-woordenboek',
            title: 'Het woordenboek',
            story:
                'Een nieuwe aanvaller sluit aan: het woordenboek. Hij probeert eerst alle bekende woorden, namen, jaartallen en reeksen — pas daarna de rest. Houd nu minstens 30 dagen stand.',
            attacks: ['brute-force', 'dictionary'],
            targetSeconds: 30 * DAY,
            targetLabel: 'minstens 30 dagen',
            hints: [
                'Een heel woord telt voor een aanvaller maar als ±3 tekens — en een jaartal als 1.',
                'Maak je fort langer, of gebruik méér woorden zodat de totale lengte het verschil maakt.',
            ],
            clearedLesson:
                'Herkenbare woorden en jaartallen zijn bijna gratis voor een aanvaller: een woordenboekaanval probeert ze als allereerste.',
        },
        {
            id: 'ronde-leetspeak',
            title: 'De trucdoorzier',
            story:
                'Deze aanvaller kent jouw trucs: @ in plaats van a, 0 in plaats van o, 3 in plaats van e. Hij vertaalt alles terug en checkt het woordenboek opnieuw. Houd minstens 1 jaar stand.',
            attacks: ['brute-force', 'dictionary', 'leet'],
            targetSeconds: YEAR,
            targetLabel: 'minstens 1 jaar',
            hints: [
                '@ voor a en 0 voor o houden niemand tegen: aanvalslijsten bevatten alle variaties op bekende woorden.',
                'Combineer meerdere willekeurige woorden die niets met elkaar te maken hebben — dat verslaat de trucs.',
            ],
            clearedLesson:
                'Sl1mme trucs zijn niet slim: kraaklijsten bevatten alle @-, 0- en 3-variaties van bekende woorden. Onvoorspelbaarheid + lengte werkt wél.',
        },
        {
            id: 'ronde-credential-stuffing',
            title: 'De gelekte lijsten',
            story:
                'De laatste aanvaller koopt gelekte wachtwoordlijsten op het dark web en probeert die automatisch op honderden sites. Bouw een fort voor de eeuwigheid: minstens 100 jaar.',
            attacks: ['brute-force', 'dictionary', 'leet', 'breached'],
            targetSeconds: 100 * YEAR,
            targetLabel: 'minstens 100 jaar',
            hints: [
                'Een passphrase van 3–4 willekeurige woorden met een cijfer of teken is vrijwel onkraakbaar én te onthouden.',
                'Voorbeeldpatroon: "wolk-Gitaar-strand-9!" — lang, uniek en toch makkelijk te onthouden.',
            ],
            clearedLesson:
                'Eén gelekt wachtwoord wordt overal opnieuw geprobeerd (credential stuffing). Uniek per site + lang (passphrase!) is de enige echte verdediging.',
        },
    ],
    badges: [
        {
            minScore: 90,
            emoji: '🏰',
            title: 'Fortmeester',
            color: '#e1ff01',
        },
        {
            minScore: 70,
            emoji: '🛡️',
            title: 'Muurbouwer',
            color: '#202023',
        },
        {
            minScore: 40,
            emoji: '🧱',
            title: 'Poortwachter',
            color: '#202023',
        },
        {
            minScore: 0,
            emoji: '🔑',
            title: 'Beginnend Bouwer',
            color: '#202023',
        },
    ],
    takeaways: [
        'Lengte is de sterkste verdediging: elk extra teken maakt kraken exponentieel trager.',
        'Bekende woorden, namen en jaartallen tellen amper mee — aanvallers proberen ze als eerste.',
        'Leetspeak (@ voor a, 0 voor o) beschermt niet: kraaklijsten bevatten alle variaties.',
        'Eén gelekt wachtwoord wordt via credential stuffing overal opnieuw geprobeerd — gebruik per site een uniek wachtwoord.',
        'Een passphrase van 3–4 willekeurige woorden + cijfer/teken is lang, sterk én te onthouden; een wachtwoordmanager onthoudt de rest.',
    ],
};

export default config;
