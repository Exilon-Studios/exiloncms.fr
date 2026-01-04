<?php

namespace MCCMS\Providers;

use MCCMS\Extensions\Plugin\PluginManager as Plugins;
use MCCMS\Extensions\Theme\ThemeManager as Themes;
use MCCMS\Models\Setting;
use MCCMS\Support\SettingsRepository;
use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\ServiceProvider;

class ExtensionServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @throws \Illuminate\Contracts\Container\BindingResolutionException
     */
    public function register(): void
    {
        $this->app->singleton(SettingsRepository::class);

        $this->app->singleton(Plugins::class);
        $this->app->alias(Plugins::class, 'plugins');

        $this->app->singleton(Themes::class);
        $this->app->alias(Themes::class, 'themes');

        $this->app->make(Plugins::class)->loadPlugins($this->app, ! is_installed());
    }

    /**
     * Bootstrap services.
     */
    public function boot(Themes $themes): void
    {
        if (! is_installed()) {
            return;
        }

        try {
            $repository = $this->app->make(SettingsRepository::class);

            $repository->set($this->loadSettings());
        } catch (Exception) {
            //
        }

        if (($theme = setting('theme')) !== null) {
            $themes->loadTheme($theme);
        }
    }

    protected function loadSettings(): array
    {
        // Always load from database to ensure fresh data
        // Cache is handled separately when settings are updated
        return Setting::all()->pluck('value', 'name')->all();
    }
}
