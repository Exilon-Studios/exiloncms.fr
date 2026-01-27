<?php

namespace ExilonCMS\Http\Controllers;

use Exception;
use ExilonCMS\Games\FiveMGame;
use ExilonCMS\Games\HytaleGame;
use ExilonCMS\Games\Minecraft\MinecraftBedrockGame;
use ExilonCMS\Games\Minecraft\MinecraftOnlineGame;
use ExilonCMS\Games\Steam\SteamGame;
use ExilonCMS\Models\Role;
use ExilonCMS\Models\Setting;
use ExilonCMS\Models\User;
use ExilonCMS\Support\EnvEditor;
use Illuminate\Encryption\Encrypter;
use Illuminate\Http\Client\HttpClientException;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class InstallController extends Controller
{
    public const TEMP_KEY = 'base64:hmU1T3OuvHdi5t1wULI8Xp7geI+JIWGog9pBCNxslY8=';

    public const MIN_PHP_VERSION = '8.2';

    public const REQUIRED_EXTENSIONS = [
        'bcmath', 'ctype', 'json', 'mbstring', 'openssl', 'PDO', 'tokenizer',
        'xml', 'xmlwriter', 'curl', 'fileinfo', 'zip',
    ];

    protected array $databaseDrivers = [
        'mysql' => 'MySQL/MariaDB',
        'pgsql' => 'PostgreSQL',
        'sqlite' => 'SQLite',
        'sqlsrv' => 'SQLServer',
    ];

    // TODO dynamic games
    protected array $steamGames = [
        '7dtd', 'gmod', 'ark', 'rust', 'fivem', 'csgo', 'tf2', 'unturned',
    ];

    protected array $games = [
        'minecraft' => [
            'name' => 'Minecraft',
            'logo' => 'assets/img/games/minecraft.svg',
        ],
        'mc-bedrock' => [
            'name' => 'Minecraft: Bedrock Edition',
            'logo' => 'assets/img/games/minecraft.svg',
        ],
        'hytale' => [
            'name' => 'Hytale (Early Access)',
            'logo' => 'assets/img/games/hytale.png',
        ],
        'gmod' => [
            'name' => 'Garry\'s mod',
            'logo' => 'assets/img/games/gmod.svg',
        ],
        'ark' => [
            'name' => 'ARK: Survival Evolved',
            'logo' => 'assets/img/games/ark.svg',
        ],
        'csgo' => [
            'name' => 'Counter-Strike 2',
            'logo' => 'assets/img/games/cs2.svg',
        ],
        'tf2' => [
            'name' => 'Team Fortress 2',
            'logo' => 'assets/img/games/tf2.svg',
        ],
        'rust' => [
            'name' => 'Rust',
            'logo' => 'assets/img/games/rust.svg',
        ],
        'fivem' => [
            'name' => 'FiveM',
            'logo' => 'assets/img/games/fivem.svg',
        ],
        'unturned' => [
            'name' => 'Unturned',
            'logo' => 'assets/img/games/unturned.svg',
        ],
        '7dtd' => [
            'name' => '7 Days to Die',
            'logo' => 'assets/img/games/7dtd.svg',
        ],
        'custom' => [
            'name' => 'Custom Game',
            'logo' => 'assets/img/exiloncms.png',
        ],
    ];

    protected bool $hasRequirements;

    protected array $requirements;

    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->requirements = static::getRequirements();
        $this->hasRequirements = ! in_array(false, $this->requirements, true);

        // Middleware pour les anciennes routes Blade (avec sélection de jeu)
        $this->middleware(function (Request $request, callable $next) {
            if (! $this->hasRequirements || config('app.key') !== self::TEMP_KEY) {
                return to_route('home');
            }

            return $next($request);
        })->only([
            'showDatabase',
            'database',
            'showGames',
            'showGame',
            'setupGame',
            'finishInstall',
        ]);

        // Middleware pour les nouvelles routes Web (Inertia/React)
        // Permet l'accès si le CMS n'est pas installé
        // Note: createAdminWeb is excluded because it creates the installation marker
        $this->middleware(function (Request $request, callable $next) {
            // Permettre l'accès si le CMS n'est pas encore installé
            if (is_installed()) {
                return redirect('/');
            }

            return $next($request);
        })->only([
            'index',
            'showWelcomeWeb',
            'showRequirementsWeb',
            'checkRequirementsWeb',
            'showDatabaseWeb',
            'configureDatabaseWeb',
            'showAdminWeb',
            'showCompleteWeb',
        ]);

        $this->middleware(function (Request $request, callable $next) {
            return file_exists(App::environmentFilePath())
                ? $next($request)
                : to_route('install.database');
        })->only(['showGame', 'showGames', 'setupGame']);
    }

    public function showDatabase()
    {
        return view('install.database', [
            'databaseDrivers' => $this->databaseDrivers,
        ]);
    }

    public function database(Request $request)
    {
        $this->validate($request, [
            'type' => ['required', Rule::in(array_keys($this->databaseDrivers))],
            'host' => ['required_unless:type,sqlite'],
            'port' => ['nullable', 'integer', 'between:1,65535'],
            'database' => ['required_unless:type,sqlite'],
            'user' => ['required_unless:type,sqlite'],
            'password' => ['nullable'],
        ]);

        $envPath = App::environmentFilePath();
        $databaseType = $request->input('type');

        try {
            if ($databaseType === 'sqlite') {
                touch(database_path('database.sqlite'));

                DB::connection('sqlite')->getPdo(); // Ensure connection

                File::copy(base_path('.env.example'), $envPath);

                EnvEditor::updateEnv([
                    'APP_ENV' => 'production',
                    'APP_DEBUG' => 'false',
                    'DB_CONNECTION' => $databaseType,
                ]);

                return to_route('install.games');
            }

            $host = $request->input('host');
            $port = $request->input('port');
            $database = $request->input('database');
            $user = $request->input('user');
            $password = $request->input('password');

            Config::set('database.connections.test', [
                'driver' => $databaseType,
                'host' => $host,
                'port' => $port,
                'database' => $database,
                'username' => $user,
                'password' => $password,
            ]);

            DB::connection('test')->getPdo(); // Ensure connection

            copy(base_path('.env.example'), $envPath);

            EnvEditor::updateEnv([
                'APP_ENV' => 'production',
                'APP_DEBUG' => 'false',
                'DB_CONNECTION' => $databaseType,
                'DB_HOST' => $host,
                'DB_PORT' => $port,
                'DB_DATABASE' => $database,
                'DB_USERNAME' => $user,
                'DB_PASSWORD' => $password,
            ]);

            return to_route('install.games');
        } catch (Throwable $t) {
            return redirect()->back()->withInput()->with('error', trans('messages.status.error', [
                'error' => mb_convert_encoding($t->getMessage(), 'UTF-8'),
            ]));
        }
    }

    public function showGames()
    {
        return view('install.games', [
            'games' => Arr::except($this->games, 'custom'),
        ]);
    }

    public function showGame(string $game)
    {
        abort_if(! array_key_exists($game, $this->games), 404);

        if ($game === 'minecraft') {
            return view('install.games.minecraft', [
                'game' => $game,
                'gameName' => 'Minecraft',
                'locales' => self::getAvailableLocales(),
            ]);
        }

        if ($game === 'mc-bedrock' || $game === 'hytale') {
            return view('install.games.minecraft', [
                'game' => $game,
                'gameName' => $this->games[$game]['name'],
                'locales' => self::getAvailableLocales(),
            ]);
        }

        if ($game === 'fivem-cfx') {
            return view('install.games.fivem', [
                'gameName' => 'Five',
                'locales' => self::getAvailableLocales(),
            ]);
        }

        if (in_array($game, $this->steamGames, true)) {
            return view('install.games.steam', [
                'game' => $game,
                'gameName' => $this->games[$game]['name'],
                'locales' => self::getAvailableLocales(),
            ]);
        }

        return view('install.games.other', [
            'game' => $game,
            'gameName' => $this->games[$game]['name'],
            'locales' => self::getAvailableLocales(),
        ]);
    }

    public function setupGame(Request $request, string $game)
    {
        try {
            if (in_array($game, $this->steamGames, true)) {
                return $this->setupSteamGame($request, $game);
            }

            if ($game === 'minecraft' || $game === 'mc-bedrock' || $game === 'hytale') {
                return $this->setupMinecraftOrHytale($request, $game);
            }

            if ($game === 'fivem-cfx') {
                return $this->setupFiveM($request);
            }

            return $this->setupMCCMS($request, $game, null, null);
        } catch (ValidationException $e) {
            throw $e;
        } catch (Exception $e) {
            return redirect()->back()->withInput()->with('error', trans('messages.status.error', [
                'error' => mb_convert_encoding($e->getMessage(), 'UTF-8'),
            ]));
        }
    }

    /**
     * Install ExilonCMS for a Steam-based game.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function setupSteamGame(Request $request, string $game)
    {
        $this->validate($request, [
            'key' => 'required',
            'url' => 'required',
            'locale' => [Rule::in(static::getAvailableLocaleCodes())],
        ]);

        $profile = Http::get($request->input('url').'?xml=1')->body();

        if (! Str::contains($profile, '<steamID64>')) {
            throw ValidationException::withMessages(['url' => 'Invalid Steam profile URL.']);
        }

        preg_match('/<steamID64>(\d{17})<\/steamID64>/', $profile, $matches);

        $gameId = $matches[1];
        $steamKey = $request->input('key');

        try {
            $name = Http::get(SteamGame::USER_INFO_URL, [
                'key' => $steamKey,
                'steamids' => $gameId,
            ])->throw()->json('response.players.0.personaname');

            if ($name === null) {
                throw new RuntimeException('Invalid Steam URL.');
            }

            return $this->setupMCCMS($request, $game, $name, $gameId, [
                'STEAM_KEY' => $request->input('key'),
            ]);
        } catch (HttpClientException) {
            throw ValidationException::withMessages(['key' => 'Invalid Steam API key.']);
        }
    }

    /**
     * Install ExilonCMS for Minecraft (with register or Microsoft OAuth) or Hytale.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function setupMinecraftOrHytale(Request $request, string $game)
    {
        if ($game !== 'mc-bedrock' && $game !== 'hytale') {
            $game = $request->input('oauth') ? 'mc-online' : 'mc-offline';
        }

        $this->validate($request, [
            'name' => ['required_if:oauth,0', 'nullable', 'max:25'],
            'email' => ['required_if:oauth,0', 'nullable', 'email', 'max:50'], // TODO ensure unique
            'password' => ['required_if:oauth,0', 'nullable', 'confirmed', Password::default()],
            'locale' => [Rule::in(static::getAvailableLocaleCodes())],
        ]);

        $name = $request->input('name');
        $gameId = null;

        if ($game === 'mc-online') {
            $gameId = Str::remove('-', $request->input('uuid', ''));
            $response = Http::get(MinecraftOnlineGame::PROFILE_LOOKUP.$gameId);

            if (! $response->successful() || ! ($name = $response->json('name'))) {
                throw ValidationException::withMessages(['uuid' => 'Invalid Minecraft UUID or couldn\'t contact Mojang\'s session server.']);
            }
        } elseif ($game === 'mc-bedrock') {
            $gameId = $request->input('xuid');
            $name = Http::get(MinecraftBedrockGame::PROFILE_LOOKUP.$gameId)
                ->json('gamertag');

            if ($name === null) {
                throw ValidationException::withMessages(['xuid' => 'Invalid Xbox XUID.']);
            }
        } elseif ($game === 'hytale') {
            $response = Http::get(HytaleGame::PLAYER_LOOKUP.$request->input('name'));

            if (! $response->successful() || ! ($gameId = $response->json('data.player.id'))) {
                throw ValidationException::withMessages(['name' => 'You must enter a valid Hytale username.']);
            }
        }

        return $this->setupMCCMS($request, $game, $name, $gameId ?? null);
    }

    protected function setupEpicGame(Request $request, string $game)
    {
        $this->validate($request, [
            'client_id' => 'required',
            'client_secret' => 'required',
            'id' => 'required',
            'locale' => [Rule::in(static::getAvailableLocaleCodes())],
        ]);

        $id = $request->input('id');

        try {
            Http::asForm()
                ->withBasicAuth($request->input('client_id'), $request->input('client_secret'))
                ->post('https://api.epicgames.dev/epic/oauth/v2/token', [
                    'grant_type' => 'client_credentials',
                ])->throw();

            return $this->setupMCCMS($request, $game, $id, $id, [
                'EPIC_CLIENT_ID' => $request->input('client_id'),
                'EPIC_CLIENT_SECRET' => $request->input('client_secret'),
            ]);
        } catch (HttpClientException) {
            $message = 'Invalid Epic Games credentials.';
            throw ValidationException::withMessages([
                'client_id' => $message,
                'client_secret' => $message,
            ]);
        }
    }

    protected function setupFiveM(Request $request)
    {
        $this->validate($request, [
            'name' => 'required',
            'locale' => [Rule::in(static::getAvailableLocaleCodes())],
        ]);

        $name = $request->input('name');

        try {
            $id = (new FiveMGame)->getUserUniqueId($name);

            return $this->setupMCCMS($request, 'fivem-cfx', $name, $id);
        } catch (HttpClientException) {
            throw ValidationException::withMessages(['name' => 'Invalid Cfx.re username.']);
        }
    }

    protected function setupMCCMS(Request $request, string $game, ?string $name, ?string $gameId, array $env = [])
    {
        Artisan::call('cache:clear');
        Artisan::call('migrate', ['--force' => true, '--seed' => true]);
        Artisan::call('storage:link', ! windows_os() ? ['--relative' => true] : []);

        EnvEditor::updateEnv([
            ...$env,
            'APP_LOCALE' => $request->input('locale'),
            'APP_URL' => url('/'),
            'MAIL_MAILER' => 'array',
            'EXILONCMS_GAME' => $game,
        ]);

        if ($game === 'custom') {
            return to_route('install.finish');
        }

        // Note: Community games (plugins) system has been removed
        // Only built-in games are supported

        abort_if($name === null, 400, 'Expected valid name for game '.$game);

        $roleId = Role::admin()->orderByDesc('power')->value('id');
        $user = User::create([
            'name' => $name,
            'email' => $request->input('email'),
            'password' => $request->input('password') ?? Str::random(32),
            'password_changed_at' => now(),
            'role_id' => $roleId,
            'game_id' => $gameId,
        ]);

        $user->markEmailAsVerified();

        if ($game !== 'mc-offline' && $game !== 'hytale') {
            Setting::updateSettings('register', false);
        }

        if ($game === 'fivem-cfx') {
            FiveMGame::generateKeys();
        }

        return to_route('install.finish');
    }

    public function finishInstall()
    {
        EnvEditor::updateEnv([
            'APP_KEY' => 'base64:'.base64_encode(Encrypter::generateKey(config('app.cipher'))),
        ]);

        return view('install.success');
    }

    public static function getRequirements(): array
    {
        $requirements = [
            'php' => version_compare(PHP_VERSION, static::MIN_PHP_VERSION, '>='),
            'writable' => is_writable(base_path()),
            'function-symlink' => static::hasFunctionEnabled('symlink'),
            'rewrite' => ! defined('MCCMS_NO_URL_REWRITE'),
            '64bit' => PHP_INT_SIZE !== 4,
        ];

        foreach (static::REQUIRED_EXTENSIONS as $extension) {
            $requirements['extension-'.$extension] = extension_loaded($extension);
        }

        return $requirements;
    }

    private static function hasFunctionEnabled(string $function): bool
    {
        if (! function_exists($function)) {
            return false;
        }

        try {
            return ! Str::contains(ini_get('disable_functions'), $function);
        } catch (Exception) {
            return false;
        }
    }

    public static function parsePhpVersion(): string
    {
        preg_match('/^(\d+)\.(\d+)/', PHP_VERSION, $matches);

        if (count($matches) > 2) {
            return "{$matches[1]}.{$matches[2]}";
        }

        return PHP_VERSION;
    }

    public static function getAvailableLocales(): Collection
    {
        return static::getAvailableLocaleCodes()->mapWithKeys(fn (string $file) => [
            $file => trans('messages.lang', [], $file),
        ]);
    }

    public static function getAvailableLocaleCodes(): Collection
    {
        return collect(File::directories(app()->langPath()))
            ->map(fn (string $path) => basename($path));
    }

    /**
     * Show simple installation page (one-step installer).
     */
    public function index(): Response
    {
        return Inertia::render('Install/Index', [
            'phpVersion' => PHP_VERSION,
            'minPhpVersion' => static::MIN_PHP_VERSION,
        ]);
    }

    /**
     * Post-installation redirect handler.
     * This route is called after installation completes and handles the redirect to home.
     * It bypasses the installation check middleware.
     */
    public function installed(Request $request): \Symfony\Component\HttpFoundation\Response
    {
        // Check if user is authenticated
        if (Auth::check()) {
            return \Inertia\Inertia::location(url('/'));
        }

        // Try to authenticate with the session
        $userId = session()->get('install_user_id');
        if ($userId) {
            $user = User::find($userId);
            if ($user) {
                Auth::login($user);
                session()->forget('install_user_id');

                return \Inertia\Inertia::location(url('/'));
            }
        }

        // Just redirect to home using Inertia location
        return \Inertia\Inertia::location(url('/'));
    }

    /**
     * Process installation in one step.
     */
    public function install(Request $request)
    {
        $validated = $this->validate($request, [
            'app_url' => ['required', 'url'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        try {
            // Create SQLite database
            $dbPath = database_path('database.sqlite');
            if (! file_exists($dbPath)) {
                touch($dbPath);
            }

            // Run migrations WITHOUT seed to avoid duplicate admin user
            Artisan::call('migrate:fresh', [
                '--force' => true,
            ]);

            // Create admin role manually (from AdminUserSeeder)
            $adminRole = Role::firstOrCreate(
                ['is_admin' => true],
                [
                    'name' => 'Admin',
                    'power' => 100,
                ]
            );

            // Create or update admin user (in case of reinstall)
            $user = User::updateOrCreate(
                ['email' => $validated['email']], // Find by email
                [
                    'name' => $validated['name'],
                    'password' => Hash::make($validated['password']),
                    'role_id' => $adminRole->id,
                    'email_verified_at' => now(),
                    'password_changed_at' => now(),
                ]
            );

            // Run additional seeders (company, landing) but NOT AdminUserSeeder
            $seeders = [
                \Database\Seeders\CompanySettingsSeeder::class,
                \Database\Seeders\LandingSettingsSeeder::class,
            ];

            foreach ($seeders as $seeder) {
                if (class_exists($seeder)) {
                    Artisan::call('db:seed', ['--class' => $seeder, '--force' => true]);
                }
            }

            // Create storage link
            if (! file_exists(public_path('storage'))) {
                Artisan::call('storage:link', ! windows_os() ? ['--relative' => true] : []);
            }

            // Update .env with real APP_KEY and APP_URL
            $this->updateEnvironmentFile([
                'APP_KEY' => 'base64:'.base64_encode(Encrypter::generateKey(config('app.cipher'))),
                'APP_URL' => $validated['app_url'],
            ]);

            // Clear cache
            Artisan::call('cache:clear');
            Artisan::call('config:clear');
            Artisan::call('view:clear');

            // Save user ID to session for auth persistence
            session()->put('install_user_id', $user->id);
            session()->save();

            // Create installation marker LAST (before any redirects)
            $this->createInstallationMarker();

            // Log the user in
            Auth::login($user, remember: true);

            // Save session again after login
            session()->save();

            // Redirect to the installed route which handles the final redirect
            // This bypasses the installation check middleware
            return redirect()->route('install.installed');
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (Throwable $e) {
            // Log the actual error for debugging
            \Log::error('Installation error', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw ValidationException::withMessages([
                'name' => 'Installation error: '.$e->getMessage(),
            ]);
        }
    }

    // ============================================================
    // WEB INSTALLER (Inertia/React)
    // ============================================================

    /**
     * Show welcome page for web installer.
     */
    public function showWelcomeWeb(): Response
    {
        return Inertia::render('Install/Welcome');
    }

    /**
     * Show requirements check page.
     */
    public function showRequirementsWeb(): Response
    {
        return Inertia::render('Install/Requirements', [
            'requirements' => $this->getWebRequirements(),
        ]);
    }

    /**
     * Check system requirements via AJAX.
     */
    public function checkRequirementsWeb(): Response
    {
        return Inertia::render('Install/Requirements', [
            'requirements' => $this->getWebRequirements(),
        ]);
    }

    /**
     * Show database configuration page.
     */
    public function showDatabaseWeb(): Response
    {
        return Inertia::render('Install/Database');
    }

    /**
     * Save database configuration and test connection.
     */
    public function configureDatabaseWeb(Request $request)
    {
        $validated = $this->validate($request, [
            'connection' => ['required', 'in:sqlite,mysql,pgsql'],
            'host' => ['required_if:connection,mysql,pgsql', 'nullable', 'string'],
            'port' => ['nullable', 'integer', 'between:1,65535'],
            'database' => ['required_if:connection,mysql,pgsql', 'nullable', 'string'],
            'username' => ['required_if:connection,mysql,pgsql', 'nullable', 'string'],
            'password' => ['nullable', 'string'],
        ]);

        try {
            if ($validated['connection'] === 'sqlite') {
                // Create SQLite database
                $dbPath = database_path('database.sqlite');
                if (! file_exists($dbPath)) {
                    touch($dbPath);
                }

                // Test connection
                DB::connection('sqlite')->getPdo();

                // Update .env
                $this->updateEnvironmentFile([
                    'DB_CONNECTION' => 'sqlite',
                    'DB_DATABASE' => database_path('database.sqlite'),
                ]);
            } else {
                // Test MySQL/PostgreSQL connection
                Config::set('database.connections.install_test', [
                    'driver' => $validated['connection'],
                    'host' => $validated['host'] ?? 'localhost',
                    'port' => $validated['port'] ?? ($validated['connection'] === 'mysql' ? 3306 : 5432),
                    'database' => $validated['database'],
                    'username' => $validated['username'],
                    'password' => $validated['password'],
                ]);

                DB::connection('install_test')->getPdo();

                // Update .env
                $this->updateEnvironmentFile([
                    'DB_CONNECTION' => $validated['connection'],
                    'DB_HOST' => $validated['host'] ?? 'localhost',
                    'DB_PORT' => $validated['port'] ?? ($validated['connection'] === 'mysql' ? 3306 : 5432),
                    'DB_DATABASE' => $validated['database'],
                    'DB_USERNAME' => $validated['username'],
                    'DB_PASSWORD' => $validated['password'] ?? '',
                ]);
            }

            return redirect()->route('install.mode');
        } catch (Throwable $e) {
            throw ValidationException::withMessages([
                'connection' => 'Impossible de se connecter à la base de données: '.$e->getMessage(),
            ]);
        }
    }

    /**
     * Show installation mode selection page.
     */
    public function showModeWeb(): Response
    {
        return Inertia::render('Install/Mode');
    }

    /**
     * Save installation mode selection.
     */
    public function saveModeWeb(Request $request)
    {
        $validated = $this->validate($request, [
            'mode' => ['required', 'in:production,demo'],
        ]);

        // Store mode in session for later steps
        session()->put('install_mode', $validated['mode']);
        session()->save();

        return redirect()->route('install.admin');
    }

    /**
     * Show admin user creation page.
     */
    public function showAdminWeb(): Response
    {
        return Inertia::render('Install/Admin', [
            'phpVersion' => PHP_VERSION,
            'minPhpVersion' => static::MIN_PHP_VERSION,
        ]);
    }

    /**
     * Create admin user and complete installation.
     */
    public function createAdminWeb(Request $request)
    {
        // First, run migrations BEFORE validation (database tables don't exist yet)
        try {
            Artisan::call('migrate:fresh', [
                '--force' => true,
                '--seed' => true,
            ]);
        } catch (Throwable $e) {
            \Log::error('Migration error during installation', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw ValidationException::withMessages([
                'name' => 'Erreur lors des migrations: '.$e->getMessage(),
            ]);
        }

        // Now validate (without unique rule since DB is fresh)
        $validated = $this->validate($request, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        try {

            // Create storage link
            if (! file_exists(public_path('storage'))) {
                Artisan::call('storage:link', ! windows_os() ? ['--relative' => true] : []);
            }

            // Save installation mode to database
            $installMode = session('install_mode', 'production');
            \ExilonCMS\Models\Setting::updateOrCreate(
                ['key' => 'install_mode'],
                [
                    'name' => 'Installation Mode',
                    'value' => $installMode,
                    'type' => 'text',
                    'group' => 'system',
                ]
            );

            // If demo mode, disable registration and create demo users
            if ($installMode === 'demo') {
                \ExilonCMS\Models\Setting::updateOrCreate(
                    ['key' => 'registration_enabled'],
                    [
                        'name' => 'Allow Registration',
                        'value' => '0',
                        'type' => 'boolean',
                        'group' => 'auth',
                    ]
                );

                // Create demo admin user (for quick login)
                $demoAdminRole = \ExilonCMS\Models\Role::where('is_admin', true)->first();
                \ExilonCMS\Models\User::updateOrCreate(
                    ['email' => 'admin@demo.local'],
                    [
                        'name' => 'Demo Admin',
                        'password' => Hash::make('demo123'),
                        'role_id' => $demoAdminRole->id,
                        'email_verified_at' => now(),
                        'password_changed_at' => now(),
                    ]
                );

                // Create demo player user (for quick login)
                $playerRole = \ExilonCMS\Models\Role::where('is_admin', false)->first();
                if ($playerRole) {
                    \ExilonCMS\Models\User::updateOrCreate(
                        ['email' => 'player@demo.local'],
                        [
                            'name' => 'Demo Player',
                            'password' => Hash::make('demo123'),
                            'role_id' => $playerRole->id,
                            'email_verified_at' => now(),
                            'password_changed_at' => now(),
                        ]
                    );
                }
            }

            // Get admin role
            $adminRole = Role::where('is_admin', true)->firstOrFail();

            // Create or update admin user (update if exists from seeder)
            $user = User::updateOrCreate(
                ['email' => $validated['email']], // Find by email
                [
                    'name' => $validated['name'],
                    'password' => Hash::make($validated['password']),
                    'role_id' => $adminRole->id,
                    'email_verified_at' => now(),
                    'password_changed_at' => now(),
                ]
            );

            // Generate APP_KEY
            $this->updateEnvironmentFile([
                'APP_KEY' => 'base64:'.base64_encode(Encrypter::generateKey(config('app.cipher'))),
                'APP_URL' => url('/'),
            ]);

            // Clear cache
            Artisan::call('cache:clear');
            Artisan::call('config:clear');
            Artisan::call('view:clear');

            // Create installation marker FIRST (before session/redirect)
            $this->createInstallationMarker();

            // Clear all caches to ensure is_installed() returns true
            Artisan::call('cache:clear');

            // Save user ID to session for auth persistence
            session()->put('install_user_id', $user->id);
            session()->save();

            // Log the user in
            Auth::login($user, remember: true);

            // Save session again after login
            session()->save();

            // Return Inertia redirect to home
            return redirect('/');
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (Throwable $e) {
            // Log the actual error for debugging
            \Log::error('Installation error (createAdminWeb)', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw ValidationException::withMessages([
                'name' => 'Erreur lors de l\'installation: '.$e->getMessage(),
            ]);
        }
    }

    /**
     * Show installation complete page.
     */
    public function showCompleteWeb(): Response
    {
        // Clean up installer files after successful installation
        $this->cleanupInstallerFiles();

        return Inertia::render('Install/Complete');
    }

    /**
     * Remove standalone installer files after CMS installation.
     * Only removes files that belong to the standalone installer.
     */
    protected function cleanupInstallerFiles(): void
    {
        $basePath = base_path();

        // Check if index.php is the installer (not the CMS)
        $indexPath = $basePath.'/index.php';
        if (file_exists($indexPath)) {
            $content = file_get_contents($indexPath);
            // Check for installer-specific marker
            if (str_contains($content, 'ExilonCMS installer') || str_contains($content, 'installerVersion')) {
                // This is the standalone installer, safe to remove
                @unlink($indexPath);

                // Remove other installer files
                $installerFiles = [
                    $basePath.'/.htaccess',
                    $basePath.'/README.md',
                    $basePath.'/public/index.php',
                    $basePath.'/public/.htaccess',
                ];

                foreach ($installerFiles as $file) {
                    if (file_exists($file)) {
                        @unlink($file);
                    }
                }

                // Try to remove public directory if empty
                @rmdir($basePath.'/public');
            }
        }
    }

    /**
     * Get requirements formatted for web installer.
     *
     * @return array<int, array{name: string, status: 'success'|'error', message?: string}>
     */
    protected function getWebRequirements(): array
    {
        $requirements = [];

        // PHP Version
        $requirements[] = [
            'name' => 'PHP '.static::MIN_PHP_VERSION.' ou supérieur',
            'status' => version_compare(PHP_VERSION, static::MIN_PHP_VERSION, '>=')
                ? 'success'
                : 'error',
            'message' => 'Installé: '.PHP_VERSION,
        ];

        // Required extensions
        foreach (static::REQUIRED_EXTENSIONS as $extension) {
            $loaded = extension_loaded($extension);
            $requirements[] = [
                'name' => 'Extension PHP: '.$extension,
                'status' => $loaded ? 'success' : 'error',
                'message' => $loaded ? 'Activée' : 'Manquante',
            ];
        }

        // Writable directories
        $writableDirs = [
            'storage',
            'bootstrap/cache',
        ];

        foreach ($writableDirs as $dir) {
            $path = base_path($dir);
            $writable = is_writable($path);
            $requirements[] = [
                'name' => 'Dossier writable: '.$dir,
                'status' => $writable ? 'success' : 'error',
                'message' => $writable ? 'Writable' : 'Non writable',
            ];
        }

        return $requirements;
    }

    /**
     * Update environment file with given values.
     */
    protected function updateEnvironmentFile(array $values): void
    {
        $envPath = App::environmentFilePath();

        if (! file_exists($envPath)) {
            copy(base_path('.env.example'), $envPath);
        }

        // Read current env content
        $envContent = file_get_contents($envPath);
        $lines = explode("\n", $envContent);
        $updatedKeys = [];

        // Update or add each key
        foreach ($values as $key => $value) {
            $found = false;
            $value = addslashes($value);

            for ($i = 0; $i < count($lines); $i++) {
                // Check if this line contains the key (not commented)
                if (preg_match('/^'.preg_quote($key).'=/', $lines[$i])) {
                    $lines[$i] = $key.'='.$value;
                    $found = true;
                    $updatedKeys[] = $key;
                    break;
                }
            }

            // If key not found, add it at the end
            if (! $found) {
                $lines[] = $key.'='.$value;
            }
        }

        // Write back
        file_put_contents($envPath, implode("\n", $lines));
    }

    /**
     * Create installation marker - MOST IMPORTANT: Database method
     */
    protected function createInstallationMarker(): void
    {
        $timestamp = now()->toIso8601String();
        $version = $this->getAppVersion();

        // ===== PRIMARY METHOD: Database (most reliable) =====
        try {
            // Direct DB insert - table uses 'name' column NOT 'key' !!
            DB::table('settings')->updateOrInsert(
                ['name' => 'installed_at'],
                ['value' => $timestamp, 'updated_at' => now()]
            );
            DB::table('settings')->updateOrInsert(
                ['name' => 'installed_version'],
                ['value' => $version, 'updated_at' => now()]
            );
        } catch (\Exception $e) {
            // Log error but continue
        }

        // ===== FALLBACK: Try multiple file locations =====
        $content = json_encode(['installed' => true, 'installed_at' => $timestamp, 'version' => $version]);

        // Try public directory (usually always writable)
        @file_put_contents(public_path('installed.json'), $content);

        // Try bootstrap/cache
        @file_put_contents(base_path('bootstrap/cache/installed'), $content);

        // Try storage
        @file_put_contents(storage_path('installed.json'), $content);

        // Try .env flag
        $envPath = base_path('.env');
        if (is_writable($envPath)) {
            @file_put_contents($envPath, "\nAPP_INSTALLED=true\n", FILE_APPEND);
        }
    }

    /**
     * Get application version from version.json or return default.
     */
    protected function getAppVersion(): string
    {
        $versionFile = base_path('version.json');

        if (file_exists($versionFile)) {
            $versionData = json_decode(file_get_contents($versionFile), true);

            return $versionData['version'] ?? '1.0.0';
        }

        return '1.0.0';
    }

    /**
     * Download and extract the latest CMS release from GitHub.
     * This is used by the installer to fetch the full CMS package.
     */
    public function downloadLatestRelease(Request $request)
    {
        $repo = config('installer.repo', 'Exilon-Studios/ExilonCMS');
        $downloadUrl = config('installer.download_url', 'https://github.com');

        try {
            // Get latest release info from GitHub API
            $response = \Http::withToken(env('GITHUB_TOKEN'))
                ->get("https://api.github.com/repos/{$repo}/releases/latest");

            if (! $response->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to fetch release info',
                ], 500);
            }

            $release = $response->json();
            $version = $release['tag_name'];
            $zipAsset = collect($release['assets'])->first(fn ($asset) => str_ends_with($asset['name'], '.zip'));

            if (! $zipAsset) {
                return response()->json([
                    'success' => false,
                    'message' => 'No zip asset found in release',
                ], 404);
            }

            $downloadUrl = $zipAsset['browser_download_url'];

            // Download the zip
            $tempPath = storage_path('app/exiloncms-temp.zip');
            $zipResponse = \Http::timeout(300)->get($downloadUrl);

            if (! $zipResponse->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to download CMS package',
                ], 500);
            }

            file_put_contents($tempPath, $zipResponse->body());

            // Extract the zip
            $extractPath = storage_path('app/extract');
            if (! is_dir($extractPath)) {
                mkdir($extractPath, 0755, true);
            }

            $zip = new \ZipArchive;
            if ($zip->open($tempPath) !== true) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to open zip archive',
                ], 500);
            }

            $zip->extractTo($extractPath);
            $zip->close();

            // Move files to project root
            $extractedDir = $extractPath.'/exiloncms-'.ltrim($version, 'v');
            if (! is_dir($extractedDir)) {
                // Try alternative directory name
                $dirs = glob($extractPath.'/*', GLOB_ONLYDIR);
                $extractedDir = $dirs[0] ?? null;
            }

            if ($extractedDir && is_dir($extractedDir)) {
                // Copy all files except vendor and node_modules
                $this->copyDirectory($extractedDir, base_path(), ['vendor', 'node_modules', '.git']);
            }

            // Clean up
            unlink($tempPath);
            $this->deleteDirectory($extractPath);

            return response()->json([
                'success' => true,
                'version' => $version,
                'message' => 'CMS downloaded and installed successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Copy directory recursively excluding certain paths.
     */
    protected function copyDirectory(string $source, string $destination, array $exclude = []): void
    {
        if (! is_dir($destination)) {
            mkdir($destination, 0755, true);
        }

        $dir = new \DirectoryIterator($source);

        foreach ($dir as $item) {
            if ($item->isDot()) {
                continue;
            }

            if ($item->isDir()) {
                $basename = $item->getBasename();

                if (in_array($basename, $exclude)) {
                    continue;
                }

                $this->copyDirectory($item->getPathname(), $destination.'/'.$basename, $exclude);
            } else {
                copy($item->getPathname(), $destination.'/'.$item->getBasename());
            }
        }
    }

    /**
     * Delete directory recursively.
     */
    protected function deleteDirectory(string $dir): void
    {
        if (! is_dir($dir)) {
            return;
        }

        $files = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($dir, \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::CHILD_FIRST
        );

        foreach ($files as $file) {
            if ($file->isDir()) {
                rmdir($file->getPathname());
            } else {
                unlink($file->getPathname());
            }
        }

        rmdir($dir);
    }
}
