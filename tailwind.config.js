/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Surfaces
        canvas: '#FAFCFA',
        card: '#FFFFFF',
        sage: {
          50: '#F4F8F2',
          100: '#EAF1E6',
          200: '#DCE7D5',
          300: '#C7D7BD',
        },
        line: {
          DEFAULT: '#E5ECE0',
          strong: '#D6E0CE',
        },
        // Text
        ink: {
          900: '#19271F', // near-black, faint green undertone
          800: '#26352B',
          700: '#3A4A40',
          600: '#51625A',
        },
        muted: '#5E6F66',
        faint: '#8A988F',
        // Primary green (Capy's hoodie) — keyed as "brand" so existing tone refs map here
        brand: {
          50: '#F0F7EC',
          100: '#DCEFCF',
          200: '#BFE0AB',
          300: '#9BCD80',
          400: '#79B855',
          500: '#5CA13A',
          600: '#4A8A2E',
          700: '#3A6E24',
        },
        // Soft teal-green
        mint: {
          50: '#E8F6F0',
          100: '#D2EEE3',
          400: '#4FBF9A',
          500: '#2FA882',
        },
        // Warm gold (achievements)
        gold: {
          50: '#FBF3DE',
          100: '#F6E7BC',
          400: '#E6B23E',
          500: '#D29423',
        },
        // Muted amber (warnings) — keyed as "sun"
        sun: {
          50: '#FBF1E0',
          100: '#F6E2C2',
          400: '#DDA24B',
          500: '#C2772A',
        },
        // Warm clay (replaces pink) — keyed as "flamingo"
        flamingo: {
          50: '#F8ECE5',
          100: '#F0D8CB',
          400: '#D08763',
          500: '#BC6E48',
        },
        // Soft lagoon teal (replaces cyber-blue) — keyed as "sky2"
        sky2: {
          50: '#E7F1F3',
          100: '#D2E6E9',
          400: '#5AA7B5',
          500: '#3E8C9B',
        },
        // Bright leaf (Byte's glow) — keyed as "lime"
        lime: {
          50: '#EEF7DF',
          100: '#DEEFC2',
          400: '#84C53F',
          500: '#6FAE2E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      spacing: {
        4.5: '1.125rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(25,39,31,0.04), 0 8px 24px -12px rgba(25,39,31,0.12)',
        card: '0 1px 2px rgba(25,39,31,0.04), 0 12px 32px -18px rgba(25,39,31,0.18)',
        lift: '0 2px 4px rgba(25,39,31,0.05), 0 18px 40px -16px rgba(74,138,46,0.28)',
        ring: '0 0 0 4px rgba(92,161,58,0.12)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.025)' },
        },
        pop: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '60%': { transform: 'scale(1.04)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        breathe: 'breathe 5s ease-in-out infinite',
        pop: 'pop 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      },
    },
  },
  plugins: [],
}
