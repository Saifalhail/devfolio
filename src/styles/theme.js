const theme = {
  colors: {
    primaryBg: '#12142c', // Dark background base color
    primaryGradient: 'linear-gradient(135deg, #12142c 0%, #202253 50%, #3a1e65 100%)', // Purple gradient
    secondaryGradient: 'linear-gradient(45deg, #3a1e65 0%, #6031a8 100%)', // Secondary purple gradient
    accent1: '#42a5f5', // Blue accent for buttons and highlights
    accent2: '#00d4ff', // Light blue for secondary elements
    accent3: '#ff5b92', // Pink accent for highlights
    accent4: '#00e5bd', // Teal for decorative elements
    dark: '#0a0a1a', // Extra dark color for contrast
    darkPurple: '#2a1252', // Dark purple for subtle elements
    white: '#ffffff',
    lightGray: '#e8e9fd',
    darkGray: '#9194c6',
    cardBg: 'rgba(35, 38, 85, 0.6)', // Semi-transparent card background
    cardGradient: 'linear-gradient(to bottom, rgba(55, 42, 99, 0.7) 0%, rgba(37, 38, 89, 0.8) 100%)',
    overlay: 'rgba(18, 20, 44, 0.8)', // Overlay for modals
  },
  fonts: {
    main: "'Inter', 'Roboto', sans-serif",
    display: "'Poppins', sans-serif", // For headings and display text
    alt: "'Comic Neue', cursive", // For the cartoon-style elements
  },
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
