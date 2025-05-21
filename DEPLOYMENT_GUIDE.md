# DevFolio Deployment Guide

This guide explains how to properly deploy the DevFolio application to production environments while maintaining security for API keys and Firebase configuration. It also covers local development setup.

## Local Development Setup

### Option 1: Using Mock Firebase (Recommended for UI Development)

The application is configured to use mock Firebase services when no environment variables are provided. This allows you to develop and test the UI without needing actual Firebase credentials.

1. Simply run the application without setting up any environment variables:
   ```bash
   npm start
   ```

2. The application will automatically use mock Firebase services with the following limitations:
   - Authentication will always return a mock user
   - Firestore operations will return empty data or success messages
   - Storage operations will return mock URLs
   - No actual data will be saved or retrieved

### Option 2: Using Real Firebase with Environment Variables

For full functionality during development, you'll need to set up Firebase and provide the credentials:

1. Create a `.env.local` file in the project root with your Firebase configuration:
   ```
   # Firebase Configuration
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

2. Restart the development server:
   ```bash
   npm start
   ```

### Option 3: Using Firebase Emulators

For local development with Firebase emulators:

1. Install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Start the Firebase emulators:
   ```bash
   firebase emulators:start
   ```

3. Add the following to your `.env.local` file:
   ```
   REACT_APP_USE_FIREBASE_EMULATORS=true
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Production Environment Variables

The application requires several environment variables to function properly in production. These are used for Firebase configuration and other API integrations.

### Required Environment Variables

```
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Other API Keys (if applicable)
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
REACT_APP_EMAIL_SERVICE_ID=your-email-service-id
REACT_APP_EMAIL_TEMPLATE_ID=your-email-template-id
REACT_APP_EMAIL_USER_ID=your-email-user-id
```

## Deployment to Netlify

### 1. Create a new site in Netlify

1. Log in to your Netlify account
2. Click "New site from Git"
3. Connect to your Git provider (GitHub, GitLab, or Bitbucket)
4. Select the DevFolio repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`

### 2. Configure Environment Variables

1. Go to Site settings > Build & deploy > Environment
2. Add all the required environment variables listed above
3. Trigger a new deploy to apply the environment variables

### 3. Configure Redirects for React Router

Create a `_redirects` file in the `public` directory with the following content:

```
/*    /index.html   200
```

This ensures that all routes are handled by React Router.

## Deployment to Vercel

### 1. Create a new project in Vercel

1. Log in to your Vercel account
2. Click "New Project"
3. Import your Git repository
4. Configure project settings:
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`

### 2. Configure Environment Variables

1. Go to Project Settings > Environment Variables
2. Add all the required environment variables listed above
3. Specify which environments (Production, Preview, Development) should use these variables

## Deployment to Firebase Hosting

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize Firebase Hosting

```bash
firebase init hosting
```

Select the following options:
- Use an existing project and select your Firebase project
- Specify `build` as your public directory
- Configure as a single-page app
- Set up automatic builds and deploys with GitHub (optional)

### 4. Configure Environment Variables

For Firebase Hosting with GitHub integration, add your environment variables as secrets in your GitHub repository.

For manual deployments, create a `.env` file with all required variables before building.

### 5. Deploy to Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

## Security Considerations

1. **Never commit API keys or secrets to your repository**
2. **Use environment variables for all sensitive information**
3. **Set up proper Firebase Security Rules** for Firestore, Storage, and other services
4. **Configure Firebase Authentication** settings in the Firebase Console
5. **Enable only the necessary Firebase services** for your application

## Troubleshooting

### Firebase Authentication Issues

If users are unable to sign in after deployment:
1. Verify that the correct Firebase API key is set in environment variables
2. Check that the authorized domains are configured in Firebase Console > Authentication > Settings > Authorized domains
3. Add your production domain to the list of authorized domains

### Firebase Functions Issues

If Cloud Functions are not working:
1. Ensure the Firebase project has billing enabled (required for outbound network requests)
2. Check that the correct region is specified in your functions
3. Verify that the service account has the necessary permissions

### CORS Issues

If you encounter CORS errors:
1. Configure CORS in your Firebase Storage and Functions
2. For Storage: Firebase Console > Storage > Rules
3. For Functions: Add CORS middleware to your Express functions
