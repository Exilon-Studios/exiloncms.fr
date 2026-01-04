<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use ExilonCMS\Models\Role;

// Create admin role
$adminRole = Role::firstOrCreate(
    ['name' => 'admin'],
    [
        'color' => '#E87743',
        'is_admin' => true,
        'power' => 100,
    ]
);

echo "✅ Rôle admin créé (ID: {$adminRole->id})\n";

// Create user role
$userRole = Role::firstOrCreate(
    ['name' => 'user'],
    [
        'color' => '#517C79',
        'is_admin' => false,
        'power' => 1,
    ]
);

echo "✅ Rôle user créé (ID: {$userRole->id})\n";

echo "\n🎉 Rôles créés avec succès !\n";
echo "Vous pouvez maintenant créer un utilisateur avec: php artisan user:create --admin\n";
