<?php

namespace MCCMS\Http\Controllers\Admin;

use MCCMS\Http\Controllers\Controller;
use MCCMS\Models\ActionLog;
use MCCMS\Models\Image;
use MCCMS\Models\Setting;
use MCCMS\Notifications\TestMail;
use MCCMS\Support\Files;
use MCCMS\Support\Optimizer;
use DateTimeZone;
use Exception;
use Illuminate\Contracts\Cache\Repository as Cache;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Hashing\HashManager;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * The supported mail drivers.
     */
    private array $mailMailers = [
        'smtp' => 'SMTP',
        'sendmail' => 'Sendmail',
    ];

    /**
     * The supported hash algorithms.
     */
    private array $hashAlgorithms = [
        'bcrypt' => 'Bcrypt',
        'argon' => 'Argon2i',
        'argon2id' => 'Argon2id',
    ];

    /**
     * The application instance.
     */
    private Application $app;

    /**
     * The application cache.
     */
    private Cache $cache;

    /**
     * The MC-CMS optimizer.
     */
    private Optimizer $optimizer;

    /**
     * Create a new controller instance.
     */
    public function __construct(Application $app, Cache $cache, Optimizer $optimizer)
    {
        $this->app = $app;
        $this->cache = $cache;
        $this->optimizer = $optimizer;
    }

    /**
     * Show the application settings.
     */
    public function index()
    {
        return inertia('Admin/Settings/Index', [
            'images' => Image::all(),
            'settings' => [
                'name' => setting('name'),
                'description' => setting('description'),
                'url' => setting('url', config('app.url')),
                'icon' => setting('icon'),
                'logo' => setting('logo'),
                'background' => setting('background'),
                'locale' => app()->getLocale(),
                'timezone' => config('app.timezone'),
                'copyright' => setting('copyright'),
                'conditions' => setting('conditions'),
                'money' => setting('money'),
                'site_key' => setting('site-key'),
                'user_money_transfer' => setting('users.money_transfer'),
                'posts_webhook' => setting('posts_webhook'),
                'keywords' => setting('keywords'),
            ],
            'locales' => $this->getAvailableLocales(),
            'timezones' => DateTimeZone::listIdentifiers(),
        ]);
    }

    /**
     * Show the general settings page.
     */
    public function general()
    {
        return inertia('Admin/Settings/General', [
            'images' => Image::all(),
            'settings' => [
                'name' => setting('name'),
                'description' => setting('description'),
                'url' => setting('url', config('app.url')),
                'icon' => setting('icon'),
                'logo' => setting('logo'),
                'background' => setting('background'),
                'locale' => app()->getLocale(),
                'timezone' => config('app.timezone'),
                'copyright' => setting('copyright'),
                'conditions' => setting('conditions'),
                'money' => setting('money'),
                'site_key' => setting('site-key'),
                'user_money_transfer' => setting('users.money_transfer'),
                'posts_webhook' => setting('posts_webhook'),
                'keywords' => setting('keywords'),
            ],
            'locales' => $this->getAvailableLocales(),
            'timezones' => DateTimeZone::listIdentifiers(),
        ]);
    }

    /**
     * Show the security settings page.
     */
    public function security()
    {
        return inertia('Admin/Settings/Security', [
            'settings' => [
                'registration_enabled' => (bool) setting('register', true),
                'email_verification' => (bool) setting('auth.verification', false),
                'two_factor_enabled' => (bool) setting('auth.2fa', false),
                'password_min_length' => setting('auth.password_min', '8'),
                'user_change_name' => (bool) setting('user.change_name', false),
                'user_upload_avatar' => (bool) setting('user.upload_avatar', false),
                'user_delete' => (bool) setting('user.delete', false),
                'admin_force_2fa' => (bool) setting('admin.force_2fa', false),
            ],
        ]);
    }

    /**
     * Update the application settings.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function update(Request $request)
    {
        $settings = [
            ...$this->validate($request, [
                'name' => ['required', 'string', 'max:50'],
                'description' => ['nullable', 'string', 'max:255'],
                'url' => ['required', 'url'],
                'timezone' => ['required', 'timezone'],
                'copyright' => ['nullable', 'string', 'max:150'],
                'keywords' => ['nullable', 'string', 'max:150'],
                'locale' => ['required', 'string', Rule::in($this->getAvailableLocaleCodes())],
                'icon' => ['nullable', 'exists:images,file'],
                'logo' => ['nullable', 'exists:images,file'],
                'background' => ['nullable', 'exists:images,file'],
                'money' => ['required', 'string', 'max:15'],
                'site-key' => ['nullable', 'string', 'size:50'],
                'posts_webhook' => ['nullable', 'url'],
            ]),
            'users.money_transfer' => $request->filled('user_money_transfer'),
            'url' => rtrim($request->input('url'), '/'), // Remove trailing end slash
        ];

        $old = Arr::except(Setting::updateSettings($settings), 'users.money_transfer');

        ActionLog::log('settings.updated')?->createEntries($old, $settings);

        $response = to_route('admin.settings.index')
            ->with('success', trans('admin.settings.updated'));

        if (setting('register', true) !== $request->filled('register')) {
            $this->optimizer->reloadRoutesCache();
        }

        $this->cache->forget('updates');

        return $response;
    }

    /**
     * Update general settings.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateGeneral(Request $request)
    {
        $settings = [
            ...$this->validate($request, [
                'name' => ['required', 'string', 'max:50'],
                'description' => ['nullable', 'string', 'max:255'],
                'url' => ['required', 'url'],
                'timezone' => ['required', 'timezone'],
                'copyright' => ['nullable', 'string', 'max:150'],
                'keywords' => ['nullable', 'string', 'max:150'],
                'locale' => ['required', 'string', Rule::in($this->getAvailableLocaleCodes())],
                'icon' => ['nullable', 'exists:images,file'],
                'logo' => ['nullable', 'exists:images,file'],
                'background' => ['nullable', 'exists:images,file'],
                'money' => ['required', 'string', 'max:15'],
                'site-key' => ['nullable', 'string', 'size:50'],
                'posts_webhook' => ['nullable', 'url'],
            ]),
            'users.money_transfer' => $request->filled('user_money_transfer'),
            'url' => rtrim($request->input('url'), '/'), // Remove trailing end slash
        ];

        $old = Arr::except(Setting::updateSettings($settings), 'users.money_transfer');

        ActionLog::log('settings.updated')?->createEntries($old, $settings);

        $response = to_route('admin.settings.general')
            ->with('success', trans('admin.settings.updated'));

        if (setting('register', true) !== $request->filled('register')) {
            $this->optimizer->reloadRoutesCache();
        }

        $this->cache->forget('updates');

        return $response;
    }

    /**
     * Update security settings.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateSecurity(Request $request)
    {
        $this->validate($request, [
            'registration_enabled' => ['nullable', 'boolean'],
            'email_verification' => ['nullable', 'boolean'],
            'two_factor_enabled' => ['nullable', 'boolean'],
            'password_min_length' => ['nullable', 'integer', 'min:6', 'max:20'],
            'user_change_name' => ['nullable', 'boolean'],
            'user_upload_avatar' => ['nullable', 'boolean'],
            'user_delete' => ['nullable', 'boolean'],
            'admin_force_2fa' => ['nullable', 'boolean'],
        ]);

        $settings = [
            'register' => $request->boolean('registration_enabled', false),
            'auth.verification' => $request->boolean('email_verification', false),
            'auth.2fa' => $request->boolean('two_factor_enabled', false),
            'auth.password_min' => $request->input('password_min_length', '8'),
            'user.change_name' => $request->boolean('user_change_name', false),
            'user.upload_avatar' => $request->boolean('user_upload_avatar', false),
            'user.delete' => $request->boolean('user_delete', false),
            'admin.force_2fa' => $request->boolean('admin_force_2fa', false),
        ];

        $old = Setting::updateSettings($settings);
        ActionLog::log('settings.updated')?->createEntries($old, $settings);

        // Reload routes if registration setting changed
        if (setting('register', true) !== $request->boolean('registration_enabled', false)) {
            $this->optimizer->reloadRoutesCache();
        }

        return to_route('admin.settings.security')
            ->with('success', trans('admin.settings.updated'));
    }

    /**
     * Update the application security settings (for auth page).
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateAuthSettings(Request $request)
    {
        $hash = array_keys($this->hashAlgorithms);

        $this->validate($request, [
            'captcha' => ['nullable', 'in:recaptcha,hcaptcha,turnstile'],
            'site_key' => ['required_with:captcha', 'max:50'],
            'secret_key' => ['required_with:captcha', 'max:50'],
            'hash' => [
                'required', 'string', Rule::in($hash), function ($attribute, $value, $fail) {
                    if (! $this->isHashSupported($value)) {
                        $fail(trans('admin.settings.security.hash_error'));
                    }
                },
            ],
        ]);

        $settings = [
            ...$request->only('hash'),
            'admin.force_2fa' => $request->filled('force_2fa'),
        ];

        if ($request->filled('captcha')) {
            $settings = [
                ...$settings,
                'captcha.type' => $request->input('captcha'),
                'captcha.site_key' => $request->input('site_key'),
                'captcha.secret_key' => $request->input('secret_key'),
                'captcha.login' => $request->filled('login_captcha'),
            ];
        } else {
            $settings = [
                ...$settings,
                'captcha.type' => null,
                'captcha.site_key' => null,
                'captcha.secret_key' => null,
                'captcha.login' => null,
            ];
        }

        $old = Setting::updateSettings($settings);

        ActionLog::log('settings.updated')?->createEntries($old, $settings);

        return to_route('admin.settings.auth')
            ->with('success', trans('admin.settings.updated'));
    }

    public function performance()
    {
        return Inertia::render('Admin/Settings/Performance', [
            'cacheStatus' => $this->optimizer->isEnabled(),
            'settings' => [
                'cache_driver' => config('cache.default'),
                'cache_ttl' => config('cache.ttl', 3600),
            ],
            'drivers' => [
                'file' => 'File',
                'database' => 'Database',
                'redis' => 'Redis',
                'memcached' => 'Memcached',
                'array' => 'Array (in-memory)',
            ],
        ]);
    }

    /**
     * Update performance and cache settings.
     */
    public function updatePerformance(Request $request)
    {
        $settings = $this->validate($request, [
            'cache_driver' => ['required', 'string', 'in:file,database,redis,memcached,array'],
            'cache_ttl' => ['required', 'integer', 'min:60', 'max:86400'],
        ]);

        // Update cache driver in config
        config(['cache.default' => $settings['cache_driver']]);
        config(['cache.ttl' => $settings['cache_ttl']]);

        // Update environment file
        $this->updateEnv([
            'CACHE_DRIVER' => $settings['cache_driver'],
        ]);

        return to_route('admin.settings.performance')
            ->with('success', trans('admin.settings.updated'));
    }

    /**
     * Optimize application cache.
     */
    public function optimizeCache()
    {
        try {
            Artisan::call('config:cache');
            Artisan::call('route:cache');
            Artisan::call('view:cache');

            return to_route('admin.settings.performance')
                ->with('success', trans('admin.settings.updated'));
        } catch (Exception $e) {
            return to_route('admin.settings.performance')
                ->with('error', 'Erreur lors de l\'optimisation: '.$e->getMessage());
        }
    }

    /**
     * Clear the application cache.
     */
    public function clearCache()
    {
        $response = to_route('admin.settings.performance');

        if (! $this->cache->flush()) {
            return $response->with('error', trans('admin.settings.performances.cache.error'));
        }

        app(Optimizer::class)->clearViewCache();

        return $response->with('success', trans('messages.status.success'));
    }

    public function enableAdvancedCache()
    {
        $redirect = to_route('admin.settings.performance');

        if (! $this->optimizer->cache()) {
            return $redirect->with('error', trans('admin.settings.performances.boost.error'));
        }

        return $redirect->with('success', trans('messages.status.success'));
    }

    public function disableAdvancedCache()
    {
        $this->optimizer->clear();

        return to_route('admin.settings.performance')
            ->with('success', trans('messages.status.success'));
    }

    public function linkStorage()
    {
        $target = storage_path('app/public');
        $link = public_path('storage');

        Files::removeLink($link);

        Files::relativeLink($target, $link);

        return to_route('admin.settings.performance')
            ->with('success', trans('messages.status.success'));
    }

    public function migrate()
    {
        Artisan::call('migrate', ['--force' => true, '--seed' => true]);

        return to_route('admin.settings.performance')
            ->with('success', trans('messages.status.success'));
    }

    public function home()
    {
        return Inertia::render('Admin/Settings/Home', [
            'homeMessage' => setting('home_message'),
            'welcomeAlert' => setting('welcome_alert'),
        ]);
    }

    /**
     * Update the application SEO settings.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateSeo(Request $request)
    {
        $this->validate($request, [
            'home_message' => ['nullable', 'string'],
            'welcome_alert' => ['required_with:enable_welcome_alert', 'nullable', 'string'],
        ]);

        $settings = [
            'home_message' => $request->input('home_message'),
            'welcome_alert' => $request->filled('enable_welcome_alert')
                ? $request->input('welcome_alert')
                : null,
        ];

        $old = Setting::updateSettings($settings);

        ActionLog::log('settings.updated')?->createEntries($old, $settings);

        return to_route('admin.settings.home')
            ->with('success', trans('admin.settings.updated'));
    }

    public function auth(Request $request)
    {
        return Inertia::render('Admin/Settings/Auth', [
            'conditions' => setting('conditions'),
            'userNameChange' => setting('user.change_name'),
            'userUploadAvatar' => setting('user.upload_avatar', false),
            'userDelete' => setting('user.delete'),
            'register' => setting('register', true),
            'authApi' => setting('auth_api', false),
            'hashAlgorithms' => $this->hashAlgorithms,
            'currentHash' => config('hashing.driver'),
            'captchaType' => old('captcha', setting('captcha.type')),
            'loginCaptcha' => old('captcha', setting('captcha.login')),
            'force2fa' => setting('admin.force_2fa'),
            'canForce2fa' => $request->user()->hasTwoFactorAuth(),
        ]);
    }

    /**
     * Update the application auth settings.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateAuth(Request $request)
    {
        $settings = [
            ...$this->validate($request, [
                'conditions' => ['nullable', 'string', 'max:150'],
            ]),
            'register' => $request->filled('register'),
            'auth_api' => $request->filled('auth_api'),
            'user.change_name' => $request->filled('user_change_name'),
            'user.upload_avatar' => $request->filled('user_upload_avatar'),
            'user.delete' => $request->filled('user_delete'),
        ];

        $old = Setting::updateSettings($settings);

        ActionLog::log('settings.updated')?->createEntries($old, $settings);

        return to_route('admin.settings.auth')
            ->with('success', trans('admin.settings.updated'));
    }

    /**
     * Show the application mail settings.
     */
    public function mail()
    {
        return Inertia::render('Admin/Settings/Mail', [
            'settings' => [
                'mail_mailer' => setting('mail.mailer', config('mail.default', 'smtp')),
                'mail_host' => setting('mail.host', config('mail.mailers.smtp.host', '')),
                'mail_port' => setting('mail.port', config('mail.mailers.smtp.port', '587')),
                'mail_username' => setting('mail.username', config('mail.mailers.smtp.username', '')),
                'mail_password' => setting('mail.password', ''), // Never expose password
                'mail_encryption' => setting('mail.encryption', config('mail.mailers.smtp.encryption', 'tls')),
                'mail_from_address' => setting('mail.from.address', config('mail.from.address', '')),
                'mail_from_name' => setting('mail.from.name', config('mail.from.name', 'MC-CMS')),
            ],
        ]);
    }

    /**
     * Update the application mail settings.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateMail(Request $request)
    {
        $settings = [
            ...$this->validate($request, [
                'from-address' => ['required', 'string', 'email'],
                'mailer' => ['nullable', Rule::in(array_keys($this->mailMailers))],
                'smtp-host' => ['required_if:driver,smtp', 'nullable', 'string'],
                'smtp-port' => ['required_if:driver,smtp', 'nullable', 'integer', 'between:1,65535'],
                'smtp-scheme' => ['nullable', 'in:smtp,smtps'],
                'smtp-username' => ['nullable', 'string'],
                'smtp-password' => ['nullable', 'string'],
            ]),
            'users_email_verification' => $request->filled('users_email_verification'),
        ];

        if ($settings['mailer'] === null) {
            $settings['mailer'] = 'array';
            $settings['users_email_verification'] = false;
        }

        if (Arr::get($settings, 'smtp-password') === null) {
            unset($settings['smtp-password']);
        }

        $settings = Arr::prependKeysWith($settings, 'mail.');

        $settings = Arr::mapWithKeys($settings, fn (mixed $value, string $key) => [
            str_replace('-', '.', $key) => $value,
        ]);

        $old = Setting::updateSettings($settings);

        ActionLog::log('settings.updated')?->createEntries($old, $settings);

        return to_route('admin.settings.mail')
            ->with('success', trans('admin.settings.updated'));
    }

    public function sendTestMail(Request $request)
    {
        if ($request->user()->email === null) {
            return response()->json([
                'message' => trans('admin.settings.mail.missing', [
                    'user' => $request->user()->name,
                ]),
            ], 400);
        }

        try {
            $request->user()->notify(new TestMail());
        } catch (Exception $e) {
            return response()->json([
                'message' => trans('messages.status.error', [
                    'error' => $e->getMessage(),
                ]),
            ], 500);
        }

        return response()->json(['message' => trans('admin.settings.mail.sent')]);
    }

    /**
     * Show the application maintenance settings.
     */
    public function maintenance()
    {
        return Inertia::render('Admin/Settings/Maintenance', [
            'status' => setting('maintenance.enabled', false),
            'title' => setting('maintenance.title'),
            'subtitle' => setting('maintenance.subtitle'),
            'paths' => setting('maintenance.paths'),
        ]);
    }

    /**
     * Update the application maintenance settings.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateMaintenance(Request $request)
    {
        // DUMP DEBUG - Affiche les données reçues
        dump('=== MAINTENANCE UPDATE DEBUG ===');
        dump('All request:', $request->all());
        dump('maintenance_status:', $request->input('maintenance_status'), 'Type:', gettype($request->input('maintenance_status')));

        $this->validate($request, [
            'maintenance_title' => ['nullable', 'string', 'max:100'],
            'maintenance_subtitle' => ['nullable', 'string', 'max:500'],
        ]);

        // Handle boolean from frontend
        $rawValue = $request->input('maintenance_status', false);
        $enabled = filter_var($rawValue, FILTER_VALIDATE_BOOLEAN);

        dump('Raw value:', $rawValue, 'Enabled:', $enabled, 'Type:', gettype($enabled));

        $paths = $request->filled('is_global')
            ? null
            : array_filter($request->input('paths', []));

        dump('Paths:', $paths);

        Setting::updateSettings([
            'maintenance.enabled' => $enabled,
            'maintenance.title' => $request->input('maintenance_title'),
            'maintenance.subtitle' => $request->input('maintenance_subtitle'),
            'maintenance.paths' => empty($paths) ? null : $paths,
        ]);

        // Verify what was saved
        $saved = \MCCMS\Models\Setting::where('name', 'maintenance.enabled')->first();
        dump('Saved in DB:', $saved?->value, 'Type:', gettype($saved?->value));
        dump('=== END DEBUG ===');

        return to_route('admin.settings.maintenance')
            ->with('success', trans('admin.settings.updated'));
    }

    protected function getAvailableLocales()
    {
        return $this->getAvailableLocaleCodes()->mapWithKeys(fn (string $code) => [
            $code => match($code) {
                'fr' => 'Français',
                'en' => 'English',
                'es' => 'Español',
                'de' => 'Deutsch',
                'it' => 'Italiano',
                'pt' => 'Português',
                'ru' => 'Русский',
                'zh' => '中文',
                'ja' => '日本語',
                'ko' => '한국어',
                'ar' => 'العربية',
                default => ucfirst($code),
            },
        ]);
    }

    protected function getAvailableLocaleCodes()
    {
        return collect(File::directories($this->app->langPath()))
            ->map(fn (string $path) => basename($path));
    }

    protected function isHashSupported(string $algo)
    {
        if ($algo === 'bcrypt') {
            return true;
        }

        try {
            $hashManager = $this->app->make(HashManager::class);

            return $hashManager->driver($algo)->make('hello') !== null;
        } catch (Exception) {
            return false;
        }
    }

    /**
     * Update the .env file with new values.
     */
    protected function updateEnv(array $data): void
    {
        $envFile = base_path('.env');

        if (! file_exists($envFile)) {
            return;
        }

        $envContent = file_get_contents($envFile);

        foreach ($data as $key => $value) {
            // Convert boolean to string
            if (is_bool($value)) {
                $value = $value ? 'true' : 'false';
            }

            // Escape the value if it contains spaces or special characters
            if (preg_match('/\s/', $value)) {
                $value = '"'.$value.'"';
            }

            // Check if key exists
            $pattern = '/^'.$key.'=.*/m';

            if (preg_match($pattern, $envContent)) {
                // Replace existing value
                $envContent = preg_replace($pattern, $key.'='.$value, $envContent);
            } else {
                // Add new key at the end
                $envContent .= "\n".$key.'='.$value;
            }
        }

        file_put_contents($envFile, $envContent);
    }
}
