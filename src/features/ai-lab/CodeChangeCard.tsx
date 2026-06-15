
import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CodeChange {
    variable: string;
    label: string;
    oldValue: string;
    newValue: string;
}

interface CodeChangeCardProps {
    changes: CodeChange[];
}

// Known game variables with friendly labels
const VARIABLE_LABELS: Record<string, string> = {
    playerColor: '🎨 Speler Kleur',
    jumpForce: '🦘 Spring Kracht',
    gravity: '⬇️ Zwaartekracht',
    obstacleColor: '🟢 Obstakel Kleur',
    obstacleSpeed: '💨 Obstakel Snelheid',
    skyColor1: '☁️ Lucht Kleur',
    groundColor: '🟫 Grond Kleur'
};

// Extract variables from game code
export function extractGameVariables(code: string): Record<string, string> {
    const variables: Record<string, string> = {};

    // Match patterns like: let playerColor = '#ff3c21';
    const regex = /let\s+(playerColor|jumpForce|gravity|obstacleColor|obstacleSpeed|skyColor1|skyColor2|groundColor|grassColor)\s*=\s*([^;]+);/g;
    let match;

    while ((match = regex.exec(code)) !== null) {
        const [, name, value] = match;
        variables[name] = value.trim().replace(/['"]/g, '');
    }

    return variables;
}

// Compute changes between old and new code
export function computeCodeChanges(oldCode: string, newCode: string): CodeChange[] {
    const oldVars = extractGameVariables(oldCode);
    const newVars = extractGameVariables(newCode);
    const changes: CodeChange[] = [];

    for (const key of Object.keys(newVars)) {
        if (oldVars[key] !== newVars[key]) {
            changes.push({
                variable: key,
                label: VARIABLE_LABELS[key] || key,
                oldValue: oldVars[key] || '(nieuw)',
                newValue: newVars[key]
            });
        }
    }

    return changes;
}

export const CodeChangeCard: React.FC<CodeChangeCardProps> = ({ changes }) => {
    if (changes.length === 0) return null;

    return (
        <div className="bg-gradient-to-br from-lab-sage/30 to-lab-teal/30 border border-lab-sage/50 rounded-xl p-4 my-3 animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-lab-sage" />
                <h4 className="text-sm font-bold text-lab-sage">Wat is er veranderd?</h4>
            </div>

            <div className="space-y-2">
                {changes.map((change, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm bg-lab-ink/50 rounded-lg px-3 py-2">
                        <span className="text-lab-muted font-medium flex-shrink-0">{change.label}</span>
                        <span className="font-mono text-lab-coral line-through text-xs opacity-70">{change.oldValue}</span>
                        <ArrowRight size={14} className="text-lab-muted flex-shrink-0" />
                        <span className="font-mono text-lab-sage font-bold">{change.newValue}</span>
                    </div>
                ))}
            </div>

            <p className="text-xs text-lab-muted mt-3 italic">
                💡 Tip: Klik op RUN om de verandering te zien!
            </p>
        </div>
    );
};
