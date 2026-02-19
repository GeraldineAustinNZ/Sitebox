/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          50: '#f6f7f8',
          100: '#e1e4e8',
          200: '#c4c9d1',
          300: '#9da5b1',
          400: '#7a8290',
          500: '#5f6876',
          600: '#4a525e',
          700: '#3d444d',
          800: '#2d3238',
          900: '#1a1d21',
        },
        ocean: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#b9e3fe',
          300: '#7ccbfc',
          400: '#36aff8',
          500: '#0c93e9',
          600: '#0074c7',
          700: '#015da1',
          800: '#064f85',
          900: '#0b426e',
        },
        sage: {
          50: '#f6f8f6',
          100: '#e3e9e3',
          200: '#c7d3c9',
          300: '#a1b5a5',
          400: '#7a9580',
          500: '#5d7963',
          600: '#48604e',
          700: '#3b4e40',
          800: '#324136',
          900: '#2b362e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
};
