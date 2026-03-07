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
                    bg: '#FAF9F0',
                    surface: '#FFFFFF',
                    primary: '#D97757',
                    primaryDark: '#C46849',
                    accent: '#2A9D8F',
                    secondary: '#8B6F9E',
                    dark: '#1A1A19',
                    text: '#3D3D38',
                    textLight: '#6B6B66',
                    green: '#10B981',
                    purple: '#8B5CF6',
                    pink: '#EC4899',
                    blue: '#3B82F6'
                },
                /* Override Tailwind built-in scales for warm rebrand */
                slate: {
                    50: '#FAF9F0',
                    100: '#F5F3EC',
                    200: '#E8E6DF',
                    300: '#D5D3CC',
                    400: '#9C9C95',
                    500: '#6B6B66',
                    600: '#52524D',
                    700: '#3D3D38',
                    800: '#2A2A26',
                    900: '#1A1A19',
                    950: '#111110',
                },
                indigo: {
                    50: '#FDF5F0',
                    100: '#FAE8DE',
                    200: '#F5D0BC',
                    300: '#F0B89A',
                    400: '#E89878',
                    500: '#D97757',
                    600: '#C46849',
                    700: '#A8573D',
                    800: '#8C4731',
                    900: '#703825',
                    950: '#4A2518',
                },
            },
            fontFamily: {
                sans: ['Outfit', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, #E8E6DF 1px, transparent 1px), linear-gradient(to bottom, #E8E6DF 1px, transparent 1px)",
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
                'typing-bounce': 'typingBounce 1.4s ease-in-out infinite',
                'sound-pulse': 'soundPulse 1.2s ease-out infinite',
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
                typingBounce: {
                    '0%, 60%, 100%': { transform: 'translateY(0)' },
                    '30%': { transform: 'translateY(-4px)' },
                },
                soundPulse: {
                    '0%': { transform: 'scale(0.8)', opacity: '0.8' },
                    '100%': { transform: 'scale(2)', opacity: '0' },
                },
            }
        },
    },
    plugins: [],
}

