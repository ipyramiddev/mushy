const colors = require('tailwindcss/colors');
module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    zIndex: {
      '5': 5,
      '50': 50,
      '100': 100
    },
    extend: {
      height: {
        '144': '36rem',
        '160': '40rem'
      },
      width: {
        '144': '36rem',
        '160': '40rem'
      },
      fontSize: {
        'xxs': '.65rem',
      },
      inset: {
        '1/7': '15%'
      },
      colors: {
        primary: colors.sky,
        secondary: colors.pink,
        gray: {
          DEFAULT: '#737373',
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#C5C5C5',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        blue: {
          DEFAULT: '#4FBBEB',
          '50': '#DFF3FB',
          '100': '#CFEDFA',
          '200': '#AFE0F6',
          '300': '#8FD4F2',
          '400': '#6FC7EF',
          '500': '#4FBBEB',
          '600': '#21A9E6',
          '700': '#168ABE',
          '800': '#106991',
          '900': '#0B4863'
        },
        white: colors.white,
        "header-pink": '#EFDBFF',
        "almost-black": '#010101',
        "modal-black": "rgba(0, 0, 0, 0.75)",
        "dark-footer": '#111111',
        "color-main-primary": 'var(--color-main-primary)',
        "color-main-secondary": 'var(--color-main-secondary)',
        "color-main-gray-medium": 'var(--color-main-gray-medium)',
        "color-main-gray-lighter": 'var(--color-main-gray-lighter)',
        "color-main-tertiary": 'var(--color-main-tertiary)',
        "color-blue-primary": 'var(--color-blue-primary)',
        "color-blue-secondary": 'var(--color-blue-secondary)',
        "orange": 'var(--color-orange)',
        "slateblue": 'var(--color-slateblue)',
        "color-border": 'var(--color-border)',
        "color-main-bg": 'var(--color-main-bg)',
        "solana-teal": '#2EE9A8',
        "solana-magenta": '#CF35EC',
        "twitter-blue": '#1DA1F2',
        "discord-blue": '#5865F2',
        "bc-blue-pastel": '#6D748E',
        "bd-blue-color": '#344E8B',
      }
    },
    boxShadow: {
      'header': '0px 1px 0px rgba(0, 0, 0, 0.15)',
      none: 'none',
    }
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      ringColor: ['hover'],
      borderColor: ['hover'],
      pointerEvents: ['hover', 'focus'],
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio')
  ],
};
