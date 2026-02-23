
import React, { memo } from 'react';
import { AgentRole } from '../../types';
import { RoleCard } from '../RoleCard';

interface AgentSelectorProps {
    roles: AgentRole[];
    onSelect: (role: AgentRole) => void;
}

export const AgentSelector: React.FC<AgentSelectorProps> = memo(({ roles, onSelect }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto pb-6">
            {roles.map(role => (
                <RoleCard
                    key={role.id}
                    role={role}
                    isSelected={false}
                    onClick={onSelect}
                />
            ))}
        </div>
    );
});
