<?php

namespace ExilonCMS\View;

use Illuminate\View\FileViewFinder;
use InvalidArgumentException;

class ThemeViewFinder extends FileViewFinder
{
    protected function findNamespacedView($name): string
    {
        [$namespace, $view] = $this->parseNamespaceSegments($name);

        // Note: Plugins system has been removed
        // If you need to restore plugin support, add the PluginManager back

        try {
            // Try to find the view in the theme.
            return $this->findInPaths("vendor.{$namespace}.{$view}", $this->paths);
        } catch (InvalidArgumentException) {
            // Nothing found, fallback to the default view
            return $this->findInPaths($view, $this->hints[$namespace]);
        }
    }
}
