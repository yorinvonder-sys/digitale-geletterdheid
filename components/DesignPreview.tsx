import React, { useEffect } from 'react';

// ============================================
// DESIGN PREVIEW — Anthropic-inspired redesign
// Dit is een standalone preview pagina.
// Geen bestaande tokens/styles worden aangeraakt.
// ============================================

// Warm earth-tone palette (Anthropic-inspired)
const palette = {
  bg: '#FAF9F0',        // warm cream
  surface: '#FFFFFF',
  text: '#1A1A19',       // warm near-black
  textMuted: '#6B6B66',  // warm grey
  textLight: '#9C9C95',
  accent: '#D97757',     // terracotta (Anthropic signature)
  accentHover: '#C46849',
  border: '#E8E6DF',
  borderLight: '#F0EEE8',
  // Illustration container colors
  sky: '#D4E4ED',
  cactus: '#C5D9C0',
  olive: '#D2D4B3',
  heather: '#D4CCDE',
  fig: '#C4B0C9',
  clay: '#DDD0C3',
  coral: '#E8C5B5',
  oat: '#E8DFD0',
};

// Hand-drawn SVG illustrations
function IllustrationHand() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Hand holding lightbulb */}
      <path d="M100 45c-18 0-32 14-32 32 0 12 6 22 16 28v12h32v-12c10-6 16-16 16-28 0-18-14-32-32-32z"
        stroke={palette.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M88 117h24v8c0 4-4 8-8 8h-8c-4 0-8-4-8-8v-8z"
        stroke={palette.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <line x1="100" y1="30" x2="100" y2="20" stroke={palette.accent} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="130" y1="40" x2="138" y2="32" stroke={palette.accent} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="70" y1="40" x2="62" y2="32" stroke={palette.accent} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="140" y1="65" x2="150" y2="65" stroke={palette.accent} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="60" y1="65" x2="50" y2="65" stroke={palette.accent} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Hand below */}
      <path d="M72 145c0-6 4-10 10-10h6c2-4 6-6 10-6s8 2 10 6h6c6 0 10 4 10 10v20c0 8-8 16-26 16s-26-8-26-16v-20z"
        stroke={palette.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M88 135v-10M100 129v-6M112 135v-10"
        stroke={palette.text} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function IllustrationBook() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Open book */}
      <path d="M100 55c-20-10-40-10-55-5v100c15-5 35-5 55 5 20-10 40-10 55-5v-100c-15-5-35-5-55 5z"
        stroke={palette.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <line x1="100" y1="55" x2="100" y2="155" stroke={palette.text} strokeWidth="2" strokeLinecap="round"/>
      {/* Text lines left */}
      <line x1="58" y1="72" x2="88" y2="68" stroke={palette.textLight} strokeWidth="2" strokeLinecap="round"/>
      <line x1="58" y1="85" x2="88" y2="81" stroke={palette.textLight} strokeWidth="2" strokeLinecap="round"/>
      <line x1="58" y1="98" x2="82" y2="95" stroke={palette.textLight} strokeWidth="2" strokeLinecap="round"/>
      <line x1="58" y1="111" x2="88" y2="108" stroke={palette.textLight} strokeWidth="2" strokeLinecap="round"/>
      <line x1="58" y1="124" x2="78" y2="122" stroke={palette.textLight} strokeWidth="2" strokeLinecap="round"/>
      {/* Text lines right */}
      <line x1="112" y1="68" x2="142" y2="72" stroke={palette.textLight} strokeWidth="2" strokeLinecap="round"/>
      <line x1="112" y1="81" x2="142" y2="85" stroke={palette.textLight} strokeWidth="2" strokeLinecap="round"/>
      <line x1="118" y1="95" x2="142" y2="98" stroke={palette.textLight} strokeWidth="2" strokeLinecap="round"/>
      {/* Sparkles */}
      <path d="M75 42l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill={palette.accent} stroke="none"/>
      <path d="M135 38l1.5 4.5 4.5 1.5-4.5 1.5-1.5 4.5-1.5-4.5-4.5-1.5 4.5-1.5z" fill={palette.accent} stroke="none"/>
      <path d="M150 58l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill={palette.accent} stroke="none"/>
    </svg>
  );
}

function IllustrationBrain() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Brain outline */}
      <path d="M100 40c-12 0-22 6-28 14-8 0-16 6-18 14-6 4-10 12-10 20 0 8 4 16 10 20 2 8 8 14 16 16 4 8 14 14 24 16h12c10-2 20-8 24-16 8-2 14-8 16-16 6-4 10-12 10-20 0-8-4-16-10-20-2-8-10-14-18-14-6-8-16-14-28-14z"
        stroke={palette.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Center line */}
      <path d="M100 50v90" stroke={palette.text} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 4"/>
      {/* Brain folds left */}
      <path d="M80 60c-8 6-12 14-10 24" stroke={palette.text} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M70 78c-4 8 0 18 8 22" stroke={palette.text} strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* Brain folds right */}
      <path d="M120 60c8 6 12 14 10 24" stroke={palette.text} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M130 78c4 8 0 18-8 22" stroke={palette.text} strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* Connection nodes */}
      <circle cx="72" cy="90" r="3" fill={palette.accent}/>
      <circle cx="128" cy="90" r="3" fill={palette.accent}/>
      <circle cx="100" cy="75" r="3" fill={palette.accent}/>
      <circle cx="88" cy="110" r="3" fill={palette.accent}/>
      <circle cx="112" cy="110" r="3" fill={palette.accent}/>
      {/* Connection lines */}
      <line x1="72" y1="90" x2="100" y2="75" stroke={palette.accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <line x1="128" y1="90" x2="100" y2="75" stroke={palette.accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <line x1="88" y1="110" x2="100" y2="75" stroke={palette.accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <line x1="112" y1="110" x2="100" y2="75" stroke={palette.accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      {/* Pulse circles */}
      <circle cx="100" cy="75" r="8" stroke={palette.accent} strokeWidth="1" fill="none" opacity="0.3"/>
    </svg>
  );
}

function IllustrationCompass() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Compass circle */}
      <circle cx="100" cy="100" r="55" stroke={palette.text} strokeWidth="2.5" fill="none"/>
      <circle cx="100" cy="100" r="48" stroke={palette.border} strokeWidth="1.5" fill="none"/>
      {/* Cardinal markers */}
      <line x1="100" y1="48" x2="100" y2="40" stroke={palette.text} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="100" y1="160" x2="100" y2="152" stroke={palette.text} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="48" y1="100" x2="40" y2="100" stroke={palette.text} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="160" y1="100" x2="152" y2="100" stroke={palette.text} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Needle */}
      <polygon points="100,55 95,100 100,108 105,100" fill={palette.accent} stroke={palette.accent} strokeWidth="1" strokeLinejoin="round"/>
      <polygon points="100,145 95,100 100,92 105,100" fill={palette.text} stroke={palette.text} strokeWidth="1" strokeLinejoin="round" opacity="0.3"/>
      {/* Center */}
      <circle cx="100" cy="100" r="4" fill={palette.bg} stroke={palette.text} strokeWidth="2"/>
      {/* N label */}
      <text x="100" y="35" textAnchor="middle" fill={palette.accent} fontSize="14" fontWeight="600" fontFamily="serif">N</text>
    </svg>
  );
}

function IllustrationChat() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Chat bubble 1 */}
      <rect x="40" y="45" width="90" height="50" rx="12" stroke={palette.text} strokeWidth="2.5" fill="none"/>
      <path d="M65 95l-10 18 20-18" stroke={palette.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Lines in bubble 1 */}
      <line x1="56" y1="62" x2="114" y2="62" stroke={palette.textLight} strokeWidth="2" strokeLinecap="round"/>
      <line x1="56" y1="74" x2="100" y2="74" stroke={palette.textLight} strokeWidth="2" strokeLinecap="round"/>
      {/* Chat bubble 2 (response) */}
      <rect x="70" y="105" width="90" height="45" rx="12" stroke={palette.accent} strokeWidth="2.5" fill="none"/>
      <path d="M135 150l10 15-20-15" stroke={palette.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Lines in bubble 2 */}
      <line x1="86" y1="120" x2="144" y2="120" stroke={palette.accent} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <line x1="86" y1="132" x2="130" y2="132" stroke={palette.accent} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      {/* Sparkle */}
      <path d="M148 48l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill={palette.accent} stroke="none"/>
    </svg>
  );
}

function IllustrationShield() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Shield */}
      <path d="M100 35l50 20v40c0 35-20 55-50 70-30-15-50-35-50-70v-40l50-20z"
        stroke={palette.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Checkmark */}
      <path d="M78 95l14 14 30-35" stroke={palette.accent} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Decorative lines */}
      <path d="M100 55l30 12" stroke={palette.border} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M100 55l-30 12" stroke={palette.border} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Feature card component
function FeatureCard({ illustration, bgColor, title, description }: {
  illustration: React.ReactNode;
  bgColor: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group cursor-default">
      <div
        className="aspect-square rounded-2xl mb-5 p-8 transition-transform duration-300 group-hover:scale-[1.02]"
        style={{ backgroundColor: bgColor }}
      >
        {illustration}
      </div>
      <h3 style={{ fontFamily: "'Newsreader', Georgia, serif", color: palette.text }}
        className="text-xl font-medium mb-2">
        {title}
      </h3>
      <p style={{ color: palette.textMuted }} className="text-base leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function DesignPreview() {
  // Load fonts dynamically (preview only)
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Newsreader:ital,wght@0,400;0,500;0,600;1,400&display=swap';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <div style={{ backgroundColor: palette.bg, color: palette.text, fontFamily: "'Inter', system-ui, sans-serif" }}
      className="min-h-screen">

      {/* ===== NAVIGATION ===== */}
      <nav className="sticky top-0 z-50 backdrop-blur-md"
        style={{ backgroundColor: `${palette.bg}ee`, borderBottom: `1px solid ${palette.borderLight}` }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: palette.accent }}>
              <span className="text-white text-sm font-semibold">dg</span>
            </div>
            <span className="font-semibold text-lg" style={{ color: palette.text }}>DGSkills</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Over ons', 'Platform', 'Onderzoek', 'Scholen', 'Contact'].map(item => (
              <a key={item} href="#" className="text-sm transition-colors duration-200 hover:opacity-100"
                style={{ color: palette.textMuted }}
                onMouseEnter={e => (e.currentTarget.style.color = palette.text)}
                onMouseLeave={e => (e.currentTarget.style.color = palette.textMuted)}>
                {item}
              </a>
            ))}
            <button className="text-sm px-5 py-2.5 rounded-full font-medium transition-colors duration-200"
              style={{ backgroundColor: palette.accent, color: '#fff' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = palette.accentHover)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = palette.accent)}>
              Probeer DGSkills
            </button>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <p className="text-sm font-medium tracking-wide uppercase mb-6" style={{ color: palette.accent }}>
          Digitale geletterdheid voor het voortgezet onderwijs
        </p>
        <h1 style={{ fontFamily: "'Newsreader', Georgia, serif" }}
          className="text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] mb-8">
          Leren bouwen aan een{' '}
          <em className="not-italic" style={{ color: palette.accent }}>digitale toekomst</em>
        </h1>
        <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10" style={{ color: palette.textMuted }}>
          DGSkills helpt leerlingen om digitale vaardigheden te ontwikkelen met
          behulp van AI — veilig, transparant, en afgestemd op de SLO-kerndoelen.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button className="px-7 py-3.5 rounded-full font-medium text-base transition-colors duration-200"
            style={{ backgroundColor: palette.text, color: palette.bg }}>
            Start gratis pilot
          </button>
          <button className="px-7 py-3.5 rounded-full font-medium text-base transition-colors duration-200"
            style={{ border: `1.5px solid ${palette.border}`, color: palette.text }}>
            Bekijk demo
          </button>
        </div>
      </section>

      {/* ===== DIVIDER ===== */}
      <div className="max-w-6xl mx-auto px-6">
        <div style={{ borderTop: `1px solid ${palette.border}` }} />
      </div>

      {/* ===== FEATURES GRID ===== */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-medium tracking-wide uppercase mb-4" style={{ color: palette.accent }}>
            Waarom DGSkills
          </p>
          <h2 style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            className="text-3xl md:text-4xl font-medium leading-tight mb-4">
            Doordacht ontworpen voor het onderwijs
          </h2>
          <p style={{ color: palette.textMuted }} className="text-lg leading-relaxed">
            Elk onderdeel van DGSkills is gebouwd met oog voor privacy, pedagogiek en de Nederlandse onderwijspraktijk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <FeatureCard
            illustration={<IllustrationHand />}
            bgColor={palette.coral}
            title="AI als hulpmiddel"
            description="Leerlingen leren AI inzetten als gereedschap, niet als vervanging. Kritisch denken staat centraal."
          />
          <FeatureCard
            illustration={<IllustrationBook />}
            bgColor={palette.sky}
            title="SLO-kerndoelen"
            description="Alle missies zijn direct gekoppeld aan de kerndoelen digitale geletterdheid van SLO."
          />
          <FeatureCard
            illustration={<IllustrationBrain />}
            bgColor={palette.heather}
            title="Adaptief leren"
            description="Het platform past zich aan het niveau van de leerling aan, met persoonlijke feedback via AI."
          />
          <FeatureCard
            illustration={<IllustrationCompass />}
            bgColor={palette.olive}
            title="Docentendashboard"
            description="Volg de voortgang van je klas in realtime. Inzicht in vaardigheden en aandachtspunten."
          />
          <FeatureCard
            illustration={<IllustrationChat />}
            bgColor={palette.oat}
            title="Veilige AI-chat"
            description="Welzijnsprotocol, content filtering en volledige transparantie over AI-gebruik."
          />
          <FeatureCard
            illustration={<IllustrationShield />}
            bgColor={palette.cactus}
            title="Privacy-first"
            description="AVG-compliant, DPIA uitgevoerd, data in Europa. Ontworpen voor de EU AI Act."
          />
        </div>
      </section>

      {/* ===== QUOTE SECTION ===== */}
      <section style={{ backgroundColor: palette.text }} className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <blockquote style={{ fontFamily: "'Newsreader', Georgia, serif", color: palette.bg }}
            className="text-3xl md:text-4xl font-normal leading-snug italic mb-8">
            "Technologie in het onderwijs moet leerlingen versterken, niet vervangen.
            Elk hulpmiddel dat we bouwen begint bij die overtuiging."
          </blockquote>
          <div style={{ color: `${palette.bg}88` }} className="text-sm">
            <span className="font-medium" style={{ color: `${palette.bg}cc` }}>Yorin van der Vonder</span>
            {' '}&mdash; Docent & oprichter DGSkills
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '17', label: 'Compliance documenten' },
            { value: '100%', label: 'Data in Europa' },
            { value: 'SLO', label: 'Kerndoelen aligned' },
            { value: 'AVG', label: 'Volledig compliant' },
          ].map(stat => (
            <div key={stat.label}>
              <div style={{ fontFamily: "'Newsreader', Georgia, serif", color: palette.accent }}
                className="text-4xl md:text-5xl font-medium mb-2">
                {stat.value}
              </div>
              <div style={{ color: palette.textMuted }} className="text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== DIVIDER ===== */}
      <div className="max-w-6xl mx-auto px-6">
        <div style={{ borderTop: `1px solid ${palette.border}` }} />
      </div>

      {/* ===== CTA ===== */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 style={{ fontFamily: "'Newsreader', Georgia, serif" }}
          className="text-3xl md:text-4xl font-medium leading-tight mb-6">
          Klaar om digitale geletterdheid anders aan te pakken?
        </h2>
        <p style={{ color: palette.textMuted }} className="text-lg leading-relaxed mb-10">
          Start een gratis pilot met je school. Geen verplichtingen,
          volledige ondersteuning bij de implementatie.
        </p>
        <button className="px-8 py-4 rounded-full font-medium text-base transition-colors duration-200"
          style={{ backgroundColor: palette.accent, color: '#fff' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = palette.accentHover)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = palette.accent)}>
          Plan een kennismaking
        </button>
      </section>

      {/* ===== DESIGN SYSTEM SHOWCASE ===== */}
      <section className="border-t-4 border-dashed" style={{ borderColor: palette.accent }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-xs font-medium tracking-widest uppercase mb-8" style={{ color: palette.accent }}>
            Design System Preview — alleen zichtbaar op /dev/design
          </p>

          {/* Color palette */}
          <div className="mb-12">
            <h3 style={{ fontFamily: "'Newsreader', Georgia, serif" }} className="text-2xl font-medium mb-6">
              Kleurenpalet
            </h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {Object.entries({
                'Terracotta': palette.accent,
                'Near-black': palette.text,
                'Cream': palette.bg,
                'Muted': palette.textMuted,
                'Sky': palette.sky,
                'Cactus': palette.cactus,
                'Olive': palette.olive,
                'Heather': palette.heather,
                'Fig': palette.fig,
                'Clay': palette.clay,
                'Coral': palette.coral,
                'Oat': palette.oat,
              }).map(([name, color]) => (
                <div key={name}>
                  <div className="aspect-square rounded-xl mb-2" style={{ backgroundColor: color, border: `1px solid ${palette.border}` }} />
                  <div className="text-xs font-medium">{name}</div>
                  <div className="text-xs" style={{ color: palette.textLight }}>{color}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="mb-12">
            <h3 style={{ fontFamily: "'Newsreader', Georgia, serif" }} className="text-2xl font-medium mb-6">
              Typografie
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase tracking-wide" style={{ color: palette.textLight }}>Heading — Newsreader (serif)</span>
                <p style={{ fontFamily: "'Newsreader', Georgia, serif" }} className="text-4xl font-medium">
                  De toekomst van digitaal onderwijs
                </p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wide" style={{ color: palette.textLight }}>Body — Inter (sans-serif)</span>
                <p className="text-lg leading-relaxed" style={{ color: palette.textMuted }}>
                  DGSkills combineert AI-technologie met bewezen pedagogische methoden om leerlingen
                  voor te bereiden op een digitale wereld. Veilig, transparant en altijd in lijn met
                  de Nederlandse onderwijsstandaarden.
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div>
            <h3 style={{ fontFamily: "'Newsreader', Georgia, serif" }} className="text-2xl font-medium mb-6">
              Knoppen
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <button className="px-6 py-3 rounded-full font-medium transition-colors duration-200"
                style={{ backgroundColor: palette.accent, color: '#fff' }}>
                Primary
              </button>
              <button className="px-6 py-3 rounded-full font-medium transition-colors duration-200"
                style={{ backgroundColor: palette.text, color: palette.bg }}>
                Secondary
              </button>
              <button className="px-6 py-3 rounded-full font-medium transition-colors duration-200"
                style={{ border: `1.5px solid ${palette.border}`, color: palette.text }}>
                Outline
              </button>
              <button className="px-6 py-3 rounded-full font-medium transition-colors duration-200 underline underline-offset-4"
                style={{ color: palette.accent }}>
                Text link
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ borderTop: `1px solid ${palette.border}` }}>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: palette.accent }}>
                  <span className="text-white text-xs font-semibold">dg</span>
                </div>
                <span className="font-semibold" style={{ color: palette.text }}>DGSkills</span>
              </div>
              <p className="text-sm" style={{ color: palette.textMuted }}>
                Digitale geletterdheid voor het voortgezet onderwijs.
              </p>
            </div>
            <div className="flex gap-12 text-sm" style={{ color: palette.textMuted }}>
              <div className="space-y-2">
                <div className="font-medium" style={{ color: palette.text }}>Platform</div>
                <div>Missies</div>
                <div>AI Chat</div>
                <div>Dashboard</div>
              </div>
              <div className="space-y-2">
                <div className="font-medium" style={{ color: palette.text }}>School</div>
                <div>Pilot starten</div>
                <div>ICT-info</div>
                <div>Compliance</div>
              </div>
              <div className="space-y-2">
                <div className="font-medium" style={{ color: palette.text }}>Juridisch</div>
                <div>Privacy</div>
                <div>Cookies</div>
                <div>AI-transparantie</div>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 text-xs" style={{ borderTop: `1px solid ${palette.borderLight}`, color: palette.textLight }}>
            &copy; 2026 DGSkills. Alle rechten voorbehouden.
          </div>
        </div>
      </footer>
    </div>
  );
}
