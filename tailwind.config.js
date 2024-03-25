/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/app/*.tsx',
    './src/app/components/**/*.{ts,tsx}',
    './src/app/components/*.tsx',
    './src/app/pages/*.tsx',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      height: {
        a4: '297mm',
        screen: 'calc(100vh - 56px)',
      },
      width: {
        a4: '210mm',
      },
      fontFamily: {
        abc: ['ABCMonumentGroteskMono', 'sans-serif'],
        sans: ['ABCMonumentGroteskMono', 'sans-serif'],
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
      backgroundSize: {
        'size-200': '200% 200%',
      },
      backgroundPosition: {
        'pos-0': '0% 0%',
        'pos-20': '20% 20%',
        'pos-40': '40% 40%',
        'pos-60': '60% 60%',
        'pos-80': '80% 80%',
        'pos-100': '100% 100%',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
