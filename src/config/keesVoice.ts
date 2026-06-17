export const KEES_NAME = 'Kees';

// Onboarding: Kees introduces himself, first person.
export const KEES_INTRO =
  'Hoi! Ik ben Kees, de eend van DGSkills. Ik loop met je mee — van je eerste missie tot je laatste. We maken er samen iets moois van.';

// Dashboard: short greeting line that reacts to the streak (complements the existing "Goedemorgen {name}!" h1).
export function getKeesDashboardGreeting(opts: { name: string; dailyStreak: number }): string {
  const { name, dailyStreak } = opts;
  if (dailyStreak >= 7) return `${dailyStreak} dagen op rij, ${name}?! Niet te stoppen. 🔥`;
  if (dailyStreak >= 3) return `Lekker bezig, ${name} — ${dailyStreak} dagen op rij. Hou vol!`;
  if (dailyStreak === 1) return `Mooi begin, ${name}. Morgen weer? Dan groeit je reeks.`;
  return `Goed je te zien, ${name}. Klaar voor een nieuwe missie?`;
}

// Dashboard: all missions completed.
export const KEES_ALL_DONE = {
  title: 'Alles gedaan — knap werk!',
  sub: 'Ik zet de slingers vast klaar. Je docent opent binnenkort nieuwe missies.',
};

// Mission start: warm framing. Deterministic variety by title (no Math.random).
export function getKeesMissionIntro(title: string): string {
  const lines = [
    'Nieuwe missie! Begin gewoon — ik wijs je onderweg de weg.',
    'Geen stress: stap voor stap kom je er. Ik help je op gang.',
    `Klaar voor '${title}'? We pakken het samen aan.`,
  ];
  let h = 0;
  for (let i = 0; i < title.length; i++) h = (h + title.charCodeAt(i)) % lines.length;
  return lines[h];
}

// Mission completion: celebrate by score percentage. Never shame a low score.
export function getKeesCompletionLine(percentage: number): string {
  if (percentage >= 90) return 'Top gedaan! Dit zat echt goed in elkaar. 🎉';
  if (percentage >= 70) return 'Netjes! Je hebt dit echt onder de knie.';
  if (percentage >= 50) return 'Goed bezig — en nu weet je precies wat er nog beter kan.';
  return "Afgerond! Elke poging maakt je sterker. Probeer 'm gerust nog eens.";
}
