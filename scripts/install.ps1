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
    Write-Host "   Installateur ExilonCMS" -ForegroundColor Cyan
    Write-Host "======================================" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCÈS] $Message" -ForegroundColor Green
}

function Write-Error-Func {
    param([string]$Message)
    Write-Host "[ERREUR] $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

Write-Header

if ($ProjectName -eq "--help" -or $ProjectName -eq "-h") {
    Write-Host "Usage: powershell -c `"irm https://raw.githubusercontent.com/Exilon-Studios/ExilonCMS/main/scripts/install.ps1 | iex`""
    Write-Host ""
    Write-Host "Exemples:"
    Write-Host "  irm https://raw.githubusercontent.com/Exilon-Studios/ExilonCMS/main/scripts/install.ps1 | iex"
    Write-Host "  powershell -c `"`$env:ProjectName='mon-site'; irm https://raw.githubusercontent.com/Exilon-Studios/ExilonCMS/main/scripts/install.ps1 | iex`""
    exit 0
}

Write-Info "Nom du projet: $ProjectName"

# Check if directory exists
if (Test-Path $ProjectName) {
    Write-Error-Func "Le répertoire '$ProjectName' existe déjà!"
    exit 1
}

# Ask for project name
Write-Host ""
$projectName = Read-Host "Nom du projet"
if ([string]::IsNullOrWhiteSpace($projectName)) {
    $projectName = $ProjectName
}

if ($projectName -notmatch '^[a-zA-Z0-9_-]+$') {
    Write-Error-Func "Nom de projet invalide. Utilisez uniquement des lettres, chiffres, tirets et underscores."
    exit 1
}

Write-Info "Nom du projet: $projectName"

# Check PHP
try {
    $phpVersion = php -r "echo PHP_VERSION;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "PHP $phpVersion trouvé"

        # Check minimum version
        $minVersion = "8.2"
        $major, $minor = $phpVersion.Split('.')[0..1]
        $currentVersion = "$major.$minor"

        if ([version]$currentVersion -lt [version]$minVersion) {
            Write-Error-Func "PHP $minVersion ou supérieur est requis (vous avez $currentVersion)"
            Write-Host ""
            Write-Host "Téléchargez PHP: https://windows.php.net/download/"
            exit 1
        }
    } else {
        throw "PHP non trouvé"
    }
} catch {
    Write-Error-Func "PHP n'est pas installé. Veuillez installer PHP 8.2 ou supérieur."
    Write-Host ""
    Write-Host "Téléchargez: https://windows.php.net/download/"
    Write-Host "Assurez-vous d'ajouter PHP à votre PATH système"
    exit 1
}

# Check Composer
$ErrorActionPreference = "Continue"
$composerFound = $false
try {
    $null = composer --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $composerFound = $true
        Write-Success "Composer trouvé"
    }
} catch {
    # Command failed, try next method
}

if (-not $composerFound) {
    # Try Get-Command as fallback
    $composerCmd = Get-Command composer -ErrorAction SilentlyContinue
    if ($composerCmd) {
        $composerFound = $true
        Write-Success "Composer trouvé"
    }
}

if (-not $composerFound) {
    Write-Error-Func "Composer n'est pas installé. Veuillez installer Composer d'abord."
    Write-Host "https://getcomposer.org/download/"
    exit 1
}

# Check Node.js
$nodeFound = $false
try {
    $nodeVersion = node -v 2>&1
    if ($LASTEXITCODE -eq 0) {
        $nodeFound = $true
        Write-Success "Node.js $nodeVersion trouvé"
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
        Write-Success "Node.js $nodeVersion trouvé"
    }
}

if (-not $nodeFound) {
    Write-Error-Func "Node.js n'est pas installé. Veuillez installer Node.js 18 ou supérieur."
    Write-Host "https://nodejs.org/"
    exit 1
}

$ErrorActionPreference = "Stop"

# Download CLI
Write-Info "Téléchargement du CLI ExilonCMS..."

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
Write-Info "Démarrage de l'installation..."
Write-Host ""

& php -f $outputFile -- new $projectName
$exitCode = $LASTEXITCODE

# Cleanup
Remove-Item $outputFile -Force -ErrorAction SilentlyContinue

# Show result
Write-Host ""
if ($exitCode -eq 0) {
    Write-Success "Installation terminée avec succès!"
    Write-Host ""
    Write-Host "Étapes suivantes:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  1. Lancer les migrations:" -ForegroundColor Green
    Write-Host "     cd $projectName" -ForegroundColor Cyan
    Write-Host "     php artisan migrate:fresh --seed" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  2. Démarrer le serveur:" -ForegroundColor Green
    Write-Host "     php artisan serve" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  C'est tout! 🎉" -ForegroundColor Green
    Write-Host "  SQLite est utilisé par défaut - aucune configuration de base de données nécessaire!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Pour migrer vers PostgreSQL plus tard:" -ForegroundColor Yellow
    Write-Host "     - Allez sur https://neon.tech (gratuit) ou https://supabase.com" -ForegroundColor Cyan
    Write-Host "     - Configurez DB_CONNECTION dans .env" -ForegroundColor Cyan
    Write-Host "     - Exportez votre DB SQLite depuis le panel admin" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Identifiants par défaut:" -ForegroundColor Yellow
    Write-Host "  Email: admin@example.com" -ForegroundColor Cyan
    Write-Host "  Mot de passe: password" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Documentation complète: https://github.com/Exilon-Studios/ExilonCMS/wiki" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Error-Func "L'installation a échouée avec le code de sortie $exitCode"
}
