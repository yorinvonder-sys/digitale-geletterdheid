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
                className="w-full p-4 border-2 border-dashed border-lab-teal rounded-xl text-lab-teal font-bold hover:bg-lab-teal hover:text-white transition-colors flex items-center justify-center gap-2"
            >
                <Sparkles size={16} /> Nieuw XP Boost Event
            </button>

            {activeEvents.length > 0 ? (
                <div className="grid gap-2">
                    {activeEvents.map(event => (
                        <div key={event.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-lab-teal to-lab-coral rounded-xl border border-lab-teal">
                            <div>
                                <div className="font-bold text-lab-ink flex items-center gap-2">
                                    <Flame className="text-lab-muted" size={16} />
                                    {event.name}
                                </div>
                                <div className="text-[10px] text-lab-muted">{event.multiplier}x XP • {event.targetClass || 'Alle klassen'}</div>
                            </div>
                            <button
                                onClick={() => event.id && onEndEvent(event.id)}
                                className="px-3 py-1 bg-lab-coral text-white rounded-lg text-xs font-bold hover:bg-lab-coral hover:text-white transition-colors"
                            >
                                Stop
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-lab-muted text-sm">Geen actieve events</div>
            )}
        </div>
    );
};
