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

## Future Enhancements

- Add more service pages with detailed information
- Implement a portfolio page with project showcases
- Add authentication for admin access
- Replace file-based storage with a database
- Implement email notifications for form submissions

## License

MIT © [Your Name]
