/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      keyframes: {
        fadeInKF: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideInKF: {
          "0%": { opacity: 0, transform: "translateY(-128px)" },
          "100%": { opacity: 1, transform: "translateY(0px)" },
        },
        questionSlideInKF: {
          "0%": { opacity: 0, transform: "translateY(-48px)" },
          "100%": { opacity: 1, transform: "translateY(0px)" },
        },
        questionSlideNextKF: {
          "0%": { opacity: 0, transform: "translateX(32px)" },
          "100%": { opacity: 1, transform: "translateX(0px)" },
        },
        slideFromBottomKF: {
          "0%": { opacity: 0, transform: "translateY(32px)" },
          "100%": { opacity: 1, transform: "translateY(0px)" },
        },
        hideAwayUp: {
          "0%": { opacity: 1, height: "20vh" },
          "100%": { opacity: 0, height: "0vh" },
        },
        shakeInput: {
          "0%": {
            transform: "translateX(10px)",
          },
          "25%": {
            transform: "translateX(-10px)",
          },
          "50%": {
            transform: "translateX(5px)",
          },
          "100%": {
            transform: "translateX(0px)",
          },
        },
      },
      animation: {
        shakeInput: "shakeInput 0.3s",
        fadeIn: "fadeInKF 1s ease-out 1",
        slideIn: "slideInKF 1s ease-out 1 forwards",
        questionSlideIn: "questionSlideInKF 0.4s ease-out forwards",
        questionSlideNext: "questionSlideNextKF 0.4s ease-out forwards",
        slideFromBottom: "slideFromBottomKF 0.2s ease-out forwards",
        hideAwayUp: "hideAwayUp 0.4s ease-out forwards",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
