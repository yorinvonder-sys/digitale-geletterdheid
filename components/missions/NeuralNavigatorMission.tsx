/**
 * NeuralNavigatorMission.tsx
 *
 * Interactieve neural network visualisatie voor de neural-navigator missie.
 * Leerlingen leren hoe een neuraal netwerk werkt door gewichten aan te passen
 * en te zien hoe dit de output beinvloedt.
 *
 * Didactische opbouw:
 * - Fase 1: Introductie met analogie en visuele uitleg van 1 neuron
 * - Fase 2: Easy challenge (1 gewicht)
 * - Fase 3: Medium challenges (2 gewichten, hint systeem)
 * - Fase 4: Expert challenge (meerdere lagen, open experimentatie)
 * - Fase 5: Training visualisatie
 * - Fase 6: Samenvatting "Wat heb je geleerd?"
 *
 * SLO-doelen: Computationeel denken, AI-begrip, interactief leren
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Trophy, ChevronRight, Play, Pause, RotateCcw, Brain, Sparkles, Zap, Lightbulb, HelpCircle, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import { MissionFeedbackCard } from '../MissionFeedbackCard';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';

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

// Simple single-neuron forward pass for intro/easy challenges
function singleNeuronPass(inputs: number[], weights: number[]): number {
  const sum = inputs.reduce((acc, inp, i) => acc + inp * weights[i], 0);
  return sigmoid(sum);
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

// Challenge definitions with progressive difficulty
interface Challenge {
  difficulty: 'easy' | 'medium' | 'hard';
  inputs: number[];
  target: number;
  label: string;
  description: string;
  context: string; // Why this matters
  hint: string;
  feedbackCorrect: string;
  feedbackIncorrect: string;
  activeWeights: 'single' | 'two' | 'full'; // How many weights the learner controls
}

const CHALLENGES: Challenge[] = [
  {
    difficulty: 'easy',
    inputs: [1, 0],
    target: 1,
    label: 'Eerste neuron: maak het signaal sterk',
    description: 'Pas 1 gewicht aan zodat de output HOOG wordt (groen, boven 0.7)',
    context: 'Dit is hoe gezichtsherkenning begint: een enkel neuron leert reageren op een specifiek patroon, zoals een rand of een kleur.',
    hint: 'Een hoog positief gewicht maakt het signaal sterker. Probeer de slider naar rechts te schuiven!',
    feedbackCorrect: 'Je gewicht versterkt het inputsignaal, waardoor het neuron "vuurt". Precies zo leren echte neuronen in je hersenen ook!',
    feedbackIncorrect: 'Het signaal was nog niet sterk genoeg. Een hoger positief gewicht (bijv. 1.5 of 2.0) zou het signaal sterker maken.',
    activeWeights: 'single',
  },
  {
    difficulty: 'medium',
    inputs: [1, 1],
    target: 1,
    label: 'Twee signalen combineren',
    description: 'Beide inputs zijn AAN. Pas 2 gewichten aan zodat de output HOOG wordt.',
    context: 'Spamfilters combineren meerdere signalen: bevat de mail verdachte woorden EN komt het van een onbekende afzender? Beide signalen samen bepalen het oordeel.',
    hint: 'Als je beide gewichten positief zet, versterken ze elkaar. Dit lijkt op een AND-gate: beide moeten "meedoen" voor een sterk signaal.',
    feedbackCorrect: 'Twee positieve gewichten bij twee actieve inputs geven een extra sterk signaal. Zo combineert een neuraal netwerk meerdere kenmerken tot een beslissing!',
    feedbackIncorrect: 'Probeer beide gewichten positief te zetten. Wanneer twee positieve signalen samenkomen, wordt de output sterker.',
    activeWeights: 'two',
  },
  {
    difficulty: 'medium',
    inputs: [0, 1],
    target: 0,
    label: 'Selectief luisteren',
    description: 'Input 2 is AAN, maar je wilt een LAGE output (rood, onder 0.3). Blokkeer het signaal!',
    context: 'Denk aan noise-cancelling: je wilt sommige signalen bewust onderdrukken. Een negatief gewicht doet precies dat.',
    hint: 'Een negatief gewicht onderdrukt het signaal. Zet het gewicht voor input 2 flink negatief (bijv. -2.0).',
    feedbackCorrect: 'Het negatieve gewicht onderdrukt het signaal van input 2. Dit is "inhibitie" en is cruciaal: zonder rem kan een netwerk niet selectief zijn.',
    feedbackIncorrect: 'Het signaal was nog te sterk. Een negatief gewicht (bijv. -1.5 of -2.0) zou het signaal onderdrukken.',
    activeWeights: 'two',
  },
  {
    difficulty: 'hard',
    inputs: [1, 0],
    target: 1,
    label: 'Het volledige netwerk',
    description: 'Nu heb je het volledige netwerk met een verborgen laag. Pas alle gewichten aan voor een HOGE output.',
    context: 'Echte AI-systemen zoals ChatGPT hebben miljoenen van deze lagen. Het principe is hetzelfde: signalen worden doorgegeven en getransformeerd, laag voor laag.',
    hint: 'Focus op de verbindingen van Input 1 naar de verborgen laag (positief), en dan van de verborgen laag naar de output (ook positief). Maak een "pad" van sterk signaal.',
    feedbackCorrect: 'Je hebt een pad van sterk signaal gecreeerd door het netwerk heen. Dit is precies hoe deep learning werkt: informatie stroomt door meerdere lagen, waarbij elke laag het signaal transformeert!',
    feedbackIncorrect: 'In een meerlagig netwerk moet het signaal door meerdere verbindingen reizen. Probeer een "pad" te maken: Input 1 sterk naar een hidden neuron, en dat hidden neuron sterk naar de output.',
    activeWeights: 'full',
  },
];

// --- Single Neuron Visualization (for intro + easy challenges) ---

interface SingleNeuronVizProps {
  inputs: number[];
  weights: number[];
  output: number;
  onWeightChange?: (index: number, value: number) => void;
  activeCount: number; // How many weights are interactive
  showLabels?: boolean;
}

const SingleNeuronVisualization: React.FC<SingleNeuronVizProps> = ({
  inputs, weights, output, onWeightChange, activeCount, showLabels = true,
}) => {
  const svgWidth = 340;
  const svgHeight = 200;

  const inputNodes = [
    { x: 60, y: svgHeight * 0.33, label: `Input 1: ${inputs[0]}` },
    { x: 60, y: svgHeight * 0.67, label: `Input 2: ${inputs[1]}` },
  ];
  const neuronNode = { x: svgWidth / 2 + 20, y: svgHeight * 0.5 };
  const outputNode = { x: svgWidth - 50, y: svgHeight * 0.5 };

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
        {/* Connections from inputs to neuron */}
        {inputNodes.map((inp, i) => (
          <g key={`conn-${i}`}>
            <line
              x1={inp.x + 18} y1={inp.y}
              x2={neuronNode.x - 22} y2={neuronNode.y}
              stroke={getConnectionColor(weights[i])}
              strokeWidth={getConnectionWidth(weights[i])}
              strokeLinecap="round"
            />
            {/* Weight label on connection */}
            {showLabels && (
              <text
                x={(inp.x + 18 + neuronNode.x - 22) / 2}
                y={i === 0 ? (inp.y + neuronNode.y) / 2 - 8 : (inp.y + neuronNode.y) / 2 + 14}
                textAnchor="middle"
                fill={weights[i] >= 0 ? '#10B981' : '#EF4444'}
                fontSize={10}
                fontWeight="bold"
              >
                w={weights[i].toFixed(1)}
              </text>
            )}
          </g>
        ))}

        {/* Connection from neuron to output */}
        <line
          x1={neuronNode.x + 22} y1={neuronNode.y}
          x2={outputNode.x - 18} y2={outputNode.y}
          stroke="#6B6B66"
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray="4 4"
        />

        {/* Input nodes */}
        {inputNodes.map((node, i) => (
          <g key={`in-${i}`}>
            <circle cx={node.x} cy={node.y} r={18}
              fill={getNodeColor(inputs[i])} stroke="white" strokeWidth={2} />
            <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle"
              fill="white" fontSize={11} fontWeight="bold">{inputs[i]}</text>
            <text x={node.x} y={node.y - 26} textAnchor="middle"
              fill="#6B6B66" fontSize={9} fontWeight="bold">Input {i + 1}</text>
          </g>
        ))}

        {/* Neuron node */}
        <circle cx={neuronNode.x} cy={neuronNode.y} r={22}
          fill={getNodeColor(output)} stroke="white" strokeWidth={3} />
        <text x={neuronNode.x} y={neuronNode.y + 1} textAnchor="middle" dominantBaseline="middle"
          fill="white" fontSize={12} fontWeight="bold">{output.toFixed(2)}</text>
        <text x={neuronNode.x} y={neuronNode.y - 30} textAnchor="middle"
          fill="#6B6B66" fontSize={9} fontWeight="bold">Neuron</text>

        {/* Output display */}
        <text x={outputNode.x} y={outputNode.y - 12} textAnchor="middle"
          fill="#6B6B66" fontSize={9} fontWeight="bold">Output</text>
        <text x={outputNode.x} y={outputNode.y + 6} textAnchor="middle"
          fill={output > 0.5 ? '#10B981' : '#EF4444'} fontSize={16} fontWeight="bold">{output.toFixed(2)}</text>
      </svg>

      {/* Weight sliders */}
      {onWeightChange && (
        <div className="mt-3 space-y-2 px-2">
          <p className="text-xs font-bold text-[#6B6B66] uppercase tracking-wider">Gewichten aanpassen</p>
          {weights.slice(0, activeCount).map((w, i) => (
            <div key={`slider-${i}`} className="flex items-center gap-2 bg-[#FAF9F0] rounded-lg px-3 py-2 border border-[#F0EEE8]">
              <span className="text-[10px] text-[#6B6B66] whitespace-nowrap w-20">Input {i + 1} &rarr; Neuron</span>
              <input
                type="range" min="-2" max="2" step="0.1"
                value={w}
                onChange={e => onWeightChange(i, parseFloat(e.target.value))}
                className="flex-1 h-2 accent-[#D97757] cursor-pointer"
              />
              <span className={`text-xs font-bold w-10 text-right ${w >= 0 ? 'text-[#10B981]' : 'text-red-500'}`}>
                {w.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Full Network Visualization Component (reused from original) ---

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
              fill="#6B6B66" fontSize={9} fontWeight="bold">Input {i + 1}</text>
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
            fill="#6B6B66" fontSize={9} fontWeight="bold">Output</text>
        </g>
      </svg>

      {/* Weight sliders - shown below the network */}
      {interactive && onWeightChange && (
        <div className="mt-4 space-y-3 max-h-[360px] overflow-y-auto px-2">
          <p className="text-xs font-bold text-[#6B6B66] uppercase tracking-wider">Verbindingsgewichten</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {inputNodes.map((_, i) =>
              hiddenNodes.map((_, j) => (
                <div key={`slider-ih-${i}-${j}`} className="flex items-center gap-2 bg-[#FAF9F0] rounded-lg px-3 py-1.5 border border-[#F0EEE8]">
                  <span className="text-[10px] text-[#6B6B66] whitespace-nowrap w-16">In{i + 1} &rarr; H{j + 1}</span>
                  <input
                    type="range" min="-2" max="2" step="0.1"
                    value={weights.inputToHidden[i][j]}
                    onChange={e => onWeightChange('ih', i, j, parseFloat(e.target.value))}
                    className="flex-1 h-1.5 accent-[#D97757] cursor-pointer"
                  />
                  <span className={`text-xs font-bold w-10 text-right ${weights.inputToHidden[i][j] >= 0 ? 'text-[#10B981]' : 'text-red-500'}`}>
                    {weights.inputToHidden[i][j].toFixed(1)}
                  </span>
                </div>
              ))
            )}
            {hiddenNodes.map((_, i) => (
              <div key={`slider-ho-${i}`} className="flex items-center gap-2 bg-[#FAF9F0] rounded-lg px-3 py-1.5 border border-[#F0EEE8]">
                <span className="text-[10px] text-[#6B6B66] whitespace-nowrap w-16">H{i + 1} &rarr; Out</span>
                <input
                  type="range" min="-2" max="2" step="0.1"
                  value={weights.hiddenToOutput[i]}
                  onChange={e => onWeightChange('ho', i, 0, parseFloat(e.target.value))}
                  className="flex-1 h-1.5 accent-[#D97757] cursor-pointer"
                />
                <span className={`text-xs font-bold w-10 text-right ${weights.hiddenToOutput[i] >= 0 ? 'text-[#10B981]' : 'text-red-500'}`}>
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

interface NeuralNavigatorState {
  phase: 'intro' | 'experiment' | 'training' | 'results';
  weights: Weights;
  simpleWeights: number[]; // For single-neuron challenges
  currentChallenge: number;
  challengeResults: boolean[];
  showFeedback: boolean; // Show feedback after checking
  lastFeedbackCorrect: boolean;
  showHint: boolean;
}

export const NeuralNavigatorMission: React.FC<Props> = ({ onBack, onComplete }) => {
  const { state: saved, setState: setSaved, clearSave } = useMissionAutoSave<NeuralNavigatorState>(
    'neural-navigator',
    {
      phase: 'intro',
      weights: randomWeights(),
      simpleWeights: [0.5, 0.5],
      currentChallenge: 0,
      challengeResults: [],
      showFeedback: false,
      lastFeedbackCorrect: false,
      showHint: false,
    }
  );
  const phase = saved.phase;
  const weights = saved.weights;
  const simpleWeights = saved.simpleWeights;
  const currentChallenge = saved.currentChallenge;
  const challengeResults = saved.challengeResults;
  const showFeedback = saved.showFeedback;
  const lastFeedbackCorrect = saved.lastFeedbackCorrect;
  const showHint = saved.showHint;

  const setPhase = (p: NeuralNavigatorState['phase']) => setSaved(prev => ({ ...prev, phase: p }));
  const setWeights = (updater: React.SetStateAction<Weights>) => setSaved(prev => ({
    ...prev,
    weights: typeof updater === 'function' ? updater(prev.weights) : updater,
  }));
  const setSimpleWeights = (updater: React.SetStateAction<number[]>) => setSaved(prev => ({
    ...prev,
    simpleWeights: typeof updater === 'function' ? updater(prev.simpleWeights) : updater,
  }));
  const setCurrentChallenge = (updater: React.SetStateAction<number>) => setSaved(prev => ({
    ...prev,
    currentChallenge: typeof updater === 'function' ? updater(prev.currentChallenge) : updater,
  }));
  const setChallengeResults = (updater: React.SetStateAction<boolean[]>) => setSaved(prev => ({
    ...prev,
    challengeResults: typeof updater === 'function' ? updater(prev.challengeResults) : updater,
  }));
  const setShowFeedback = (v: boolean) => setSaved(prev => ({ ...prev, showFeedback: v }));
  const setLastFeedbackCorrect = (v: boolean) => setSaved(prev => ({ ...prev, lastFeedbackCorrect: v }));
  const setShowHint = (v: boolean) => setSaved(prev => ({ ...prev, showHint: v }));

  const [isTraining, setIsTraining] = useState(false);
  const [trainingEpoch, setTrainingEpoch] = useState(0);
  const [trainingAccuracy, setTrainingAccuracy] = useState(0);
  const [trainingWeights, setTrainingWeights] = useState<Weights>(randomWeights);
  const trainingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [introStep, setIntroStep] = useState(0); // Track intro sub-steps

  const challenge = CHALLENGES[currentChallenge];

  // Calculate output based on challenge type
  const isFullNetwork = challenge?.activeWeights === 'full';
  const currentOutput = isFullNetwork
    ? forwardPass(challenge?.inputs || [0, 0], weights)
    : { hidden: [0, 0, 0], output: singleNeuronPass(challenge?.inputs || [0, 0], simpleWeights) };

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

  const handleSimpleWeightChange = useCallback((index: number, value: number) => {
    setSimpleWeights(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const checkChallenge = () => {
    const output = currentOutput.output;
    const isClose = challenge.target >= 0.5
      ? output > 0.7
      : output < 0.3;
    setLastFeedbackCorrect(isClose);
    setChallengeResults(prev => [...prev, isClose]);
    setShowFeedback(true);
  };

  const nextChallenge = () => {
    setShowFeedback(false);
    setShowHint(false);
    if (currentChallenge < CHALLENGES.length - 1) {
      setCurrentChallenge(c => c + 1);
      setSimpleWeights([0.5, 0.5]);
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

      for (const sample of trainingData) {
        const { hidden: h, output: o } = forwardPass(sample.inputs, currentWeights);
        const error = sample.target - o;
        const outputDelta = error * o * (1 - o);

        for (let i = 0; i < 3; i++) {
          currentWeights.hiddenToOutput[i] += lr * outputDelta * h[i];
        }

        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < 3; j++) {
            const hiddenDelta = outputDelta * currentWeights.hiddenToOutput[j] * h[j] * (1 - h[j]);
            currentWeights.inputToHidden[i][j] += lr * hiddenDelta * sample.inputs[i];
          }
        }
      }

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
    return (
      <div className="min-h-screen bg-[#FAF9F0] overflow-y-auto p-4 pb-safe" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
        <button onClick={onBack} className="flex items-center gap-2 text-[#6B6B66] hover:text-[#1A1A19] transition-all duration-300 mb-6">
          <ArrowLeft size={18} /> <span className="text-sm font-bold">Terug</span>
        </button>

        <div className="max-w-lg mx-auto text-center space-y-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-[#D97757]/20 blur-3xl rounded-full animate-pulse" />
            <div className="relative bg-gradient-to-br from-[#D97757] to-[#C46849] w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl">
              <Brain size={48} className="text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-black text-[#1A1A19]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Neural Navigator</h1>
          <p className="text-[#3D3D38] text-sm leading-relaxed max-w-sm mx-auto">
            Ontdek hoe een <span className="text-[#D97757] font-bold">neuraal netwerk</span> werkt!
            Dit is het bouwblok achter AI zoals ChatGPT, gezichtsherkenning en zelfrijdende auto's.
          </p>

          {/* Step 1: Analogy */}
          {introStep >= 0 && (
            <div className="bg-white rounded-2xl p-5 border border-[#E8E6DF] text-left space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#D97757]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lightbulb size={16} className="text-[#D97757]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#D97757]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Wat is een neuron?</h3>
                  <p className="text-xs text-[#3D3D38] mt-1 leading-relaxed">
                    Stel je voor dat je een <span className="font-bold">recept</span> maakt.
                    Je hebt ingredienten (inputs) en je bepaalt <span className="font-bold">hoeveel</span> je van elk gebruikt (gewichten).
                    Te veel zout? Pas het gewicht aan! Een neuron doet precies hetzelfde: het ontvangt signalen,
                    vermenigvuldigt ze met gewichten, en geeft een resultaat.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Visual explanation of a single neuron */}
          {introStep >= 1 && (
            <div className="bg-white rounded-2xl p-4 border border-[#E8E6DF] space-y-3">
              <h3 className="text-sm font-bold text-[#2A9D8F]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Zo werkt 1 neuron</h3>
              <SingleNeuronVisualization
                inputs={[1, 0]}
                weights={[1.5, -0.5]}
                output={singleNeuronPass([1, 0], [1.5, -0.5])}
                activeCount={0}
              />
              <div className="bg-[#FAF9F0] rounded-xl p-3 text-left">
                <p className="text-[11px] text-[#3D3D38] leading-relaxed">
                  <span className="font-bold text-[#10B981]">Input 1 = 1</span> wordt vermenigvuldigd met
                  <span className="font-bold text-[#10B981]"> gewicht 1.5</span> = 1.5 (sterk signaal)<br />
                  <span className="font-bold text-[#EF4444]">Input 2 = 0</span> wordt vermenigvuldigd met
                  <span className="font-bold text-[#EF4444]"> gewicht -0.5</span> = 0.0 (geen effect)<br />
                  Totaal: 1.5 → door de <span className="font-bold">sigmoid functie</span> → <span className="font-bold text-[#10B981]">0.82</span> (hoog!)
                </p>
              </div>
              <p className="text-[10px] text-[#6B6B66] italic">
                De sigmoid functie "drukt" elke waarde tussen 0 en 1. Hoge waarden worden bijna 1, lage waarden bijna 0.
              </p>
            </div>
          )}

          {/* Step 3: From neuron to network */}
          {introStep >= 2 && (
            <div className="bg-white rounded-2xl p-4 border border-[#E8E6DF] space-y-4">
              <h3 className="text-sm font-bold text-[#8B6F9E]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Van neuron naar netwerk</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#FAF9F0] rounded-xl p-3">
                  <div className="w-10 h-10 bg-[#2A9D8F] rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold text-white">In</div>
                  <p className="text-[10px] text-[#1A1A19] font-bold">Input-laag</p>
                  <p className="text-[9px] text-[#6B6B66]">Data gaat erin</p>
                </div>
                <div className="bg-[#FAF9F0] rounded-xl p-3">
                  <div className="flex justify-center gap-1 mb-2">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-7 h-7 bg-[#8B6F9E] rounded-full flex items-center justify-center text-[9px] font-bold text-white">H</div>
                    ))}
                  </div>
                  <p className="text-[10px] text-[#1A1A19] font-bold">Verborgen laag</p>
                  <p className="text-[9px] text-[#6B6B66]">Hier wordt "gedacht"</p>
                </div>
                <div className="bg-[#FAF9F0] rounded-xl p-3">
                  <div className="w-10 h-10 bg-[#10B981] rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold text-white">Uit</div>
                  <p className="text-[10px] text-[#1A1A19] font-bold">Output-laag</p>
                  <p className="text-[9px] text-[#6B6B66]">Het antwoord</p>
                </div>
              </div>
              <p className="text-[11px] text-[#6B6B66] text-left">
                Neurale netwerken worden overal gebruikt:
                <span className="font-bold text-[#3D3D38]"> gezichtsherkenning</span> (je telefoon ontgrendelen),
                <span className="font-bold text-[#3D3D38]"> taalvertaling</span> (Google Translate),
                <span className="font-bold text-[#3D3D38]"> aanbevelingen</span> (Netflix, Spotify).
                Je gaat nu zelf ontdekken hoe ze werken!
              </p>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3">
            {introStep > 0 && (
              <button
                onClick={() => setIntroStep(s => s - 1)}
                className="flex-1 py-3 bg-white border-2 border-[#E8E6DF] rounded-full font-bold text-sm text-[#6B6B66] hover:border-[#D97757] transition-all duration-300"
              >
                Vorige
              </button>
            )}
            {introStep < 2 ? (
              <button
                onClick={() => setIntroStep(s => s + 1)}
                className="flex-1 py-4 bg-[#D97757] hover:bg-[#C46849] rounded-full font-black text-lg text-white hover:scale-105 transition-all duration-300 active:scale-95 shadow-xl shadow-[#D97757]/30 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#D97757]"
              >
                Volgende <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={() => {
                  setSimpleWeights([0.5, 0.5]);
                  setWeights(randomWeights());
                  setPhase('experiment');
                }}
                className="flex-1 py-4 bg-[#D97757] hover:bg-[#C46849] rounded-full font-black text-lg text-white hover:scale-105 transition-all duration-300 active:scale-95 shadow-xl shadow-[#D97757]/30 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#D97757]"
              >
                <Zap size={20} /> Start Experiment
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- EXPERIMENT PHASE ---
  if (phase === 'experiment') {
    const output = currentOutput.output;
    const isClose = challenge.target >= 0.5
      ? output > 0.7
      : output < 0.3;

    const difficultyLabel = challenge.difficulty === 'easy' ? 'Basis' : challenge.difficulty === 'medium' ? 'Gemiddeld' : 'Expert';
    const difficultyColor = challenge.difficulty === 'easy' ? 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30' : challenge.difficulty === 'medium' ? 'text-[#D97757] bg-[#D97757]/10 border-[#D97757]/30' : 'text-[#8B6F9E] bg-[#8B6F9E]/10 border-[#8B6F9E]/30';

    return (
      <div className="min-h-screen bg-[#FAF9F0] overflow-y-auto pb-safe" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#E8E6DF]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={onBack} className="p-2 text-[#6B6B66] hover:text-[#1A1A19] transition-all duration-300"><ArrowLeft size={20} /></button>
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${difficultyColor}`}>{difficultyLabel}</span>
              <span className="text-xs font-bold text-[#D97757] uppercase tracking-wider">Uitdaging {currentChallenge + 1}/{CHALLENGES.length}</span>
              <div className="flex gap-1">
                {CHALLENGES.map((_, i) => (
                  <div key={i} className={`w-8 h-1.5 rounded-full ${i < currentChallenge ? (challengeResults[i] ? 'bg-[#10B981]' : 'bg-red-500') : i === currentChallenge ? 'bg-[#D97757]' : 'bg-[#E8E6DF]'}`} />
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                if (isFullNetwork) {
                  setWeights(randomWeights());
                } else {
                  setSimpleWeights([0.5, 0.5]);
                }
              }}
              className="p-2 text-[#6B6B66] hover:text-[#1A1A19] transition-all duration-300"
              title="Reset gewichten"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          {/* Challenge description */}
          <div className="bg-white rounded-2xl p-4 border border-[#E8E6DF]">
            <h2 className="text-lg font-black text-[#1A1A19] mb-1 text-center" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>{challenge.label}</h2>
            <p className="text-[#6B6B66] text-sm text-center">{challenge.description}</p>

            {/* Context: why does this matter? */}
            <div className="mt-3 bg-[#FAF9F0] rounded-xl p-3 border border-[#F0EEE8]">
              <div className="flex items-start gap-2">
                <BookOpen size={14} className="text-[#2A9D8F] mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-[#3D3D38] leading-relaxed">{challenge.context}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-3">
              <div className="text-center">
                <p className="text-[10px] text-[#6B6B66] uppercase tracking-wider font-bold">Inputs</p>
                <div className="flex gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold border inline-flex ${challenge.inputs[0] ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' : 'bg-[#FAF9F0] text-[#6B6B66] border-[#E8E6DF]'}`}>
                    {challenge.inputs[0]}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold border inline-flex ${challenge.inputs[1] ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' : 'bg-[#FAF9F0] text-[#6B6B66] border-[#E8E6DF]'}`}>
                    {challenge.inputs[1]}
                  </span>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#E8E6DF]" />
              <div className="text-center">
                <p className="text-[10px] text-[#6B6B66] uppercase tracking-wider font-bold">Doel</p>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold mt-1 border ${challenge.target >= 0.5 ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}>
                  {challenge.target >= 0.5 ? 'HOOG (>0.7)' : 'LAAG (<0.3)'}
                </span>
              </div>
            </div>
          </div>

          {/* Network visualization with sliders */}
          <div className="bg-white rounded-2xl p-4 border border-[#F0EEE8]">
            {isFullNetwork ? (
              <NetworkVisualization
                weights={weights}
                inputs={challenge.inputs}
                hidden={currentOutput.hidden}
                output={output}
                interactive
                onWeightChange={handleWeightChange}
              />
            ) : (
              <SingleNeuronVisualization
                inputs={challenge.inputs}
                weights={simpleWeights}
                output={output}
                onWeightChange={handleSimpleWeightChange}
                activeCount={challenge.activeWeights === 'single' ? 1 : 2}
              />
            )}
          </div>

          {/* Live output indicator */}
          <div className={`rounded-2xl p-4 border-2 text-center transition-all duration-300 ${isClose ? 'bg-[#10B981]/10 border-[#10B981]' : 'bg-white border-[#E8E6DF]'}`}>
            <p className="text-[10px] text-[#6B6B66] uppercase tracking-wider font-bold mb-1">Huidige Output</p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex-1 max-w-[200px]">
                <div className="w-full bg-[#F0EEE8] rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-200 ${output > 0.7 ? 'bg-[#10B981]' : output < 0.3 ? 'bg-red-500' : 'bg-[#D97757]'}`}
                    style={{ width: `${output * 100}%` }}
                  />
                </div>
              </div>
              <span className={`text-3xl font-black ${isClose ? 'text-[#10B981]' : 'text-[#1A1A19]'}`}>
                {output.toFixed(3)}
              </span>
              {isClose && <span className="text-[#10B981] text-sm font-bold animate-pulse">Doel bereikt!</span>}
            </div>
          </div>

          {/* Hint button */}
          {!showFeedback && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 mx-auto text-sm text-[#6B6B66] hover:text-[#D97757] transition-all duration-300"
            >
              <HelpCircle size={16} />
              {showHint ? 'Verberg hint' : 'Ik zit vast — toon hint'}
            </button>
          )}

          {/* Hint display */}
          {showHint && !showFeedback && (
            <div className="bg-[#D97757]/10 border border-[#D97757]/20 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Lightbulb size={16} className="text-[#D97757] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#3D3D38]">{challenge.hint}</p>
              </div>
            </div>
          )}

          {/* Feedback after checking */}
          {showFeedback && (
            <div className={`rounded-2xl p-4 border-2 ${lastFeedbackCorrect ? 'bg-[#10B981]/10 border-[#10B981]/30' : 'bg-red-500/5 border-red-500/20'}`}>
              <div className="flex items-start gap-3">
                {lastFeedbackCorrect ? (
                  <CheckCircle size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <h3 className={`text-sm font-bold ${lastFeedbackCorrect ? 'text-[#10B981]' : 'text-red-500'}`}>
                    {lastFeedbackCorrect ? 'Goed gedaan!' : 'Nog niet helemaal'}
                  </h3>
                  <p className="text-sm text-[#3D3D38] mt-1">
                    {lastFeedbackCorrect ? challenge.feedbackCorrect : challenge.feedbackIncorrect}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action button */}
          {!showFeedback ? (
            <button
              onClick={checkChallenge}
              className={`w-full py-4 rounded-full font-black text-lg text-white transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#D97757] ${
                isClose
                  ? 'bg-[#10B981] hover:bg-[#059669] hover:scale-105 shadow-xl shadow-[#10B981]/30'
                  : 'bg-[#D97757] hover:bg-[#C46849] hover:scale-105 shadow-xl shadow-[#D97757]/30'
              }`}
            >
              Controleer <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={nextChallenge}
              className="w-full py-4 bg-[#D97757] hover:bg-[#C46849] rounded-full font-black text-lg text-white hover:scale-105 transition-all duration-300 active:scale-95 shadow-xl shadow-[#D97757]/30 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#D97757]"
            >
              {currentChallenge < CHALLENGES.length - 1 ? (
                <>Volgende uitdaging <ChevronRight size={20} /></>
              ) : (
                <>Bekijk hoe AI traint <ChevronRight size={20} /></>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- TRAINING PHASE ---
  if (phase === 'training') {
    const trainingViz = forwardPass([1, 0], trainingWeights);
    return (
      <div className="min-h-screen bg-[#FAF9F0] overflow-y-auto p-4 pb-safe" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
        <button onClick={onBack} className="flex items-center gap-2 text-[#6B6B66] hover:text-[#1A1A19] transition-all duration-300 mb-6">
          <ArrowLeft size={18} /> <span className="text-sm font-bold">Terug</span>
        </button>

        <div className="max-w-lg mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-[#1A1A19]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Bekijk het netwerk trainen!</h2>
            <p className="text-[#3D3D38] text-sm">
              Jij paste de gewichten handmatig aan. In het echt doet een AI dat <span className="text-[#D97757] font-bold">automatisch</span>.
              Het netwerk berekent hoe ver het ernaast zit en past de gewichten een beetje aan. Dit herhaalt zich duizenden keren.
              Dit heet <span className="text-[#D97757] font-bold">backpropagation</span>.
            </p>
          </div>

          {/* Training info */}
          <div className="bg-white rounded-2xl p-4 border border-[#E8E6DF]">
            <p className="text-xs text-[#6B6B66] mb-3 font-bold uppercase tracking-wider">Trainingsdoel: OR-poort leren</p>
            <p className="text-[11px] text-[#3D3D38] mb-3">Het netwerk moet leren: "als minstens 1 input AAN is, geef output 1"</p>
            <div className="grid grid-cols-4 gap-2 text-center mb-4">
              {[
                { i: [0, 0], t: 0 },
                { i: [0, 1], t: 1 },
                { i: [1, 0], t: 1 },
                { i: [1, 1], t: 1 },
              ].map(({ i, t }, idx) => (
                <div key={idx} className="bg-[#FAF9F0] rounded-lg p-2 border border-[#F0EEE8]">
                  <p className="text-[10px] text-[#6B6B66]">[{i.join(', ')}]</p>
                  <p className={`text-sm font-bold ${t ? 'text-[#10B981]' : 'text-red-500'}`}>{t}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Network visualization */}
          <div className="bg-white rounded-2xl p-4 border border-[#F0EEE8]">
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
            <div className="bg-white rounded-xl p-4 text-center border border-[#E8E6DF]">
              <p className="text-[10px] text-[#6B6B66] uppercase tracking-wider font-bold">Epoch</p>
              <p className="text-3xl font-black text-[#D97757]">{trainingEpoch}</p>
              <p className="text-[10px] text-[#6B6B66]">van 50</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-[#E8E6DF]">
              <p className="text-[10px] text-[#6B6B66] uppercase tracking-wider font-bold">Nauwkeurigheid</p>
              <p className={`text-3xl font-black ${trainingAccuracy >= 100 ? 'text-[#10B981]' : trainingAccuracy >= 50 ? 'text-[#D97757]' : 'text-red-500'}`}>
                {trainingAccuracy.toFixed(0)}%
              </p>
            </div>
          </div>

          {/* Accuracy bar */}
          <div className="w-full bg-[#F0EEE8] rounded-full h-4 overflow-hidden border border-[#E8E6DF]">
            <div
              className={`h-full rounded-full transition-all duration-300 ${trainingAccuracy >= 100 ? 'bg-[#10B981]' : 'bg-gradient-to-r from-[#D97757] to-[#C46849]'}`}
              style={{ width: `${trainingAccuracy}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            {!isTraining && trainingEpoch === 0 && (
              <button
                onClick={startTraining}
                className="flex-1 py-4 bg-[#D97757] hover:bg-[#C46849] rounded-full font-black text-lg text-white flex items-center justify-center gap-2 hover:scale-105 transition-all duration-300 active:scale-95 shadow-xl focus-visible:ring-2 focus-visible:ring-[#D97757]"
              >
                <Play size={20} /> Start Training
              </button>
            )}
            {isTraining && (
              <button
                onClick={stopTraining}
                className="flex-1 py-4 bg-red-500 hover:bg-red-600 rounded-full font-black text-lg text-white flex items-center justify-center gap-2 hover:scale-105 transition-all duration-300 active:scale-95 shadow-xl"
              >
                <Pause size={20} /> Pauzeer
              </button>
            )}
            {!isTraining && trainingEpoch > 0 && (
              <>
                <button
                  onClick={startTraining}
                  className="flex-1 py-4 bg-[#D97757] hover:bg-[#C46849] rounded-full font-black text-white flex items-center justify-center gap-2 hover:scale-105 transition-all duration-300 active:scale-95 shadow-xl focus-visible:ring-2 focus-visible:ring-[#D97757]"
                >
                  <RotateCcw size={18} /> Opnieuw
                </button>
                <button
                  onClick={() => setPhase('results')}
                  className="flex-1 py-4 bg-[#10B981] hover:bg-[#059669] rounded-full font-black text-white flex items-center justify-center gap-2 hover:scale-105 transition-all duration-300 active:scale-95 shadow-xl"
                >
                  Resultaten <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Explanation text during training */}
          {isTraining && (
            <div className="bg-[#D97757]/10 border border-[#D97757]/20 rounded-xl p-4 animate-pulse">
              <div className="flex items-start gap-2">
                <Sparkles size={16} className="text-[#D97757] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#3D3D38]">
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

  // Learning summary items with check marks
  const learningSummary = [
    { learned: true, text: 'Een neuron ontvangt signalen, vermenigvuldigt ze met gewichten, en geeft een output.' },
    { learned: correctChallenges >= 1, text: 'Een positief gewicht versterkt een signaal, een negatief gewicht onderdrukt het.' },
    { learned: correctChallenges >= 2, text: 'Door meerdere gewichten te combineren kun je complexere patronen herkennen.' },
    { learned: correctChallenges >= 3, text: 'Een netwerk met meerdere lagen kan signalen stap voor stap transformeren.' },
    { learned: true, text: 'Training past gewichten automatisch aan via backpropagation.' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F0] overflow-y-auto" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
      <div className="min-h-full flex items-center justify-center p-4 pb-safe">
        <div className="max-w-sm w-full space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-black text-[#1A1A19] mb-2" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Missie Voltooid!</h1>
          </div>

          <MissionFeedbackCard
            score={totalScore}
            config={feedbackConfig}
            whatWentWell={
              correctChallenges >= 4
                ? 'Je begrijpt uitstekend hoe een neuraal netwerk werkt: van een enkel neuron tot een meerlagig netwerk.'
                : correctChallenges >= 3
                  ? 'Je hebt goed begrepen hoe gewichten signalen versterken en onderdrukken.'
                  : correctChallenges >= 2
                    ? 'Je hebt een goed begrip van hoe individuele gewichten werken.'
                    : 'Je hebt de eerste stappen gezet in het begrijpen van neurale netwerken.'
            }
            improvementPoint={
              correctChallenges >= 4
                ? 'Probeer nu te bedenken waar je in het dagelijks leven neurale netwerken tegenkomt.'
                : correctChallenges >= 2
                  ? 'Het combineren van meerdere gewichten is lastig. Probeer de missie nog eens om het beter te begrijpen.'
                  : 'Experimenteer meer met de gewichten. Onthoud: positief = versterken, negatief = onderdrukken.'
            }
            nextStep="Zoek uit welke apps op je telefoon neurale netwerken gebruiken (denk aan gezichtsherkenning, spraakassistenten, autocomplete)."
          >
            <div className="bg-[#FAF9F0] rounded-xl p-4 mt-2 border border-[#F0EEE8]">
              <p className="text-[#6B6B66] text-sm font-medium mb-1">Detailscore</p>
              <p className="text-[#1A1A19] text-lg font-bold">{correctChallenges}/{CHALLENGES.length} uitdagingen correct</p>
              <div className="flex gap-1 mt-2">
                {challengeResults.map((r, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className={`text-[10px] font-bold ${r ? 'text-[#10B981]' : 'text-red-500'}`}>
                      {CHALLENGES[i]?.difficulty === 'easy' ? 'Basis' : CHALLENGES[i]?.difficulty === 'medium' ? 'Gem.' : 'Expert'}
                    </span>
                    {r ? <CheckCircle size={12} className="text-[#10B981]" /> : <XCircle size={12} className="text-red-500" />}
                  </div>
                ))}
              </div>
            </div>
          </MissionFeedbackCard>

          {/* What you learned - comprehensive summary */}
          <div className="bg-white rounded-2xl p-4 text-left space-y-3 border border-[#E8E6DF]">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-[#2A9D8F]" />
              <p className="text-xs font-bold text-[#1A1A19]">Wat je hebt geleerd</p>
            </div>
            {learningSummary.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                {item.learned ? (
                  <CheckCircle size={14} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-[#E8E6DF] mt-0.5 flex-shrink-0" />
                )}
                <p className={`text-xs ${item.learned ? 'text-[#3D3D38]' : 'text-[#6B6B66]'}`}>{item.text}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => { clearSave(); onComplete(correctChallenges >= 1); }}
            className="w-full py-4 bg-[#D97757] hover:bg-[#C46849] rounded-full font-black text-lg text-white hover:scale-105 transition-all duration-300 active:scale-95 shadow-xl shadow-[#D97757]/30 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#D97757]"
          >
            <Trophy size={20} /> Missie Voltooid!
          </button>
        </div>
      </div>
    </div>
  );
};
