import React from 'react';
import { Sparkles, Flame } from 'lucide-react';
import { GamificationEvent } from '@/types';

interface EventsPanelProps {
    activeEvents: GamificationEvent[];
    onShowModal: () => void;
    onEndEvent: (id: string) => void;
}

export const EventsPanel: React.FC<EventsPanelProps> = ({ activeEvents, onShowModal, onEndEvent }) => {
    return (
        <div className="p-4 space-y-4">
            <button
                onClick={onShowModal}
                className="w-full p-4 border-2 border-dashed border-duck-ink rounded-xl text-duck-ink font-bold hover:bg-duck-ink hover:text-white transition-colors flex items-center justify-center gap-2"
            >
                <Sparkles size={16} /> Nieuw XP Boost Event
            </button>

            {activeEvents.length > 0 ? (
                <div className="grid gap-2">
                    {activeEvents.map(event => (
                        <div key={event.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-duck-ink to-duck-error rounded-xl border border-duck-ink">
                            <div>
                                <div className="font-bold text-duck-ink flex items-center gap-2">
                                    <Flame className="text-duck-ink/60" size={16} />
                                    {event.name}
                                </div>
                                <div className="text-[10px] text-duck-ink/60">{event.multiplier}x XP • {event.targetClass || 'Alle klassen'}</div>
                            </div>
                            <button
                                onClick={() => event.id && onEndEvent(event.id)}
                                className="px-3 py-1 bg-duck-error text-white rounded-lg text-xs font-bold hover:bg-duck-error hover:text-white transition-colors"
                            >
                                Stop
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-duck-ink/60 text-sm">Geen actieve events</div>
            )}
        </div>
    );
};
