# DGSkills Lokaal Opzetten (Windows / Mac / Linux)

## Vereisten

- **Node.js** v18+ (LTS aanbevolen) — [Download](https://nodejs.org/)
- **Git** — [Download](https://git-scm.com/)
- **Supabase project** gegevens (URL + Anon Key)

## Optie 1: Clonen via Git (aanbevolen)

```bash
# Clone de repository
git clone https://github.com/yorinvonder-sys/digitale-geletterdheid.git

# Ga naar de projectmap
cd digitale-geletterdheid

# Installeer dependencies
npm install
```

## Optie 2: ZIP downloaden

1. Ga naar https://github.com/yorinvonder-sys/digitale-geletterdheid
2. Klik op de groene **"Code"** knop → **"Download ZIP"**
3. Pak het ZIP-bestand uit in een map naar keuze
4. Open een terminal in die map en voer `npm install` uit

## Omgevingsvariabelen instellen

Maak een `.env.local` bestand aan in de projectroot:

```env
VITE_SUPABASE_URL=https://jouw-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=jouw-anon-key
```

Je vindt deze gegevens in het **Supabase Dashboard** → **Project Settings** → **API**.

> **Let op:** Commit `.env.local` NOOIT naar Git — het staat al in `.gitignore`.

## Starten

### Windows
Dubbelklik op `setup-windows.bat` of voer uit in terminal:
```cmd
setup-windows.bat
```

### Alle platformen
```bash
# Development server starten
npm run dev

# Opent automatisch op http://localhost:5173
```

## Handige commando's

| Commando | Beschrijving |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Maak productie-build |
| `npm run build:prod` | Maak productie-build (zonder sourcemaps) |
| `npm run preview` | Preview van productie-build |
| `npm run doctor` | TypeScript health check |

## Projectstructuur

```
digitale-geletterdheid/
├── App.tsx                  # Entry point
├── AppRouter.tsx            # Route configuratie
├── AuthenticatedApp.tsx     # Authenticated routes
├── components/              # React componenten
├── contexts/                # React contexts
├── hooks/                   # Custom hooks
├── services/                # API services
├── types/                   # TypeScript types
├── utils/                   # Utility functies
├── supabase/                # Supabase Edge Functions & migraties
├── public/                  # Statische bestanden
├── business/                # Zakelijke documentatie
└── guides/                  # Handleidingen
```

## Problemen?

- **`npm install` mislukt?** Verwijder `node_modules` en `package-lock.json`, dan opnieuw `npm install`
- **Port 5173 bezet?** Vite kiest automatisch een andere port
- **Supabase connectie mislukt?** Controleer je `.env.local` waarden
