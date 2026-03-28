import { StudentData } from '../types';
import { SloKerndoelCode } from './sloKerndoelen';

export interface KerndoelMissionMeta {
  id: string;
  title: string;
  week: number;
  yearGroup: number;
  sloKerndoelen: SloKerndoelCode[];
  sloVsoKerndoelen?: SloKerndoelCode[]; // VSO mapping
  classRestriction?: string; // only applicable for a specific class (e.g. 'MH1A')
}

// =============================================================================
// DEKKINGSMATRIX — gegenereerd na audit 2026-03-28
// Criteria: Bloom ≥ toepassen, max 3 kerndoelen per missie, 0 uitzonderingen
// Totaal: 90 missie-entries (inclusief review-missies)
//
//           | 21A | 21B | 21C | 21D | 22A | 22B | 23A | 23B | 23C |
// J1 (35m)  |  11 |   4 |   3 |   7 |  13 |   4 |   7 |   5 |  11 |
// J2 (30m)  |   2 |  10 |   5 |   5 |  13 |   6 |   3 |   6 |   7 |
// J3 (24m)  |   5 |   2 |   3 |   4 |   5 |   7 |   6 |   6 |   9 |
// TOTAAL    |  18 |  16 |  11 |  16 |  31 |  17 |  16 |  17 |  27 |
//
// Zwakste kerndoel: 21C (Data & Dataverwerking) — slechts 11 missies totaal.
// Aanbeveling: 2-3 nieuwe missies in J2 of J3 gericht op dataverwerking/visualisatie.
// =============================================================================

// =============================================================================
// WIJZIGINGENLOG — audit 2026-03-28
// Kader: SLO conceptkerndoelen sept. 2025 + Bloom's taxonomie (min. 'toepassen')
//
// TOEGEVOEGD:
//   code-denker (J1w2): [] → ['22B']  — CT-puzzels = computationele denkstrategieën
//
// GECORRIGEERD J1:
//   data-detective:        ['21B','23C']          → ['21C','23C']  — onderzoekt app-data, niet media/nepnieuws
//   data-verzamelaar:      ['21C','21B','23C']     → ['21C','23C']  — 21B-claim zwak (geen media-evaluatie)
//   cookie-crusher:        ['23C','21B']           → ['23A','23C']  — dark patterns = veiligheid, niet mediabegrip
//   data-handelaar:        ['23C','23B']           → ['23A','23C']  — AVG-onderzoek = privacy, niet welzijn
//   filter-bubble-breaker: ['23B','23C','21B']     → ['21B','23C']  — 23B verwijderd (welzijn ≠ filterbubble)
//   datalekken-rampenplan: ['23A','23B','23C']     → ['23A','23C']  — crisis ≠ digitaal welzijn (23B verwijderd)
//   mission-vision:        ['21D','22A']           → ['22A']        — moodboard/pitch heeft geen AI-component
//   mission-launch:        ['21A','21C']           → ['21A','22A']  — flyer/pitch = 22A, niet data-analyse
//
// GECORRIGEERD J2:
//   app-prototyper:        ['22A','22B']           → ['22A']        — wireframes/UX, geen code schrijven
//   code-reviewer:         ['22B','23B']           → ['23B']        — code lezen ≠ programmeren (22B)
//   privacy-by-design:     ['23A','22B']           → ['23A']        — privacy-audit, geen programmeeropdracht
//   network-navigator:     ['21A','22B']           → ['21A']        — begrijpen hoe internet werkt, geen code
//   innovation-lab:        ['21D','22A']           → ['21D','23C']  — focus maatschappij-impact, niet design
//
// GECORRIGEERD J3:
//   prototype-developer:   ['22A','22B']           → ['22A']        — prototyping/design, geen echte code
// =============================================================================

// Source of truth for mission -> SLO kerndoelen mapping.
// Keep this aligned with the mission catalog shown in `components/ProjectZeroDashboard.tsx`.
// Codes conform officiële SLO september 2025:
//   21A = Digitale systemen, 21B = Media & Informatie, 21C = Data & Dataverwerking,
//   21D = AI, 22A = Digitale producten, 22B = Programmeren,
//   23A = Veiligheid & privacy, 23B = Digitaal welzijn, 23C = Maatschappij
export const KERNDOEL_MISSIONS: KerndoelMissionMeta[] = [
  // ============================================================
  // LEERJAAR 1
  // ============================================================

  // Week 1
  { id: 'magister-master', title: 'Magister Meester', week: 1, yearGroup: 1, sloKerndoelen: ['21A'], sloVsoKerndoelen: ['18A'] },
  { id: 'cloud-commander', title: 'Cloud Commander', week: 1, yearGroup: 1, sloKerndoelen: ['21A', '23A'], sloVsoKerndoelen: ['18A', '20A'] },
  { id: 'word-wizard', title: 'Word Wizard', week: 1, yearGroup: 1, sloKerndoelen: ['21A', '22A'], sloVsoKerndoelen: ['18A', '19A'] },
  { id: 'slide-specialist', title: 'Slide Specialist', week: 1, yearGroup: 1, sloKerndoelen: ['21A', '22A'], sloVsoKerndoelen: ['18A', '19A'] },
  { id: 'print-pro', title: 'Print Pro', week: 1, yearGroup: 1, sloKerndoelen: ['21A'], sloVsoKerndoelen: ['18A'] },

  // Week 2
  { id: 'ipad-print-instructies', title: 'iPad Print Instructies', week: 2, yearGroup: 1, sloKerndoelen: ['21A'], sloVsoKerndoelen: ['18A'], classRestriction: 'MH1A' },
  { id: 'cloud-cleaner', title: 'Cloud Schoonmaker', week: 2, yearGroup: 1, sloKerndoelen: ['21A', '23A'], sloVsoKerndoelen: ['18A', '20A'] },
  { id: 'layout-doctor', title: 'Word Match', week: 2, yearGroup: 1, sloKerndoelen: ['21A', '22A'], sloVsoKerndoelen: ['18A', '19A'] },
  { id: 'pitch-police', title: 'Pitch Politie', week: 2, yearGroup: 1, sloKerndoelen: ['21A', '22A'], sloVsoKerndoelen: ['18A', '19A'] },
  { id: 'prompt-master', title: 'Prompt Perfectionist', week: 2, yearGroup: 1, sloKerndoelen: ['21D', '22A'], sloVsoKerndoelen: ['18C', '19A'] },
  { id: 'game-programmeur', title: 'Game Programmeur', week: 2, yearGroup: 1, sloKerndoelen: ['22A', '22B'], sloVsoKerndoelen: ['19A'] },
  { id: 'ai-trainer', title: 'AI Trainer', week: 2, yearGroup: 1, sloKerndoelen: ['21D'], sloVsoKerndoelen: ['18C'] },
  { id: 'chatbot-trainer', title: 'Chatbot Trainer', week: 2, yearGroup: 1, sloKerndoelen: ['21D', '22A'], sloVsoKerndoelen: ['18C', '19A'] },
  { id: 'ai-tekengame', title: 'AI Tekengame', week: 2, yearGroup: 1, sloKerndoelen: ['21D'], sloVsoKerndoelen: ['18C'] },
  { id: 'game-director', title: 'De Game Director', week: 2, yearGroup: 1, sloKerndoelen: ['22A', '22B'], sloVsoKerndoelen: ['19A'] },
  { id: 'verhalen-ontwerper', title: 'Verhalen Ontwerper', week: 2, yearGroup: 1, sloKerndoelen: ['21D', '22A'], sloVsoKerndoelen: ['18C', '19A'] },
  { id: 'ai-beleid-brainstorm', title: 'AI Beleid Brainstorm', week: 2, yearGroup: 1, sloKerndoelen: ['23B', '23C'], sloVsoKerndoelen: ['20B'] },
  // code-denker: CT zonder code — computationele denkstrategieën zijn de kern van SLO 22B
  { id: 'code-denker', title: 'De Code Denker', week: 2, yearGroup: 1, sloKerndoelen: ['22B'], sloVsoKerndoelen: ['19A'] },
  { id: 'website-bouwer', title: 'Website Bouwer', week: 2, yearGroup: 1, sloKerndoelen: ['22B', '22A'], sloVsoKerndoelen: ['19A'] },

  // Week 3
  { id: 'review-week-2', title: 'De Code-Criticus', week: 3, yearGroup: 1, sloKerndoelen: ['21B', '21D'], sloVsoKerndoelen: ['18B', '18C'] },
  // data-detective: onderzoekt welke data apps verzamelen → 21C (data), niet 21B (media/nepnieuws)
  { id: 'data-detective', title: 'Data Detective', week: 3, yearGroup: 1, sloKerndoelen: ['21C', '23C'], sloVsoKerndoelen: ['18B', '20B'] },
  // data-verzamelaar: analyseren dataset schoolreizen → 21C kern; 21B-claim was zwak
  { id: 'data-verzamelaar', title: 'Data Verzamelaar', week: 3, yearGroup: 1, sloKerndoelen: ['21C', '23C'], sloVsoKerndoelen: ['18B', '20B'] },
  { id: 'deepfake-detector', title: 'Deepfake Detector', week: 3, yearGroup: 1, sloKerndoelen: ['21B', '21D', '23C'], sloVsoKerndoelen: ['18B', '18C', '20B'] },
  { id: 'ai-spiegel', title: 'De AI Spiegel', week: 3, yearGroup: 1, sloKerndoelen: ['23B', '23C'], sloVsoKerndoelen: ['20B'] },
  { id: 'social-safeguard', title: 'Social Safeguard', week: 3, yearGroup: 1, sloKerndoelen: ['23A', '23B'], sloVsoKerndoelen: ['20A', '20B'] },
  // cookie-crusher: dark patterns herkennen → 23A (veiligheid/privacy), niet 21B (mediabegrip)
  { id: 'cookie-crusher', title: 'Cookie Crusher', week: 3, yearGroup: 1, sloKerndoelen: ['23A', '23C'], sloVsoKerndoelen: ['20A', '20B'] },
  // data-handelaar: AVG-overtredingen opsporen → 23A (privacy) + 23C (ethiek); 23B (welzijn) niet van toepassing
  { id: 'data-handelaar', title: 'De Data Handelaar', week: 3, yearGroup: 1, sloKerndoelen: ['23A', '23C'], sloVsoKerndoelen: ['20A', '20B'] },
  { id: 'privacy-profiel-spiegel', title: 'Privacy Profiel Spiegel', week: 3, yearGroup: 1, sloKerndoelen: ['23A', '23B'], sloVsoKerndoelen: ['20A', '20B'] },
  // filter-bubble-breaker: algoritme-impact begrijpen → 21B + 23C; 23B (welzijn) verwijderd
  { id: 'filter-bubble-breaker', title: 'Filter Bubble Breaker', week: 3, yearGroup: 1, sloKerndoelen: ['21B', '23C'], sloVsoKerndoelen: ['18B', '20B'] },
  // datalekken-rampenplan: crisisplan bij datalek → 23A + 23C; 23B (welzijn/schermtijd) niet van toepassing
  { id: 'datalekken-rampenplan', title: 'Datalekken Rampenplan', week: 3, yearGroup: 1, sloKerndoelen: ['23A', '23C'], sloVsoKerndoelen: ['20A', '20B'] },
  { id: 'data-voor-data', title: 'Data voor Data', week: 3, yearGroup: 1, sloKerndoelen: ['23C', '23B'], sloVsoKerndoelen: ['20B'] },
  { id: 'data-speurder', title: 'Data Speurder', week: 3, yearGroup: 1, sloKerndoelen: ['21C', '21B'], sloVsoKerndoelen: ['18B'] },

  // Week 4
  { id: 'review-week-3', title: 'De Ethische Raad', week: 4, yearGroup: 1, sloKerndoelen: ['23C'], sloVsoKerndoelen: ['20B'] },
  { id: 'mission-blueprint', title: 'De Blauwdruk', week: 4, yearGroup: 1, sloKerndoelen: ['21A', '22A'], sloVsoKerndoelen: ['18A', '19A'] },
  // mission-vision: moodboard + pitch → 22A (digitaal product); geen AI-component
  { id: 'mission-vision', title: 'De Visie', week: 4, yearGroup: 1, sloKerndoelen: ['22A'], sloVsoKerndoelen: ['19A'] },
  // mission-launch: flyer + pitch ontwerpen → 22A (digitaal product); geen data-analyse (21C)
  { id: 'mission-launch', title: 'De Lancering', week: 4, yearGroup: 1, sloKerndoelen: ['21A', '22A'], sloVsoKerndoelen: ['18A', '19A'] },

  // ============================================================
  // LEERJAAR 2
  // ============================================================

  // Periode 1: Data & Informatie
  { id: 'data-journalist', title: 'Data Journalist', week: 1, yearGroup: 2, sloKerndoelen: ['21B', '21C'] },
  { id: 'spreadsheet-specialist', title: 'Spreadsheet Specialist', week: 1, yearGroup: 2, sloKerndoelen: ['21C', '22A'] },
  { id: 'factchecker', title: 'Factchecker', week: 1, yearGroup: 2, sloKerndoelen: ['21B', '23C'] },
  { id: 'api-verkenner', title: 'API Verkenner', week: 1, yearGroup: 2, sloKerndoelen: ['21C', '21D'] },
  { id: 'dashboard-designer', title: 'Dashboard Designer', week: 1, yearGroup: 2, sloKerndoelen: ['21C', '22A'] },
  { id: 'ai-bias-detective', title: 'AI Bias Detective', week: 1, yearGroup: 2, sloKerndoelen: ['21D', '23C'] },
  { id: 'data-review', title: 'Data Review', week: 1, yearGroup: 2, sloKerndoelen: ['21B', '21C', '21D'] },

  // Periode 2: Programmeren & Computational Thinking
  { id: 'algorithm-architect', title: 'Algorithm Architect', week: 2, yearGroup: 2, sloKerndoelen: ['22B'] },
  { id: 'web-developer', title: 'Web Developer', week: 2, yearGroup: 2, sloKerndoelen: ['22A', '22B'] },
  // app-prototyper: wireframes + UX-design, geen code schrijven → 22A alleen
  { id: 'app-prototyper', title: 'App Prototyper', week: 2, yearGroup: 2, sloKerndoelen: ['22A'] },
  { id: 'bug-hunter', title: 'Bug Hunter', week: 2, yearGroup: 2, sloKerndoelen: ['22B'] },
  { id: 'automation-engineer', title: 'Automation Engineer', week: 2, yearGroup: 2, sloKerndoelen: ['22A', '22B'] },
  // code-reviewer: code lezen + feedback geven; schrijven ≠ 22B → 23B (bewuste keuzes/feedback)
  { id: 'code-reviewer', title: 'Code Reviewer', week: 2, yearGroup: 2, sloKerndoelen: ['23B'] },
  // network-navigator: begrijpen hoe internet werkt → 21A (systemen); geen code schrijven
  { id: 'network-navigator', title: 'Network Navigator', week: 2, yearGroup: 2, sloKerndoelen: ['21A'] },
  // privacy-by-design: privacy-audit van een app → 23A; geen programmeeropdracht
  { id: 'privacy-by-design', title: 'Privacy by Design', week: 2, yearGroup: 2, sloKerndoelen: ['23A'] },
  { id: 'wachtwoord-warrior', title: 'Wachtwoord Warrior', week: 2, yearGroup: 2, sloKerndoelen: ['23A', '21A'] },
  { id: 'code-review-2', title: 'Code Review', week: 2, yearGroup: 2, sloKerndoelen: ['22A', '22B'] },

  // Periode 3: Digitale Media & Creatie
  { id: 'ux-detective', title: 'UX Detective', week: 3, yearGroup: 2, sloKerndoelen: ['22A', '21B'] },
  { id: 'podcast-producer', title: 'Podcast Producer', week: 3, yearGroup: 2, sloKerndoelen: ['22A', '21B'] },
  { id: 'meme-machine', title: 'Meme Machine', week: 3, yearGroup: 2, sloKerndoelen: ['21B', '23B'] },
  { id: 'digital-storyteller', title: 'Digital Storyteller', week: 3, yearGroup: 2, sloKerndoelen: ['22A', '21B'] },
  { id: 'brand-builder', title: 'Brand Builder', week: 3, yearGroup: 2, sloKerndoelen: ['22A', '21B'] },
  { id: 'video-editor', title: 'Video Editor', week: 3, yearGroup: 2, sloKerndoelen: ['22A', '21B'] },
  { id: 'media-review', title: 'Media Review', week: 3, yearGroup: 2, sloKerndoelen: ['22A', '21B', '23B'] },

  // Periode 4: Ethiek, Maatschappij & Eindproject
  { id: 'ai-ethicus', title: 'AI Ethicus', week: 4, yearGroup: 2, sloKerndoelen: ['21D', '23C'] },
  { id: 'digital-rights-defender', title: 'Digital Rights Defender', week: 4, yearGroup: 2, sloKerndoelen: ['23A', '23B'] },
  { id: 'tech-court', title: 'Tech Court', week: 4, yearGroup: 2, sloKerndoelen: ['23B', '23C'] },
  { id: 'future-forecaster', title: 'Future Forecaster', week: 4, yearGroup: 2, sloKerndoelen: ['21D', '23C'] },
  { id: 'sustainability-scanner', title: 'Sustainability Scanner', week: 4, yearGroup: 2, sloKerndoelen: ['23C', '23B'] },
  // eindproject-j2: capstone J2 — leerling kiest vrij project; de 3 sterkste gecoachte doelen
  { id: 'eindproject-j2', title: 'Eindproject Jaar 2', week: 4, yearGroup: 2, sloKerndoelen: ['22A', '22B', '23C'] },

  // ============================================================
  // LEERJAAR 3 (alleen havo + vwo)
  // ============================================================

  // Periode 1: Geavanceerd Programmeren & AI
  { id: 'ml-trainer', title: 'ML Trainer', week: 1, yearGroup: 3, sloKerndoelen: ['22B', '21D'] },
  { id: 'api-architect', title: 'API Architect', week: 1, yearGroup: 3, sloKerndoelen: ['22B', '21C'] },
  { id: 'neural-navigator', title: 'Neural Navigator', week: 1, yearGroup: 3, sloKerndoelen: ['21D', '22B'] },
  { id: 'data-pipeline', title: 'Data Pipeline', week: 1, yearGroup: 3, sloKerndoelen: ['21C', '22B'] },
  { id: 'open-source-contributor', title: 'Open Source Contributor', week: 1, yearGroup: 3, sloKerndoelen: ['22A', '22B', '23B'] },
  { id: 'advanced-code-review', title: 'Advanced Code Review', week: 1, yearGroup: 3, sloKerndoelen: ['22B'] },

  // Periode 2: Cybersecurity & Privacy
  { id: 'cyber-detective', title: 'Cyber Detective', week: 2, yearGroup: 3, sloKerndoelen: ['23A', '21A'] },
  { id: 'encryption-expert', title: 'Encryption Expert', week: 2, yearGroup: 3, sloKerndoelen: ['23A', '21A'] },
  { id: 'phishing-fighter', title: 'Phishing Fighter', week: 2, yearGroup: 3, sloKerndoelen: ['23A'] },
  { id: 'security-auditor', title: 'Security Auditor', week: 2, yearGroup: 3, sloKerndoelen: ['23A', '21A'] },
  { id: 'digital-forensics', title: 'Digital Forensics', week: 2, yearGroup: 3, sloKerndoelen: ['23A', '21A'] },
  { id: 'security-review', title: 'Security Review', week: 2, yearGroup: 3, sloKerndoelen: ['23A'] },

  // Periode 3: Maatschappelijke Impact & Innovatie
  { id: 'startup-simulator', title: 'Startup Simulator', week: 3, yearGroup: 3, sloKerndoelen: ['23B', '23C'] },
  { id: 'policy-maker', title: 'Policy Maker', week: 3, yearGroup: 3, sloKerndoelen: ['23C', '23B'] },
  // innovation-lab: tech-oplossingen voor maatschappij → 21D + 23C; focus is impact, niet design (22A verwijderd)
  { id: 'innovation-lab', title: 'Innovation Lab', week: 3, yearGroup: 3, sloKerndoelen: ['21D', '23C'] },
  { id: 'digital-divide-researcher', title: 'Digital Divide Researcher', week: 3, yearGroup: 3, sloKerndoelen: ['23C', '23B'] },
  { id: 'tech-impact-analyst', title: 'Tech Impact Analyst', week: 3, yearGroup: 3, sloKerndoelen: ['23C', '21D'] },
  { id: 'impact-review', title: 'Impact Review', week: 3, yearGroup: 3, sloKerndoelen: ['23B', '23C'] },

  // Periode 4: Meesterproef
  { id: 'portfolio-builder', title: 'Portfolio Builder', week: 4, yearGroup: 3, sloKerndoelen: ['21A', '22A'] },
  { id: 'research-project', title: 'Research Project', week: 4, yearGroup: 3, sloKerndoelen: ['21B', '21C', '23C'] },
  // prototype-developer: prototyping + design; geen echte code schrijven → 22A alleen
  { id: 'prototype-developer', title: 'Prototype Developer', week: 4, yearGroup: 3, sloKerndoelen: ['22A'] },
  { id: 'pitch-perfect', title: 'Pitch Perfect', week: 4, yearGroup: 3, sloKerndoelen: ['21B', '22A'] },
  { id: 'reflection-report', title: 'Reflection Report', week: 4, yearGroup: 3, sloKerndoelen: ['23B', '23C'] },
  // meesterproef: 3-jarig capstone — integreert alle domeinen, maar focus op de 3 kernactiviteiten
  // (bouwen, programmeren, maatschappelijke verantwoording) voor consistente rapportage
  { id: 'meesterproef', title: 'Meesterproef', week: 4, yearGroup: 3, sloKerndoelen: ['22A', '22B', '23C'] },
];

export const KERNDOEL_CODES: SloKerndoelCode[] = [
  // Regulier
  '21A', '21B', '21C', '21D', '22A', '22B', '23A', '23B', '23C',
  // VSO
  '18A', '18B', '18C', '19A', '20A', '20B'
];

const missionById: Record<string, KerndoelMissionMeta> = Object.fromEntries(
  KERNDOEL_MISSIONS.map((m) => [m.id, m])
);

export function getMissionMeta(missionId: string): KerndoelMissionMeta | undefined {
  return missionById[missionId];
}

export function getKerndoelenForMission(missionId: string): SloKerndoelCode[] {
  return missionById[missionId]?.sloKerndoelen || [];
}

export function isMissionApplicableToStudent(mission: KerndoelMissionMeta, studentClass?: string): boolean {
  if (!mission.classRestriction) return true;
  return String(studentClass || '').toUpperCase() === String(mission.classRestriction).toUpperCase();
}

export interface KerndoelProgress {
  completed: number;
  total: number;
  percentage: number;
  completedMissions: string[];
  totalMissions: string[];
}

export function calculateStudentKerndoelStats(student: StudentData, yearGroup?: number): Record<SloKerndoelCode, KerndoelProgress> {
  const studentClass = student.studentClass || student.stats?.studentClass;
  const vsoProfile = student.stats?.vsoProfile;
  const completedMissions = new Set(student.stats?.missionsCompleted || []);

  // When a yearGroup is provided, only consider missions from that year
  const missions = yearGroup != null
    ? KERNDOEL_MISSIONS.filter(m => m.yearGroup === yearGroup)
    : KERNDOEL_MISSIONS;

  const out = Object.fromEntries(
    KERNDOEL_CODES.map((code) => [code, { completed: 0, total: 0, percentage: 0, completedMissions: [], totalMissions: [] }])
  ) as Record<SloKerndoelCode, KerndoelProgress>;

  for (const mission of missions) {
    if (!isMissionApplicableToStudent(mission, studentClass)) continue;

    // Select codes based on profile
    const codes = (vsoProfile && mission.sloVsoKerndoelen)
      ? mission.sloVsoKerndoelen
      : mission.sloKerndoelen;

    for (const code of codes) {
      if (!out[code]) continue;
      out[code].total += 1;
      out[code].totalMissions.push(mission.id);
      if (completedMissions.has(mission.id)) {
        out[code].completed += 1;
        out[code].completedMissions.push(mission.id);
      }
    }
  }

  for (const code of KERNDOEL_CODES) {
    const s = out[code];
    s.percentage = s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0;
  }

  return out;
}
