# PowerShell script to fix and deploy Firebase functions and storage

Write-Host "=== DevFolio Deployment Fix Script ===" -ForegroundColor Green

# Step 1: Ensure we're in the right directory
Set-Location -Path "C:\Users\salhail\Desktop\devfolio"

Write-Host "`n1. Installing missing dependencies..." -ForegroundColor Yellow
Set-Location -Path "backend\functions"
npm install
Set-Location -Path "..\.."

Write-Host "`n2. Deploying Cloud Functions..." -ForegroundColor Yellow
Write-Host "   This will enable AI insights generation" -ForegroundColor Gray
firebase deploy --only functions

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Functions deployed successfully!" -ForegroundColor Green
} else {
    Write-Host "   ✗ Functions deployment failed. Please check the error above." -ForegroundColor Red
    Write-Host "   If you see 'firebase login' error, run: firebase login" -ForegroundColor Yellow
}

Write-Host "`n3. Deploying Storage Rules..." -ForegroundColor Yellow
firebase deploy --only storage

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Storage rules deployed successfully!" -ForegroundColor Green
} else {
    Write-Host "   ✗ Storage rules deployment failed." -ForegroundColor Red
}

Write-Host "`n4. Checking for gsutil..." -ForegroundColor Yellow
$gsutilExists = Get-Command gsutil -ErrorAction SilentlyContinue

if ($gsutilExists) {
    Write-Host "   ✓ gsutil found. Applying CORS configuration..." -ForegroundColor Green
    gsutil cors set cors.json gs://devfolio-84079.appspot.com
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ CORS configuration applied successfully!" -ForegroundColor Green
    } else {
        Write-Host "   ✗ CORS configuration failed." -ForegroundColor Red
    }
} else {
    Write-Host "   ✗ gsutil not found." -ForegroundColor Red
    Write-Host "   To fix Firebase Storage CORS, you need to:" -ForegroundColor Yellow
    Write-Host "   1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install" -ForegroundColor Gray
    Write-Host "   2. Run: gcloud init" -ForegroundColor Gray
    Write-Host "   3. Run: gsutil cors set cors.json gs://devfolio-84079.appspot.com" -ForegroundColor Gray
    Write-Host "`n   Alternative: Deploy to Firebase Hosting for automatic CORS handling" -ForegroundColor Gray
}

Write-Host "`n=== Deployment Summary ===" -ForegroundColor Green
Write-Host "- Functions deployment will enable AI insights generation"
Write-Host "- Storage CORS needs gsutil (Google Cloud SDK) to be fixed"
Write-Host "- The app will work with placeholder file uploads until CORS is fixed"
Write-Host "`nYour project submission should now work!"

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")