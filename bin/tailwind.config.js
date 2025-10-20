/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["../sources/**/*.tsx", "../sources/**/*.ts"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
