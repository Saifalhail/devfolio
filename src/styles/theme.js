// Main theme object with all styling properties
const theme = {
  // Typography properties
  typography: {
    fontSizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      md: '1rem',       // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      xxl: '1.5rem',    // 24px
      h1: '1.75rem',    // 28px
      h2: '1.5rem',     // 24px
      h3: '1.25rem',    // 20px
    },
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      loose: 1.8,
    },
    fontFamily: {
      primary: "'Inter', 'Roboto', sans-serif",
      heading: "'Poppins', sans-serif",
      alt: "'Comic Neue', cursive",
    },
  },
  
  // Color palette
  colors: {
    background: '#feefc4', // Light cream background
    primaryBg: '#12142c', // Dark background base color
    primaryGradient: 'linear-gradient(135deg, #12142c 0%, #202253 50%, #3a1e65 100%)', // Purple gradient
    secondaryGradient: 'linear-gradient(45deg, #3a1e65 0%, #6031a8 100%)', // Secondary purple gradient
    accent1: '#faaa93', // Coral accent for primary actions
    accent2: '#82a1bf', // Soft blue for secondary actions
    accent3: '#ff5b92', // Pink accent for highlights
    accent4: '#00e5bd', // Teal for decorative elements
    dark: '#513a52', // Deep purple for text and important elements
    darkPurple: '#2a1252', // Dark purple for subtle elements
    success: '#4CAF50', // Success states
    warning: '#FFC107', // Warning states
    neutral: '#9E9E9E', // Neutral gray
    white: '#FFFFFF',
    lightGray: '#f7f9fc',
    darkGray: '#9194c6',
    cardBg: 'rgba(35, 38, 85, 0.6)', // Semi-transparent card background
    cardGradient: 'linear-gradient(to bottom, rgba(55, 42, 99, 0.7) 0%, rgba(37, 38, 89, 0.8) 100%)',
    overlay: 'rgba(18, 20, 44, 0.8)', // Overlay for modals
    textPrimary: '#513a52',
    textSecondary: '#666',
  },
  // Fonts moved to typography object
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    laptop: '992px',
    desktop: '1200px',
  },
  transitions: {
    default: 'all 0.3s ease',
    smooth: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
    bounce: 'all 0.5s cubic-bezier(0.68, -0.6, 0.32, 1.6)',
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '5rem',
  },
  borderRadius: {
    small: '6px',
    medium: '12px',
    large: '20px',
    extraLarge: '30px',
    round: '50%',
  },
  shadows: {
    small: '0 2px 8px rgba(0, 0, 0, 0.2)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.3)',
    large: '0 8px 24px rgba(0, 0, 0, 0.4)',
    neon: '0 0 15px rgba(66, 165, 245, 0.5), 0 0 30px rgba(66, 165, 245, 0.3)', // Neon glow for buttons
    card: '0 10px 30px rgba(0, 0, 0, 0.4)',
  },
  animation: {
    float: 'float 6s ease-in-out infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    fadeIn: 'fadeIn 0.5s ease',
  },
};

export default theme;
