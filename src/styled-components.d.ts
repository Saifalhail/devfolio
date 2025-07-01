import 'styled-components';

// Define the theme structure based on theme.js
interface Typography {
  fontSizes: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
    h1: string;
    h2: string;
    h3: string;
  };
  fontWeights: {
    light: number;
    regular: number;
    medium: number;
    semiBold: number;
    bold: number;
  };
  lineHeights: {
    tight: number;
    normal: number;
    loose: number;
  };
  fontFamily: {
    primary: string;
    heading: string;
    alt: string;
  };
}

interface Colors {
  background: string;
  primaryBg: string;
  primaryGradient: string;
  secondaryGradient: string;
  accent1: string;
  accent2: string;
  accent3: string;
  accent4: string;
  dark: string;
  darkPurple: string;
  success: string;
  warning: string;
  neutral: string;
  white: string;
  lightGray: string;
  darkGray: string;
  cardBg: string;
  cardGradient: string;
  overlay: string;
  textPrimary: string;
  textSecondary: string;
}

interface Theme {
  typography: Typography;
  colors: Colors;
  breakpoints: {
    mobile: string;
    tablet: string;
    laptop: string;
    desktop: string;
  };
  transitions: {
    default: string;
    smooth: string;
    bounce: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
    extraLarge: string;
    round: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
    neon: string;
    card: string;
  };
  animation: {
    float: string;
    pulse: string;
    fadeIn: string;
  };
}

// Extend the DefaultTheme interface
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

// Add CSS properties that TypeScript might not recognize in styled-components
declare namespace React {
  interface CSSProperties {
    [key: string]: any;
  }
}
