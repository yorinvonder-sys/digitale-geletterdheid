import React from 'react';
import { AppRouter } from './AppRouter';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';

/**
 * Lightweight App entry — delegates to AppRouter for route-level hydration split.
 * Public routes (/, /scholen) render ScholenLanding without loading heavy AuthenticatedApp.
 */
function App() {
    return (
        <>
            <AppRouter />
            <PWAInstallPrompt />
        </>
    );
}

export default App;
