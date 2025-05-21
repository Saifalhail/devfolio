// Simplified Jest configuration for Codex
module.exports = {
  // Use jsdom for browser-like environment
  testEnvironment: 'jsdom',
  
  // Mock file imports
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/src/__mocks__/styleMock.js",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/src/__mocks__/fileMock.js"
  },
  
  // Use the main setupTests.js file from Create React App
  setupFilesAfterEnv: [
    "<rootDir>/src/setupTests.js"
  ],
  
  // Only run files with Tests.js suffix in __tests__ directory
  testMatch: [
    "**/__tests__/**/*Tests.js"
  ],
  
  // Ignore node_modules and setup files in tests
  testPathIgnorePatterns: [
    "/node_modules/",
    "setupTests.js",
    "runTests.js"
  ],
  
  // Longer timeout for Codex environment
  testTimeout: 30000,
  
  // Show detailed output
  verbose: true,
  
  // Force exit after tests complete
  forceExit: true,
  
  // Detect open handles (like unresolved promises)
  detectOpenHandles: true,
  
  // Don't watch for changes
  watch: false,
  
  // Don't run in band (sequentially) to avoid memory issues
  runInBand: true
};
