<?php

namespace ExilonCMS\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $plugin_id
 * @property string $name
 * @property string $version
 * @property string $type
 * @property bool $is_enabled
 * @property string|null $source
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class PluginInstalled extends Model
{
    const TYPE_PLUGIN = 'plugin';
    const TYPE_THEME = 'theme';

    const SOURCE_MARKETPLACE = 'marketplace';
    const SOURCE_UPLOAD = 'upload';
    const SOURCE_LOCAL = 'local';

    protected $fillable = [
        'plugin_id',
        'name',
        'version',
        'type',
        'is_enabled',
        'source',
        'metadata',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
        'metadata' => 'array',
    ];

    public function scopePlugins($query)
    {
        return $query->where('type', self::TYPE_PLUGIN);
    }

    public function scopeThemes($query)
    {
        return $query->where('type', self::TYPE_THEME);
    }

    public function scopeEnabled($query)
    {
        return $query->where('is_enabled', true);
    }

    public function scopeDisabled($query)
    {
        return $query->where('is_enabled', false);
    }

    public function getPluginPath(): string
    {
        return base_path("plugins/{$this->plugin_id}");
    }

    public function getThemePath(): string
    {
        return resource_path("views/themes/{$this->plugin_id}");
    }

    public function enable(): void
    {
        $this->update(['is_enabled' => true);
        $this->registerPlugin();
    }

    public function disable(): void
    {
        $this->update(['is_enabled' => false]);
    }

    protected function registerPlugin(): void
    {
        $pluginPath = $this->getPluginPath();

        if (!is_dir($pluginPath)) {
            return;
        }

        // Check for plugin.json
        $pluginJson = $pluginPath . '/plugin.json';
        if (file_exists($pluginJson)) {
            $config = json_decode(file_get_contents($pluginJson), true);
            if (isset($config['service_provider'])) {
                // Register service provider if not already registered
                if (!app()->getProviders($config['service_provider'])) {
                    app()->register($config['service_provider']);
                }
            }
        }
    }

    public function isInstalled(): bool
    {
        if ($this->type === self::TYPE_PLUGIN) {
            return is_dir($this->getPluginPath());
        }
        return is_dir($this->getThemePath());
    }

    public function hasUpdate(): bool
    {
        // Check against marketplace for updates
        return false; // TODO: Implement marketplace check
    }
}
