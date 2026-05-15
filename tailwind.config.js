import { sharedTailwindConfig } from './tailwind.shared.js';

/** @type {import('tailwindcss').Config} */
export default {
    ...sharedTailwindConfig,
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
};
