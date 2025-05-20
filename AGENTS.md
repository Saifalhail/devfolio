# Codex Agent Instructions

## Branching Strategy
- Always create a new branch from the latest `main` branch
- Use the naming convention: `codex/task-description`
- One task per branch, one PR per task

## PR Instructions
- Title format: [Component] Brief description of changes
- Include a summary of what was changed and why
- Reference the task number from AI_AGENT_TASKS.md
- Tag @Saifalhail for review

## Task Selection
- Some tasks in AI_AGENT_TASKS.md are commented out (<!-- -->) - these have already been completed
- Start working on tasks that appear AFTER the commented-out sections
- Do not attempt to implement any task that is within HTML comment tags
- The numbering may not be sequential after skipping commented tasks - this is expected
- Only Attempt to implement one task at a time and no more than one task

## Development Guidelines
- Run tests before submitting: `npm test`
- Ensure linting passes: `npm run lint`
- Follow the existing code style and patterns
- Always verify changes work offline without internet access

## Codex Environment Setup
- When starting a new task, first run the setup script: `bash codex-setup.sh`
- This script installs all necessary testing dependencies for offline execution
- All tests are designed to run in an offline environment without network access

## What to Run

- Run `npm run lint` and `node src/__tests__/runTests.js` on any change in:
  - `src/`
  - `backend/functions/`
  - `firebase.json`
  - `.env.local`

- The test runner script (`src/__tests__/runTests.js`) is specifically designed to work offline without internet access and will provide a clear summary of test results

## When to Skip

- Skip tests and lint if only:
  - `.md` or `README` files change
  - `src/locales/` (translation files)
  - `src/assets/` (images, SVGs)

## Rules

- If `backend/functions/` is updated → run `firebase deploy --only functions`
- If `firestore.rules` is updated → run `firebase deploy --only firestore:rules`
- Maintain bilingual support for English and Arabic in all user-facing text
- Follow the established color palette and design system
- Ensure all components support RTL layout for Arabic language
- Document any new functions or components

## Testing Instructions

### Running Tests

- After completing any task, run the test suite with: `node src/__tests__/runTests.js`
- This will execute all tests and provide a summary of passed/failed tests
- Tests are designed to run offline without internet access
- Fix any failing tests before submitting your PR

#### Responsive Testing

- Run responsive tests specifically with: `npm run test:responsive`
- These tests verify that components adapt properly to different screen sizes
- They check layout changes, touch target sizes, and other mobile-specific behaviors
- Ensure all UI components work properly on mobile, tablet, and desktop viewports

#### Test Dependencies

Before running tests, ensure all test dependencies are installed:

```bash
npm install --save-dev jest-axe jest-styled-components css-mediaquery jest-matchmedia-mock resize-observer-polyfill jsdom jest-environment-jsdom
```

These packages are required for proper responsive and accessibility testing.

### Test Coverage

The test suite covers these key areas:

1. **Authentication** - Tests for Google, Email/Password, and Phone authentication
2. **Contact Form** - Tests for form validation and submission
3. **Dashboard** - Tests for dashboard components and layout
4. **Internationalization** - Tests for language switching and RTL support
5. **Mobile Responsiveness** - Tests for proper layout adaptation across different device sizes
6. **Accessibility** - Tests for WCAG compliance and proper touch target sizing
7. **General App** - Tests for overall application functionality

### Adding Tests

When implementing new features, add corresponding tests in the `src/__tests__` folder:

- Keep all tests in a single folder (no nested test directories)
- Follow the existing test patterns
- Make tests resilient to offline execution
- Use mocks for external dependencies

### Debugging Test Failures

If tests fail:

1. Check the error message for specific component or functionality issues
2. Verify your changes don't break existing functionality
3. Ensure all translations are properly maintained for both English and Arabic
4. Check for any styling issues, especially with RTL layout