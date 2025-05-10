import { createGlobalStyle, css } from 'styled-components';

export const floatAnimation = css`
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
`;

export const pulseAnimation = css`
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

export const rotateAnimation = css`
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Global animations that can be used across components
const GlobalAnimations = createGlobalStyle`
  ${floatAnimation}
  ${pulseAnimation}
  ${rotateAnimation}
`;

export default GlobalAnimations;
