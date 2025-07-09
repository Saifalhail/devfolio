# Deploy Cloud Functions & Fix Storage CORS - Quick Guide

## 1. Resolving CORS Error for AI Insights

The CORS error you're seeing is because the Cloud Functions haven't been deployed yet. Follow these steps:

### 1. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Deploy Cloud Functions
```bash
cd backend/functions
npm install
cd ../..
firebase deploy --only functions
```

### 4. Verify Deployment
After deployment, you should see output like:
```
✔  functions[generateProjectInsights]: Successful create operation.
Function URL (generateProjectInsights): https://us-central1-devfolio-84079.cloudfunctions.net/generateProjectInsights
```

### 5. Test the Application
- Try creating a new project through the wizard
- The AI insights should now generate successfully
- File uploads should work with the base64 fallback if CORS is still an issue

### Troubleshooting

If you still see errors:
1. Check that your Gemini API key is set in backend/functions/.env
2. Ensure you're logged into the correct Firebase project
3. Check the Firebase Console Functions tab for any errors
4. Look at the function logs: `firebase functions:log`

### For Local Development
If you want to test functions locally:
```bash
cd backend/functions
npm run serve
```

Then update your frontend to use the local emulator (add to src/firebase/config.js):
```javascript
import { connectFunctionsEmulator } from 'firebase/functions';

// After initializing functions
if (window.location.hostname === 'localhost') {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}
```

## 2. Fixing Firebase Storage CORS

Firebase Storage is also blocking file uploads due to CORS. To fix this:

### Option A: Apply CORS Configuration (Recommended)
```bash
# Install Google Cloud SDK if not already installed
# https://cloud.google.com/sdk/docs/install

# Apply the CORS configuration
gsutil cors set cors.json gs://devfolio-84079.appspot.com
```

### Option B: Deploy Storage Rules
```bash
firebase deploy --only storage
```

### Option C: Use Firebase Hosting (Production)
When deployed to Firebase Hosting, CORS issues are automatically resolved.

## Current Development Workaround

The code has been updated with a development fallback that:
- Allows project submission to continue even with CORS errors
- Stores file metadata with placeholder URLs
- Shows appropriate console warnings
- Once CORS is fixed, actual uploads will work automatically

## Quick Fix Steps

1. **Deploy everything at once:**
   ```bash
   firebase deploy
   ```

2. **Or deploy individually:**
   ```bash
   # Deploy functions
   firebase deploy --only functions
   
   # Deploy storage rules
   firebase deploy --only storage
   
   # Deploy hosting (if needed)
   firebase deploy --only hosting
   ```

3. **Apply CORS config (if gsutil is installed):**
   ```bash
   gsutil cors set cors.json gs://devfolio-84079.appspot.com
   ```