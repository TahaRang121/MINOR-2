/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#c0d7ff',
          300: '#a0c3ff',
          400: '#80afff',
          500: '#6084ff',
          600: '#4f6aff',
          700: '#3f50ff',
          800: '#2f36ff',
          900: '#1f1cff',
        },
        secondary: {
          50: '#f8f0ff',
          100: '#f0e0ff',
          200: '#e0c0ff',
          300: '#d0a0ff',
          400: '#c080ff',
          500: '#b060ff',
          600: '#a04fff',
          700: '#903fff',
          800: '#802fff',
          900: '#701fff',
        },
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        accent: {
          cyan: '#00d9ff',
          purple: '#b060ff',
          pink: '#ff006e',
          green: '#00ff88',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.625rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-down': 'fadeDown 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'slide-in-down': 'slideInDown 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.6s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 4s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeDown: {
          from: {
            opacity: '0',
            transform: 'translateY(-20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeIn: {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
        slideInLeft: {
          from: {
            opacity: '0',
            transform: 'translateX(-40px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideInRight: {
          from: {
            opacity: '0',
            transform: 'translateX(40px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideInDown: {
          from: {
            opacity: '0',
            transform: 'translateY(-40px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        scaleIn: {
          from: {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
        glow: {
          '0%, 100%': {
            'box-shadow': '0 0 5px rgba(96, 132, 255, 0.5), 0 0 10px rgba(176, 96, 255, 0.3)',
          },
          '50%': {
            'box-shadow': '0 0 20px rgba(96, 132, 255, 0.8), 0 0 30px rgba(176, 96, 255, 0.5)',
          },
        },
        pulseGlow: {
          '0%, 100%': {
            opacity: '1',
            'box-shadow': '0 0 5px rgba(0, 217, 255, 0.3)',
          },
          '50%': {
            opacity: '0.8',
            'box-shadow': '0 0 30px rgba(0, 217, 255, 0.6)',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-hero': 'linear-gradient(135deg, #6084ff 0%, #b060ff 50%, #ff006e 100%)',
        'gradient-dashboard': 'linear-gradient(135deg, rgba(96, 132, 255, 0.1) 0%, rgba(176, 96, 255, 0.1) 50%, rgba(255, 0, 110, 0.05) 100%)',
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(96, 132, 255, 0.5)',
        'glow': '0 0 20px rgba(96, 132, 255, 0.6), 0 0 40px rgba(176, 96, 255, 0.3)',
        'glow-lg': '0 0 40px rgba(96, 132, 255, 0.8), 0 0 80px rgba(176, 96, 255, 0.5)',
        'glow-cyan': '0 0 20px rgba(0, 217, 255, 0.5)',
        'glow-purple': '0 0 20px rgba(176, 96, 255, 0.5)',
        'inner-glow': 'inset 0 0 20px rgba(96, 132, 255, 0.2)',
      },
      blur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.glass': {
          'background': 'rgba(15, 23, 42, 0.5)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-sm': {
          'background': 'rgba(15, 23, 42, 0.3)',
          'backdrop-filter': 'blur(8px)',
          'border': '1px solid rgba(255, 255, 255, 0.08)',
        },
        '.glass-lg': {
          'background': 'rgba(15, 23, 42, 0.7)',
          'backdrop-filter': 'blur(12px)',
          'border': '1px solid rgba(255, 255, 255, 0.12)',
        },
        '.glow-border': {
          'border': '1px solid',
          'border-image': 'linear-gradient(135deg, rgba(96, 132, 255, 0.5), rgba(176, 96, 255, 0.3)) 1',
        },
      });
    },
  ],
}
