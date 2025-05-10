import { css } from 'styled-components';

// RTL mixin to help with right-to-left styling
export const rtl = (styles) => {
  return css`
    html[dir='rtl'] & {
      ${styles}
    }
  `;
};

// LTR mixin for left-to-right specific styling
export const ltr = (styles) => {
  return css`
    html[dir='ltr'] & {
      ${styles}
    }
  `;
};

// Helper to flip CSS properties for RTL layouts
export const getFlippedDirection = (direction) => {
  switch (direction) {
    case 'left':
      return 'right';
    case 'right':
      return 'left';
    case 'flex-start':
      return 'flex-end';
    case 'flex-end':
      return 'flex-start';
    default:
      return direction;
  }
};

// CSS property flip function for RTL support
export const rtlValue = (ltrValue, rtlValue) => {
  return css`
    ${ltrValue};
    ${rtl`${rtlValue}`};
  `;
};

// Language-specific font families
export const getFontFamily = (language) => {
  return language === 'ar' 
    ? "'Tajawal', 'Cairo', sans-serif" 
    : "'Inter', 'Roboto', sans-serif";
};

// Set document direction based on language
export const setDocumentDirection = (language) => {
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = language;
};
