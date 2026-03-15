/**
 * Didactische Onderbouwing PDF Service
 *
 * Genereert een professionele, gebrandede PDF van het DGSkills didactische onderbouwingsplan.
 * Gebruikt de gedeelde pdfBrandingService voor consistente huisstijl.
 */

import {
    createBrandedPdf,
    sectionTitle,
    subSectionTitle,
    paragraph,
    bulletPoint,
    drawTable,
    highlightBox,
    spacer,
    divider,
    finalizePdf,
    BRAND,
    type TableColumn,
} from './pdfBrandingService';

export async function generateDidactischeOnderbouwingPDF(): Promise<void> {
    const { jsPDF } = await import('jspdf');

    const ctx = createBrandedPdf(jsPDF, {
        title: 'Didactische Onderbouwing',
        subtitle: 'Het leermodel achter DGSkills — met bronverwijzingen en SLO-mapping',
        author: 'Yorin von der Heiden, oprichter DGSkills & docent VO',
        date: 'Maart 2026 — Versie 1.0',
        showFooter: true,
    });

    // ── Introductie ──────────────────────────────────────────────────────────
    highlightBox(ctx,
        'Dit document legt uit welk leermodel erachter zit, waarom AI-begeleiding werkt voor deze doelgroep, en hoe elke missie aansluit bij de SLO-kerndoelen Digitale Geletterdheid. Deel het met je ICT-coördinator, je sectie-overleg, of je schoolleiding.',
        { type: 'info' },
    );

    spacer(ctx, 4);

    // ── De kern: leren door te bouwen ─────────────────────────────────────────
    sectionTitle(ctx, 'De kern: leren door te bouwen');
    paragraph(ctx, 'DGSkills is gebouwd vanuit één overtuiging: leerlingen leren digitale vaardigheden niet door erover te lezen, maar door ze te gebruiken. Niet een PowerPoint over privacy, maar zelf een datalek analyseren. Niet een filmpje over AI, maar zelf een chatbot trainen.', { bold: true });
    spacer(ctx, 2);
    paragraph(ctx, 'Dat is geen nieuw idee. Constructivisme (Piaget, Papert) zegt al decennia dat kennis ontstaat door actief te doen. Maar in de praktijk is "leren door doen" bij digitale geletterdheid lastig — je hebt gereedschap nodig, begeleiding, en een veilige omgeving om fouten te maken. Dat is precies wat DGSkills biedt.');
    spacer(ctx, 4);

    // ── De 3-stappen methode ─────────────────────────────────────────────────
    sectionTitle(ctx, 'De 3-stappen methode');
    paragraph(ctx, 'Elke missie volgt dezelfde structuur. Niet omdat het makkelijk is voor ons, maar omdat voorspelbaarheid werkt voor leerlingen — zeker voor leerlingen die structuur nodig hebben.');
    spacer(ctx, 2);

    subSectionTitle(ctx, 'Stap 1 — Eerste poging');
    paragraph(ctx, 'De leerling doet een eerste poging. Het maakt niet uit of het perfect is. Het punt is: beginnen. De AI geeft een reactie, benoemt wat goed gaat, en stelt één vervolgvraag.');
    spacer(ctx, 2);

    subSectionTitle(ctx, 'Stap 2 — Verbeteren');
    paragraph(ctx, 'De leerling krijgt gericht feedback op één verbeterpunt. Niet drie dingen tegelijk, niet een hele lijst. Eén ding, concreet, met een voorbeeld. De leerling verbetert en stuurt opnieuw in.');
    spacer(ctx, 2);

    subSectionTitle(ctx, 'Stap 3 — Meesterschap');
    paragraph(ctx, 'Pas als alle criteria groen zijn, is de stap af. De leerling heeft bewezen dat het niet alleen een poging was, maar dat de vaardigheid beheerst wordt.');
    spacer(ctx, 2);

    highlightBox(ctx,
        'Dit is scaffolding in de praktijk — het concept van Vygotsky\'s Zone van Naaste Ontwikkeling. De AI-mentor houdt de taak net buiten wat de leerling alleen kan, maar binnen bereik met hulp. Na elke ronde trekt de steiger een stukje terug. Het verschil met een docent: de AI heeft oneindig geduld.',
        { type: 'success' },
    );
    spacer(ctx, 4);

    // ── AI als mentor ────────────────────────────────────────────────────────
    sectionTitle(ctx, 'AI als mentor, niet als antwoordmachine');
    paragraph(ctx, 'Hier zit het grootste misverstand over AI in het onderwijs: mensen denken dat het de antwoorden geeft. Bij DGSkills doet de AI precies het tegenovergestelde.');
    spacer(ctx, 2);

    subSectionTitle(ctx, 'Wat de AI wél doet:');
    bulletPoint(ctx, 'Diagnosevragen stellen — "Welke blokken heb je nu in je werkruimte?" i.p.v. "Zet blok X neer"');
    bulletPoint(ctx, 'Hints geven op drie niveaus — klein, groter, en pas als het écht niet lukt: het antwoord');
    bulletPoint(ctx, 'Verificatie — De AI vraagt om bewijs. "Wat zie je op je scherm?" voorkomt dat leerlingen zeggen dat ze klaar zijn zonder iets gedaan te hebben');
    bulletPoint(ctx, 'Farming detecteren — Zinloze berichten om XP te scoren worden herkend en geweigerd');
    spacer(ctx, 2);

    subSectionTitle(ctx, 'Wat de AI niet doet:');
    bulletPoint(ctx, 'Antwoorden voorzeggen');
    bulletPoint(ctx, 'Lange lappen tekst sturen (max 2-3 zinnen per reactie)');
    bulletPoint(ctx, 'Beoordelen zonder verificatie');
    spacer(ctx, 2);

    paragraph(ctx, 'Onderzoeksbasis: Hattie (2009) toont aan dat formatieve feedback — specifiek, tijdig, en actionable — een effectgrootte van 0.73 heeft. Dat is meer dan huiswerk (0.29) en bijna dubbel zoveel als directe instructie (0.59). De AI in DGSkills geeft precies dat type feedback, bij elke interactie.', { italic: true, color: BRAND.textLight });
    spacer(ctx, 4);

    // ── Bloom's taxonomie ────────────────────────────────────────────────────
    sectionTitle(ctx, "Bloom's taxonomie: niet alles is 'onthouden'");
    paragraph(ctx, 'Een veelgemaakte fout bij digitale geletterdheid: alles wordt quiz-achtig. "Wat is phishing?" Dat is Bloom\'s niveau 1 — onthouden. Prima als basis, maar je leert er niet van navigeren in de echte digitale wereld.');
    spacer(ctx, 2);
    paragraph(ctx, 'DGSkills is bewust opgebouwd langs Bloom\'s niveaus:');
    spacer(ctx, 2);

    const bloomColumns: TableColumn[] = [
        { header: 'Bloom-niveau', width: 20 },
        { header: 'Wat de leerling doet', width: 35 },
        { header: 'Voorbeeldmissie', width: 45 },
    ];
    const bloomRows = [
        ['Onthouden', 'Tools herkennen en benoemen', 'Magister Master, Cloud Commander'],
        ['Begrijpen', 'Uitleggen waarom iets werkt', 'Prompt Master (criteria benoemen)'],
        ['Toepassen', 'Vaardigheden inzetten in context', 'Game Director (codeblokken)'],
        ['Analyseren', 'Data en patronen ontleden', 'Data Detective, Filterbubbel'],
        ['Evalueren', 'Keuzes beoordelen', 'Data-Handelaar, AI-Ethicus'],
        ['Creëren', 'Iets nieuws maken en presenteren', 'Verhalen Ontwerper, Meesterproef'],
    ];
    drawTable(ctx, bloomColumns, bloomRows);

    paragraph(ctx, 'Leerjaar 1 begint bij Onthouden en Toepassen. Leerjaar 2 verschuift naar Analyseren en Evalueren. Leerjaar 3 eindigt bij Creëren — een eigen prototype bouwen en pitchen.', { italic: true, color: BRAND.textLight });
    spacer(ctx, 4);

    // ── SLO-kerndoelen ───────────────────────────────────────────────────────
    sectionTitle(ctx, 'SLO-kerndoelen: elke missie telt');
    paragraph(ctx, 'Vanaf augustus 2027 zijn de SLO-kerndoelen Digitale Geletterdheid verplicht. Elke missie in DGSkills is direct gekoppeld aan een of meer kerndoelen. Dat is geen achteraf-label — de missie ís het kerndoel.');
    spacer(ctx, 2);

    const sloColumns: TableColumn[] = [
        { header: 'SLO-code', width: 12 },
        { header: 'Kerndoel', width: 40 },
        { header: '#', width: 8, align: 'right' },
        { header: 'Voorbeelden', width: 40 },
    ];
    const sloRows = [
        ['21A', 'Digitale systemen begrijpen', '12', 'Magister Master, Network Nav.'],
        ['21B', 'Media & informatie beoordelen', '8', 'Data Detective, Factchecker'],
        ['21C', 'Data verzamelen en verwerken', '9', 'Spreadsheet Specialist'],
        ['21D', 'AI begrijpen en toepassen', '14', 'Prompt Master, AI-Trainer'],
        ['22A', 'Digitale producten maken', '11', 'Game Director, Brand Builder'],
        ['22B', 'Programmeren & comp. thinking', '10', 'Web Developer, Bug Hunter'],
        ['23A', 'Veiligheid en privacy', '9', 'Social Safeguard, Cyber Det.'],
        ['23B', 'Digitaal welzijn', '6', 'AI-Spiegel, Filter Bubble Br.'],
        ['23C', 'Maatschappelijke impact', '8', 'AI-Ethicus, Digital Divide'],
    ];
    drawTable(ctx, sloColumns, sloRows);

    highlightBox(ctx,
        'Het docentendashboard toont realtime per leerling welke kerndoelen zijn behaald, welke in progress zijn, en welke nog niet zijn aangeraakt. Bij een inspectiebezoek open je het dashboard en laat je zien: "Dit is waar we staan."',
        { type: 'success' },
    );
    spacer(ctx, 4);

    // ── Differentiatie ───────────────────────────────────────────────────────
    sectionTitle(ctx, 'Differentiatie: niet één maat voor iedereen');

    subSectionTitle(ctx, 'Per onderwijsniveau');
    bulletPoint(ctx, 'VMBO/MAVO: Focus op praktische vaardigheden en directe toepasbaarheid');
    bulletPoint(ctx, 'HAVO/VWO: Meer analyse, ethische reflectie en zelfstandig onderzoek');
    bulletPoint(ctx, 'VSO: Aangepaste kerndoelen (18A-20B) met extra concrete voorbeelden en kortere opdrachten');
    spacer(ctx, 2);

    subSectionTitle(ctx, 'Per leerling');
    bulletPoint(ctx, 'Leerlingen die vastlopen krijgen automatisch hints — eerst klein, dan groter');
    bulletPoint(ctx, 'Leerlingen die sneller gaan krijgen bonusopdrachten aangeboden');
    bulletPoint(ctx, 'De docent kan via het dashboard specifieke missies toewijzen of afsluiten per klas');
    spacer(ctx, 2);

    subSectionTitle(ctx, 'Inclusief ontwerp');
    paragraph(ctx, 'Elke missie begint met een genummerd stappenplan. Dat is niet alleen prettig voor leerlingen met ASS of ADHD — het helpt alle leerlingen. Instructies zijn expliciet, voorbeelden zijn concreet, en interactieve elementen zijn altijd zichtbaar.');
    spacer(ctx, 4);

    // ── Gamificatie ──────────────────────────────────────────────────────────
    sectionTitle(ctx, 'Gamificatie: motivatie zonder trucjes');
    paragraph(ctx, 'XP, levels, badges — het klinkt als een spelletje. Maar de gamificatie in DGSkills is bewust ontworpen om intrinsieke motivatie te versterken, niet te vervangen.');
    spacer(ctx, 2);

    subSectionTitle(ctx, 'Wat we wel doen:');
    bulletPoint(ctx, 'XP als beloning voor afgeronde stappen (niet voor het insturen van willekeurige berichten)');
    bulletPoint(ctx, 'Levels die nieuwe missies ontgrendelen');
    bulletPoint(ctx, 'Een leaderboard per klas dat gezonde competitie stimuleert');
    bulletPoint(ctx, 'Badges voor specifieke prestaties');
    spacer(ctx, 2);

    subSectionTitle(ctx, 'Wat we niet doen:');
    bulletPoint(ctx, 'XP geven voor zinloze interacties (farming-detectie blokkeert dit)');
    bulletPoint(ctx, 'Straffen voor fouten — fouten zijn leermomenten');
    bulletPoint(ctx, 'Leerlingen dwingen om te herhalen wat ze al beheersen');
    spacer(ctx, 2);

    paragraph(ctx, 'Onderzoeksbasis: Deci & Ryan\'s Self-Determination Theory (1985) stelt dat motivatie groeit bij autonomie, competentie-ervaring en verbondenheid. DGSkills biedt alle drie: keuze in missievolgorde (autonomie), directe feedback en XP (competentie), en peer feedback en leaderboards (verbondenheid).', { italic: true, color: BRAND.textLight });
    spacer(ctx, 4);

    // ── Veiligheid ───────────────────────────────────────────────────────────
    sectionTitle(ctx, 'Veiligheid: geen experiment met kinderen');
    paragraph(ctx, 'AI in het onderwijs vraagt om verantwoordelijkheid. Dit is wat wij doen:');
    spacer(ctx, 2);

    bulletPoint(ctx, 'Welzijnsprotocol: Als een leerling signalen van nood uit (zelfbeschadiging, pesten, geweld), stopt de AI met de missie en verwijst naar de Kindertelefoon (0800-0432) en 113');
    bulletPoint(ctx, 'Contentfiltering: Scheldwoorden, geweldstaal en ongepaste content worden geblokkeerd — zowel in AI-reacties als in peer feedback');
    bulletPoint(ctx, 'Data in Europa: Alle data wordt verwerkt in EU-datacenters (europe-west4, Nederland)');
    bulletPoint(ctx, 'Geen tracking buiten het platform: Geen third-party analytics, geen advertenties, geen doorverkoop van leerlingdata');
    bulletPoint(ctx, 'AVG-compliant: DPIA uitgevoerd, verwerkingsovereenkomst beschikbaar, privacy by design');
    spacer(ctx, 4);

    // ── Samenwerkend leren ────────────────────────────────────────────────────
    sectionTitle(ctx, 'Samenwerkend leren: niet alleen achter een scherm');
    paragraph(ctx, 'Digitale geletterdheid is geen soloproject. DGSkills bouwt samenwerking in op drie manieren:');
    spacer(ctx, 2);

    bulletPoint(ctx, 'Peer feedback — Leerlingen geven feedback op elkaars werk (positief, suggestie, of vraag). Met een minimale lengte van 10 tekens en een filter op ongepaste taal.');
    bulletPoint(ctx, 'AI Beleid Brainstorm — De hele klas bedenkt samen het AI-beleid van de school. Met een stemsysteem zodat de beste ideeën bovendrijven.');
    bulletPoint(ctx, 'Drawing Duel — Leerlingen tekenen tegen elkaar terwijl de AI beoordeelt. Competitie en creativiteit in één.');
    spacer(ctx, 4);

    // ── Wat ik zie in de klas ─────────────────────────────────────────────────
    sectionTitle(ctx, 'Wat ik zie in de klas');

    highlightBox(ctx,
        'Ik ben zelf docent. Ik gebruik dit platform met mijn eigen leerlingen. Dit is geen marketingverhaal — dit is wat ik elke week zie gebeuren.',
        { type: 'warning' },
    );
    spacer(ctx, 2);

    bulletPoint(ctx, 'Leerlingen die normaal afhaken bij "open je boek op pagina 34" gaan vanzelf aan de slag als ze een chatbot mogen trainen');
    bulletPoint(ctx, 'De 3-stappen structuur geeft houvast — leerlingen weten precies waar ze zijn en wat de volgende stap is');
    bulletPoint(ctx, 'De AI-mentor vangt de leerlingen op die anders hun vinger niet opsteken — ze durven "domme vragen" te stellen aan een AI die niet oordeelt');
    bulletPoint(ctx, 'Docenten die zeggen "ik weet niet genoeg van AI om dit te geven" merken dat het platform de vakkennis biedt — zij begeleiden het proces');
    spacer(ctx, 4);

    // ── Samenvatting ─────────────────────────────────────────────────────────
    sectionTitle(ctx, 'Samenvatting');

    const summaryColumns: TableColumn[] = [
        { header: 'Aspect', width: 30 },
        { header: 'DGSkills aanpak', width: 70 },
    ];
    const summaryRows = [
        ['Leermodel', 'Constructivisme + scaffolding (Vygotsky)'],
        ['Feedback', 'Formatief, AI-gestuurd, max 1 verbeterpunt per ronde'],
        ['Bloom-niveaus', 'Van Onthouden (J1) tot Creëren (J3)'],
        ['SLO-kerndoelen', '9 kerndoelen, elke missie direct gekoppeld'],
        ['Differentiatie', 'Per niveau (VMBO/HAVO/VWO/VSO), per leerling'],
        ['Gamificatie', 'XP, levels, badges — met farming-detectie'],
        ['Veiligheid', 'Welzijnsprotocol, contentfilter, data in EU'],
        ['Samenwerking', 'Peer feedback, brainstorms, duels'],
        ['Verantwoording', 'Realtime dashboard per leerling, per kerndoel'],
    ];
    drawTable(ctx, summaryColumns, summaryRows);
    spacer(ctx, 4);

    // ── Referenties ──────────────────────────────────────────────────────────
    sectionTitle(ctx, 'Referenties');

    const refs = [
        'Bloom, B.S. (1956). Taxonomy of Educational Objectives. Longmans, Green.',
        'Deci, E.L. & Ryan, R.M. (1985). Intrinsic Motivation and Self-Determination in Human Behavior. Plenum Press.',
        'Hattie, J. (2009). Visible Learning. Routledge.',
        'Papert, S. (1980). Mindstorms: Children, Computers, and Powerful Ideas. Basic Books.',
        'SLO (2024). Kerndoelen Digitale Geletterdheid. Nationaal Expertisecentrum Leerplanontwikkeling.',
        'Vygotsky, L.S. (1978). Mind in Society: The Development of Higher Psychological Processes. Harvard University Press.',
    ];

    for (const ref of refs) {
        paragraph(ctx, ref, { fontSize: 8, color: BRAND.textLight });
    }

    spacer(ctx, 6);

    // ── Slottekst ────────────────────────────────────────────────────────────
    divider(ctx, { color: BRAND.primary, thick: true });
    paragraph(ctx, 'Dit document is onderdeel van het DGSkills implementatiepakket. Voor vragen: neem contact op via het platform op dgskills.app.', { fontSize: 8, italic: true, color: BRAND.muted });

    finalizePdf(ctx, 'DGSkills_Didactische_Onderbouwing.pdf');
}
