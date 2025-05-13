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
- **Express.js**: Minimal backend server
- **Body-parser**: For parsing JSON request bodies
- **CORS**: For handling cross-origin requests
- **File System**: For storing form submissions (in a production environment, this would use a database)

## Project Structure

```
devfolio/
├── public/               # Static files
├── server/               # Backend server
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
- `npm test`: Runs the test suite

## Internationalization

The website supports both English and Arabic languages with full RTL (Right-to-Left) support for Arabic.

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

## Deployment

### Frontend Deployment

1. Create a production build:
```bash
npm run build
```

2. The build files will be in the `build` directory

### Backend Deployment

1. Ensure Node.js is installed on your server
2. Copy the server directory and build directory to your server
3. Install production dependencies:
```bash
npm install --production
```

4. Start the server:
```bash
NODE_ENV=production node server/server.js
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

## Future Enhancements

- Add more service pages with detailed information
- Implement a portfolio page with project showcases
- Add authentication for admin access
- Replace file-based storage with a database
- Implement email notifications for form submissions
- Enhance the Process section with interactive animations and progress tracking
- Add case studies for each completed project

## License

MIT © [Your Name]
