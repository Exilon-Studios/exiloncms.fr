<?php

namespace ExilonCMS\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DebugController extends Controller
{
    public function installStatus()
    {
        $status = [
            'timestamp' => now()->toIso8601String(),
            'checks' => [],
        ];

        // Check 1: Database connection
        try {
            DB::connection()->getPdo();
            $status['checks'][] = ['name' => 'Database Connection', 'status' => 'OK', 'details' => 'Connected'];
        } catch (\Exception $e) {
            $status['checks'][] = ['name' => 'Database Connection', 'status' => 'FAIL', 'error' => $e->getMessage()];
            return response()->json($status);
        }

        // Check 2: Settings table exists
        if (Schema::hasTable('settings')) {
            $status['checks'][] = ['name' => 'Settings Table', 'status' => 'OK', 'details' => 'Table exists'];
        } else {
            $status['checks'][] = ['name' => 'Settings Table', 'status' => 'FAIL', 'details' => 'Table missing'];
            return response()->json($status);
        }

        // Check 3: installed_at setting
        $installedAt = DB::table('settings')->where('key', 'installed_at')->first();
        if ($installedAt) {
            $status['checks'][] = ['name' => 'installed_at DB', 'status' => 'OK', 'value' => $installedAt->value];
        } else {
            $status['checks'][] = ['name' => 'installed_at DB', 'status' => 'MISSING', 'details' => 'Key not found in DB'];
        }

        // Check 4: installed_version setting
        $installedVersion = DB::table('settings')->where('key', 'installed_version')->first();
        if ($installedVersion) {
            $status['checks'][] = ['name' => 'installed_version DB', 'status' => 'OK', 'value' => $installedVersion->value];
        } else {
            $status['checks'][] = ['name' => 'installed_version DB', 'status' => 'MISSING', 'details' => 'Key not found in DB'];
        }

        // Check 5: File markers
        $files = [
            'storage/installed.json' => storage_path('installed.json'),
            'bootstrap/cache/installed' => base_path('bootstrap/cache/installed'),
            'public/installed.json' => public_path('installed.json'),
        ];

        foreach ($files as $name => $path) {
            if (file_exists($path)) {
                $status['checks'][] = ['name' => $name, 'status' => 'EXISTS', 'path' => $path];
            } else {
                $status['checks'][] = ['name' => $name, 'status' => 'MISSING', 'path' => $path];
            }
        }

        // Check 6: is_installed() function result
        $status['checks'][] = ['name' => 'is_installed() result', 'value' => is_installed() ? 'TRUE' : 'FALSE'];

        // Check 7: APP_KEY
        $status['checks'][] = ['name' => 'APP_KEY', 'value' => config('app.key')];

        // Check 8: All settings in DB
        $allSettings = DB::table('settings')->pluck('value', 'key')->toArray();
        $status['all_settings'] = $allSettings;

        return response()->json($status);
    }

    public function forceInstall()
    {
        // Force mark as installed directly
        try {
            DB::table('settings')->updateOrInsert(
                ['key' => 'installed_at'],
                ['value' => now()->toIso8601String(), 'updated_at' => now()]
            );

            // Also create file markers
            $content = json_encode(['installed' => true, 'installed_at' => now()->toIso8601String()]);
            file_put_contents(base_path('bootstrap/cache/installed'), $content);
            file_put_contents(public_path('installed.json'), $content);

            return response()->json(['success' => true, 'message' => 'Installation forced!']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}
