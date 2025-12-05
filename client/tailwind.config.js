/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#FF5200', // Example brand color (orange-red like Swiggy/Zomato)
                secondary: '#2B2B2B',
            },
            fontFamily: {
                sans: ['Outfit', 'Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
