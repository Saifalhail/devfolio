// Test script to verify Cloud Functions can be loaded
console.log("Testing Cloud Functions loading...");

try {
  // Try to load the functions
  const functions = require('./backend/functions/index.js');
  
  console.log("✓ Functions loaded successfully!");
  console.log("Available functions:");
  Object.keys(functions).forEach(key => {
    console.log(`  - ${key}`);
  });
  
} catch (error) {
  console.error("✗ Error loading functions:");
  console.error(error.message);
  console.error(error.stack);
  process.exit(1);
}

console.log("\nFunctions are ready for deployment!");