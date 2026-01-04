# ExilonCMS Quick Install Script for Windows
# Usage: irm https://raw.githubusercontent.com/Exilon-Studios/ExilonCMS/main/scripts/install.ps1 | iex
#        or: powershell -c "irm https://raw.githubusercontent.com/Exilon-Studios/ExilonCMS/main/scripts/install.ps1 | iex"

param(
    [string]$ProjectName = "exiloncms"
)

$ErrorActionPreference = "Stop"

# Colors
function Write-Header {
    Write-Host ""
    Write-Host "======================================" -ForegroundColor Cyan
    Write-Host "   ExilonCMS Installer" -ForegroundColor Cyan
    Write-Host "======================================" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Success {
    param([string]$Message)
    Write-Host "[OK] $Message" -ForegroundColor Green
}

function Write-Error-Func {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

Write-Header

if ($ProjectName -eq "--help" -or $ProjectName -eq "-h") {
    Write-Host "Usage: powershell -c `"irm https://raw.githubusercontent.com/Exilon-Studios/ExilonCMS/main/scripts/install.ps1 | iex`""
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  irm https://raw.githubusercontent.com/Exilon-Studios/ExilonCMS/main/scripts/install.ps1 | iex"
    Write-Host "  powershell -c `"`$env:ProjectName='my-site'; irm https://raw.githubusercontent.com/Exilon-Studios/ExilonCMS/main/scripts/install.ps1 | iex`""
    exit 0
}

Write-Info "Project name: $ProjectName"

# Check if directory exists
if (Test-Path $ProjectName) {
    Write-Error-Func "Directory '$ProjectName' already exists!"
    exit 1
}

# Check PHP
try {
    $phpVersion = php -r "echo PHP_VERSION;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "PHP $phpVersion found"

        # Check minimum version
        $minVersion = "8.2"
        $major, $minor = $phpVersion.Split('.')[0..1]
        $currentVersion = "$major.$minor"

        if ([version]$currentVersion -lt [version]$minVersion) {
            Write-Error-Func "PHP $minVersion or higher is required (you have $currentVersion)"
            Write-Host ""
            Write-Host "Download PHP: https://windows.php.net/download/"
            exit 1
        }
    } else {
        throw "PHP not found"
    }
} catch {
    Write-Error-Func "PHP is not installed. Please install PHP 8.2 or higher."
    Write-Host ""
    Write-Host "Download: https://windows.php.net/download/"
    Write-Host "Make sure to add PHP to your system PATH"
    exit 1
}

# Check Composer
$ErrorActionPreference = "Continue"
$composerFound = $false
try {
    $null = composer --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $composerFound = $true
        Write-Success "Composer found"
    }
} catch {
    # Command failed, try next method
}

if (-not $composerFound) {
    # Try Get-Command as fallback
    $composerCmd = Get-Command composer -ErrorAction SilentlyContinue
    if ($composerCmd) {
        $composerFound = $true
        Write-Success "Composer found"
    }
}

if (-not $composerFound) {
    Write-Error-Func "Composer is not installed. Please install Composer first."
    Write-Host "https://getcomposer.org/download/"
    exit 1
}

# Check Node.js
$nodeFound = $false
try {
    $nodeVersion = node -v 2>&1
    if ($LASTEXITCODE -eq 0) {
        $nodeFound = $true
        Write-Success "Node.js $nodeVersion found"
    }
} catch {
    # Command failed, try next method
}

if (-not $nodeFound) {
    # Try Get-Command as fallback
    $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
    if ($nodeCmd) {
        $nodeFound = $true
        $nodeVersion = & node -v 2>$null
        Write-Success "Node.js $nodeVersion found"
    }
}

if (-not $nodeFound) {
    Write-Error-Func "Node.js is not installed. Please install Node.js 18 or higher."
    Write-Host "https://nodejs.org/"
    exit 1
}

$ErrorActionPreference = "Stop"

# Download CLI
Write-Info "Downloading ExilonCMS CLI..."

$cliUrl = "https://raw.githubusercontent.com/Exilon-Studios/ExilonCMS/main/bin/exiloncms"
$outputFile = "exiloncms"

try {
    $cliContent = Invoke-WebRequest -Uri $cliUrl -UseBasicParsing | Select-Object -ExpandProperty Content
    # Ensure UTF-8 without BOM
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    $outputPath = Join-Path (Get-Location) $outputFile
    [System.IO.File]::WriteAllText($outputPath, $cliContent, $utf8NoBom)
    Write-Success "CLI downloaded"
} catch {
    Write-Error-Func "Failed to download CLI."
    exit 1
}

# Run installer
Write-Info "Starting installation..."
Write-Host ""

& php -f $outputFile -- new $ProjectName
$exitCode = $LASTEXITCODE

# Cleanup
Remove-Item $outputFile -Force -ErrorAction SilentlyContinue

# Show result
Write-Host ""
if ($exitCode -eq 0) {
    Write-Success "Installation completed successfully!"
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  cd $ProjectName"
    Write-Host "  php artisan migrate:fresh --seed"
    Write-Host "  npm install"
    Write-Host "  npm run build"
    Write-Host "  php artisan serve"
} else {
    Write-Error-Func "Installation failed with exit code $exitCode"
}
