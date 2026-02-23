CREATE TABLE IF NOT EXISTS curriculum_missions (
    id text PRIMARY KEY,
    title text NOT NULL,
    description text,
    year_group smallint NOT NULL,
    period smallint NOT NULL,
    position smallint NOT NULL,
    education_levels text[] DEFAULT '{mavo,havo,vwo}',
    slo_kerndoelen text[] NOT NULL,
    slo_vso_kerndoelen text[],
    difficulty text DEFAULT 'Medium',
    is_review boolean DEFAULT false,
    is_bonus boolean DEFAULT false,
    is_external boolean DEFAULT false,
    class_restriction text,
    status text DEFAULT 'available',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_curriculum_missions_year ON curriculum_missions(year_group, period);
CREATE INDEX IF NOT EXISTS idx_curriculum_missions_level ON curriculum_missions USING GIN(education_levels);

-- RLS: everyone can read, only admins/developers can write
ALTER TABLE curriculum_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read curriculum missions" ON curriculum_missions
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage curriculum missions" ON curriculum_missions
    FOR ALL USING (
        (SELECT get_my_role()) IN ('admin', 'developer')
    );

-- Seed existing Leerjaar 1 missions
INSERT INTO curriculum_missions (id, title, description, year_group, period, position, education_levels, slo_kerndoelen, slo_vso_kerndoelen, is_external) VALUES
-- Periode 1: Digitale Basisvaardigheden
('magister-master', 'Systeem Meester', 'Leerlingvolgsysteem navigeren', 1, 1, 1, '{mavo,havo,vwo}', '{21A}', '{18A}', true),
('cloud-commander', 'Cloud Commander', 'Mappenstructuur in cloudomgeving', 1, 1, 2, '{mavo,havo,vwo}', '{21A}', '{18A}', true),
('word-wizard', 'Word Wizard', 'Document met opmaak maken', 1, 1, 3, '{mavo,havo,vwo}', '{21A,22A}', '{18A,19A}', true),
('slide-specialist', 'Slide Specialist', 'Presentatie ontwerpen', 1, 1, 4, '{mavo,havo,vwo}', '{21A,22A}', '{18A,19A}', true),
('print-pro', 'Print Pro', 'Digitaal naar fysiek: printen', 1, 1, 5, '{mavo,havo,vwo}', '{21A}', '{18A}', true),
('cloud-cleaner', 'Cloud Schoonmaker', 'Review: bestanden ordenen', 1, 1, 6, '{mavo,havo,vwo}', '{21A}', '{18A}', false),
('layout-doctor', 'Layout Doctor', 'Review: Word-problemen oplossen', 1, 1, 7, '{mavo,havo,vwo}', '{21A}', '{18A}', false),
('pitch-police', 'Pitch Politie', 'Review: presentaties verbeteren', 1, 1, 8, '{mavo,havo,vwo}', '{21A,22A}', '{18A,19A}', false),

-- Periode 2: AI & Creatie
('prompt-master', 'Prompt Perfectionist', 'Goede vs slechte prompts schrijven', 1, 2, 1, '{mavo,havo,vwo}', '{21D,22A}', '{18C,19A,20B}', false),
('game-programmeur', 'Game Programmeur', 'Games repareren met code', 1, 2, 2, '{mavo,havo,vwo}', '{22A,22B}', '{19A}', false),
('ai-trainer', 'AI Trainer', 'Supervised learning, materialen herkennen', 1, 2, 3, '{mavo,havo,vwo}', '{21D}', '{18C}', false),
('chatbot-trainer', 'Chatbot Trainer', 'Eigen chatbot bouwen', 1, 2, 4, '{mavo,havo,vwo}', '{21D,22A}', '{18C,19A}', false),
('verhalen-ontwerper', 'Verhalen Ontwerper', 'AI-beeldgeneratie, prompt schrijven', 1, 2, 5, '{mavo,havo,vwo}', '{21D,22A}', '{18C,19A}', false),
('game-director', 'Game Director', 'Game-regelset ontwerpen', 1, 2, 6, '{mavo,havo,vwo}', '{22A,22B}', '{19A}', false),
('ai-tekengame', 'AI Tekengame', 'Teken en laat AI raden', 1, 2, 7, '{mavo,havo,vwo}', '{21D}', '{18C}', false),
('ai-beleid-brainstorm', 'AI Beleid Brainstorm', 'AI-regels brainstormen en stemmen', 1, 2, 8, '{mavo,havo,vwo}', '{23B,23C}', '{20B}', false),
('review-week-2', 'Code-Criticus', 'Fouten vinden in AI-content', 1, 2, 9, '{mavo,havo,vwo}', '{21B,21D}', '{18C}', false),

-- Periode 3: Digitaal Burgerschap
('data-detective', 'Data Detective', 'Hoe bedrijven data gebruiken', 1, 3, 1, '{mavo,havo,vwo}', '{21C,23C}', '{18B,20A}', false),
('deepfake-detector', 'Deepfake Detector', 'AI-content herkennen', 1, 3, 2, '{mavo,havo,vwo}', '{21B,21D,23C}', '{18B,18C,20A}', false),
('ai-spiegel', 'AI Spiegel', 'Online gedrag wordt advertentieprofiel', 1, 3, 3, '{mavo,havo,vwo}', '{23B,23C}', '{20A,20B}', false),
('social-safeguard', 'Social Safeguard', 'Online druk, pesten, datamisbruik', 1, 3, 4, '{mavo,havo,vwo}', '{23A,23B}', '{20A,20B}', false),
('cookie-crusher', 'Cookie Crusher', 'Dark patterns herkennen', 1, 3, 5, '{mavo,havo,vwo}', '{23C,21B}', '{18B,20A}', false),
('data-handelaar', 'Data Handelaar', 'AVG-overtredingen opsporen', 1, 3, 6, '{mavo,havo,vwo}', '{23C,23A}', '{20A,20B}', false),
('privacy-profiel-spiegel', 'Privacy Profiel Spiegel', 'App-permissies checken', 1, 3, 7, '{mavo,havo,vwo}', '{23A,23B}', '{20A,20B}', false),
('filter-bubble-breaker', 'Filter Bubble Breaker', 'Social media feeds vergelijken', 1, 3, 8, '{mavo,havo,vwo}', '{23B,23C}', '{20A,20B}', false),
('datalekken-rampenplan', 'Datalekken Rampenplan', 'Datalek crisis managen', 1, 3, 9, '{mavo,havo,vwo}', '{23A,23B,23C}', '{20A,20B}', false),
('data-voor-data', 'Data voor Data', 'Ethische data-veiling', 1, 3, 10, '{mavo,havo,vwo}', '{23C,23B}', '{20A,20B}', false),
('social-media-psychologist', 'Social Media Psycholoog', 'Algoritmes begrijpen', 1, 3, 11, '{mavo,havo,vwo}', '{21B,23B}', '{20A,20B}', false),

-- Periode 4: Eindproject
('review-week-3', 'Ethische Raad', 'Ethische dilemmas beoordelen', 1, 4, 1, '{mavo,havo,vwo}', '{23C}', '{20B}', false),
('mission-blueprint', 'De Blauwdruk', 'Eindproject plannen', 1, 4, 2, '{mavo,havo,vwo}', '{21A,22A}', '{18A,19A}', false),
('mission-vision', 'De Visie', 'Product maken', 1, 4, 3, '{mavo,havo,vwo}', '{21D,22A}', '{18C,19A}', false),
('mission-launch', 'De Lancering', 'Presenteren', 1, 4, 4, '{mavo,havo,vwo}', '{21A,21B}', '{18A}', false),

-- LEERJAAR 2 - Periode 1: Data & Informatie
('data-journalist', 'Data Journalist', 'Dataset analyseren, infographic maken', 2, 1, 1, '{mavo,havo,vwo}', '{21C,22A}', NULL, false),
('spreadsheet-specialist', 'Spreadsheet Specialist', 'Formules, grafieken, pivot-tabellen', 2, 1, 2, '{mavo,havo,vwo}', '{21A,21C}', NULL, false),
('factchecker', 'De Factchecker', 'Online informatie verifieren met bronnen', 2, 1, 3, '{mavo,havo,vwo}', '{21B}', NULL, false),
('api-verkenner', 'API Verkenner', 'Data ophalen via publieke APIs', 2, 1, 4, '{mavo,havo,vwo}', '{21C,22B}', NULL, false),
('dashboard-designer', 'Dashboard Designer', 'Data-dashboard bouwen', 2, 1, 5, '{mavo,havo,vwo}', '{21C,22A}', NULL, false),
('ai-bias-detective', 'AI Bias Detective', 'Bias in AI-systemen ontdekken', 2, 1, 6, '{mavo,havo,vwo}', '{21D,23C}', NULL, false),
('data-review', 'Data Review', 'Review van data-concepten', 2, 1, 7, '{mavo,havo,vwo}', '{21B,21C}', NULL, false),

-- LEERJAAR 2 - Periode 2: Programmeren & CT
('algorithm-architect', 'Algorithm Architect', 'Zoek/sorteeralgoritme ontwerpen', 2, 2, 1, '{mavo,havo,vwo}', '{22B}', NULL, false),
('web-developer', 'Web Developer', 'Interactieve webpagina bouwen', 2, 2, 2, '{mavo,havo,vwo}', '{22A,22B}', NULL, false),
('app-prototyper', 'App Prototyper', 'App-prototype ontwerpen en bouwen', 2, 2, 3, '{mavo,havo,vwo}', '{22A}', NULL, false),
('bug-hunter', 'Bug Hunter', 'Complexe code debuggen', 2, 2, 4, '{mavo,havo,vwo}', '{22B}', NULL, false),
('automation-engineer', 'Automation Engineer', 'Repetitieve taak automatiseren', 2, 2, 5, '{mavo,havo,vwo}', '{22B,21A}', NULL, false),
('code-reviewer', 'Code Reviewer', 'Andermans code reviewen en verbeteren', 2, 2, 6, '{mavo,havo,vwo}', '{22A,22B}', NULL, false),
('code-review-2', 'Code Review', 'Review van programmeerconcepten', 2, 2, 7, '{mavo,havo,vwo}', '{22B}', NULL, false),

-- LEERJAAR 2 - Periode 3: Digitale Media & Creatie
('ux-detective', 'UX Detective', 'Analyseer de UX van een bestaande app', 2, 3, 1, '{mavo,havo,vwo}', '{22A,21B}', NULL, false),
('podcast-producer', 'Podcast Producer', 'Korte podcast over tech-onderwerp', 2, 3, 2, '{mavo,havo,vwo}', '{22A,21B}', NULL, false),
('meme-machine', 'Meme Machine', 'Virale content analyseren en maken', 2, 3, 3, '{mavo,havo,vwo}', '{21B,23B}', NULL, false),
('digital-storyteller', 'Digital Storyteller', 'Interactief digitaal verhaal maken', 2, 3, 4, '{mavo,havo,vwo}', '{22A}', NULL, false),
('brand-builder', 'Brand Builder', 'Digitale identiteit ontwerpen', 2, 3, 5, '{mavo,havo,vwo}', '{22A,21B}', NULL, false),
('video-editor', 'Video Editor', 'Korte video monteren en publiceren', 2, 3, 6, '{mavo,havo,vwo}', '{22A}', NULL, false),
('media-review', 'Media Review', 'Review van mediaconcepten', 2, 3, 7, '{mavo,havo,vwo}', '{21B,22A}', NULL, false),

-- LEERJAAR 2 - Periode 4: Ethiek & Eindproject
('ai-ethicus', 'AI Ethicus', 'AI-bias analyseren in een concreet systeem', 2, 4, 1, '{mavo,havo,vwo}', '{21D,23C}', NULL, false),
('digital-rights-defender', 'Digital Rights Defender', 'Privacy-manifest schrijven', 2, 4, 2, '{mavo,havo,vwo}', '{23A,23C}', NULL, false),
('tech-court', 'Tech Rechtbank', 'Debat over een tech-dilemma', 2, 4, 3, '{mavo,havo,vwo}', '{23B,23C}', NULL, false),
('future-forecaster', 'Future Forecaster', 'Toekomstvisie op technologie schrijven', 2, 4, 4, '{mavo,havo,vwo}', '{23C}', NULL, false),
('sustainability-scanner', 'Sustainability Scanner', 'Milieu-impact van tech analyseren', 2, 4, 5, '{mavo,havo,vwo}', '{23C,23B}', NULL, false),
('eindproject-j2', 'Eindproject Jaar 2', 'Geintegreerd project alle kerndoelen', 2, 4, 6, '{mavo,havo,vwo}', '{21A,21B,21C,21D,22A,22B,23A,23B,23C}', NULL, false),

-- LEERJAAR 3 - Periode 1: Geavanceerd Programmeren & AI (alleen havo/vwo)
('ml-trainer', 'ML Trainer', 'Simpel machine learning model trainen', 3, 1, 1, '{havo,vwo}', '{21D,22B}', NULL, false),
('api-architect', 'API Architect', 'REST API ontwerpen en documenteren', 3, 1, 2, '{havo,vwo}', '{22A,22B}', NULL, false),
('neural-navigator', 'Neural Network Navigator', 'Hoe een neuraal netwerk werkt', 3, 1, 3, '{havo,vwo}', '{21D}', NULL, false),
('data-pipeline', 'Data Pipeline Engineer', 'ETL-proces ontwerpen', 3, 1, 4, '{havo,vwo}', '{21C,22B}', NULL, false),
('open-source-contributor', 'Open Source Contributor', 'Bijdragen aan open source project', 3, 1, 5, '{havo,vwo}', '{22A,22B}', NULL, false),
('advanced-code-review', 'Advanced Code Review', 'Review van geavanceerde concepten', 3, 1, 6, '{havo,vwo}', '{22B}', NULL, false),

-- LEERJAAR 3 - Periode 2: Cybersecurity & Privacy
('cyber-detective', 'Cyber Detective', 'Gesimuleerd cybermisdrijf onderzoeken', 3, 2, 1, '{havo,vwo}', '{23A,21A}', NULL, false),
('encryption-expert', 'Encryption Expert', 'Encryptie begrijpen en toepassen', 3, 2, 2, '{havo,vwo}', '{23A}', NULL, false),
('phishing-fighter', 'Phishing Fighter', 'Anti-phishing training ontwerpen', 3, 2, 3, '{havo,vwo}', '{23A,22A}', NULL, false),
('security-auditor', 'Security Auditor', 'Website auditen op kwetsbaarheden', 3, 2, 4, '{havo,vwo}', '{23A,21A}', NULL, false),
('digital-forensics', 'Digital Forensics', 'Digitale sporen analyseren', 3, 2, 5, '{havo,vwo}', '{23A,21C}', NULL, false),
('security-review', 'Security Review', 'Review van security-concepten', 3, 2, 6, '{havo,vwo}', '{23A}', NULL, false),

-- LEERJAAR 3 - Periode 3: Maatschappelijke Impact & Innovatie
('startup-simulator', 'Startup Simulator', 'Tech-startup idee ontwikkelen', 3, 3, 1, '{havo,vwo}', '{23C,22A}', NULL, false),
('policy-maker', 'Policy Maker', 'Tech-beleid schrijven voor organisatie', 3, 3, 2, '{havo,vwo}', '{23C,23B}', NULL, false),
('innovation-lab', 'Innovation Lab', 'Oplossing voor maatschappelijk probleem', 3, 3, 3, '{havo,vwo}', '{23C,22A}', NULL, false),
('digital-divide-researcher', 'Digital Divide Researcher', 'Digitale ongelijkheid onderzoeken', 3, 3, 4, '{havo,vwo}', '{23C,23B}', NULL, false),
('tech-impact-analyst', 'Tech Impact Analyst', 'Impact-analyse van specifieke technologie', 3, 3, 5, '{havo,vwo}', '{23C,21D}', NULL, false),
('impact-review', 'Impact Review', 'Review van maatschappelijke concepten', 3, 3, 6, '{havo,vwo}', '{23C}', NULL, false),

-- LEERJAAR 3 - Periode 4: Meesterproef
('portfolio-builder', 'Portfolio Builder', 'Digitaal portfolio bouwen', 3, 4, 1, '{havo,vwo}', '{22A,21A}', NULL, false),
('research-project', 'Research Project', 'Klein onderzoek uitvoeren', 3, 4, 2, '{havo,vwo}', '{21B,21C,23C}', NULL, false),
('prototype-developer', 'Prototype Developer', 'Werkend prototype bouwen', 3, 4, 3, '{havo,vwo}', '{22A,22B}', NULL, false),
('pitch-perfect', 'Pitch Perfect', 'Project pitchen aan jury', 3, 4, 4, '{havo,vwo}', '{21B}', NULL, false),
('reflection-report', 'Reflection Report', 'Reflectieverslag schrijven', 3, 4, 5, '{havo,vwo}', '{23B}', NULL, false),
('meesterproef', 'De Meesterproef', 'Geintegreerd eindproject 3 jaar', 3, 4, 6, '{havo,vwo}', '{21A,21B,21C,21D,22A,22B,23A,23B,23C}', NULL, false)
ON CONFLICT (id) DO NOTHING;
