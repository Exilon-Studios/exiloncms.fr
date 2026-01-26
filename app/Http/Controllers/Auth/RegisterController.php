<?php

namespace ExilonCMS\Http\Controllers\Auth;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Models\Role;
use ExilonCMS\Models\User;
use ExilonCMS\Providers\RouteServiceProvider;
use ExilonCMS\Rules\GameAuth;
use ExilonCMS\Rules\Username;
use ExilonCMS\Support\Markdown;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation.
    |
    */

    /**
     * Where to redirect users after registration.
     */
    protected string $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('guest');
        $this->middleware('login.socialite');
        $this->middleware('captcha')->only('register');
    }

    /**
     * Show the application registration form.
     */
    public function showRegistrationForm()
    {
        $conditions = setting('conditions');

        if ($conditions !== null) {
            $rawConditions = preg_match('/^https?:\/\//i', $conditions)
                ? trans('auth.conditions', ['url' => $conditions])
                : Str::between(Markdown::parse($conditions, true), '<p>', '</p>');

            $conditions = $rawConditions;
        }

        return inertia('Auth/Register', [
            'captcha' => (bool) setting('captcha.register'),
            'registerConditions' => $conditions,
        ]);
    }

    /**
     * Handle a registration request for the application.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function register(Request $request)
    {
        $this->validator($request->all())->validate();

        event(new Registered($user = $this->create($request->all())));

        Auth::guard()->login($user);

        return $this->registered($request, $user)
            ?: redirect($this->redirectPath());
    }

    /**
     * Get a validator for an incoming registration request.
     */
    protected function validator(array $data): \Illuminate\Contracts\Validation\Validator
    {
        return \Illuminate\Support\Facades\Validator::make($data, [
            'name' => ['required', 'string', 'max:25', 'unique:users', new Username, new GameAuth],
            'email' => ['required', 'string', 'email', 'max:50', 'unique:users'],
            'password' => ['required', 'confirmed', Password::default()],
            'conditions' => [setting('conditions', false) ? 'accepted' : 'nullable'],
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     */
    protected function create(array $data): User
    {
        return User::forceCreate([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role_id' => Role::defaultRoleId(),
            'game_id' => game()->getUserUniqueId($data['name']),
            'last_login_ip' => request()->ip(),
            'last_login_at' => now(),
        ]);
    }

    /**
     * The user has been registered.
     */
    protected function registered(Request $request, User $user)
    {
        // Can be overridden in child classes
        return null;
    }

    /**
     * Get the post register redirect path.
     */
    public function redirectPath(): string
    {
        if (method_exists($this, 'redirectTo')) {
            return $this->redirectTo();
        }

        return property_exists($this, 'redirectTo') ? $this->redirectTo : '/home';
    }

    /**
     * Get the guard to be used during registration.
     */
    protected function guard()
    {
        return Auth::guard();
    }
}
