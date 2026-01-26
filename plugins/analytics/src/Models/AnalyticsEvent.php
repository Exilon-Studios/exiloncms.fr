<?php

namespace ExilonCMS\Plugins\Analytics\Models;

use ExilonCMS\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int|null $user_id
 * @property string $session_id
 * @property string $event_type
 * @property string $page_url
 * @property string|null $referrer
 * @property string $user_agent
 * @property string $ip_address
 * @property \Illuminate\Support\Collection $properties
 * @property \Carbon\Carbon $created_at
 */
class AnalyticsEvent extends Model
{
    const TYPE_PAGE_VIEW = 'page_view';
    const TYPE_CLICK = 'click';
    const TYPE_FORM_SUBMIT = 'form_submit';
    const TYPE_DOWNLOAD = 'download';
    const TYPE_CUSTOM = 'custom';

    protected $fillable = [
        'user_id',
        'session_id',
        'event_type',
        'page_url',
        'referrer',
        'user_agent',
        'ip_address',
        'properties',
    ];

    protected $casts = [
        'properties' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('event_type', $type);
    }

    public function scopeBySession($query, string $sessionId)
    {
        return $query->where('session_id', $sessionId);
    }

    public function scopeForPeriod($query, string $period)
    {
        return $query->where('created_at', '>=', match ($period) {
            'today' => now()->startOfDay(),
            'week' => now()->subWeek(),
            'month' => now()->subMonth(),
            'year' => now()->subYear(),
            default => now()->subDays(30),
        });
    }
}
