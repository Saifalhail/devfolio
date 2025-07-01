import React, { useState, useEffect, Suspense } from 'react';
import { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProviderWrapper } from './contexts/ThemeContext'; // Import the wrapper
import GlobalStyles from './styles/GlobalStyles';
import { GlobalAnimationStyles } from './styles/animations';
import './i18n'; // Import i18n initialization
import i18n from './i18n';
import { setDocumentDirection } from './utils/rtl';

// Import components
import HomePage from './components/Home/HomePage';
import Dashboard from './components/Dashboard/Dashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

// Lazy-loaded pages
const ForumsHome = lazy(() => import('./components/Dashboard/Forums/ForumsHome'));
const PostDetails = lazy(() => import('./components/Dashboard/Forums/PostDetails'));


// Error boundary component to catch Firebase initialization errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
          <h1 style={{ color: '#513a52' }}>Something went wrong</h1>
          <div style={{ background: '#feefc4', padding: '15px', borderRadius: '5px', marginBottom: '15px' }}>
            <p>We're sorry, but there was an error initializing the application.</p>
            <p>This might be due to Firebase configuration issues or network problems.</p>
          </div>
          <div style={{ background: '#f8f8f8', padding: '15px', borderRadius: '5px', marginBottom: '15px' }}>
            <h3>Error details:</h3>
            <pre style={{ background: '#eee', padding: '10px', overflow: 'auto' }}>
              {this.state.error && (this.state.error.toString())}
            </pre>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            style={{ background: '#82a1bf', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// ProtectedRoute component to secure routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (!currentUser && !loading) {
    // Redirect to home if not authenticated after loading
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  // Add state to track if the app has loaded
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setDocumentDirection(i18n.language);
  }, []);
  
  // Simulate a loading state to ensure Firebase has time to initialize
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Show a simple loading indicator while the app initializes
  if (!isLoaded) {
    return (
      <ThemeProviderWrapper>
        <GlobalStyles />
        <GlobalAnimationStyles />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh', 
          background: 'white',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999
        }}>
          <div style={{ textAlign: 'center', maxWidth: '400px', padding: '20px' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #feefc4, #faaa93)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              animation: 'pulse 1.5s infinite ease-in-out'
            }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                border: '3px solid white',
                borderTopColor: '#82a1bf',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
            <h2 style={{ 
              color: '#513a52', 
              marginBottom: '10px',
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 600
            }}>Loading DevFolio</h2>
            <p style={{ 
              color: '#666', 
              fontSize: '14px',
              fontFamily: '"Nunito", sans-serif'
            }}>Please wait while we prepare your experience</p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
              @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
              }
            `}</style>
          </div>
        </div>
      </ThemeProviderWrapper>
    );
  }
  
  return (
    <ErrorBoundary>
      <ThemeProviderWrapper>
        <GlobalStyles />
        <GlobalAnimationStyles />
        <AuthProvider>
          <ToastProvider>
            <Router 
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
              }}
            >
              <Suspense fallback={<div style={{ color: '#513a52', textAlign: 'center', marginTop: '2rem' }}>Loading...</div>}>
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
            <Route 
              path="/forums" 
              element={
                <ProtectedRoute>
                  <ForumsHome />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/forums/:postId" 
              element={
                <ProtectedRoute>
                  <PostDetails />
                </ProtectedRoute>
              } 
            />
              </Routes>
            </Suspense>
            </Router>
          </ToastProvider>
        </AuthProvider>
      </ThemeProviderWrapper>
    </ErrorBoundary>
  );
}

export default App;
