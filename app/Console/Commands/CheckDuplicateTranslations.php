<?php

namespace ExilonCMS\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class CheckDuplicateTranslations extends Command
{
    protected $signature = 'translations:duplicates {--values : Check for duplicate values too}';
    protected $description = 'Check for duplicate translation keys and values';

    public function handle()
    {
        $this->info('=== Checking for Duplicate Translations ===');
        $this->newLine();

        $langPath = resource_path('lang/fr');
        $pluginLangPath = base_path('plugins/shop/resources/lang/fr');

        $paths = [$langPath, $pluginLangPath];
        $issues = [];

        foreach ($paths as $path) {
            if (!is_dir($path)) continue;

            $files = File::glob($path . '/*.php');
            foreach ($files as $file) {
                $translations = include $file;
                $fileName = basename($file, '.php');

                // Check for duplicate keys within the file
                $duplicates = $this->findDuplicateKeys($translations);
                if (count($duplicates) > 0) {
                    $issues["{$fileName} (duplicate keys)"] = $duplicates;
                }

                // Check for duplicate values if requested
                if ($this->option('values')) {
                    $duplicateValues = $this->findDuplicateValues($translations);
                    if (count($duplicateValues) > 0) {
                        $issues["{$fileName} (duplicate values)"] = $duplicateValues;
                    }
                }
            }
        }

        if (count($issues) === 0) {
            $this->info('✓ No duplicate translation keys found!');
            if ($this->option('values')) {
                $this->info('✓ No duplicate translation values found!');
            }
        } else {
            $this->warn('Found ' . count($issues) . ' issue(s):');
            $this->newLine();

            foreach ($issues as $file => $problems) {
                $this->error("{$file}:");
                foreach ($problems as $problem) {
                    $this->line("  - {$problem}");
                }
                $this->newLine();
            }
        }

        return count($issues) === 0 ? Command::SUCCESS : Command::FAILURE;
    }

    private function findDuplicateKeys(array $array, string $prefix = ''): array
    {
        $duplicates = [];
        $keys = [];

        $this->traverseArray($array, '', function($key, $value, $path) use (&$keys, &$duplicates) {
            if (isset($keys[$path])) {
                $duplicates[] = "Duplicate key: {$path}";
            } else {
                $keys[$path] = true;
            }
        });

        return $duplicates;
    }

    private function findDuplicateValues(array $array): array
    {
        $duplicates = [];
        $valueMap = [];

        $this->traverseArray($array, '', function($key, $value, $path) use (&$valueMap, &$duplicates) {
            if (!is_string($value)) return;

            $normalizedValue = trim(strtolower($value));
            if (strlen($normalizedValue) < 3) return; // Skip very short strings

            if (isset($valueMap[$normalizedValue])) {
                $existing = $valueMap[$normalizedValue];
                if (!isset($duplicates[$normalizedValue])) {
                    $duplicates[$normalizedValue] = [];
                }
                $duplicates[$normalizedValue][] = $existing;
                $duplicates[$normalizedValue][] = $path;
            } else {
                $valueMap[$normalizedValue] = $path;
            }
        });

        // Format output
        $result = [];
        foreach ($duplicates as $value => $paths) {
            $uniquePaths = array_unique($paths);
            if (count($uniquePaths) > 1) {
                $result[] = "\"{$value}\" used in: " . implode(', ', $uniquePaths);
            }
        }

        return $result;
    }

    private function traverseArray(array $array, string $prefix, callable $callback)
    {
        foreach ($array as $key => $value) {
            $path = $prefix ? $prefix . '.' . $key : $key;

            if (is_array($value)) {
                $this->traverseArray($value, $path, $callback);
            } else {
                $callback($key, $value, $path);
            }
        }
    }
}
