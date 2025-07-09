@echo off
echo === Firebase Functions Deployment - Fixed Version ===
echo.

echo 1. Cleaning npm cache...
npm cache clean --force
echo.

echo 2. Installing dependencies...
cd backend\functions
npm install
cd ..\..
echo.

echo 3. Testing functions loading...
cd backend\functions
node -e "console.log('Testing...'); require('./index.js'); console.log('Functions loaded successfully!');"
cd ..\..
echo.

echo 4. Deploying Cloud Functions...
firebase deploy --only functions

if %ERRORLEVEL% EQU 0 (
    echo.
    echo === SUCCESS ===
    echo Cloud Functions deployed successfully!
    echo AI insights should now work in your project wizard.
    echo.
) else (
    echo.
    echo === DEPLOYMENT FAILED ===
    echo Please check the error above.
    echo Make sure you're logged in: firebase login
    echo.
)

echo 5. For Firebase Storage CORS (optional):
echo    Download Google Cloud SDK from: https://cloud.google.com/sdk/docs/install
echo    Then run: gsutil cors set cors.json gs://devfolio-84079.appspot.com
echo.

pause