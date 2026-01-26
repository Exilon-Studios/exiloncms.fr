<?php

namespace ExilonCMS\Plugins\Notifications\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string $subject
 * @property string $content
 * @property string $type
 * @property bool $is_enabled
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class NotificationTemplate extends Model
{
    const TYPE_EMAIL = 'email';

    const TYPE_SMS = 'sms';

    const TYPE_PUSH = 'push';

    protected $fillable = [
        'name',
        'slug',
        'subject',
        'content',
        'type',
        'is_enabled',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
    ];

    public function scopeEnabled($query)
    {
        return $query->where('is_enabled', true);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeBySlug($query, string $slug)
    {
        return $query->where('slug', $slug);
    }

    public function render(array $data = []): string
    {
        $content = $this->content;

        foreach ($data as $key => $value) {
            $content = str_replace('{'.$key.'}', $value, $content);
            if ($this->subject) {
                $this->subject = str_replace('{'.$key.'}', $value, $this->subject);
            }
        }

        return $content;
    }
}
