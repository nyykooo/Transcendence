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
    main: '#d21b1b',
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
export const primaryBackgroundGradient = `
  radial-gradient(circle at 12% 10%, rgba(203, 107, 61, 0.2), transparent 34%),
  radial-gradient(circle at 88% 20%, rgba(16, 122, 108, 0.15), transparent 32%),
  linear-gradient(170deg, #fff8f1 0%, #fdfaf7 45%, #f6fbfb 100%)
`;

export const secondaryBackgroundGradient = `linear-gradient(135deg, #10B981 0%, #3B82F6 100%)`;

export const typography = {
  h1: { 
    fontFamily: "'Playfair Display', serif",
    fontSize: { xs: '2rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
    fontWeight: 800, 
    lineHeight: 1.2 
  },
  h2: { 
    fontFamily: "'Montserrat', sans-serif",
    fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' },
    fontWeight: 600, 
    lineHeight: 1.3 
  },
  h3: { 
    fontFamily: "'Poppins', sans-serif",
    fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },  // Fixed
    fontWeight: 600, 
    lineHeight: 1.4 
  },
  body1: { 
    fontFamily: "'Inter', sans-serif",
    fontSize: { xs: '0.875rem', sm: '1rem' },  // Fixed
    fontWeight: 400, 
    lineHeight: 1.5 
  },
  body2: { 
    fontFamily: "'Inter', sans-serif",
    fontSize: { xs: '0.75rem', sm: '0.875rem' },  // Fixed
    fontWeight: 400, 
    lineHeight: 1.5 
  },
  caption: { 
    fontFamily: "'Inter', sans-serif",
    fontSize: { xs: '0.65rem', sm: '0.75rem' },  // Fixed
    fontWeight: 400, 
    lineHeight: 1.5 
  },
  button: {
    fontFamily: "'Inter', sans-serif",
    fontSize: { xs: '0.875rem', sm: '1rem' },  // Tamanho padrão legível
    fontWeight: 500,
    lineHeight: 1.75,
  },
};