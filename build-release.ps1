# Build Script for ExilonCMS Release

$ErrorActionPreference = "Stop"

Write-Host "Building ExilonCMS Release..." -ForegroundColor Cyan

# Get version
$version = git describe --tags --abbrev=0 2>$null
if (-not $version) {
    $version = "v1.0.0"
}

Write-Host "Version: $version" -ForegroundColor Green

# Clean previous release
Write-Host "Cleaning previous release..." -ForegroundColor Yellow
if (Test-Path "release") {
    Get-ChildItem -Path "release" | ForEach-Object {
        if ($_.Name -ne "nul") {
            Remove-Item -Recurse -Force $_.FullName -ErrorAction SilentlyContinue
        }
    }
}

# Create release directory
Write-Host "Creating release directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "release\exiloncms" | Out-Null

# Copy application files (excluding development files)
Write-Host "Copying application files..." -ForegroundColor Yellow

# Directories to copy
$dirsToCopy = @(
    "app", "bootstrap", "config", "database", "public", "resources", "routes",
    "plugins", "themes"
)

# Files to copy
$filesToCopy = @(
    "artisan", "composer.json", "composer.lock", "package.json",
    "phpunit.xml", "vite.config.ts", "tsconfig.json", "tailwind.config.js",
    "postcss.config.js", ".env.example", "LICENSE", "README.md", "CONTRIBUTING.md"
)

# Copy directories
foreach ($dir in $dirsToCopy) {
    if (Test-Path $dir) {
        Write-Host "  Copying $dir/..."
        Copy-Item -Path $dir -Destination "release\exiloncms\$dir" -Recurse -Force
    }
}

# Copy files
foreach ($file in $filesToCopy) {
    if (Test-Path $file) {
        Write-Host "  Copying $file..."
        Copy-Item -Path $file -Destination "release\exiloncms\$file" -Force
    }
}

# Create storage directories structure
Write-Host "Creating storage directories..." -ForegroundColor Yellow
$storageDirs = @(
    "release\exiloncms\storage\framework\cache",
    "release\exiloncms\storage\framework\sessions",
    "release\exiloncms\storage\framework\views",
    "release\exiloncms\storage\logs",
    "release\exiloncms\public\storage"
)

foreach ($dir in $storageDirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

# Copy .env.example to .env
Write-Host "Creating .env file..." -ForegroundColor Yellow
Copy-Item -Path "release\exiloncms\.env.example" -Destination "release\exiloncms\.env"

# Create ZIP file
Write-Host "Creating ZIP archive..." -ForegroundColor Yellow
$zipFile = "release\exiloncms-$version.zip"

# Remove existing zip if present
if (Test-Path $zipFile) {
    Remove-Item -Force $zipFile
}

# Create ZIP using PowerShell (excluding nul file)
Get-ChildItem -Path "release\exiloncms" | ForEach-Object {
    if ($_.Name -ne "nul") {
        Compress-Archive -Path $_.FullName -DestinationPath $zipFile -Update
    }
}

Write-Host "Release built successfully!" -ForegroundColor Green
Write-Host "Package: $zipFile" -ForegroundColor Cyan

# Generate checksums
Write-Host "Generating checksums..." -ForegroundColor Yellow
$sha256 = (Get-FileHash -Path $zipFile -Algorithm SHA256).Hash
$md5 = (Get-FileHash -Path $zipFile -Algorithm MD5).Hash

$sha256 | Out-File "$zipFile.sha256"
$md5 | Out-File "$zipFile.md5"

Write-Host "SHA256: $sha256" -ForegroundColor Green
Write-Host "MD5: $md5" -ForegroundColor Green

Write-Host "`nBuild complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Commit changes to git" -ForegroundColor White
Write-Host "2. Create and push git tag: git tag $version && git push origin $version" -ForegroundColor White
Write-Host "3. GitHub Actions will create the release automatically" -ForegroundColor White
