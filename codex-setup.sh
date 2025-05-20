#!/bin/bash

# This script automatically sets up environment files for Codex tasks

echo "Setting up environment files for Codex..."

# Generate .env.local from environment variables
cat <<EOF > .env.local
REACT_APP_FIREBASE_API_KEY=$REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=$REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID=$REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=$REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=$REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID=$REACT_APP_FIREBASE_APP_ID
REACT_APP_FIREBASE_MEASUREMENT_ID=$REACT_APP_FIREBASE_MEASUREMENT_ID
EOF

# Create backend/functions directory if it doesn't exist
mkdir -p backend/functions

# Generate .env file for backend functions
cat <<EOF > backend/functions/.env
SENDGRID_API_KEY=$SENDGRID_API_KEY
FROM_EMAIL=noreply@yourdomain.com
TO_EMAIL=saifalhail@gmail.com
EOF

echo "Environment files created successfully!"
echo "Frontend env: .env.local"
echo "Backend env: backend/functions/.env"

# Install dependencies
echo "Installing dependencies..."
npm install

# Check if Firebase tools is installed
if ! command -v firebase &> /dev/null; then
    echo "Installing Firebase tools globally..."
    npm install -g firebase-tools
fi

echo "Setup complete!"
