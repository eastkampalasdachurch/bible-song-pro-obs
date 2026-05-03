# Build Electron App Script
param(
    [switch]$Dev
)

$ErrorActionPreference = "Stop"

# Build Next.js app first
Write-Host "Building Next.js app..." -ForegroundColor Cyan
& npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build complete!" -ForegroundColor Green

# Start Next.js dev server in background
if ($Dev) {
    Write-Host "Starting Next.js dev server..." -ForegroundColor Cyan
    $nextJob = Start-Job -ScriptBlock { 
        Set-Location $using:pwd
        & npm run dev 
    }
    
    # Wait for server to be ready
    Write-Host "Waiting for Next.js server..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    Write-Host "Starting Electron..." -ForegroundColor Cyan
    & npx electron .
    
    # Clean up
    Stop-Job $nextJob
    Remove-Job $nextJob
} else {
    # Production build
    Write-Host "Building Electron app..." -ForegroundColor Cyan
    & npx electron-builder --win portable
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Electron build failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Electron build complete!" -ForegroundColor Green
}