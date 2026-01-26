<?php

namespace ShopPlugin\Models;

use ExilonCMS\Models\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Gateway represents a payment gateway configuration.
 * Each gateway can have custom configuration (API keys, etc.).
 */
class Gateway extends Model
{
    protected $fillable = [
        'type',
        'name',
        'is_active',
        'config',
        'test_mode',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'test_mode' => 'boolean',
        'config' => 'array',
    ];

    /**
     * Get the payments for this gateway.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'gateway_id');
    }

    /**
     * Get a config value.
     */
    public function getConfig(string $key, mixed $default = null): mixed
    {
        return $this->config[$key] ?? $default;
    }

    /**
     * Set a config value.
     */
    public function setConfig(string $key, mixed $value): void
    {
        $config = $this->config ?? [];
        $config[$key] = $value;
        $this->config = $config;
    }

    /**
     * Scope to get only active gateways.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get gateways by type.
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }
}
