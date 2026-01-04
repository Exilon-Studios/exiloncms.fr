<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Http\Requests\UserRequest;
use ExilonCMS\Models\ActionLog;
use ExilonCMS\Models\Notification;
use ExilonCMS\Models\Role;
use ExilonCMS\Models\User;
use ExilonCMS\Notifications\AlertNotification;
use ExilonCMS\Support\Discord\LinkedRoles;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        $users = User::with('ban', 'role')
            ->whereNull('deleted_at')
            ->when($search, fn (Builder $q) => $q->scopes(['search' => $search]))
            ->paginate(20);

        return inertia('Admin/Users/Index', [
            'users' => $users,
            'search' => $search,
            'canViewEmail' => $request->user()->can('admin.users.email'),
            'notificationLevels' => Notification::LEVELS,
        ]);
    }

    /**
     * Send a notification to one or all users.
     *
     * @throws \Illuminate\Validation\ValidationException;
     */
    public function notify(Request $request, ?User $user = null)
    {
        $this->validate($request, [
            'level' => ['required', Rule::in(Notification::LEVELS)],
            'content' => ['required', 'string', 'max:100'],
        ]);

        $users = $user !== null ? [$user] : User::lazy();
        $notification = (new AlertNotification($request->input('content')))
            ->level($request->input('level'))
            ->from($request->user());

        foreach ($users as $localUser) {
            $notification->send($localUser);
        }

        return redirect()->back()->with('success', trans('messages.status.success'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Admin/Users/Create', [
            'roles' => Role::orderByDesc('power')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @throws \Illuminate\Validation\ValidationException;
     */
    public function store(UserRequest $request)
    {
        $role = Role::find($request->input('role'));

        $this->validateRole($request->user(), $role);

        $user = new User(Arr::except($request->validated(), 'role'));
        $user->role()->associate($role);
        $user->save();

        return to_route('admin.users.index')
            ->with('success', trans('messages.status.success'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        $logs = ActionLog::with('target')
            ->whereBelongsTo($user)
            ->latest()
            ->paginate(15);

        return inertia('Admin/Users/Edit', [
            'user' => $user->load('ban', 'role'),
            'roles' => Role::orderByDesc('power')->get(),
            'logs' => $logs,
            'notificationLevels' => Notification::LEVELS,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @throws \Illuminate\Validation\ValidationException;
     */
    public function update(UserRequest $request, User $user)
    {
        if ($user->isDeleted()) {
            return redirect()->back();
        }

        $validated = $request->validated();

        // Ne mettre à jour le password que s'il est présent dans la requête
        if (!$request->filled('password')) {
            unset($validated['password']);
        }

        $user->fill(Arr::except($validated, 'role'));

        $role = Role::find($request->input('role'));

        $this->validateRole($request->user(), $role, $user);

        $user->role()->associate($role);
        $user->save();

        $log = ActionLog::log('users.updated', $user);

        if ($log !== null) {
            $user->createLogEntries($log);
        }

        if ($user->wasChanged('password')) {
            event(new PasswordReset($user));

            $log->createEntries(['password' => '**old**'], ['password' => '**new**']);
        }

        return to_route('admin.users.edit', $user)
            ->with('success', trans('messages.status.success'));
    }

    public function verifyEmail(User $user)
    {
        if ($user->isDeleted()) {
            return redirect()->back();
        }

        $user->markEmailAsVerified();

        ActionLog::log('users.updated', $user)?->createEntries([
            'email_verified_at' => null,
        ], [
            'email_verified_at' => $user->email_verified_at,
        ]);

        return to_route('admin.users.edit', $user)
            ->with('success', trans('admin.users.email.verify_success'));
    }

    public function disable2fa(User $user)
    {
        $user->forceFill([
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
        ])->save();

        ActionLog::log('users.updated', $user)?->createEntries([
            '2fa' => 'enabled',
        ], ['2fa' => 'disabled']);

        return to_route('admin.users.edit', $user)
            ->with('success', trans('admin.users.2fa.disabled'));
    }

    public function forcePasswordChange(User $user)
    {
        $user->update(['password_changed_at' => null]);

        return to_route('admin.users.edit', $user)
            ->with('success', trans('messages.status.success'));
    }

    public function unlinkDiscord(User $user)
    {
        if ($user->discordAccount !== null) {
            LinkedRoles::clearRole($user->discordAccount);

            $user->discordAccount->delete();
        }

        return to_route('admin.users.edit', $user)
            ->with('success', trans('messages.status.success'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        if ($user->isDeleted() || $user->isAdmin()) {
            return redirect()->back();
        }

        $user->delete();

        ActionLog::log('users.deleted', $user);

        return to_route('admin.users.index', $user)
            ->with('success', trans('messages.status.success'));
    }

    /**
     * Ensure if a user can change the specified role.
     *
     * @throws \Illuminate\Validation\ValidationException;
     */
    protected function validateRole(User $user, Role $role, ?User $target = null): void
    {
        if (($target && $user->role->power < $target->role->power)
            || (! $user->isAdmin() && $user->role->power < $role->power)) {
            throw ValidationException::withMessages([
                'role_id' => trans('admin.roles.unauthorized'),
            ]);
        }

        $adminUsers = User::whereRelation('role', 'is_admin', true);

        // So many users lost access to the admin panel because they were the only admin
        if (! $role->is_admin && $target?->isAdmin() && $adminUsers->count() < 2) {
            throw ValidationException::withMessages([
                'role_id' => trans('admin.roles.no_admin'),
            ]);
        }
    }
}
