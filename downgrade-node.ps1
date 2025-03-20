# Downgrade-Node.ps1
# This script helps install Node.js v18.18.2 which is compatible with Expo
# Run it with PowerShell (Administrator mode recommended)

Write-Host "Node.js Downgrade Helper for Expo" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Check current Node.js version
try {
    $currentVersion = node -v
    Write-Host "Current Node.js version: $currentVersion" -ForegroundColor Yellow
} catch {
    Write-Host "Node.js is not installed or not in PATH" -ForegroundColor Red
}

# Ask user if they want to proceed
Write-Host ""
Write-Host "This will help you install Node.js v18.18.2 which is compatible with Expo." -ForegroundColor Cyan
Write-Host "Options:" -ForegroundColor Cyan
Write-Host "1. Download Node.js v18.18.2 installer" -ForegroundColor White
Write-Host "2. Install nvm-windows (Node Version Manager)" -ForegroundColor White
Write-Host "3. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host "Opening the Node.js v18.18.2 download page..." -ForegroundColor Green
        Start-Process "https://nodejs.org/download/release/v18.18.2/"
        Write-Host "Download 'node-v18.18.2-x64.msi' for 64-bit Windows" -ForegroundColor Yellow
        Write-Host "After installation, restart your computer and try running Expo again." -ForegroundColor Yellow
    }
    "2" {
        Write-Host "Opening the nvm-windows release page..." -ForegroundColor Green
        Start-Process "https://github.com/coreybutler/nvm-windows/releases"
        Write-Host "Download and install 'nvm-setup.exe'" -ForegroundColor Yellow
        Write-Host "After installation, restart your terminal and run:" -ForegroundColor Yellow
        Write-Host "nvm install 18.18.2" -ForegroundColor White
        Write-Host "nvm use 18.18.2" -ForegroundColor White
        Write-Host "Then try running Expo again." -ForegroundColor Yellow
    }
    "3" {
        Write-Host "Exiting..." -ForegroundColor Red
    }
    default {
        Write-Host "Invalid choice. Exiting..." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "For more information, visit: https://docs.expo.dev/troubleshooting/nodejs/" -ForegroundColor Cyan 