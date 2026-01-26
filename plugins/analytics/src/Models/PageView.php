<?php

namespace ExilonCMS\Plugins\Analytics\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $page_url
 * @property string $page_title
 * @property int $views
 * @property int $unique_visitors
 * @property \Carbon\Carbon $date
 */
class PageView extends Model
{
    protected $fillable = [
        'page_url',
        'page_title',
        'views',
        'unique_visitors',
        'date',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function scopeForPeriod($query, string $period)
    {
        return $query->where('date', '>=', match ($period) {
            'today' => now()->toDateString(),
            'week' => now()->subWeek()->toDateString(),
            'month' => now()->subMonth()->toDateString(),
            'year' => now()->subYear()->toDateString(),
            default => now()->subDays(30)->toDateString(),
        });
    }

    public static function recordPageView(string $url, string $title): void
    {
        $today = now()->toDateString();

        self::updateOrCreate(
            [
                'page_url' => $url,
                'date' => $today,
            ],
            [
                'page_title' => $title,
            ]
        )->increment('views');
    }

    public static function recordUniqueVisitor(string $url): void
    {
        $today = now()->toDateString();

        self::where('page_url', $url)
            ->where('date', $today)
            ->increment('unique_visitors');
    }
}
