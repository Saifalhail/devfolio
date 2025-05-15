# DevFolio - Software Service Company Website

A modern, responsive website for a solo developer offering software services including web development, mobile apps, QR codes, and more tech-related applications.

## Features

- **Modern UI/UX Design**: Clean, professional interface with a modern aesthetic
- **Responsive Design**: Fully responsive for desktop and mobile devices
- **Localization**: Support for both English and Arabic languages
- **Service Showcase**: Highlighting various tech services offered
- **Contact Form**: Easy way for potential clients to reach out
- **Tech Stack**: Built with React and styled-components

## Color Palette

The website uses the following color scheme:
- Primary Background: #feefc4
- Accent Color 1: #faaa93
- Accent Color 2: #82a1bf
- Dark Color: #513a52

## Tech Stack

- **Frontend**: React.js, styled-components
- **Routing**: React Router
- **Internationalization**: i18next, react-i18next
- **Backend**: Firebase Cloud Functions and Firestore
- **Email Notifications**: SendGrid integration (optional)

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository
   ```bash
   git clone [repository-url]
   ```

2. Navigate to the project directory
   ```bash
   cd devfolio
   ```

3. Install dependencies
   ```bash
   npm install
   ```

4. Set up environment variables
   ```bash
   # For frontend
   cp .env.local.example .env.local
   # Edit .env.local with your Firebase credentials
   
   # For backend
   cd backend/functions
   cp .env.example .env
   # Edit .env with your Firebase and SendGrid credentials
   ```

5. Start the development server
   ```bash
   npm start
   ```

## Security

This project implements several security best practices:

- **Environment Variables**: All sensitive credentials are stored in environment variables
- **Input Validation**: Form inputs are validated on both client and server sides
- **Firestore Security Rules**: Database access is restricted through security rules
- **Error Handling**: Proper error handling to prevent information leakage
- **SendGrid Integration**: Secure email handling through SendGrid API (optional)

For detailed security setup instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser

### Building for Production

```bash
npm run build
```

This will create an optimized production build in the `build` folder.

## Project Structure

```
devfolio/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── assets/        # Images and other static assets
│   ├── components/    # React components
│   │   ├── Common/    # Reusable components
│   │   ├── Home/      # Home page components
│   │   └── Layout/    # Layout components
│   ├── locales/       # Internationalization files
│   ├── styles/        # Global styles and theme
│   ├── App.js         # Main App component
│   └── index.js       # Entry point
└── README.md
```

## License

MIT © Saif Al-Hail

