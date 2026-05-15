import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Kinetic-Zero Color System
      colors: {
        // Semantic tokens
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        // Kinetic-Zero Trigger Colors
        volt: {
          DEFAULT: "hsl(var(--volt))",
          foreground: "hsl(var(--volt-foreground))",
        },
        alert: {
          DEFAULT: "hsl(var(--alert))",
          foreground: "hsl(var(--alert-foreground))",
        },
        crypto: {
          DEFAULT: "hsl(var(--crypto))",
          foreground: "hsl(var(--crypto-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        
        // Structure colors
        fog: "hsl(var(--fog))",
        ash: "hsl(var(--ash))",
        slate: "hsl(var(--slate))",
        
        // Sidebar
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      
      // Kinetic-Zero Typography
      fontFamily: {
        display: ['Unbounded', 'cursive'],
        body: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      
      fontSize: {
        'display-mega': ['96px', { lineHeight: '1.0', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-xl': ['72px', { lineHeight: '1.0', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-lg': ['60px', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-xl': ['48px', { lineHeight: '1.2', fontWeight: '600' }],
        'heading-lg': ['36px', { lineHeight: '1.2', fontWeight: '600' }],
        'heading-md': ['30px', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-sm': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-xl': ['20px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-lg': ['18px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '400' }],
        'body-xs': ['12px', { lineHeight: '1.5', letterSpacing: '0.02em', fontWeight: '400' }],
      },
      
      // 8-Point Grid Spacing
      spacing: {
        '0': '0px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },
      
      borderRadius: {
        'none': '0px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '40px',
        'full': '9999px',
      },
      
      boxShadow: {
        'xs': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'sm': '0 2px 4px rgba(0, 0, 0, 0.06)',
        'md': '0 4px 8px rgba(0, 0, 0, 0.08)',
        'lg': '0 8px 16px rgba(0, 0, 0, 0.10)',
        'xl': '0 12px 24px rgba(0, 0, 0, 0.12)',
        'deck': '0 -8px 30px rgba(0, 0, 0, 0.08)',
        'marker': '0 0 0 4px rgba(204, 255, 0, 0.4)',
        'volt': '0 4px 12px rgba(204, 255, 0, 0.3)',
        'volt-hover': '0 6px 16px rgba(204, 255, 0, 0.4)',
      },
      
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "gps-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 0 4px rgba(204, 255, 0, 0.4)",
            opacity: "1",
          },
          "50%": {
            boxShadow: "0 0 0 12px rgba(204, 255, 0, 0)",
            opacity: "0.8",
          },
        },
        "slide-success": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", backgroundColor: "hsl(160 84% 39%)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "beacon-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
      },
      
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gps-pulse": "gps-pulse 2s ease-in-out infinite",
        "slide-success": "slide-success 0.4s ease-out",
        "float": "float 3s ease-in-out infinite",
        "beacon-glow": "beacon-glow 2s ease-in-out infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "pulse-ring": "pulse-ring 1.5s ease-out infinite",
      },
      
      transitionDuration: {
        'instant': '100ms',
        'fast': '200ms',
        'base': '300ms',
        'slow': '400ms',
        'slower': '600ms',
        'slowest': '800ms',
      },
      
      transitionTimingFunction: {
        'in': 'cubic-bezier(0.4, 0.0, 1, 1)',
        'out': 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
