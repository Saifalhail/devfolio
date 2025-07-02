# Firebase Storage CORS Fix Instructions

## Quick Fix - Apply CORS Configuration

Run this command to fix the CORS error for Firebase Storage:

```bash
gsutil cors set cors.json gs://devfolio-84079.appspot.com
```

## Prerequisites

1. Install Google Cloud SDK if not already installed:
   - Windows: Download from https://cloud.google.com/sdk/docs/install
   - Mac: `brew install google-cloud-sdk`
   - Linux: Follow instructions at https://cloud.google.com/sdk/docs/install

2. Authenticate with your Google account:
   ```bash
   gcloud auth login
   ```

3. Set your project:
   ```bash
   gcloud config set project devfolio-84079
   ```

## Verify CORS is Applied

After running the command, verify CORS configuration:

```bash
gsutil cors get gs://devfolio-84079.appspot.com
```

You should see the CORS configuration from cors.json displayed.

## Alternative - Use Firebase CLI

If you prefer using Firebase CLI:

```bash
firebase deploy --only storage
```

Note: This deploys storage rules but may not apply CORS configuration.

## If CORS Still Fails

The application now includes a base64 upload fallback that will automatically activate if CORS fails.