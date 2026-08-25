import type { ScenarioRound } from '../types';

/**
 * De pure scoreformules van de scenario-engine. Bewust JSX-vrij en zonder
 * React- of Vite-afhankelijkheden, zodat een contracttest ze rechtstreeks kan
 * aanroepen. FeedbackBanner.tsx toont wat hier wordt uitgerekend.
 */

/** Schaal waarop de scoreRound-functies hieronder rekenen. */
export const ITEM_SCORE_SCALE = 25;

/**
 * Bovengrens op de aftrek van één onterechte selectie. Zonder deze grens kost bij
 * een ronde met maar één afleider die ene misser de hele ronde: in
 * `veilig-internet` (5 juist, 1 afleider) leverde alle vijf signalen herkennen én
 * de afleider aanvinken 0 van 25 op. Nu kost dat de helft.
 */
const MAX_FALSE_PENALTY = 0.5;

/**
 * Evenredige aftrek: het aandeel juist aangevinkte items minus een aftrek per
 * onterecht aangevinkt item. De aftrek is 1/aantal-afleiders, zodat "vink alles
 * aan" op 0 uitkomt, maar begrensd op MAX_FALSE_PENALTY zodat één misser bij een
 * ronde met één afleider niet alles wist.
 */
function scoreSelectCorrect(items: ScenarioRound['items'], selections: number[]): number {
    const correctIds = items.filter((i) => i.correct).map((i) => i.id);
    const incorrectIds = items.filter((i) => !i.correct).map((i) => i.id);
    // Ontdubbelen: een bewerkte opslag met zevenmaal hetzelfde id telde die zeven
    // keer mee en gaf 35 van de 25 punten. Eén item kan maar één keer geselecteerd zijn.
    const unique = [...new Set(selections)];
    const correctSelected = unique.filter((id) => correctIds.includes(id)).length;
    const incorrectSelected = unique.filter((id) => incorrectIds.includes(id)).length;
    // Zonder juiste items valt er niets te vinden: dan telt alleen de aftrek.
    // Zonder onjuiste items is er niets fout te doen: dan telt alleen de treffer.
    const hitRate = correctIds.length > 0 ? correctSelected / correctIds.length : 1;
    const penaltyPerFalse = incorrectIds.length > 0
        ? Math.min(1 / incorrectIds.length, MAX_FALSE_PENALTY)
        : 0;
    const penalty = penaltyPerFalse * incorrectSelected;
    return Math.max(0, Math.round((hitRate - penalty) * ITEM_SCORE_SCALE));
}

/**
 * Volgorde-accuratesse afgezet tegen de verwachte gokscore, net als
 * scoreBinaryChoice. De ruwe fractie telt een item vol wanneer het exact op zijn
 * plek staat en half wanneer het er één positie naast staat. Bij een willekeurige
 * volgorde levert dat gemiddeld al veel op: verwacht 1 item exact goed plus
 * 2*(n-1)/n buurtreffers van een half, samen (2n-1)/n van de n items — dus een
 * verwachte gokfractie van (2n-1)/n². Die baseline trekken we eraf en we
 * normaliseren de rest, zodat willekeurig slepen rond de 0 uitkomt en een
 * foutloze volgorde exact het maximum blijft opleveren.
 */
function scoreOrderPriority(items: ScenarioRound['items'], order: number[]): number {
    if (items.length === 0) return 0;
    if (order.length !== items.length) return 0;
    let correct = 0;
    for (let i = 0; i < order.length; i++) {
        // Geen non-null-assert: na een config-wijziging kan een opgeslagen id
        // verdwenen zijn, en deze functie draait bij elke render via totalScore.
        const item = items.find((it) => it.id === order[i]);
        if (!item) continue;
        if (item.correctPosition === i) correct++;
        else if (Math.abs((item.correctPosition ?? 0) - i) === 1) correct += 0.5;
    }
    const n = items.length;
    const rawFraction = correct / n;
    // Verwachte gokscore: wat een volledig willekeurige volgorde gemiddeld oplevert.
    const baseline = (2 * n - 1) / (n * n);
    // Bij één item valt er niets te gokken (baseline 1); dan telt de kale fractie,
    // anders zou een foutloos antwoord onhaalbaar zijn.
    if (baseline >= 1) return Math.round(rawFraction * ITEM_SCORE_SCALE);
    const normalized = Math.max(0, (rawFraction - baseline) / (1 - baseline));
    return Math.round(normalized * ITEM_SCORE_SCALE);
}

/**
 * Accuratesse afgezet tegen de beste gok-strategie. De ondergrens is het aandeel
 * van de grootste klasse: precies wat je haalt door overal hetzelfde te
 * antwoorden. Wie dat doet komt dus op 0 uit, ongeacht hoe scheef de set verdeeld
 * is — in `cookie-crusher` (2 accepteren, 4 weigeren) leverde overal "Weigeren"
 * met juist-minus-fout nog 8 van 25 op.
 *
 * De eerdere klassegebalanceerde vorm (aandeel goed per klasse, min 1) zette
 * gokken ook op 0, maar woog een kleine klasse veel zwaarder: bij `cookie-crusher`
 * gaf één fout op een accepteer-item 13 van 25 en één fout op een weiger-item 19
 * van 25, terwijl beide leerlingen 5 van de 6 goed hadden. Deze vorm telt fouten
 * gelijk: evenveel fouten geeft dezelfde score, waar ze ook vallen.
 *
 * Onbeantwoorde items tellen als fout. Een item dat zowel geaccepteerd als
 * geweigerd in de opslag staat, telt als niet beantwoord — anders zou beide
 * varianten opslaan gratis punten opleveren.
 */
function scoreBinaryChoice(items: ScenarioRound['items'], selections: number[]): number {
    if (items.length === 0) return 0;
    const accepted = new Set(selections.filter((id) => id > 0));
    const rejected = new Set(selections.filter((id) => id < 0).map((id) => -id));
    let correctCount = 0;
    let acceptTotal = 0;
    for (const item of items) {
        if (item.correct === true) acceptTotal++;
        const saidAccept = accepted.has(item.id);
        const saidReject = rejected.has(item.id);
        if (saidAccept === saidReject) continue; // niet of dubbel beantwoord
        if (saidAccept === (item.correct === true)) correctCount++;
    }
    const total = items.length;
    const rejectTotal = total - acceptTotal;
    const accuracy = correctCount / total;
    // Beste vaste strategie: altijd de grootste klasse kiezen.
    const guessBaseline = Math.max(acceptTotal, rejectTotal) / total;
    // Eén klasse: er valt niets te gokken, dus telt kale accuratesse. Anders zou
    // een foutloos antwoord onhaalbaar zijn (baseline 1).
    if (guessBaseline >= 1) return Math.round(accuracy * ITEM_SCORE_SCALE);
    const normalized = (accuracy - guessBaseline) / (1 - guessBaseline);
    return Math.max(0, Math.round(normalized * ITEM_SCORE_SCALE));
}

/**
 * De speelse rondevormen zijn presentatievarianten: ze slaan hun antwoord op in
 * exact hetzelfde formaat als hun klassieke tegenhanger en worden daarom met
 * dezelfde formule beoordeeld. Zo levert een missie die overstapt op slepen
 * dezelfde score op als daarvoor, en blijft opgeslagen voortgang geldig.
 */
const SCORING_KIND: Record<ScenarioRound['type'], 'select-correct' | 'order-priority' | 'binary-choice'> = {
    'select-correct': 'select-correct',
    'order-priority': 'order-priority',
    'binary-choice': 'binary-choice',
    'spot-the-flags': 'select-correct',
    'order-drag': 'order-priority',
    'inbox-triage': 'binary-choice',
};

/** Welke scoreformule bij dit rondetype hoort. */
export function scoringKind(round: ScenarioRound): 'select-correct' | 'order-priority' | 'binary-choice' {
    return SCORING_KIND[round.type];
}

/**
 * Itemscore op de vaste schaal 0–25. De begrenzing staat hier, zodat geen enkele
 * deelformule — en geen enkele bewerkte opslag — er langs kan: een selectielijst
 * met herhaalde id's gaf eerder 35 van de 25.
 */
export function scoreRound(round: ScenarioRound, selections: number[]): number {
    const raw = (() => {
        switch (scoringKind(round)) {
            case 'select-correct': return scoreSelectCorrect(round.items, selections);
            case 'order-priority': return scoreOrderPriority(round.items, selections);
            case 'binary-choice': return scoreBinaryChoice(round.items, selections);
        }
    })();
    if (!Number.isFinite(raw)) return 0;
    return Math.max(0, Math.min(raw, ITEM_SCORE_SCALE));
}

/** Punten binnen round.maxScore die voor de followUp-vraag gereserveerd zijn. */
export function followUpWeight(round: ScenarioRound): number {
    if (!round.followUp) return 0;
    return Math.max(0, Math.min(round.followUpWeight ?? 0, round.maxScore));
}

/**
 * Maximaal haalbare itemscore: alle punten van de ronde, min wat voor de
 * followUp-vraag gereserveerd is.
 *
 * Eerder viel dit zonder followUpWeight terug op de vaste schaal van 25 die
 * scoreRound hanteert. Bij een ronde met een afwijkende `maxScore` bleef de rest
 * daardoor onbereikbaar: in `online-helden` (rondes van 30, 40 en 30) leverde
 * een foutloos antwoord 75 van de 100 punten op, terwijl de slaagdrempel wél
 * tegen 100 rekent. Voor de elf andere scenario-missies staat elke ronde op 25
 * en verandert er niets.
 */
export function itemsMaxScore(round: ScenarioRound): number {
    return Math.max(0, round.maxScore - followUpWeight(round));
}

/** Itemscore geschaald naar itemsMaxScore. Bij een ronde van 25 identiek aan scoreRound. */
export function scaledItemScore(round: ScenarioRound, selections: number[]): number {
    const base = scoreRound(round, selections);
    const max = itemsMaxScore(round);
    if (max === ITEM_SCORE_SCALE) return base;
    return Math.round((base / ITEM_SCORE_SCALE) * max);
}
