// Gedragstest tegen VALSE NEGATIEVEN in de antwoordkwaliteit-poort.
//
// Deze poort bepaalt of een leerling verder mag in 9 debat-missies en of een
// chatbericht punten oplevert. Een leerling die onterecht wordt tegengehouden is
// erger dan een leerling die onterecht punten krijgt, dus de gevallen hieronder
// zijn afkomstig uit een adversariële review en moeten allemaal SLAGEN.
//
// Draaien vanuit de projectroot: node scripts/check-answer-quality-false-negatives.mjs

import { pathToFileURL } from 'node:url';

const HELPER = 'src/features/missions/templates/shared/answerQuality.ts';
const { isMeaningfulAnswer, isRealMessage } = await import(pathToFileURL(HELPER).href);

// Geldige leerlingantwoorden die eerder werden geweigerd.
const MOET_SLAGEN = [
    ['kort maar raak', 'Eerst toestemming vragen aan de docent.'],
    ['drie woorden, ruim 20 tekens', 'Ouders moeten grenzen stellen.'],
    ['cijfers en procenten', '2024: 55% vóór; 45% tegen dit voorstel.'],
    ['opsomming met symbolen', '2FA + pincode + backup zijn samen veiliger.'],
    ['spreektaal met apostrof', "Da's echt niet toegestaan volgens de regels."],
    ['niet-Latijns schrift', 'لا، الخصوصية أهم من الراحة في المدرسة.'],
    ['Cyrillisch', 'Приватность важнее удобства в школе.'],
];

// Onzin die geweigerd MOET blijven; anders is de poort waardeloos geworden.
const MOET_ZAKKEN = [
    ['25 keer dezelfde letter', 'a'.repeat(25)],
    ['vulwoorden van herhaalde tekens', 'aaaa bbbb cccc dddd eeee'],
    ['een woord eindeloos herhaald', 'ja ja ja ja ja ja ja ja ja'],
    ['alleen leestekens', '!!!!! ????? ..... ///// #####'],
    ['te kort', 'Ouders.'],
];

// Chatberichten: één inhoudelijk woord mag punten opleveren.
const CHAT_MOET_SLAGEN = [
    ['vakterm als volledig antwoord', 'phishing'],
    ['afkorting met cijfer', '2FA/MFA'],
    ['niet-Latijns kort antwoord', 'تأكد من المصدر'],
];
const CHAT_MOET_ZAKKEN = [
    ['te kort', 'ja'],
    ['herhaald teken', 'aaaaaaaa'],
];

let gezakt = 0;
const toets = (label, gevallen, fn, verwacht) => {
    for (const [naam, invoer] of gevallen) {
        if (fn(invoer) !== verwacht) {
            gezakt++;
            console.error(`FAIL  ${label} — ${naam}: verwacht ${verwacht}, kreeg ${fn(invoer)}\n      invoer: ${JSON.stringify(invoer)}`);
        }
    }
};

toets('isMeaningfulAnswer moet slagen', MOET_SLAGEN, isMeaningfulAnswer, true);
toets('isMeaningfulAnswer moet zakken', MOET_ZAKKEN, isMeaningfulAnswer, false);
toets('isRealMessage moet slagen', CHAT_MOET_SLAGEN, isRealMessage, true);
toets('isRealMessage moet zakken', CHAT_MOET_ZAKKEN, isRealMessage, false);

if (gezakt > 0) {
    console.error(`\nAnswer-quality false-negative contract failed: ${gezakt} geval(len).`);
    process.exit(1);
}
const totaal = MOET_SLAGEN.length + MOET_ZAKKEN.length + CHAT_MOET_SLAGEN.length + CHAT_MOET_ZAKKEN.length;
console.log(`Answer-quality false-negative contract OK (${totaal} gevallen).`);
