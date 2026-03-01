/**
 * NeuralNavigatorMission.tsx
 *
 * Interactieve neural network visualisatie voor de neural-navigator missie.
 * Leerlingen leren hoe een neuraal netwerk werkt door gewichten aan te passen
 * en te zien hoe dit de output beinvloedt.
 *
 * SLO-doelen: Computationeel denken, AI-begrip, interactief leren
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Trophy, ChevronRight, Play, Pause, RotateCcw, Brain, Sparkles, Zap } from 'lucide-react';
import { MissionFeedbackCard } from '../MissionFeedbackCard';

interface Props {
  onBack: () => void;
  onComplete: (success: boolean) => void;
  stats?: any;
}

// --- Neural Network Helpers ---

type Weights = {
  inputToHidden: number[][]; // [2][3]
  hiddenToOutput: number[];  // [3]
};

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function forwardPass(inputs: number[], weights: Weights): { hidden: number[]; output: number } {
  const hidden = [0, 1, 2].map(h => {
    const sum = inputs.reduce((acc, inp, i) => acc + inp * weights.inputToHidden[i][h], 0);
    return sigmoid(sum);
  });
  const outSum = hidden.reduce((acc, h, i) => acc + h * weights.hiddenToOutput[i], 0);
  return { hidden, output: sigmoid(outSum) };
}

function randomWeights(): Weights {
  return {
    inputToHidden: [
      [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1],
      [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1],
    ],
    hiddenToOutput: [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1],
  };
}

// Challenges: input pairs with target output
const CHALLENGES = [
  { inputs: [1, 0], target: 1, label: 'AND-achtig: als input 1 AAN is', description: 'Maak de output HOOG (groen) als input 1 aan staat' },
  { inputs: [0, 1], target: 0, label: 'Niet input 2: als input 2 AAN is', description: 'Maak de output LAAG (rood) als input 2 aan staat' },
  { inputs: [1, 1], target: 1, label: 'Beide aan', description: 'Maak de output HOOG (groen) als beide inputs aan staan' },
];

// --- Network Visualization Component ---

interface NetworkVizProps {
  weights: Weights;
  inputs: number[];
  hidden: number[];
  output: number;
  onWeightChange?: (layer: 'ih' | 'ho', i: number, j: number, value: number) => void;
  interactive?: boolean;
  compact?: boolean;
}

const NetworkVisualization: React.FC<NetworkVizProps> = ({
  weights, inputs, hidden, output, onWeightChange, interactive = false, compact = false,
}) => {
  const svgWidth = compact ? 320 : 420;
  const svgHeight = compact ? 220 : 280;

  // Node positions
  const inputNodes = [
    { x: 60, y: svgHeight * 0.33, label: `In 1: ${inputs[0].toFixed(1)}` },
    { x: 60, y: svgHeight * 0.67, label: `In 2: ${inputs[1].toFixed(1)}` },
  ];
  const hiddenNodes = [
    { x: svgWidth / 2, y: svgHeight * 0.2 },
    { x: svgWidth / 2, y: svgHeight * 0.5 },
    { x: svgWidth / 2, y: svgHeight * 0.8 },
  ];
  const outputNode = { x: svgWidth - 60, y: svgHeight * 0.5 };

  const getConnectionColor = (w: number) => {
    if (w > 0) return `rgba(34, 197, 94, ${Math.min(Math.abs(w), 1)})`;
    return `rgba(239, 68, 68, ${Math.min(Math.abs(w), 1)})`;
  };

  const getConnectionWidth = (w: number) => Math.max(1, Math.min(Math.abs(w) * 4, 6));

  const getNodeColor = (activation: number) => {
    const r = Math.round(239 * (1 - activation) + 34 * activation);
    const g = Math.round(68 * (1 - activation) + 197 * activation);
    const b = Math.round(68 * (1 - activation) + 94 * activation);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="relative">
      <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="mx-auto">
        {/* Input to Hidden connections */}
        {inputNodes.map((inp, i) =>
          hiddenNodes.map((hid, j) => (
            <line
              key={`ih-${i}-${j}`}
              x1={inp.x + 18} y1={inp.y}
              x2={hid.x - 18} y2={hid.y}
              stroke={getConnectionColor(weights.inputToHidden[i][j])}
              strokeWidth={getConnectionWidth(weights.inputToHidden[i][j])}
              strokeLinecap="round"
            />
          ))
        )}
        {/* Hidden to Output connections */}
        {hiddenNodes.map((hid, i) => (
          <line
            key={`ho-${i}`}
            x1={hid.x + 18} y1={hid.y}
            x2={outputNode.x - 18} y2={outputNode.y}
            stroke={getConnectionColor(weights.hiddenToOutput[i])}
            strokeWidth={getConnectionWidth(weights.hiddenToOutput[i])}
            strokeLinecap="round"
          />
        ))}

        {/* Input nodes */}
        {inputNodes.map((node, i) => (
          <g key={`in-${i}`}>
            <circle cx={node.x} cy={node.y} r={18}
              fill={getNodeColor(inputs[i])} stroke="white" strokeWidth={2} />
            <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle"
              fill="white" fontSize={compact ? 9 : 11} fontWeight="bold">{inputs[i].toFixed(1)}</text>
            <text x={node.x} y={node.y - 26} textAnchor="middle"
              fill="#94a3b8" fontSize={9} fontWeight="bold">Input {i + 1}</text>
          </g>
        ))}

        {/* Hidden nodes */}
        {hiddenNodes.map((node, i) => (
          <g key={`hid-${i}`}>
            <circle cx={node.x} cy={node.y} r={18}
              fill={getNodeColor(hidden[i])} stroke="white" strokeWidth={2} />
            <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle"
              fill="white" fontSize={compact ? 9 : 11} fontWeight="bold">{hidden[i].toFixed(2)}</text>
          </g>
        ))}

        {/* Output node */}
        <g>
          <circle cx={outputNode.x} cy={outputNode.y} r={22}
            fill={getNodeColor(output)} stroke="white" strokeWidth={3} />
          <text x={outputNode.x} y={outputNode.y + 1} textAnchor="middle" dominantBaseline="middle"
            fill="white" fontSize={13} fontWeight="bold">{output.toFixed(2)}</text>
          <text x={outputNode.x} y={outputNode.y - 30} textAnchor="middle"
            fill="#94a3b8" fontSize={9} fontWeight="bold">Output</text>
        </g>
      </svg>

      {/* Weight sliders - shown below the network */}
      {interactive && onWeightChange && (
        <div className="mt-4 space-y-3 max-h-[240px] overflow-y-auto px-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verbindingsgewichten</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {inputNodes.map((_, i) =>
              hiddenNodes.map((_, j) => (
                <div key={`slider-ih-${i}-${j}`} className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-1.5">
                  <span className="text-[10px] text-slate-400 whitespace-nowrap w-16">In{i + 1} &rarr; H{j + 1}</span>
                  <input
                    type="range" min="-2" max="2" step="0.1"
                    value={weights.inputToHidden[i][j]}
                    onChange={e => onWeightChange('ih', i, j, parseFloat(e.target.value))}
                    className="flex-1 h-1.5 accent-indigo-500 cursor-pointer"
                  />
                  <span className={`text-xs font-bold w-10 text-right ${weights.inputToHidden[i][j] >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {weights.inputToHidden[i][j].toFixed(1)}
                  </span>
                </div>
              ))
            )}
            {hiddenNodes.map((_, i) => (
              <div key={`slider-ho-${i}`} className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-1.5">
                <span className="text-[10px] text-slate-400 whitespace-nowrap w-16">H{i + 1} &rarr; Out</span>
                <input
                  type="range" min="-2" max="2" step="0.1"
                  value={weights.hiddenToOutput[i]}
                  onChange={e => onWeightChange('ho', i, 0, parseFloat(e.target.value))}
                  className="flex-1 h-1.5 accent-indigo-500 cursor-pointer"
                />
                <span className={`text-xs font-bold w-10 text-right ${weights.hiddenToOutput[i] >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {weights.hiddenToOutput[i].toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Mission Component ---

export const NeuralNavigatorMission: React.FC<Props> = ({ onBack, onComplete }) => {
  const [phase, setPhase] = useState<'intro' | 'experiment' | 'training' | 'results'>('intro');
  const [weights, setWeights] = useState<Weights>(randomWeights);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [challengeResults, setChallengeResults] = useState<boolean[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingEpoch, setTrainingEpoch] = useState(0);
  const [trainingAccuracy, setTrainingAccuracy] = useState(0);
  const [trainingWeights, setTrainingWeights] = useState<Weights>(randomWeights);
  const trainingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const challenge = CHALLENGES[currentChallenge];
  const { hidden, output } = forwardPass(challenge?.inputs || [0, 0], weights);
  const trainingResult = forwardPass([1, 0], trainingWeights);

  // Cleanup training interval
  useEffect(() => {
    return () => {
      if (trainingRef.current) clearInterval(trainingRef.current);
    };
  }, []);

  const handleWeightChange = useCallback((layer: 'ih' | 'ho', i: number, j: number, value: number) => {
    setWeights(prev => {
      const next = {
        inputToHidden: prev.inputToHidden.map(row => [...row]),
        hiddenToOutput: [...prev.hiddenToOutput],
      };
      if (layer === 'ih') {
        next.inputToHidden[i][j] = value;
      } else {
        next.hiddenToOutput[i] = value;
      }
      return next;
    });
  }, []);

  const checkChallenge = () => {
    const isClose = Math.abs(output - challenge.target) < 0.3;
    setChallengeResults(prev => [...prev, isClose]);

    if (currentChallenge < CHALLENGES.length - 1) {
      setCurrentChallenge(c => c + 1);
      // Reset weights for next challenge
      setWeights(randomWeights());
    } else {
      setPhase('training');
    }
  };

  // Simple training simulation
  const startTraining = () => {
    setIsTraining(true);
    setTrainingEpoch(0);
    setTrainingAccuracy(0);
    const tw = randomWeights();
    setTrainingWeights(tw);

    // Training data: simple OR-gate pattern
    const trainingData = [
      { inputs: [0, 0], target: 0 },
      { inputs: [0, 1], target: 1 },
      { inputs: [1, 0], target: 1 },
      { inputs: [1, 1], target: 1 },
    ];

    let epoch = 0;
    const lr = 0.5;
    let currentWeights = {
      inputToHidden: tw.inputToHidden.map(row => [...row]),
      hiddenToOutput: [...tw.hiddenToOutput],
    };

    trainingRef.current = setInterval(() => {
      epoch++;

      // One training step (simplified gradient descent)
      for (const sample of trainingData) {
        const { hidden: h, output: o } = forwardPass(sample.inputs, currentWeights);
        const error = sample.target - o;
        const outputDelta = error * o * (1 - o);

        // Update hidden-to-output weights
        for (let i = 0; i < 3; i++) {
          currentWeights.hiddenToOutput[i] += lr * outputDelta * h[i];
        }

        // Update input-to-hidden weights
        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < 3; j++) {
            const hiddenDelta = outputDelta * currentWeights.hiddenToOutput[j] * h[j] * (1 - h[j]);
            currentWeights.inputToHidden[i][j] += lr * hiddenDelta * sample.inputs[i];
          }
        }
      }

      // Calculate accuracy
      let correct = 0;
      for (const sample of trainingData) {
        const { output: o } = forwardPass(sample.inputs, currentWeights);
        if (Math.abs(o - sample.target) < 0.3) correct++;
      }
      const acc = (correct / trainingData.length) * 100;

      setTrainingWeights({
        inputToHidden: currentWeights.inputToHidden.map(row => [...row]),
        hiddenToOutput: [...currentWeights.hiddenToOutput],
      });
      setTrainingEpoch(epoch);
      setTrainingAccuracy(acc);

      if (epoch >= 50 || acc >= 100) {
        if (trainingRef.current) clearInterval(trainingRef.current);
        setIsTraining(false);
      }
    }, 200);
  };

  const stopTraining = () => {
    if (trainingRef.current) clearInterval(trainingRef.current);
    setIsTraining(false);
  };

  // --- INTRO PHASE ---
  if (phase === 'intro') {
    const demoResult = forwardPass([1, 0], weights);
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white overflow-y-auto p-4 pb-safe">
        <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white mb-6">
          <ArrowLeft size={18} /> <span className="text-sm font-bold">Terug</span>
        </button>

        <div className="max-w-lg mx-auto text-center space-y-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full animate-pulse" />
            <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl">
              <Brain size={48} className="text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-black">Neural Navigator</h1>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm mx-auto">
            Ontdek hoe een <span className="text-indigo-400 font-bold">neuraal netwerk</span> werkt!
            Dit is het bouwblok achter AI zoals ChatGPT, gezichtsherkenning en zelfrijdende auto's.
          </p>

          {/* Visual explanation */}
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 space-y-4">
            <h3 className="text-sm font-bold text-indigo-400">Hoe werkt het?</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-700/50 rounded-xl p-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold">In</div>
                <p className="text-[10px] text-slate-300 font-bold">Input-laag</p>
                <p className="text-[9px] text-slate-500">Data gaat erin</p>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-3">
                <div className="flex justify-center gap-1 mb-2">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-7 h-7 bg-purple-500 rounded-full flex items-center justify-center text-[9px] font-bold">H</div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-300 font-bold">Verborgen laag</p>
                <p className="text-[9px] text-slate-500">Hier wordt "gedacht"</p>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold">Uit</div>
                <p className="text-[10px] text-slate-300 font-bold">Output-laag</p>
                <p className="text-[9px] text-slate-500">Het antwoord</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              De <span className="text-emerald-400 font-bold">lijnen</span> tussen de knopen hebben <span className="text-indigo-400 font-bold">gewichten</span>.
              Hoe hoger het gewicht, hoe meer invloed die verbinding heeft.
              <span className="text-emerald-400"> Groen = positief</span>,
              <span className="text-red-400"> Rood = negatief</span>.
            </p>
          </div>

          {/* Live network preview */}
          <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/30">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Live Voorbeeld</p>
            <NetworkVisualization
              weights={weights}
              inputs={[1, 0]}
              hidden={demoResult.hidden}
              output={demoResult.output}
              compact
            />
          </div>

          <button
            onClick={() => { setWeights(randomWeights()); setPhase('experiment'); }}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl font-black text-lg hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2"
          >
            <Zap size={20} /> Start Experiment
          </button>
        </div>
      </div>
    );
  }

  // --- EXPERIMENT PHASE ---
  if (phase === 'experiment') {
    const isClose = Math.abs(output - challenge.target) < 0.3;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white overflow-y-auto pb-safe">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={onBack} className="p-2 text-slate-400 hover:text-white"><ArrowLeft size={20} /></button>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Uitdaging {currentChallenge + 1}/{CHALLENGES.length}</span>
              <div className="flex gap-1">
                {CHALLENGES.map((_, i) => (
                  <div key={i} className={`w-8 h-1.5 rounded-full ${i < currentChallenge ? (challengeResults[i] ? 'bg-emerald-500' : 'bg-red-500') : i === currentChallenge ? 'bg-indigo-500' : 'bg-slate-700'}`} />
                ))}
              </div>
            </div>
            <button onClick={() => setWeights(randomWeights())} className="p-2 text-slate-400 hover:text-white" title="Reset gewichten">
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          {/* Challenge description */}
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 text-center">
            <h2 className="text-lg font-black text-white mb-1">{challenge.label}</h2>
            <p className="text-slate-400 text-sm">{challenge.description}</p>
            <div className="flex items-center justify-center gap-6 mt-3">
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Inputs</p>
                <div className="flex gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-lg text-sm font-bold ${challenge.inputs[0] ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                    {challenge.inputs[0]}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-sm font-bold ${challenge.inputs[1] ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                    {challenge.inputs[1]}
                  </span>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-600" />
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Doel</p>
                <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold mt-1 ${challenge.target >= 0.5 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {challenge.target >= 0.5 ? 'HOOG (>0.7)' : 'LAAG (<0.3)'}
                </span>
              </div>
            </div>
          </div>

          {/* Network visualization with sliders */}
          <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/30">
            <NetworkVisualization
              weights={weights}
              inputs={challenge.inputs}
              hidden={hidden}
              output={output}
              interactive
              onWeightChange={handleWeightChange}
            />
          </div>

          {/* Output indicator */}
          <div className={`rounded-2xl p-4 border-2 text-center transition-all ${isClose ? 'bg-emerald-500/10 border-emerald-500' : 'bg-slate-800/50 border-slate-700'}`}>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Huidige Output</p>
            <div className="flex items-center justify-center gap-4">
              <span className={`text-3xl font-black ${isClose ? 'text-emerald-400' : 'text-white'}`}>
                {output.toFixed(3)}
              </span>
              {isClose && <span className="text-emerald-400 text-sm font-bold animate-pulse">Dichtbij het doel!</span>}
            </div>
          </div>

          {/* Submit button */}
          <button
            onClick={checkChallenge}
            className={`w-full py-4 rounded-2xl font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
              isClose
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-105 shadow-xl shadow-emerald-500/30'
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 shadow-xl shadow-indigo-500/30'
            }`}
          >
            {isClose ? 'Correct! ' : 'Controleer '}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // --- TRAINING PHASE ---
  if (phase === 'training') {
    const trainingViz = forwardPass([1, 0], trainingWeights);
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white overflow-y-auto p-4 pb-safe">
        <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white mb-6">
          <ArrowLeft size={18} /> <span className="text-sm font-bold">Terug</span>
        </button>

        <div className="max-w-lg mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black">Bekijk het netwerk trainen!</h2>
            <p className="text-slate-400 text-sm">
              In het echt traint een AI zichzelf. Het netwerk past de gewichten automatisch aan
              tot het de juiste antwoorden geeft. Dit heet <span className="text-indigo-400 font-bold">backpropagation</span>.
            </p>
          </div>

          {/* Training info */}
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
            <p className="text-xs text-slate-400 mb-3 font-bold uppercase tracking-wider">Trainingsdoel: OR-poort leren</p>
            <div className="grid grid-cols-4 gap-2 text-center mb-4">
              {[
                { i: [0, 0], t: 0 },
                { i: [0, 1], t: 1 },
                { i: [1, 0], t: 1 },
                { i: [1, 1], t: 1 },
              ].map(({ i, t }, idx) => (
                <div key={idx} className="bg-slate-700/50 rounded-lg p-2">
                  <p className="text-[10px] text-slate-400">[{i.join(', ')}]</p>
                  <p className={`text-sm font-bold ${t ? 'text-emerald-400' : 'text-red-400'}`}>{t}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Network visualization */}
          <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/30">
            <NetworkVisualization
              weights={trainingWeights}
              inputs={[1, 0]}
              hidden={trainingViz.hidden}
              output={trainingViz.output}
              compact
            />
          </div>

          {/* Training stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700/50">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Epoch</p>
              <p className="text-3xl font-black text-indigo-400">{trainingEpoch}</p>
              <p className="text-[10px] text-slate-500">van 50</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700/50">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Nauwkeurigheid</p>
              <p className={`text-3xl font-black ${trainingAccuracy >= 100 ? 'text-emerald-400' : trainingAccuracy >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                {trainingAccuracy.toFixed(0)}%
              </p>
            </div>
          </div>

          {/* Accuracy bar */}
          <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-300 ${trainingAccuracy >= 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
              style={{ width: `${trainingAccuracy}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            {!isTraining && trainingEpoch === 0 && (
              <button
                onClick={startTraining}
                className="flex-1 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-xl"
              >
                <Play size={20} /> Start Training
              </button>
            )}
            {isTraining && (
              <button
                onClick={stopTraining}
                className="flex-1 py-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-xl"
              >
                <Pause size={20} /> Pauzeer
              </button>
            )}
            {!isTraining && trainingEpoch > 0 && (
              <>
                <button
                  onClick={startTraining}
                  className="flex-1 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-xl"
                >
                  <RotateCcw size={18} /> Opnieuw
                </button>
                <button
                  onClick={() => setPhase('results')}
                  className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-xl"
                >
                  Resultaten <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Explanation text during training */}
          {isTraining && (
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 animate-pulse">
              <div className="flex items-start gap-2">
                <Sparkles size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-indigo-300">
                  Het netwerk berekent steeds opnieuw hoe ver het antwoord afzit van het doel.
                  Dan past het de gewichten een klein beetje aan. Dit herhaalt zich duizenden keren!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- RESULTS PHASE ---
  const correctChallenges = challengeResults.filter(r => r).length;
  const totalScore = Math.round((correctChallenges / CHALLENGES.length) * 100);

  const feedbackConfig = {
    missionTitle: 'Neural Navigator',
    maxScore: 100,
    goldThreshold: 80,
    silverThreshold: 50,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 text-white overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4 pb-safe">
        <div className="max-w-sm w-full space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-black text-white mb-2">Missie Voltooid!</h1>
          </div>

          <MissionFeedbackCard
            score={totalScore}
            config={feedbackConfig}
            whatWentWell={
              correctChallenges >= 3
                ? 'Je begrijpt uitstekend hoe een neuraal netwerk werkt en hoe gewichten de output beinvloeden.'
                : correctChallenges >= 2
                  ? 'Je hebt een goed begrip van hoe gewichten in een neuraal netwerk werken.'
                  : 'Je hebt de eerste stappen gezet in het begrijpen van neurale netwerken.'
            }
            improvementPoint={
              correctChallenges >= 3
                ? 'Probeer nu te bedenken waar je in het dagelijks leven neurale netwerken tegenkomt.'
                : 'Experimenteer meer met de gewichten om te zien hoe ze de output beinvloeden.'
            }
            nextStep="Zoek uit welke apps op je telefoon neurale netwerken gebruiken (denk aan gezichtsherkenning, spraakassistenten)."
          >
            <div className="bg-slate-50 rounded-xl p-4 mt-2">
              <p className="text-slate-600 text-sm font-medium mb-1">Detailscore</p>
              <p className="text-slate-800 text-lg font-bold">{correctChallenges}/{CHALLENGES.length} uitdagingen correct</p>
            </div>
          </MissionFeedbackCard>

          <div className="bg-white/5 rounded-2xl p-4 text-left space-y-2 border border-white/10">
            <p className="text-xs font-bold text-white/80 mb-2">Wat je hebt geleerd:</p>
            <p className="text-xs text-white/60">1. Een neuraal netwerk heeft lagen van knopen (neuronen)</p>
            <p className="text-xs text-white/60">2. Verbindingen hebben gewichten die bepalen hoeveel invloed ze hebben</p>
            <p className="text-xs text-white/60">3. Training past de gewichten automatisch aan tot het netwerk juiste antwoorden geeft</p>
          </div>

          <button
            onClick={() => onComplete(correctChallenges >= 1)}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl font-black text-lg hover:scale-105 transition-transform active:scale-95 shadow-xl flex items-center justify-center gap-2"
          >
            <Trophy size={20} /> Missie Voltooid!
          </button>
        </div>
      </div>
    </div>
  );
};
