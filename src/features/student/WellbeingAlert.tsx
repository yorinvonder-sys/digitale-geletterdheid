/**
 * WellbeingAlert — Hulplijn-overlay voor leerlingen
 *
 * Wordt getoond wanneer de welzijnsmonitor zorgwekkende taal detecteert.
 * Toont hulplijn-informatie op een niet-beschuldigende, ondersteunende manier.
 */

import React from 'react';
import { Heart, Phone, MessageCircle, ExternalLink, X } from 'lucide-react';
import { HULPLIJNEN, WellbeingMatch } from '@/hooks/useWellbeingMonitor';

interface Props {
  match: WellbeingMatch | null;
  onDismiss: () => void;
}

export const WellbeingAlert: React.FC<Props> = ({ match, onDismiss }) => {
  React.useEffect(() => {
    if (!match) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [match, onDismiss]);

  if (!match) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-lab-ink/80 backdrop-blur-sm flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="wellbeing-title"
      aria-describedby="wellbeing-desc"
    >
      <div className="flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="relative shrink-0 bg-gradient-to-r from-lab-coral to-lab-coral p-5 text-center sm:p-6">
          <button
            type="button"
            onClick={onDismiss}
            className="absolute top-3 right-3 p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-colors"
            aria-label="Sluiten"
          >
            <X size={18} />
          </button>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
            <Heart size={32} className="text-white" />
          </div>
          <h2 id="wellbeing-title" className="text-xl font-black text-white">
            Even checken: gaat het goed?
          </h2>
        </div>

        {/* Body */}
        <div className="min-h-0 overflow-y-auto p-5 sm:p-6">
          <p id="wellbeing-desc" className="text-lab-muted text-sm leading-relaxed mb-5">
            We merkten dat je iets schreef waarover we ons een beetje zorgen maken.
            Dat kan helemaal niets zijn, maar als je ergens mee zit, zijn er mensen
            die je kunnen helpen. Je bent niet alleen.
          </p>

          {/* Hulplijnen */}
          <div className="space-y-3 mb-5">
            {HULPLIJNEN.map((hulplijn) => (
              <a
                key={hulplijn.naam}
                href={hulplijn.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-xl border border-lab-line hover:border-lab-teal hover:bg-lab-teal hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-lab-teal group-hover:bg-lab-teal hover:text-white flex items-center justify-center shrink-0">
                  {hulplijn.naam.includes('113') ? (
                    <Phone size={18} className="text-lab-teal" />
                  ) : (
                    <MessageCircle size={18} className="text-lab-teal" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-lab-ink">{hulplijn.naam}</span>
                    <ExternalLink size={12} className="text-lab-muted" />
                  </div>
                  <p className="text-xs text-lab-teal font-medium">{hulplijn.nummer}</p>
                  <p className="text-xs text-lab-muted">{hulplijn.beschrijving}</p>
                </div>
              </a>
            ))}
          </div>

          <p className="text-xs text-lab-muted text-center leading-relaxed">
            Je docent krijgt een melding dat je misschien hulp kunt gebruiken.
            Ze zullen discreet even bij je checken.
          </p>
        </div>

        <div className="shrink-0 border-t border-lab-line bg-white p-4">
          <button
            type="button"
            onClick={onDismiss}
            data-qa="wellbeing-alert-dismiss"
            className="w-full rounded-xl bg-lab-cream px-4 py-3 text-sm font-bold text-lab-muted transition-colors hover:bg-lab-creamDeep"
          >
            Ik begrijp het, terug naar de missie
          </button>
        </div>
      </div>
    </div>
  );
};
