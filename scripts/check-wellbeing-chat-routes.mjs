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

    // 4. De docentmelding loopt via de gedeelde useWellbeingTeacherAlert-hook,
    //    en die hook is als onAlert aan de monitor gekoppeld. De RPC zelf wordt
    //    hieronder één keer streng gecontroleerd in de gedeelde hook.
    assert.match(hook, /useWellbeingTeacherAlert/,
        `${route.naam}: de docentmelding moet via useWellbeingTeacherAlert lopen`);
    assert.match(hook, /onAlert:\s*wellbeingTeacherAlert\.onAlert/,
        `${route.naam}: wellbeingTeacherAlert.onAlert moet als onAlert aan useWellbeingMonitor hangen`);

    // 6. De leerling ziet dezelfde hulplijnweergave en kan die sluiten. De
    //    weergave belooft de docentmelding alleen bij bevestigde aflevering.
    assert.match(weergave, /<WellbeingAlert/,
        `${route.naam}: ${route.weergave} moet de hulplijnweergave tonen`);
    assert.match(weergave, /onDismiss=\{dismissHulplijn\}/,
        `${route.naam}: de hulplijnweergave moet te sluiten zijn, anders zit de leerling vast`);
    assert.match(weergave, /teacherNotified=\{(wellbeingTeacherNotifiedFor|wellbeingTeacherAlert\.notifiedFor)\(wellbeingMatch\?\.category\)\}/,
        `${route.naam}: de hulplijnweergave mag de docentmelding alleen beloven via de bevestigde status van de eigen categorie`);
}

// 5. PRIVACY + betrouwbaarheid van de docentmelding, één keer in de gedeelde
//    hook: alleen categorie, tijdstip en leerling-id — nooit de originele
//    tekst — en de melding geldt pas als verstuurd na een gecontroleerd
//    RPC-resultaat (Supabase geeft fouten als error-veld terug, niet als
//    exception).
const teacherAlertHook = await lees('src/hooks/useWellbeingTeacherAlert.ts');
assert.match(teacherAlertHook, /log_wellbeing_alert/,
    'useWellbeingTeacherAlert: de docentmelding moet via log_wellbeing_alert lopen');
const rpcAanroep = teacherAlertHook.slice(teacherAlertHook.indexOf('log_wellbeing_alert'));
const rpcBlok = rpcAanroep.slice(0, rpcAanroep.indexOf('});') + 3);
const parameters = [...rpcBlok.matchAll(/\bp_[a-z_]+:/g)].map(m => m[0].slice(0, -1));
assert.deepEqual(parameters.sort(), ['p_category', 'p_detected_at', 'p_student_id'],
    'useWellbeingTeacherAlert: de melding mag alleen categorie, tijdstip en leerling-id bevatten, niet de tekst');
assert.doesNotMatch(rpcBlok, /message|text|input|prompt/i,
    'useWellbeingTeacherAlert: er mag geen berichttekst meegestuurd worden in de docentmelding');
assert.match(teacherAlertHook, /if\s*\(error\)\s*throw error/,
    'useWellbeingTeacherAlert: het error-veld van de RPC-respons moet gecontroleerd worden');
assert.match(teacherAlertHook, /notifiedFor/,
    'useWellbeingTeacherAlert: de afleverstatus moet per categorie opvraagbaar zijn');
const bevestigIndex = teacherAlertHook.search(/if\s*\(error\)\s*throw error/);
const registratieIndex = zoekVanaf(teacherAlertHook, /confirmedAtRef\.current\[category\]\s*=\s*Date\.now\(\)/, 0);
assert.ok(registratieIndex > bevestigIndex && bevestigIndex !== -1,
    'useWellbeingTeacherAlert: een aflevering mag pas als bevestigd geregistreerd worden ná de error-check');
assert.match(teacherAlertHook, /pendingCategories/,
    'useWellbeingTeacherAlert: per categorie mag maximaal één verzoek tegelijk lopen');

// 7. De detectielijst blijft één gedeelde bron. Zou een route zijn eigen
//    termenlijst krijgen, dan lopen de routes weer uiteen.
const monitor = await lees('src/hooks/useWellbeingMonitor.ts');
assert.match(monitor, /WELLBEING_PATTERNS/, 'de gedeelde termenlijst moet bestaan');
for (const route of ROUTES) {
    const hook = await lees(route.hook);
    assert.doesNotMatch(hook, /WELLBEING_PATTERNS/,
        `${route.naam}: de termenlijst hoort alleen in useWellbeingMonitor te staan`);
}

// 8. Ook de twee template-scanroutes (vrije tekst zonder chat) dragen het
//    volledige vangnet: monitor, blokkade, docentmelding via de gedeelde hook
//    en een overlay die de melding alleen bij bevestigde aflevering belooft.
const SCAN_ROUTES = [
    {
        naam: 'Puzzle Lab',
        bestand: 'src/features/missions/templates/puzzle-lab/PuzzleLab.tsx',
        // De functie die het antwoord verwerkt, en de eerste echte verwerking
        // daarbinnen: de scan moet dáárvoor staan, anders is het antwoord al
        // beoordeeld voordat het welzijnssignaal de inzending kan blokkeren.
        verzendfunctie: /const checkAnswer\s*=/,
        verwerking: /const correct\s*=/,
    },
    {
        naam: 'Data Viewer',
        bestand: 'src/features/missions/templates/data-viewer/DataViewer.tsx',
        verzendfunctie: /const handleSubmitQuestion\s*=/,
        verwerking: /newAnswers/,
    },
];
for (const route of SCAN_ROUTES) {
    const bron = await lees(route.bestand);
    assert.match(bron, /useWellbeingMonitor/,
        `${route.naam}: moet useWellbeingMonitor gebruiken`);
    assert.match(bron, /useWellbeingTeacherAlert/,
        `${route.naam}: de docentmelding moet via useWellbeingTeacherAlert lopen`);
    assert.match(bron, /onAlert:\s*teacherAlert\.onAlert/,
        `${route.naam}: teacherAlert.onAlert moet als onAlert aan useWellbeingMonitor hangen`);

    // De scan staat binnen de verwerkingsfunctie en VÓÓR de eerste verwerking.
    const verzendIndex = bron.search(route.verzendfunctie);
    assert.notEqual(verzendIndex, -1,
        `${route.naam}: verwerkingsfunctie niet gevonden in ${route.bestand}`);
    const scanIndex = zoekVanaf(bron, /isBlocked/, verzendIndex);
    const verwerkIndex = zoekVanaf(bron, route.verwerking, verzendIndex);
    assert.ok(scanIndex !== -1 && verwerkIndex !== -1 && scanIndex < verwerkIndex,
        `${route.naam}: de welzijnscheck moet binnen de verwerkingsfunctie vóór de verwerking staan`);

    assert.match(bron, /<WellbeingAlert/,
        `${route.naam}: moet de hulplijnweergave tonen`);
    assert.match(bron, /teacherNotified=\{teacherAlert\.notifiedFor\(\(blockedMatch \?\? wellbeingMatch\)\?\.category\)\}/,
        `${route.naam}: de hulplijnweergave mag de docentmelding alleen beloven via de bevestigde status van de eigen categorie`);
    assert.match(bron, /dismissHulplijn\(\)/,
        `${route.naam}: de hulplijnweergave moet te sluiten zijn`);
    assert.doesNotMatch(bron, /WELLBEING_PATTERNS/,
        `${route.naam}: de termenlijst hoort alleen in useWellbeingMonitor te staan`);
}

console.log(`Welzijnsmonitor: alle ${ROUTES.length} leerlingchat-routes en ${SCAN_ROUTES.length} scanroutes scannen vóór verwerking, melden zonder tekst en tonen de hulplijnen.`);
