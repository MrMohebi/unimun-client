module.exports = {
    important: true,
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {

        extend: {
            borderWidth: {
                DEFAULT: '1px',
                '0': '0',
                '2': '2px',
                '3': '3px',
                '4': '4px',
                '6': '6px',
                '8': '8px',
            },
            borderRadius: {
                'mob-size': '2rem'
            },

            maxWidth: {
                'mob-w': '19rem'
            },
            maxHeight: {
                'mob-h': '40rem',
            },
            fontSize: {
                tiny: '0.65em'
            },
            spacing: {
                'nav': '60px',
                '0p': '0%',
                'inputBorder': '3px',
                'mob-round': '2rem',

            },
            colors: {
                primary: '#1DA1F2',
                textBlack: '#292D32',
                textDark: '#657786',
                textDarker: '#5B5F64',
                textBright: '#E1E8ED',
                background: '#F6F8FA',
                errorRed: '#FF1E60'
            }
        },
    },
    plugins: [],
}
