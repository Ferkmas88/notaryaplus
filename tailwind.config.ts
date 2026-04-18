import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1B3356",
          light: "#234170",
          dark: "#122338",
        },
        gold: {
          DEFAULT: "#C8A214",
          light: "#E6BC22",
          dark: "#9A7C0F",
        },
        mint: {
          DEFAULT: "#C5E8D5",
          light: "#EAF7EF",
          dark: "#9ED4B5",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        wingFlap: {
          "0%, 92%, 100%": { transform: "scaleX(1)" },
          "94%": { transform: "scaleX(1.06)" },
          "96%": { transform: "scaleX(0.97)" },
          "98%": { transform: "scaleX(1.04)" },
        },
        slideUpFade: {
          "0%": { opacity: "0", transform: "translateY(20px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        statusBlink: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.55", transform: "scale(0.85)" },
        },
        fabBounceIn: {
          "0%": { transform: "translateY(120%) scale(0.4)", opacity: "0" },
          "60%": { transform: "translateY(-8%) scale(1.05)", opacity: "1" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "15%": { transform: "rotate(-10deg)" },
          "30%": { transform: "rotate(8deg)" },
          "45%": { transform: "rotate(-6deg)" },
          "60%": { transform: "rotate(4deg)" },
          "75%": { transform: "rotate(-2deg)" },
        },
        thinkingTilt: {
          "0%, 100%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(4deg)" },
        },
        attentionRing: {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(1.9)", opacity: "0" },
        },
        attentionPulse: {
          "0%, 100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(200, 162, 20, 0)" },
          "40%": { transform: "scale(1.08)", boxShadow: "0 0 0 18px rgba(200, 162, 20, 0)" },
          "50%": { boxShadow: "0 0 0 0 rgba(200, 162, 20, 0.55)" },
        },
        hintSlideIn: {
          "0%": { opacity: "0", transform: "translateX(12px) scale(0.9)" },
          "100%": { opacity: "1", transform: "translateX(0) scale(1)" },
        },
        eyeBlink: {
          "0%, 94%, 100%": { filter: "brightness(1) contrast(1)" },
          "96%": { filter: "brightness(0.78) contrast(1.25)" },
          "98%": { filter: "brightness(1) contrast(1)" },
        },
        stampDrop: {
          "0%": { opacity: "0", transform: "translateY(-120px) rotate(-25deg) scale(1.8)" },
          "65%": { opacity: "1", transform: "translateY(6px) rotate(-12deg) scale(1.05)" },
          "80%": { transform: "translateY(-3px) rotate(-8deg) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) rotate(-6deg) scale(1)" },
        },
        stampPulse: {
          "0%, 100%": { transform: "rotate(-6deg) scale(1)" },
          "50%": { transform: "rotate(-6deg) scale(1.04)" },
        },
        docFloat: {
          "0%, 100%": { transform: "translateY(0) rotate(-3deg)" },
          "50%": { transform: "translateY(-8px) rotate(-2deg)" },
        },
        countUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        modalIn: {
          "0%": { opacity: "0", transform: "translateY(20px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        backdropIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "wing-flap": "wingFlap 8s ease-in-out infinite",
        "slide-up-fade": "slideUpFade 260ms ease-out",
        "status-blink": "statusBlink 2s ease-in-out infinite",
        "fab-bounce-in": "fabBounceIn 600ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        wiggle: "wiggle 650ms ease-in-out",
        "thinking-tilt": "thinkingTilt 1.2s ease-in-out infinite",
        "attention-ring": "attentionRing 1.8s ease-out infinite",
        "attention-pulse": "attentionPulse 2.4s ease-in-out infinite",
        "hint-slide-in": "hintSlideIn 400ms ease-out",
        "eye-blink": "eyeBlink 5s ease-in-out infinite",
        "stamp-drop": "stampDrop 900ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "stamp-pulse": "stampPulse 2.8s ease-in-out infinite",
        "doc-float": "docFloat 4s ease-in-out infinite",
        "count-up": "countUp 400ms ease-out forwards",
        "modal-in": "modalIn 300ms ease-out",
        "backdrop-in": "backdropIn 200ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
