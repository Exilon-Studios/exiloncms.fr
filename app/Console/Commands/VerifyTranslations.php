<?php

namespace ExilonCMS\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class VerifyTranslations extends Command
{
    protected $signature = 'translations:verify {--detailed : Show detailed usage information}';
    protected $description = 'Comprehensive verification of translation usage with detailed reporting';

    public function handle()
    {
        $this->info('=== Translation Usage Verification ===');
        $this->info('Scanning all files for translation usage patterns...');
        $this->newLine();

        $langPath = resource_path('lang/fr');
        $pluginLangPath = base_path('plugins/shop/resources/lang/fr');

        // Get all defined translation keys
        $allKeys = $this->getAllTranslationKeys([$langPath, $pluginLangPath]);

        // Namespaces that are loaded entirely in HandleInertiaRequests
        // ALL keys under these namespaces are accessible via props.trans.namespace.xxx in React
        $sharedNamespaces = ['auth', 'messages', 'admin', 'pages', 'puck', 'dashboard'];

        // Plugin namespaces (plugin filename without :: prefix, since keys are just filename.xxx)
        // These are loaded in HandleInertiaRequests as 'shop::nav' => trans('shop::nav')
        // So keys from nav.php and widget.php are accessible via props.trans['shop::nav'].xxx
        $sharedPluginFiles = ['nav', 'widget', 'shop'];  // shop.php is loaded as 'shop' => trans('shop')

        // Get keys that are shared via HandleInertiaRequests (automatically used)
        $sharedKeys = array_filter($allKeys, function($key) use ($sharedNamespaces, $sharedPluginFiles) {
            $parts = explode('.', $key);

            // Check regular namespaces (admin, auth, etc.)
            if (in_array($parts[0], $sharedNamespaces)) {
                return true;
            }

            // Check plugin file names (nav, widget, shop from shop plugin)
            if (in_array($parts[0], $sharedPluginFiles)) {
                return true;
            }

            return false;
        });

        // Find all direct usages with file locations
        $usageMap = $this->findTranslationUsageWithLocations();

        // Add shared keys as "used"
        foreach ($sharedKeys as $key) {
            $usageMap[$key][] = 'HandleInertiaRequests (shared globally)';
        }

        $this->info("Total translation keys defined: " . count($allKeys));
        $this->info("Keys shared via HandleInertiaRequests: " . count($sharedKeys));
        $this->info("Keys with verified usage: " . count($usageMap));
        $this->newLine();

        // Find unused keys
        $unusedKeys = array_diff($allKeys, array_keys($usageMap));

        $this->warn("Keys without verified usage: " . count($unusedKeys));
        $this->newLine();

        if ($this->option('detailed') && count($unusedKeys) > 0) {
            $this->info('=== Detailed Analysis of Potentially Unused Keys ===');
            $this->newLine();

            // Group by file
            $groups = $this->groupKeysByFile($unusedKeys);

            foreach ($groups as $file => $keys) {
                $this->info("File: $file (" . count($keys) . " keys)");
                foreach ($keys as $key) {
                    $this->line("  - $key");
                }
                $this->newLine();
            }
        }

        // Summary
        $this->info('=== Summary ===');
        $this->line("Total keys: " . count($allKeys));
        $this->line("Shared via HandleInertiaRequests (including plugins): " . count($sharedKeys));
        $this->line("Direct usage in code: " . (count($usageMap) - count($sharedKeys)));
        $this->line("Total verified in use: " . count($usageMap));
        $this->line("Potentially unused: " . count($unusedKeys));
        $this->newLine();

        if (count($unusedKeys) > 0) {
            $this->warn('These keys are not used directly in code or shared globally.');
            $this->warn('However, they might be used dynamically. Verify before removing.');
        } else {
            $this->info('All translation keys are accounted for!');
        }

        return Command::SUCCESS;
    }

    private function findTranslationUsageWithLocations(): array
    {
        $usageMap = [];

        // Comprehensive regex patterns for ALL translation usage
        $patterns = [
            // Laravel trans() function
            'trans_fn' => "/trans\s*\(\s*['\"]([^'\"]+)['\"]\s*\)/",
            'trans_double' => "/trans\s*\(\s*\\\"([^\\\"]+)\\\"\s*\)/",

            // Laravel @lang directive
            'lang_directive' => "/@lang\s*\(\s*['\"]([^'\"]+)['\"]\s*\)/",

            // Laravel __() function
            'underscore_fn' => "/__\s*\(\s*['\"]([^'\"]+)['\"]\s*\)/",

            // React/JS access via props (trans.admin.xxx)
            'prop_access' => "/trans\.([a-z_][a-z0-9_]*(?:\.[a-z_][a-z0-9_]*)*)/i",

            // Dynamic access (trans('admin.' . $var))
            'dynamic_access' => "/trans\s*\(\s*['\"]([^'\"]+\.)\s*\\\$/",
        ];

        $files = $this->getAllSearchableFiles();

        $this->line("Scanning " . count($files) . " files...");

        foreach ($files as $file) {
            if (!file_exists($file)) continue;

            $content = file_get_contents($file);

            foreach ($patterns as $patternName => $pattern) {
                if (preg_match_all($pattern, $content, $matches, PREG_OFFSET_CAPTURE)) {
                    foreach ($matches[1] as $match) {
                        $key = $match[0];

                        // Normalize the key
                        $normalizedKey = $this->normalizeKey($key);

                        if (!isset($usageMap[$normalizedKey])) {
                            $usageMap[$normalizedKey] = [];
                        }

                        $relativePath = str_replace(base_path() . '/', '', $file);
                        if (!in_array($relativePath, $usageMap[$normalizedKey])) {
                            $usageMap[$normalizedKey][] = $relativePath;
                        }
                    }
                }
            }
        }

        return $usageMap;
    }

    private function normalizeKey(string $key): string
    {
        // Remove dynamic parameters
        $key = preg_replace('/\{[^}]+\}/', '*', $key);
        // Remove :attribute placeholders
        $key = preg_replace('/:[a-z_]+/i', '*', $key);
        return $key;
    }

    private function getAllSearchableFiles(): array
    {
        $files = [];

        // PHP files
        $files = array_merge($files, File::glob(app_path('**/*.php')));
        $files = array_merge($files, File::glob(resource_path('views/**/*.blade.php')));
        $files = array_merge($files, File::glob(base_path('plugins/**/*.php')));

        // JavaScript/TypeScript files
        $files = array_merge($files, File::glob(resource_path('js/**/*.tsx')));
        $files = array_merge($files, File::glob(resource_path('js/**/*.ts')));
        $files = array_merge($files, File::glob(resource_path('js/**/*.jsx')));
        $files = array_merge($files, File::glob(resource_path('js/**/*.js')));

        return array_unique($files);
    }

    private function getAllTranslationKeys(array $paths): array
    {
        $keys = [];

        foreach ($paths as $path) {
            if (!is_dir($path)) continue;

            $files = File::glob($path . '/*.php');
            foreach ($files as $file) {
                $translations = include $file;
                $flatKeys = $this->flattenArray($translations, basename($file, '.php'));
                $keys = array_merge($keys, $flatKeys);
            }
        }

        return array_unique($keys);
    }

    private function flattenArray(array $array, string $prefix = ''): array
    {
        $result = [];

        foreach ($array as $key => $value) {
            $newKey = $prefix ? $prefix . '.' . $key : $key;

            if (is_array($value)) {
                $result = array_merge($result, $this->flattenArray($value, $newKey));
            } else {
                $result[] = $newKey;
            }
        }

        return $result;
    }

    private function groupKeysByFile(array $keys): array
    {
        $groups = [];

        foreach ($keys as $key) {
            $parts = explode('.', $key);
            $file = $parts[0];

            if (!isset($groups[$file])) {
                $groups[$file] = [];
            }

            $groups[$file][] = $key;
        }

        return $groups;
    }
}
