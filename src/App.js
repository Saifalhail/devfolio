import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';
import './i18n'; // Import i18n initialization

// Import components after initialization imports
import HomePage from './components/Home/HomePage';
import Dashboard from './components/Dashboard/Dashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// ProtectedRoute component to secure routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    // Redirect to home if not authenticated
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            {/* Add more routes as needed */}
            {/* <Route path="/portfolio" element={<PortfolioPage />} /> */}
            {/* <Route path="/about" element={<AboutPage />} /> */}
            {/* <Route path="/contact" element={<ContactPage />} /> */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
