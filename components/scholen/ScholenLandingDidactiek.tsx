import React, { useState } from 'react';
import { generateDidactischeOnderbouwingPDF } from '../../services/didactischePdfService';

const PILLARS = [
    {
        icon: '🧩',
        title: 'Scaffolding',
        subtitle: 'Stap voor stap, met steun',
        description: 'Elke missie bouwt op in 3 stappen: eerste poging, verbetering, meesterschap. De AI geeft per ronde maximaal 1 verbeterpunt — zodat leerlingen niet overspoeld raken.',
        source: 'Vygotsky (1978) — Zone van Naaste Ontwikkeling',
    },
    {
        icon: '💬',
        title: 'Formatieve feedback',
        subtitle: 'Specifiek, direct, actionable',
        description: 'Na elke actie krijgt de leerling gerichte feedback: wat ging goed, wat kan beter, en wat is de volgende stap. Geen cijfer, maar een concreet verbeterpunt.',
        source: 'Hattie (2009) — effectgrootte 0.73',
    },
    {
        icon: '🔨',
        title: 'Constructivisme',
        subtitle: 'Leren door te bouwen',
        description: 'Leerlingen lezen niet over AI — ze trainen een chatbot. Ze lezen niet over privacy — ze analyseren een datalek. Kennis ontstaat door actief te doen.',
        source: 'Piaget & Papert (1980)',
    },
    {
        icon: '🎯',
        title: 'Bloom\'s taxonomie',
        subtitle: 'Van onthouden tot creëren',
        description: 'Leerjaar 1 begint bij Toepassen, leerjaar 2 verschuift naar Analyseren en Evalueren, leerjaar 3 eindigt bij Creëren — een eigen prototype bouwen en pitchen.',
        source: 'Bloom (1956)',
    },
];

const STATS = [
    { value: '9', label: 'SLO-kerndoelen gedekt' },
    { value: '3', label: 'Stappen per missie' },
    { value: '141+', label: 'Missies beschikbaar' },
    { value: '1', label: 'Verbeterpunt per ronde' },
];

export const ScholenLandingDidactiek: React.FC = () => {
    const [generating, setGenerating] = useState(false);

    async function handleDownload() {
        setGenerating(true);
        try {
            await generateDidactischeOnderbouwingPDF();
        } finally {
            setGenerating(false);
        }
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <p className="text-sm font-medium tracking-wide mb-3" style={{ color: '#D97757' }}>Didactische visie</p>
                <h2 className="text-2xl md:text-3xl font-medium mb-4" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#1A1A19' }}>
                    Niet zomaar opdrachten — een doordacht leermodel
                </h2>
                <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B6B66' }}>
                    Elke missie is gebouwd op bewezen leerprincipes. De AI is geen antwoordmachine
                    — het is een mentor die precies weet wanneer het een hint moet geven en wanneer
                    de leerling zelf moet nadenken.
                </p>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {STATS.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl border p-4 text-center" style={{ borderColor: '#E8E6DF' }}>
                        <p className="text-2xl font-bold mb-1" style={{ color: '#D97757' }}>{stat.value}</p>
                        <p className="text-xs" style={{ color: '#6B6B66' }}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Pillar cards */}
            <div className="grid md:grid-cols-2 gap-5 mb-10">
                {PILLARS.map((pillar) => (
                    <div key={pillar.title} className="bg-white rounded-2xl border p-6 hover:shadow-lg transition-[box-shadow] group" style={{ borderColor: '#E8E6DF' }}>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl" style={{ backgroundColor: '#D9775712' }}>
                                {pillar.icon}
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-medium text-base mb-0.5" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#1A1A19' }}>{pillar.title}</h3>
                                <p className="text-xs font-medium mb-2" style={{ color: '#D97757' }}>{pillar.subtitle}</p>
                                <p className="text-sm leading-relaxed mb-3" style={{ color: '#6B6B66' }}>{pillar.description}</p>
                                <p className="text-[11px] italic" style={{ color: '#9C9C95' }}>{pillar.source}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Download CTA */}
            <div className="rounded-2xl border p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5" style={{ borderColor: '#E8E6DF', backgroundColor: '#FFFFFF' }}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D9775712' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-sm mb-0.5" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#1A1A19' }}>
                            Volledige didactische onderbouwing
                        </p>
                        <p className="text-xs" style={{ color: '#6B6B66' }}>
                            Met bronverwijzingen, SLO-mapping en uitleg van het 3-stappen model. Deel het met je sectie of ICT-coördinator.
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleDownload}
                    disabled={generating}
                    className="text-sm font-medium px-6 py-3 rounded-full transition-colors flex-shrink-0 inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60"
                    style={{
                        color: '#FFFFFF',
                        backgroundColor: '#D97757',
                        fontFamily: "'Newsreader', Georgia, serif",
                    }}
                    onMouseOver={(e) => { if (!generating) e.currentTarget.style.backgroundColor = '#C46849'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#D97757'; }}
                >
                    {generating ? 'PDF genereren...' : 'Download PDF'}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
