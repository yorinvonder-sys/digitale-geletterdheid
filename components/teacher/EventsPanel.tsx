import React from 'react';
import { Sparkles, Flame } from 'lucide-react';
import { GamificationEvent } from '../../types';

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
                className="w-full p-4 border-2 border-dashed border-purple-200 rounded-xl text-purple-600 font-bold hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
            >
                <Sparkles size={16} /> Nieuw XP Boost Event
            </button>

            {activeEvents.length > 0 ? (
                <div className="grid gap-2">
                    {activeEvents.map(event => (
                        <div key={event.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                            <div>
                                <div className="font-bold text-slate-900 flex items-center gap-2">
                                    <Flame className="text-orange-500" size={16} />
                                    {event.name}
                                </div>
                                <div className="text-[10px] text-slate-500">{event.multiplier}x XP • {event.targetClass || 'Alle klassen'}</div>
                            </div>
                            <button
                                onClick={() => event.id && onEndEvent(event.id)}
                                className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors"
                            >
                                Stop
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-slate-400 text-sm">Geen actieve events</div>
            )}
        </div>
    );
};
