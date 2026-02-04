<?php

namespace ExilonCMS\Console\Commands;

use ExilonCMS\Extensions\UpdateManager;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Symfony\Component\Console\Helper\Table;
use Symfony\Component\Process\PhpExecutableFinder;
use Symfony\Component\Process\Process;

class InstallCommand extends Command
{
    protected $signature = 'install:interactive';

    protected $description = 'Interactive installation wizard for ExilonCMS';

    protected array $config = [];

    protected UpdateManager $updates;

    public function __construct(UpdateManager $updates)
    {
        parent::__construct();
        $this->updates = $updates;
    }

    public function handle()
    {
        $this->displayHeader();

        // Ask questions
        $this->askBasicInfo();
        $this->askDatabase();
        $this->askCache();
        $this->askTheme();
        $this->askPlugins();
        $this->askAdditionalOptions();

        // Display summary
        $this->displaySummary();

        // Confirm
        if (! $this->confirm('Continue with installation?', true)) {
            $this->info('Installation cancelled.');

            return Command::SUCCESS;
        }

        // Proceed with installation
        $this->performInstallation();

        return Command::SUCCESS;
    }

    protected function displayHeader(): void
    {
        $this->line("\n".str_repeat('=', 60));
        $this->line('<fg=green;options=bold>   ExilonCMS Installation Wizard   </>');
        $this->line(str_repeat('=', 60)."\n");
        $this->line('Welcome to the ExilonCMS interactive installation!');
        $this->line('This wizard will guide you through the setup process.\n');
    }

    protected function getDefaultMarketplaceData(): array
    {
        return [
            'themes' => [
                ['id' => 'default', 'name' => 'Default Theme', 'description' => 'Clean and modern default theme'],
                ['id' => 'gaming', 'name' => 'Gaming Theme', 'description' => 'Dark theme optimized for gaming communities'],
            ],
            'plugins' => [
                ['id' => 'discord', 'name' => 'Discord Integration', 'description' => 'Link your Discord server'],
                ['id' => 'shop', 'name' => 'Shop System', 'description' => 'Virtual shop for your game server'],
                ['id' => 'voting', 'name' => 'Voting System', 'description' => 'Player voting system with rewards'],
            ],
            'games' => [
                ['id' => 'minecraft-java', 'name' => 'Minecraft Java', 'icon' => '⛏️'],
                ['id' => 'minecraft-bedrock', 'name' => 'Minecraft Bedrock', 'icon' => '⛏️'],
                ['id' => 'fivem', 'name' => 'FiveM', 'icon' => '🚗'],
                ['id' => 'rust', 'name' => 'Rust', 'icon' => '🔧'],
            ],
        ];
    }

    protected function askBasicInfo(): void
    {
        $this->line("\n<fg=yellow;options=bold>📋 Basic Information</>\n");

        $this->config['app_name'] = $this->ask('Site name', 'My Awesome Server');
        $this->config['app_url'] = $this->ask('Site URL', 'http://localhost:8000');
        $this->config['locale'] = $this->choice('Language', ['en' => 'English', 'fr' => 'French'], 'en');
        $this->config['timezone'] = $this->ask('Timezone', 'UTC');

        // Admin account
        $this->line("\n<fg=blue>Admin Account</>");
        $this->config['admin_name'] = $this->ask('Admin name', 'Admin');
        $this->config['admin_email'] = $this->ask('Admin email', 'admin@example.com');
        $this->config['admin_password'] = $this->secret('Admin password');
    }

    protected function askDatabase(): void
    {
        $this->line("\n<fg=yellow;options=bold>💾 Database Configuration</>\n");

        $dbType = $this->choice('Database type', [
            '1' => 'PostgreSQL (Recommended)',
            '2' => 'MySQL/MariaDB',
            '3' => 'SQLite (Development only)',
        ], '1');

        $this->config['db_type'] = match ($dbType) {
            '1' => 'pgsql',
            '2' => 'mysql',
            '3' => 'sqlite',
        };

        if ($this->config['db_type'] === 'sqlite') {
            $this->config['db_path'] = $this->ask('Database path', database_path('exiloncms.sqlite'));
            $this->config['db_connection'] = 'sqlite';
        } else {
            $this->config['db_host'] = $this->ask('Database host', '127.0.0.1');
            $this->config['db_port'] = $this->ask('Database port', $this->config['db_type'] === 'pgsql' ? '5432' : '3306');
            $this->config['db_database'] = $this->ask('Database name', 'exiloncms');
            $this->config['db_username'] = $this->ask('Database username', 'root');
            $this->config['db_password'] = $this->secret('Database password');
            $this->config['db_connection'] = $this->config['db_type'];
        }
    }

    protected function askCache(): void
    {
        $this->line("\n<fg=yellow;options=bold>⚡ Cache & Session</>\n");

        $this->config['cache_driver'] = $this->choice('Cache driver', [
            '1' => 'File (Development)',
            '2' => 'Redis (Recommended for production)',
            '3' => 'Memcached',
        ], '1');

        $this->config['cache_driver'] = match ($this->config['cache_driver']) {
            '1' => 'file',
            '2' => 'redis',
            '3' => 'memcached',
        };

        if ($this->config['cache_driver'] === 'redis') {
            $this->config['redis_host'] = $this->ask('Redis host', '127.0.0.1');
            $this->config['redis_port'] = $this->ask('Redis port', '6379');
            $this->config['redis_password'] = $this->ask('Redis password', '', '');
        }

        $this->config['session_driver'] = $this->choice('Session driver', [
            '1' => 'File',
            '2' => 'Redis',
            '3' => 'Database',
        ], '1');

        $this->config['session_driver'] = match ($this->config['session_driver']) {
            '1' => 'file',
            '2' => 'redis',
            '3' => 'database',
        };
    }

    protected function askTheme(): void
    {
        $this->line("\n<fg=yellow;options=bold>🎨 Theme Selection</>\n");

        $themes = $this->getDefaultMarketplaceData()['themes'] ?? [];
        $themeOptions = [];

        foreach ($themes as $index => $theme) {
            $themeOptions[$index + 1] = "{$theme['name']} - {$theme['description']}";
        }

        $themeOptions['none'] = 'Skip (use default)';

        if (count($themes) > 0) {
            $this->displayTable(['Theme', 'Description'], $themes);
            $choice = $this->choice('Select a theme', $themeOptions, 'none');

            if ($choice !== 'none') {
                $this->config['selected_theme'] = $themes[$choice - 1]['id'];
            }
        }
    }

    protected function askPlugins(): void
    {
        $this->line("\n<fg=yellow;options=bold>🔌 Plugin Selection</>\n");
        $this->info('Select the plugins you want to install (space to select, enter to continue):\n');

        $plugins = $this->getDefaultMarketplaceData()['plugins'] ?? [];
        $pluginOptions = [];

        foreach ($plugins as $index => $plugin) {
            $pluginOptions[$index] = "{$plugin['name']} - {$plugin['description']}";
        }

        if (count($plugins) > 0) {
            $this->displayTable(['Plugin', 'Description'], $plugins);
            $selected = $this->choice('Select plugins (comma-separated)', $pluginOptions, 'none', true);

            if ($selected !== 'none') {
                $selectedArray = array_map('trim', explode(',', $selected));
                $this->config['selected_plugins'] = [];

                foreach ($selectedArray as $selection) {
                    $index = (int) $selection - 1;
                    if (isset($plugins[$index])) {
                        $this->config['selected_plugins'][] = $plugins[$index]['id'];
                    }
                }
            }
        }
    }

    protected function askAdditionalOptions(): void
    {
        $this->line("\n<fg=yellow;options=bold>⚙️  Additional Options</>\n");

        $this->config['create_docker'] = $this->confirm('Create Docker configuration?', true);
        $this->config['run_migrations'] = $this->confirm('Run database migrations?', true);
        $this->config['build_assets'] = $this->confirm('Build frontend assets?', true);
        $this->config['generate_key'] = $this->confirm('Generate application key?', true);
        $this->config['enable_updates'] = $this->confirm('Enable GitHub auto-updates?', true);

        if ($this->config['enable_updates']) {
            $this->config['github_owner'] = $this->ask('GitHub repository owner', 'Exilon-Studios');
            $this->config['github_repo'] = $this->ask('GitHub repository name', 'ExilonCMS');
        }
    }

    protected function displaySummary(): void
    {
        $this->line("\n".str_repeat('=', 60));
        $this->line('<fg=blue;options=bold>📋 Installation Summary</>');
        $this->line(str_repeat('=', 60)."\n");

        $table = new Table($this->output);

        $rows = [
            ['Site Name', $this->config['app_name']],
            ['Site URL', $this->config['app_url']],
            ['Language', $this->config['locale']],
            ['Timezone', $this->config['timezone']],
            ['Database', $this->config['db_connection'] ?? 'sqlite'],
            ['Cache', $this->config['cache_driver']],
            ['Session', $this->config['session_driver']],
            ['Admin', $this->config['admin_name'].' ('.$this->config['admin_email'].')'],
        ];

        if (! empty($this->config['selected_theme'])) {
            $rows[] = ['Theme', $this->config['selected_theme']];
        }

        if (! empty($this->config['selected_plugins'])) {
            $rows[] = ['Plugins', implode(', ', $this->config['selected_plugins'])];
        }

        $table->setRows($rows);
        $table->render();

        $this->line('');
    }

    protected function displayTable(array $headers, array $rows): void
    {
        $table = new Table($this->output);
        $table->setHeaders($headers);
        $table->setRows(array_map(fn ($item) => [$item['name'], $item['description']], $rows));
        $table->render();
    }

    protected function performInstallation(): void
    {
        $this->line("\n<fg=blue;options=bold>🚀 Starting Installation...</>\n");

        // 1. Copy .env
        $this->info('1/8. Creating .env file...');
        $this->createEnvFile();

        // 2. Generate key
        if ($this->config['generate_key']) {
            $this->info('2/8. Generating application key...');
            $this->executeCommand('php artisan key:generate');
        }

        // 3. Create Docker files
        if ($this->config['create_docker']) {
            $this->info('3/8. Creating Docker configuration...');
            $this->createDockerFiles();
        }

        // 4. Install dependencies
        $this->info('4/8. Installing dependencies...');
        $this->installDependencies();

        // 5. Build assets
        if ($this->config['build_assets']) {
            $this->info('5/8. Building frontend assets...');
            $this->executeCommand('npm run build');
        }

        // 6. Run migrations
        if ($this->config['run_migrations']) {
            $this->info('6/8. Running database migrations...');
            $this->executeCommand('php artisan migrate --seed');
        }

        // 7. Create admin user
        $this->info('7/8. Creating admin user...');
        $this->createAdminUser();

        // 8. Install theme/plugins
        $this->info('8/8. Installing theme and plugins...');
        $this->installThemeAndPlugins();

        $this->line("\n<fg=green;options=bold>✅ Installation Complete!</>\n");

        $this->displayNextSteps();
    }

    protected function createEnvFile(): void
    {
        $envPath = base_path('.env');

        if (! File::exists($envPath)) {
            File::copy(base_path('.env.example'), $envPath);
        }

        $envContent = File::get($envPath);

        // Update with user config
        $replacements = [
            'APP_NAME=' => 'APP_NAME='.$this->config['app_name'],
            'APP_URL=' => 'APP_URL='.$this->config['app_url'],
            'APP_LOCALE=' => 'APP_LOCALE='.$this->config['locale'],
            'APP_TIMEZONE=' => 'APP_TIMEZONE='.$this->config['timezone'],
        ];

        if ($this->config['db_connection'] === 'sqlite') {
            $replacements['DB_CONNECTION='] = 'DB_CONNECTION=sqlite';
            $replacements['DB_DATABASE='] = 'DB_DATABASE='.$this->config['db_path'];
        } else {
            $replacements['DB_CONNECTION='] = 'DB_CONNECTION='.$this->config['db_connection'];
            $replacements['DB_HOST='] = 'DB_HOST='.$this->config['db_host'];
            $replacements['DB_PORT='] = 'DB_PORT='.$this->config['db_port'];
            $replacements['DB_DATABASE='] = 'DB_DATABASE='.$this->config['db_database'];
            $replacements['DB_USERNAME='] = 'DB_USERNAME='.$this->config['db_username'];
            $replacements['DB_PASSWORD='] = 'DB_PASSWORD='.$this->config['db_password'];
        }

        $replacements['CACHE_DRIVER='] = 'CACHE_DRIVER='.$this->config['cache_driver'];
        $replacements['SESSION_DRIVER='] = 'SESSION_DRIVER='.$this->config['session_driver'];

        $envContent = str_replace(array_keys($replacements), array_values($replacements), $envContent);

        if ($this->config['cache_driver'] === 'redis') {
            $envContent = $this->updateRedisConfig($envContent);
        }

        if ($this->config['enable_updates']) {
            $envContent .= "\n\n# GitHub Updates\n";
            $envContent .= "GITHUB_UPDATES_ENABLED=true\n";
            $envContent .= "GITHUB_REPO_OWNER={$this->config['github_owner']}\n";
            $envContent .= "GITHUB_REPO_NAME={$this->config['github_repo']}\n";
        }

        File::put($envPath, $envContent);

        $this->info('<fg=green>.env file created successfully!</>');
    }

    protected function updateRedisConfig(string $envContent): string
    {
        $envContent = preg_replace('/REDIS_HOST=.*\n/', '', $envContent);
        $envContent = preg_replace('/REDIS_PASSWORD=.*\n/', '', $envContent);

        $redisConfig = "\n# Redis Configuration\n";
        $redisConfig .= "REDIS_HOST={$this->config['redis_host']}\n";
        $redisConfig .= "REDIS_PORT={$this->config['redis_port']}\n";
        if (! empty($this->config['redis_password'])) {
            $redisConfig .= "REDIS_PASSWORD={$this->config['redis_password']}\n";
        }

        return $envContent.$redisConfig;
    }

    protected function createDockerFiles(): void
    {
        $dockerCompose = $this->generateDockerCompose();
        File::put(base_path('docker-compose.yml'), $dockerCompose);

        $dockerfile = $this->generateDockerfile();
        File::put(base_path('Dockerfile'), $dockerfile);

        $this->info('<fg=green>Docker files created!</>');
    }

    protected function generateDockerCompose(): string
    {
        $redisService = '';
        $redisDepends = '';
        $redisEnv = '';

        if ($this->config['cache_driver'] === 'redis' || $this->config['session_driver'] === 'redis') {
            $redisService = '
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data';
            $redisDepends = 'redis';
            $redisEnv = 'REDIS_HOST=redis
      REDIS_PORT=6379';
        }

        $dbService = '';
        $dbDepends = '';
        $dbEnv = '';

        if ($this->config['db_connection'] === 'pgsql') {
            $dbService = "
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: {$this->config['db_database']}
      POSTGRES_USER: {$this->config['db_username']}
      POSTGRES_PASSWORD: {$this->config['db_password']}
    ports:
      - \"5432:5432\"
    volumes:
      - postgres_data:/var/lib/postgresql/data";
            $dbDepends = 'postgres';
            $dbEnv = "DB_CONNECTION=pgsql
      DB_HOST=postgres
      DB_PORT=5432
      DB_DATABASE={$this->config['db_database']}
      DB_USERNAME={$this->config['db_username']}
      DB_PASSWORD={$this->config['db_password']}";
        } elseif ($this->config['db_connection'] === 'mysql') {
            $dbService = "
  mysql:
    image: mysql:8
    environment:
      MYSQL_DATABASE: {$this->config['db_database']}
      MYSQL_USER: {$this->config['db_username']}
      MYSQL_PASSWORD: {$this->config['db_password']}
      MYSQL_ROOT_PASSWORD: {$this->config['db_password']}
    ports:
      - \"3306:3306\"
    volumes:
      - mysql_data:/var/lib/mysql";
            $dbDepends = 'mysql';
            $dbEnv = "DB_CONNECTION=mysql
      DB_HOST=mysql
      DB_PORT=3306
      DB_DATABASE={$this->config['db_database']}
      DB_USERNAME={$this->config['db_username']}
      DB_PASSWORD={$this->config['db_password']}";
        }

        return <<<YAML
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: exiloncms
    ports:
      - \"8000:8000\"
    environment:
      APP_NAME: {$this->config['app_name']}
      APP_URL: {$this->config['app_url']}
      APP_ENV: production
      APP_DEBUG: false
      APP_LOCALE: {$this->config['locale']}
      APP_TIMEZONE: {$this->config['timezone']}
      CACHE_DRIVER: {$this->config['cache_driver']}
      SESSION_DRIVER: {$this->config['session_driver']}
      {$redisEnv}
      {$dbEnv}
    depends_on:
      - {$dbDepends}
    volumes:
      - ./storage:/var/www/html/storage
      - ./bootstrap/cache:/var/www/html/bootstrap/cache
{$dbService}
{$redisService}
volumes:
  postgres_data:
  mysql_data:
  redis_data:
YAML;
    }

    protected function generateDockerfile(): string
    {
        return <<<'DOCKERFILE'
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype \
    && docker-php-ext-install -j$(nproc) \
    gd \
    zip \
    pdo_pgsql \
    pdo_mysql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install dependencies
RUN composer install --no-interaction --optimize-autoloader --no-dev
RUN npm install
RUN npm run build

# Set permissions
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Expose port
EXPOSE 9000

CMD ["php-fpm"]
DOCKERFILE;
    }

    protected function installDependencies(): void
    {
        $phpBinary = (new PhpExecutableFinder)->find();

        $this->runProcess('composer install --no-interaction --optimize-autoloader --no-dev');
        $this->runProcess('npm install', 300);
    }

    protected function createAdminUser(): void
    {
        $command = sprintf(
            'php artisan user:create --admin --name="%s" --email="%s" --password="%s"',
            $this->config['admin_name'],
            $this->config['admin_email'],
            $this->config['admin_password']
        );

        $this->executeCommand($command);
    }

    protected function installThemeAndPlugins(): void
    {
        // Theme
        if (! empty($this->config['selected_theme'])) {
            $this->info("Theme selected: {$this->config['selected_theme']}");
            $this->warn('  Marketplace integration has been removed. Please install themes manually.');
        }

        // Plugins
        if (! empty($this->config['selected_plugins'])) {
            foreach ($this->config['selected_plugins'] as $plugin) {
                $this->info("Plugin available locally: {$plugin}");
                $this->warn('  Marketplace integration has been removed. Please install plugins manually.');
            }
        }
    }

    protected function displayNextSteps(): void
    {
        $this->line("<fg=green;options=bold>🎉 Your ExilonCMS installation is complete!</>\n");

        $this->line("<fg=yellow>Next Steps:</>\n");

        if ($this->config['create_docker']) {
            $this->line('1. Start Docker containers:');
            $this->line('   <fg=cyan>docker-compose up -d</>');
            $this->line('');
            $this->line('2. Access your site at:');
            $this->line("   <fg=cyan>{$this->config['app_url']}</>");
        } else {
            $this->line('1. Start the development server:');
            $this->line('   <fg=cyan>php artisan serve</>');
            $this->line('');
            $this->line('2. Access your site at:');
            $this->line('   <fg=cyan>http://localhost:8000</>');
        }

        $this->line('');
        $this->line('Admin Login:');
        $this->line("   Email: <fg=cyan>{$this->config['admin_email']}</>");
        $this->line('   Password: <fg=cyan>[your password]</>');
        $this->line('');
        $this->line('For more information, visit: <fg=cyan>https://github.com/Exilon-Studios/ExilonCMS</>');
    }

    protected function executeCommand(string $command): void
    {
        $this->line("\n  $ {$command}");

        $process = Process::fromShellCommandline($command);
        $process->setTty(Process::isTtySupported());
        $process->run(function ($type, $buffer) {
            $this->line('  '.trim($buffer));
        });

        if (! $process->isSuccessful()) {
            $this->error('Command failed!');
        }
    }

    protected function runProcess(string $command, int $timeout = 300): void
    {
        $process = Process::fromShellCommandline($command);
        $process->setTimeout($timeout);

        $process->run(function ($type, $buffer) {
            echo $buffer;
        });

        if (! $process->isSuccessful()) {
            throw new \RuntimeException('Process failed: '.$process->getErrorOutput());
        }
    }
}
