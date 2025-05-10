import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import HomePage from './components/Home/HomePage';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';
import './i18n'; // Import i18n initialization

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Add more routes as needed */}
          {/* <Route path="/services" element={<ServicesPage />} /> */}
          {/* <Route path="/portfolio" element={<PortfolioPage />} /> */}
          {/* <Route path="/about" element={<AboutPage />} /> */}
          {/* <Route path="/contact" element={<ContactPage />} /> */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
