/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.css",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",

        // Sidebar & chart colors
        sidebar: "var(--sidebar)",
        "sidebar-foreground": "var(--sidebar-foreground)",
        "sidebar-primary": "var(--sidebar-primary)",
        "sidebar-primary-foreground": "var(--sidebar-primary-foreground)",
        "sidebar-accent": "var(--sidebar-accent)",
        "sidebar-accent-foreground": "var(--sidebar-accent-foreground)",
        "sidebar-border": "var(--sidebar-border)",
        "sidebar-ring": "var(--sidebar-ring)",
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
      },

      fontFamily: {
        sans: [
          "Inter",
          "Noto Sans Vietnamese",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "'Helvetica Neue'",
          "Arial",
          "sans-serif",
        ],
        display: ["Fraunces", "serif"],
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "pulse-glow": {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 0 0 rgba(255, 182, 193, 0.4)",
          },
          "50%": {
            opacity: "0.8",
            boxShadow: "0 0 0 8px rgba(255, 182, 193, 0)",
          },
        },
      },

      animation: {
        shimmer: "shimmer 2s infinite linear",
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },

      boxShadow: {
        soft: "0 2px 8px rgba(255, 182, 193, 0.15)",
        card: "0 4px 12px rgba(255, 182, 193, 0.1)",
      },

      backdropBlur: {
        glass: "12px",
      },

      backgroundImage: {
        "gradient-text": "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), // nếu bạn cài thư viện này
  ],
};
