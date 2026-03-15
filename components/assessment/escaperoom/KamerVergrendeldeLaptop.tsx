
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, CheckCircle, XCircle, FolderOpen, FileText, Image, Table } from 'lucide-react';
import { KamerScore } from './types';

interface BestandItem {
  id: string;
  naam: string;
  type: 'document' | 'afbeelding' | 'spreadsheet' | 'onbekend';
  icon: React.ReactNode;
}

interface MapTarget {
  id: string;
  naam: string;
  accepteert: string[]; // bestandstype dat hier thuis hoort
  icon: React.ReactNode;
  color: string;
}

const BESTANDEN: BestandItem[] = [
  { id: 'b1', naam: 'Werkstuk_Nederlands.docx', type: 'document', icon: <FileText size={20} /> },
  { id: 'b2', naam: 'Vakantie_foto.jpg', type: 'afbeelding', icon: <Image size={20} /> },
  { id: 'b3', naam: 'Cijferlijst.xlsx', type: 'spreadsheet', icon: <Table size={20} /> },
  { id: 'b4', naam: 'Presentatie_Bio.pptx', type: 'document', icon: <FileText size={20} /> },
];

const MAPPEN: MapTarget[] = [
  { id: 'm1', naam: 'Documenten', accepteert: ['document'], icon: <FolderOpen size={20} />, color: 'cyan' },
  { id: 'm2', naam: 'Afbeeldingen', accepteert: ['afbeelding'], icon: <FolderOpen size={20} />, color: 'emerald' },
  { id: 'm3', naam: 'Spreadsheets', accepteert: ['spreadsheet'], icon: <FolderOpen size={20} />, color: 'amber' },
];

interface Props {
  onComplete: (score: KamerScore) => void;
}

export const KamerVergrendeldeLaptop: React.FC<Props> = ({ onComplete }) => {
  const [plaatsingen, setPlaatsingen] = useState<Record<string, string>>({});
  const [dragOverMap, setDragOverMap] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; bericht: string } | null>(null);
  const [ingediend, setIngediend] = useState(false);
  const [startTijd] = useState(Date.now());

  const ongeplaatstebestanden = BESTANDEN.filter(b => !plaatsingen[b.id]);
  const alleGeplaatst = Object.keys(plaatsingen).length === BESTANDEN.length;

  const handleDragStart = (e: React.DragEvent, bestandId: string) => {
    e.dataTransfer.setData('bestandId', bestandId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, mapId: string) => {
    e.preventDefault();
    setDragOverMap(null);
    const bestandId = e.dataTransfer.getData('bestandId');
    if (!bestandId) return;

    setPlaatsingen(prev => ({ ...prev, [bestandId]: mapId }));
  };

  const handleBestandKlik = (bestandId: string) => {
    // Op mobiel: cycle door mappen
    const huidigeMap = plaatsingen[bestandId];
    const mapIndex = huidigeMap ? MAPPEN.findIndex(m => m.id === huidigeMap) : -1;
    const volgendeIndex = (mapIndex + 1) % MAPPEN.length;
    setPlaatsingen(prev => ({ ...prev, [bestandId]: MAPPEN[volgendeIndex].id }));
  };

  const verwijderPlaatsing = (bestandId: string) => {
    setPlaatsingen(prev => {
      const nieuw = { ...prev };
      delete nieuw[bestandId];
      return nieuw;
    });
  };

  const controleer = () => {
    let correct = 0;
    const details: Record<string, boolean> = {};

    BESTANDEN.forEach(bestand => {
      const geplaatsteMap = plaatsingen[bestand.id];
      const doelMap = MAPPEN.find(m => m.accepteert.includes(bestand.type));
      const isCorrect = geplaatsteMap === doelMap?.id;
      details[bestand.id] = isCorrect;
      if (isCorrect) correct++;
    });

    const score = Math.round((correct / BESTANDEN.length) * 100);
    const tijdSeconds = Math.round((Date.now() - startTijd) / 1000);

    setIngediend(true);
    setFeedback({
      correct: score >= 75,
      bericht: score === 100
        ? 'Alle bestanden staan op de juiste plek!'
        : score >= 75
          ? `Goed gedaan! ${correct} van de ${BESTANDEN.length} bestanden correct.`
          : `${correct} van de ${BESTANDEN.length} correct. Oefening baart kunst!`
    });

    setTimeout(() => {
      onComplete({
        score,
        timeSeconds: tijdSeconds,
        details: { plaatsingen, correcteAntwoorden: details },
      });
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex flex-col h-full p-4 md:p-6"
    >
      {/* Header */}
      <div className="text-center mb-4 md:mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Monitor className="text-cyan-400" size={24} />
          <h2 className="text-xl md:text-2xl font-black text-cyan-400">Vergrendelde Laptop</h2>
        </div>
        <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto">
          Je vindt een oude laptop op school. De bestanden staan door elkaar.
          Sleep ze naar de juiste map om het wachtwoord te vinden!
        </p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
        {/* Bestanden */}
        <div className="md:w-1/2 bg-gray-800 rounded-xl border border-gray-700 p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Bestanden op bureaublad</h3>
          <div className="space-y-2">
            {ongeplaatstebestanden.length === 0 && !ingediend && (
              <p className="text-gray-500 text-sm italic text-center py-4">Alle bestanden zijn geplaatst!</p>
            )}
            {ongeplaatstebestanden.map(bestand => (
              <div
                key={bestand.id}
                draggable
                onDragStart={e => handleDragStart(e, bestand.id)}
                onClick={() => handleBestandKlik(bestand.id)}
                className="flex items-center gap-3 px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 cursor-grab active:cursor-grabbing hover:border-cyan-500/50 transition-colors select-none"
              >
                <span className="text-cyan-400">{bestand.icon}</span>
                <span className="text-sm font-medium text-gray-200">{bestand.naam}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mappen */}
        <div className="md:w-1/2 space-y-3">
          {MAPPEN.map(map => {
            const bestandenInMap = BESTANDEN.filter(b => plaatsingen[b.id] === map.id);
            const isOver = dragOverMap === map.id;

            return (
              <div
                key={map.id}
                onDragOver={e => { handleDragOver(e); setDragOverMap(map.id); }}
                onDragLeave={() => setDragOverMap(null)}
                onDrop={e => handleDrop(e, map.id)}
                className={`rounded-xl border-2 border-dashed p-4 transition-all min-h-[80px] ${
                  isOver
                    ? `border-${map.color}-400 bg-${map.color}-500/20`
                    : `border-gray-700 bg-gray-800/50 hover:border-gray-600`
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-${map.color}-400`}>{map.icon}</span>
                  <span className={`text-sm font-bold text-${map.color}-400`}>{map.naam}</span>
                </div>
                <div className="space-y-1">
                  {bestandenInMap.map(b => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between px-3 py-2 bg-gray-900/80 rounded-lg text-sm"
                    >
                      <span className="text-gray-300 flex items-center gap-2">
                        <span className="text-cyan-400">{b.icon}</span>
                        {b.naam}
                      </span>
                      {!ingediend && (
                        <button
                          onClick={() => verwijderPlaatsing(b.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors p-1"
                          aria-label={`${b.naam} verwijderen`}
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-xl border text-center font-bold ${
            feedback.correct
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
              : 'bg-amber-500/20 border-amber-500/50 text-amber-400'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {feedback.correct ? <CheckCircle size={20} /> : <XCircle size={20} />}
            {feedback.bericht}
          </div>
        </motion.div>
      )}

      {/* Controleer knop */}
      {!ingediend && (
        <button
          onClick={controleer}
          disabled={!alleGeplaatst}
          className="mt-4 w-full py-3 rounded-xl font-bold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white shadow-lg shadow-cyan-500/20 active:scale-[0.98]"
        >
          Controleer plaatsing
        </button>
      )}
    </motion.div>
  );
};
