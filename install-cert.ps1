# Install Local CA Certificate
# This script installs the local CA certificate to your Trusted Root Certification Authorities
# Run this script as Administrator or it will use Current User store

$caPath = Join-Path $PSScriptRoot "certs\ca.pem"

if (-not (Test-Path $caPath)) {
    Write-Host "❌ CA certificate not found at: $caPath" -ForegroundColor Red
    Write-Host "Please run 'node generate-cert.js' first to generate the certificates." -ForegroundColor Yellow
    exit 1
}

Write-Host "Installing Local CA Certificate..." -ForegroundColor Cyan
Write-Host "Location: $caPath" -ForegroundColor Gray

try {
    # Check if running as Administrator
    $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    
    if ($isAdmin) {
        # Install to LocalMachine (all users)
        certutil -addstore -f Root "$caPath"
        Write-Host "✓ CA certificate installed for all users (LocalMachine)" -ForegroundColor Green
    } else {
        # Install to CurrentUser only
        certutil -addstore -user -f Root "$caPath"
        Write-Host "✓ CA certificate installed for current user only" -ForegroundColor Green
        Write-Host "💡 To install for all users, run this script as Administrator" -ForegroundColor Yellow
    }
    
    Write-Host "`n✅ Certificate installation complete!" -ForegroundColor Green
    Write-Host "🔄 Please restart your browser for changes to take effect." -ForegroundColor Yellow
    Write-Host "🌐 Then visit: https://localhost:3000" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to install certificate: $_" -ForegroundColor Red
    Write-Host "`nAlternative method:" -ForegroundColor Yellow
    Write-Host "1. Double-click on: certs\ca.pem" -ForegroundColor Gray
    Write-Host "2. Click 'Install Certificate...'" -ForegroundColor Gray
    Write-Host "3. Select 'Current User' → Next" -ForegroundColor Gray
    Write-Host "4. Select 'Place all certificates in the following store'" -ForegroundColor Gray
    Write-Host "5. Browse → 'Trusted Root Certification Authorities' → OK" -ForegroundColor Gray
    Write-Host "6. Next → Finish → Yes to security warning" -ForegroundColor Gray
    exit 1
}
