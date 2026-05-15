import React, { useState } from 'react';

const C = {
    bg: '#FCF6EA',
    bgAlt: '#F3E4CB',
    text: '#08283B',
    textMuted: '#445865',
    accent: '#D97848',
    accentHover: '#B85F36',
    border: '#E7D8BD',
    gold: '#D7C95F',
    goldHover: '#C9B94F',
    teal: '#0B453F',
    paper: '#FFFDF7',
} as const;

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Outfit', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

interface Card {
    title: string;
    body: string;
    icon: React.ReactNode;
}

const GlobeIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const DocumentIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const LockIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const ScaleIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="3" x2="12" y2="21" />
        <path d="M3 6l9-3 9 3" />
        <path d="M3 12l9 3 9-3" />
        <path d="M3 6c0 3.3 2.7 6 6 6S15 9.3 15 6" />
        <path d="M9 18c0 3.3 2.7 6 6 6s6-2.7 6-6" />
    </svg>
);

const CARDS: Card[] = [
    {
        title: 'Alle data blijft in Nederland',
        body: 'De leeromgeving en AI draaien op Europese servers. Geen export buiten de EU.',
        icon: <GlobeIcon />,
    },
    {
        title: 'Privacy-pakket klaar',
        body: 'Verwerkersovereenkomst, privacy-impactanalyse en incidentplan op aanvraag.',
        icon: <DocumentIcon />,
    },
    {
        title: 'Veilig inloggen',
        body: 'Tweestaps-verificatie voor docenten en beheerders. Strenge afscherming per gebruiker.',
        icon: <LockIcon />,
    },
    {
        title: 'AI-wet 2026 op tijd geregeld',
        body: 'Voldoet aan de nieuwe wet voor onderwijs-AI. Roadmap publiek vóór 2 aug 2026.',
        icon: <ScaleIcon />,
    },
];

const BewijsCard: React.FC<{ card: Card }> = ({ card }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                backgroundColor: '#FFFFFF',
                border: `1px solid ${hovered ? C.accent : C.border}`,
                borderRadius: '12px',
                padding: '24px',
                transition: 'border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease',
                transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.08)' : '0 1px 4px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
            }}
        >
            <div style={{ color: C.accent }}>
                {card.icon}
            </div>
            <h3 style={{
                fontFamily: SANS,
                fontSize: '16px',
                fontWeight: 600,
                color: C.text,
                margin: 0,
                lineHeight: 1.3,
            }}>
                {card.title}
            </h3>
            <p style={{
                fontFamily: SANS,
                fontSize: '14px',
                color: C.textMuted,
                margin: 0,
                lineHeight: 1.6,
            }}>
                {card.body}
            </p>
        </div>
    );
};

export const IctBewijs: React.FC = () => {
    const handleScrollToContact = () => {
        const contact = document.getElementById('contact');
        if (contact) {
            contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section
            aria-label="Bewijs voor ICT-coördinatoren"
            className="scroll-mt-16"
            style={{
                backgroundColor: C.bgAlt,
                fontFamily: SANS,
            }}
        >
            <div style={{
                maxWidth: '1024px',
                margin: '0 auto',
                padding: '56px 24px',
            }}
                className="md:py-20 lg:py-24"
            >
                <p style={{
                    fontFamily: SANS,
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: C.accent,
                    margin: '0 0 12px',
                }}>
                    VOOR ICT
                </p>

                <h2 style={{
                    fontFamily: SERIF,
                    fontSize: 'clamp(24px, 4vw, 36px)',
                    fontWeight: 400,
                    color: C.text,
                    margin: '0 0 16px',
                    lineHeight: 1.25,
                }}>
                    Veilig in gebruik, klaar voor jouw goedkeuring
                </h2>

                <p style={{
                    fontFamily: SANS,
                    fontSize: '16px',
                    color: C.textMuted,
                    margin: '0 0 40px',
                    lineHeight: 1.6,
                    maxWidth: '600px',
                }}>
                    Alle data blijft binnen Nederland. Privacy- en security-papieren klaar voor procurement.
                </p>

                <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
                >
                    {CARDS.map((card) => (
                        <BewijsCard key={card.title} card={card} />
                    ))}
                </div>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    alignItems: 'center',
                }}>
                    <a
                        href="/ict"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '12px 24px',
                            backgroundColor: C.gold,
                            color: C.text,
                            borderRadius: '8px',
                            fontSize: '15px',
                            fontWeight: 600,
                            fontFamily: SANS,
                            textDecoration: 'none',
                            transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = C.goldHover; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = C.gold; }}
                    >
                        Bekijk security &amp; architectuur →
                    </a>

                    <button
                        type="button"
                        onClick={handleScrollToContact}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '12px 24px',
                            backgroundColor: 'transparent',
                            color: C.teal,
                            border: `1px solid ${C.teal}`,
                            borderRadius: '8px',
                            fontSize: '15px',
                            fontWeight: 600,
                            fontFamily: SANS,
                            cursor: 'pointer',
                            transition: 'background-color 0.15s ease, color 0.15s ease',
                        }}
                        onMouseEnter={e => {
                            const btn = e.currentTarget as HTMLButtonElement;
                            btn.style.backgroundColor = C.teal;
                            btn.style.color = '#FFFFFF';
                        }}
                        onMouseLeave={e => {
                            const btn = e.currentTarget as HTMLButtonElement;
                            btn.style.backgroundColor = 'transparent';
                            btn.style.color = C.teal;
                        }}
                    >
                        Vraag privacy-pakket aan
                    </button>
                </div>
            </div>
        </section>
    );
};
