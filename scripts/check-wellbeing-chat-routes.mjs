// Gedragstest: de welzijnsmonitor moet op ALLE leerlingchat-routes staan.
//
// Er zijn drie routes waarlangs een leerling vrije tekst naar de AI stuurt:
//   1. de sjabloonroute   — StudentAIChat          → useStudentAssistant
//   2. de oude AiLab-route — AiLab.tsx             → useAgentLogic
//   3. Prompt Master      — PromptMasterMission.tsx (verzendt zelf, eigen tekstvak)
// Route 1 had de monitor vanaf het begin, route 2 en 3 niet: daar was er geen enkel
// vangnet vóór de AI, alleen een systeeminstructie waar het model zich aan moest
// houden. Deze test legt vast dat elke route het vangnet heeft, zodat de bescherming
// niet stilletjes terugvalt naar één of twee routes.
//
// Draaien vanuit de projectroot: node scripts/check-wellbeing-chat-routes.mjs

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const ROUTES = [
    {
        naam: 'sjabloonroute',
        hook: 'src/hooks/useStudentAssistant.ts',
        weergave: 'src/features/ai-chat/StudentAIChat.tsx',
        // De functie die het bericht daadwerkelijk verstuurt. De volgorde-check kijkt
        // bewust binnen déze functie: een scan die ergens anders in het bestand staat
        // zegt niets over het moment waarop het bericht wegkan.
        verzendfunctie: /const handleSend\s*=/,
        aiAanroep: /sendMessage(ToAi(Stream)?)?\s*\(/,
    },
    {
        naam: 'AiLab-route',
        hook: 'src/hooks/useAgentLogic.ts',
        weergave: 'src/features/ai-lab/AiLab.tsx',
        verzendfunctie: /const handleSend\s*=/,
        aiAanroep: /sendMessage(ToAi(Stream)?)?\s*\(/,
    },
    {
        naam: 'Prompt Master',
        // Deze route heeft geen aparte hook: het tekstvak, de verzendlogica en de
        // hulplijnweergave staan in hetzelfde bestand.
        hook: 'src/features/missions/PromptMasterMission.tsx',
        weergave: 'src/features/missions/PromptMasterMission.tsx',
        verzendfunctie: /const handleSubmitPrompt\s*=/,
        aiAanroep: /analyzePromptWithAI\s*\(/,
        // Prompt Master kent punten toe bij een geslaagde poging. Zou de scan daarná
        // staan, dan krijgt een kind in nood een scoremelding over het hulplijnscherm.
        puntenToekenning: /totalScore:\s*prev\.totalScore/,
    },
];

const lees = (pad) => readFile(pad, 'utf8');

/** Eerste positie van `patroon` op of na `vanaf`, of -1. */
const zoekVanaf = (bron, patroon, vanaf) => {
    const rest = bron.slice(vanaf);
    const treffer = rest.search(patroon);
    return treffer === -1 ? -1 : vanaf + treffer;
};

for (const route of ROUTES) {
    const hook = await lees(route.hook);
    const weergave = route.weergave === route.hook ? hook : await lees(route.weergave);

    // 1. De route gebruikt de gedeelde monitor — geen eigen, afwijkende detectie.
    assert.match(hook, /useWellbeingMonitor/,
        `${route.naam}: ${route.hook} moet useWellbeingMonitor gebruiken`);

    // 2. Er wordt daadwerkelijk gescand, en de scan blokkeert het versturen.
    assert.match(hook, /isBlocked/,
        `${route.naam}: de scanuitslag moet het versturen kunnen blokkeren`);

    // 3. De scan staat VÓÓR de aanroep van de AI, binnen de verzendfunctie. Zou hij
    //    erna staan, dan is het bericht al bij het model — precies wat de monitor moet
    //    voorkomen. Een scan buiten de verzendfunctie telt niet mee.
    const verzendIndex = hook.search(route.verzendfunctie);
    assert.notEqual(verzendIndex, -1,
        `${route.naam}: verzendfunctie niet gevonden in ${route.hook}`);

    const aiIndex = zoekVanaf(hook, route.aiAanroep, verzendIndex);
    assert.notEqual(aiIndex, -1,
        `${route.naam}: verwacht een AI-aanroep in de verzendfunctie van ${route.hook}`);

    const scanIndex = zoekVanaf(hook, /isBlocked/, verzendIndex);
    assert.ok(scanIndex !== -1 && scanIndex < aiIndex,
        `${route.naam}: de welzijnscheck moet binnen de verzendfunctie vóór de AI-aanroep staan in ${route.hook}`);

    // 3b. En vóór een eventuele puntentoekenning: een leerling in nood mag geen
    //     scoremelding over het hulplijnscherm heen krijgen.
    if (route.puntenToekenning) {
        const puntenIndex = zoekVanaf(hook, route.puntenToekenning, verzendIndex);
        assert.notEqual(puntenIndex, -1,
            `${route.naam}: verwacht een puntentoekenning in de verzendfunctie van ${route.hook}`);
        assert.ok(scanIndex < puntenIndex,
            `${route.naam}: de welzijnscheck moet vóór de puntentoekenning staan in ${route.hook}`);
    }

    // 4. De docentmelding gaat via dezelfde RPC.
    assert.match(hook, /log_wellbeing_alert/,
        `${route.naam}: de docent moet een melding krijgen via log_wellbeing_alert`);

    // 5. PRIVACY: alleen categorie en tijdstip, nooit de originele tekst. De RPC
    //    kent maar drie parameters; komt er een vierde bij, dan is dat vrijwel
    //    zeker het bericht zelf en moet dit bewust herzien worden.
    const rpcAanroep = hook.slice(hook.indexOf('log_wellbeing_alert'));
    const rpcBlok = rpcAanroep.slice(0, rpcAanroep.indexOf('});') + 3);
    const parameters = [...rpcBlok.matchAll(/\bp_[a-z_]+:/g)].map(m => m[0].slice(0, -1));
    assert.deepEqual(parameters.sort(), ['p_category', 'p_detected_at', 'p_student_id'],
        `${route.naam}: de melding mag alleen categorie, tijdstip en leerling-id bevatten, niet de tekst`);
    assert.doesNotMatch(rpcBlok, /message|text|input|prompt/i,
        `${route.naam}: er mag geen berichttekst meegestuurd worden in de docentmelding`);

    // 6. De leerling ziet dezelfde hulplijnweergave en kan die sluiten.
    assert.match(weergave, /<WellbeingAlert/,
        `${route.naam}: ${route.weergave} moet de hulplijnweergave tonen`);
    assert.match(weergave, /onDismiss=\{dismissHulplijn\}/,
        `${route.naam}: de hulplijnweergave moet te sluiten zijn, anders zit de leerling vast`);
}

// 7. De detectielijst blijft één gedeelde bron. Zou een route zijn eigen
//    termenlijst krijgen, dan lopen de routes weer uiteen.
const monitor = await lees('src/hooks/useWellbeingMonitor.ts');
assert.match(monitor, /WELLBEING_PATTERNS/, 'de gedeelde termenlijst moet bestaan');
for (const route of ROUTES) {
    const hook = await lees(route.hook);
    assert.doesNotMatch(hook, /WELLBEING_PATTERNS/,
        `${route.naam}: de termenlijst hoort alleen in useWellbeingMonitor te staan`);
}

console.log(`Welzijnsmonitor: alle ${ROUTES.length} leerlingchat-routes scannen vóór de AI, melden zonder tekst en tonen de hulplijnen.`);
