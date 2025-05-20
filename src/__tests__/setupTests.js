// Jest setup file
import '@testing-library/jest-dom';

// Mock ResizeObserver
global.ResizeObserver = require('resize-observer-polyfill');

// Mock matchMedia
global.matchMedia = global.matchMedia || function() {
  return {
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
};

// Mock window.scrollTo
global.scrollTo = jest.fn();

// Mock Intersection Observer
global.IntersectionObserver = class IntersectionObserver {
  constructor() {
    this.observe = jest.fn();
    this.unobserve = jest.fn();
    this.disconnect = jest.fn();
  }
};

// Set up i18next for tests
jest.mock('../i18n', () => {
  return {
    __esModule: true,
    default: {
      t: (key) => key,
      changeLanguage: jest.fn(),
      language: 'en',
      use: jest.fn().mockReturnThis(),
      init: jest.fn(),
    },
  };
});
