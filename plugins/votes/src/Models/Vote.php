<?php

namespace ExilonCMS\Plugins\Votes\Models;

use ExilonCMS\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $user_id
 * @property int $vote_site_id
 * @property string $ip_address
 * @property string $user_agent
 * @property bool $is_verified
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Vote extends Model
{
    protected $fillable = [
        'user_id',
        'vote_site_id',
        'ip_address',
        'user_agent',
        'is_verified',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function voteSite()
    {
        return $this->belongsTo(VoteSite::class);
    }

    public function rewards()
    {
        return $this->belongsToMany(VoteReward::class, 'user_vote_rewards')
            ->withPivot('received_at')
            ->withTimestamps();
    }

    public function scopeBySite($query, int $siteId)
    {
        return $query->where('vote_site_id', $siteId);
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopePending($query)
    {
        return $query->where('is_verified', false);
    }

    public function canVoteAgain(int $cooldownHours = null): bool
    {
        $cooldownHours = $cooldownHours ?? config('votes.cooldown', 24);

        $lastVote = static::where('user_id', $this->user_id)
            ->where('vote_site_id', $this->vote_site_id)
            ->where('is_verified', true)
            ->latest()
            ->first();

        if (!$lastVote) {
            return true;
        }

        return $lastVote->created_at->lt(now()->subHours($cooldownHours));
    }
}
