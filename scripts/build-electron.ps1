# Build Electron App Script
param(
    [switch]$Dev
)

$ErrorActionPreference = "Stop"

# Build Next.js app first
Write-Host "Building Next.js app..." -ForegroundColor Cyan
bun run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build complete!" -ForegroundColor Green
Write-Host ""

if ($Dev) {
    # Start Next.js in background
    Write-Host "Starting Next.js dev server..." -ForegroundColor Cyan
    $nextJob = Start-Job -ScriptBlock { 
        Set-Location $using:pwd
        bun run dev
    } 
    
    # Wait for server
    for ($i = 0; $i -lt 10; $i++) {
        Start-Sleep -Milliseconds 500
        try {
            $null = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -ErrorAction Stop
            Write-Host "Next.js server ready!" -ForegroundColor Green
            break
        } catch {
            Write-Host "Waiting for server... ($i)" -ForegroundColor Yellow
        }
    }
    
    # Start Electron
    Write-Host "Starting Electron..." -ForegroundColor Cyan
    & npx electron .
    
    # Cleanup
    Stop-Job $nextJob -ErrorAction SilentlyContinue
    Remove-Job $nextJob -ErrorAction SilentlyContinue
} else {
    Write-Host "Production build ready!" -ForegroundColor Green
}