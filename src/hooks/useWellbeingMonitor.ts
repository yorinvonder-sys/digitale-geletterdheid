/**
 * useWellbeingMonitor — Welzijnsdetectie voor minderjarige leerlingen
 *
 * Scant tekst-input op zorgwekkende taal (zelfbeschadiging, suïcide, pesten,
 * geweld, misbruik). Bij detectie:
 * 1. Blokkeert het bericht (wordt niet verstuurd naar AI)
 * 2. Toont de leerling een hulplijn-melding
 * 3. Logt een alert voor de docent (via Supabase)
 *
 * Implementatie-notities:
 * - Keyword-detectie is bewust laagdrempelig (false positives boven false negatives)
 * - Geen AI-classificatie: privacy-gevoelig en niet nodig voor eerste triage
 * - Alle matches worden gelogd met timestamp, NIET met de originele tekst
 *   (privacybescherming: we loggen alleen dat er een match was, niet wat)
 */

import { useCallback, useRef, useState } from 'react';

// ─── Zorgwekkende termen (Nederlands) ───────────────────────────────
// Gegroepeerd per categorie voor audit-doeleinden.
// Termen zijn bewust breed: liever een false positive dan een gemist signaal.
const WELLBEING_PATTERNS: { category: string; terms: string[] }[] = [
  {
    category: 'suicidaal',
    terms: [
      'zelfmoord', 'suicide', 'zelfdoding', 'niet meer leven',
      'dood willen', 'een einde maken', 'wil dood', 'ga dood',
      'ik wil niet meer', 'het leven heeft geen zin',
    ],
  },
  {
    category: 'zelfbeschadiging',
    terms: [
      'snijden', 'zelf pijn', 'zelfverwonding', 'mezelf pijn doen',
      'self harm', 'cutting',
    ],
  },
  {
    category: 'pesten',
    terms: [
      'word gepest', 'ze pesten mij', 'niemand mag mij',
      'iedereen haat mij', 'ik hoor er niet bij', 'uitgelachen',
      'buitengesloten', 'cyberpesten',
    ],
  },
  {
    category: 'geweld_misbruik',
    terms: [
      'word geslagen', 'slaat mij', 'misbruik', 'mishandeling',
      'onveilig thuis', 'bang voor', 'bedreigd', 'bedreigen',
      'aangerand',
    ],
  },
  {
    category: 'psychisch',
    terms: [
      'wil niet meer naar school', 'eenzaam', 'heel alleen',
      'niemand begrijpt mij', 'kan niet meer',
    ],
  },
];

// Pre-compiled lowercase terms voor snelle matching
const ALL_TERMS = WELLBEING_PATTERNS.flatMap(p =>
  p.terms.map(t => ({ term: t.toLowerCase(), category: p.category }))
);

export interface WellbeingMatch {
  category: string;
  timestamp: string;
}

export interface WellbeingResult {
  isBlocked: boolean;
  match: WellbeingMatch | null;
}

// ─── Hulplijn-informatie ─────────────────────────────────────────────
export const HULPLIJNEN = [
  {
    naam: 'Kindertelefoon',
    nummer: '0800-0432',
    beschrijving: 'Gratis en anoniem praten (tot 18 jaar)',
    url: 'https://www.kindertelefoon.nl',
  },
  {
    naam: '113 Zelfmoordpreventie',
    nummer: '113 of 0800-0113',
    beschrijving: '24/7 bereikbaar, ook via chat',
    url: 'https://www.113.nl',
  },
  {
    naam: 'Veilig Thuis',
    nummer: '0800-2000',
    beschrijving: 'Bij huiselijk geweld of mishandeling (gratis)',
    url: 'https://veiligthuis.nl',
  },
  {
    naam: 'Jellinek Advieslijn',
    nummer: '088 505 1220',
    beschrijving: 'Advies over alcohol, drugs, gokken en gamen',
    url: 'https://www.jellinek.nl/vraag-antwoord/waar-kan-ik-terecht-voor-advies/',
  },
  {
    naam: 'Stichting HALT',
    nummer: '0800-8052',
    beschrijving: 'Bij online pesten of digitale veiligheid',
    url: 'https://www.halt.nl',
  },
];

interface UseWellbeingMonitorOptions {
  /** Callback om de docent te alerteren (bijv. via Supabase) */
  onAlert?: (match: WellbeingMatch) => void;
  /** Optioneel: student ID voor logging */
  studentId?: string;
}

export function useWellbeingMonitor(options?: UseWellbeingMonitorOptions) {
  const [showHulplijn, setShowHulplijn] = useState(false);
  const [lastMatch, setLastMatch] = useState<WellbeingMatch | null>(null);
  const cooldownRef = useRef<number>(0);

  /**
   * Scant tekst op zorgwekkende taal.
   * Retourneert { isBlocked: true, match } als er een match is.
   * Gebruik dit VOORDAT je het bericht naar de AI stuurt.
   */
  const scanText = useCallback(
    (text: string): WellbeingResult => {
      if (!text || text.trim().length < 5) {
        return { isBlocked: false, match: null };
      }

      const normalized = text.toLowerCase().trim();

      for (const { term, category } of ALL_TERMS) {
        if (normalized.includes(term)) {
          const match: WellbeingMatch = {
            category,
            timestamp: new Date().toISOString(),
          };

          // Voorkom spam: max 1 alert per 60 seconden
          const now = Date.now();
          if (now - cooldownRef.current > 60_000) {
            cooldownRef.current = now;
            setLastMatch(match);
            setShowHulplijn(true);
            options?.onAlert?.(match);
          }

          return { isBlocked: true, match };
        }
      }

      return { isBlocked: false, match: null };
    },
    [options]
  );

  /** Sluit de hulplijn-melding */
  const dismissHulplijn = useCallback(() => {
    setShowHulplijn(false);
  }, []);

  return {
    scanText,
    showHulplijn,
    lastMatch,
    dismissHulplijn,
    HULPLIJNEN,
  };
}
