<?php

namespace ExilonCMS\Http\Controllers\Auth;

use Exception;
use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Models\ActionLog;
use ExilonCMS\Models\User;
use ExilonCMS\Providers\RouteServiceProvider;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Contracts\User as SocialUser;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\Response;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen.
    |
    */

    /**
     * Where to redirect users after login.
     */
    protected string $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');

        $this->middleware('login.socialite')->only(['showLoginForm', 'login']);

        if (setting('captcha.login')) {
            $this->middleware('captcha')->only('login');
        }
    }

    /**
     * Show the application's login form.
     */
    public function showLoginForm()
    {
        return inertia('Auth/Login', [
            'captcha' => (bool) setting('captcha.login'),
            'canRegister' => setting('register', true),
        ]);
    }

    /**
     * Handle a login request to the application.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function login(Request $request)
    {
        $this->validateLogin($request);

        if ($this->hasTooManyLoginAttempts($request)) {
            $this->fireLockoutEvent($request);

            return $this->sendLockoutResponse($request);
        }

        $this->ensureUserCanLogin($this->credentials($request));

        if (! Auth::guard()->once($this->credentials($request))) {
            $this->incrementLoginAttempts($request);

            return $this->sendFailedLoginResponse($request);
        }

        /** @var \ExilonCMS\Models\User $user */
        $user = Auth::guard()->user();

        if ($user === null || $user->isDeleted()) {
            return $this->sendFailedLoginResponse($request);
        }

        return $this->loginUser($request, $user);
    }

    /**
     * Validate the user login request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function validateLogin(Request $request): void
    {
        $request->validate([
            $this->username() => 'required|string',
            'password' => 'required|string',
        ]);
    }

    /**
     * Try to log in the given user or redirect to 2FA if needed.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function loginUser(Request $request, User $user, bool $oauth = false): Response
    {
        if ($user->isBanned()) {
            throw ValidationException::withMessages([
                $this->username() => trans('auth.suspended'),
            ]);
        }

        if ($this->isMaintenance($user)) {
            return $this->sendMaintenanceResponse($request);
        }

        if (! $oauth && $user->hasTwoFactorAuth()) {
            return $this->redirectTo2fa($request, $user);
        }

        Auth::guard()->login($user, $oauth || $request->filled('remember'));

        return $this->sendLoginResponse($request);
    }

    /**
     * Make sure that the user does not need to reset his password.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function ensureUserCanLogin(array $credential): void
    {
        $user = User::firstWhere(Arr::except($credential, 'password'));

        if ($user?->mustChangePassword()) {
            throw ValidationException::withMessages([
                $this->username() => trans('passwords.change'),
            ]);
        }
    }

    /**
     * Obtain the user information from the provider.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function handleProviderCallback(Request $request): Response
    {
        abort_if(! game()->loginWithOAuth(), 404);

        $userProfile = Socialite::driver(game()->getSocialiteDriverName())->user();
        $user = User::firstWhere('game_id', (string) $userProfile->getId());

        if ($this->isMaintenance($user)) {
            return $this->sendMaintenanceResponse($request);
        }

        if ($user === null) {
            $user = $this->registerUser($request, $userProfile);

            Auth::guard()->login($user);

            return $request->expectsJson()
                ? response()->noContent()
                : redirect($this->redirectPath());
        }

        if (! $user->hasUploadedAvatar()) {
            $user->avatar = $userProfile->getAvatar();
        }

        $user->update([
            'name' => $userProfile->getNickname() ?? $userProfile->getName(),
            'avatar' => $userProfile->getAvatar() ?? $user->avatar,
        ]);

        return $this->loginUser($request, $user, true);
    }

    protected function registerUser(Request $request, SocialUser $user): User
    {
        $user = User::forceCreate([
            'name' => $user->getNickname() ?? $user->getName(),
            'email' => $user->getEmail(),
            'avatar' => $user->getAvatar(),
            'password' => Str::random(32),
            'game_id' => (string) $user->getId(),
            'last_login_ip' => $request->ip(),
            'last_login_at' => now(),
        ]);

        event(new Registered($user));

        return $user;
    }

    protected function redirectTo2fa(Request $request, User $user)
    {
        $request->session()->put('login.2fa', [
            'id' => $user->id,
            'remember' => $request->filled('remember'),
        ]);

        if ($request->expectsJson()) {
            return response()->json(['2fa' => true], 423);
        }

        return to_route('login.2fa');
    }

    /**
     * Show the application's 2fa form.
     */
    public function showCodeForm(Request $request)
    {
        if (! $request->session()->has('login.2fa.id')) {
            return to_route('login');
        }

        return inertia('Auth/TwoFactor');
    }

    /**
     * Handle a 2fa request to the application.
     *
     * @throws \Illuminate\Auth\AuthenticationException
     * @throws \Illuminate\Validation\ValidationException
     * @throws \PragmaRX\Google2FA\Exceptions\Google2FAException
     */
    public function verifyCode(Request $request)
    {
        $this->validate($request, ['code' => 'required']);

        if (! $request->session()->has('login.2fa.id')) {
            throw new AuthenticationException('Unauthenticated.', [Auth::guard()], route('login'));
        }

        /** @var \ExilonCMS\Models\User $user */
        $user = User::findOrFail($request->session()->get('login.2fa.id'));
        $code = $request->input('code');

        if (! $user->isValidTwoFactorCode($code)) {
            throw ValidationException::withMessages([
                'code' => trans('auth.2fa.invalid'),
            ]);
        }

        Auth::guard()->login($user, $request->session()->get('login.2fa.remember'));

        $request->session()->remove('login.2fa');

        $user->replaceRecoveryCode($code);

        return $this->sendLoginResponse($request);
    }

    /**
     * Send the response after the user was authenticated.
     */
    protected function sendLoginResponse(Request $request)
    {
        $request->session()->regenerate();

        $this->clearLoginAttempts($request);

        /** @var \ExilonCMS\Models\User $user */
        $user = Auth::user();

        $this->authenticated($request, $user);

        return $request->expectsJson()
            ? response()->noContent()
            : redirect()->intended($this->redirectPath());
    }

    /**
     * The user has been authenticated.
     */
    protected function authenticated(Request $request, User $user): void
    {
        $request->session()->remove('login.2fa');

        $user->forceFill([
            'last_login_ip' => $request->ip(),
            'last_login_at' => now(),
        ])->save();

        ActionLog::log('users.login', null, [
            'ip' => $request->ip(),
            '2fa' => $user->hasTwoFactorAuth() ? 'on' : 'off',
        ]);

        if (game()->loginWithOAuth()) {
            return;
        }

        try {
            $name = game()->getUserName($user);

            if ($name !== null) {
                $user->update(['name' => $name]);
            }
        } catch (Exception $e) {
            report($e);
        }
    }

    /**
     * Get the failed login response instance.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function sendFailedLoginResponse(Request $request)
    {
        throw ValidationException::withMessages([
            $this->username() => [trans('auth.failed')],
        ]);
    }

    /**
     * Get the needed authorization credentials from the request.
     */
    protected function credentials(Request $request): array
    {
        $username = $request->input($this->username());

        $field = Str::contains($username, '@') ? $this->username() : 'name';

        return [$field => $username, ...$request->only('password')];
    }

    /**
     * Get the login username to be used by the controller.
     */
    public function username(): string
    {
        return 'email';
    }

    /**
     * Get the guard to be used during authentication.
     */
    protected function guard()
    {
        return Auth::guard();
    }

    /**
     * Log the user out of the application.
     */
    public function logout(Request $request)
    {
        Auth::guard()->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $request->expectsJson()
            ? response()->noContent()
            : redirect('/');
    }

    /**
     * Show the password confirmation form.
     */
    public function showConfirmPasswordForm(Request $request)
    {
        return inertia('Auth/ConfirmPassword');
    }

    /**
     * Confirm the user's password.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function confirmPassword(Request $request)
    {
        $this->validate($request, [
            'password' => ['required', 'current_password'],
        ]);

        $request->session()->put('auth.password_confirmed_at', time());

        // Try to get intended URL, otherwise fall back to previous URL or home
        $intended = $request->session()->get('url.intended');
        if (! $intended) {
            $intended = $request->input('return_url') ?: url()->previous();
        }

        return $request->expectsJson()
            ? response()->noContent()
            : redirect($intended ?: '/');
    }

    /**
     * Get the post register / login redirect path.
     */
    public function redirectPath(): string
    {
        if (method_exists($this, 'redirectTo')) {
            return $this->redirectTo();
        }

        return property_exists($this, 'redirectTo') ? $this->redirectTo : '/home';
    }

    /**
     * Determine if the user has too many failed login attempts.
     */
    protected function hasTooManyLoginAttempts(Request $request): bool
    {
        return RateLimiter::tooManyAttempts(
            $this->throttleKey($request),
            5 // Max attempts
        );
    }

    /**
     * Increment the login attempts for the user.
     */
    protected function incrementLoginAttempts(Request $request): void
    {
        RateLimiter::hit(
            $this->throttleKey($request),
            60 // Decay in seconds
        );
    }

    /**
     * Redirect the user after determining they are locked out.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function sendLockoutResponse(Request $request)
    {
        $seconds = RateLimiter::availableIn($this->throttleKey($request));

        throw ValidationException::withMessages([
            $this->username() => [trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ])],
        ])->status(429);
    }

    /**
     * Clear the login locks for the given user credentials.
     */
    protected function clearLoginAttempts(Request $request): void
    {
        RateLimiter::clear($this->throttleKey($request));
    }

    /**
     * Fire an event when a lockout occurs.
     */
    protected function fireLockoutEvent(Request $request): void
    {
        event(new \Illuminate\Auth\Events\Lockout($request));
    }

    /**
     * Get the throttle key for the given request.
     */
    protected function throttleKey(Request $request): string
    {
        return Str::transliterate(Str::lower($request->input($this->username())).'|'.$request->ip());
    }

    /**
     * Get the maintenance response.
     */
    protected function sendMaintenanceResponse(Request $request)
    {
        if ($request->expectsJson()) {
            return response()->json(['message' => trans('auth.maintenance')], 503);
        }

        return redirect()->back()->with('error', trans('auth.maintenance'));
    }

    protected function isMaintenance(?User $user = null): bool
    {
        if (! setting('maintenance.enabled', false)) {
            return false; // Maintenance is not enabled
        }

        if ($user === null || $user->can('maintenance.access')) {
            return false; // Invalid user (can attempt a new login), or user with maintenance access
        }

        $paths = setting('maintenance.paths', []);

        if (empty($paths)) {
            return true; // Global maintenance, and not allowed to bypass
        }

        // Check if maintenance is enabled for login route
        return Arr::first($paths, function (string $path) {
            return Str::startsWith(trim($path, '/'), 'user/login');
        }) !== null;
    }
}
