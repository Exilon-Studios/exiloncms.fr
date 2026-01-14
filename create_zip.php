<?php
$zip = new ZipArchive();
$zip->open('exiloncms-installer.zip', ZipArchive::CREATE | ZipArchive::OVERWRITE);

// Files to add: source => destination in zip
$files = [
    'installer/index.php' => 'index.php',
    'installer/public/index.php' => 'public/index.php',
    'installer/public/.htaccess' => 'public/.htaccess',
    'installer/.htaccess' => '.htaccess',
];

foreach ($files as $source => $dest) {
    if (file_exists($source)) {
        $zip->addFile($source, $dest);
    }
}

$zip->close();
echo "OK\n";
