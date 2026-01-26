<?php

namespace ExilonCMS\Models;

use Illuminate\Database\Eloquent\Model;

class LandingSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
        'order',
    ];

    /**
     * Get the value attribute and automatically decode JSON
     */
    public function getValueAttribute($value)
    {
        $type = $this->attributes['type'] ?? 'text';

        if ($type === 'json') {
            return json_decode($value, true);
        }

        if ($type === 'boolean') {
            return filter_var($value, FILTER_VALIDATE_BOOLEAN);
        }

        return $value;
    }

    /**
     * Set the value attribute and automatically encode JSON
     */
    public function setValueAttribute($value)
    {
        $type = $this->attributes['type'] ?? 'text';

        if ($type === 'json') {
            $this->attributes['value'] = is_string($value) ? $value : json_encode($value);
        } else {
            $this->attributes['value'] = $value;
        }
    }

    /**
     * Get all settings grouped by group
     */
    public static function getAllGrouped(): array
    {
        $settings = self::orderBy('group')->orderBy('order')->get();

        $grouped = [];
        foreach ($settings as $setting) {
            $keys = explode('.', $setting->key);
            $current = &$grouped;

            $lastKey = array_pop($keys);

            foreach ($keys as $key) {
                if (! isset($current[$key]) || ! is_array($current[$key])) {
                    $current[$key] = [];
                }
                $current = &$current[$key];
            }

            $current[$lastKey] = $setting->value;
        }

        return $grouped;
    }

    /**
     * Get a single setting by key
     */
    public static function get(string $key, $default = null)
    {
        $setting = self::where('key', $key)->first();

        return $setting ? $setting->value : $default;
    }

    /**
     * Set a single setting by key
     */
    public static function set(string $key, $value, string $type = 'text', string $group = 'general'): void
    {
        self::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'type' => $type,
                'group' => $group,
            ]
        );
    }
}
