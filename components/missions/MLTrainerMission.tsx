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
import { MissionFeedbackCard } from '../MissionFeedbackCard';

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
  const isAppel = item.label === 'appel' || (!item.label && item.correctCategory === 'appel');

  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl border-2 transition-all text-left ${
        size === 'sm' ? 'p-2' : 'p-3'
      } ${
        selected
          ? 'border-indigo-500 bg-indigo-500/10 scale-105 shadow-lg'
          : 'border-slate-700/50 bg-slate-800/50 hover:border-slate-600'
      } ${onClick ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
    >
      {draggable && (
        <GripVertical size={14} className="absolute top-1 right-1 text-slate-600" />
      )}
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold ${
          showLabel && item.label
            ? item.label === 'appel' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
            : 'bg-slate-700 text-slate-300'
        }`}>
          {showLabel && item.label ? (item.label === 'appel' ? '🍎' : '🍌') : `#${item.id}`}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1">
            {item.features.map((f, i) => (
              <span key={i} className="text-[10px] bg-slate-700/50 text-slate-300 px-1.5 py-0.5 rounded font-medium">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
      {showLabel && item.label && (
        <div className={`mt-1.5 text-[10px] font-bold uppercase tracking-wider ${
          item.label === 'appel' ? 'text-red-400' : 'text-yellow-400'
        }`}>
          {item.label === 'appel' ? '🍎 Appel' : '🍌 Banaan'}
        </div>
      )}
      {item.inSet && (
        <div className={`absolute -top-1 -right-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
          item.inSet === 'train' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
        }`}>
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
      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
        <h3 className="text-sm font-bold text-slate-300 mb-3 text-center">Confusion Matrix</h3>
        <div className="grid grid-cols-3 gap-1 max-w-xs mx-auto">
          {/* Header */}
          <div />
          <div className="text-center text-[10px] font-bold text-red-400 py-1">Voorspeld: Appel</div>
          <div className="text-center text-[10px] font-bold text-yellow-400 py-1">Voorspeld: Banaan</div>

          {/* Row 1: Echt Appel */}
          <div className="text-right text-[10px] font-bold text-red-400 py-3 pr-2">Echt: Appel</div>
          <div className={`rounded-lg p-3 text-center font-black text-lg ${tp > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 text-slate-500'}`}>
            {tp}
            <p className="text-[8px] font-bold text-emerald-500/70 uppercase">Correct</p>
          </div>
          <div className={`rounded-lg p-3 text-center font-black text-lg ${fn > 0 ? 'bg-red-500/20 text-red-400' : 'bg-slate-700/50 text-slate-500'}`}>
            {fn}
            <p className="text-[8px] font-bold text-red-500/70 uppercase">Fout</p>
          </div>

          {/* Row 2: Echt Banaan */}
          <div className="text-right text-[10px] font-bold text-yellow-400 py-3 pr-2">Echt: Banaan</div>
          <div className={`rounded-lg p-3 text-center font-black text-lg ${fp > 0 ? 'bg-red-500/20 text-red-400' : 'bg-slate-700/50 text-slate-500'}`}>
            {fp}
            <p className="text-[8px] font-bold text-red-500/70 uppercase">Fout</p>
          </div>
          <div className={`rounded-lg p-3 text-center font-black text-lg ${tn > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 text-slate-500'}`}>
            {tn}
            <p className="text-[8px] font-bold text-emerald-500/70 uppercase">Correct</p>
          </div>
        </div>
      </div>

      {/* Accuracy meter */}
      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 text-center">
        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-2">Nauwkeurigheid</p>
        <p className={`text-4xl font-black ${accuracy >= 80 ? 'text-emerald-400' : accuracy >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
          {accuracy.toFixed(0)}%
        </p>
        <div className="w-full bg-slate-700 rounded-full h-3 mt-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${accuracy >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : accuracy >= 50 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-red-500 to-pink-400'}`}
            style={{ width: `${accuracy}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export const MLTrainerMission: React.FC<Props> = ({ onBack, onComplete }) => {
  const [phase, setPhase] = useState<'intro' | 'labeling' | 'splitting' | 'results'>('intro');
  const [items, setItems] = useState<FruitItem[]>(INITIAL_ITEMS.map(i => ({ ...i })));
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
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white overflow-y-auto p-4 pb-safe">
        <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white mb-6">
          <ArrowLeft size={18} /> <span className="text-sm font-bold">Terug</span>
        </button>

        <div className="max-w-lg mx-auto text-center space-y-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-emerald-500/30 blur-3xl rounded-full animate-pulse" />
            <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl">
              <BarChart3 size={48} className="text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-black">ML Trainer</h1>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm mx-auto">
            Leer hoe <span className="text-emerald-400 font-bold">Machine Learning</span> werkt door zelf een model te trainen!
            Je gaat data labelen, opsplitsen en ontdekken hoe goed je model presteert.
          </p>

          {/* Steps overview */}
          <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 space-y-4">
            <h3 className="text-sm font-bold text-emerald-400">Hoe traint een ML-model?</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start gap-3 text-left">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <p className="text-sm font-bold text-white">Data labelen</p>
                  <p className="text-xs text-slate-400">Vertel het model wat elk voorbeeld is (bijv. appel of banaan)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <p className="text-sm font-bold text-white">Train/Test splitsen</p>
                  <p className="text-xs text-slate-400">Verdeel de data: een deel om van te leren, een deel om te testen</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <p className="text-sm font-bold text-white">Evalueren</p>
                  <p className="text-xs text-slate-400">Kijk hoe goed het model presteert op de testdata</p>
                </div>
              </div>
            </div>
          </div>

          {/* Example */}
          <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/30">
            <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Voorbeeld: Fruit Classificatie</p>
            <div className="flex items-center justify-center gap-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-center">
                <span className="text-2xl">🍎</span>
                <p className="text-[10px] text-red-400 font-bold mt-1">rood, rond, klein</p>
              </div>
              <span className="text-slate-600 text-xl">vs</span>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 text-center">
                <span className="text-2xl">🍌</span>
                <p className="text-[10px] text-yellow-400 font-bold mt-1">geel, lang, krom</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => { setSelectedItem(items[0].id); setPhase('labeling'); }}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl font-black text-lg hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2"
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
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white overflow-y-auto pb-safe">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={onBack} className="p-2 text-slate-400 hover:text-white"><ArrowLeft size={20} /></button>
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-blue-400" />
              <span className="text-sm font-bold text-white">{labeledCount}/{items.length} gelabeld</span>
            </div>
            {allLabeled && (
              <button
                onClick={() => setPhase('splitting')}
                className="px-4 py-2 bg-emerald-500 rounded-xl text-sm font-bold flex items-center gap-1 active:scale-95"
              >
                Verder <ChevronRight size={16} />
              </button>
            )}
            {!allLabeled && <div className="w-20" />}
          </div>
          <div className="h-1 bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${(labeledCount / items.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black">Stap 1: Data Labelen</h2>
            <p className="text-sm text-slate-400">
              Bekijk de kenmerken en beslis: is het een <span className="text-red-400 font-bold">appel</span> of een <span className="text-yellow-400 font-bold">banaan</span>?
            </p>
          </div>

          {/* Selected item detail */}
          {currentItem && (
            <div className="bg-slate-800/50 rounded-2xl p-5 border border-indigo-500/30 space-y-4">
              <div className="text-center">
                <p className="text-[10px] text-indigo-400 uppercase tracking-wider font-bold mb-2">Item #{currentItem.id}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {currentItem.features.map((f, i) => (
                    <span key={i} className="text-sm bg-slate-700 text-white px-3 py-1.5 rounded-lg font-bold">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => labelItem('appel')}
                  className={`flex-1 py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    currentItem.label === 'appel'
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                      : 'bg-red-500/10 border-2 border-red-500/30 text-red-400 hover:bg-red-500/20'
                  }`}
                >
                  🍎 Appel
                </button>
                <button
                  onClick={() => labelItem('banaan')}
                  className={`flex-1 py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    currentItem.label === 'banaan'
                      ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30'
                      : 'bg-yellow-500/10 border-2 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20'
                  }`}
                >
                  🍌 Banaan
                </button>
              </div>
            </div>
          )}

          {/* All items grid */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alle items (klik om te selecteren)</p>
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
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center animate-in fade-in">
              <p className="text-emerald-400 font-bold">Alle items gelabeld! Ga verder naar de volgende stap.</p>
              <button
                onClick={() => setPhase('splitting')}
                className="mt-3 px-6 py-3 bg-emerald-500 rounded-xl font-black flex items-center justify-center gap-2 mx-auto active:scale-95 hover:scale-105 transition-transform shadow-xl"
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
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white overflow-y-auto pb-safe">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={() => setPhase('labeling')} className="p-2 text-slate-400 hover:text-white"><ArrowLeft size={20} /></button>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded">Train: {trainItems.length}</span>
              <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded">Test: {testItems.length}</span>
            </div>
            {canTrain && (
              <button
                onClick={() => setPhase('results')}
                className="px-4 py-2 bg-emerald-500 rounded-xl text-sm font-bold flex items-center gap-1 active:scale-95"
              >
                Train! <ChevronRight size={16} />
              </button>
            )}
            {!canTrain && <div className="w-20" />}
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black">Stap 2: Train/Test Split</h2>
            <p className="text-sm text-slate-400">
              Klik op items om ze toe te wijzen: <span className="text-blue-400 font-bold">Train</span> (om van te leren)
              of <span className="text-purple-400 font-bold">Test</span> (om te testen). Minimaal 2 in elk!
            </p>
          </div>

          {/* Quick actions */}
          <div className="flex gap-3">
            <button
              onClick={autoSplit}
              className="flex-1 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-700/50 active:scale-95"
            >
              <Shuffle size={16} /> Automatisch Splitsen
            </button>
            <button
              onClick={() => setItems(prev => prev.map(i => ({ ...i, inSet: undefined })))}
              className="py-3 px-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm font-bold hover:bg-slate-700/50 active:scale-95"
            >
              Reset
            </button>
          </div>

          {/* Split explanation */}
          <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
            <div className="flex items-start gap-2">
              <Sparkles size={14} className="text-indigo-400 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-slate-400">
                <span className="text-indigo-400 font-bold">Waarom splitsen?</span> Als je het model test met dezelfde data als waarmee het getraind is,
                lijkt het beter dan het is. Met apart testdata ontdek je hoe goed het echt is!
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-slate-700" />
              <span className="text-slate-400">Niet toegewezen (klik)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-blue-500" />
              <span className="text-blue-400">Train (klik nogmaals)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-purple-500" />
              <span className="text-purple-400">Test (klik nog eens = reset)</span>
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
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-center">
              <p className="text-amber-400 text-sm font-bold">
                {trainItems.length < 2 ? `Voeg nog ${2 - trainItems.length} item(s) toe aan Train` :
                  `Voeg nog ${2 - testItems.length} item(s) toe aan Test`}
              </p>
            </div>
          )}

          {canTrain && (
            <button
              onClick={() => setPhase('results')}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-emerald-500/30"
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 text-white overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4 pb-safe">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-black text-white mb-2">Model Getraind!</h1>
            <p className="text-slate-400 text-sm">Zo presteert jouw ML-model op de testdata:</p>
          </div>

          {/* Confusion Matrix */}
          <ConfusionMatrix {...confusionMatrix} />

          {/* Explanation of results */}
          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30 space-y-2">
            <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
              <Sparkles size={14} /> Wat betekent dit?
            </h3>
            <p className="text-xs text-slate-400">
              De confusion matrix laat zien hoeveel items correct en incorrect zijn geclassificeerd.
              {accuracy >= 80
                ? ' Jouw model presteert goed! De meeste items zijn correct herkend.'
                : accuracy >= 50
                  ? ' Jouw model heeft een redelijke nauwkeurigheid, maar er zijn verbeterpunten.'
                  : ' Jouw model heeft moeite met het onderscheiden van appels en bananen. Misschien waren de labels niet allemaal correct?'}
            </p>
            <p className="text-xs text-slate-400">
              <span className="text-indigo-400 font-bold">Fun fact:</span> echte ML-engineers doen precies dit proces, maar dan
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
            <div className="bg-slate-50 rounded-xl p-4 mt-2">
              <p className="text-slate-600 text-sm font-medium mb-1">Detailscore</p>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Labels correct: {correctLabels}/{items.length}</span>
                <span className="text-slate-500">Model nauwkeurigheid: {accuracy.toFixed(0)}%</span>
              </div>
            </div>
          </MissionFeedbackCard>

          <div className="bg-white/5 rounded-2xl p-4 text-left space-y-2 border border-white/10">
            <p className="text-xs font-bold text-white/80 mb-2">Wat je hebt geleerd:</p>
            <p className="text-xs text-white/60">1. ML-modellen leren van gelabelde data (supervised learning)</p>
            <p className="text-xs text-white/60">2. Train/test split is nodig om eerlijk te meten hoe goed een model is</p>
            <p className="text-xs text-white/60">3. Een confusion matrix laat zien waar het model fouten maakt</p>
          </div>

          <button
            onClick={() => onComplete(totalScore >= 30)}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl font-black text-lg hover:scale-105 transition-transform active:scale-95 shadow-xl flex items-center justify-center gap-2"
          >
            <Trophy size={20} /> Missie Voltooid!
          </button>
        </div>
      </div>
    </div>
  );
};
