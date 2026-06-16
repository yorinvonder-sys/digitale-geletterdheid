import React, { useState } from 'react';
import { Globe, ChevronRight, Send, Cloud, Zap, RefreshCw } from 'lucide-react';

interface ApiExample {
    name: string;
    emoji: string;
    url: string;
    response: object;
}

const API_EXAMPLES: ApiExample[] = [
    {
        name: 'Weer Amsterdam',
        emoji: '🌤️',
        url: 'api.weer.nl/v1/current?city=amsterdam',
        response: {
            city: "Amsterdam",
            temperature: 14,
            humidity: 72,
            wind_speed: 18,
            condition: "Bewolkt",
            icon: "cloudy"
        }
    },
    {
        name: 'Random Fun Fact',
        emoji: '🎲',
        url: 'api.funfacts.io/v1/random?lang=nl',
        response: {
            id: 42,
            fact: "Een octopus heeft drie harten en blauw bloed.",
            category: "Dieren",
            source: "National Geographic"
        }
    },
    {
        name: 'Pokémon Pikachu',
        emoji: '⚡',
        url: 'pokeapi.co/api/v2/pokemon/pikachu',
        response: {
            name: "pikachu",
            id: 25,
            type: ["electric"],
            height: 4,
            weight: 60,
            abilities: ["static", "lightning-rod"],
            base_experience: 112
        }
    }
];

const JsonViewer: React.FC<{ data: object; depth?: number }> = ({ data, depth = 0 }) => {
    const entries = Object.entries(data);
    const indent = depth * 16;

    return (
        <div style={{ paddingLeft: indent }}>
            <span className="text-lab-muted">{'{'}</span>
            {entries.map(([key, value], i) => (
                <div key={key} style={{ paddingLeft: 16 }} className="leading-relaxed">
                    <span className="text-lab-teal">"{key}"</span>
                    <span className="text-lab-muted">: </span>
                    {Array.isArray(value) ? (
                        <span>
                            <span className="text-lab-muted">[</span>
                            {value.map((item, j) => (
                                <span key={j}>
                                    <span className="text-lab-sage">"{item}"</span>
                                    {j < value.length - 1 && <span className="text-lab-muted">, </span>}
                                </span>
                            ))}
                            <span className="text-lab-muted">]</span>
                        </span>
                    ) : typeof value === 'number' ? (
                        <span className="text-lab-gold">{value}</span>
                    ) : (
                        <span className="text-lab-sage">"{String(value)}"</span>
                    )}
                    {i < entries.length - 1 && <span className="text-lab-muted">,</span>}
                </div>
            ))}
            <span className="text-lab-muted">{'}'}</span>
        </div>
    );
};

const ApiVerkennerPreview: React.FC = () => {
    const [selectedApi, setSelectedApi] = useState(0);
    const [showResponse, setShowResponse] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = () => {
        setShowResponse(false);
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setShowResponse(true);
        }, 800);
    };

    const current = API_EXAMPLES[selectedApi];

    return (
        <div className="w-full h-full bg-gradient-to-br from-violet-50 to-white flex flex-col overflow-hidden">
            {/* Header */}
            <div className="shrink-0 bg-gradient-to-r from-violet-600 to-violet-700 px-4 py-3 flex items-center gap-2">
                <Globe size={18} className="text-lab-teal" />
                <span className="text-white font-bold text-sm">API Verkenner</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {/* API Selector */}
                <div className="flex gap-2">
                    {API_EXAMPLES.map((api, i) => (
                        <button
                            key={i}
                            onClick={() => { setSelectedApi(i); setShowResponse(false); }}
                            className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${selectedApi === i ? 'bg-lab-teal text-lab-teal ring-2 ring-violet-300 shadow-sm' : 'bg-white text-lab-muted border border-lab-muted hover:bg-lab-teal'}`}
                        >
                            <span className="block text-base mb-0.5">{api.emoji}</span>
                            {api.name}
                        </button>
                    ))}
                </div>

                {/* Explanation box */}
                <div className="bg-lab-teal border border-lab-teal rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                        <Zap size={12} className="text-lab-teal" />
                        <span className="text-[10px] font-bold text-lab-teal uppercase">Hoe werkt het?</span>
                    </div>
                    <p className="text-[11px] text-lab-teal leading-relaxed">
                        Een API is als een <strong>ober in een restaurant</strong>: jij (de app) stuurt een bestelling, de ober (API) brengt het naar de keuken (server) en komt terug met je data.
                    </p>
                </div>

                {/* Request */}
                <div className="bg-lab-muted rounded-xl overflow-hidden shadow-lg">
                    <div className="px-3 py-2 bg-lab-muted flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="bg-lab-sage text-white text-[9px] font-black px-2 py-0.5 rounded">GET</span>
                            <span className="text-[10px] text-lab-muted font-medium">Request</span>
                        </div>
                        <Cloud size={12} className="text-lab-muted" />
                    </div>
                    <div className="px-3 py-2 flex items-center gap-2">
                        <span className="text-lab-teal text-xs font-mono flex-1 break-all">
                            https://{current.url}
                        </span>
                        <button
                            onClick={handleSend}
                            className="shrink-0 bg-lab-teal hover:bg-lab-teal text-white p-2 rounded-lg transition-colors"
                        >
                            {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                        </button>
                    </div>
                </div>

                {/* Response */}
                <div className="bg-lab-muted rounded-xl overflow-hidden shadow-lg">
                    <div className="px-3 py-2 bg-lab-muted flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {showResponse ? (
                                <span className="bg-lab-sage text-white text-[9px] font-black px-2 py-0.5 rounded">200 OK</span>
                            ) : (
                                <span className="bg-lab-muted text-lab-muted text-[9px] font-black px-2 py-0.5 rounded">---</span>
                            )}
                            <span className="text-[10px] text-lab-muted font-medium">Response (JSON)</span>
                        </div>
                        <ChevronRight size={12} className="text-lab-muted" />
                    </div>
                    <div className="px-3 py-2 font-mono text-[11px] leading-relaxed min-h-[80px]">
                        {isLoading && (
                            <div className="flex items-center gap-2 text-lab-muted py-4 justify-center">
                                <RefreshCw size={14} className="animate-spin" />
                                <span>Data ophalen...</span>
                            </div>
                        )}
                        {showResponse && !isLoading && (
                            <JsonViewer data={current.response} />
                        )}
                        {!showResponse && !isLoading && (
                            <div className="text-lab-muted py-4 text-center text-xs">
                                Klik op <Send size={10} className="inline text-lab-teal" /> om de API aan te roepen
                            </div>
                        )}
                    </div>
                </div>

                {/* Task hint */}
                <div className="bg-lab-teal border-2 border-lab-teal rounded-xl p-3">
                    <p className="text-xs text-lab-teal">
                        Bekijk de response en bespreek in de chat: welke <strong>keys</strong> zie je? Welke <strong>waarde</strong> hoort bij welk label?
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ApiVerkennerPreview;
