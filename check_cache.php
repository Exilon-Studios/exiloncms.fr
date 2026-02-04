<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

use ExilonCMS\Models\Setting;
use Illuminate\Support\Facades\Cache;

echo 'Cache driver: '.Cache::getStore()->getPrefix()."\n";
echo 'Settings cache exists: '.(Cache::has('settings') ? 'yes' : 'no')."\n";
if (Cache::has('settings')) {
    echo 'Settings cache value: ';
    var_export(Cache::get('settings'));
    echo "\n";
}

// Check what ExtensionServiceProvider loads
echo "\nWhat ExtensionServiceProvider loads:\n";
$settings = Setting::all()->mapWithKeys(fn ($setting) => [
    $setting->name => $setting->getAttribute('value'),
])->all();
echo 'Result: ';
var_export($settings);
echo "\n";
echo 'enabled_plugins value: ';
var_export($settings['enabled_plugins']);
echo "\n";
echo 'enabled_plugins type: '.gettype($settings['enabled_plugins'])."\n";
