<?php

namespace ExilonCMS\Plugins\Translations\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $locale
 * @property string $group
 * @property string $key
 * @property string $value
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class TranslationEntry extends Model
{
    protected $fillable = [
        'locale',
        'group',
        'key',
        'value',
    ];

    /**
     * Scope to get translations by locale.
     */
    public function scopeForLocale($query, string $locale)
    {
        return $query->where('locale', $locale);
    }

    /**
     * Scope to get translations by group.
     */
    public function scopeForGroup($query, string $group)
    {
        return $query->where('group', $group);
    }

    /**
     * Scope to search by key.
     */
    public function scopeSearch($query, string $search)
    {
        return $query->where('key', 'like', "%{$search}%")
            ->orWhere('value', 'like', "%{$search}%");
    }

    /**
     * Get the full translation key (group.key).
     */
    public function getFullKeyAttribute(): string
    {
        return $this->group ? "{$this->group}.{$this->key}" : $this->key;
    }

    /**
     * Check if translation is missing (empty value).
     */
    public function isMissing(): bool
    {
        return empty($this->value);
    }

    /**
     * Sync translation to language file.
     */
    public function syncToFile(): bool
    {
        $path = $this->getLanguageFilePath();
        $dir = dirname($path);

        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $translations = $this->where('locale', $this->locale)
            ->where('group', $this->group)
            ->pluck('value', 'key')
            ->toArray();

        $content = "<?php\n\nreturn ".var_export($translations, true).";\n";

        return file_put_contents($path, $content) !== false;
    }

    /**
     * Get the language file path.
     */
    protected function getLanguageFilePath(): string
    {
        return resource_path("lang/{$this->locale}/{$this->group}.php");
    }
}
