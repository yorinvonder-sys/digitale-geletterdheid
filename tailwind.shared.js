export const sharedTailwindConfig = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                lab: {
                    bg: '#FCF6EA',
                    surface: '#FFFFFF',
                    primary: '#D97848',
                    primaryDark: '#D97848',
                    accent: '#5F947D',
                    secondary: '#0B453F',
                    dark: '#08283B',
                    text: '#445865',
                    textLight: '#445865',
                    green: '#5F947D',
                    purple: '#0B453F',
                    pink: '#D97848',
                    blue: '#0B453F'
                },
                slate: {
                    50: '#FCF6EA',
                    100: '#FCF6EA',
                    200: '#E7D8BD',
                    300: '#E7D8BD',
                    400: '#445865',
                    500: '#445865',
                    600: '#445865',
                    700: '#445865',
                    800: '#08283B',
                    900: '#08283B',
                    950: '#111110',
                },
                indigo: {
                    50: '#FCF6EA',
                    100: '#F3E4CB',
                    200: '#E7D8BD',
                    300: '#F0B89A',
                    400: '#E89878',
                    500: '#D97848',
                    600: '#D97848',
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
                'grid-pattern': "linear-gradient(to right, #E7D8BD 1px, transparent 1px), linear-gradient(to bottom, #E7D8BD 1px, transparent 1px)",
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
};
