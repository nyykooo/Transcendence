export const palette = {
  primary: {
    main: '#CB6B3D',
    light: '#E8956B',
    dark: '#9D4F2A',
  },
  secondary: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
  },
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
  },
  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706',
  },
  success: {
    main: '#10B981',
    light: '#6EE7B7',
    dark: '#047857',
  },
  info: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#1D4ED8',
  },
  background: {
    default: '#FFFFFF',
    paper: '#F9FAFB',
  },
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    disabled: '#D1D5DB',
  },
  border: '#E5E7EB',
};

// Para aplicar o gradiente ao fundo:
export const backgroundGradient = `
  radial-gradient(circle at 12% 10%, rgba(203, 107, 61, 0.2), transparent 34%),
  radial-gradient(circle at 88% 20%, rgba(16, 122, 108, 0.15), transparent 32%),
  linear-gradient(170deg, #fff8f1 0%, #fdfaf7 45%, #f6fbfb 100%)
`;

export const typography = {
  h1: { 
    fontFamily: "'Playfair Display', serif",
    fontSize: '32px', 
    fontWeight: 700, 
    lineHeight: 1.2 
  },
  h2: { 
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '28px', 
    fontWeight: 600, 
    lineHeight: 1.3 
  },
  h3: { 
    fontFamily: "'Poppins', sans-serif",
    fontSize: '24px', 
    fontWeight: 600, 
    lineHeight: 1.4 
  },
  body1: { 
    fontFamily: "'Inter', sans-serif",
    fontSize: '16px', 
    fontWeight: 400, 
    lineHeight: 1.5 
  },
  body2: { 
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px', 
    fontWeight: 400, 
    lineHeight: 1.5 
  },
  caption: { 
    fontFamily: "'Inter', sans-serif",
    fontSize: '12px', 
    fontWeight: 400, 
    lineHeight: 1.5 
  },
};