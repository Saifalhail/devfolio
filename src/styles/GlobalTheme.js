import { css } from 'styled-components';

// Main color palette - Standardized across the application
export const colors = {
  // Primary theme colors
  background: {
    primary: '#1a1a20',
    secondary: '#1d1d25',
    card: '#1c1c24',
    hover: '#1e1e28',
  },
  accent: {
    primary: '#cd3efd',    // Bright purple
    secondary: '#7b2cbf',  // Dark purple
    tertiary: '#513a52',   // Deep purple (for text)
  },
  text: {
    primary: '#ffffff',
    secondary: '#cccccc',
    muted: '#999999',
    disabled: '#666666',
  },
  
  // Status colors
  status: {
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#82a1bf',
    neutral: '#9E9E9E',
  },
  
  // Gradient definitions
  gradients: {
    primary: 'linear-gradient(145deg, #1a1a20, #1d1d25)',
    card: 'linear-gradient(145deg, #1c1c24, #1e1e28)',
    accent: 'linear-gradient(to right, #cd3efd, #7b2cbf)',
    button: 'linear-gradient(to right, #cd3efd, #7b2cbf)',
    hover: 'linear-gradient(to right, #d14eff, #8d3cd0)',
  }
};

// Consistent spacing system
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  xxl: '3rem',     // 48px
};

// Border radius system
export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  round: '50%',
};

// Shadow system
export const shadows = {
  sm: '0 2px 5px rgba(0, 0, 0, 0.15)',
  md: '0 4px 10px rgba(0, 0, 0, 0.2)',
  lg: '0 8px 20px rgba(0, 0, 0, 0.25)',
  xl: '0 10px 30px rgba(0, 0, 0, 0.3)',
  inner: 'inset 0 2px 5px rgba(0, 0, 0, 0.15)',
};

// Typography system with default values to prevent undefined errors
export const typography = {
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
  }
};

// Z-index system
export const zIndex = {
  base: 0,
  elevated: 10,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  toast: 500,
};

// Media query breakpoints
export const breakpoints = {
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1400px',
};

// Consistent transition effects
export const transitions = {
  fast: 'all 0.2s ease',
  medium: 'all 0.3s ease',
  slow: 'all 0.5s ease',
  bounce: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

// Reusable mixins
export const mixins = {
  // Flexbox helpers
  flexCenter: css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  flexBetween: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  flexColumn: css`
    display: flex;
    flex-direction: column;
  `,
  
  // Card styling with optional hover effect
  card: (hoverEffect = true) => css`
    background: ${colors.gradients.card};
    border-radius: ${borderRadius.lg};
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: ${shadows.md};
    transition: ${transitions.medium};
    
    ${hoverEffect && css`
      &:hover {
        transform: translateY(-3px);
        box-shadow: ${shadows.lg};
        border-color: rgba(205, 62, 253, 0.3);
      }
    `}
  `,
  
  // Gradient button
  gradientButton: css`
    background: ${colors.gradients.button};
    color: ${colors.text.primary};
    border: none;
    border-radius: ${borderRadius.md};
    padding: ${spacing.sm} ${spacing.lg};
    font-weight: ${typography.fontWeights.medium};
    transition: ${transitions.medium};
    cursor: pointer;
    
    &:hover {
      background: ${colors.gradients.hover};
      transform: translateY(-2px);
      box-shadow: ${shadows.md};
    }
    
    &:active {
      transform: translateY(0);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `,
  
  // RTL support mixin
  rtl: (property, value1, value2 = null) => css`
    [dir="ltr"] & {
      ${property}: ${value1};
    }
    
    [dir="rtl"] & {
      ${property}: ${value2 || value1};
    }
  `,
  
  // RTL padding/margin helpers
  rtlPadding: (top, right, bottom, left) => css`
    [dir="ltr"] & {
      padding: ${top} ${right} ${bottom} ${left};
    }
    
    [dir="rtl"] & {
      padding: ${top} ${left} ${bottom} ${right};
    }
  `,
  
  rtlMargin: (top, right, bottom, left) => css`
    [dir="ltr"] & {
      margin: ${top} ${right} ${bottom} ${left};
    }
    
    [dir="rtl"] & {
      margin: ${top} ${left} ${bottom} ${right};
    }
  `,
  
  // Truncate text with ellipsis
  truncate: css`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  
  // Gradient text
  gradientText: css`
    background: ${colors.gradients.accent};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  `,
  
  // Status badge styling
  statusBadge: (status) => {
    let color;
    switch(status) {
      case 'success':
        color = colors.status.success;
        break;
      case 'warning':
        color = colors.status.warning;
        break;
      case 'error':
        color = colors.status.error;
        break;
      case 'info':
        color = colors.status.info;
        break;
      default:
        color = colors.status.neutral;
    }
    
    return css`
      background-color: ${color};
      color: ${colors.text.primary};
      padding: ${spacing.xs} ${spacing.sm};
      border-radius: ${borderRadius.md};
      font-size: ${typography.fontSizes.xs};
      font-weight: ${typography.fontWeights.medium};
      display: inline-block;
    `;
  },
  
  // Decorative element styling
  decorativeElement: css`
    &:before {
      content: '';
      position: absolute;
      top: -50px;
      right: -50px;
      width: 150px;
      height: 150px;
      background: radial-gradient(circle, rgba(205, 62, 253, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
      border-radius: 50%;
      pointer-events: none;
    }
    
    &:after {
      content: '';
      position: absolute;
      bottom: -50px;
      left: -50px;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(123, 44, 191, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
      border-radius: 50%;
      pointer-events: none;
    }
  `,
};
