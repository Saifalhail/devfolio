# Deployment Guide - Project Submission Fix

This guide will help you deploy the fixes for the project submission issues.

## Changes Made

### 1. Fixed React Hooks Order Issue
- **File**: `/src/components/Common/Modal.js`
- **Fix**: Moved `IconContainer` styled component outside of the Modal component to prevent hooks order changes

### 2. Fixed File Upload Processing
- **File**: `/src/components/Dashboard/ProjectWizard.jsx`
- **Fix**: Updated file upload logic to properly extract File objects from the DragDropUploader wrapper
- Added validation to ensure only valid File/Blob objects are uploaded

### 3. Updated Firebase Storage Rules
- **File**: `/storage.rules`
- **Fix**: Simplified write permissions for authenticated users during project creation
- This allows files to be uploaded even before the project document exists in Firestore

### 4. Fixed Styled-Components Warnings
- **File**: `/src/components/Common/Button.js`
- **Fix**: Updated to use transient props (prefixed with $) to prevent DOM warnings
- Added support for margin props without passing them to DOM

### 5. Improved Error Handling
- **Files**: `/src/firebase/services/projects.ts`, `/src/components/Dashboard/ProjectWizard.jsx`
- **Fix**: Added user-friendly error messages for common failure scenarios
- Better handling of authentication and network errors

## Deployment Steps

### 1. Deploy Firebase Storage Rules
```bash
firebase deploy --only storage
```

### 2. Deploy Cloud Functions (if not already deployed)
```bash
cd backend/functions
npm install
cd ../..
firebase deploy --only functions
```

### 3. Build and Deploy the React App
```bash
# Build the app
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### 4. Full Deployment (All Services)
```bash
# Deploy everything at once
firebase deploy
```

## Testing the Fix

1. **Test Project Creation**:
   - Log in to the application
   - Click "Create New Project"
   - Fill in all required fields
   - Try uploading some test files
   - Submit the project

2. **Verify File Uploads**:
   - Check the browser console for any errors
   - Verify files are uploaded successfully
   - Check Firebase Storage to confirm files are saved

3. **Check for Warnings**:
   - Open browser DevTools console
   - Look for any styled-components warnings
   - Verify no "Unknown prop" warnings appear

## Troubleshooting

### If CORS errors persist:
1. The CORS configuration needs to be applied using gsutil:
   ```bash
   gsutil cors set cors.json gs://devfolio-84079.appspot.com
   ```
   See `APPLY_CORS_FIX.md` for detailed instructions.

2. Ensure you're logged in with Firebase:
   ```bash
   firebase login
   ```

### If Cloud Functions fail:
1. Check the functions logs:
   ```bash
   firebase functions:log
   ```

2. Ensure environment variables are set:
   ```bash
   cd backend/functions
   # Copy .env.example to .env and add your Gemini API key
   cp .env.example .env
   ```

### If authentication errors occur:
1. Verify Firebase Authentication is enabled in the Firebase Console
2. Check that the user is properly logged in before creating projects
3. Ensure Firestore security rules allow authenticated users to create projects

## Next Steps

After deployment:
1. Monitor the application for any remaining issues
2. Check Firebase Console for any errors in Functions logs
3. Test the complete project creation flow multiple times
4. Consider adding monitoring/alerting for failed uploads

## Support

If issues persist after following this guide:
1. Check the browser console for specific error messages
2. Review Firebase Console logs (Functions, Storage, Firestore)
3. Verify all environment variables are correctly set
4. Ensure all Firebase services are properly configured