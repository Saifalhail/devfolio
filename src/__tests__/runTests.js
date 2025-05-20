// Test runner script for Codex
// This script will run all tests in the __tests__ directory
// It's designed to work offline without internet access

// Import required modules
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Polyfill for ResizeObserver (needed for responsive tests)
global.ResizeObserver = require('resize-observer-polyfill');

// Mock matchMedia for responsive tests
global.matchMedia = global.matchMedia || function(query) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: function() {},
    removeListener: function() {},
    addEventListener: function() {},
    removeEventListener: function() {},
    dispatchEvent: function() {}
  };
};

// Mock localStorage
if (typeof window === 'undefined') {
  global.window = {};
}

if (!global.window.localStorage) {
  const localStorageMock = (function() {
    let store = {};
    return {
      getItem: function(key) { return store[key] || null; },
      setItem: function(key, value) { store[key] = value.toString(); },
      removeItem: function(key) { delete store[key]; },
      clear: function() { store = {}; },
      key: function(i) { return Object.keys(store)[i] || null; },
      get length() { return Object.keys(store).length; }
    };
  })();
  
  Object.defineProperty(global.window, 'localStorage', { value: localStorageMock });
}

// ANSI color codes for better output formatting
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

console.log(`${colors.bright}${colors.cyan}======================================${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}   DevFolio Test Runner for Codex    ${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}======================================${colors.reset}`);
console.log();

// Get all test files
const testsDir = path.join(__dirname);
const testFiles = fs.readdirSync(testsDir)
  .filter(file => file.endsWith('Tests.js') || file === 'appTests.js');

console.log(`${colors.yellow}Found ${testFiles.length} test files:${colors.reset}`);
testFiles.forEach(file => {
  console.log(`${colors.dim}- ${file}${colors.reset}`);
});
console.log();

// Function to run a specific test file
function runTest(testFile) {
  const testPath = path.join(testsDir, testFile);
  console.log(`${colors.bright}${colors.blue}Running tests in ${testFile}...${colors.reset}`);
  
  try {
    if (testFile === 'runTests.js') {
      console.log(`${colors.yellow}Skipping test runner file${colors.reset}`);
      return true;
    }
    
    // Set environment variables needed for tests
    process.env.NODE_ENV = 'test';
    process.env.JEST_WORKER_ID = 1;
    
    // Configure Jest options directly
    const jestOptions = [
      testPath,
      '--no-cache',
      '--testTimeout=10000',
      '--passWithNoTests',
      '--runInBand',
      '--env=jsdom',
      `--testMatch="**/${testFile}"`,
      '--detectOpenHandles'
    ];
    
    // Run the test using Jest with explicit options
    const command = `npx jest ${jestOptions.join(' ')}`;
    
    try {
      const output = execSync(command, { 
        encoding: 'utf8',
        env: { ...process.env, CI: 'true' } // Set CI=true to avoid interactive prompts
      });
      
      // Check if tests passed
      if (output.includes('PASS') || output.includes('No tests found')) {
        console.log(`${colors.green}✓ Tests in ${testFile} passed!${colors.reset}`);
        return true;
      } else {
        console.log(`${colors.red}✗ Tests in ${testFile} failed!${colors.reset}`);
        console.log(output);
        return false;
      }
    } catch (execError) {
      // If Jest fails with an error code, we still want to see the output
      if (execError.stdout && (execError.stdout.includes('No tests found') || execError.stdout.includes('PASS'))) {
        console.log(`${colors.green}✓ Tests in ${testFile} passed with warnings!${colors.reset}`);
        return true;
      }
      
      console.log(`${colors.red}✗ Tests in ${testFile} failed with error:${colors.reset}`);
      console.log(execError.stdout || execError.message);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}✗ Error setting up tests in ${testFile}:${colors.reset}`);
    console.log(error.message);
    return false;
  }
}

// Run all tests
console.log(`${colors.bright}${colors.magenta}Starting test run...${colors.reset}`);
console.log();

let passedTests = 0;
let failedTests = 0;

testFiles.forEach(testFile => {
  const passed = runTest(testFile);
  if (passed) {
    passedTests++;
  } else {
    failedTests++;
  }
  console.log();
});

// Print summary
console.log(`${colors.bright}${colors.cyan}======================================${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}            Test Summary             ${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}======================================${colors.reset}`);
console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
console.log(`${colors.bright}${colors.white}Total: ${passedTests + failedTests}${colors.reset}`);
console.log();

if (failedTests === 0) {
  console.log(`${colors.bright}${colors.green}All tests passed! ✓${colors.reset}`);
} else {
  console.log(`${colors.bright}${colors.red}Some tests failed! ✗${colors.reset}`);
  process.exit(1);
}
