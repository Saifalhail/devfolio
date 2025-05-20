#!/bin/bash
# Setup script for Codex to install necessary dependencies for testing

# Install Jest and testing dependencies
npm install --save-dev \
  jest \
  jest-environment-jsdom \
  @babel/core \
  @babel/preset-env \
  @babel/preset-react \
  @babel/plugin-transform-runtime \
  @babel/plugin-proposal-class-properties \
  babel-jest \
  jest-styled-components \
  jest-axe \
  jest-matchmedia-mock \
  css-mediaquery \
  resize-observer-polyfill \
  jsdom \
  @testing-library/dom \
  @testing-library/jest-dom \
  @testing-library/react \
  @testing-library/user-event

# Create necessary directories if they don't exist
mkdir -p src/__mocks__ src/__tests__ src/hooks

# Print completion message
echo "Setup complete! Codex environment is now ready for testing."
