import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: '#003865',
        orange: '#FF6B00',
        teal: '#0D9488',
        green: { DEFAULT: '#059669' },
        centrum: {
          green: '#059669',
          amber: '#D97706',
          red: '#DC2626',
        },
      },
      fontFamily: {
        title: ['Montserrat', 'sans-serif'],
        body: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
