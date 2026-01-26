<?php

namespace ExilonCMS\Plugins\Votes\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Plugins\Votes\Models\VoteReward;
use ExilonCMS\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VoteRewardController extends Controller
{
    public function index()
    {
        $rewards = VoteReward::with(['role'])->orderBy('required_votes')->get();

        return Inertia::render('Admin/Votes/Rewards/Index', [
            'rewards' => $rewards,
        ]);
    }

    public function create()
    {
        $roles = Role::all();

        return Inertia::render('Admin/Votes/Rewards/Create', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'reward_type' => 'required|in:money,items,role,command',
            'reward_amount' => 'required|string',
            'required_votes' => 'required|integer|min:1',
            'is_active' => 'boolean',
        ]);

        VoteReward::create($validated);

        return redirect()
            ->route('admin.votes.rewards.index')
            ->with('success', 'Vote reward created successfully.');
    }

    public function edit(VoteReward $reward)
    {
        $roles = Role::all();

        return Inertia::render('Admin/Votes/Rewards/Edit', [
            'reward' => $reward->load('role'),
            'roles' => $roles,
        ]);
    }

    public function update(Request $request, VoteReward $reward)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'reward_type' => 'required|in:money,items,role,command',
            'reward_amount' => 'required|string',
            'required_votes' => 'required|integer|min:1',
            'is_active' => 'boolean',
        ]);

        $reward->update($validated);

        return redirect()
            ->route('admin.votes.rewards.index')
            ->with('success', 'Vote reward updated successfully.');
    }

    public function destroy(VoteReward $reward)
    {
        $reward->delete();

        return back()->with('success', 'Vote reward deleted successfully.');
    }

    public function toggle(VoteReward $reward)
    {
        $reward->update(['is_active' => !$reward->is_active]);

        return back()->with('success', 'Vote reward status updated.');
    }
}
