<?php

$installerDir = __DIR__.'/installer';
$zipFile = __DIR__.'/exiloncms-installer.zip';

if (file_exists($zipFile)) {
    unlink($zipFile);
}

$zip = new ZipArchive();

if ($zip->open($zipFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
    die("Failed to create zip file");
}

$files = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($installerDir, RecursiveDirectoryIterator::SKIP_DOTS),
    RecursiveIteratorIterator::SELF_FIRST
);

foreach ($files as $file) {
    $filePath = $file->getPathname();
    $relativePath = substr($filePath, strlen($installerDir) + 1);
    $relativePath = str_replace('\\', '/', $relativePath);

    if ($file->isDir()) {
        $zip->addEmptyDir($relativePath);
    } else {
        $zip->addFile($filePath, $relativePath);
    }
}

$zip->close();

echo "Installer zip created: {$zipFile}\n";
echo "Size: ".round(filesize($zipFile) / 1024, 2)." KB\n";
