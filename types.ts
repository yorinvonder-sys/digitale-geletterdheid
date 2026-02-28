
import { ReactNode } from 'react';

export interface CodeChange {
  variable: string;
  label: string;
  oldValue: string;
  newValue: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: string; // Optionele base64 image data
  timestamp: Date;
  codeChanges?: CodeChange[]; // Track what changed in game code
}

export type RoleId =
  // Leerjaar 1 - Periode 1
  'magister-master' | 'cloud-commander' | 'word-wizard' | 'social-media-psychologist' | 'slide-specialist' | 'print-pro' | 'layout-doctor' |
  // Leerjaar 1 - Periode 2
  'ipad-print-instructies' | 'review-week-1' | 'week1-review' | 'verhalen-ontwerper' | 'nepnieuws-speurder' | 'game-programmeur' | 'ai-trainer' | 'chatbot-trainer' | 'ai-tekengame' |
  // Leerjaar 1 - Periode 3
  'review-week-2' | 'ai-spiegel' | 'social-safeguard' | 'data-detective' | 'deepfake-detector' | 'cookie-crusher' | 'data-handelaar' | 'privacy-profiel-spiegel' | 'filter-bubble-breaker' | 'datalekken-rampenplan' | 'data-voor-data' |
  // Leerjaar 1 - Periode 4
  'review-week-3' | 'mission-blueprint' | 'mission-vision' | 'mission-launch' | 'startup-pitch' |
  // Leerjaar 1 - Speciaal
  'ai-beleid-brainstorm' |
  // Leerjaar 1 - Reviews
  'cloud-cleaner' | 'pitch-police' |
  // Leerjaar 2 - Periode 1: Data & Informatie
  'data-journalist' | 'spreadsheet-specialist' | 'factchecker' | 'api-verkenner' | 'dashboard-designer' | 'ai-bias-detective' | 'data-review' |
  // Leerjaar 2 - Periode 2: Programmeren & CT
  'algorithm-architect' | 'web-developer' | 'app-prototyper' | 'bug-hunter' | 'automation-engineer' | 'code-reviewer' | 'code-review-2' |
  // Leerjaar 2 - Periode 3: Digitale Media & Creatie
  'ux-detective' | 'podcast-producer' | 'meme-machine' | 'digital-storyteller' | 'brand-builder' | 'video-editor' | 'media-review' |
  // Leerjaar 2 - Periode 4: Ethiek & Eindproject
  'ai-ethicus' | 'digital-rights-defender' | 'tech-court' | 'future-forecaster' | 'sustainability-scanner' | 'eindproject-j2' |
  // Leerjaar 3 - Periode 1: Geavanceerd Programmeren & AI
  'ml-trainer' | 'api-architect' | 'neural-navigator' | 'data-pipeline' | 'open-source-contributor' | 'advanced-code-review' |
  // Leerjaar 3 - Periode 2: Cybersecurity & Privacy
  'cyber-detective' | 'encryption-expert' | 'phishing-fighter' | 'security-auditor' | 'digital-forensics' | 'security-review' |
  // Leerjaar 3 - Periode 3: Maatschappelijke Impact
  'startup-simulator' | 'policy-maker' | 'innovation-lab' | 'digital-divide-researcher' | 'tech-impact-analyst' | 'impact-review' |
  // Leerjaar 3 - Periode 4: Meesterproef
  'portfolio-builder' | 'research-project' | 'prototype-developer' | 'pitch-perfect' | 'reflection-report' | 'meesterproef';

export type UserRole = 'student' | 'teacher' | 'admin' | 'developer';

export type VsoProfile = 'dagbesteding' | 'arbeidsmarkt';

export type EducationLevel = 'mavo' | 'havo' | 'vwo';

// Contract voor de Parent App (Het Grote Project)
export interface ParentUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: UserRole;
  identifier: string; // Leerlingnummer of afkorting
  schoolId?: string; // School/Tenant ID
  studentClass?: string; // Student's class (e.g. 'MH1A')
  stats?: UserStats;
  mustChangePassword?: boolean;
  chatLocked?: boolean;
  chatLockReason?: string;
  chatLockTime?: any;
  /** M-05: True if privileged role requires MFA but hasn't completed setup/verification */
  mfaPending?: boolean;
  yearGroup?: number;
  educationLevel?: EducationLevel;
}

// Props voor de Hoofd Module
export interface AiLabProps {
  user: ParentUser | null; // De ingelogde gebruiker vanuit de parent app
  onExit?: () => void;     // Optie om terug te gaan naar het hoofdmenu
  saveProgress?: (stats: UserStats) => void; // Optie om progressie op te slaan
  initialRole?: RoleId; // Optionele start rol voor deep-linking
  libraryData?: any; // Data from library item (gameCode, bookData, etc.)
  vsoProfile?: VsoProfile; // Optional learning-profile hint for missions
}

export interface MissionStep {
  title: string;
  description: string;
  example: string; // Verplicht voorbeeld voor de leerling
}

// Bonus challenges for differentiation (fast learners)
export interface BonusChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  hint?: string;  // Optional hint for students who struggle
}

export interface AgentRole {
  id: RoleId;
  title: string;
  icon: ReactNode;
  color: string;
  description: string;
  systemInstruction: string;
  missionObjective: string; // De Oplossing/Taak
  problemScenario: string;  // NIEUW: Het Probleem/De Urgentie
  briefingImage: string;    // NIEUW: Visuele ondersteuning
  difficulty: 'Easy' | 'Medium' | 'Hard';
  examplePrompt: string;
  steps: MissionStep[];
  visualPreview: ReactNode;
  initialCode?: string;
  bonusChallenges?: BonusChallenge[];  // Optional bonus challenges for fast learners
  // NEW: Clear goal system
  primaryGoal?: string;  // Clear, achievable goal description
  goalCriteria?: {
    type: 'message-count' | 'code-changes' | 'steps-complete' | 'custom';
    min?: number;  // Minimum count to achieve goal
  };
  yearGroup?: number;
  educationLevels?: EducationLevel[];
}

export interface AvatarConfig {
  baseModel: 'standard' | 'slim' | 'robot';
  skinColor: string;
  shirtColor: string;
  pantsColor: string;
  hairColor?: string; // New: Custom hair color
  eyeColor?: string; // New: Custom eye color
  shoeColor?: string; // New: Custom shoe color
  accessoryColor?: string;
  // Expanded accessory options
  accessory: 'none' | 'cap' | 'glasses' | 'sunglasses' | 'headphones' | 'earbuds' | 'backpack' | 'satchel' | 'skateboard' | 'beanie' | 'bandana' | 'crown' | 'halo' | 'watch' | 'smartwatch' | 'necklace' | 'chain' | 'scarf' | 'bowtie' | 'tie' | 'guitar' | 'wings' | 'cape' | 'sword' | 'shield' | 'pet_cat' | 'pet_dog' | 'robot_arm' | 'crown_gold' | 'jetpack' | 'wings_cyber' | 'pet_robo';
  accessories?: string[]; // Allow array of accessories for backward compatibility
  hairStyle: 'short' | 'pigtails' | 'spiky' | 'messy' | 'long' | 'bob' | 'fade' | 'curls' | 'ponytail' | 'braids' | 'buzzcut' | 'mohawk' | 'afro' | 'bun' | 'sidepart';
  // Expanded shirt styles
  shirtStyle?: 't-shirt' | 'hoodie' | 'varsity' | 'polo' | 'tank' | 'sweater' | 'flannel' | 'denim' | 'jersey' | 'trackjacket' | 'leather' | 'bomber' | 'blazer' | 'puffer' | 'kimono' | 'suit_diamond';
  // New: Pants style options
  pantsStyle?: 'standard' | 'chinos' | 'shorts' | 'joggers' | 'cargo' | 'skinny' | 'ripped' | 'baggy' | 'sweatpants' | 'formal' | 'skirt' | 'pleated';
  // Facial expression
  expression?: 'neutral' | 'happy' | 'cool' | 'surprised';
  // Body pose
  pose?: 'idle' | 'wave' | 'dab' | 'peace';
  gender: 'male' | 'female';
}

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  baseModel: 'standard',
  skinColor: '#f5d0b0',
  shirtColor: '#3b82f6',
  pantsColor: '#1e293b',
  accessory: 'none',
  hairStyle: 'short',
  shirtStyle: 't-shirt',
  hairColor: '#5D4037',
  eyeColor: '#111111',
  shoeColor: '#1a1a1a',
  gender: 'male'
};

// Alias for game components
export type AvatarState = AvatarConfig;

export interface MissionProgress {
  completedSteps: number[];
  lastActive: any; // Timestamp
  data: any; // Role-specific data (GameCode, BookData, etc.)
  chatHistory?: ChatMessageSummary[]; // Optional - not stored for privacy (GDPR data minimization)
}

export interface ChatMessageSummary {
  role: 'user' | 'model';
  text: string;
}

export interface UserStats {
  xp: number;
  level: number;
  missionsCompleted: string[];
  inventory: string[];
  activeMission?: string;
  avatarConfig?: AvatarConfig;
  hasCompletedOnboarding?: boolean;
  hasCompletedAvatarSetup?: boolean;
  hasCompletedTeacherOnboarding?: boolean;
  hasCompletedTeacherTutorial?: boolean;
  studentClass?: string; // Student's class, synced from profile
  badges?: string[];
  completedIntroWeeks?: number[]; // Tracks which week intros have been seen
  missionProgress?: Record<string, MissionProgress>; // KEY = missionId (e.g. 'game-programmeur')
  savedOutfits?: AvatarConfig[]; // Save up to 3 favorite outfits
  vsoProfile?: VsoProfile; // VSO profile for differentiation
  yearGroup?: number;
  educationLevel?: EducationLevel;
  dailyStreak?: number;
  lastLoginDate?: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export interface BookPage {
  text: string;
  image?: string;
}

export interface BookData {
  title: string;
  coverImage?: string;
  pages: BookPage[];
}

export interface DetectiveClue {
  id: string;
  label: string;
  type: 'metadata' | 'visual' | 'source' | 'context';
  content: string;
  isFakeIndicator: boolean;
  found: boolean;
}

export interface DetectiveCase {
  title: string;
  imageUrl: string;
  description: string;
  clues: DetectiveClue[];
  correctVerdict: 'real' | 'fake';
  // Enhanced fields for deeper investigation
  level?: 1 | 2 | 3;  // Difficulty level
  type?: 'ai-generated' | 'manipulated' | 'fake-news' | 'deepfake' | 'misleading';
  metadata?: {
    format: string;
    dimensions: string;
    date: string;
    software?: string;  // AI tool = red flag
    location?: string;
    camera?: string;
    source?: string;
  };
  explanation?: string;  // Why it's fake/real - shown after verdict
  reverseSearch?: {
    status: 'match' | 'no-match' | 'partial';
    resultCount: number;
    topMatchDate?: string;
    topMatchSource?: string;
    isSuspicious: boolean;
  };
  searchResults?: {
    title: string;
    snippet: string;
    source: string;
    date?: string;
  }[];
}

export interface TrainerData {
  classALabel: string; // Bijv. "Plastic"
  classBLabel: string; // Bijv. "Papier"
  classAItems: string[];
  classBItems: string[];
  testItem?: {
    name: string;
    predictedClass: 'A' | 'B' | 'unknown';
    confidence: number;
  };
}

export interface StudentData extends ParentUser {
  stats?: UserStats;
  lastLogin?: any;
  lastActive?: any;
}

export interface GamificationEvent {
  id?: string;
  type: 'xp_boost' | 'competition' | 'badge_unlock';
  name: string;
  multiplier?: number;
  targetClass?: string;
  startTime: any; // ISO timestamp string
  endTime: any; // ISO timestamp string
  active: boolean;
}

// Quiz Interfaces
// Quiz Interfaces
export interface QuizOption {
  id: string;
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  options: QuizOption[];
}

// TEACHER DASHBOARD ENHANCEMENTS
export interface StudentActivity {
  id?: string;
  uid: string;
  schoolId?: string;
  studentName: string;
  type: 'login' | 'mission_start' | 'mission_complete' | 'xp_earned' | 'badge_earned' | 'focus_lost' | 'test_taken';
  data: string; // Detail info bijv "M1 voltooid" of "100 XP"
  // Optional structured metadata for analysis/export.
  // Kept optional for backwards compatibility with older activity docs.
  missionId?: string;
  timestamp: any;
}

export interface HighlightedWork {
  id?: string;
  uid: string;
  schoolId?: string;
  studentName: string;
  missionId: string;
  title: string;
  content: string; // Bijv prompt of code snippet
  teacherNote?: string;
  timestamp: any;
}

export interface ClassroomConfig {
  id: string; // Class name (e.g. MH1A)
  schoolId?: string;
  focusMode: boolean;
  focusMissionId?: string; // ID of required mission during focus mode
  focusMissionTitle?: string; // Title of mission for display
  pinnedMissionId?: string;
  activeAnnouncement?: string;
  lockedMissions?: string[];
  minimumXpLevel?: number;
}

// AI Beleid Brainstorm types
export interface AiBeleidIdee {
  id?: string;
  uid: string;
  schoolId?: string;
  studentName: string;
  studentClass?: string;
  categorie: 'regels' | 'mogelijkheden' | 'zorgen' | 'suggesties';
  idee: string;
  stemmen: number;
  gestemdeUids: string[]; // Voorkomt dubbel stemmen
  timestamp: any;
}

// Teacher Notes - private notes about students
export interface TeacherNote {
  id?: string;
  studentUid: string;
  teacherUid: string;
  schoolId?: string;
  teacherName: string;
  note: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: any;
  updatedAt: any;
}

// Student Groups for differentiation
export interface StudentGroup {
  id?: string;
  classId: string;
  schoolId?: string;
  name: string;
  color: string;
  description?: string;
  studentUids: string[];
  createdAt: any;
}

// Hybrid assessment record (AI + teacher validation)
export interface HybridAssessmentRecord {
  id?: string;
  uid: string;
  schoolId?: string;
  studentName: string;
  studentClass?: string;
  missionId: string;
  autoScore: number;
  teacherScore: number;
  finalScore: number;
  passed: boolean;
  teacherChecks: Record<string, boolean>;
  weights: {
    autoWeight: number;
    teacherWeight: number;
  };
  timestamp: any;
}
