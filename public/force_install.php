<?php

// Marquer l'installation comme terminée
$db = new PDO('sqlite:database/database.sqlite');

// Insérer le marqueur d'installation
$now = date('c');
$db->exec("INSERT OR REPLACE INTO settings (name, value, updated_at, created_at) VALUES ('installed_at', '$now', '$now', '$now')");

// Créer aussi un fichier public/installed.json comme fallback
file_put_contents('public/installed.json', json_encode(['installed' => true, 'installed_at' => $now]));

echo '✓ Installation marquée comme terminée !<br>';
echo "✓ Va maintenant sur <a href='https://urahost.fr/'>https://urahost.fr/</a>";
