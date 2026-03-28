import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
        screens: {
          '2xl': '1280px',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Cairo', 'system-ui', 'sans-serif'],
        display: ['Cinzel', 'serif'],
      },
      colors: {
        border: 'hsl(222 22% 16%)',
        input: 'hsl(222 22% 16%)',
        ring: 'hsl(42 87% 61%)',
        background: 'hsl(222 46% 7%)',
        foreground: 'hsl(210 40% 96%)',
        primary: {
          DEFAULT: 'hsl(42 87% 61%)',
          foreground: 'hsl(220 30% 10%)',
        },
        secondary: {
          DEFAULT: 'hsl(222 24% 14%)',
          foreground: 'hsl(210 40% 98%)',
        },
        muted: {
          DEFAULT: 'hsl(222 20% 16%)',
          foreground: 'hsl(215 20% 70%)',
        },
        accent: {
          DEFAULT: 'hsl(193 85% 56%)',
          foreground: 'hsl(220 30% 12%)',
        },
        card: {
          DEFAULT: 'hsl(222 31% 10%)',
          foreground: 'hsl(210 40% 96%)',
        },
        success: 'hsl(149 55% 55%)',
        danger: 'hsl(0 72% 64%)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        soft: '0 25px 80px rgba(3, 7, 18, 0.45)',
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top, rgba(245, 190, 74, 0.14), transparent 35%), radial-gradient(circle at bottom right, rgba(34, 197, 94, 0.12), transparent 28%)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
