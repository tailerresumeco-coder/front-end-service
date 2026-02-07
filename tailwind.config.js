export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Work Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        // Brand colors
        'brand-primary': '#06b6d4', // cyan-400
        'brand-primary-hover': '#0891b2', // cyan-500
        'brand-secondary': '#9333ea', // purple-600
        'brand-secondary-dark': '#581c87', // purple-900

        // Surface colors
        'surface-dark': '#0f172a', // slate-900
        'surface-dark-mid': '#1e293b', // slate-800
        'surface-dark-light': '#334155', // slate-700

        // Text colors
        'text-primary': '#ffffff',
        'text-secondary': '#d1d5db', // gray-300
        'text-muted': '#9ca3af', // gray-400
        'text-subtle': '#6b7280', // gray-500

        // Border colors
        'border-primary': 'rgba(6, 182, 212, 0.3)', // cyan-500/30
        'border-secondary': '#6b7280', // gray-500
      },
      fontSize: {
        'nav': ['1.25rem', { lineHeight: '1.75rem' }], // text-xl
        'heading': ['3rem', { lineHeight: '1' }], // text-5xl
        'badge': ['0.875rem', { lineHeight: '1.25rem' }], // text-sm
        'body': ['1.125rem', { lineHeight: '1.75rem' }], // text-lg
        'body-small': ['1rem', { lineHeight: '1.75rem' }], // text-base
      },
      spacing: {
        'container-x': '2rem', // px-8
        'nav-y': '1.5rem', // py-6
        'content-y': '5rem', // py-20
        'grid-gap': '3rem', // gap-12
        'margin-bottom-large': '2rem', // mb-8
        'margin-bottom-medium': '1.5rem', // mb-6
        'margin-bottom-xl': '2.5rem', // mb-10
        'margin-top-large': '3rem', // mt-12
      },
      borderRadius: {
        'dot': '9999px', // rounded-full
        'button': '0.5rem', // rounded-lg
        'card': '1rem', // rounded-2xl
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
