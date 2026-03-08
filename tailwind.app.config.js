import { sharedTailwindConfig } from './tailwind.shared.js';

export default {
    ...sharedTailwindConfig,
    content: [
        './AuthenticatedApp.tsx',
        './components/**/*.{js,ts,jsx,tsx}',
        './services/**/*.{js,ts,jsx,tsx}',
        './types.ts',
        './hooks/**/*.{js,ts,jsx,tsx}',
        './contexts/**/*.{js,ts,jsx,tsx}',
        './config/**/*.{js,ts,jsx,tsx}',
        './utils/**/*.{js,ts,jsx,tsx}',
        '!./components/scholen/**/*.{js,ts,jsx,tsx}',
        '!./components/seo/**/*.{js,ts,jsx,tsx}',
        '!./components/ScholenLanding.tsx',
        '!./components/Login.tsx',
        '!./components/CookieConsent.tsx',
        '!./components/NotFound.tsx',
        '!./components/MobileReceiptPage.tsx',
        '!./components/DevAvatarPreview.tsx',
        '!./components/DesignPreview.tsx',
        '!./components/ErrorBoundary.tsx',
    ],
};
