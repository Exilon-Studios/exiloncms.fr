<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use ExilonCMS\Models\Role;

$adminRole = Role::where('name', 'admin')->first();

echo "Current admin role:" . PHP_EOL;
echo "ID: " . $adminRole->id . PHP_EOL;
echo "Name: " . $adminRole->name . PHP_EOL;
echo "is_admin: " . ($adminRole->is_admin ? 'true' : 'false') . PHP_EOL;

echo PHP_EOL . "Fixing..." . PHP_EOL;
$adminRole->is_admin = true;
$adminRole->save();

echo PHP_EOL . "After fix:" . PHP_EOL;
$adminRole->refresh();
echo "is_admin: " . ($adminRole->is_admin ? 'true' : 'false') . PHP_EOL;
