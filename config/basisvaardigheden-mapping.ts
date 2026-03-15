// Basisvaardigheden-mapping — DGSkills
// Koppelt elke missie aan raakvlakken met taal, rekenen en burgerschap.
// Gebaseerd op wat de leerling DOET in de missie.

import { BasisvaardigheidTag, BasisvaardighedenCategorie, MissieBasisvaardigheden } from '@/types/slo';

// ============================================================================
// Tag-fabrieken (voorkomt herhaling)
// ============================================================================

const taal = (subcategorie: string, label: string, toelichting: string): BasisvaardigheidTag => ({
  categorie: 'taal', subcategorie, label, toelichting,
});

const rekenen = (subcategorie: string, label: string, toelichting: string): BasisvaardigheidTag => ({
  categorie: 'rekenen', subcategorie, label, toelichting,
});

const burgerschap = (subcategorie: string, label: string, toelichting: string): BasisvaardigheidTag => ({
  categorie: 'burgerschap', subcategorie, label, toelichting,
});

// ============================================================================
// Herbruikbare tags
// ============================================================================

const SCHRIJFVAARDIGHEID = (toelichting: string) =>
  taal('schrijfvaardigheid', 'Schrijfvaardigheid', toelichting);

const LEESVAARDIGHEID = (toelichting: string) =>
  taal('leesvaardigheid', 'Leesvaardigheid', toelichting);

const BEGRIJPEND_LEZEN = (toelichting: string) =>
  taal('begrijpend-lezen', 'Begrijpend lezen', toelichting);

const FORMULEREN = (toelichting: string) =>
  taal('formuleren', 'Formuleren', toelichting);

const LOGISCH_REDENEREN = (toelichting: string) =>
  rekenen('logisch-redeneren', 'Logisch redeneren', toelichting);

const GRAFIEKEN = (toelichting: string) =>
  rekenen('grafieken', 'Grafieken', toelichting);

const PATRONEN = (toelichting: string) =>
  rekenen('patronen', 'Patronen', toelichting);

const STATISTIEK = (toelichting: string) =>
  rekenen('statistiek', 'Statistiek', toelichting);

const ONLINE_VEILIGHEID = (toelichting: string) =>
  burgerschap('online-veiligheid', 'Online veiligheid', toelichting);

const PRIVACY_RECHTEN = (toelichting: string) =>
  burgerschap('privacy-rechten', 'Privacy & rechten', toelichting);

const MEDIAWIJSHEID = (toelichting: string) =>
  burgerschap('mediawijsheid', 'Mediawijsheid', toelichting);

const ETHIEK = (toelichting: string) =>
  burgerschap('ethiek', 'Ethiek', toelichting);

const GELIJKHEID = (toelichting: string) =>
  burgerschap('gelijkheid', 'Gelijkheid', toelichting);

// ============================================================================
// Mapping: missie → basisvaardigheden
// ============================================================================

export const MISSIE_BASISVAARDIGHEDEN: MissieBasisvaardigheden[] = [
  // =========================================================================
  // LEERJAAR 1 — Periode 1: Digitale Basisvaardigheden
  // =========================================================================
  {
    missionId: 'magister-master',
    basisvaardigheden: [
      BEGRIJPEND_LEZEN('Leerling leest instructies en navigeert door menu-opties in Magister.'),
    ],
  },
  {
    missionId: 'cloud-commander',
    basisvaardigheden: [
      LOGISCH_REDENEREN('Leerling organiseert bestanden in een logische mappenstructuur.'),
      PRIVACY_RECHTEN('Leerling leert bewust omgaan met opslag van persoonlijke bestanden in de cloud.'),
    ],
  },
  {
    missionId: 'word-wizard',
    basisvaardigheden: [
      SCHRIJFVAARDIGHEID('Leerling stelt een gestructureerd document op met Word.'),
      FORMULEREN('Leerling oefent met het formuleren van nette teksten en kopjes.'),
    ],
  },
  {
    missionId: 'slide-specialist',
    basisvaardigheden: [
      SCHRIJFVAARDIGHEID('Leerling schrijft beknopte teksten voor presentatieslides.'),
      FORMULEREN('Leerling formuleert een boodschap die past bij visuele slides.'),
    ],
  },
  {
    missionId: 'print-pro',
    basisvaardigheden: [
      BEGRIJPEND_LEZEN('Leerling volgt stapsgewijze printinstructies en lost veelvoorkomende problemen op.'),
    ],
  },

  // Review-missies periode 1
  {
    missionId: 'ipad-print-instructies',
    basisvaardigheden: [
      BEGRIJPEND_LEZEN('Leerling leest en volgt instructies voor printen vanaf een iPad.'),
    ],
  },
  {
    missionId: 'cloud-cleaner',
    basisvaardigheden: [
      LOGISCH_REDENEREN('Leerling beoordeelt welke bestanden relevant zijn en maakt sorteerkeuzes.'),
    ],
  },
  {
    missionId: 'layout-doctor',
    basisvaardigheden: [
      SCHRIJFVAARDIGHEID('Leerling herkent en herstelt opmaakfouten in een Word-document.'),
      PATRONEN('Leerling herkent patronen in opmaakfouten en past consistente correcties toe.'),
    ],
  },
  {
    missionId: 'pitch-police',
    basisvaardigheden: [
      FORMULEREN('Leerling geeft onderbouwde feedback op presentaties van medeleerlingen.'),
      LEESVAARDIGHEID('Leerling beoordeelt of de boodschap van een presentatie helder overkomt.'),
    ],
  },

  // =========================================================================
  // LEERJAAR 1 — Periode 2: AI & Creatie
  // =========================================================================
  {
    missionId: 'prompt-master',
    basisvaardigheden: [
      SCHRIJFVAARDIGHEID('Leerling schrijft en verfijnt prompts om AI effectief aan te sturen.'),
      FORMULEREN('Leerling leert precies formuleren wat je van een AI wilt.'),
    ],
  },
  {
    missionId: 'game-programmeur',
    basisvaardigheden: [
      LOGISCH_REDENEREN('Leerling gebruikt als-dan-logica en loops bij het programmeren van een game.'),
      PATRONEN('Leerling herkent herhalende patronen in code en past deze efficiënt toe.'),
    ],
  },
  {
    missionId: 'ai-trainer',
    basisvaardigheden: [
      PATRONEN('Leerling herkent patronen in trainingsdata die het AI-model beïnvloeden.'),
      ETHIEK('Leerling denkt na over de gevolgen van verkeerd getrainde AI-modellen.'),
    ],
  },
  {
    missionId: 'chatbot-trainer',
    basisvaardigheden: [
      SCHRIJFVAARDIGHEID('Leerling schrijft antwoorden en dialoogflows voor een chatbot.'),
      FORMULEREN('Leerling formuleert heldere en vriendelijke chatbot-antwoorden.'),
    ],
  },
  {
    missionId: 'verhalen-ontwerper',
    basisvaardigheden: [
      SCHRIJFVAARDIGHEID('Leerling schrijft een interactief verhaal met meerdere paden.'),
      LOGISCH_REDENEREN('Leerling ontwerpt vertakkingen en keuzemomenten in een verhaalstructuur.'),
    ],
  },
  {
    missionId: 'game-director',
    basisvaardigheden: [
      LOGISCH_REDENEREN('Leerling ontwerpt spelregels en logica voor een eigen game.'),
      FORMULEREN('Leerling beschrijft game-concepten en mechanismes voor een doelgroep.'),
    ],
  },
  {
    missionId: 'ai-tekengame',
    basisvaardigheden: [
      PATRONEN('Leerling ontdekt hoe AI visuele patronen herkent in tekeningen.'),
    ],
  },
  {
    missionId: 'ai-beleid-brainstorm',
    basisvaardigheden: [
      FORMULEREN('Leerling formuleert standpunten over AI-beleid in een groepsdiscussie.'),
      ETHIEK('Leerling weegt ethische argumenten voor en tegen AI-toepassingen.'),
    ],
  },
  {
    missionId: 'code-denker',
    basisvaardigheden: [
      LOGISCH_REDENEREN('Leerling lost logische puzzels op door stap-voor-stap te redeneren.'),
      PATRONEN('Leerling herkent terugkerende patronen in computationele problemen.'),
    ],
  },

  // Review-missie periode 2
  {
    missionId: 'review-week-2',
    basisvaardigheden: [
      FORMULEREN('Leerling geeft onderbouwde feedback op AI-creaties van medeleerlingen.'),
      BEGRIJPEND_LEZEN('Leerling analyseert en beoordeelt code en AI-output van anderen.'),
    ],
  },

  // =========================================================================
  // LEERJAAR 1 — Periode 3: Digitaal Burgerschap
  // =========================================================================
  {
    missionId: 'data-detective',
    basisvaardigheden: [
      BEGRIJPEND_LEZEN('Leerling leest en interpreteert bronnen over dataverwerking.'),
      PRIVACY_RECHTEN('Leerling onderzoekt hoe bedrijven persoonsgegevens verzamelen en gebruiken.'),
    ],
  },
  {
    missionId: 'data-verzamelaar',
    basisvaardigheden: [
      STATISTIEK('Leerling verzamelt, categoriseert en analyseert data uit verschillende bronnen.'),
      PRIVACY_RECHTEN('Leerling leert over verantwoorde dataverzameling en toestemming.'),
    ],
  },
  {
    missionId: 'deepfake-detector',
    basisvaardigheden: [
      BEGRIJPEND_LEZEN('Leerling analyseert mediaberichten op tekenen van manipulatie.'),
      MEDIAWIJSHEID('Leerling leert deepfakes herkennen en bronnen verifiëren.'),
    ],
  },
  {
    missionId: 'ai-spiegel',
    basisvaardigheden: [
      FORMULEREN('Leerling reflecteert schriftelijk op de invloed van AI op het eigen leven.'),
      ETHIEK('Leerling denkt na over eerlijkheid en bias in AI-aanbevelingen.'),
    ],
  },
  {
    missionId: 'social-safeguard',
    basisvaardigheden: [
      ONLINE_VEILIGHEID('Leerling leert omgaan met cyberpesten en onveilige online situaties.'),
      FORMULEREN('Leerling formuleert reacties op ongewenst online gedrag.'),
    ],
  },
  {
    missionId: 'cookie-crusher',
    basisvaardigheden: [
      BEGRIJPEND_LEZEN('Leerling leest en interpreteert cookie-meldingen en privacyvoorwaarden.'),
      PRIVACY_RECHTEN('Leerling leert over trackingcookies en het recht op privacy.'),
    ],
  },
  {
    missionId: 'data-handelaar',
    basisvaardigheden: [
      ETHIEK('Leerling weegt ethische dilemma\'s bij het verhandelen van persoonlijke data.'),
      PRIVACY_RECHTEN('Leerling leert over de waarde van data en AVG-rechten.'),
    ],
  },
  {
    missionId: 'filter-bubble-breaker',
    basisvaardigheden: [
      MEDIAWIJSHEID('Leerling ontdekt hoe algoritmes informatiebubbels creëren.'),
      BEGRIJPEND_LEZEN('Leerling vergelijkt verschillende nieuwsbronnen en perspectieven.'),
    ],
  },
  {
    missionId: 'datalekken-rampenplan',
    basisvaardigheden: [
      ONLINE_VEILIGHEID('Leerling leert wat te doen bij een datalek en hoe schade te beperken.'),
      SCHRIJFVAARDIGHEID('Leerling stelt een rampenplan op voor een datalekscenario.'),
    ],
  },
  {
    missionId: 'data-voor-data',
    basisvaardigheden: [
      ETHIEK('Leerling reflecteert op de ruil tussen gratis diensten en persoonlijke data.'),
      PRIVACY_RECHTEN('Leerling leert over dataminimalisatie en het recht op vergetelheid.'),
    ],
  },
  {
    missionId: 'privacy-profiel-spiegel',
    basisvaardigheden: [
      PRIVACY_RECHTEN('Leerling analyseert het eigen digitale profiel en privacyrisico\'s.'),
      BEGRIJPEND_LEZEN('Leerling leest en interpreteert privacyinstellingen van platforms.'),
    ],
  },

  // =========================================================================
  // LEERJAAR 1 — Periode 4: Eindproject
  // =========================================================================
  {
    missionId: 'review-week-3',
    basisvaardigheden: [
      FORMULEREN('Leerling beargumenteert ethische standpunten over digitale onderwerpen.'),
      ETHIEK('Leerling weegt als "ethische raad" verschillende perspectieven tegen elkaar af.'),
    ],
  },
  {
    missionId: 'mission-blueprint',
    basisvaardigheden: [
      SCHRIJFVAARDIGHEID('Leerling schrijft een projectplan met duidelijke doelen en stappen.'),
      LOGISCH_REDENEREN('Leerling structureert een complex project in logische deelstappen.'),
    ],
  },
  {
    missionId: 'mission-vision',
    basisvaardigheden: [
      SCHRIJFVAARDIGHEID('Leerling beschrijft een visie op het gebruik van AI in het eindproject.'),
      FORMULEREN('Leerling formuleert en onderbouwt ontwerpkeuzes.'),
    ],
  },
  {
    missionId: 'mission-launch',
    basisvaardigheden: [
      FORMULEREN('Leerling presenteert het eindproject en beantwoordt vragen.'),
      SCHRIJFVAARDIGHEID('Leerling schrijft een reflectie op het eindresultaat.'),
    ],
  },

  // =========================================================================
  // LEERJAAR 2 — Periode 1: Data & Informatie
  // =========================================================================
  {
    missionId: 'data-journalist',
    basisvaardigheden: [
      SCHRIJFVAARDIGHEID('Leerling schrijft een datajournalistiek artikel op basis van datasets.'),
      STATISTIEK('Leerling analyseert datasets en trekt conclusies uit statistische gegevens.'),
      LEESVAARDIGHEID('Leerling leest en beoordeelt bronnen voor het artikel.'),
    ],
  },
  {
    missionId: 'spreadsheet-specialist',
    basisvaardigheden: [
      GRAFIEKEN('Leerling maakt grafieken en visualisaties in een spreadsheet.'),
      STATISTIEK('Leerling berekent gemiddelden, totalen en andere statistische maten.'),
    ],
  },
  {
    missionId: 'factchecker',
    basisvaardigheden: [
      LEESVAARDIGHEID('Leerling leest nieuwsberichten en controleert claims op juistheid.'),
      MEDIAWIJSHEID('Leerling leert feiten van meningen onderscheiden en bronnen verifiëren.'),
      BEGRIJPEND_LEZEN('Leerling analyseert argumentatiestructuren in mediaberichten.'),
    ],
  },
  {
    missionId: 'api-verkenner',
    basisvaardigheden: [
      LOGISCH_REDENEREN('Leerling begrijpt de logica van API-verzoeken en datastructuren.'),
      PATRONEN('Leerling herkent patronen in JSON-datastructuren.'),
    ],
  },
  {
    missionId: 'dashboard-designer',
    basisvaardigheden: [
      GRAFIEKEN('Leerling ontwerpt een dashboard met grafieken die data helder communiceren.'),
      FORMULEREN('Leerling kiest welke data relevant is en hoe deze gepresenteerd wordt.'),
    ],
  },
  {
    missionId: 'ai-bias-detective',
    basisvaardigheden: [
      STATISTIEK('Leerling analyseert datasets op oververtegenwoordiging en scheefheid.'),
      ETHIEK('Leerling onderzoekt hoe bias in data leidt tot oneerlijke AI-beslissingen.'),
      GELIJKHEID('Leerling leert over de gevolgen van AI-bias voor gemarginaliseerde groepen.'),
    ],
  },
  {
    missionId: 'data-review',
    basisvaardigheden: [
      FORMULEREN('Leerling geeft onderbouwde feedback op data-analyses van medeleerlingen.'),
      STATISTIEK('Leerling beoordeelt of conclusies uit data correct zijn onderbouwd.'),
    ],
  },

  // =========================================================================
  // LEERJAAR 2 — Periode 2: Programmeren & Computational Thinking
  // =========================================================================
  {
    missionId: 'algorithm-architect',
    basisvaardigheden: [
      LOGISCH_REDENEREN('Leerling ontwerpt algoritmes met condities, loops en functies.'),
      PATRONEN('Leerling herkent herhalende patronen en abstraheert deze in herbruikbare code.'),
    ],
  },
  {
    missionId: 'web-developer',
    basisvaardigheden: [
      SCHRIJFVAARDIGHEID('Leerling schrijft inhoudelijke teksten voor een website.'),
      LOGISCH_REDENEREN('Leerling structureert een webpagina met HTML/CSS logica.'),
    ],
  },
  {
    missionId: 'app-prototyper',
    basisvaardigheden: [
      FORMULEREN('Leerling beschrijft gebruikersbehoeften en vertaalt deze naar een app-ontwerp.'),
      LOGISCH_REDENEREN('Leerling ontwerpt de navigatie en logica van een app-prototype.'),
    ],
  },
  {
    missionId: 'bug-hunter',
    basisvaardigheden: [
      LOGISCH_REDENEREN('Leerling spoort fouten op door systematisch code te analyseren.'),
      PATRONEN('Leerling herkent veelvoorkomende bugpatronen en past oplossingsstrategieën toe.'),
    ],
  },
  {
    missionId: 'automation-engineer',
    basisvaardigheden: [
      LOGISCH_REDENEREN('Leerling automatiseert taken met scripts en logische regels.'),
      PATRONEN('Leerling identificeert repetitieve taken die geautomatiseerd kunnen worden.'),
    ],
  },
  {
    missionId: 'code-reviewer',
    basisvaardigheden: [
      FORMULEREN('Leerling geeft constructieve, onderbouwde feedback op code van anderen.'),
      BEGRIJPEND_LEZEN('Leerling leest en begrijpt code die door iemand anders is geschreven.'),
    ],
  },
  {
    missionId: 'network-navigator',
    basisvaardigheden: [
      LOGISCH_REDENEREN('Leerling begrijpt de logica van netwerken, IP-adressen en routing.'),
      ONLINE_VEILIGHEID('Leerling leert over netwerkveiligheid en bescherming van dataverkeer.'),
    ],
  },
  {
    missionId: 'privacy-by-design',
    basisvaardigheden: [
      PRIVACY_RECHTEN('Leerling ontwerpt software met ingebouwde privacybescherming.'),
      LOGISCH_REDENEREN('Leerling past privacy-principes toe als ontwerpregels in code.'),
    ],
  },
  {
    missionId: 'code-review-2',
    basisvaardigheden: [
      FORMULEREN('Leerling schrijft gestructureerde code-reviews met verbeterpunten.'),
      BEGRIJPEND_LEZEN('Leerling analyseert complexere codeprojecten op kwaliteit.'),
    ],
  },

  // =========================================================================
  // LEERJAAR 2 — Periode 3: Digitale Media & Creatie
  // =========================================================================
  {
    missionId: 'ux-detective',
    basisvaardigheden: [
      BEGRIJPEND_LEZEN('Leerling analyseert gebruikersinterfaces op bruikbaarheid en duidelijkheid.'),
      FORMULEREN('Leerling formuleert UX-verbetervoorstellen op basis van analyse.'),
    ],
  },
  {
    missionId: 'podcast-producer',
    basisvaardigheden: [
      SCHRIJFVAARDIGHEID('Leerling schrijft een script en shownotes voor een podcast.'),
      FORMULEREN('Leerling formuleert vragen en structureert een podcastgesprek.'),
    ],
  },
  {
    missionId: 'meme-machine',
    basisvaardigheden: [
      MEDIAWIJSHEID('Leerling leert hoe memes informatieverspreiding en opinie beïnvloeden.'),
      FORMULEREN('Leerling formuleert een boodschap die past bij het visuele meme-format.'),
    ],
  },
  {
    missionId: 'digital-storyteller',
    basisvaardigheden: [
      SCHRIJFVAARDIGHEID('Leerling schrijft een digitaal verhaal met multimedia-elementen.'),
      FORMULEREN('Leerling structureert een narratief met een heldere verhaallijn.'),
    ],
  },
  {
    missionId: 'brand-builder',
    basisvaardigheden: [
      SCHRIJFVAARDIGHEID('Leerling schrijft merkteksten, slogans en een huisstijlgids.'),
      FORMULEREN('Leerling formuleert een merkidentiteit en doelgroepboodschap.'),
    ],
  },
  {
    missionId: 'video-editor',
    basisvaardigheden: [
      SCHRIJFVAARDIGHEID('Leerling schrijft een draaiboek en ondertitels voor een video.'),
      PATRONEN('Leerling herkent patronen in videomontage zoals ritme en timing.'),
    ],
  },
  {
    missionId: 'media-review',
    basisvaardigheden: [
      FORMULEREN('Leerling geeft onderbouwde feedback op mediaproducties van medeleerlingen.'),
      LEESVAARDIGHEID('Leerling beoordeelt of mediaproducties hun boodschap effectief overbrengen.'),
    ],
  },

  // =========================================================================
  // LEERJAAR 2 — Periode 4: Ethiek, Maatschappij & Eindproject
  // =========================================================================
  {
    missionId: 'ai-ethicus',
    basisvaardigheden: [
      FORMULEREN('Leerling formuleert ethische standpunten over AI-toepassingen.'),
      ETHIEK('Leerling analyseert morele dilemma\'s rond autonome AI-systemen.'),
    ],
  },
  {
    missionId: 'digital-rights-defender',
    basisvaardigheden: [
      PRIVACY_RECHTEN('Leerling onderzoekt digitale rechten en pleit voor privacybescherming.'),
      FORMULEREN('Leerling formuleert argumenten voor digitale burgerrechten.'),
    ],
  },
  {
    missionId: 'tech-court',
    basisvaardigheden: [
      FORMULEREN('Leerling beargumenteert standpunten in een nagespeelde rechtszaak over tech.'),
      BEGRIJPEND_LEZEN('Leerling leest en interpreteert juridische en ethische casuïstiek.'),
      ETHIEK('Leerling weegt rechten en plichten af in een technologische context.'),
    ],
  },
  {
    missionId: 'future-forecaster',
    basisvaardigheden: [
      SCHRIJFVAARDIGHEID('Leerling schrijft een toekomstscenario over de impact van technologie.'),
      ETHIEK('Leerling denkt na over de maatschappelijke gevolgen van technologische trends.'),
    ],
  },
  {
    missionId: 'sustainability-scanner',
    basisvaardigheden: [
      STATISTIEK('Leerling analyseert data over de ecologische voetafdruk van technologie.'),
      ETHIEK('Leerling weegt de milieukosten van digitale technologie tegen de voordelen.'),
    ],
  },
  {
    missionId: 'eindproject-j2',
    basisvaardigheden: [
      SCHRIJFVAARDIGHEID('Leerling schrijft een projectverslag en reflectierapport.'),
      FORMULEREN('Leerling presenteert en verdedigt het eindproject.'),
      LOGISCH_REDENEREN('Leerling structureert een complex project met meerdere componenten.'),
    ],
  },

  // =========================================================================
  // LEERJAAR 3 — Periode 1: Geavanceerd Programmeren & AI
  // =========================================================================
  {
    missionId: 'ml-trainer',
    basisvaardigheden: [
      STATISTIEK('Leerling werkt met trainings- en testdata, analyseert nauwkeurigheidsmetrieken.'),
      PATRONEN('Leerling herkent patronen in datasets die het ML-model moet leren.'),
      ETHIEK('Leerling denkt na over verantwoord gebruik van machine learning.'),
    ],
  },
  {
    missionId: 'api-architect',
    basisvaardigheden: [
      LOGISCH_REDENEREN('Leerling ontwerpt API-endpoints met logische datastructuren.'),
      PATRONEN('Leerling past REST-patronen en conventies toe bij het API-ontwerp.'),
    ],
  },
  {
    missionId: 'neural-navigator',
    basisvaardigheden: [
      PATRONEN('Leerling verkent hoe neurale netwerken patronen in data herkennen.'),
      STATISTIEK('Leerling analyseert de prestaties van een neuraal netwerk met meetwaarden.'),
    ],
  },
  {
    missionId: 'data-pipeline',
    basisvaardigheden: [
      LOGISCH_REDENEREN('Leerling ontwerpt een data-pipeline met transformatie- en filterstappen.'),
      STATISTIEK('Leerling verwerkt en valideert grote datasets door de pipeline.'),
    ],
  },
  {
    missionId: 'open-source-contributor',
    basisvaardigheden: [
      SCHRIJFVAARDIGHEID('Leerling schrijft documentatie en commit-berichten in het Engels.'),
      FORMULEREN('Leerling formuleert pull requests en issues voor een open-sourceproject.'),
      ETHIEK('Leerling leert over samenwerking, licenties en eerlijk delen van kennis.'),
    ],
  },
  {
    missionId: 'advanced-code-review',
    basisvaardigheden: [
      FORMULEREN('Leerling geeft gedetailleerde technische feedback op complexe code.'),
      BEGRIJPEND_LEZEN('Leerling leest en begrijpt geavanceerde codepatronen en architectuur.'),
    ],
  },

  // =========================================================================
  // LEERJAAR 3 — Periode 2: Cybersecurity & Privacy
  // =========================================================================
  {
    missionId: 'cyber-detective',
    basisvaardigheden: [
      LOGISCH_REDENEREN('Leerling volgt digitale sporen en leidt aanvalsvectoren af.'),
      ONLINE_VEILIGHEID('Leerling onderzoekt cyberdreigingen en verdedigingsstrategieën.'),
    ],
  },
  {
    missionId: 'encryption-expert',
    basisvaardigheden: [
      LOGISCH_REDENEREN('Leerling begrijpt de wiskunde achter encryptie en past het toe.'),
      PATRONEN('Leerling herkent patronen in versleutelde en onversleutelde data.'),
      PRIVACY_RECHTEN('Leerling leert waarom encryptie essentieel is voor privacybescherming.'),
    ],
  },
  {
    missionId: 'phishing-fighter',
    basisvaardigheden: [
      BEGRIJPEND_LEZEN('Leerling analyseert verdachte e-mails en websites op phishing-kenmerken.'),
      ONLINE_VEILIGHEID('Leerling leert phishing herkennen en zichzelf en anderen te beschermen.'),
    ],
  },
  {
    missionId: 'security-auditor',
    basisvaardigheden: [
      LOGISCH_REDENEREN('Leerling voert een systematische beveiligingsaudit uit op een systeem.'),
      SCHRIJFVAARDIGHEID('Leerling schrijft een auditrapport met bevindingen en aanbevelingen.'),
      ONLINE_VEILIGHEID('Leerling leert kwetsbaarheden identificeren en rapporteren.'),
    ],
  },
  {
    missionId: 'digital-forensics',
    basisvaardigheden: [
      LOGISCH_REDENEREN('Leerling reconstrueert een digitaal incident via forensisch onderzoek.'),
      BEGRIJPEND_LEZEN('Leerling leest en interpreteert logbestanden en digitale sporen.'),
    ],
  },
  {
    missionId: 'security-review',
    basisvaardigheden: [
      FORMULEREN('Leerling formuleert beveiligingsadviezen op basis van gevonden kwetsbaarheden.'),
      ONLINE_VEILIGHEID('Leerling beoordeelt de beveiligingsstatus van systemen.'),
    ],
  },

  // =========================================================================
  // LEERJAAR 3 — Periode 3: Maatschappelijke Impact & Innovatie
  // =========================================================================
  {
    missionId: 'startup-simulator',
    basisvaardigheden: [
      SCHRIJFVAARDIGHEID('Leerling schrijft een businessplan voor een tech-startup.'),
      FORMULEREN('Leerling formuleert een waardepropositie en pitcht het concept.'),
      ETHIEK('Leerling weegt winstdoelen af tegen maatschappelijke verantwoordelijkheid.'),
    ],
  },
  {
    missionId: 'policy-maker',
    basisvaardigheden: [
      SCHRIJFVAARDIGHEID('Leerling schrijft een beleidsdocument over digitale technologie.'),
      FORMULEREN('Leerling onderbouwt beleidsvoorstellen met argumenten en voorbeelden.'),
      ETHIEK('Leerling weegt belangen van verschillende stakeholders tegen elkaar af.'),
    ],
  },
  {
    missionId: 'innovation-lab',
    basisvaardigheden: [
      FORMULEREN('Leerling presenteert een innovatief AI-concept aan een publiek.'),
      LOGISCH_REDENEREN('Leerling ontwerpt de architectuur van een innovatief digitaal product.'),
    ],
  },
  {
    missionId: 'digital-divide-researcher',
    basisvaardigheden: [
      STATISTIEK('Leerling analyseert data over de digitale kloof tussen bevolkingsgroepen.'),
      GELIJKHEID('Leerling onderzoekt ongelijkheid in toegang tot digitale technologie.'),
      SCHRIJFVAARDIGHEID('Leerling schrijft een onderzoeksrapport over de digitale kloof.'),
    ],
  },
  {
    missionId: 'tech-impact-analyst',
    basisvaardigheden: [
      BEGRIJPEND_LEZEN('Leerling analyseert rapporten over de maatschappelijke impact van tech.'),
      FORMULEREN('Leerling formuleert een impactanalyse met aanbevelingen.'),
      ETHIEK('Leerling beoordeelt de positieve en negatieve effecten van technologie.'),
    ],
  },
  {
    missionId: 'impact-review',
    basisvaardigheden: [
      FORMULEREN('Leerling geeft onderbouwde feedback op impact-analyses van medeleerlingen.'),
      ETHIEK('Leerling beoordeelt of ethische overwegingen voldoende zijn meegewogen.'),
    ],
  },

  // =========================================================================
  // LEERJAAR 3 — Periode 4: Meesterproef
  // =========================================================================
  {
    missionId: 'portfolio-builder',
    basisvaardigheden: [
      SCHRIJFVAARDIGHEID('Leerling schrijft reflecties en beschrijvingen bij portfoliowerk.'),
      FORMULEREN('Leerling selecteert en presenteert werk dat groei en vaardigheden toont.'),
    ],
  },
  {
    missionId: 'research-project',
    basisvaardigheden: [
      SCHRIJFVAARDIGHEID('Leerling schrijft een wetenschappelijk onderzoeksrapport.'),
      LEESVAARDIGHEID('Leerling leest en verwerkt wetenschappelijke bronnen en literatuur.'),
      STATISTIEK('Leerling verzamelt en analyseert onderzoeksdata met statistische methoden.'),
    ],
  },
  {
    missionId: 'prototype-developer',
    basisvaardigheden: [
      LOGISCH_REDENEREN('Leerling ontwerpt en bouwt een werkend prototype met complexe logica.'),
      FORMULEREN('Leerling documenteert technische keuzes en onderbouwt het ontwerp.'),
    ],
  },
  {
    missionId: 'pitch-perfect',
    basisvaardigheden: [
      FORMULEREN('Leerling geeft een overtuigende pitch en beantwoordt kritische vragen.'),
      SCHRIJFVAARDIGHEID('Leerling schrijft een pitchdeck met heldere kernboodschappen.'),
    ],
  },
  {
    missionId: 'reflection-report',
    basisvaardigheden: [
      SCHRIJFVAARDIGHEID('Leerling schrijft een diepgaand reflectierapport over het leerproces.'),
      FORMULEREN('Leerling formuleert leerdoelen en evalueert de eigen groei.'),
      ETHIEK('Leerling reflecteert op de ethische dimensies van het eigen project.'),
    ],
  },
  {
    missionId: 'meesterproef',
    basisvaardigheden: [
      SCHRIJFVAARDIGHEID('Leerling schrijft een uitgebreid eindverslag en presentatie.'),
      FORMULEREN('Leerling verdedigt het meesterproefproject voor een panel.'),
      LOGISCH_REDENEREN('Leerling integreert alle geleerde vaardigheden in een complex project.'),
      ETHIEK('Leerling verantwoordt de maatschappelijke relevantie van het project.'),
    ],
  },
];

// ============================================================================
// Lookup index
// ============================================================================

const basisvaardighedenByMission: Record<string, BasisvaardigheidTag[]> = Object.fromEntries(
  MISSIE_BASISVAARDIGHEDEN.map((m) => [m.missionId, m.basisvaardigheden]),
);

// ============================================================================
// Helper functies
// ============================================================================

/**
 * Geeft alle basisvaardigheid-tags voor een specifieke missie.
 */
export function getBasisvaardighedenForMission(missionId: string): BasisvaardigheidTag[] {
  return basisvaardighedenByMission[missionId] ?? [];
}

/**
 * Geeft alle missie-IDs die een bepaalde basisvaardigheid-categorie (en optioneel subcategorie) raken.
 */
export function getMissionsForBasisvaardigheid(
  categorie: BasisvaardighedenCategorie,
  subcategorie?: string,
): string[] {
  return MISSIE_BASISVAARDIGHEDEN
    .filter((m) =>
      m.basisvaardigheden.some(
        (b) => b.categorie === categorie && (!subcategorie || b.subcategorie === subcategorie),
      ),
    )
    .map((m) => m.missionId);
}

/**
 * Geeft een overzicht van het totale aantal raakvlakken per categorie en subcategorie.
 */
export function getBasisvaardighedenSummary(): Record<
  BasisvaardighedenCategorie,
  { count: number; subcategorieen: Record<string, number> }
> {
  const summary: Record<BasisvaardighedenCategorie, { count: number; subcategorieen: Record<string, number> }> = {
    taal: { count: 0, subcategorieen: {} },
    rekenen: { count: 0, subcategorieen: {} },
    burgerschap: { count: 0, subcategorieen: {} },
  };

  for (const missie of MISSIE_BASISVAARDIGHEDEN) {
    for (const tag of missie.basisvaardigheden) {
      summary[tag.categorie].count += 1;
      summary[tag.categorie].subcategorieen[tag.subcategorie] =
        (summary[tag.categorie].subcategorieen[tag.subcategorie] ?? 0) + 1;
    }
  }

  return summary;
}
