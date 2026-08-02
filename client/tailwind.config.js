/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0F1419",
        surface: "#1A2129",
        surface2: "#212B35",
        border: "#2A323C",
        text: "#EDEFF2",
        muted: "#8B95A1",
        mint: "#34D399",
        warn: "#FBBF24",
        danger: "#F87171",
        blue: "#60A5FA",
      },
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
