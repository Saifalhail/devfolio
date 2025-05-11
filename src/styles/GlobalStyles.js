import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Import fonts for both English and Arabic */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&family=Poppins:wght@400;500;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=Tajawal:wght@400;500;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

  :root {
    --primary-bg: #12142c;
    --primary-gradient: linear-gradient(135deg, #12142c 0%, #202253 50%, #3a1e65 100%);
    --secondary-gradient: linear-gradient(45deg, #3a1e65 0%, #6031a8 100%);
    --accent-1: #cd3efd;
    --accent-2: #b429e3;
    --accent-3: #ff5b92;
    --accent-4: #00e5bd;
    --dark: #0a0a1a;
    --dark-purple: #2a1252;
    --white: #ffffff;
    --light-gray: #e8e9fd;
    --dark-gray: #9194c6;
    --card-bg: rgba(35, 38, 85, 0.6);
    --card-gradient: linear-gradient(to bottom, rgba(55, 42, 99, 0.7) 0%, rgba(37, 38, 89, 0.8) 100%);
    --overlay: rgba(18, 20, 44, 0.8);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  body {
    font-family: 'Inter', 'Roboto', sans-serif;
    background: var(--primary-gradient);
    background-attachment: fixed;
    color: var(--white);
    line-height: 1.6;
    overflow-x: hidden;
    
    /* Apply Arabic font for RTL */
    html[dir='rtl'] & {
      font-family: 'Tajawal', 'Cairo', sans-serif;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Poppins', 'Inter', sans-serif;
    margin-bottom: 1.5rem;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  h1 {
    font-size: 3.5rem;
    line-height: 1.2;
    background: linear-gradient(to right, var(--accent-2), var(--accent-1));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 2rem;
  }

  h2 {
    font-size: 2.5rem;
    line-height: 1.3;
    position: relative;
    display: inline-block;
    margin-bottom: 2.5rem;
    z-index: 1;
    
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -10px;
      width: 80px;
      height: 4px;
      background: var(--accent-1);
      border-radius: 5px;
      z-index: -1;
    }
  }

  h3 {
    font-size: 1.8rem;
    color: var(--accent-2);
  }

  p {
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    color: var(--light-gray);
  }

  a {
    text-decoration: none;
    color: var(--accent-2);
    transition: all 0.3s ease;
    font-weight: 500;
    position: relative;
    padding: 0 2px;
    
    &:hover {
      color: var(--accent-3);
      &::after {
        transform: scaleX(1);
      }
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: var(--accent-3);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s ease;
    }
  }

  button, .button {
    cursor: pointer;
    border: none;
    padding: 12px 25px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1rem;
    letter-spacing: 0.5px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    background: linear-gradient(to right, var(--accent-1), var(--accent-2));
    color: var(--white);
    position: relative;
    overflow: hidden;
    z-index: 1;
    box-shadow: 0 4px 15px rgba(66, 165, 245, 0.25);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 7px 25px rgba(66, 165, 245, 0.4);
      
      &::before {
        transform: scaleX(1.5) scaleY(1.5);
        opacity: 0;
      }
    }
    
    &:active {
      transform: translateY(1px);
    }
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to right, var(--accent-2), var(--accent-1));
      z-index: -1;
      transition: all 0.5s ease;
      transform: scaleX(1) scaleY(1);
      opacity: 1;
    }
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 2;
  }

  .section {
    padding: 6rem 0;
    position: relative;
    overflow: hidden;
  }

  .card {
    background: var(--card-gradient);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: var(--shadow-card);
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
    }
  }

  .float-element {
    animation: float 6s ease-in-out infinite;
  }

  .glow {
    filter: drop-shadow(0 0 10px var(--accent-2));
  }

  .cartoon-bg {
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      background-size: contain;
      background-repeat: no-repeat;
      z-index: 0;
      opacity: 0.8;
    }
  }

  /* Design elements from cartoon style */
  .bubble {
    font-family: 'Comic Neue', cursive;
    background: var(--white);
    border-radius: 20px;
    padding: 15px 20px;
    position: relative;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    color: var(--dark);
    font-weight: 700;
    
    &::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      background: var(--white);
      bottom: -10px;
      left: 20px;
      transform: rotate(45deg);
      box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
      z-index: -1;
    }
  }

  /* Decorative elements */
  .decorative-circle {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(45deg, var(--accent-3), var(--accent-4));
    opacity: 0.1;
    z-index: 0;
  }

  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(50px);
    z-index: 0;
    opacity: 0.2;
  }

  @media (max-width: 992px) {
    h1 {
      font-size: 2.8rem;
    }
    
    h2 {
      font-size: 2.2rem;
    }
  }

  @media (max-width: 768px) {
    .section {
      padding: 4rem 0;
    }
    
    h1 {
      font-size: 2.3rem;
    }
    
    h2 {
      font-size: 1.8rem;
    }
  }

  @media (max-width: 576px) {
    h1 {
      font-size: 2rem;
    }
    
    h2 {
      font-size: 1.6rem;
    }
    
    .container {
      padding: 0 1.5rem;
    }
  }
`;

export default GlobalStyles;
