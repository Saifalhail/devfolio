import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Import fonts for both English and Arabic */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=Tajawal:wght@400;500;700&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

  :root {
    --primary-bg: #feefc4;
    --accent-1: #faaa93;
    --accent-2: #82a1bf;
    --dark: #513a52;
    --white: #ffffff;
    --light-gray: #f5f5f5;
    --dark-gray: #333333;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', 'Roboto', sans-serif;
    background-color: var(--primary-bg);
    color: var(--dark);
    line-height: 1.6;
    
    /* Apply Arabic font for RTL */
    html[dir='rtl'] & {
      font-family: 'Tajawal', 'Cairo', sans-serif;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: 1rem;
    font-weight: 700;
  }

  p {
    margin-bottom: 1rem;
  }

  a {
    text-decoration: none;
    color: var(--accent-2);
    transition: all 0.3s ease;
    
    &:hover {
      color: var(--dark);
    }
  }

  button {
    cursor: pointer;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
    background-color: var(--accent-2);
    color: var(--white);
    
    &:hover {
      background-color: var(--dark);
    }
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .section {
    padding: 4rem 0;
  }

  @media (max-width: 768px) {
    .section {
      padding: 2rem 0;
    }
  }
`;

export default GlobalStyles;
