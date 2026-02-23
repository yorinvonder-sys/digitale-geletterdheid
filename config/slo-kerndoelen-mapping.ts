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
  { id: 'cloud-commander', title: 'Cloud Commander', week: 1, yearGroup: 1, sloKerndoelen: ['21A'], sloVsoKerndoelen: ['18A'] },
  { id: 'word-wizard', title: 'Word Wizard', week: 1, yearGroup: 1, sloKerndoelen: ['21A', '22A'], sloVsoKerndoelen: ['18A', '19A'] },
  { id: 'slide-specialist', title: 'Slide Specialist', week: 1, yearGroup: 1, sloKerndoelen: ['21A', '22A'], sloVsoKerndoelen: ['18A', '19A'] },
  { id: 'print-pro', title: 'Print Pro', week: 1, yearGroup: 1, sloKerndoelen: ['21A'], sloVsoKerndoelen: ['18A'] },

  // Week 2
  { id: 'ipad-print-instructies', title: 'iPad Print Instructies', week: 2, yearGroup: 1, sloKerndoelen: ['21A'], sloVsoKerndoelen: ['18A'], classRestriction: 'MH1A' },
  { id: 'cloud-cleaner', title: 'Cloud Schoonmaker', week: 2, yearGroup: 1, sloKerndoelen: ['21A'], sloVsoKerndoelen: ['18A'] },
  { id: 'layout-doctor', title: 'Word Match', week: 2, yearGroup: 1, sloKerndoelen: ['21A'], sloVsoKerndoelen: ['18A'] },
  { id: 'pitch-police', title: 'Pitch Politie', week: 2, yearGroup: 1, sloKerndoelen: ['21A', '22A'], sloVsoKerndoelen: ['18A', '19A'] },
  { id: 'prompt-master', title: 'Prompt Perfectionist', week: 2, yearGroup: 1, sloKerndoelen: ['21D', '22A'], sloVsoKerndoelen: ['18C', '19A', '20B'] },
  { id: 'game-programmeur', title: 'Game Programmeur', week: 2, yearGroup: 1, sloKerndoelen: ['22A', '22B'], sloVsoKerndoelen: ['19A'] },
  { id: 'ai-trainer', title: 'AI Trainer', week: 2, yearGroup: 1, sloKerndoelen: ['21D'], sloVsoKerndoelen: ['18C'] },
  { id: 'chatbot-trainer', title: 'Chatbot Trainer', week: 2, yearGroup: 1, sloKerndoelen: ['21D', '22A'], sloVsoKerndoelen: ['18C', '19A'] },
  { id: 'ai-tekengame', title: 'AI Tekengame', week: 2, yearGroup: 1, sloKerndoelen: ['21D'], sloVsoKerndoelen: ['18C'] },
  { id: 'game-director', title: 'De Game Director', week: 2, yearGroup: 1, sloKerndoelen: ['22A', '22B'], sloVsoKerndoelen: ['19A'] },
  { id: 'verhalen-ontwerper', title: 'Verhalen Ontwerper', week: 2, yearGroup: 1, sloKerndoelen: ['21D', '22A'], sloVsoKerndoelen: ['18C', '19A'] },
  { id: 'ai-beleid-brainstorm', title: 'AI Beleid Brainstorm', week: 2, yearGroup: 1, sloKerndoelen: ['23B', '23C'], sloVsoKerndoelen: ['20B'] },

  // Week 3
  { id: 'review-week-2', title: 'De Code-Criticus', week: 3, yearGroup: 1, sloKerndoelen: ['21B', '21D'], sloVsoKerndoelen: ['18C'] },
  { id: 'data-detective', title: 'Data Detective', week: 3, yearGroup: 1, sloKerndoelen: ['21B', '23C'], sloVsoKerndoelen: ['18B', '20A'] },
  { id: 'deepfake-detector', title: 'Deepfake Detector', week: 3, yearGroup: 1, sloKerndoelen: ['21B', '21D', '23C'], sloVsoKerndoelen: ['18B', '18C', '20A'] },
  { id: 'ai-spiegel', title: 'De AI Spiegel', week: 3, yearGroup: 1, sloKerndoelen: ['23B', '23C'], sloVsoKerndoelen: ['20A', '20B'] },
  { id: 'social-safeguard', title: 'Social Safeguard', week: 3, yearGroup: 1, sloKerndoelen: ['23A', '23B'], sloVsoKerndoelen: ['20A', '20B'] },
  { id: 'cookie-crusher', title: 'Cookie Crusher', week: 3, yearGroup: 1, sloKerndoelen: ['23C', '21B'], sloVsoKerndoelen: ['18B', '20A'] },
  { id: 'data-handelaar', title: 'De Data Handelaar', week: 3, yearGroup: 1, sloKerndoelen: ['23C', '23B'], sloVsoKerndoelen: ['20A', '20B'] },
  { id: 'privacy-profiel-spiegel', title: 'Privacy Profiel Spiegel', week: 3, yearGroup: 1, sloKerndoelen: ['23A', '23B'], sloVsoKerndoelen: ['20A', '20B'] },
  { id: 'filter-bubble-breaker', title: 'Filter Bubble Breaker', week: 3, yearGroup: 1, sloKerndoelen: ['23B', '23C', '21B'], sloVsoKerndoelen: ['20A', '20B'] },
  { id: 'datalekken-rampenplan', title: 'Datalekken Rampenplan', week: 3, yearGroup: 1, sloKerndoelen: ['23A', '23B', '23C'], sloVsoKerndoelen: ['20A', '20B'] },
  { id: 'data-voor-data', title: 'Data voor Data', week: 3, yearGroup: 1, sloKerndoelen: ['23C', '23B'], sloVsoKerndoelen: ['20A', '20B'] },

  // Week 4
  { id: 'review-week-3', title: 'De Ethische Raad', week: 4, yearGroup: 1, sloKerndoelen: ['23C'], sloVsoKerndoelen: ['20B'] },
  { id: 'mission-blueprint', title: 'De Blauwdruk', week: 4, yearGroup: 1, sloKerndoelen: ['21A', '22A'], sloVsoKerndoelen: ['18A', '19A'] },
  { id: 'mission-vision', title: 'De Visie', week: 4, yearGroup: 1, sloKerndoelen: ['21D', '22A'], sloVsoKerndoelen: ['18C', '19A'] },
  { id: 'mission-launch', title: 'De Lancering', week: 4, yearGroup: 1, sloKerndoelen: ['21A', '21C'], sloVsoKerndoelen: ['18A'] },

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
  { id: 'app-prototyper', title: 'App Prototyper', week: 2, yearGroup: 2, sloKerndoelen: ['22A', '22B'] },
  { id: 'bug-hunter', title: 'Bug Hunter', week: 2, yearGroup: 2, sloKerndoelen: ['22B'] },
  { id: 'automation-engineer', title: 'Automation Engineer', week: 2, yearGroup: 2, sloKerndoelen: ['22A', '22B'] },
  { id: 'code-reviewer', title: 'Code Reviewer', week: 2, yearGroup: 2, sloKerndoelen: ['22B', '23B'] },
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
  { id: 'eindproject-j2', title: 'Eindproject Jaar 2', week: 4, yearGroup: 2, sloKerndoelen: ['21A', '21B', '22A', '22B', '23C'] },

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
  { id: 'innovation-lab', title: 'Innovation Lab', week: 3, yearGroup: 3, sloKerndoelen: ['21D', '22A'] },
  { id: 'digital-divide-researcher', title: 'Digital Divide Researcher', week: 3, yearGroup: 3, sloKerndoelen: ['23C', '23B'] },
  { id: 'tech-impact-analyst', title: 'Tech Impact Analyst', week: 3, yearGroup: 3, sloKerndoelen: ['23C', '21D'] },
  { id: 'impact-review', title: 'Impact Review', week: 3, yearGroup: 3, sloKerndoelen: ['23B', '23C'] },

  // Periode 4: Meesterproef
  { id: 'portfolio-builder', title: 'Portfolio Builder', week: 4, yearGroup: 3, sloKerndoelen: ['21A', '22A'] },
  { id: 'research-project', title: 'Research Project', week: 4, yearGroup: 3, sloKerndoelen: ['21B', '21C', '23C'] },
  { id: 'prototype-developer', title: 'Prototype Developer', week: 4, yearGroup: 3, sloKerndoelen: ['22A', '22B'] },
  { id: 'pitch-perfect', title: 'Pitch Perfect', week: 4, yearGroup: 3, sloKerndoelen: ['21B', '22A'] },
  { id: 'reflection-report', title: 'Reflection Report', week: 4, yearGroup: 3, sloKerndoelen: ['23B', '23C'] },
  { id: 'meesterproef', title: 'Meesterproef', week: 4, yearGroup: 3, sloKerndoelen: ['21A', '21B', '21C', '21D', '22A', '22B', '23A', '23B', '23C'] },
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

export function calculateStudentKerndoelStats(student: StudentData): Record<SloKerndoelCode, KerndoelProgress> {
  const studentClass = student.studentClass || student.stats?.studentClass;
  const vsoProfile = student.stats?.vsoProfile;
  const completedMissions = new Set(student.stats?.missionsCompleted || []);

  const out = Object.fromEntries(
    KERNDOEL_CODES.map((code) => [code, { completed: 0, total: 0, percentage: 0, completedMissions: [], totalMissions: [] }])
  ) as Record<SloKerndoelCode, KerndoelProgress>;

  for (const mission of KERNDOEL_MISSIONS) {
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
