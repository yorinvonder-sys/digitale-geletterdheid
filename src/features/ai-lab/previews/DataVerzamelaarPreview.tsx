import React, { useState } from 'react';
import { BarChart2, Users, School, Calendar, HelpCircle, ChevronRight } from 'lucide-react';

interface DataVerzamelaarPreviewProps {
  currentStep?: number; // 0 = intro, 1-3 = stappen
}

const DATASET = [
  { label: 'Fiets', aantal: 56, percentage: 47, color: '#202023', emoji: '🚲' },
  { label: 'Bus/tram', aantal: 22, percentage: 18, color: '#202023', emoji: '🚌' },
  { label: 'Lopend', aantal: 18, percentage: 15, color: '#202023', emoji: '🚶' },
  { label: 'Auto', aantal: 16, percentage: 13, color: '#C4B5FD', emoji: '🚗' },
  { label: 'Scooter', aantal: 5, percentage: 4, color: '#DDD6FE', emoji: '🛵' },
  { label: 'Anders', aantal: 3, percentage: 3, color: '#EDE9FE', emoji: '❓' },
];

const CONTEXT_ITEMS = [
  { icon: Users, label: '120 leerlingen', detail: '3 klassen' },
  { icon: School, label: '1 school', detail: 'Stad' },
  { icon: Calendar, label: 'November 2025', detail: 'Herfst/winter' },
];

const DataVerzamelaarPreview: React.FC<DataVerzamelaarPreviewProps> = ({ currentStep = 0 }) => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [showLimitations, setShowLimitations] = useState(false);

  const maxPercentage = Math.max(...DATASET.map(d => d.percentage));

  return (
    <div className="w-full h-full bg-gradient-to-br from-lab-coral via-white to-lab-teal flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-lab-coral to-lab-teal px-4 py-3 flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
          <BarChart2 size={18} className="text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold text-sm leading-tight">Schoolreizen Dataset</h3>
          <p className="text-white/70 text-[10px]">Hoe reizen leerlingen naar school?</p>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {/* Bar chart */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-lab-coral">
          <div className="space-y-2">
            {DATASET.map((item, i) => (
              <div
                key={item.label}
                className="group cursor-default"
                onMouseEnter={() => setHoveredBar(i)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm w-5 shrink-0">{item.emoji}</span>
                  <span className="text-xs font-medium text-lab-muted w-14 shrink-0 truncate">{item.label}</span>
                  <div className="flex-1 h-6 bg-lab-cream rounded-full overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
                      style={{
                        width: `${(item.percentage / maxPercentage) * 100}%`,
                        backgroundColor: item.color,
                        opacity: hoveredBar === null || hoveredBar === i ? 1 : 0.4,
                      }}
                    >
                      {item.percentage >= 10 && (
                        <span className="text-white text-[10px] font-bold">{item.percentage}%</span>
                      )}
                    </div>
                    {item.percentage < 10 && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-lab-muted text-[10px] font-medium">{item.percentage}%</span>
                    )}
                  </div>
                  <span className={`text-[10px] text-lab-muted w-6 text-right transition-opacity ${hoveredBar === i ? 'opacity-100' : 'opacity-0'}`}>
                    {item.aantal}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Context cards */}
        <div className="grid grid-cols-3 gap-2">
          {CONTEXT_ITEMS.map((item) => (
            <div key={item.label} className="bg-white rounded-lg p-2 shadow-sm border border-lab-coral text-center">
              <item.icon size={14} className="text-lab-muted mx-auto mb-1" />
              <div className="text-[10px] font-bold text-lab-ink leading-tight">{item.label}</div>
              <div className="text-[9px] text-lab-muted">{item.detail}</div>
            </div>
          ))}
        </div>

        {/* Onderzoeksvraag */}
        <div className="bg-lab-coral border border-lab-coral rounded-xl p-3">
          <div className="flex items-start gap-2">
            <HelpCircle size={16} className="text-lab-muted shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] font-bold text-lab-coral uppercase tracking-wide mb-1">Onderzoeksvraag</div>
              <p className="text-xs text-lab-coral leading-relaxed">
                Moet de gemeente investeren in betere fietsenstallingen bij scholen?
              </p>
            </div>
          </div>
        </div>

        {/* Denkvragen toggle */}
        <button
          onClick={() => setShowLimitations(!showLimitations)}
          className="w-full bg-white border border-lab-gold rounded-xl p-2.5 flex items-center gap-2 text-left hover:bg-lab-gold hover:text-lab-ink transition-colors shadow-sm"
        >
          <span className="text-sm">🤔</span>
          <span className="text-xs font-medium text-lab-gold flex-1">Denk na: is deze data betrouwbaar?</span>
          <ChevronRight size={14} className={`text-lab-gold transition-transform ${showLimitations ? 'rotate-90' : ''}`} />
        </button>

        {showLimitations && (
          <div className="bg-lab-gold border border-lab-gold rounded-xl p-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px]">📍</span>
              <span className="text-[11px] text-lab-gold">Maar 1 school — geldt dit voor heel Nederland?</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px]">🌧️</span>
              <span className="text-[11px] text-lab-gold">November = koud weer — in juni fietsen er misschien meer</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px]">👻</span>
              <span className="text-[11px] text-lab-gold">Wie ontbreken? Zieke leerlingen, thuiswerkers...</span>
            </div>
          </div>
        )}

        {/* Stappen indicator */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-lab-line">
          <div className="text-[10px] font-bold text-lab-muted uppercase tracking-wide mb-2">Jouw onderzoek</div>
          <div className="space-y-1.5">
            {['Dataset verkennen', 'Beperkingen ontdekken', 'Advies geven'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  currentStep > i + 1
                    ? 'bg-lab-coral text-white'
                    : currentStep === i + 1
                    ? 'bg-lab-coral text-white ring-2 ring-lab-coral'
                    : 'bg-lab-cream text-lab-muted'
                }`}>
                  {currentStep > i + 1 ? '✓' : i + 1}
                </div>
                <span className={`text-xs ${
                  currentStep === i + 1 ? 'text-lab-coral font-medium' : 'text-lab-muted'
                }`}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVerzamelaarPreview;
