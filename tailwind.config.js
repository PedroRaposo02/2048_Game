/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
          background_color:' #faf8ef',
          grid_color: '#b9ada0',
          text_color: '#776e65',
          new_game_color: '#8d7a66',
          cell1_color: '#cbc1b4',
          cell2_color: '#ede4da',
          cell4_color: '#ece1c9',
          cell8_color: '#edb279',
          cell16_color: '#ee9763',
          cell32_color: '#ee7d5f',
          cell64_color: '#ec613b',
          cell128_color: '#e9d070',
          cell256_color: '#e9cc5e',
          cell512_color: '#e9c94b',
          cell1024_color: '#edc53f',
          cell2048_color: '#edc22e',
      },
      fontFamily: {
        'body': ['"Clear Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('child', '& > *');
      addVariant('child-hover', '& > *:hover');
    }
  ],
}

