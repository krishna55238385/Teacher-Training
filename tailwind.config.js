/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecf3ff',
          100: '#dbe9fe',
          200: '#bfd7fe',
          300: '#93bffa',
          400: '#60a0f7',
          500: '#3b82f6',
          600: '#1E62F2',
          700: '#175cdb',
          800: '#1e4baf',
          900: '#1e3f8a',
          950: '#172554',
        },
        secondary: '#F4F6FA',
        accent: '#FFCC00',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
