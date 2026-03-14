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

  const progressPct = startedAt ? Math.min(100, (elapsedMs / (durationSec * 1000)) * 100) : 0;

  const renderPrompt = () => {
    const chars = prompt.split('');
    return (
      <div className="font-mono text-sm md:text-base leading-relaxed rounded-2xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
        {chars.map((ch, i) => {
          const typed = input[i];
          const isTyped = typed !== undefined;
          const ok = isTyped && typed === ch;
          const bad = isTyped && typed !== ch;
          return (
            <span
              key={i}
              style={{
                color: ok
                  ? '#10B981'
                  : bad
                    ? '#EF4444'
                    : isTyped
                      ? '#3D3D38'
                      : '#6B6B66',
                textDecoration: bad ? 'underline' : 'none',
                textDecorationColor: bad ? '#EF444499' : undefined,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: '#FAF9F0', color: '#1A1A19', fontFamily: "'Outfit', system-ui, sans-serif" }}>
      {/* Header */}
      <div className="shrink-0 px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #E8E6DF' }}>
        <button
          onClick={onExit}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
          style={{ backgroundColor: '#F0EEE8', color: '#3D3D38' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E8E6DF'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F0EEE8'; }}
          aria-label="Terug"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <Keyboard size={18} style={{ color: '#D97757' }} />
          <span className="font-black uppercase tracking-widest text-sm" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#1A1A19' }}>Typing Trainer</span>
        </div>
        <button
          onClick={() => {
            resetRun();
            setMode('menu');
          }}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
          style={{ backgroundColor: '#F0EEE8', color: '#3D3D38' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E8E6DF'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F0EEE8'; }}
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
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
              <h2 className="text-2xl font-black mb-2" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#1A1A19' }}>Train je typevaardigheid</h2>
              <p className="text-sm" style={{ color: '#3D3D38' }}>
                Typ de tekst zo nauwkeurig mogelijk. Hoe sneller en netter je typt, hoe hoger je score.
              </p>
            </div>

            <div className="rounded-2xl p-6 space-y-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#6B6B66' }}>Duur</span>
                <span className="text-xs font-mono" style={{ color: '#6B6B66' }}>{durationSec}s</span>
              </div>
              <div className="flex gap-2">
                {[30, 60, 120].map((s) => (
                  <button
                    key={s}
                    onClick={() => setDurationSec(s)}
                    className="flex-1 py-3 rounded-full font-bold text-sm transition-all duration-300"
                    style={{
                      backgroundColor: durationSec === s ? '#D9775715' : '#FFFFFF',
                      border: `1px solid ${durationSec === s ? '#D97757' : '#E8E6DF'}`,
                      color: durationSec === s ? '#D97757' : '#3D3D38',
                    }}
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
                className="w-full py-4 rounded-full font-black uppercase tracking-widest transition-all duration-300 active:scale-95"
                style={{ background: 'linear-gradient(to right, #D97757, #C46849)', color: '#FFFFFF', boxShadow: '0 4px 14px #D9775730' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(to right, #C46849, #B35A3D)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(to right, #D97757, #C46849)'; }}
              >
                Start
              </button>
            </div>
          </div>
        )}

        {mode === 'countdown' && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="font-bold mb-2" style={{ color: '#3D3D38' }}>Klaar voor de start?</div>
              <div className="text-7xl md:text-8xl font-black animate-pulse" style={{ color: '#D97757', fontFamily: "'Newsreader', Georgia, serif" }}>{countdown}</div>
              <div className="mt-4 text-sm" style={{ color: '#6B6B66' }}>Focus op nauwkeurigheid.</div>
            </div>
          </div>
        )}

        {(mode === 'playing' || mode === 'results') && (
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Progress bar */}
            <div className="rounded-full h-2 overflow-hidden" style={{ backgroundColor: '#F0EEE8' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%`, background: 'linear-gradient(to right, #D97757, #C46849)' }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-2xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
                <div className="text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1" style={{ color: '#6B6B66' }}>
                  <Clock size={12} /> Tijd
                </div>
                <div
                  className="text-2xl font-black"
                  style={{
                    color: timeLeftSec <= 10 && mode === 'playing' ? '#EF4444' : '#1A1A19',
                    fontFamily: "'Newsreader', Georgia, serif",
                  }}
                >
                  {timeLeftSec}s
                </div>
              </div>
              <div className="rounded-2xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
                <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#6B6B66' }}>WPM</div>
                <div className="text-2xl font-black" style={{ color: '#1A1A19', fontFamily: "'Newsreader', Georgia, serif" }}>{wpm}</div>
              </div>
              <div className="rounded-2xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
                <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#6B6B66' }}>Acc</div>
                <div className="text-2xl font-black" style={{ color: '#1A1A19', fontFamily: "'Newsreader', Georgia, serif" }}>{accuracyPct}%</div>
              </div>
            </div>

            {renderPrompt()}

            <div className="rounded-2xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => handleChange(e.target.value)}
                disabled={mode !== 'playing'}
                placeholder={mode === 'playing' ? 'Begin met typen...' : 'Klaar'}
                className="w-full px-4 py-4 rounded-2xl font-mono text-sm md:text-base outline-none transition-all duration-300"
                style={{
                  backgroundColor: '#FAF9F0',
                  border: '1px solid #E8E6DF',
                  color: '#1A1A19',
                }}
                onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px #D9775740'; e.currentTarget.style.borderColor = '#D97757'; }}
                onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E8E6DF'; }}
              />
              <div className="mt-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#6B6B66' }}>
                Tip: spaties tellen mee. Backspace mag, maar focus op flow.
              </div>
            </div>

            {mode === 'results' && (
              <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, #D9775712, #C4684908)', border: '1px solid #D9775730' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#D9775720' }}>
                    <Trophy style={{ color: '#D97757' }} size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest" style={{ color: '#6B6B66' }}>Resultaat</div>
                    <div className="text-xl font-black" style={{ color: '#1A1A19', fontFamily: "'Newsreader', Georgia, serif" }}>{wpm} WPM • {accuracyPct}%</div>
                  </div>
                </div>

                {/* XP display */}
                <div className="rounded-full inline-flex items-center gap-1.5 px-3 py-1 mb-4" style={{ border: '1px solid #10B98140', backgroundColor: '#10B98110', color: '#10B981' }}>
                  <span className="text-xs font-bold">+{computeXp(wpm, accuracyPct)} XP</span>
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      resetRun();
                      setMode('countdown');
                    }}
                    className="flex-1 py-4 rounded-full font-black uppercase tracking-widest transition-all duration-300 active:scale-95"
                    style={{ background: 'linear-gradient(to right, #D97757, #C46849)', color: '#FFFFFF', boxShadow: '0 4px 14px #D9775730' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(to right, #C46849, #B35A3D)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(to right, #D97757, #C46849)'; }}
                  >
                    Opnieuw
                  </button>
                  <button
                    onClick={onExit}
                    className="flex-1 py-4 rounded-full font-black uppercase tracking-widest transition-all duration-300 active:scale-95"
                    style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF', color: '#3D3D38' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F0EEE8'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
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
