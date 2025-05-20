module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/src/__mocks__/styleMock.js",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/src/__mocks__/fileMock.js"
  },
  setupFilesAfterEnv: [
    "<rootDir>/src/__tests__/setupTests.js"
  ],
  testMatch: [
    "**/__tests__/**/*Tests.js"
  ],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@firebase|firebase)/)"
  ],
  testPathIgnorePatterns: [
    "/node_modules/"
  ],
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/__tests__/**",
    "!src/__mocks__/**"
  ],
  // Ensure tests can run offline
  testTimeout: 10000,
  verbose: true
};
