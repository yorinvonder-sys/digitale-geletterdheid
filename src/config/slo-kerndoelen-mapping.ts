import { StudentData } from '@/types';
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
//
// Audit: 2026-03-28 — alle tags gevalideerd tegen systemInstruction-inhoud in agents.tsx
export const KERNDOEL_MISSIONS: KerndoelMissionMeta[] = [
  // ============================================================
  // LEERJAAR 1
  // ============================================================

  // Periode 1: Digitale Basisvaardigheden
  { id: 'magister-master', title: 'Magister Meester', week: 1, yearGroup: 1, sloKerndoelen: ['21A'], sloVsoKerndoelen: ['18A'] },
  { id: 'cloud-commander', title: 'Cloud Commander', week: 1, yearGroup: 1, sloKerndoelen: ['21A', '23A'], sloVsoKerndoelen: ['18A', '20A'] },
  { id: 'word-wizard', title: 'Word Wizard', week: 1, yearGroup: 1, sloKerndoelen: ['21A', '22A'], sloVsoKerndoelen: ['18A', '19A'] },
  { id: 'slide-specialist', title: 'Slide Specialist', week: 1, yearGroup: 1, sloKerndoelen: ['21A', '22A'], sloVsoKerndoelen: ['18A', '19A'] },
  { id: 'print-pro', title: 'Print Pro', week: 1, yearGroup: 1, sloKerndoelen: ['21A', '23A'], sloVsoKerndoelen: ['18A', '20A'] },

  // Periode 1 review
  { id: 'ipad-print-instructies', title: 'iPad Print Instructies', week: 2, yearGroup: 1, sloKerndoelen: ['21A'], sloVsoKerndoelen: ['18A'], classRestriction: 'MH1A' },
  { id: 'cloud-cleaner', title: 'Cloud Schoonmaker', week: 2, yearGroup: 1, sloKerndoelen: ['21A', '23A'], sloVsoKerndoelen: ['18A', '20A'] },
  { id: 'layout-doctor', title: 'Word Match', week: 2, yearGroup: 1, sloKerndoelen: ['21A', '22A'], sloVsoKerndoelen: ['18A', '19A'] },
  { id: 'pitch-police', title: 'Pitch Politie', week: 2, yearGroup: 1, sloKerndoelen: ['21A', '22A'], sloVsoKerndoelen: ['18A', '19A'] },

  // Assessment P1
  { id: 'assessment-j1-p1', title: 'Nulmeting Periode 1', week: 1, yearGroup: 1, sloKerndoelen: ['21A', '22A', '23A'] },

  // Periode 2: AI & Creatie
  { id: 'prompt-master', title: 'Prompt Perfectionist', week: 2, yearGroup: 1, sloKerndoelen: ['21D', '22A'], sloVsoKerndoelen: ['18C', '19A', '20B'] },
  { id: 'game-programmeur', title: 'Game Programmeur', week: 2, yearGroup: 1, sloKerndoelen: ['22A', '22B'], sloVsoKerndoelen: ['19A'] },
  { id: 'ai-trainer', title: 'AI Trainer', week: 2, yearGroup: 1, sloKerndoelen: ['21D', '21C'], sloVsoKerndoelen: ['18C'] },                              // +21C: trainingsdata = dataverwerking
  { id: 'chatbot-trainer', title: 'Chatbot Trainer', week: 2, yearGroup: 1, sloKerndoelen: ['21D', '22B'], sloVsoKerndoelen: ['18C', '19A'] },                // 22A→22B: IF-THEN regels = programmeerlogica
  { id: 'ai-tekengame', title: 'AI Tekengame', week: 2, yearGroup: 1, sloKerndoelen: ['21D'], sloVsoKerndoelen: ['18C'] },
  { id: 'game-director', title: 'De Game Director', week: 2, yearGroup: 1, sloKerndoelen: ['22B'], sloVsoKerndoelen: ['19A'] },                               // -22A: focus is visueel programmeren, niet productontwerp
  { id: 'verhalen-ontwerper', title: 'Verhalen Ontwerper', week: 2, yearGroup: 1, sloKerndoelen: ['21D', '22A'], sloVsoKerndoelen: ['18C', '19A'] },
  { id: 'ai-beleid-brainstorm', title: 'AI Beleid Brainstorm', week: 2, yearGroup: 1, sloKerndoelen: ['21D', '23C'], sloVsoKerndoelen: ['20B'] },              // 23B→21D: gaat over AI-regels, niet persoonlijk welzijn
  { id: 'code-denker', title: 'Code Denker', week: 2, yearGroup: 1, sloKerndoelen: ['22B'], sloVsoKerndoelen: ['19A'] },                                      // -21D: puur computational thinking, geen AI
  { id: 'website-bouwer', title: 'Website Bouwer', week: 2, yearGroup: 1, sloKerndoelen: ['22B', '22A'], sloVsoKerndoelen: ['19A'] },

  { id: 'schermtijd-coach', title: 'Schermtijd Coach', week: 2, yearGroup: 1, sloKerndoelen: ['23B', '21D'], sloVsoKerndoelen: ['20A', '18C'] },                  // digitaal welzijn + AI-bewustzijn (hoe apps je sturen)
  { id: 'notificatie-ninja', title: 'Notificatie Ninja', week: 2, yearGroup: 1, sloKerndoelen: ['23B', '21B'], sloVsoKerndoelen: ['20A', '18B'] },             // dark patterns in notificaties = welzijn + mediawijsheid

  // Periode 2 review
  { id: 'review-week-2', title: 'De Code-Criticus', week: 3, yearGroup: 1, sloKerndoelen: ['21D', '22B'], sloVsoKerndoelen: ['18C'] },                        // 21B→22B: review bevat code-bugs herkennen

  // Assessment P2
  { id: 'assessment-j1-p2', title: 'Nulmeting Periode 2', week: 2, yearGroup: 1, sloKerndoelen: ['21D', '22A', '22B', '23C'] },

  // Periode 3: Digitaal Burgerschap
  { id: 'data-detective', title: 'Data Detective', week: 3, yearGroup: 1, sloKerndoelen: ['23A', '21C'], sloVsoKerndoelen: ['18B', '20A'] },                  // 21B,23C→23A,21C: app-permissies en data-tracking = privacy + data
  { id: 'data-verzamelaar', title: 'Data Verzamelaar', week: 3, yearGroup: 1, sloKerndoelen: ['21C', '23C'], sloVsoKerndoelen: ['18B', '20B'] },               // -21B: data-analyse + gemeenteadvies, geen mediawijsheid
  { id: 'deepfake-detector', title: 'Deepfake Detector', week: 3, yearGroup: 1, sloKerndoelen: ['21B', '21D', '23A', '23C'], sloVsoKerndoelen: ['18B', '18C', '20A'] }, // +23A: strafbaarheid + jezelf beschermen
  { id: 'ai-spiegel', title: 'De AI Spiegel', week: 3, yearGroup: 1, sloKerndoelen: ['23A', '23B', '21C'], sloVsoKerndoelen: ['20A', '20B'] },                // 23C→23A,21C: privacy-instellingen checken + data-bewustzijn
  { id: 'social-safeguard', title: 'Social Safeguard', week: 3, yearGroup: 1, sloKerndoelen: ['23B', '23A'], sloVsoKerndoelen: ['20A', '20B'] },
  { id: 'scroll-stopper', title: 'De Scroll Stopper', week: 3, yearGroup: 1, sloKerndoelen: ['23B', '21B'], sloVsoKerndoelen: ['20A', '20B'] },                   // scrollgedrag + manipulatieve UX-design = welzijn + mediawijsheid
  { id: 'cookie-crusher', title: 'Cookie Crusher', week: 3, yearGroup: 1, sloKerndoelen: ['23A', '23C'], sloVsoKerndoelen: ['18B', '20A'] },                  // 21B→23A: dark patterns + AVG = privacy + regelgeving
  { id: 'mail-detective', title: 'Mail Detective', week: 3, yearGroup: 1, sloKerndoelen: ['23A'], sloVsoKerndoelen: ['18B', '20A'] },                         // herkennen van nep-mails = veiligheid & privacy; VSO: 18B mediawijsheid + 20A digitale veiligheid
  { id: 'data-handelaar', title: 'De Data Handelaar', week: 3, yearGroup: 1, sloKerndoelen: ['23A', '23C'], sloVsoKerndoelen: ['20A', '20B'] },                // 23B→23A: AVG-overtredingen opsporen = privacy
  { id: 'filter-bubble-breaker', title: 'Filter Bubble Breaker', week: 3, yearGroup: 1, sloKerndoelen: ['21B', '23C'], sloVsoKerndoelen: ['20A', '20B'] },     // -23B: filterbubbels = mediawijsheid + maatschappij
  { id: 'datalekken-rampenplan', title: 'Datalekken Rampenplan', week: 3, yearGroup: 1, sloKerndoelen: ['23A', '21A'], sloVsoKerndoelen: ['20A', '18A'] },      // -23B,-23C,+21A: security incident = veiligheid + systeemdenken
  { id: 'data-voor-data', title: 'Data voor Data', week: 3, yearGroup: 1, sloKerndoelen: ['23A', '23C'], sloVsoKerndoelen: ['20A', '20B'] },                   // 23B→23A: data ruilen voor diensten = privacy + maatschappij
  { id: 'data-speurder', title: 'Data Speurder', week: 3, yearGroup: 1, sloKerndoelen: ['21C'], sloVsoKerndoelen: ['18B'] },                                   // -21B: puur data verzamelen en analyseren
  { id: 'digitale-balans-coach', title: 'Digitale Balans Coach', week: 3, yearGroup: 1, sloKerndoelen: ['23B', '23A'], sloVsoKerndoelen: ['20A', '20B'] },     // waarden-gebaseerde zelfregulatie + privacy-bewustzijn

  // Assessment P3
  { id: 'assessment-j1-p3', title: 'Nulmeting Periode 3', week: 3, yearGroup: 1, sloKerndoelen: ['23A', '23B', '23C', '21B', '21C'] },

  // Periode 4: Eindproject
  { id: 'review-week-3', title: 'De Ethische Raad', week: 4, yearGroup: 1, sloKerndoelen: ['23C', '21D'], sloVsoKerndoelen: ['20B'] },                         // +21D: bevat AI-bias dilemma
  { id: 'mission-blueprint', title: 'De Blauwdruk', week: 4, yearGroup: 1, sloKerndoelen: ['22A'], sloVsoKerndoelen: ['19A'] },                                // -21A: projectplan maken = product, niet systeemkennis
  { id: 'mission-vision', title: 'De Visie', week: 4, yearGroup: 1, sloKerndoelen: ['22A', '21B'], sloVsoKerndoelen: ['19A', '18B'] },                         // 21D→21B: moodboard + pitch = product + visuele communicatie
  { id: 'mission-launch', title: 'De Lancering', week: 4, yearGroup: 1, sloKerndoelen: ['22A', '21B'], sloVsoKerndoelen: ['19A', '18B'] },                     // 21A,21C→22A,21B: flyer ontwerpen = product + communicatie

  // Assessment P4
  { id: 'assessment-j1-p4', title: 'Nulmeting Periode 4', week: 4, yearGroup: 1, sloKerndoelen: ['21A', '21B', '21D', '22A', '23C'] },

  // ============================================================
  // LEERJAAR 2
  // ============================================================

  // Periode 1: Data & Informatie
  { id: 'data-journalist', title: 'Data Journalist', week: 1, yearGroup: 2, sloKerndoelen: ['21C', '22A'], sloVsoKerndoelen: ['18B', '19A'] },                  // 21B→22A: data-analyse + infographic maken = data + product
  { id: 'spreadsheet-specialist', title: 'Spreadsheet Specialist', week: 1, yearGroup: 2, sloKerndoelen: ['21C', '22A'], sloVsoKerndoelen: ['18B', '19A'] },
  { id: 'factchecker', title: 'Factchecker', week: 1, yearGroup: 2, sloKerndoelen: ['21B', '23C'], sloVsoKerndoelen: ['18B', '20B'] },
  { id: 'api-verkenner', title: 'API Verkenner', week: 1, yearGroup: 2, sloKerndoelen: ['21A', '21C'], sloVsoKerndoelen: ['18A', '18B'] },                      // 21D→21A: APIs begrijpen = systeemkennis, geen AI
  { id: 'dashboard-designer', title: 'Dashboard Designer', week: 1, yearGroup: 2, sloKerndoelen: ['21C', '22A'], sloVsoKerndoelen: ['18B', '19A'] },
  { id: 'ai-bias-detective', title: 'AI Bias Detective', week: 1, yearGroup: 2, sloKerndoelen: ['21D', '23C'], sloVsoKerndoelen: ['18C', '20B'] },
  { id: 'data-review', title: 'Data Review', week: 1, yearGroup: 2, sloKerndoelen: ['21B', '21C', '21D'], sloVsoKerndoelen: ['18B', '18C'] },

  // Assessment P1
  { id: 'assessment-j2-p1', title: 'Nulmeting Periode 1', week: 1, yearGroup: 2, sloKerndoelen: ['21B', '21C', '21D'], sloVsoKerndoelen: ['18B', '18C'] },

  // Periode 2: Programmeren & Computational Thinking
  { id: 'algorithm-architect', title: 'Algorithm Architect', week: 2, yearGroup: 2, sloKerndoelen: ['22B'], sloVsoKerndoelen: ['19A'] },
  { id: 'web-developer', title: 'Web Developer', week: 2, yearGroup: 2, sloKerndoelen: ['22A', '22B'], sloVsoKerndoelen: ['19A'] },
  { id: 'app-prototyper', title: 'App Prototyper', week: 2, yearGroup: 2, sloKerndoelen: ['22A'], sloVsoKerndoelen: ['19A'] },                                 // -22B: prototype ontwerpen zonder code
  { id: 'bug-hunter', title: 'Bug Hunter', week: 2, yearGroup: 2, sloKerndoelen: ['22B'], sloVsoKerndoelen: ['19A'] },
  { id: 'automation-engineer', title: 'Automation Engineer', week: 2, yearGroup: 2, sloKerndoelen: ['22B', '21A'], sloVsoKerndoelen: ['19A', '18A'] },         // 22A→21A: scripts schrijven + systeemautomatisering
  { id: 'code-reviewer', title: 'Code Reviewer', week: 2, yearGroup: 2, sloKerndoelen: ['22A', '22B'], sloVsoKerndoelen: ['19A'] },                            // 23B→22A: codekwaliteit + productkwaliteit
  { id: 'network-navigator', title: 'Network Navigator', week: 2, yearGroup: 2, sloKerndoelen: ['21A'], sloVsoKerndoelen: ['18A'] },                           // -22B: netwerken begrijpen, geen programmeren
  { id: 'privacy-by-design', title: 'Privacy by Design', week: 2, yearGroup: 2, sloKerndoelen: ['23A', '23C'], sloVsoKerndoelen: ['20A', '20B'] },             // 22B→23C: GDPR + privacy-redesign, geen programmeren
  { id: 'wachtwoord-warrior', title: 'Wachtwoord Warrior', week: 2, yearGroup: 2, sloKerndoelen: ['23A'], sloVsoKerndoelen: ['20A'] },                         // -21A: wachtwoordbeveiliging = puur veiligheid
  { id: 'access-control-engineer', title: 'Access Control Engineer', week: 2, yearGroup: 2, sloKerndoelen: ['21A', '23A', '22B'], sloVsoKerndoelen: ['18A', '20A', '19A'] },
  { id: 'code-review-2', title: 'Code Review', week: 2, yearGroup: 2, sloKerndoelen: ['22A', '22B'], sloVsoKerndoelen: ['19A'] },

  // Assessment P2
  { id: 'assessment-j2-p2', title: 'Nulmeting Periode 2', week: 2, yearGroup: 2, sloKerndoelen: ['21A', '22A', '22B', '23A'], sloVsoKerndoelen: ['18A', '19A', '20A'] },

  // Periode 3: Digitale Media & Creatie
  { id: 'ux-detective', title: 'UX Detective', week: 3, yearGroup: 2, sloKerndoelen: ['22A', '21B'], sloVsoKerndoelen: ['19A', '18B'] },
  { id: 'podcast-producer', title: 'Podcast Producer', week: 3, yearGroup: 2, sloKerndoelen: ['22A', '21B'], sloVsoKerndoelen: ['19A', '18B'] },
  { id: 'meme-machine', title: 'Meme Machine', week: 3, yearGroup: 2, sloKerndoelen: ['21B', '23B'], sloVsoKerndoelen: ['18B', '20B'] },
  { id: 'digital-storyteller', title: 'Digital Storyteller', week: 3, yearGroup: 2, sloKerndoelen: ['22A', '21B'], sloVsoKerndoelen: ['19A', '18B'] },
  { id: 'brand-builder', title: 'Brand Builder', week: 3, yearGroup: 2, sloKerndoelen: ['22A'], sloVsoKerndoelen: ['19A'] },                                   // -21B: merkidentiteit = product, geen mediawijsheid
  { id: 'video-editor', title: 'Video Editor', week: 3, yearGroup: 2, sloKerndoelen: ['22A', '21B'], sloVsoKerndoelen: ['19A', '18B'] },
  { id: 'media-review', title: 'Media Review', week: 3, yearGroup: 2, sloKerndoelen: ['22A', '21B', '23B'], sloVsoKerndoelen: ['19A', '18B', '20B'] },
  { id: 'online-helden', title: 'Online Helden & Helpers', week: 3, yearGroup: 2, sloKerndoelen: ['23B', '23C'], sloVsoKerndoelen: ['20A', '20B'] },           // cyberpesten + bijstander-training = welzijn + maatschappij

  // Assessment P3
  { id: 'assessment-j2-p3', title: 'Nulmeting Periode 3', week: 3, yearGroup: 2, sloKerndoelen: ['22A', '21B', '23B'], sloVsoKerndoelen: ['19A', '18B', '20B'] },

  // Periode 4: Ethiek, Maatschappij & Eindproject
  { id: 'ai-ethicus', title: 'AI Ethicus', week: 4, yearGroup: 2, sloKerndoelen: ['21D', '23C'], sloVsoKerndoelen: ['18C', '20B'] },
  { id: 'digital-rights-defender', title: 'Digital Rights Defender', week: 4, yearGroup: 2, sloKerndoelen: ['23A', '23C'], sloVsoKerndoelen: ['20A', '20B'] }, // 23B→23C: GDPR-rechten = privacy + regelgeving
  { id: 'tech-court', title: 'Tech Court', week: 4, yearGroup: 2, sloKerndoelen: ['23C'], sloVsoKerndoelen: ['20B'] },                                         // -23B: rechtszaak = puur maatschappij/ethiek
  { id: 'future-forecaster', title: 'Future Forecaster', week: 4, yearGroup: 2, sloKerndoelen: ['21D', '23C'], sloVsoKerndoelen: ['18C', '20B'] },
  { id: 'sustainability-scanner', title: 'Sustainability Scanner', week: 4, yearGroup: 2, sloKerndoelen: ['23C'], sloVsoKerndoelen: ['20B'] },                  // -23B: milieu-impact = maatschappij
  { id: 'eindproject-j2', title: 'Eindproject Jaar 2', week: 4, yearGroup: 2, sloKerndoelen: ['21A', '21B', '21C', '21D', '22A', '22B', '23A', '23B', '23C'], sloVsoKerndoelen: ['18A', '18B', '18C', '19A', '20A', '20B'] }, // capstone: alle kerndoelen

  // Assessment P4
  { id: 'assessment-j2-p4', title: 'Nulmeting Periode 4', week: 4, yearGroup: 2, sloKerndoelen: ['23A', '23B', '23C', '21D'], sloVsoKerndoelen: ['20A', '20B', '18C'] },

  // ============================================================
  // LEERJAAR 3 (alleen havo + vwo)
  // ============================================================

  // Periode 1: Geavanceerd Programmeren & AI
  { id: 'ml-trainer', title: 'ML Trainer', week: 1, yearGroup: 3, sloKerndoelen: ['22B', '21D', '21C'] },                                                     // +21C: dataset preparatie (features, labels, train/test split)
  { id: 'api-architect', title: 'API Architect', week: 1, yearGroup: 3, sloKerndoelen: ['22A', '22B', '21A'] },                                                // 21C→22A,21A: API ontwerpen = systemen + product + code
  { id: 'neural-navigator', title: 'Neural Navigator', week: 1, yearGroup: 3, sloKerndoelen: ['21D', '22B'] },
  { id: 'data-pipeline', title: 'Data Pipeline', week: 1, yearGroup: 3, sloKerndoelen: ['21C', '22B'] },
  { id: 'open-source-contributor', title: 'Open Source Contributor', week: 1, yearGroup: 3, sloKerndoelen: ['22B', '23C'] },                                   // 22A,23B→23C: git/code = programmeren + open source community
  { id: 'advanced-code-review', title: 'Advanced Code Review', week: 1, yearGroup: 3, sloKerndoelen: ['21D', '22B'] },                                         // +21D: review bevat ML/AI-concepten

  // Assessment P1
  { id: 'assessment-j3-p1', title: 'Nulmeting Periode 1', week: 1, yearGroup: 3, sloKerndoelen: ['22B', '21D', '21C'] },

  // Periode 2: Cybersecurity & Privacy
  { id: 'cyber-detective', title: 'Cyber Detective', week: 2, yearGroup: 3, sloKerndoelen: ['23A', '21A'] },
  { id: 'encryption-expert', title: 'Encryption Expert', week: 2, yearGroup: 3, sloKerndoelen: ['23A'] },                                                     // -21A: encryptie = puur veiligheid
  { id: 'phishing-fighter', title: 'Phishing Fighter', week: 2, yearGroup: 3, sloKerndoelen: ['23A', '22A'] },                                                // +22A: trainingsmateriaal ontwerpen
  { id: 'security-auditor', title: 'Security Auditor', week: 2, yearGroup: 3, sloKerndoelen: ['23A', '21A'] },
  { id: 'digital-forensics', title: 'Digital Forensics', week: 2, yearGroup: 3, sloKerndoelen: ['23A', '21C'] },                                               // 21A→21C: logdata analyseren = dataverwerking
  { id: 'security-review', title: 'Security Review', week: 2, yearGroup: 3, sloKerndoelen: ['23A'] },

  // Assessment P2
  { id: 'assessment-j3-p2', title: 'Nulmeting Periode 2', week: 2, yearGroup: 3, sloKerndoelen: ['23A', '21A'] },

  // Periode 3: Maatschappelijke Impact & Innovatie
  { id: 'startup-simulator', title: 'Startup Simulator', week: 3, yearGroup: 3, sloKerndoelen: ['23C', '22A'] },                                               // 23B→22A: business model = maatschappij + product
  { id: 'policy-maker', title: 'Policy Maker', week: 3, yearGroup: 3, sloKerndoelen: ['23C'] },                                                                // -23B: beleidsvoorstel = puur maatschappij
  { id: 'innovation-lab', title: 'Innovation Lab', week: 3, yearGroup: 3, sloKerndoelen: ['23C', '22A'] },                                                     // 21D→23C: Design Thinking voor maatschappelijke problemen
  { id: 'digital-divide-researcher', title: 'Digital Divide Researcher', week: 3, yearGroup: 3, sloKerndoelen: ['23C', '21B'] },                                // 23B→21B: onderzoek + bronnen evalueren
  { id: 'tech-impact-analyst', title: 'Tech Impact Analyst', week: 3, yearGroup: 3, sloKerndoelen: ['23C', '21D'] },
  { id: 'impact-review', title: 'Impact Review', week: 3, yearGroup: 3, sloKerndoelen: ['23C'] },                                                              // -23B: review = puur maatschappij
  { id: 'welzijnsonderzoeker', title: 'Welzijnsonderzoeker', week: 3, yearGroup: 3, sloKerndoelen: ['23B', '21C', '23C'] },                                    // welzijnsonderzoek via data-analyse + maatschappij
  { id: 'startup-pitch', title: 'Startup Pitch', week: 3, yearGroup: 3, sloKerndoelen: ['22A', '21D', '23C'] },                                              // AI-startup bedenken + pitchen → creatie + AI + maatschappij

  // Assessment P3
  { id: 'assessment-j3-p3', title: 'Nulmeting Periode 3', week: 3, yearGroup: 3, sloKerndoelen: ['23C', '21D'] },

  // Periode 4: Meesterproef
  { id: 'portfolio-builder', title: 'Portfolio Builder', week: 4, yearGroup: 3, sloKerndoelen: ['22A', '21B'] },                                                // 21A→21B: portfolio presentatie = product + informatievaardigheden
  { id: 'research-project', title: 'Research Project', week: 4, yearGroup: 3, sloKerndoelen: ['21B', '21C', '23C'] },
  { id: 'prototype-developer', title: 'Prototype Developer', week: 4, yearGroup: 3, sloKerndoelen: ['22A', '22B'] },
  { id: 'pitch-perfect', title: 'Pitch Perfect', week: 4, yearGroup: 3, sloKerndoelen: ['21B', '22A'] },
  { id: 'reflection-report', title: 'Reflection Report', week: 4, yearGroup: 3, sloKerndoelen: ['23B'] },                                                      // -23C: persoonlijke reflectie = welzijn, niet maatschappij
  { id: 'meesterproef', title: 'Meesterproef', week: 4, yearGroup: 3, sloKerndoelen: ['21A', '21B', '21C', '21D', '22A', '22B', '23A', '23B', '23C'] },

  // Assessment P4
  { id: 'assessment-j3-p4', title: 'Nulmeting Periode 4', week: 4, yearGroup: 3, sloKerndoelen: ['21A', '21B', '21C', '21D', '22A', '22B', '23A', '23B', '23C'] },
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

export function getMissionsForKerndoel(code: SloKerndoelCode): KerndoelMissionMeta[] {
  return KERNDOEL_MISSIONS.filter((m) => m.sloKerndoelen.includes(code));
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
