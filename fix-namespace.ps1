$ErrorActionPreference = "Stop"

$baseDir = "C:\Users\uranium\Documents\Projets\Minecraft\Outland\outland-cms-v2\app"
$oldNamespace = "namespace MCCMS\"
$newNamespace = "namespace ExilonCMS\"

Write-Host "Replacing namespace in all PHP files..." -ForegroundColor Cyan

Get-ChildItem -Path $baseDir -Filter "*.php" -Recurse | ForEach-Object {
    $filePath = $_.FullName
    $content = Get-Content $filePath -Raw -Encoding UTF8

    if ($content -match [regex]::Escape($oldNamespace)) {
        $newContent = $content -replace [regex]::Escape($oldNamespace), $newNamespace
        Set-Content $filePath -Value $newContent -NoNewline -Encoding UTF8
        Write-Host "Updated: $filePath" -ForegroundColor Green
    }
}

Write-Host "Done!" -ForegroundColor Green
