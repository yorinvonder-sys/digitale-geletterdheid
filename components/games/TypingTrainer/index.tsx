import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Clock, Keyboard, RefreshCw, Trophy } from 'lucide-react';

interface TypingTrainerProps {
  onExit: () => void;
  onXPEarned?: (amount: number, label: string) => void;
}

type Mode = 'menu' | 'countdown' | 'playing' | 'results';

const PROMPTS: string[] = [
  'De snelle vos springt over de luie hond.',
  'Oefenen maakt beter: type rustig en precies.',
  'Digitale geletterdheid is een superkracht.',
  'Korte pauze? Schud je handen los en ga door.',
  'Typen is net als sporten: herhaling geeft groei.',
  'Blijf gefocust: kijk naar het scherm, niet naar het toetsenbord.',
  'Nauwkeurig typen voorkomt fouten in je werk.',
  'Vandaag leer ik iets nieuws en dat is goed.',
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function calcWpm(correctChars: number, elapsedMs: number): number {
  const minutes = Math.max(1 / 60, elapsedMs / 60000);
  return Math.round((correctChars / 5) / minutes);
}

function computeXp(wpm: number, accuracyPct: number): number {
  // Small, capped rewards to avoid XP farming.
  const wpmScore = clamp(Math.floor(wpm / 10) * 5, 0, 30); // 0..30
  const accBonus = accuracyPct >= 95 ? 15 : accuracyPct >= 90 ? 10 : accuracyPct >= 80 ? 5 : 0; // 0..15
  return clamp(wpmScore + accBonus, 0, 40);
}

export const TypingTrainer: React.FC<TypingTrainerProps> = ({ onExit, onXPEarned }) => {
  const [mode, setMode] = useState<Mode>('menu');
  const [durationSec, setDurationSec] = useState(60);
  const [countdown, setCountdown] = useState(3);

  const [promptIndex, setPromptIndex] = useState(0);
  const [input, setInput] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState<number>(Date.now());

  const [typedChars, setTypedChars] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [xpAwarded, setXpAwarded] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const prompt = useMemo(() => PROMPTS[promptIndex % PROMPTS.length], [promptIndex]);

  const elapsedMs = startedAt ? Math.max(0, now - startedAt) : 0;
  const timeLeftSec = startedAt ? Math.max(0, durationSec - Math.floor(elapsedMs / 1000)) : durationSec;

  const accuracyPct = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 0;
  const wpm = startedAt ? calcWpm(correctChars, elapsedMs) : 0;

  const resetRun = () => {
    setPromptIndex(Math.floor(Math.random() * PROMPTS.length));
    setInput('');
    setTypedChars(0);
    setCorrectChars(0);
    setXpAwarded(false);
    setStartedAt(null);
    setNow(Date.now());
  };

  // Tick timer during play.
  useEffect(() => {
    if (mode !== 'playing') return;
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(id);
  }, [mode]);

  // Countdown handling.
  useEffect(() => {
    if (mode !== 'countdown') return;
    setCountdown(3);
    const id = window.setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          window.clearInterval(id);
          setMode('playing');
          setStartedAt(Date.now());
          setNow(Date.now());
          // Focus the input as soon as we enter play.
          setTimeout(() => inputRef.current?.focus(), 50);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [mode]);

  // End-of-run transition + XP award.
  useEffect(() => {
    if (mode !== 'playing') return;
    if (timeLeftSec > 0) return;
    setMode('results');
  }, [mode, timeLeftSec]);

  useEffect(() => {
    if (mode !== 'results' || xpAwarded) return;
    const xp = computeXp(wpm, accuracyPct);
    if (xp > 0) {
      onXPEarned?.(xp, `Typing Trainer: ${wpm} WPM • ${accuracyPct}%`);
    }
    setXpAwarded(true);
  }, [mode, xpAwarded, wpm, accuracyPct, onXPEarned]);

  const handleChange = (value: string) => {
    if (mode !== 'playing') return;

    // Prevent multi-line/paste abuse a bit: keep at most prompt length + 20.
    const bounded = value.replace(/\n/g, '').slice(0, prompt.length + 20);
    setInput(bounded);

    // Update counters based on incremental changes.
    // We compute correctness per position against the prompt.
    const typed = bounded.length;
    let correct = 0;
    for (let i = 0; i < typed; i++) {
      if (bounded[i] === prompt[i]) correct++;
    }

    setTypedChars((prev) => {
      // Only allow monotonic increase to keep metrics stable for backspaces.
      return Math.max(prev, typed);
    });
    setCorrectChars((prev) => Math.max(prev, correct));

    // Move to next prompt when completed exactly.
    if (bounded === prompt) {
      setPromptIndex((p) => p + 1);
      setInput('');
      // Keep typing focus.
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const renderPrompt = () => {
    const chars = prompt.split('');
    return (
      <div className="font-mono text-sm md:text-base leading-relaxed bg-slate-950/60 border border-white/10 rounded-2xl p-4">
        {chars.map((ch, i) => {
          const typed = input[i];
          const isTyped = typed !== undefined;
          const ok = isTyped && typed === ch;
          const bad = isTyped && typed !== ch;
          return (
            <span
              key={i}
              className={
                ok
                  ? 'text-emerald-300'
                  : bad
                    ? 'text-red-300 underline decoration-red-400/60'
                    : isTyped
                      ? 'text-slate-300'
                      : 'text-slate-500'
              }
            >
              {ch}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white flex flex-col">
      {/* Header */}
      <div className="shrink-0 px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <button
          onClick={onExit}
          className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors"
          aria-label="Terug"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <Keyboard size={18} className="text-sky-300" />
          <span className="font-black uppercase tracking-widest text-sm">Typing Trainer</span>
        </div>
        <button
          onClick={() => {
            resetRun();
            setMode('menu');
          }}
          className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors"
          aria-label="Reset"
          title="Reset"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        {mode === 'menu' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <h2 className="text-2xl font-black mb-2">Train je typevaardigheid</h2>
              <p className="text-slate-300 text-sm">
                Typ de tekst zo nauwkeurig mogelijk. Hoe sneller en netter je typt, hoe hoger je score.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-slate-300">Duur</span>
                <span className="text-xs font-mono text-slate-400">{durationSec}s</span>
              </div>
              <div className="flex gap-2">
                {[30, 60, 120].map((s) => (
                  <button
                    key={s}
                    onClick={() => setDurationSec(s)}
                    className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all border ${durationSec === s
                      ? 'bg-sky-500/20 border-sky-400/40 text-sky-200'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                  >
                    {s}s
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  resetRun();
                  setMode('countdown');
                }}
                className="w-full py-4 rounded-2xl font-black uppercase tracking-widest bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 transition-all shadow-lg shadow-sky-500/20 active:scale-95"
              >
                Start
              </button>
            </div>
          </div>
        )}

        {mode === 'countdown' && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-slate-300 font-bold mb-2">Klaar voor de start?</div>
              <div className="text-7xl md:text-8xl font-black text-sky-300 animate-pulse">{countdown}</div>
              <div className="mt-4 text-slate-400 text-sm">Focus op nauwkeurigheid.</div>
            </div>
          </div>
        )}

        {(mode === 'playing' || mode === 'results') && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1">
                  <Clock size={12} /> Tijd
                </div>
                <div className={`text-2xl font-black ${timeLeftSec <= 10 && mode === 'playing' ? 'text-red-300' : 'text-white'}`}>
                  {timeLeftSec}s
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">WPM</div>
                <div className="text-2xl font-black text-white">{wpm}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Acc</div>
                <div className="text-2xl font-black text-white">{accuracyPct}%</div>
              </div>
            </div>

            {renderPrompt()}

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => handleChange(e.target.value)}
                disabled={mode !== 'playing'}
                placeholder={mode === 'playing' ? 'Begin met typen...' : 'Klaar'}
                className="w-full px-4 py-4 rounded-2xl bg-slate-950/70 border border-white/10 outline-none focus:ring-2 focus:ring-sky-500/40 font-mono text-sm md:text-base"
              />
              <div className="mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Tip: spaties tellen mee. Backspace mag, maar focus op flow.
              </div>
            </div>

            {mode === 'results' && (
              <div className="bg-gradient-to-br from-amber-500/15 to-orange-500/10 border border-amber-400/20 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center">
                    <Trophy className="text-amber-300" size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-amber-200/80">Resultaat</div>
                    <div className="text-xl font-black text-white">{wpm} WPM • {accuracyPct}%</div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      resetRun();
                      setMode('countdown');
                    }}
                    className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 transition-all active:scale-95"
                  >
                    Opnieuw
                  </button>
                  <button
                    onClick={onExit}
                    className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 border border-white/10 transition-all active:scale-95"
                  >
                    Terug
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingTrainer;

