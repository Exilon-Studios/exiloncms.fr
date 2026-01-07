<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use ExilonCMS\Models\User;
use ExilonCMS\Models\Role;

$user = User::where('email', 'admin@example.com')->first();
$adminRole = Role::where('name', 'admin')->first();

echo "=== USER INFO ===" . PHP_EOL;
echo "User ID: " . $user->id . PHP_EOL;
echo "User Email: " . $user->email . PHP_EOL;
echo "User role_id: " . $user->role_id . PHP_EOL;

echo PHP_EOL . "=== ROLE INFO ===" . PHP_EOL;
echo "Admin role ID: " . $adminRole->id . PHP_EOL;
echo "Admin role name: " . $adminRole->name . PHP_EOL;

echo PHP_EOL . "=== FIXING ===" . PHP_EOL;
// Update user to have the correct admin role
$user->role_id = $adminRole->id;
$user->save();
echo "User role_id updated to: " . $user->role_id . PHP_EOL;

// Reload to verify
$user->refresh();
echo PHP_EOL . "=== VERIFICATION ===" . PHP_EOL;
echo "User role_id after fix: " . $user->role_id . PHP_EOL;
echo "User role name: " . $user->role->name . PHP_EOL;
echo "Is admin: " . ($user->role->name === 'admin' ? 'YES' : 'NO') . PHP_EOL;
