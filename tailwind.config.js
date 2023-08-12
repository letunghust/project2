module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    theme: {
        extend: {
            spacing: Object.fromEntries([...Array(2000)].map((_, i) => [i, `${i / 4}rem`])),
            fontSize: Object.fromEntries([...Array(200)].map((_, i) => [i, `${i / 16}rem`])),
            lineHeight: Object.fromEntries([...Array(200)].map((_, i) => [i, `${i / 16}rem`])),
            borderRadius: Object.fromEntries([...Array(40)].map((_, i) => [i, `${i / 16}rem`])),
            borderWidth: Object.fromEntries([...Array(40)].map((_, i) => [i, `${i / 16}rem`])),
            letterSpacing: Object.fromEntries([...Array(10)].map((_, i) => [i, `${i / 16}rem`])),
            screens: {
                pc: '1400px',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
