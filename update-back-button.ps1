$content = Get-Content 'c:\Users\salhail\Desktop\devfolio\src\components\Common\AuthModal.js' -Raw

# Replace the first back button
$pattern1 = '(<BackButton onClick={backToOptions}>)\s+← {t\(''auth\.back'', ''Back to options''\)}\s+(</BackButton>)'
$replacement1 = '$1←$2'
$content = $content -replace $pattern1, $replacement1

# Replace the second back button (if it exists)
$pattern2 = '(<BackButton onClick={backToOptions}>)\s+← {t\(''auth\.back'', ''Back to options''\)}\s+(</BackButton>)'
$replacement2 = '$1←$2'
$content = $content -replace $pattern2, $replacement2

# Save the updated content
$content | Set-Content 'c:\Users\salhail\Desktop\devfolio\src\components\Common\AuthModal.js'

Write-Host "Back buttons updated successfully!"
