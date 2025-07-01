# Firebase Setup Guide for DevFolio

This guide explains how to properly set up Firebase for both the frontend and backend parts of the DevFolio project.

## Security Best Practices

1. **Never commit API keys or credentials to version control**
   - Keep all `.env` and `.env.local` files in `.gitignore`
   - Use example files without real credentials
   - Rotate keys if they've been accidentally committed

## Firebase Authentication Setup

The DevFolio project uses Firebase Authentication for user management with multiple sign-in methods. Follow these steps to set up authentication for your project:

### 1. Enable Authentication Providers

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to "Authentication" in the left sidebar
4. Click on the "Sign-in method" tab
5. Enable the following providers:
   - **Google**: Click "Enable" and add your support email
   - **Email/Password**: Simply click "Enable"
   - **Phone**: Click "Enable" and configure your default country

### 2. Configure Google Authentication

1. For Google authentication to work properly in production:
   - Add your domain to the authorized domains list in Firebase Console
   - Create OAuth credentials in the Google Cloud Console
   - Add the correct redirect URIs

2. For local development:
   - Add `localhost` to the authorized domains list

### 3. Configure Phone Authentication

1. For phone authentication to work:
   - Make sure you've enabled the provider in Firebase Console
   - Set up reCAPTCHA verification
   - For testing, you can use test phone numbers in the Firebase Console

### 4. Update Environment Variables

Add the following variables to your `.env.local` file:

```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

2. **Use environment variables for all sensitive configuration**
   - Frontend: Use `REACT_APP_` prefixed variables
   - Backend: Use dotenv to load variables from `.env`

3. **Set up proper Firebase security rules**
   - Restrict access to your Firestore database
   - Only allow authenticated operations when needed
   - Validate data structure in security rules

4. **Remove hardcoded credentials**
   - Remove any hardcoded fallback credentials in production
   - Use environment variables consistently

5. **Implement proper input validation**
   - Validate all form inputs on both client and server
   - Sanitize data before storing in the database

## Frontend Setup (React)

1. Copy the `.env.local.example` file to `.env.local`:
   ```
   cp .env.local.example .env.local
   ```

2. Update the values in `.env.local` with your Firebase project configuration.

3. Restart your development server:
   ```
   npm start
   ```

## Backend Setup (Firebase Functions)

1. Copy the `.env.example` file to `.env` in the functions directory:
   ```
   cd backend/functions
   cp .env.example .env
   ```

2. Update the values in `.env` with your Firebase project configuration.

3. Set up SendGrid for email notifications:
   - Create a free SendGrid account at [sendgrid.com](https://sendgrid.com)
   - Create an API key in the SendGrid dashboard (Settings > API Keys)
   - Add the API key to your `.env` file:
     ```
     SENDGRID_API_KEY=your-sendgrid-api-key
     FROM_EMAIL=noreply@yourdomain.com
     TO_EMAIL=Saifalhail@gmail.com
     ```
   - Verify your sender email address in SendGrid (Settings > Sender Authentication)

4. Install the required dependencies:
   ```
   cd backend/functions
   npm install @sendgrid/mail dotenv
   ```

5. Deploy your Firebase Functions:
   ```
   firebase deploy --only functions
   ```

## Contact Form Setup

### Firestore Database Setup (for storing submissions)

1. Enable the Firestore API in your Google Cloud Console:
   - Visit [https://console.cloud.google.com/apis/api/firestore.googleapis.com](https://console.cloud.google.com/apis/api/firestore.googleapis.com)
   - Select your project and click "Enable"
   - Wait a few minutes for the changes to propagate

2. View your form submissions:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Navigate to "Firestore Database" in the left sidebar
   - Look for the "contactSubmissions" collection

### Email Notification Setup (optional)

1. Create a free SendGrid account at [sendgrid.com](https://sendgrid.com)
2. Create an API key in the SendGrid dashboard (Settings > API Keys)
3. Verify your sender email address in SendGrid (Settings > Sender Authentication)
4. Add the API key to your `.env` file in the functions directory:
   ```
   SENDGRID_API_KEY=your-sendgrid-api-key
   FROM_EMAIL=your-verified-sender@example.com
   TO_EMAIL=Saifalhail@gmail.com
   ```
5. Deploy your functions again:
   ```
   firebase deploy --only functions
   ```

## Troubleshooting

If you encounter errors when submitting the contact form:

1. Check the Firebase Functions logs in the Firebase Console
2. Verify that your Firestore API is enabled
3. If using SendGrid, verify that your API key and sender email are correctly set up
4. Make sure all environment variables are properly set

## Testing Firebase in Offline Environments

For testing in offline environments like Codex AI, we've implemented a comprehensive mocking system:

### Firebase Mocks

The project includes mock implementations of Firebase services in `src/__mocks__/firebase.js` that simulate Firebase functionality without requiring network access:

- **Authentication**: Mock implementations of `signInWithGoogle`, `signInWithEmailPassword`, etc.
- **Firestore**: Mock implementations of `collection`, `doc`, `get`, etc.
- **Listeners**: Mock implementations that return unsubscribe functions

### Firebase Listener Cleanup

To prevent memory leaks when using Firebase listeners, use the `useFirebaseListener` hook:

```javascript
import useFirebaseListener from '../hooks/useFirebaseListener';

function MyComponent() {
  useFirebaseListener(() => {
    // Set up the listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Handle auth state changes
    });
    
    // Return the unsubscribe function
    return unsubscribe;
  }, []);
  
  // Rest of component
}
```

This hook ensures that Firebase listeners are properly unsubscribed when the component unmounts.

## Firestore Security Rules

To protect your Firestore database, you should set up proper security rules. Here's a recommended configuration for your contact form submissions:

1. Create or update your `firestore.rules` file in the root of your project:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Contact form submissions - only allow creation, not reading/updating/deleting
    match /contactSubmissions/{submission} {
      // Allow creation with proper validation
      allow create: if request.resource.data.name is string &&
                      request.resource.data.name.size() > 0 &&
                      request.resource.data.email is string &&
                      request.resource.data.email.matches('^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$') &&
                      request.resource.data.message is string &&
                      request.resource.data.message.size() > 0;
      
      // Only allow admin access to read submissions
      allow read, update, delete: if false; // Replace with admin authentication check in production
    }
    
    // Default deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

2. Deploy your security rules:

```bash
firebase deploy --only firestore:rules
```

## Firebase Storage CORS Configuration

When developing locally, you may encounter CORS (Cross-Origin Resource Sharing) errors when trying to upload images to Firebase Storage. This is because Firebase Storage doesn't allow requests from `localhost` by default.

### Symptoms of CORS Issues

- Error messages like: "Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/...' from origin 'http://localhost:3000' has been blocked by CORS policy"
- Image uploads fail and fall back to base64 encoding
- Console shows "Upload timed out" errors

### Solution: Deploy CORS Configuration

1. **Install Google Cloud SDK** (if not already installed):
   - Download from: https://cloud.google.com/sdk/docs/install
   - Follow the installation instructions for your platform

2. **Authenticate with Google Cloud**:
   ```bash
   gcloud auth login
   ```

3. **Deploy CORS configuration**:
   ```bash
   ./deploy-cors.sh
   ```

   Or manually run:
   ```bash
   gcloud storage buckets update gs://devfolio-84079.appspot.com --cors-file=cors.json
   ```

### CORS Configuration Details

The `cors.json` file allows the following origins:
- `http://localhost:3000` (local development)
- `http://127.0.0.1:3000` (alternative local address)
- `https://devfolio-84079.web.app` (Firebase Hosting)
- `https://devfolio-84079.firebaseapp.com` (Firebase Hosting alternative)

### Fallback: Base64 Image Storage

If CORS configuration cannot be deployed, the application automatically falls back to storing compressed base64 images directly in Firestore. This works for development but has limitations:
- Images are compressed to stay under Firestore's 1MB field limit
- Reduced image quality compared to Firebase Storage URLs
- Not recommended for production use

## Firestore Security Rules for Mockup Comments

If you encounter "Missing or insufficient permissions" errors when adding comments to mockups, you need to deploy updated Firestore security rules.

### Deploy Security Rules

Run the following script to deploy updated rules:
```bash
./deploy-rules.sh
```

Or manually deploy:
```bash
firebase deploy --only firestore:rules
```

### Required Rules

The `firestore.rules` file includes permissions for:
- `projects/{projectId}/mockups/{mockupId}/comments` - For mockup comments
- Authenticated users can read, create, update, and delete comments
- All authenticated users have access to mockup features

## Upgrading Node.js Runtime

Firebase has indicated that Node.js 18 will be decommissioned on 2025-10-31. Consider upgrading to a newer runtime version in your `functions/package.json` file:

```json
"engines": {
  "node": "20"
}
```
