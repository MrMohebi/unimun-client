module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize:{
        tiny:'0.65em'
      },
      spacing: {
        'nav': '60px',
        '0p':'0%'
      },
      colors:{
        primary:'#1DA1F2',
        textBlack:'#292D32',
        textDark:'#657786',
        textDarker:'#5B5F64',
        textBright:'#E1E8ED',
        background:'#F6F8FA',
        errorRed:'#FF1E60'
      }
    },
  },
  plugins: [],
}
