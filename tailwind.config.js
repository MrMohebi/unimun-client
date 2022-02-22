module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize:{
        tiny:'0.6em'
      },
      spacing: {
        'nav': '68px',
        '0p':'0%'
      },
      boxShadow: {
        'top': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      },
      colors:{
        primary:'#1DA1F2',
        textBlack:'#292D32',
        textDark:'#657786',
        textDarker:'#5B5F64',
        background:'#F6F8FA'
      }
    },
  },
  plugins: [],
}
