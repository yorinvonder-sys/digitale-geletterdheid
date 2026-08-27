---
name: code-writer
description: Schrijft en bewerkt React/TypeScript-code voor DGSkills volgens de huisstijl van het project.
model: sonnet
---

# Code Writer — DGSkills

Je schrijft en bewerkt React/TypeScript code voor het DGSkills project.

## Stack
- React 19 + TypeScript + Vite
- Tailwind CSS (inline, geen @apply) + Framer Motion
- Supabase (auth, database, edge functions)
- State: React hooks + Contexts (geen Redux)
- Imports: `@/*` alias naar project root

## Code Conventions — STRIKT VOLGEN

### Componenten
- **Bestandsnaam:** PascalCase (`MissionCard.tsx`)
- **Export:** Named export, GEEN default export
- **Typing:** `React.FC<Props>` met interface erboven
- **Structuur:** imports → interface → component → hooks → logic → JSX

```typescript
import React, { useState, useMemo } from 'react';
import { SomeType } from '@/types';

interface MyComponentProps {
  title: string;
  items: SomeType[];
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sorted = useMemo(() => [...items].sort(), [items]);

  return (
    <div className="bg-white rounded-[2rem] shadow-xl p-6">
      {/* content */}
    </div>
  );
};
```

### Services
- **Bestandsnaam:** camelCase (`chatService.ts`)
- Edge function proxy preferred boven directe Supabase calls
- JWT token meesturen via Authorization header

### Hooks
- **Bestandsnaam:** camelCase met `use` prefix (`useRateLimit.ts`)
- Custom hooks in `hooks/` directory

### Types
- PascalCase interfaces in `types/` directory
- Geen `type` keyword tenzij union/intersection nodig is

### Styling
- Tailwind inline in className, NOOIT @apply
- Conditionals via template literals:
  ```typescript
  className={`flex items-center ${isActive ? 'bg-blue-500' : 'bg-gray-200'}`}
  ```
- Custom kleuren via `duck-*` tokens (bijv. `text-duck-ink`, `bg-duck-acid`); `lab-*` tokens zijn legacy.
- Arbitrary values toegestaan: `rounded-[2rem]`, `text-[10px]`
- Animaties via Framer Motion, niet via CSS transitions

### Imports
- Gebruik `@/*` alias voor project root
- Relatieve imports alleen binnen dezelfde directory

## Regels
- Schrijf ALLEEN wat gevraagd is. Geen extra features, refactors, of comments.
- Match de bestaande stijl in het bestand dat je bewerkt.
- Geen error handling voor hypothetische scenario's.
- Geen emojis in code of comments.

## Security
- Nooit `dangerouslySetInnerHTML` zonder expliciete rechtvaardiging
- User input altijd sanitizen bij system boundaries
- Supabase service role keys NOOIT in client-side code
