/**
 * MLTrainerMission.tsx
 *
 * Interactieve ML training visualisatie voor de ml-trainer missie.
 * Leerlingen labelen data, splitsen in train/test, en zien de impact
 * op nauwkeurigheid via een confusion matrix.
 *
 * SLO-doelen: Computationeel denken, AI/ML-begrip, data-geletterdheid
 */

import React, { useState, useMemo } from 'react';
import { ArrowLeft, Trophy, ChevronRight, Check, X, Tag, Shuffle, BarChart3, Brain, Sparkles, GripVertical } from 'lucide-react';
import { MissionFeedbackCard } from '@/features/missions/shared/MissionFeedbackCard';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';

interface Props {
  onBack: () => void;
  onComplete: (success: boolean) => void;
  stats?: any;
}

// --- Data Types ---

interface FruitItem {
  id: number;
  features: string[];
  emoji: string;
  correctCategory: 'appel' | 'banaan';
  label?: 'appel' | 'banaan';
  inSet?: 'train' | 'test';
}

const INITIAL_ITEMS: FruitItem[] = [
  { id: 1, features: ['rood', 'rond', 'klein'], emoji: '1', correctCategory: 'appel' },
  { id: 2, features: ['geel', 'lang', 'krom'], emoji: '2', correctCategory: 'banaan' },
  { id: 3, features: ['groen', 'rond', 'hard'], emoji: '3', correctCategory: 'appel' },
  { id: 4, features: ['geel', 'zacht', 'zoet'], emoji: '4', correctCategory: 'banaan' },
  { id: 5, features: ['rood', 'glanzend', 'stevig'], emoji: '5', correctCategory: 'appel' },
  { id: 6, features: ['geel', 'gebogen', 'glad'], emoji: '6', correctCategory: 'banaan' },
  { id: 7, features: ['groen', 'zuur', 'klein'], emoji: '7', correctCategory: 'appel' },
  { id: 8, features: ['geel', 'lang', 'zacht'], emoji: '8', correctCategory: 'banaan' },
  { id: 9, features: ['rood', 'rond', 'zoet'], emoji: '9', correctCategory: 'appel' },
  { id: 10, features: ['geel', 'krom', 'zoet'], emoji: '10', correctCategory: 'banaan' },
];

// --- Helper Components ---

const ItemCard: React.FC<{
  item: FruitItem;
  onClick?: () => void;
  selected?: boolean;
  showLabel?: boolean;
  draggable?: boolean;
  size?: 'sm' | 'md';
}> = ({ item, onClick, selected, showLabel, draggable, size = 'md' }) => {

  return (
    <button
      onClick={onClick}
      className={`relative rounded-2xl transition-all duration-300 text-left ${
        size === 'sm' ? 'p-2' : 'p-3'
      } ${onClick ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
      style={{
        backgroundColor: selected ? 'rgba(217, 120, 72, 0.06)' : '#FFFFFF',
        border: `2px solid ${selected ? '#D97848' : '#E7D8BD'}`,
        transform: selected ? 'scale(1.05)' : undefined,
        boxShadow: selected ? '0 10px 25px -5px rgba(217, 120, 72, 0.15)' : undefined
      }}
    >
      {draggable && (
        <GripVertical size={14} className="absolute top-1 right-1" style={{ color: '#E7D8BD' }} />
      )}
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold`} style={{
          backgroundColor: showLabel && item.label
            ? item.label === 'appel' ? 'rgba(217, 120, 72, 0.1)' : 'rgba(215, 201, 95, 0.1)'
            : '#E7D8BD',
          color: showLabel && item.label
            ? item.label === 'appel' ? '#D97848' : '#D7C95F'
            : '#445865'
        }}>
          {showLabel && item.label ? (item.label === 'appel' ? '🍎' : '🍌') : `#${item.id}`}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1">
            {item.features.map((f, i) => (
              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#E7D8BD', color: '#445865', border: '1px solid #E7D8BD' }}>
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
      {showLabel && item.label && (
        <div className="mt-1.5 text-[10px] font-bold uppercase tracking-wider" style={{
          color: item.label === 'appel' ? '#D97848' : '#D7C95F'
        }}>
          {item.label === 'appel' ? '🍎 Appel' : '🍌 Banaan'}
        </div>
      )}
      {item.inSet && (
        <div className="absolute -top-1 -right-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{
          backgroundColor: item.inSet === 'train' ? '#D97848' : '#0B453F'
        }}>
          {item.inSet === 'train' ? 'TRAIN' : 'TEST'}
        </div>
      )}
    </button>
  );
};

// Confusion matrix component
const ConfusionMatrix: React.FC<{
  tp: number; fp: number; fn: number; tn: number;
}> = ({ tp, fp, fn, tn }) => {
  const total = tp + fp + fn + tn;
  const accuracy = total > 0 ? ((tp + tn) / total) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
        <h3 className="text-sm font-bold mb-3 text-center" style={{ color: '#445865' }}>Confusion Matrix</h3>
        <div className="grid grid-cols-3 gap-1 max-w-xs mx-auto">
          {/* Header */}
          <div />
          <div className="text-center text-[10px] font-bold py-1" style={{ color: '#D97848' }}>Voorspeld: Appel</div>
          <div className="text-center text-[10px] font-bold py-1" style={{ color: '#D7C95F' }}>Voorspeld: Banaan</div>

          {/* Row 1: Echt Appel */}
          <div className="text-right text-[10px] font-bold py-3 pr-2" style={{ color: '#D97848' }}>Echt: Appel</div>
          <div className="rounded-lg p-3 text-center font-black text-lg" style={{
            backgroundColor: tp > 0 ? 'rgba(95, 148, 125, 0.08)' : '#E7D8BD',
            color: tp > 0 ? '#5F947D' : '#445865'
          }}>
            {tp}
            <p className="text-[8px] font-bold uppercase" style={{ color: 'rgba(95, 148, 125, 0.7)' }}>Correct</p>
          </div>
          <div className="rounded-lg p-3 text-center font-black text-lg" style={{
            backgroundColor: fn > 0 ? 'rgba(217, 120, 72, 0.08)' : '#E7D8BD',
            color: fn > 0 ? '#D97848' : '#445865'
          }}>
            {fn}
            <p className="text-[8px] font-bold uppercase" style={{ color: 'rgba(217, 120, 72, 0.7)' }}>Fout</p>
          </div>

          {/* Row 2: Echt Banaan */}
          <div className="text-right text-[10px] font-bold py-3 pr-2" style={{ color: '#D7C95F' }}>Echt: Banaan</div>
          <div className="rounded-lg p-3 text-center font-black text-lg" style={{
            backgroundColor: fp > 0 ? 'rgba(217, 120, 72, 0.08)' : '#E7D8BD',
            color: fp > 0 ? '#D97848' : '#445865'
          }}>
            {fp}
            <p className="text-[8px] font-bold uppercase" style={{ color: 'rgba(217, 120, 72, 0.7)' }}>Fout</p>
          </div>
          <div className="rounded-lg p-3 text-center font-black text-lg" style={{
            backgroundColor: tn > 0 ? 'rgba(95, 148, 125, 0.08)' : '#E7D8BD',
            color: tn > 0 ? '#5F947D' : '#445865'
          }}>
            {tn}
            <p className="text-[8px] font-bold uppercase" style={{ color: 'rgba(95, 148, 125, 0.7)' }}>Correct</p>
          </div>
        </div>
      </div>

      {/* Accuracy meter */}
      <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
        <p className="text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: '#445865' }}>Nauwkeurigheid</p>
        <p className="text-4xl font-black" style={{ color: accuracy >= 80 ? '#5F947D' : accuracy >= 50 ? '#D97848' : '#D97848' }}>
          {accuracy.toFixed(0)}%
        </p>
        <div className="w-full rounded-full h-3 mt-3 overflow-hidden" style={{ backgroundColor: '#E7D8BD' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${accuracy}%`,
              background: accuracy >= 80 ? 'linear-gradient(to right, #5F947D, #5F947D)' : accuracy >= 50 ? 'linear-gradient(to right, #0B453F, #0B453F)' : 'linear-gradient(to right, #0B453F, #0B453F)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

interface MLTrainerState {
  phase: 'intro' | 'labeling' | 'splitting' | 'results';
  items: FruitItem[];
  reflectie: string;
}

export const MLTrainerMission: React.FC<Props> = ({ onBack, onComplete }) => {
  const { state: saved, setState: setSaved, clearSave } = useMissionAutoSave<MLTrainerState>(
    'ml-trainer',
    { phase: 'intro', items: INITIAL_ITEMS.map(i => ({ ...i })), reflectie: '' }
  );
  const phase = saved.phase;
  const items = saved.items;
  const setPhase = (p: MLTrainerState['phase']) => setSaved(prev => ({ ...prev, phase: p }));
  const setItems = (updater: React.SetStateAction<FruitItem[]>) => setSaved(prev => ({
    ...prev,
    items: typeof updater === 'function' ? updater(prev.items) : updater,
  }));
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  // Labeling stats
  const labeledCount = items.filter(i => i.label).length;
  const allLabeled = labeledCount === items.length;

  // Splitting stats
  const trainItems = items.filter(i => i.inSet === 'train');
  const testItems = items.filter(i => i.inSet === 'test');
  const canTrain = trainItems.length >= 2 && testItems.length >= 2;

  // Calculate confusion matrix from test set
  const confusionMatrix = useMemo(() => {
    // Simple "model" that learns from training data:
    // Count features per category in training set, then classify test items
    const featureCounts: Record<string, { appel: number; banaan: number }> = {};

    for (const item of trainItems) {
      if (!item.label) continue;
      for (const f of item.features) {
        if (!featureCounts[f]) featureCounts[f] = { appel: 0, banaan: 0 };
        featureCounts[f][item.label]++;
      }
    }

    let tp = 0, fp = 0, fn = 0, tn = 0;

    for (const item of testItems) {
      if (!item.label) continue;
      // Predict based on feature votes
      let appelScore = 0, banaanScore = 0;
      for (const f of item.features) {
        if (featureCounts[f]) {
          appelScore += featureCounts[f].appel;
          banaanScore += featureCounts[f].banaan;
        }
      }
      const predicted = appelScore >= banaanScore ? 'appel' : 'banaan';
      const actual = item.correctCategory;

      if (actual === 'appel' && predicted === 'appel') tp++;
      else if (actual === 'banaan' && predicted === 'appel') fp++;
      else if (actual === 'appel' && predicted === 'banaan') fn++;
      else if (actual === 'banaan' && predicted === 'banaan') tn++;
    }

    return { tp, fp, fn, tn };
  }, [trainItems, testItems]);

  const accuracy = useMemo(() => {
    const { tp, fp, fn, tn } = confusionMatrix;
    const total = tp + fp + fn + tn;
    return total > 0 ? ((tp + tn) / total) * 100 : 0;
  }, [confusionMatrix]);

  const labelItem = (category: 'appel' | 'banaan') => {
    if (selectedItem === null) return;
    setItems(prev => prev.map(i =>
      i.id === selectedItem ? { ...i, label: category } : i
    ));
    // Auto-select next unlabeled item
    const nextUnlabeled = items.find(i => i.id !== selectedItem && !i.label);
    setSelectedItem(nextUnlabeled?.id ?? null);
  };

  const toggleSet = (itemId: number) => {
    setItems(prev => prev.map(i => {
      if (i.id !== itemId) return i;
      if (i.inSet === 'train') return { ...i, inSet: 'test' };
      if (i.inSet === 'test') return { ...i, inSet: undefined };
      return { ...i, inSet: 'train' };
    }));
  };

  const autoSplit = () => {
    // Shuffle and split 60/40
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    const splitIndex = Math.ceil(shuffled.length * 0.6);
    setItems(prev => prev.map(item => {
      const idx = shuffled.findIndex(s => s.id === item.id);
      return { ...item, inSet: idx < splitIndex ? 'train' : 'test' };
    }));
  };

  // Calculate score for labeling quality
  const correctLabels = items.filter(i => i.label === i.correctCategory).length;
  const labelingScore = Math.round((correctLabels / items.length) * 50);
  const splitScore = canTrain ? (accuracy >= 80 ? 50 : accuracy >= 50 ? 30 : 15) : 0;
  const totalScore = labelingScore + splitScore;

  // --- INTRO PHASE ---
  if (phase === 'intro') {
    return (
      <div className="min-h-screen text-white overflow-y-auto p-4 pb-safe" style={{ backgroundColor: '#FCF6EA' }}>
        <button onClick={onBack} className="flex items-center gap-2 mb-6 transition-colors" style={{ color: '#445865' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#08283B')}
          onMouseLeave={e => (e.currentTarget.style.color = '#445865')}
        >
          <ArrowLeft size={18} /> <span className="text-sm font-bold">Terug</span>
        </button>

        <div className="max-w-lg mx-auto text-center space-y-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 blur-3xl rounded-full animate-pulse" style={{ backgroundColor: 'rgba(95, 148, 125, 0.2)' }} />
            <div className="relative w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl" style={{ background: 'linear-gradient(to bottom right, #5F947D, #5F947D)' }}>
              <BarChart3 size={48} className="text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#08283B' }}>ML Trainer</h1>
          <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#445865' }}>
            Leer hoe <span className="font-bold" style={{ color: '#5F947D' }}>Machine Learning</span> werkt door zelf een model te trainen!
            Je gaat data labelen, opsplitsen en ontdekken hoe goed je model presteert.
          </p>

          {/* Steps overview */}
          <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
            <h3 className="text-sm font-bold" style={{ color: '#5F947D' }}>Hoe traint een ML-model?</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start gap-3 text-left">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: '#D97848' }}>1</div>
                <div>
                  <p className="text-sm font-bold" style={{ color: '#08283B' }}>Data labelen</p>
                  <p className="text-xs" style={{ color: '#445865' }}>Vertel het model wat elk voorbeeld is (bijv. appel of banaan)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: '#0B453F' }}>2</div>
                <div>
                  <p className="text-sm font-bold" style={{ color: '#08283B' }}>Train/Test splitsen</p>
                  <p className="text-xs" style={{ color: '#445865' }}>Verdeel de data: een deel om van te leren, een deel om te testen</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: '#5F947D' }}>3</div>
                <div>
                  <p className="text-sm font-bold" style={{ color: '#08283B' }}>Evalueren</p>
                  <p className="text-xs" style={{ color: '#445865' }}>Kijk hoe goed het model presteert op de testdata</p>
                </div>
              </div>
            </div>
          </div>

          {/* Example */}
          <div className="rounded-2xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
            <p className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: '#445865' }}>Voorbeeld: Fruit Classificatie</p>
            <div className="flex items-center justify-center gap-4">
              <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'rgba(217, 120, 72, 0.06)', border: '1px solid rgba(217, 120, 72, 0.2)' }}>
                <span className="text-2xl">🍎</span>
                <p className="text-[10px] font-bold mt-1" style={{ color: '#D97848' }}>rood, rond, klein</p>
              </div>
              <span className="text-xl" style={{ color: '#E7D8BD' }}>vs</span>
              <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'rgba(215, 201, 95, 0.06)', border: '1px solid rgba(215, 201, 95, 0.2)' }}>
                <span className="text-2xl">🍌</span>
                <p className="text-[10px] font-bold mt-1" style={{ color: '#D7C95F' }}>geel, lang, krom</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => { setSelectedItem(items[0].id); setPhase('labeling'); }}
            className="w-full py-4 rounded-full font-black text-lg text-white transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#D97848]"
            style={{ backgroundColor: '#D97848' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#D97848')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#D97848')}
          >
            <Tag size={20} /> Start met Labelen
          </button>
        </div>
      </div>
    );
  }

  // --- LABELING PHASE ---
  if (phase === 'labeling') {
    const currentItem = items.find(i => i.id === selectedItem);

    return (
      <div className="min-h-screen overflow-y-auto pb-safe" style={{ backgroundColor: '#FCF6EA' }}>
        {/* Header */}
        <div className="sticky top-0 z-20 backdrop-blur-md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderBottom: '1px solid #E7D8BD' }}>
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={onBack} className="p-2 transition-colors" style={{ color: '#445865' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#08283B')}
              onMouseLeave={e => (e.currentTarget.style.color = '#445865')}
            ><ArrowLeft size={20} /></button>
            <div className="flex items-center gap-2">
              <Tag size={16} style={{ color: '#D97848' }} />
              <span className="text-sm font-bold" style={{ color: '#08283B' }}>{labeledCount}/{items.length} gelabeld</span>
            </div>
            {allLabeled && (
              <button
                onClick={() => setPhase('splitting')}
                className="px-4 py-2 rounded-full text-sm font-bold text-white flex items-center gap-1 active:scale-95 transition-all duration-300"
                style={{ backgroundColor: '#5F947D' }}
              >
                Verder <ChevronRight size={16} />
              </button>
            )}
            {!allLabeled && <div className="w-20" />}
          </div>
          <div className="h-1" style={{ backgroundColor: '#E7D8BD' }}>
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${(labeledCount / items.length) * 100}%`, background: 'linear-gradient(to right, #0B453F, #0B453F)' }}
            />
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#08283B' }}>Stap 1: Data Labelen</h2>
            <p className="text-sm" style={{ color: '#445865' }}>
              Bekijk de kenmerken en beslis: is het een <span className="font-bold" style={{ color: '#D97848' }}>appel</span> of een <span className="font-bold" style={{ color: '#D7C95F' }}>banaan</span>?
            </p>
          </div>

          {/* Selected item detail */}
          {currentItem && (
            <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: '#FFFFFF', border: '2px solid rgba(217, 120, 72, 0.3)' }}>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: '#D97848' }}>Item #{currentItem.id}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {currentItem.features.map((f, i) => (
                    <span key={i} className="text-sm px-3 py-1.5 rounded-full font-bold" style={{ backgroundColor: '#E7D8BD', color: '#08283B', border: '1px solid #E7D8BD' }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => labelItem('appel')}
                  className="flex-1 py-4 rounded-full font-black text-lg flex items-center justify-center gap-2 transition-all duration-300 active:scale-95"
                  style={{
                    backgroundColor: currentItem.label === 'appel' ? '#D97848' : 'rgba(217, 120, 72, 0.06)',
                    color: currentItem.label === 'appel' ? '#FFFFFF' : '#D97848',
                    border: `2px solid ${currentItem.label === 'appel' ? '#D97848' : 'rgba(217, 120, 72, 0.2)'}`,
                    boxShadow: currentItem.label === 'appel' ? '0 10px 25px -5px rgba(217, 120, 72, 0.3)' : undefined
                  }}
                >
                  🍎 Appel
                </button>
                <button
                  onClick={() => labelItem('banaan')}
                  className="flex-1 py-4 rounded-full font-black text-lg flex items-center justify-center gap-2 transition-all duration-300 active:scale-95"
                  style={{
                    backgroundColor: currentItem.label === 'banaan' ? '#D7C95F' : 'rgba(215, 201, 95, 0.06)',
                    color: currentItem.label === 'banaan' ? '#FFFFFF' : '#D7C95F',
                    border: `2px solid ${currentItem.label === 'banaan' ? '#D7C95F' : 'rgba(215, 201, 95, 0.2)'}`,
                    boxShadow: currentItem.label === 'banaan' ? '0 10px 25px -5px rgba(215, 201, 95, 0.3)' : undefined
                  }}
                >
                  🍌 Banaan
                </button>
              </div>
            </div>
          )}

          {/* All items grid */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#445865' }}>Alle items (klik om te selecteren)</p>
            <div className="grid grid-cols-2 gap-2">
              {items.map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClick={() => setSelectedItem(item.id)}
                  selected={item.id === selectedItem}
                  showLabel
                  size="sm"
                />
              ))}
            </div>
          </div>

          {allLabeled && (
            <div className="rounded-2xl p-4 text-center animate-in fade-in" style={{ backgroundColor: 'rgba(95, 148, 125, 0.06)', border: '1px solid rgba(95, 148, 125, 0.2)' }}>
              <p className="font-bold" style={{ color: '#5F947D' }}>Alle items gelabeld! Ga verder naar de volgende stap.</p>
              <button
                onClick={() => setPhase('splitting')}
                className="mt-3 px-6 py-3 rounded-full font-black text-white flex items-center justify-center gap-2 mx-auto active:scale-95 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97848]"
                style={{ backgroundColor: '#D97848' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#D97848')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#D97848')}
              >
                Naar Train/Test Split <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- SPLITTING PHASE ---
  if (phase === 'splitting') {
    return (
      <div className="min-h-screen overflow-y-auto pb-safe" style={{ backgroundColor: '#FCF6EA' }}>
        {/* Header */}
        <div className="sticky top-0 z-20 backdrop-blur-md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderBottom: '1px solid #E7D8BD' }}>
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={() => setPhase('labeling')} className="p-2 transition-colors" style={{ color: '#445865' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#08283B')}
              onMouseLeave={e => (e.currentTarget.style.color = '#445865')}
            ><ArrowLeft size={20} /></button>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(217, 120, 72, 0.1)', color: '#D97848', border: '1px solid rgba(217, 120, 72, 0.2)' }}>Train: {trainItems.length}</span>
              <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(11, 69, 63, 0.1)', color: '#0B453F', border: '1px solid rgba(11, 69, 63, 0.2)' }}>Test: {testItems.length}</span>
            </div>
            {canTrain && (
              <button
                onClick={() => setPhase('results')}
                className="px-4 py-2 rounded-full text-sm font-bold text-white flex items-center gap-1 active:scale-95 transition-all duration-300"
                style={{ backgroundColor: '#5F947D' }}
              >
                Train! <ChevronRight size={16} />
              </button>
            )}
            {!canTrain && <div className="w-20" />}
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#08283B' }}>Stap 2: Train/Test Split</h2>
            <p className="text-sm" style={{ color: '#445865' }}>
              Klik op items om ze toe te wijzen: <span className="font-bold" style={{ color: '#D97848' }}>Train</span> (om van te leren)
              of <span className="font-bold" style={{ color: '#0B453F' }}>Test</span> (om te testen). Minimaal 2 in elk!
            </p>
          </div>

          {/* Quick actions */}
          <div className="flex gap-3">
            <button
              onClick={autoSplit}
              className="flex-1 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-all duration-300"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD', color: '#445865' }}
            >
              <Shuffle size={16} /> Automatisch Splitsen
            </button>
            <button
              onClick={() => setItems(prev => prev.map(i => ({ ...i, inSet: undefined })))}
              className="py-3 px-4 rounded-full text-sm font-bold active:scale-95 transition-all duration-300"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD', color: '#445865' }}
            >
              Reset
            </button>
          </div>

          {/* Split explanation */}
          <div className="rounded-2xl p-3" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
            <div className="flex items-start gap-2">
              <Sparkles size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#D97848' }} />
              <p className="text-[11px]" style={{ color: '#445865' }}>
                <span className="font-bold" style={{ color: '#D97848' }}>Waarom splitsen?</span> Als je het model test met dezelfde data als waarmee het getraind is,
                lijkt het beter dan het is. Met apart testdata ontdek je hoe goed het echt is!
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#E7D8BD' }} />
              <span style={{ color: '#445865' }}>Niet toegewezen (klik)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#D97848' }} />
              <span style={{ color: '#D97848' }}>Train (klik nogmaals)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#0B453F' }} />
              <span style={{ color: '#0B453F' }}>Test (klik nog eens = reset)</span>
            </div>
          </div>

          {/* Items grid */}
          <div className="grid grid-cols-2 gap-2">
            {items.map(item => (
              <div key={item.id} onClick={() => toggleSet(item.id)} className="cursor-pointer">
                <ItemCard item={item} showLabel size="sm" />
              </div>
            ))}
          </div>

          {/* Validation message */}
          {!canTrain && (trainItems.length > 0 || testItems.length > 0) && (
            <div className="rounded-2xl p-3 text-center" style={{ backgroundColor: 'rgba(217, 120, 72, 0.06)', border: '1px solid rgba(217, 120, 72, 0.2)' }}>
              <p className="text-sm font-bold" style={{ color: '#D97848' }}>
                {trainItems.length < 2 ? `Voeg nog ${2 - trainItems.length} item(s) toe aan Train` :
                  `Voeg nog ${2 - testItems.length} item(s) toe aan Test`}
              </p>
            </div>
          )}

          {canTrain && (
            <button
              onClick={() => setPhase('results')}
              className="w-full py-4 rounded-full font-black text-lg text-white flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#D97848]"
              style={{ backgroundColor: '#D97848' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#D97848')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#D97848')}
            >
              <Brain size={20} /> Train het Model!
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- RESULTS PHASE ---
  const feedbackConfig = {
    missionTitle: 'ML Trainer',
    maxScore: 100,
    goldThreshold: 80,
    silverThreshold: 50,
  };

  return (
    <div className="min-h-screen overflow-y-auto" style={{ backgroundColor: '#FCF6EA' }}>
      <div className="min-h-full flex items-center justify-center p-4 pb-safe">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-black mb-2" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#08283B' }}>Model Getraind!</h1>
            <p className="text-sm" style={{ color: '#445865' }}>Zo presteert jouw ML-model op de testdata:</p>
          </div>

          {/* Confusion Matrix */}
          <ConfusionMatrix {...confusionMatrix} />

          {/* Explanation of results */}
          <div className="rounded-2xl p-4 space-y-2" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: '#D97848' }}>
              <Sparkles size={14} /> Wat betekent dit?
            </h3>
            <p className="text-xs" style={{ color: '#445865' }}>
              De confusion matrix laat zien hoeveel items correct en incorrect zijn geclassificeerd.
              {accuracy >= 80
                ? ' Jouw model presteert goed! De meeste items zijn correct herkend.'
                : accuracy >= 50
                  ? ' Jouw model heeft een redelijke nauwkeurigheid, maar er zijn verbeterpunten.'
                  : ' Jouw model heeft moeite met het onderscheiden van appels en bananen. Misschien waren de labels niet allemaal correct?'}
            </p>
            <p className="text-xs" style={{ color: '#445865' }}>
              <span className="font-bold" style={{ color: '#D97848' }}>Fun fact:</span> echte ML-engineers doen precies dit proces, maar dan
              met duizenden of miljoenen datapunten in plaats van 10!
            </p>
          </div>

          {/* Score card */}
          <MissionFeedbackCard
            score={totalScore}
            config={feedbackConfig}
            whatWentWell={
              accuracy >= 80
                ? 'Uitstekend! Je hebt de data goed gelabeld en een effectieve train/test split gemaakt.'
                : accuracy >= 50
                  ? 'Goed gedaan. Je begrijpt het basisprincipe van data labelen en splitsen.'
                  : 'Je hebt de eerste stappen gezet in Machine Learning. Probeer het nog eens voor een beter resultaat!'
            }
            improvementPoint={
              correctLabels < items.length
                ? 'Let goed op de kenmerken bij het labelen. Kleur en vorm zijn de belangrijkste aanwijzingen.'
                : 'Experimenteer met verschillende train/test verhoudingen om te zien hoe dit de nauwkeurigheid beinvloedt.'
            }
            nextStep="Bedenk waar je in het dagelijks leven ML-modellen tegenkomt (spam filters, aanbevelingen, gezichtsherkenning)."
          >
            <div className="rounded-xl p-4 mt-2" style={{ backgroundColor: '#FCF6EA' }}>
              <p className="text-sm font-medium mb-1" style={{ color: '#445865' }}>Detailscore</p>
              <div className="flex justify-between text-sm">
                <span style={{ color: '#445865' }}>Labels correct: {correctLabels}/{items.length}</span>
                <span style={{ color: '#445865' }}>Model nauwkeurigheid: {accuracy.toFixed(0)}%</span>
              </div>
            </div>
          </MissionFeedbackCard>

          <div className="rounded-2xl p-4 text-left space-y-2" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
            <p className="text-xs font-bold mb-2" style={{ color: '#08283B' }}>Wat je hebt geleerd:</p>
            <p className="text-xs" style={{ color: '#445865' }}>1. ML-modellen leren van gelabelde data (supervised learning)</p>
            <p className="text-xs" style={{ color: '#445865' }}>2. Train/test split is nodig om eerlijk te meten hoe goed een model is</p>
            <p className="text-xs" style={{ color: '#445865' }}>3. Een confusion matrix laat zien waar het model fouten maakt</p>
          </div>

          {/* Reflectie */}
          <div className="rounded-2xl p-4 text-left space-y-3" style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(217, 120, 72, 0.2)' }}>
            <div className="flex items-center gap-2">
              <Sparkles size={16} style={{ color: '#D97848' }} />
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#D97848', fontFamily: "'Outfit', system-ui, sans-serif" }}>Reflectie</p>
            </div>
            <p className="text-xs" style={{ color: '#445865', fontFamily: "'Outfit', system-ui, sans-serif" }}>Wat heb je geleerd in deze missie? Waar zou je dit in het dagelijks leven tegenkomen?</p>
            <textarea
              value={saved.reflectie}
              onChange={e => setSaved(prev => ({ ...prev, reflectie: e.target.value }))}
              placeholder="Wat heb je geleerd? Waar kom je dit nog meer tegen?"
              className="w-full p-3 rounded-xl border-2 resize-none focus:outline-none transition-all duration-300"
              style={{ minHeight: '80px', fontFamily: "'Outfit', system-ui, sans-serif", borderColor: '#E7D8BD', backgroundColor: '#FCF6EA', fontSize: '0.875rem' }}
              onFocus={e => (e.currentTarget.style.borderColor = '#D97848')}
              onBlur={e => (e.currentTarget.style.borderColor = '#E7D8BD')}
            />
          </div>

          <button
            onClick={() => { clearSave(); onComplete(totalScore >= 30); }}
            disabled={saved.reflectie.trim().length < 10}
            className="w-full py-4 rounded-full font-black text-lg text-white transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#D97848]"
            style={{
              backgroundColor: saved.reflectie.trim().length < 10 ? '#E7D8BD' : '#D97848',
              color: saved.reflectie.trim().length < 10 ? '#E7D8BD' : '#FFFFFF',
              cursor: saved.reflectie.trim().length < 10 ? 'not-allowed' : 'pointer',
              boxShadow: saved.reflectie.trim().length < 10 ? 'none' : undefined,
            }}
            onMouseEnter={e => { if (saved.reflectie.trim().length >= 10) e.currentTarget.style.backgroundColor = '#D97848'; }}
            onMouseLeave={e => { if (saved.reflectie.trim().length >= 10) e.currentTarget.style.backgroundColor = '#D97848'; }}
          >
            <Trophy size={20} /> Missie Voltooid!
          </button>
        </div>
      </div>
    </div>
  );
};
