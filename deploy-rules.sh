#!/bin/bash

# Deploy Firestore security rules
# This script deploys the updated security rules to fix permissions issues

echo "🔧 Deploying Firestore security rules..."

# Check if Firebase CLI is available
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed."
    echo "Please install it from: https://firebase.google.com/docs/cli"
    echo "After installation, run: firebase login"
    exit 1
fi

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    echo "❌ You are not logged in to Firebase."
    echo "Please run: firebase login"
    exit 1
fi

# Deploy the security rules
echo "📡 Deploying security rules to devfolio-84079..."
firebase deploy --only firestore:rules

if [ $? -eq 0 ]; then
    echo "✅ Firestore security rules deployed successfully!"
    echo "🔄 Mockup comments should now work properly."
else
    echo "❌ Failed to deploy security rules."
    echo "Please check your Firebase authentication and project access."
    exit 1
fi