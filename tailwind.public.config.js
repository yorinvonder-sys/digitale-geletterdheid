import { sharedTailwindConfig } from './tailwind.shared.js';

export default {
    ...sharedTailwindConfig,
    content: [
        './index.html',
        './App.tsx',
        './AppRouter.tsx',
        './index.tsx',
        './components/ScholenLanding.tsx',
        './components/Login.tsx',
        './components/CookieConsent.tsx',
        './components/NotFound.tsx',
        './components/MobileReceiptPage.tsx',
        './components/DevAvatarPreview.tsx',
        './components/DesignPreview.tsx',
        './components/ErrorBoundary.tsx',
        './components/AvatarSetup.tsx',
        './components/AvatarViewer.tsx',
        './components/scholen/**/*.{js,ts,jsx,tsx}',
        './components/seo/**/*.{js,ts,jsx,tsx}',
    ],
};
