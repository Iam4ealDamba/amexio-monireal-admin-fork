/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,jsp,ts}"],
    theme: {
        extend: {
            colors: {
                "tw-text-white": "#fff",
                "tw-text-black": "#212121",
                "tw-bg": "#f4f4f4",
                "tw-primary": "#0066ff",
                "tw-success": "#6cf080",
                "tw-danger": "#f06c6c",
                "tw-warning": "#f0DA6c"
            },
            screens: {
                'max-2xl': { 'max': '1410px' },
                'max-xl': { 'max': '1230px' },
            }
        },
    },
    plugins: [],
};
