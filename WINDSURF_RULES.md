# DevFolio Windsurf Rules

This document provides essential guidelines for working with the DevFolio project. Reference this file to quickly understand the project structure, development practices, and important considerations.

<project>
- DevFolio is a portfolio website for a solo software developer offering various tech services
- The website features a modern UI with dark purple theme and gradient effects
- The site is bilingual with support for English and Arabic languages
- Primary services offered include web development, mobile apps, AI integrations, admin dashboards, QR code tools, and custom software
</project>

<important>
At the start always check to which point the project has reached and continue from there
Check PROJECT_BUILDING_TASKS.md for the current task and rest of tasks
Always at the start provide the in built Browser view to be opened as an external browser where elements can
be chosen and sent.
Do not provide Npm start or Npm run dev commands
</important>

<design>
refer to UI_DESIGN_DOCUMENTATION.md for the design details
</design>

<tech_stack>
- Frontend framework is React.js with styled-components for styling
- Routing is handled by React Router
- Internationalization uses i18next and react-i18next
- Backend uses Firebase (Authentication, Firestore, Cloud Functions)
- Email notifications are handled through SendGrid integration
</tech_stack>

<project_structure>
- `/public` contains static assets and index.html
- `/src/assets` stores images, icons, and other media files
- `/src/components` contains React components organized by feature
- `/src/components/Common` houses reusable UI components
- `/src/components/Home` contains homepage-specific components
- `/src/components/Layout` has structural components like Navbar and Footer
- `/src/components/Dashboard` contains authenticated user dashboard components
- `/src/contexts` contains React context providers (e.g., AuthContext)
- `/src/locales` stores translation files for English and Arabic
- `/src/styles` contains global styles and theme definitions
- `/src/utils` houses utility functions and helpers
- `/backend/functions` contains Firebase Cloud Functions
</project_structure>

<styling>
- Use styled-components for component styling
- Follow the established color palette:
  - Primary Background: #513a52 (dark purple)
  - Accent Colors: Blue gradient effects
- Maintain responsive design for all components
- Support RTL (right-to-left) layout for Arabic language
- Use animations sparingly and consistently
</styling>

<authentication>
- Firebase Authentication is used with multiple providers:
  - Google Sign-in
  - Email/Password authentication
  - Phone number verification
- Auth state is managed through React Context API
- Always handle authentication errors gracefully
- Protect routes that require authentication
</authentication>

<firebase>
- Never commit Firebase API keys to version control
- Store all Firebase credentials in environment variables
- Frontend: Use REACT_APP_ prefixed variables in .env.local
- Backend: Use dotenv to load variables from .env
- Follow the Firebase setup instructions in FIREBASE_SETUP.md
- Use proper Firebase security rules for Firestore
- Initialize Firebase services only once to avoid circular dependencies
</firebase>

<forms>
- The contact form uses Firebase Cloud Functions
- Validate all form inputs on both client and server sides
- Handle form submission errors gracefully
- Show appropriate loading states during form submission
- Store form submissions in Firestore database
- Send email notifications using SendGrid (when configured)
</forms>

<internationalization>
- Support both English and Arabic languages
- Use the useTranslation hook from react-i18next for text content
- Store translations in JSON files under src/locales
- Handle RTL layout for Arabic language
- Use isRTL = i18n.language === 'ar' to conditionally style components
- Ensure all user-facing text comes from translation files
</internationalization>

<security>
- Never hardcode credentials in the source code
- Use environment variables for all sensitive configuration
- Implement proper Firestore security rules
- Validate all user inputs on both client and server
- Use HTTPS for all API calls
- Sanitize data before storing in the database
- Follow Firebase security best practices
</security>

<development>
- Use Node.js v14 or later
- Install dependencies with npm install
- Start development server with npm start
- Build for production with npm run build
- Test locally before deploying
- Follow the setup instructions in README.md
- Refer to FIREBASE_SETUP.md for Firebase configuration
- For Codex AI development, run `bash codex-setup.sh` first
- Run tests with `node src/__tests__/runTests.js` in Codex environment
</development>

<deployment>
- Deploy frontend to Firebase Hosting
- Deploy Cloud Functions to Firebase Functions
- Set environment variables in Firebase project settings
- Update Firebase security rules before deployment
- Test all features after deployment
- Consider upgrading Node.js runtime for Functions before 2025-10-31
</deployment>

<seo>
- Maintain proper semantic HTML structure
- Use appropriate heading hierarchy (h1-h6)
- Provide descriptive alt text for all images
- Include Open Graph tags for social media sharing
- Implement Schema.org markup for business and services
- Optimize images for web performance
</seo>

<accessibility>
- Ensure sufficient color contrast ratios
- Provide descriptive alt text for all images
- Use semantic HTML elements
- Make all interactive elements keyboard accessible
- Support screen readers with appropriate ARIA attributes
- Test with accessibility tools before deployment
</accessibility>

<testing>
- Use Jest and React Testing Library for all tests
- Ensure tests can run offline without network access
- Use the useFirebaseListener hook for Firebase listeners
- Mock all external dependencies in src/__mocks__/
- Run tests with node src/__tests__/runTests.js in Codex
- Use testUtils.js for rendering components in tests
- Write tests for all new components and features
- Ensure proper cleanup in useEffect hooks
- Test responsive layouts with the viewport testing utilities
- Follow the offline testing guidelines in CODEX_README.md
</testing>
