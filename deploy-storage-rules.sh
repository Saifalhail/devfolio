#!/bin/bash

# Deploy Firebase Storage Rules
echo "🚀 Deploying Firebase Storage Rules..."

cd backend

# Check if Firebase CLI is available
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it with: npm install -g firebase-tools"
    exit 1
fi

# Deploy only storage rules
echo "📤 Deploying storage rules..."
firebase deploy --only storage

if [ $? -eq 0 ]; then
    echo "✅ Storage rules deployed successfully!"
    echo "🔄 Please try uploading a mockup again."
else
    echo "❌ Failed to deploy storage rules."
    echo "💡 You can manually set storage rules in the Firebase Console:"
    echo "   1. Go to https://console.firebase.google.com/"
    echo "   2. Select your project (devfolio-84079)"
    echo "   3. Go to Storage > Rules"
    echo "   4. Replace the rules with the content from storage.rules"
fi