import type { Config } from "tailwindcss";

/**
 * Design tokens for Cameroon Catering Service.
 * Palette leans on warm, trustworthy greens (growth, freshness) with a
 * gold accent (celebration, premium) — a nod to the Cameroonian flag and
 * the festive nature of catering.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefdf3",
          100: "#d6f9e2",
          200: "#b0f0c9",
          300: "#7be3a9",
          400: "#41cd82",
          500: "#1eb268", // primary
          600: "#128f53",
          700: "#0f7145",
          800: "#105a39",
          900: "#0e4a31",
          950: "#04291a",
        },
        gold: {
          50: "#fdfaec",
          100: "#faf1c6",
          200: "#f5e18a",
          300: "#efca4e",
          400: "#eab225",
          500: "#d99418", // accent
          600: "#bb7112",
          700: "#955013",
          800: "#7b4016",
          900: "#693518",
          950: "#3d1c09",
        },
        ink: {
          DEFAULT: "#1a2b23",
          soft: "#455a4f",
          faint: "#7c8f85",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 90, 57, 0.04), 0 8px 24px rgba(16, 90, 57, 0.06)",
        lift: "0 8px 30px rgba(16, 90, 57, 0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
