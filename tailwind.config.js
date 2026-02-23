/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./App.tsx",
        "./index.tsx",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./services/**/*.{js,ts,jsx,tsx}",
        "./types.ts",
        "./hooks/**/*.{js,ts,jsx,tsx}",
        "./contexts/**/*.{js,ts,jsx,tsx}",
        "./config/**/*.{js,ts,jsx,tsx}",
        "./utils/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                lab: {
                    bg: '#F8FAFC',
                    surface: '#FFFFFF',
                    primary: '#6366F1',
                    primaryDark: '#4F46E5',
                    accent: '#0EA5E9',
                    secondary: '#8B5CF6',
                    dark: '#0F172A',
                    text: '#334155',
                    textLight: '#64748B',
                    green: '#10B981',
                    purple: '#8B5CF6',
                    pink: '#EC4899',
                    blue: '#3B82F6'
                },
            },
            fontFamily: {
                sans: ['Outfit', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, #E2E8F0 1px, transparent 1px), linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)",
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
                'fade-in-up': 'fadeInUp 0.7s ease-out forwards',
                'fade-in-up-delay-1': 'fadeInUp 0.7s ease-out 0.1s forwards',
                'fade-in-up-delay-2': 'fadeInUp 0.7s ease-out 0.2s forwards',
                'fade-in-up-delay-3': 'fadeInUp 0.7s ease-out 0.3s forwards',
                'hero-float': 'heroFloat 6s ease-in-out infinite',
                'hero-float-delayed': 'heroFloat 6s ease-in-out 2s infinite',
                'shimmer': 'shimmer 2.5s ease-in-out infinite',
                'slide-in-right': 'slideInRight 0.8s ease-out forwards',
                'carousel-progress': 'carouselProgress 6s linear forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'pulse-soft': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.7 },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                heroFloat: {
                    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                    '50%': { transform: 'translateY(-12px) rotate(0.5deg)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(40px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                carouselProgress: {
                    '0%': { width: '0%' },
                    '100%': { width: '100%' },
                },
            }
        },
    },
    plugins: [],
}

