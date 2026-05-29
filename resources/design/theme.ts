/**
 * GarageKeyPro Design System
 * Car locksmith service website theme
 * Inspired by modern automotive service design patterns
 */

export const theme = {
  // Primary brand colors - automotive blue/tech feel
  colors: {
    primary: {
      DEFAULT: 'hsl(217, 91%, 60%)', // Modern blue
      hover: 'hsl(217, 91%, 50%)',
      light: 'hsl(217, 91%, 95%)',
    },
    accent: {
      DEFAULT: 'hsl(24, 100%, 50%)', // Orange accent for CTAs
      hover: 'hsl(24, 100%, 45%)',
    },
    neutral: {
      50: 'hsl(210, 40%, 98%)',
      100: 'hsl(210, 40%, 96%)',
      200: 'hsl(214, 32%, 91%)',
      300: 'hsl(213, 27%, 84%)',
      500: 'hsl(217, 19%, 38%)',
      700: 'hsl(217, 19%, 27%)',
      900: 'hsl(222, 47%, 11%)',
    },
  },

  // Typography scale
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      heading: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
    },
    fontSize: {
      hero: ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', fontWeight: '700' }],
      h1: ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.2', fontWeight: '700' }],
      h2: ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.3', fontWeight: '600' }],
      h3: ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
      body: ['1rem', { lineHeight: '1.6' }],
      small: ['0.875rem', { lineHeight: '1.5' }],
    },
  },

  // Spacing system
  spacing: {
    section: {
      sm: '4rem', // 64px
      md: '6rem', // 96px
      lg: '8rem', // 128px
    },
    content: {
      sm: '2rem',
      md: '3rem',
      lg: '4rem',
    },
  },

  // Component design tokens
  components: {
    hero: {
      minHeight: '600px',
      background: 'linear-gradient(135deg, hsl(217, 91%, 60%) 0%, hsl(217, 91%, 40%) 100%)',
      overlay: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
    },
    card: {
      borderRadius: '1rem',
      shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      shadowHover: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
    button: {
      primary: {
        bg: 'hsl(24, 100%, 50%)',
        hover: 'hsl(24, 100%, 45%)',
        text: 'white',
        shadow: '0 4px 14px 0 rgb(255 103 0 / 39%)',
      },
      secondary: {
        bg: 'transparent',
        border: '2px solid white',
        hover: 'rgba(255,255,255,0.1)',
        text: 'white',
      },
    },
  },

  // Animation & transitions
  animation: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    hover: {
      scale: '1.05',
      lift: 'translateY(-4px)',
    },
  },
} as const;

export type Theme = typeof theme;
