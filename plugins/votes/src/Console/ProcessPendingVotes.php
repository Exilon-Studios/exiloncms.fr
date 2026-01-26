<?php

namespace ExilonCMS\Plugins\Votes\Console;

use ExilonCMS\Plugins\Notifications\Services\NotificationService;
use ExilonCMS\Plugins\Votes\Models\Vote;
use ExilonCMS\Plugins\Votes\Models\VoteReward;
use ExilonCMS\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessPendingVotes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'votes:process-pending';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process pending votes and give rewards to users';

    /**
     * Execute the console command.
     */
    public function handle(NotificationService $notificationService): int
    {
        $this->info('Processing pending votes...');

        try {
            $pendingVotes = Vote::where('status', 'pending')
                ->where('created_at', '>=', now()->subHours(24))
                ->limit(100)
                ->get();

            if ($pendingVotes->isEmpty()) {
                $this->info('No pending votes to process.');
                return self::SUCCESS;
            }

            $processed = 0;
            $failed = 0;

            foreach ($pendingVotes as $vote) {
                try {
                    $this->processVote($vote, $notificationService);
                    $processed++;
                } catch (\Exception $e) {
                    $this->error("Failed to process vote {$vote->id}: {$e->getMessage()}");
                    $failed++;
                }
            }

            $this->info("✓ Processed {$processed} vote(s) successfully");

            if ($failed > 0) {
                $this->warn("✗ Failed to process {$failed} vote(s)");
            }

            Log::info('Pending votes processed', [
                'processed' => $processed,
                'failed' => $failed,
            ]);

            return self::SUCCESS;
        } catch (\Exception $e) {
            $this->error("Failed to process votes: {$e->getMessage()}");

            Log::error('Failed to process pending votes', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return self::FAILURE;
        }
    }

    /**
     * Process a single vote and give rewards.
     */
    protected function processVote(Vote $vote, NotificationService $notificationService): void
    {
        $user = User::find($vote->user_id);

        if (!$user) {
            $vote->update([
                'status' => 'failed',
                'processed_at' => now(),
                'error_message' => 'User not found',
            ]);
            return;
        }

        // Check if user can vote (not already voted in the last 24 hours)
        $canVote = $this->canUserVote($user, $vote->site_id);

        if (!$canVote) {
            $vote->update([
                'status' => 'failed',
                'processed_at' => now(),
                'error_message' => 'User already voted in the last 24 hours',
            ]);
            return;
        }

        DB::beginTransaction();

        try {
            // Get all enabled rewards for this voting site
            $rewards = VoteReward::where('site_id', $vote->site_id)
                ->where('is_enabled', true)
                ->get();

            foreach ($rewards as $reward) {
                $this->giveReward($user, $reward);
            }

            // Mark vote as processed
            $vote->update([
                'status' => 'approved',
                'processed_at' => now(),
            ]);

            DB::commit();

            // Send notification to user
            $notificationService->send($user, 'vote.reward', [
                'site_name' => $vote->site->name ?? 'Unknown',
                'reward_count' => $rewards->count(),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            $vote->update([
                'status' => 'failed',
                'processed_at' => now(),
                'error_message' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Check if user can vote (24-hour cooldown).
     */
    protected function canUserVote(User $user, int $siteId): bool
    {
        $lastVote = Vote::where('user_id', $user->id)
            ->where('site_id', $siteId)
            ->where('status', 'approved')
            ->where('processed_at', '>=', now()->subHours(24))
            ->first();

        return !$lastVote;
    }

    /**
     * Give a reward to a user.
     */
    protected function giveReward(User $user, VoteReward $reward): void
    {
        switch ($reward->type) {
            case 'money':
                $user->increment('money', $reward->amount);
                break;

            case 'item':
                // Give item to user
                // Implementation depends on your game server integration
                break;

            case 'role':
                // Add role to user
                if (!DB::table('role_user')->where('user_id', $user->id)->where('role_id', $reward->role_id)->exists()) {
                    DB::table('role_user')->insert([
                        'user_id' => $user->id,
                        'role_id' => $reward->role_id,
                    ]);
                }
                break;

            case 'command':
                // Execute server command
                // $command = str_replace(['{player}', '{uuid}', '{id}'], [$user->name, $user->uuid, $user->id], $reward->command);
                // Execute command via ExilonLink or RCON
                break;
        }
    }
}
