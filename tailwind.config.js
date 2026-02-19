/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Dark theme backgrounds
        bg: {
          primary: "#0a0e1a",
          secondary: "#111631",
          card: "#1a1f3d",
          elevated: "#232850",
        },
        // Accent colors
        primary: "#6366f1",
        "primary-light": "#818cf8",
        "primary-dark": "#4f46e5",
        accent: "#f59e0b",
        "accent-light": "#fbbf24",
        success: "#22c55e",
        danger: "#ef4444",
        // Text
        "text-primary": "#f1f5f9",
        "text-secondary": "#94a3b8",
        "text-muted": "#64748b",
        // Borders
        "border-subtle": "#2a2f52",
        "border-active": "#6366f1",
      },
    },
  },
  plugins: [],
};
