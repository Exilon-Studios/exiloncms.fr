<?php

namespace ExilonCMS\Http\Controllers;

use ExilonCMS\Extensions\Plugin\PluginManager;
use ExilonCMS\Extensions\UpdateManager;
use ExilonCMS\Games\FiveMGame;
use ExilonCMS\Games\Minecraft\MinecraftBedrockGame;
use ExilonCMS\Games\Minecraft\MinecraftOnlineGame;
use ExilonCMS\Games\Steam\SteamGame;
use ExilonCMS\Models\Role;
use ExilonCMS\Models\Setting;
use ExilonCMS\Models\User;
use ExilonCMS\Support\EnvEditor;
use Exception;
use Illuminate\Encryption\Encrypter;
use Illuminate\Http\Client\HttpClientException;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Inertia;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Responses;
use RuntimeException;
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
        $this->middleware(function (Request $request, callable $next) {
            // Permettre l'accès si le CMS n'est pas encore installé
            if (is_installed()) {
                return to_route('home');
            }

            return $next($request);
        })->only([
            'showWelcomeWeb',
            'showRequirementsWeb',
            'checkRequirementsWeb',
            'showDatabaseWeb',
            'configureDatabaseWeb',
            'showAdminWeb',
            'createAdminWeb',
            'showCompleteWeb',
        ]);

        $this->middleware(function (Request $request, callable $next) {
            return file_exists(App::environmentFilePath())
                ? $next($request)
                : to_route('install.database');
        })->only(['showGame', 'showGames', 'setupGame']);

        $this->games = array_merge($this->games, $this->getCommunityGames());
    }

    /**
     * Returns games keyed with `extension_id` and not the resource id.
     */
    private function getCommunityGames()
    {
        $updateManager = app(UpdateManager::class);
        $games = $updateManager->getGames();

        return collect($games)->keyBy('extension_id')->all();
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

        if ($game === 'mc-bedrock') {
            return view('install.games.minecraft', [
                'game' => $game,
                'gameName' => 'Minecraft: Bedrock Edition',
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

            if ($game === 'minecraft' || $game === 'mc-bedrock') {
                return $this->setupMinecraftGame($request, $game);
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
     * Install ExilonCMS for Minecraft (with register or Microsoft OAuth).
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function setupMinecraftGame(Request $request, string $game)
    {
        if ($game !== 'mc-bedrock') {
            $game = $request->input('oauth') ? 'mc-online' : 'mc-offline';
        }

        $this->validate($request, [
            'name' => ['required_if:oauth,0', 'nullable', 'max:25'],
            'email' => ['required_if:oauth,0', 'nullable', 'email', 'max:50'], // TODO ensure unique
            'password' => ['required_if:oauth,0', 'nullable', 'confirmed', Password::default()],
            'locale' => [Rule::in(static::getAvailableLocaleCodes())],
        ]);

        $name = $request->input('name');

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
            $id = (new FiveMGame())->getUserUniqueId($name);

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

        $communityGames = $this->getCommunityGames();

        if (array_key_exists($game, $communityGames)) {
            $updateManager = app(UpdateManager::class);
            $pluginManager = app(PluginManager::class);

            $pluginDir = $pluginManager->path($game);

            try {
                $updateManager->download($communityGames[$game], 'plugins/');
                $updateManager->extract($communityGames[$game], $pluginDir, 'plugins/');
                $pluginManager->enable($game);

                $description = $pluginManager->findDescription($game);

                if ($description !== null && isset($description->installRedirectPath)) {
                    return redirect($description->installRedirectPath);
                }

                return $this->finishInstall();
            } catch (Throwable $t) {
                return to_route('install.games')->with('error', $t->getMessage());
            }
        }

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

        if ($game !== 'mc-offline') {
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

    // ============================================================
    // WEB INSTALLER (Inertia/React)
    // ============================================================

    /**
     * Show welcome page for web installer.
     */
    public function showWelcomeWeb(): Responses
    {
        return Inertia::render('Install/Welcome');
    }

    /**
     * Show requirements check page.
     */
    public function showRequirementsWeb(): Responses
    {
        return Inertia::render('Install/Requirements', [
            'requirements' => $this->getWebRequirements(),
        ]);
    }

    /**
     * Check system requirements via AJAX.
     */
    public function checkRequirementsWeb(): Responses
    {
        return Inertia::render('Install/Requirements', [
            'requirements' => $this->getWebRequirements(),
        ]);
    }

    /**
     * Show database configuration page.
     */
    public function showDatabaseWeb(): Responses
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
            'database' => ['required', 'string'],
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

            return back();
        } catch (Throwable $e) {
            throw ValidationException::withMessages([
                'connection' => 'Impossible de se connecter à la base de données: '.$e->getMessage(),
            ]);
        }
    }

    /**
     * Show admin user creation page.
     */
    public function showAdminWeb(): Responses
    {
        return Inertia::render('Install/Admin');
    }

    /**
     * Create admin user and complete installation.
     */
    public function createAdminWeb(Request $request)
    {
        $validated = $this->validate($request, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        try {
            // Run migrations
            Artisan::call('migrate:fresh', [
                '--force' => true,
                '--seed' => true,
            ]);

            // Create storage link
            if (! file_exists(public_path('storage'))) {
                Artisan::call('storage:link', ! windows_os() ? ['--relative' => true] : []);
            }

            // Get admin role
            $adminRole = Role::where('is_admin', true)->firstOrFail();

            // Create admin user
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role_id' => $adminRole->id,
                'email_verified_at' => now(),
                'password_changed_at' => now(),
            ]);

            // Generate APP_KEY
            $this->updateEnvironmentFile([
                'APP_KEY' => 'base64:'.base64_encode(Encrypter::generateKey(config('app.cipher'))),
                'APP_URL' => url('/'),
            ]);

            // Clear cache
            Artisan::call('cache:clear');
            Artisan::call('config:clear');
            Artisan::call('view:clear');

            // Create installation marker
            $this->createInstallationMarker();

            return Inertia::render('Install/Complete', [
                'adminEmail' => $validated['email'],
                'adminPassword' => $validated['password'],
            ]);
        } catch (Throwable $e) {
            throw ValidationException::withMessages([
                'name' => 'Erreur lors de l\'installation: '.$e->getMessage(),
            ]);
        }
    }

    /**
     * Show installation complete page.
     */
    public function showCompleteWeb(): Responses
    {
        return Inertia::render('Install/Complete');
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

        foreach ($values as $key => $value) {
            EnvEditor::updateEnv([
                $key => $value,
            ]);
        }
    }

    /**
     * Create installation marker file.
     */
    protected function createInstallationMarker(): void
    {
        $markerFile = storage_path('installed.json');

        file_put_contents($markerFile, json_encode([
            'installed' => true,
            'installed_at' => now()->toIso8601String(),
            'version' => $this->getAppVersion(),
        ], JSON_PRETTY_PRINT));
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
}
