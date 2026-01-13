<?php
$z = new ZipArchive();
$z->open('exiloncms-installer.zip');
echo "Installer ZIP contents:\n";
for ($i = 0; $i < $z->numFiles; $i++) {
    echo "  " . $z->getNameIndex($i) . "\n";
}
