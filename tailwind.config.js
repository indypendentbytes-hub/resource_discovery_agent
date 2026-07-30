module.exports = {
  darkMode: 'media',
  content: [
    './index.html',
    './components/**/*.{html,js,ts,jsx,tsx}',
    './src/**/*.{html,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ib: {
          green: '#00780F',
          greenAlt: '#689F38',
          denim: '#005588',
          linen: '#F3E9DD',
          cream: '#F9F4CB',
          border: '#D4CFC6',
          destructive: '#B3261E',
        },
        text: {
          primaryLight: '#1A1A1A',
          primaryDark: '#F3F3F3',
          onDenimLight: '#F3E9DD',
          onDenimDark: '#FFFFFF',
          onGreenLight: '#FFFFFF',
          onGreenDark: '#FFFFFF',
          onCreamLight: '#1A1A1A',
          onCreamDark: '#1A1A1A',
        },
      },
      boxShadow: {
        sticker: '0 2px 0 rgba(0,0,0,0.12), 0 6px 12px rgba(0,0,0,0.08)',
      },
      backgroundImage: {
        soil: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='grain'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/></filter><rect width='200' height='200' filter='url(%23grain)'/></svg>\")",
        greenSoil: 'linear-gradient(135deg, #00780F 0%, #689F38 40%, #F3E9DD 100%)',
      },
    },
  },
  plugins: [],
};
