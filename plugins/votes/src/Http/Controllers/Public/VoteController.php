<?php

namespace ExilonCMS\Plugins\Votes\Http\Controllers\Public;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Plugins\Votes\Models\Vote;
use ExilonCMS\Plugins\Votes\Models\VoteSite;
use ExilonCMS\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class VoteController extends Controller
{
    public function index()
    {
        $sites = VoteSite::where('is_enabled', true)
            ->orderBy('priority')
            ->get();

        $userVotes = auth()->check()
            ? Vote::where('user_id', auth()->id())
                ->where('created_at', '>=', now()->subDay())
                ->get()
                ->keyBy('vote_site_id')
            : collect();

        return inertia('Votes/Index', [
            'sites' => $sites,
            'userVotes' => $userVotes,
        ]);
    }

    public function store(Request $request, VoteSite $site)
    {
        if (!auth()->check()) {
            return back()->with('error', 'You must be logged in to vote.');
        }

        /** @var User $user */
        $user = $request->user();

        // Check if user can vote
        $lastVote = Vote::where('user_id', $user->id)
            ->where('vote_site_id', $site->id)
            ->where('created_at', '>=', now()->subHours(config('votes.cooldown', 24)))
            ->first();

        if ($lastVote) {
            $nextVoteAt = $lastVote->created_at->addHours(config('votes.cooldown', 24));
            return back()->with('error', "You can vote again in {$nextVoteAt->diffForHumans()}.");
        }

        // Create vote record
        $vote = Vote::create([
            'user_id' => $user->id,
            'vote_site_id' => $site->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'is_verified' => false,
        ]);

        // Redirect to vote site
        return redirect()->away($site->vote_url);
    }

    public function callback(Request $request, VoteSite $site)
    {
        $validated = $request->validate([
            'username' => 'required|string',
            'key' => 'required|string',
        ]);

        // Verify vote with external site
        $response = Http::timeout(10)->get($site->url . '/api/ping', [
            'key' => $site->vote_key,
            'username' => $validated['username'],
        ]);

        if (!$response->successful()) {
            return redirect()
                ->route('votes.index')
                ->with('error', 'Failed to verify vote with the voting site.');
        }

        $data = $response->json();

        if (!$data['voted']) {
            return redirect()
                ->route('votes.index')
                ->with('error', 'Vote not found or already processed.');
        }

        // Find user by username
        $user = User::where('name', $validated['username'])->first();

        if (!$user) {
            return redirect()
                ->route('votes.index')
                ->with('error', 'User not found.');
        }

        // Find and verify vote
        $vote = Vote::where('user_id', $user->id)
            ->where('vote_site_id', $site->id)
            ->where('is_verified', false)
            ->latest()
            ->first();

        if (!$vote) {
            return redirect()
                ->route('votes.index')
                ->with('error', 'No pending vote found.');
        }

        $vote->update(['is_verified' => true]);

        // Process rewards if auto-reward is enabled
        if (config('votes.auto_reward', true)) {
            $this->processRewards($user, $vote);
        }

        return redirect()
            ->route('votes.index')
            ->with('success', 'Vote verified! You have received your rewards.');
    }

    protected function processRewards(User $user, Vote $vote): void
    {
        $totalVotes = Vote::where('user_id', $user->id)
            ->where('is_verified', true)
            ->count();

        $rewards = \ExilonCMS\Plugins\Votes\Models\VoteReward::where('is_active', true)
            ->where('required_votes', '<=', $totalVotes)
            ->get();

        foreach ($rewards as $reward) {
            // Check if user already received this reward
            $alreadyReceived = $user->voteRewards()
                ->where('vote_reward_id', $reward->id)
                ->exists();

            if (!$alreadyReceived) {
                $reward->processReward($user);
                $user->voteRewards()->attach($reward->id, [
                    'received_at' => now(),
                ]);
            }
        }
    }
}
