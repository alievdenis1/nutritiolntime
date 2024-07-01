
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx,vue}',
    './components/**/*.{ts,tsx,vue}',
    './app/**/*.{ts,tsx,vue}',
    './src/**/*.{ts,tsx,vue}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontSize: {
        base: ['16px', '20px'],
        sm: ['14px', '18px'],
        xs: ['12px', '16px'],
        lg: ['18px', '22px'],
        xl: ['20px', '24px'],
        xxl: ['28px', '32px']
      },
      borderColor: {
        'custom-gray': '#1C1C1C0D',
      },
      borderWidth: {
        '1': '1px',
      },
      boxShadow: {
        DEFAULT: '0px 3px 2px rgba(237, 216, 194, 0.35)',
        custom: '0px 0px 34px 0px #00000014'
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif']
      },
      colors: {
        mainBg: '#FCFCFC',
        forestGreen: '#319A6E',
        lightGray: '#F3F3F3',
        darkGray: '#1c1c1c',
        slateGray:'#535353',
        transparent: 'transparent',
        gray:'#9F9FA0',
        orange: '#FFA767',
        black: '#000000',
        white: '#FFFFFF',
        brown: '#968D7D',
        beige: '#FBF3E6',
        green: '#056760',
        red: '#E75854',
        yellow: '#FFD274',
        blue: {
          DEFAULT: '0069A5',
          100: '#019FB5'
        },
        borderRadius: {
          DEFAULT: '15px',
          none: 'none'
        },
        keyframes: {
          'accordion-down': {
            from: { height: 0 },
            to: { height: 'var(--radix-accordion-content-height)' },
          },
          'accordion-up': {
            from: { height: 'var(--radix-accordion-content-height)' },
            to: { height: 0 },
          },
        },
        animation: {
          'accordion-down': 'accordion-down 0.2s ease-out',
          'accordion-up': 'accordion-up 0.2s ease-out',
        },
      },
    },
    plugins: [],
  }
}