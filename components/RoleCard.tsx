
import React, { useState } from 'react';
import { AgentRole } from '../types';
import { Info, X, Play, BarChart2, Eye } from 'lucide-react';

interface RoleCardProps {
  role: AgentRole;
  isSelected: boolean;
  onClick: (role: AgentRole) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({ role, isSelected, onClick }) => {
  const [showInfo, setShowInfo] = useState(false);

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowInfo(!showInfo);
  };

  const getDifficultyLabel = (diff: string) => {
    switch(diff) {
        case 'Easy': return 'Makkelijk';
        case 'Medium': return 'Gemiddeld';
        case 'Hard': return 'Moeilijk';
        default: return diff;
    }
  };

  return (
    <div 
      className={`
        relative h-72 w-full transition-all duration-300 perspective-1000 group
        ${isSelected ? 'transform -translate-y-2' : 'hover:-translate-y-1'}
      `}
    >
      {/* Container that holds both sides */}
      <div className={`relative w-full h-full duration-500 preserve-3d`}>
        
        {/* FRONT SIDE */}
        <div 
          onClick={() => !showInfo && onClick(role)}
          className={`
            absolute inset-0 w-full h-full backface-hidden rounded-[2rem] flex flex-col items-center text-center cursor-pointer border transition-all overflow-hidden bg-white
            ${isSelected 
              ? 'shadow-xl ring-2 ring-lab-primary border-transparent' 
              : 'shadow-md border-slate-100 hover:shadow-xl'
            }
            ${showInfo ? 'opacity-0 pointer-events-none' : 'opacity-100 z-10'}
          `}
        >
          {/* DEFAULT STATE (Text & Icon) - Fades out on hover */}
          <div className="absolute inset-0 p-6 flex flex-col items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
             <div className={`text-4xl mb-4 p-4 rounded-2xl bg-slate-50 text-slate-600 shadow-inner`}>
                {role.icon}
             </div>
             <h3 className="font-extrabold text-xl mb-2 text-slate-800">{role.title}</h3>
             <p className="text-sm text-slate-400 font-medium line-clamp-2">
                {role.description}
             </p>
             <div className="mt-4 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase tracking-wider">
                Hover voor voorbeeld
             </div>
          </div>

          {/* HOVER STATE (Visual Preview) - Fades in on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-50">
             {/* The Visual Component */}
             <div className="w-full h-full relative">
                {role.visualPreview}
                
                {/* Overlay with CTA */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-6">
                   <h3 className="text-white font-bold text-lg mb-1 drop-shadow-md">{role.title}</h3>
                   <div className="flex items-center justify-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-widest">
                      <Eye size={14} /> Bekijk Resultaat
                   </div>
                </div>
             </div>
          </div>

          {/* Info Button (Always visible on top layer) */}
          <button 
             onClick={handleInfoClick}
             className="absolute top-4 right-4 p-2 rounded-full bg-white/50 hover:bg-white text-slate-500 hover:text-lab-primary transition-colors z-20 backdrop-blur shadow-sm"
             title="Meer info"
          >
             <Info size={20} />
          </button>
        </div>

        {/* BACK SIDE (Info Mode) - Stays same */}
        <div 
          className={`
            absolute inset-0 w-full h-full backface-hidden rounded-[2rem] p-6 bg-slate-900 text-white flex flex-col shadow-xl border border-slate-700
            transition-all duration-300
            ${showInfo ? 'opacity-100 z-20 scale-100' : 'opacity-0 pointer-events-none scale-95'}
          `}
        >
          <div className="flex justify-between items-start mb-4">
             <h4 className="font-bold text-lab-accent flex items-center gap-2">
                <BarChart2 size={16} /> Missie Info
             </h4>
             <button onClick={handleInfoClick} className="text-slate-400 hover:text-white">
                <X size={20} />
             </button>
          </div>

          <div className="space-y-4 text-sm flex-grow text-left">
            <div>
                <p className="text-slate-400 text-xs uppercase font-bold mb-1">Jouw Opdracht</p>
                <p className="text-slate-200 leading-snug">{role.missionObjective}</p>
            </div>
            <div>
                <p className="text-slate-400 text-xs uppercase font-bold mb-1">Niveau</p>
                <div className="flex gap-1 items-center">
                    {[1,2,3].map(i => (
                        <div key={i} className={`h-1.5 w-6 rounded-full ${
                            (role.difficulty === 'Easy' && i === 1) || 
                            (role.difficulty === 'Medium' && i <= 2) || 
                            (role.difficulty === 'Hard') 
                            ? 'bg-lab-primary' : 'bg-slate-700'
                        }`} />
                    ))}
                    <span className="ml-2 text-xs text-slate-400">{getDifficultyLabel(role.difficulty)}</span>
                </div>
            </div>
          </div>

          <button 
            onClick={() => { setShowInfo(false); onClick(role); }}
            className="mt-auto w-full py-3 bg-lab-primary hover:bg-lab-primaryDark rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Play size={16} fill="currentColor" /> Start Missie
          </button>
        </div>

      </div>
    </div>
  );
};
