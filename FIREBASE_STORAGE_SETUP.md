# Firebase Storage Setup

This guide helps you set up Firebase Storage for the DevFolio project to enable mockup uploads.

## Quick Fix for CORS Issues

If you're experiencing CORS errors when uploading mockups, you need to deploy the storage security rules.

### Option 1: Firebase CLI Deployment

Deploy storage rules using Firebase CLI:

```bash
firebase deploy --only storage
```

### Option 2: Manual Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`devfolio-84079`)
3. Navigate to **Storage** > **Rules**
4. Replace the existing rules with the content from `storage.rules`
5. Click **Publish**


## Current Storage Rules

The `storage.rules` file includes:

- **Forum Images**: Authenticated users can upload images up to 10MB
- **User Files**: Users can only access their own files  
- **Project Files**: Project owners and collaborators can access project files
- **Public Assets**: Read-only public access

## Development Mode

If storage upload fails, the system automatically falls back to base64 encoding for development purposes. This ensures mockups can still be uploaded and tested locally.

## Troubleshooting

### CORS Errors
- **Cause**: Firebase Storage security rules not deployed
- **Solution**: Deploy storage rules using one of the methods above

### Permission Denied
- **Cause**: User not authenticated or insufficient permissions
- **Solution**: Ensure user is logged in and rules allow the operation

### Upload Timeout
- **Cause**: Large file size or slow network
- **Solution**: System automatically falls back to base64 for development

## File Size Limits

- **Maximum file size**: 10MB
- **Allowed formats**: Images only (jpg, png, gif, webp, etc.)
- **Recommended size**: Under 2MB for optimal performance

## Security Notes

- All uploads require user authentication
- File type validation prevents non-image uploads
- Size limits prevent abuse
- Forum images are publicly readable but require auth to upload