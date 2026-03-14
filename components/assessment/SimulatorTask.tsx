
import React, { useState } from 'react';
import { SimulatorTask as SimulatorTaskType, SimItem, SimTarget } from './types';
import { FileText, Folder, Image, Trash2, Cloud, UploadCloud, Monitor } from 'lucide-react';

interface Props {
    task: SimulatorTaskType;
    onComplete: (success: boolean) => void;
}

export const SimulatorTask: React.FC<Props> = ({ task, onComplete }) => {
    const [items, setItems] = useState<SimItem[]>(task.items);
    const [droppedItems, setDroppedItems] = useState<{ itemId: string; targetId: string }[]>([]);
    const [feedback, setFeedback] = useState<string | null>(null);

    // Filter out items that have been successfully dropped into a target that "consumes" them (like trash or cloud upload)
    const activeItems = items.filter(item => {
        const drop = droppedItems.find(d => d.itemId === item.id);
        if (!drop) return true;
        // If dropped in a target, check if we should hide it
        return false;
    });

    const handleDragStart = (e: React.DragEvent, itemId: string) => {
        e.dataTransfer.setData('itemId', itemId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        const itemId = e.dataTransfer.getData('itemId');
        const target = task.targets.find(t => t.id === targetId);

        if (!target || !itemId) return;

        if (target.accepts.includes(itemId)) {
            // Success drop
            setDroppedItems(prev => [...prev, { itemId, targetId }]);

            // Check success condition
            // Ideally this logic should be more robust/generic from the types, 
            // but for now we hardcode the specific goal check based on the task prompt
            if (target.name === 'OneDrive' && items.find(i => i.id === itemId)?.name === 'Verslag.docx') {
                setFeedback('✅ Goed bezig! Veilig opgeslagen in de Cloud.');
                setTimeout(() => onComplete(true), 1500);
            } else {
                setFeedback(`👍 ${items.find(i => i.id === itemId)?.name} verplaatst naar ${target.name}.`);
                setTimeout(() => setFeedback(null), 2000);
            }
        } else {
            // Failed drop (wrong target)
            setFeedback('❌ Dat hoort daar niet thuis!');
            setTimeout(() => setFeedback(null), 1500);
        }
    };

    const getIcon = (iconName?: string) => {
        switch (iconName) {
            case 'FileText': return <FileText size={32} className="text-blue-500" />;
            case 'Image': return <Image size={32} className="text-purple-500" />;
            default: return <FileText size={32} className="text-slate-500" />;
        }
    };

    return (
        <div className="flex flex-col h-full bg-lab-bg text-lab-dark p-4">
            <div className="mb-4 text-center">
                <h2 className="text-2xl font-black text-lab-primary flex items-center justify-center gap-2">
                    <Monitor /> {task.title}
                </h2>
                <p className="text-lab-textLight">{task.description}</p>
            </div>

            {/* Desktop Area */}
            <div className="flex-1 bg-white rounded-2xl border-2 border-neutral-200 shadow-md relative overflow-hidden flex">

                {/* Wallpaper */}
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#D97757_1px,transparent_1px)] [background-size:20px_20px]"></div>

                {/* Left: Desktop Icons (Source) */}
                <div className="flex-1 p-3 sm:p-6 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 content-start">
                    {activeItems.map(item => (
                        <div
                            key={item.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item.id)}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-lab-primary/5 cursor-move transition-colors active:scale-95 group"
                        >
                            <div className="group-hover:scale-110 transition-transform">
                                {getIcon(item.icon)}
                            </div>
                            <span className="text-xs font-bold text-center bg-lab-bg px-2 py-1 rounded w-full text-lab-text break-words">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Right: Targets (Destination) */}
                <div className="w-2/5 sm:w-1/3 bg-lab-bg/50 border-l border-neutral-200 p-2 sm:p-4 flex flex-col gap-4 justify-center">
                    {task.targets.map(target => (
                        <div
                            key={target.id}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, target.id)}
                            className={`
                                h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all
                                ${target.type === 'trash' ? 'border-red-400/50 bg-red-50 hover:bg-red-100' : 'border-lab-accent/50 bg-lab-accent/5 hover:bg-lab-accent/10'}
                            `}
                        >
                            {target.type === 'trash' ? <Trash2 size={32} className="text-red-400" /> : <UploadCloud size={32} className="text-lab-accent" />}
                            <span className="font-bold text-sm text-lab-textLight">{target.name}</span>
                        </div>
                    ))}
                </div>

                {feedback && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white border border-neutral-200 px-6 py-3 rounded-xl shadow-xl font-bold text-lab-dark animate-in slide-in-from-bottom-4">
                        {feedback}
                    </div>
                )}
            </div>

            <div className="mt-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-sm text-center">
                <p className="font-bold text-lg text-lab-accent">Doel: {task.goal}</p>
            </div>
        </div>
    );
};
