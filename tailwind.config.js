/** @type {import('tailwindcss').Config} */
export default {
  // Fix: The content glob has been made more specific to avoid scanning node_modules, which improves performance and prevents potential issues.
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
