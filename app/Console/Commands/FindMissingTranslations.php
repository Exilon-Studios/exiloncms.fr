<?php

namespace ExilonCMS\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class FindMissingTranslations extends Command
{
    protected $signature = 'translations:missing {--add : Automatically add missing keys to translation files}';

    protected $description = 'Find translation keys used in code but missing from translation files';

    private array $langFiles = [];

    private array $missingKeys = [];

    public function handle()
    {
        $this->info('=== Finding Missing Translation Keys ===');
        $this->newLine();

        $langPath = resource_path('lang/fr');
        $pluginLangPath = base_path('plugins/shop/resources/lang/fr');

        // Load all existing translations
        $this->loadTranslationFiles($langPath);
        $this->loadTranslationFiles($pluginLangPath, true);

        // Find all translation keys used in code
        $usedKeys = $this->findUsedTranslationKeys();

        $this->info('Found '.count($usedKeys).' translation keys in code');
        $this->info('Loaded '.count(array_keys($this->langFiles)).' translation files');
        $this->newLine();

        // Find missing keys
        foreach ($usedKeys as $key) {
            if (! $this->keyExists($key)) {
                $this->missingKeys[] = $key;
            }
        }

        $this->warn('Found '.count($this->missingKeys).' missing translation keys!');

        if (count($this->missingKeys) > 0) {
            $this->newLine();
            $this->info('=== Missing Translation Keys ===');

            // Group by file
            $groups = $this->groupKeysByFile($this->missingKeys);

            foreach ($groups as $file => $keys) {
                $this->newLine();
                $this->info("File: $file (".count($keys).' keys)');
                foreach ($keys as $key) {
                    $this->line("  - $key");
                }
            }

            if ($this->option('add')) {
                $this->newLine();
                if ($this->confirm('Add missing keys to translation files?')) {
                    $this->addMissingKeys($groups);
                    $this->info('Missing keys added successfully!');
                }
            } else {
                $this->newLine();
                $this->info('Run with --add to automatically add these keys.');
            }
        }

        return count($this->missingKeys) === 0 ? Command::SUCCESS : Command::FAILURE;
    }

    private function loadTranslationFiles(string $path, bool $isPlugin = false)
    {
        if (! is_dir($path)) {
            return;
        }

        $files = File::glob($path.'/*.php');
        foreach ($files as $file) {
            $fileName = basename($file, '.php');
            $translations = include $file;

            if ($isPlugin) {
                $fileName = 'shop::'.$fileName;
            }

            $this->langFiles[$fileName] = $translations;
        }
    }

    private function keyExists(string $key): bool
    {
        $parts = explode('.', $key);
        $file = $parts[0];

        // Check if file exists
        if (! isset($this->langFiles[$file])) {
            // Try with shop:: prefix
            if (! isset($this->langFiles['shop::'.$file])) {
                return false;
            }
            $file = 'shop::'.$file;
        }

        // Navigate through nested array
        $current = $this->langFiles[$file];
        for ($i = 1; $i < count($parts); $i++) {
            if (! is_array($current) || ! isset($current[$parts[$i]])) {
                return false;
            }
            $current = $current[$parts[$i]];
        }

        return true;
    }

    private function findUsedTranslationKeys(): array
    {
        $keys = [];
        $patterns = [
            "/trans\s*\(\s*['\"]([^'\"]+)['\"]\s*\)/",
            "/__\s*\(\s*['\"]([^'\"]+)['\"]\s*\)/",
            "/@lang\s*\(\s*['\"]([^'\"]+)['\"]\s*\)/",
        ];

        $files = array_merge(
            File::glob(app_path('**/*.php')),
            File::glob(resource_path('views/**/*.blade.php')),
            File::glob(resource_path('js/**/*.tsx')),
            File::glob(resource_path('js/**/*.ts')),
            File::glob(base_path('plugins/**/*.php')),
        );

        foreach ($files as $file) {
            if (! file_exists($file)) {
                continue;
            }

            $content = file_get_contents($file);
            foreach ($patterns as $pattern) {
                if (preg_match_all($pattern, $content, $matches)) {
                    foreach ($matches[1] as $key) {
                        $keys[] = $key;
                    }
                }
            }
        }

        return array_unique($keys);
    }

    private function groupKeysByFile(array $keys): array
    {
        $groups = [];

        foreach ($keys as $key) {
            $parts = explode('.', $key);
            $file = $parts[0];

            if (! isset($groups[$file])) {
                $groups[$file] = [];
            }

            $groups[$file][] = $key;
        }

        return $groups;
    }

    private function addMissingKeys(array $groups)
    {
        foreach ($groups as $file => $keys) {
            $this->info("Processing $file...");

            // Determine file path
            $isPlugin = str_starts_with($file, 'shop::');
            $fileName = $isPlugin ? str_replace('shop::', '', $file) : $file;

            if ($isPlugin) {
                $filePath = base_path('plugins/shop/resources/lang/fr/'.$fileName.'.php');
            } else {
                $filePath = resource_path('lang/fr/'.$fileName.'.php');
            }

            if (! file_exists($filePath)) {
                $this->warn("  File not found: $filePath");

                continue;
            }

            $translations = include $filePath;

            // Add each missing key
            foreach ($keys as $key) {
                $parts = explode('.', $key);

                // Skip the filename part
                array_shift($parts);

                // Build nested structure
                $current = &$translations;
                $path = [];
                foreach ($parts as $part) {
                    $path[] = $part;
                    if (! isset($current[$part])) {
                        $current[$part] = '';
                        $this->line('  Added: '.implode('.', $path));
                    } elseif (! is_array($current[$part])) {
                        // Key exists but is not an array - skip
                        break;
                    }
                    if (! is_array($current[$part])) {
                        $current[$part] = [];
                    }
                    $current = &$current[$part];
                }
            }

            // Write back to file
            $this->writeTranslationFile($filePath, $translations);
        }
    }

    private function writeTranslationFile(string $path, array $translations)
    {
        $content = "<?php\n\nreturn array (\n";
        $content .= $this->arrayToCode($translations, 1);
        $content .= ");\n";

        file_put_contents($path, $content);
    }

    private function arrayToCode(array $array, int $indent): string
    {
        $output = '';
        $padding = str_repeat(' ', $indent * 6);

        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $output .= $padding."'".$key."' => array (\n";
                $output .= $this->arrayToCode($value, $indent + 1);
                $output .= $padding."),\n";
            } else {
                $output .= $padding."'".$key."' => '".addslashes($value ?? '')."',\n";
            }
        }

        return $output;
    }
}
