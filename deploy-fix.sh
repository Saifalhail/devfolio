#!/bin/bash
# Bash script to fix and deploy Firebase functions and storage

echo -e "\033[32m=== DevFolio Deployment Fix Script ===\033[0m"

# Step 1: Ensure we're in the right directory
cd "$(dirname "$0")"

echo -e "\n\033[33m1. Installing missing dependencies...\033[0m"
cd backend/functions
npm install
cd ../..

echo -e "\n\033[33m2. Deploying Cloud Functions...\033[0m"
echo -e "\033[90m   This will enable AI insights generation\033[0m"
firebase deploy --only functions

if [ $? -eq 0 ]; then
    echo -e "\033[32m   ✓ Functions deployed successfully!\033[0m"
else
    echo -e "\033[31m   ✗ Functions deployment failed. Please check the error above.\033[0m"
    echo -e "\033[33m   If you see 'firebase login' error, run: firebase login\033[0m"
fi

echo -e "\n\033[33m3. Deploying Storage Rules...\033[0m"
firebase deploy --only storage

if [ $? -eq 0 ]; then
    echo -e "\033[32m   ✓ Storage rules deployed successfully!\033[0m"
else
    echo -e "\033[31m   ✗ Storage rules deployment failed.\033[0m"
fi

echo -e "\n\033[33m4. Checking for gsutil...\033[0m"
if command -v gsutil &> /dev/null; then
    echo -e "\033[32m   ✓ gsutil found. Applying CORS configuration...\033[0m"
    gsutil cors set cors.json gs://devfolio-84079.appspot.com
    
    if [ $? -eq 0 ]; then
        echo -e "\033[32m   ✓ CORS configuration applied successfully!\033[0m"
    else
        echo -e "\033[31m   ✗ CORS configuration failed.\033[0m"
    fi
else
    echo -e "\033[31m   ✗ gsutil not found.\033[0m"
    echo -e "\033[33m   To fix Firebase Storage CORS, you need to:\033[0m"
    echo -e "\033[90m   1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install\033[0m"
    echo -e "\033[90m   2. Run: gcloud init\033[0m"
    echo -e "\033[90m   3. Run: gsutil cors set cors.json gs://devfolio-84079.appspot.com\033[0m"
    echo -e "\033[90m\n   Alternative: Deploy to Firebase Hosting for automatic CORS handling\033[0m"
fi

echo -e "\n\033[32m=== Deployment Summary ===\033[0m"
echo "- Functions deployment will enable AI insights generation"
echo "- Storage CORS needs gsutil (Google Cloud SDK) to be fixed"
echo "- The app will work with placeholder file uploads until CORS is fixed"
echo -e "\nYour project submission should now work!"

echo -e "\nPress any key to exit..."
read -n 1 -s