import React from 'react';
import { Lock, ShieldAlert } from 'lucide-react';

export function DeveloperDocsViewer() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-10">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-6">
          <Lock size={28} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-3">Interne documentatie is uit de publieke build gehaald</h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          Strategie-, compliance- en operationele documenten worden niet langer via de website geserveerd.
          Gebruik voor interne documentatie een afgeschermde workspace of een aparte backend-opslag met
          server-side autorisatie.
        </p>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/10 text-emerald-300 flex items-center justify-center shrink-0">
          <ShieldAlert size={24} />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-black text-white">Waarom dit is uitgeschakeld</h3>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Bestanden onder `public/` zijn altijd anoniem opvraagbaar. Door deze viewer te degraderen
            voorkomen we dat vertrouwelijke bedrijfs- en securitydocumenten per ongeluk opnieuw publiek
            worden meegepakt in een deployment.
          </p>
        </div>
      </div>
    </div>
  );
}
