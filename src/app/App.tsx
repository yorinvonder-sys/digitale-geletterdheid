import React from 'react';
import { AppRouter } from './AppRouter';

/**
 * Lightweight App entry — delegates to AppRouter for route-level hydration split.
 * The root route renders the story-led homepage; /scholen keeps the older
 * school landing available without loading the heavy authenticated shell.
 */
function App() {
    return <AppRouter />;
}

export default App;
