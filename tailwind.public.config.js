import { sharedTailwindConfig } from './tailwind.shared.js';

export default {
    ...sharedTailwindConfig,
    content: [
        './index.html',
        './src/app/App.tsx',
        './src/app/AppRouter.tsx',
        './src/main.tsx',
        './src/features/public-site/ScholenLanding.tsx',
        './src/features/auth/Login.tsx',
        './src/components/app-shell/CookieConsent.tsx',
        './src/components/app-shell/NotFound.tsx',
        './src/components/app-shell/MobileReceiptPage.tsx',
        './src/features/dev-tools/DevAvatarPreview.tsx',
        './src/features/dev-tools/DesignPreview.tsx',
        './src/components/app-shell/ErrorBoundary.tsx',
        './src/features/profile/avatar/AvatarSetup.tsx',
        './src/features/profile/avatar/AvatarViewer.tsx',
        './src/features/public-site/**/*.{js,ts,jsx,tsx}',
        // Live ingebedde dashboards op /scholen en /verhaal. Tailwind volgt geen
        // imports, dus de componenten die deze twee renderen moeten er los bij:
        // MissionPreviewVisual e.d. leven in features/dashboard en gebruiken
        // utilities die anders alleen in de ingelogde bundel belanden.
        './src/features/student/**/*.{js,ts,jsx,tsx}',
        './src/features/teacher/**/*.{js,ts,jsx,tsx}',
        './src/features/dashboard/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}',
        './src/features/seo/**/*.{js,ts,jsx,tsx}',
        './src/components/brand/**/*.{js,ts,jsx,tsx}',
    ],
};
