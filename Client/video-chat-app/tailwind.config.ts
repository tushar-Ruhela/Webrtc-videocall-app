// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'border-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'border-spin': 'border-spin 4s linear infinite',
      },
      colors: {
      gray: {
        850: "#1e1e1e",
      },
    },
    },

  },
  plugins: [],
}
