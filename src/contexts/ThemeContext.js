import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import darkTheme from '../styles/theme';

// Light theme derived from the main palette
const lightTheme = {
  ...darkTheme,
  colors: {
    ...darkTheme.colors,
    primaryBg: '#ffffff',
    primaryGradient: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
    cardBg: '#f7f9fc',
    cardGradient: 'linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(245,245,245,0.8) 100%)',
    textPrimary: '#333333',
    textSecondary: '#555555'
  }
};

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

// Default CSS variable values for dark theme (match GlobalStyles)
const darkVars = {
  '--primary-bg': '#12142c',
  '--primary-gradient': 'linear-gradient(135deg, #12142c 0%, #202253 50%, #3a1e65 100%)',
  '--secondary-gradient': 'linear-gradient(45deg, #3a1e65 0%, #6031a8 100%)',
  '--accent-1': '#cd3efd',
  '--accent-2': '#b429e3',
  '--accent-3': '#ff5b92',
  '--accent-4': '#00e5bd',
  '--dark': '#0a0a1a',
  '--dark-purple': '#2a1252',
  '--white': '#ffffff',
  '--light-gray': '#e8e9fd',
  '--dark-gray': '#9194c6',
  '--card-bg': 'rgba(35, 38, 85, 0.6)',
  '--card-gradient': 'linear-gradient(to bottom, rgba(55, 42, 99, 0.7) 0%, rgba(37, 38, 89, 0.8) 100%)',
  '--overlay': 'rgba(18, 20, 44, 0.8)'
};

const lightVars = {
  '--primary-bg': '#ffffff',
  '--primary-gradient': 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
  '--secondary-gradient': 'linear-gradient(45deg, #fafafa 0%, #e8e9fd 100%)',
  '--accent-1': '#cd3efd',
  '--accent-2': '#b429e3',
  '--accent-3': '#ff5b92',
  '--accent-4': '#00e5bd',
  '--dark': '#513a52',
  '--dark-purple': '#2a1252',
  '--white': '#ffffff',
  '--light-gray': '#f7f9fc',
  '--dark-gray': '#666666',
  '--card-bg': '#ffffff',
  '--card-gradient': 'linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(245,245,245,0.8) 100%)',
  '--overlay': 'rgba(255,255,255,0.8)'
};

export const ThemeProviderWrapper = ({ children }) => {
  const [mode, setMode] = useState('dark');

  // Inject transition style once
  useEffect(() => {
    if (!document.getElementById('theme-transition-style')) {
      const style = document.createElement('style');
      style.id = 'theme-transition-style';
      style.innerHTML = `
        .theme-transition {
          transition: background 0.4s ease, color 0.4s ease;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem('themeMode');
    if (saved) setMode(saved);
  }, []);

  // Save preference
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    const vars = mode === 'dark' ? darkVars : lightVars;
    const root = document.documentElement;
    Object.entries(vars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });

    root.classList.add('theme-transition');
    const timeout = setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 400);
    return () => clearTimeout(timeout);
  }, [mode]);

  const toggleTheme = () => setMode(prev => (prev === 'dark' ? 'light' : 'dark'));

  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
