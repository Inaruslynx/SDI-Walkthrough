# Ensure script runs as Administrator
if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "Requesting administrator privileges..."
    Start-Process powershell "-ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

Write-Host "Deploying Next.js app..."
cd "C:\walkthrough\next-front-end"

Write-Host "Stopping existing service..."
node uninstallService.js

Write-Host "Pulling latest code from main branch..."
git fetch origin main
git reset --hard origin/main

Write-Host "Installing dependencies and building the project..."
pnpm install --force
pnpm build

# Copy required files into standalone output
Write-Host "Copying necessary files into standalone build..."

# Ensure target folders exist
New-Item -ItemType Directory -Force -Path ".\.next\standalone\public" | Out-Null
New-Item -ItemType Directory -Force -Path ".\.next\standalone\.next\static" | Out-Null

# Copy public directory
Copy-Item -Path ".\public\*" -Destination ".\.next\standalone\public" -Recurse -Force

# Copy .env.local
Copy-Item -Path ".\.env.local" -Destination ".\.next\standalone\" -Force

# Copy .next/static directory
Copy-Item -Path ".\.next\static\*" -Destination ".\.next\standalone\.next\static" -Recurse -Force

Write-Host "✅ File copy complete."

Write-Host "Installing service..."
node installService.js

Write-Host "✅ Deployment complete."