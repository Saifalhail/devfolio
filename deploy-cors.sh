#!/bin/bash

# Deploy CORS configuration to Firebase Storage
# This script fixes the CORS issue preventing image uploads from localhost

echo "🔧 Deploying CORS configuration to Firebase Storage..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud SDK (gcloud) is not installed."
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    echo "After installation, run: gcloud auth login"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n 1 &> /dev/null; then
    echo "❌ You are not authenticated with Google Cloud."
    echo "Please run: gcloud auth login"
    exit 1
fi

# Apply CORS configuration
echo "📡 Applying CORS configuration to devfolio-84079.appspot.com..."
gcloud storage buckets update gs://devfolio-84079.appspot.com --cors-file=cors.json

if [ $? -eq 0 ]; then
    echo "✅ CORS configuration deployed successfully!"
    echo "🔄 Please refresh your browser and try uploading an image again."
else
    echo "❌ Failed to deploy CORS configuration."
    echo "Please check your Google Cloud authentication and project access."
    exit 1
fi