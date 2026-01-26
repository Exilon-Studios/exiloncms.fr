<?php

namespace ExilonCMS\Plugins\Votes\Models;

use ExilonCMS\Models\Role;
use ExilonCMS\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property string $description
 * @property string $reward_type
 * @property string $reward_amount
 * @property int $required_votes
 * @property bool $is_active
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class VoteReward extends Model
{
    const REWARD_MONEY = 'money';

    const REWARD_ITEMS = 'items';

    const REWARD_ROLE = 'role';

    const REWARD_COMMAND = 'command';

    protected $fillable = [
        'name',
        'description',
        'reward_type',
        'reward_amount',
        'required_votes',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'required_votes' => 'integer',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_vote_rewards')
            ->withPivot('vote_id', 'received_at')
            ->withTimestamps();
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'reward_amount')->where('reward_type', self::REWARD_ROLE);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function processReward(User $user): bool
    {
        $multiplier = config('votes.reward_multiplier', 1);

        switch ($this->reward_type) {
            case self::REWARD_MONEY:
                $amount = (int) $this->reward_amount * $multiplier;
                $user->increment('money', $amount);

                return true;

            case self::REWARD_ITEMS:
                // Give items via game integration
                return $this->giveItems($user, $this->reward_amount, $multiplier);

            case self::REWARD_ROLE:
                $user->update(['role_id' => $this->reward_amount]);

                return true;

            case self::REWARD_COMMAND:
                return $this->executeServerCommand($user, $this->reward_amount);

            default:
                return false;
        }
    }

    protected function giveItems(User $user, string $items, int $multiplier): bool
    {
        // Parse item string (e.g., "diamond:64,iron:32")
        // Queue for game server delivery
        // Implementation depends on game integration
        return true;
    }

    protected function executeServerCommand(User $user, string $command): bool
    {
        // Replace placeholders
        $command = str_replace(['{username}', '{uuid}'], [
            $user->name,
            $user->uuid ?? $user->id,
        ], $command);

        // Queue command for server execution via game bridge
        // Implementation depends on game integration
        return true;
    }

    public function getRewardTypeLabelAttribute(): string
    {
        return match ($this->reward_type) {
            self::REWARD_MONEY => 'Money',
            self::REWARD_ITEMS => 'Items',
            self::REWARD_ROLE => 'Role',
            self::REWARD_COMMAND => 'Command',
            default => 'Unknown',
        };
    }
}
