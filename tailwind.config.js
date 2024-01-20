module.exports = {
  content: ['./src/**/*.{jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '100% 200%',
            'background-position': 'center top',
          },
          '50%': {
            'background-size': '100% 200%',
            'background-position': 'center bottom',
          },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 100%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 100%',
            'background-position': 'right center',
          },
        },
      },
    },
  },
  variants: {},
  plugins: [],
};
