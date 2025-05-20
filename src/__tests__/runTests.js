// Test runner script for Codex
// This script will run all tests in the __tests__ directory
// It's designed to work offline without internet access

// Polyfill for ResizeObserver (needed for responsive tests)
global.ResizeObserver = require('resize-observer-polyfill');

// Mock matchMedia for responsive tests
global.matchMedia = global.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {},
    addEventListener: function() {},
    removeEventListener: function() {},
    dispatchEvent: function() {}
  };
};

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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
    // Skip the runTests.js file itself
    if (testFile === 'runTests.js') {
      console.log(`${colors.yellow}Skipping test runner file${colors.reset}`);
      return true;
    }
    
    // Run the test using Jest with explicit testMatch pattern to find our tests
    const command = `npx jest ${testPath} --no-cache --testTimeout=10000 --passWithNoTests --testMatch="**/${testFile}"`;    
    const output = execSync(command, { encoding: 'utf8' });
    
    // Check if tests passed
    if (output.includes('PASS') || output.includes('No tests found')) {
      console.log(`${colors.green}✓ Tests in ${testFile} passed!${colors.reset}`);
      return true;
    } else {
      console.log(`${colors.red}✗ Tests in ${testFile} failed!${colors.reset}`);
      console.log(output);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}✗ Error running tests in ${testFile}:${colors.reset}`);
    console.log(error.stdout || error.message);
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
