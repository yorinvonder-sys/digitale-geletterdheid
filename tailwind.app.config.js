import { sharedTailwindConfig } from './tailwind.shared.js';

export default {
    ...sharedTailwindConfig,
    content: [
        './src/app/AuthenticatedApp.tsx',
        './src/components/**/*.{js,ts,jsx,tsx}',
        './src/features/**/*.{js,ts,jsx,tsx}',
        './src/services/**/*.{js,ts,jsx,tsx}',
        './src/types.ts',
        './src/hooks/**/*.{js,ts,jsx,tsx}',
        './src/contexts/**/*.{js,ts,jsx,tsx}',
        './src/config/**/*.{js,ts,jsx,tsx}',
        './src/utils/**/*.{js,ts,jsx,tsx}',
        '!./src/features/public-site/**/*.{js,ts,jsx,tsx}',
        '!./src/features/seo/**/*.{js,ts,jsx,tsx}',
        '!./src/features/public-site/ScholenLanding.tsx',
        '!./src/features/auth/Login.tsx',
        '!./src/features/dev-tools/**/*.{js,ts,jsx,tsx}',
        '!./src/components/app-shell/CookieConsent.tsx',
        '!./src/components/app-shell/NotFound.tsx',
        '!./src/components/app-shell/MobileReceiptPage.tsx',
        '!./src/components/app-shell/ErrorBoundary.tsx',
    ],
};
