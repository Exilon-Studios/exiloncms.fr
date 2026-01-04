<?php

namespace ExilonCMS\Http\Controllers\Auth;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;

class ResetPasswordController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset requests.
    |
    */

    /**
     * Redirect users after resetting their password to login screen.
     */
    protected string $redirectTo = '/user/login';

    /**
     * Display the password reset view for the given token.
     */
    public function showResetForm(Request $request, ?string $token = null)
    {
        return inertia('Auth/ResetPassword', [
            'token' => $token,
            'email' => $request->email,
        ]);
    }

    /**
     * Reset the given user's password.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', PasswordRule::default()],
        ]);

        // Here we will attempt to reset the user's password. If it is successful we
        // will update the password on an actual user model and persist it to the
        // database. Otherwise we will parse the error and return the response.
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $this->resetPassword($user, $password);
            }
        );

        // If the password was successfully reset, we will redirect the user back to
        // the application's home authenticated view. If there is an error we can
        // redirect them back to where they came from with their error message.
        if ($status === Password::PASSWORD_RESET) {
            return redirect()->to($this->redirectPath())->with('status', trans($status));
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }

    /**
     * Reset the given user's password.
     */
    protected function resetPassword(User $user, string $password): void
    {
        $user->password = Hash::make($password);
        $user->setRememberToken(Str::random(60));

        $user->save();

        event(new PasswordReset($user));

        session()->flash('success', trans('passwords.reset'));
    }

    /**
     * Get the post-reset redirect path.
     */
    public function redirectPath(): string
    {
        if (method_exists($this, 'redirectTo')) {
            return $this->redirectTo();
        }

        return property_exists($this, 'redirectTo') ? $this->redirectTo : '/home';
    }
}
