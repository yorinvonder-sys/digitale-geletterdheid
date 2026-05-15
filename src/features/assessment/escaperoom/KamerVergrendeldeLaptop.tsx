
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, CheckCircle, XCircle, FolderOpen, FileText, Image, Table, Presentation } from 'lucide-react';
import { KamerScore } from './types';
import { BESTANDEN_V2, MAPPEN_V2 } from './data/kamer1Data';

interface BestandItem {
  id: string;
  naam: string;
  type: 'document' | 'afbeelding' | 'spreadsheet' | 'presentatie';
  icon: React.ReactNode;
}

interface MapTarget {
  id: string;
  naam: string;
  accepteert: string[];
  icon: React.ReactNode;
  kleurBorder: string;
  kleurBg: string;
  kleurTekst: string;
}

const BESTANDEN: BestandItem[] = [
  { id: 'b1', naam: 'Werkstuk_Nederlands.docx', type: 'document', icon: <FileText size={18} /> },
  { id: 'b2', naam: 'Vakantie_foto.jpg', type: 'afbeelding', icon: <Image size={18} /> },
  { id: 'b3', naam: 'Cijferlijst.xlsx', type: 'spreadsheet', icon: <Table size={18} /> },
  { id: 'b4', naam: 'Presentatie_Bio.pptx', type: 'presentatie', icon: <Presentation size={18} /> },
  { id: 'b5', naam: 'Selfie_schoolreisje.png', type: 'afbeelding', icon: <Image size={18} /> },
  { id: 'b6', naam: 'Huiswerk_Wiskunde.pdf', type: 'document', icon: <FileText size={18} /> },
  { id: 'b7', naam: 'Budget_feestcommissie.xlsx', type: 'spreadsheet', icon: <Table size={18} /> },
  { id: 'b8', naam: 'Spreekbeurt_Klimaat.pptx', type: 'presentatie', icon: <Presentation size={18} /> },
];

const MAPPEN: MapTarget[] = [
  { id: 'm1', naam: 'Documenten', accepteert: ['document'], icon: <FolderOpen size={20} />, kleurBorder: 'border-lab-coral', kleurBg: 'bg-lab-coral', kleurTekst: 'text-lab-coral' },
  { id: 'm2', naam: 'Afbeeldingen', accepteert: ['afbeelding'], icon: <FolderOpen size={20} />, kleurBorder: 'border-lab-sage', kleurBg: 'bg-lab-sage', kleurTekst: 'text-lab-sage' },
  { id: 'm3', naam: 'Spreadsheets', accepteert: ['spreadsheet'], icon: <FolderOpen size={20} />, kleurBorder: 'border-lab-gold', kleurBg: 'bg-lab-gold', kleurTekst: 'text-lab-gold' },
  { id: 'm4', naam: 'Presentaties', accepteert: ['presentatie'], icon: <FolderOpen size={20} />, kleurBorder: 'border-lab-teal', kleurBg: 'bg-lab-teal', kleurTekst: 'text-lab-teal' },
];

interface Props {
  onComplete: (score: KamerScore) => void;
  variant?: 'nulmeting' | 'eindmeting';
}

export const KamerVergrendeldeLaptop: React.FC<Props> = ({ onComplete, variant }) => {
  const activeBestanden = variant === 'eindmeting'
    ? BESTANDEN.map((b, i) => ({ ...b, naam: BESTANDEN_V2[i]?.naam ?? b.naam, type: BESTANDEN_V2[i]?.type ?? b.type }))
    : BESTANDEN;
  const activeMappen = variant === 'eindmeting'
    ? MAPPEN.map((m, i) => ({ ...m, naam: MAPPEN_V2[i]?.naam ?? m.naam, accepteert: MAPPEN_V2[i]?.accepteert ?? m.accepteert }))
    : MAPPEN;
  const [plaatsingen, setPlaatsingen] = useState<Record<string, string>>({});
  const [dragOverMap, setDragOverMap] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; bericht: string } | null>(null);
  const [ingediend, setIngediend] = useState(false);
  const [startTijd] = useState(Date.now());

  const ongeplaatstebestanden = activeBestanden.filter(b => !plaatsingen[b.id]);
  const alleGeplaatst = Object.keys(plaatsingen).length === activeBestanden.length;

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
    const mapIndex = huidigeMap ? activeMappen.findIndex(m => m.id === huidigeMap) : -1;
    const volgendeIndex = (mapIndex + 1) % activeMappen.length;
    setPlaatsingen(prev => ({ ...prev, [bestandId]: activeMappen[volgendeIndex].id }));
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

    activeBestanden.forEach(bestand => {
      const geplaatsteMap = plaatsingen[bestand.id];
      const doelMap = activeMappen.find(m => m.accepteert.includes(bestand.type));
      const isCorrect = geplaatsteMap === doelMap?.id;
      details[bestand.id] = isCorrect;
      if (isCorrect) correct++;
    });

    const score = Math.round((correct / activeBestanden.length) * 100);
    const tijdSeconds = Math.round((Date.now() - startTijd) / 1000);

    setIngediend(true);
    setFeedback({
      correct: score >= 75,
      bericht: score === 100
        ? 'Alle bestanden staan op de juiste plek!'
        : score >= 75
          ? `Goed gedaan! ${correct} van de ${activeBestanden.length} bestanden correct.`
          : `${correct} van de ${activeBestanden.length} correct. Oefening baart kunst!`
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
          <Monitor className="text-lab-coral" size={24} />
          <h2 className="text-xl md:text-2xl font-black text-lab-coral">Vergrendelde Laptop</h2>
        </div>
        <p className="text-lab-muted text-sm md:text-base max-w-lg mx-auto">
          Je vindt een oude laptop op school. De bestanden staan door elkaar.
          Sleep ze naar de juiste map om het wachtwoord te vinden!
        </p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
        {/* Bestanden */}
        <div className="md:w-1/2 bg-white rounded-xl border border-lab-line shadow-sm p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-lab-muted mb-3">Bestanden op bureaublad</h3>
          <div className="space-y-2">
            {ongeplaatstebestanden.length === 0 && !ingediend && (
              <p className="text-lab-muted text-sm italic text-center py-4">Alle bestanden zijn geplaatst!</p>
            )}
            {ongeplaatstebestanden.map(bestand => (
              <div
                key={bestand.id}
                draggable
                onDragStart={e => handleDragStart(e, bestand.id)}
                onClick={() => handleBestandKlik(bestand.id)}
                className="flex items-center gap-3 px-4 py-3 bg-lab-cream rounded-lg border border-lab-line cursor-grab active:cursor-grabbing hover:border-lab-coral transition-colors select-none"
              >
                <span className="text-lab-muted">{bestand.icon}</span>
                <span className="text-sm font-medium text-lab-muted">{bestand.naam}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mappen */}
        <div className="md:w-1/2 space-y-3">
          {activeMappen.map(map => {
            const bestandenInMap = activeBestanden.filter(b => plaatsingen[b.id] === map.id);
            const isOver = dragOverMap === map.id;

            return (
              <div
                key={map.id}
                onDragOver={e => { handleDragOver(e); setDragOverMap(map.id); }}
                onDragLeave={() => setDragOverMap(null)}
                onDrop={e => handleDrop(e, map.id)}
                className={`rounded-xl border-2 border-dashed p-4 transition-all min-h-[70px] ${
                  isOver
                    ? `${map.kleurBorder} ${map.kleurBg}`
                    : 'border-lab-line bg-white hover:border-lab-line'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={map.kleurTekst}>{map.icon}</span>
                  <span className={`text-sm font-bold ${map.kleurTekst}`}>{map.naam}</span>
                </div>
                <div className="space-y-1">
                  {bestandenInMap.map(b => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between px-3 py-2 bg-lab-cream rounded-lg text-sm"
                    >
                      <span className="text-lab-muted flex items-center gap-2">
                        <span className="text-lab-muted">{b.icon}</span>
                        {b.naam}
                      </span>
                      {!ingediend && (
                        <button
                          onClick={() => verwijderPlaatsing(b.id)}
                          className="text-lab-muted hover:text-lab-muted transition-colors p-1"
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
              ? 'bg-lab-sage border-lab-sage text-lab-sage'
              : 'bg-lab-gold border-lab-gold text-lab-gold'
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
          className="mt-4 w-full py-3 rounded-xl font-bold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-lab-coral hover:bg-lab-coral hover:text-white text-white shadow-lg shadow-lab-coral active:scale-[0.98]"
        >
          Controleer plaatsing
        </button>
      )}
    </motion.div>
  );
};
