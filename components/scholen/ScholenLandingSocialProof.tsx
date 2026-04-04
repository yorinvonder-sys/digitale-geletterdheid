import React from 'react';

const SERIF = "'Newsreader', Georgia, serif";

const IconShield = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const IconLock = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const IconCheck = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4 12 14.01l-3-3" />
    </svg>
);

const IconMapPin = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
);

interface MetricCardProps {
    value: string;
    label: string;
    sublabel: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ value, label, sublabel }) => (
    <div
        className="bg-white rounded-2xl border p-6 md:p-8 text-center hover:shadow-lg transition-[box-shadow] group"
        style={{ borderColor: '#E8E6DF' }}
    >
        <p className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#D97757', fontFamily: SERIF }}>
            {value}
        </p>
        <p className="font-medium text-sm md:text-base mb-1" style={{ color: '#1A1A19' }}>{label}</p>
        <p className="text-xs md:text-sm" style={{ color: '#9C9C95' }}>{sublabel}</p>
    </div>
);

interface TestimonialCardProps {
    quote: string;
    attribution: string;
    note?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, attribution, note }) => (
    <div
        className="bg-white rounded-2xl border p-6 md:p-8 relative overflow-hidden"
        style={{ borderColor: '#E8E6DF' }}
    >
        <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
            style={{ backgroundColor: '#D97757' }}
        />
        <p className="italic leading-relaxed mb-4 text-sm md:text-base" style={{ color: '#1A1A19' }}>
            &ldquo;{quote}&rdquo;
        </p>
        <p className="text-sm font-medium" style={{ color: '#6B6B66' }}>{attribution}</p>
        {note && (
            <p className="text-xs italic mt-3" style={{ color: '#9C9C95' }}>{note}</p>
        )}
    </div>
);

interface TrustBadgeProps {
    icon: React.ReactNode;
    label: string;
}

const TrustBadge: React.FC<TrustBadgeProps> = ({ icon, label }) => (
    <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs md:text-sm font-medium"
        style={{ borderColor: '#E8E6DF', color: '#6B6B66', backgroundColor: '#FAF9F0' }}
    >
        <span style={{ color: '#D97757' }}>{icon}</span>
        {label}
    </div>
);

export const ScholenLandingSocialProof: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <p className="text-sm font-medium tracking-wide mb-3" style={{ color: '#D97757' }}>
                    Bewezen impact
                </p>
                <h2
                    className="text-2xl md:text-3xl font-medium mb-4"
                    style={{ fontFamily: SERIF, color: '#1A1A19' }}
                >
                    Gebouwd voor resultaat, niet voor de show
                </h2>
                <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B6B66' }}>
                    DGSkills is ontwikkeld door een docent die het dagelijks in zijn eigen klas gebruikt.
                    Elk onderdeel is getest in de praktijk.
                </p>
            </div>

            {/* Impact Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
                <MetricCard value="98" label="Interactieve missies" sublabel="Van AI tot cybersecurity" />
                <MetricCard value="9" label="SLO-kerndoelen" sublabel="Volledige curriculumdekking" />
                <MetricCard value="30" label="Dagen naar live" sublabel="Implementatiegarantie" />
            </div>

            {/* Testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12">
                <TestimonialCard
                    quote="DGSkills bespaart mij uren aan voorbereiding en administratie. Mijn leerlingen zijn gemotiveerder dan ooit."
                    attribution="— Docent Digitale Geletterdheid, pilotschool"
                    note="Eerste pilotresultaten verwacht juni 2026"
                />
                <TestimonialCard
                    quote="Eindelijk een platform dat aansluit bij de SLO-kerndoelen én leerlingen activeert. De rapportages zijn precies wat we nodig hebben voor de inspectie."
                    attribution="— ICT-coördinator, pilotschool"
                />
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-3">
                <TrustBadge icon={<IconShield />} label="AI Act Compliant" />
                <TrustBadge icon={<IconLock />} label="AVG/DPIA Gereed" />
                <TrustBadge icon={<IconCheck />} label="SLO Kerndoelen 2025" />
                <TrustBadge icon={<IconMapPin />} label="Gebouwd in Nederland" />
            </div>
        </div>
    );
};
