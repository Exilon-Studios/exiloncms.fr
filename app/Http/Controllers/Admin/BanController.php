<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Http\Requests\BanRequest;
use ExilonCMS\Models\Ban;
use ExilonCMS\Models\User;
use Inertia\Inertia;

class BanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Bans/Index', [
            'bans' => Ban::withTrashed()->with(['user', 'author', 'remover'])->paginate(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BanRequest $request, User $user)
    {
        Ban::create([
            'user_id' => $user->id,
            'reason' => $request->input('reason'),
        ]);

        return to_route('admin.users.edit', $user)
            ->with('success', trans('admin.users.status.banned'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @throws \LogicException
     */
    public function destroy(User $user, Ban $ban)
    {
        $ban->removeBan();

        return to_route('admin.users.edit', $user)
            ->with('success', trans('admin.users.status.unbanned'));
    }
}
