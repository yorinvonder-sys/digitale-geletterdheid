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
  /**
   * Alleen op true zetten wanneer de aanroeper de docentmelding ook echt
   * verstuurt (via useWellbeingTeacherAlert of een eigen onAlert). Zonder die
   * koppeling belooft de overlay anders een melding die nooit verstuurd wordt.
   */
  teacherNotified?: boolean;
}

export const WellbeingAlert: React.FC<Props> = ({ match, onDismiss, teacherNotified = true }) => {
  if (!match) return null;

  // items-start + my-auto op de kaart: past de kaart, dan staat hij gecentreerd; past
  // hij niet (laag venster, iPad in liggende stand), dan blijven de bovenkant én de
  // sluitknop bereikbaar door te scrollen. Zonder overflow-y-auto viel de knop buiten
  // beeld en zat de leerling vast achter de overlay.
  return (
    <div
      className="fixed inset-0 z-[9999] bg-duck-ink/80 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="wellbeing-title"
      aria-describedby="wellbeing-desc"
    >
      <div className="max-w-md w-full my-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-duck-ink p-6 text-center relative">
          <button
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
        <div className="p-6">
          <p id="wellbeing-desc" className="text-duck-ink/65 text-sm leading-relaxed mb-5">
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
                className="flex items-start gap-3 p-3 rounded-xl border border-duck-ink/10 hover:border-duck-ink hover:bg-duck-ink hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-duck-ink/10 group-hover:bg-white/20 flex items-center justify-center shrink-0">
                  {hulplijn.naam.includes('113') ? (
                    <Phone size={18} className="text-duck-ink group-hover:text-white" />
                  ) : (
                    <MessageCircle size={18} className="text-duck-ink group-hover:text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-duck-ink group-hover:text-white">{hulplijn.naam}</span>
                    <ExternalLink size={12} className="text-duck-ink/65 group-hover:text-white/70" />
                  </div>
                  <p className="text-xs text-duck-ink/70 font-medium group-hover:text-white/80">{hulplijn.nummer}</p>
                  <p className="text-xs text-duck-ink/65 group-hover:text-white/65">{hulplijn.beschrijving}</p>
                </div>
              </a>
            ))}
          </div>

          <p className="text-xs text-duck-ink/65 text-center leading-relaxed mb-4">
            {teacherNotified
              ? 'Je docent krijgt een melding dat je misschien hulp kunt gebruiken. Ze zullen discreet even bij je checken.'
              : 'Je hoeft dit niet alleen op te lossen: praat er even over met je docent, mentor of iemand anders die je vertrouwt.'}
          </p>

          <button
            onClick={onDismiss}
            className="w-full py-3 bg-duck-bg hover:bg-duck-bgLight text-duck-ink/65 rounded-xl font-bold text-sm transition-colors"
          >
            Ik begrijp het, terug naar de missie
          </button>
        </div>
      </div>
    </div>
  );
};
