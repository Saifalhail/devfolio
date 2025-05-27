# DevFolio - Software Service Company Website

## Project Overview

DevFolio is a responsive website built for a solo developer offering software development services including web development, mobile applications, QR code solutions, and other tech-related applications. The website features a modern design with bilingual support (English and Arabic) and a simple backend for handling contact form submissions.

## Features

- **Modern UI/UX Design**: Clean, professional interface with a modern aesthetic based on the provided design mockup
- **Fully Responsive**: Optimized for both desktop and mobile devices
- **Bilingual Support**: Complete internationalization with English and Arabic language support
- **RTL Support**: Right-to-left text direction support for Arabic language
- **Service Showcase**: Highlighting various tech services offered
- **Contact Form**: Functional contact form with backend processing
- **Newsletter Signup**: Backend support for newsletter subscriptions
- **User Authentication**: Multiple authentication methods including:
  - Google Sign-in
  - Email/Password authentication
  - Phone number verification
- **User Dashboard**: Personalized dashboard for authenticated users
  - Tasks are loaded using the `useTasks` hook which syncs data from Firestore and stores a local copy in `localStorage` for offline access.
- **SEO Optimized**: Comprehensive SEO implementation including:
  - Semantic HTML structure with proper heading hierarchy (h1-h6)
  - Descriptive alt text for all images and icons
  - Schema.org markup for business and person
  - Optimized meta tags and Open Graph properties
  - Accessibility improvements for screen readers
- **Custom Styling**: Implemented using a custom color palette:
  - Primary Background: #feefc4
  - Accent Color 1: #faaa93
  - Accent Color 2: #82a1bf
  - Dark Color: #513a52

## Tech Stack

### Frontend
- **React**: UI library for building the user interface
- **React Router**: For handling navigation
- **Styled Components**: For component-specific styling
- **i18next/react-i18next**: For internationalization
- **Axios**: For API requests to the backend

### Backend
- **Firebase Cloud Functions**: Serverless backend for handling form submissions
- **Firebase Firestore**: NoSQL database for storing contact form submissions and user data
- **Firebase Authentication**: User authentication with multiple providers (Google, Email/Password, Phone)
- **Firebase Storage**: For storing user profile images and other assets
- **SendGrid**: Email service for sending form submission notifications (optional)
- **dotenv**: For loading environment variables securely

## Project Structure

```
devfolio/
├── public/               # Static files
├── backend/              # Backend server
│   ├── data/             # Storage for form submissions
│   └── server.js         # Express server
├── src/
│   ├── assets/           # Images and static assets
│   ├── components/       # React components
│   │   ├── Common/       # Reusable components
│   │   ├── Home/         # Home page specific components
│   │   └── Layout/       # Layout components (Navbar, Footer, etc.)
│   ├── locales/          # Internationalization files
│   │   ├── en/           # English translations
│   │   └── ar/           # Arabic translations
│   ├── styles/           # Global styles and theme
│   ├── utils/            # Utility functions
│   ├── App.js            # Main application component
│   ├── i18n.js           # i18next configuration
│   └── index.js          # Entry point
├── package.json          # Project dependencies and scripts
└── README.md             # Project documentation
```

## Setup and Installation

### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)

### Installation Steps

1. Clone the repository
```bash
git clone [repository-url]
cd devfolio
```

2. Install dependencies
```bash
npm install
```

3. Start the development environment (frontend and backend)
```bash
npm run dev
```

This will start:
- React development server on http://localhost:3000
- Express backend server on http://localhost:5000

### Available Scripts

- `npm start`: Starts the React development server only
- `npm run server`: Starts the Express backend server only
- `npm run dev`: Starts both frontend and backend in development mode
- `npm run build`: Creates a production build of the React application
- `npm test`: Runs the test suite with Jest
- `npm run test:all`: Runs all tests using the custom test runner
- `npm run test:responsive`: Runs only responsive design tests
- `npm run lint`: Runs ESLint on the codebase

### Codex Environment Setup

For Codex AI agent development, a special setup script is provided:

```bash
bash codex-setup.sh
```

This script installs all necessary testing dependencies for offline execution in the Codex environment. See `CODEX_README.md` for detailed instructions on working with Codex.

## Testing Architecture

The project includes a comprehensive testing setup designed to work both in standard development environments and in offline environments like Codex AI.

### Testing Structure

- **Test Files**: Located in `src/__tests__/` directory
- **Mock Files**: Located in `src/__mocks__/` directory
- **Test Utilities**: Common testing utilities in `src/__tests__/testUtils.js`
- **Custom Test Runner**: `src/__tests__/runTests.js` for offline execution

### Key Testing Components

1. **Firebase Mocks**
   - Complete mocks for Firebase Auth, Firestore, and other services
   - Designed to work offline without network access
   - Located in `src/__mocks__/firebase.js` and `src/__mocks__/authContext.js`

2. **Custom Hooks**
   - `useFirebaseListener`: Ensures proper cleanup of Firebase listeners
   - Prevents memory leaks in components using Firebase listeners

3. **Environment Configuration**
   - `jest.config.js`: Main Jest configuration
   - `babel.config.js`: Babel configuration for transpiling code
   - `.eslintignore`: Excludes test files from linting

### Running Tests

Standard development environment:
```bash
npm test
```

Offline environment (Codex):
```bash
node src/__tests__/runTests.js
```

Responsive design tests only:
```bash
npm run test:responsive
```

## Internationalization

The website supports both English and Arabic languages with full RTL (Right-to-Left) support for Arabic.

## SEO Implementation

The website is optimized for search engines with the following implementations:

### Meta Tags and Open Graph
- **Title Tag**: "S.N.P – Solo Software Developer in Qatar | Web, Mobile, AI"
- **Meta Description**: "S.N.P delivers web, mobile, and AI software solutions. Led by a solo expert developer. Based in Qatar. Fast. Smart. Personal."
- **Keywords**: Software developer, web development, mobile apps, AI solutions, Qatar developer
- **Open Graph Tags**: For better social media sharing with title, description, and type

### Semantic HTML Structure
- Proper heading hierarchy (h1-h6) throughout the site
- Each section has appropriate heading levels (h1 for main title, h2 for sections, h3 for subsections)
- Styled components use the `as` prop to maintain semantic HTML while preserving styling

### Accessibility Features
- All images have descriptive alt text in both English and Arabic
- All icons have appropriate aria-label attributes
- Interactive elements have proper focus states
- Color contrast ratios meet WCAG standards

### Schema.org Markup
- Business schema for the company information
- Person schema for the developer's information
- Service schema for the offered services

### Performance Optimization
- Images optimized to be under 300kb
- WebP format used where possible for better compression
- Lazy loading for non-critical images
- Minimized CSS and JavaScript

### How it works

- Language files are stored in `src/locales/en` and `src/locales/ar` directories
- The `i18n.js` file configures the internationalization system
- Language can be toggled using the language switcher in the navigation bar
- When switching to Arabic, the text direction automatically changes to RTL

### Adding or Modifying Translations

To add or modify translations:
1. Open the respective translation file in `src/locales/[language]/translation.json`
2. Add or modify the key-value pairs as needed
3. Access the translations in components using the `useTranslation` hook and `t()` function

## Authentication System

The website features a comprehensive authentication system that allows users to sign up and sign in using multiple methods.

### Authentication Methods

1. **Google Authentication**
   - Implemented using Firebase Authentication with Google provider
   - Allows users to sign in with their Google accounts
   - Handles proper error messages for various scenarios (unauthorized domains, popup blocked, etc.)

2. **Email/Password Authentication**
   - Traditional email and password registration and login
   - Password strength validation
   - Error handling for common issues (invalid email, weak password, etc.)

3. **Phone Authentication**
   - SMS-based verification using Firebase Authentication
   - Two-step process: phone number input followed by verification code
   - Uses reCAPTCHA verification for security

### Authentication UI

- **Modern Modal Design**: Clean, dark-themed modal with gradient effects
- **Responsive Layout**: Works well on both desktop and mobile devices
- **Simple Navigation**: Easy-to-use back and close buttons
- **Toggle Between Modes**: Users can switch between sign-in and sign-up
- **Error Handling**: Clear error messages for various authentication scenarios

### User State Management

- User authentication state is managed through React Context API
- Persistent sessions using Firebase's local storage
- Protected routes for authenticated content
- User profile management capabilities

### Security Considerations

- Secure token-based authentication
- Server-side validation of authentication requests
- Protection against common authentication attacks
- Proper error handling to prevent information leakage

## Backend API

The Express backend provides the following API endpoints:

### Contact Form Submission
- **Endpoint**: `/api/contact`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "subject": "Inquiry Subject",
    "message": "User message content"
  }
  ```
- **Response**: Success/failure message

### Newsletter Signup
- **Endpoint**: `/api/subscribe`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**: Success/failure message

## Security Measures

### Environment Variables

All sensitive information is stored in environment variables:

- **Frontend**: `.env.local` file with `REACT_APP_` prefixed variables
- **Backend**: `.env` file in the `functions` directory

Example files (`.env.local.example` and `.env.example`) are provided as templates, but should not contain actual credentials.

### Firebase Security

1. **Firestore Security Rules**: Access to the database is restricted through security rules that:
   - Allow contact form submissions to be created with proper validation
   - Restrict read access to prevent unauthorized data access
   - Validate data structure and types

2. **Cloud Functions**: The Firebase Cloud Functions are secured by:
   - Input validation for all form fields
   - Error handling that doesn't expose sensitive information
   - Proper logging for debugging without exposing sensitive data
   - Use the `logFirebaseFunctionError` utility on the frontend to capture
     detailed error information when a callable function fails

### Form Validation

- **Client-side validation**: Prevents invalid submissions and provides immediate feedback
- **Server-side validation**: Ensures data integrity and security even if client-side validation is bypassed

### Email Security

When using SendGrid for email notifications:
- API keys are stored securely in environment variables
- Email templates are sanitized to prevent injection attacks
- From/to email addresses are validated

## Deployment

### Frontend Deployment

1. Create a production build:
```bash
npm run build
```

2. The build files will be in the `build` directory

### Backend Deployment

1. Ensure Node.js is installed on your server
2. Copy the backend directory and build directory to your server
3. Install production dependencies:
```bash
npm install --production
```

4. Start the server:
```bash
NODE_ENV=production node backend/server.js
```

## UI Components and Design System

### Process Section Design

The Process section showcases the developer's 6-step workflow with a modern, visually appealing design:

#### Layout and Structure
- **Grid Layout**: 3 columns on desktop, 2 on tablets, 1 on mobile
- **Responsive Design**: Adapts smoothly to different screen sizes
- **Card-Based UI**: Each process step is contained in its own card

#### Visual Elements
- **Backdrop Filter Effects**: Semi-transparent cards with blur effects (backdrop-filter: blur(10px))
- **Gradient Accents**: Each step has a unique gradient color scheme:
  - Discovery: Blue-Purple (#4A90E2, #5E35B1)
  - Proposal: Red-Orange (#FF6B6B, #FF8E53)
  - Design: Light Blue-Blue (#56CCF2, #2F80ED)
  - Development: Green (#6FCF97, #219653)
  - Launch: Purple (#BB6BD9, #8B5CF6)
  - Maintenance: Gold-Yellow (#F2994A, #F2C94C)
- **Iconography**: Each step includes a relevant emoji icon with subtle animation
- **"2 Weeks or Less" Stamp**: Rotating stamp with dashed border and lightning bolt accent

#### Animation and Interaction
- **Hover Effects**: Cards elevate slightly with enhanced shadows on hover
- **Animated Underlines**: Title underlines appear on hover
- **Pulsing Icons**: Icons pulse gently to draw attention
- **Staggered Animations**: Cards animate into view sequentially using Framer Motion

#### Card Design
- **Dimensions**: Height: 100%, min-height: 250px (220px on mobile)
- **Padding**: 1.5rem (1.25rem on mobile)
- **Border Radius**: 16px
- **Border**: 1px solid rgba(255, 255, 255, 0.1), brightens on hover
- **Background**: Semi-transparent with subtle patterns unique to each step
- **Top Bar**: Each card has a colored top section matching its theme

#### Typography
- **Step Title**: 1.3rem, bold, with animated underline on hover
- **Step Description**: 0.95rem, limited to 4 lines with ellipsis overflow
- **Step Number**: Small circular badge (28px) in the top-right of the icon

#### CSS Techniques Used
- **Backdrop Filter**: For frosted glass effect
- **CSS Grid**: For responsive layout
- **CSS Variables**: For consistent theming
- **Keyframe Animations**: For subtle motion effects
- **Pseudo-elements**: For decorative accents and hover effects
- **Text Overflow Control**: Using -webkit-line-clamp for consistent card heights

### Tooltip Component

The Tooltip component provides additional context when hovering over icons or buttons.

- **Location**: `src/components/Common/Tooltip.js`
- **Style**: Dark purple background with white text, matching the primary theme
- **RTL Support**: Tooltip positioning flips automatically in Arabic mode
- **Usage Example**:
  ```jsx
  <Tooltip content={t('info.more')}> 
    <IconButton icon={<FaInfo />} />
  </Tooltip>
  ```
### Payment History Component

A reusable component that lists invoice payments with status badges.

- **Location**: `src/components/Dashboard/Invoicing/PaymentHistory.js`
- **Reusability**: Can be used in any dashboard section to show transaction records.
- **Features**: Supports RTL layout, uses shared Panel components, and status badges for payment states.


## Future Enhancements

- Add more service pages with detailed information
- Implement a portfolio page with project showcases
- Add authentication for admin access
- Replace file-based storage with a database
- Implement email notifications for form submissions
- Enhance the Process section with interactive animations and progress tracking
- Add case studies for each completed project

## License

MIT © [Saif Al-Hail]
