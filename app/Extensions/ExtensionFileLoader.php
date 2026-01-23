<?php

namespace ExilonCMS\Extensions;

use Illuminate\Filesystem\Filesystem;
use Illuminate\Translation\FileLoader as LaravelFileLoader;

/**
 * Extended FileLoader for plugins and themes translations
 */
class ExtensionFileLoader extends LaravelFileLoader
{
    /**
     * Create a new file loader instance.
     */
    public function __construct(Filesystem $files, string $path)
    {
        parent::__construct($files, $path);

        // Add plugin and theme translation paths
        $this->addExtensionPaths();
    }

    /**
     * Add translation paths for extensions (plugins and themes).
     */
    protected function addExtensionPaths(): void
    {
        $hints = $this->hints;

        // Add plugins translations
        $pluginsPath = base_path('plugins');
        if (is_dir($pluginsPath)) {
            $plugins = glob($pluginsPath . '/*', GLOB_ONLYDIR);
            foreach ($plugins as $pluginPath) {
                $pluginName = basename($pluginPath);
                $langPath = $pluginPath . '/resources/lang';

                if (is_dir($langPath)) {
                    $namespace = strtolower($pluginName);
                    if (!isset($hints[$namespace])) {
                        $hints[$namespace] = [];
                    }
                    $hints[$namespace][] = $langPath;
                }
            }
        }

        // Add themes translations
        $themesPath = base_path('themes');
        if (is_dir($themesPath)) {
            $themes = glob($themesPath . '/*', GLOB_ONLYDIR);
            foreach ($themes as $themePath) {
                $themeName = basename($themePath);
                $langPath = $themePath . '/resources/lang';

                if (is_dir($langPath)) {
                    $namespace = strtolower($themeName);
                    if (!isset($hints[$namespace])) {
                        $hints[$namespace] = [];
                    }
                    $hints[$namespace][] = $langPath;
                }
            }
        }

        // Update hints
        $this->hints = $hints;
    }

    /**
     * Load a locale from a given path.
     *
     * @param  string  $path
     * @param  string  $locale
     * @param  string  $group
     * @return array
     */
    protected function loadPath(string $path, string $locale, string $group): array
    {
        return $this->loadNamespaces([$path], $locale, $group);
    }
}
