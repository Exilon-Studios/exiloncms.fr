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
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Cyan
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
    Write-Error "Directory '$ProjectName' already exists!"
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
            Write-Error "PHP $minVersion or higher is required (you have $currentVersion)"
            Write-Host ""
            Write-Host "Download PHP: https://windows.php.net/download/"
            exit 1
        }
    } else {
        throw "PHP not found"
    }
} catch {
    Write-Error "PHP is not installed. Please install PHP 8.2 or higher."
    Write-Host ""
    Write-Host "Download: https://windows.php.net/download/"
    Write-Host "Make sure to add PHP to your system PATH"
    exit 1
}

# Check Composer
try {
    $null = & composer --version 2>&1
    if ($?) {
        Write-Success "Composer found"
    } else {
        throw "Composer not found"
    }
} catch {
    # Try alternate check
    try {
        $composerOutput = composer 2>&1
        if ($composerOutput -match "Composer") {
            Write-Success "Composer found"
        } else {
            throw "Composer not found"
        }
    } catch {
        Write-Error "Composer is not installed. Please install Composer first."
        Write-Host "https://getcomposer.org/download/"
        exit 1
    }
}

# Check Node.js
try {
    $nodeVersion = & node -v 2>&1
    if ($?) {
        Write-Success "Node.js $nodeVersion found"
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Error "Node.js is not installed. Please install Node.js 18 or higher."
    Write-Host "https://nodejs.org/"
    exit 1
}

# Download CLI
Write-Info "Downloading ExilonCMS CLI..."

$cliUrl = "https://raw.githubusercontent.com/Exilon-Studios/ExilonCMS/main/bin/exiloncms"
$outputFile = "exiloncms"

try {
    Invoke-WebRequest -Uri $cliUrl -OutFile $outputFile -UseBasicParsing
    Write-Success "CLI downloaded"
} catch {
    Write-Error "Failed to download CLI."
    exit 1
}

# Run installer
Write-Info "Starting installation..."
Write-Host ""

& php $outputFile $ProjectName
$exitCode = $LASTEXITCODE

# Cleanup
Remove-Item $outputFile -Force -ErrorAction SilentlyContinue

exit $exitCode
