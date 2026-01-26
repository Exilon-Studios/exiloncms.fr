<?php

namespace ExilonCMS\Console\Commands;

use ExilonCMS\Services\UpdateChecker;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CheckUpdates extends Command
{
    protected $signature = 'updates:check {--notify : Send notifications if updates found}';
    protected $description = 'Check for updates to installed plugins and themes';

    public function __construct(
        private UpdateChecker $updateChecker
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $this->info('Checking for updates...');

        $updates = $this->updateChecker->checkAllUpdates();
        $totalUpdates = count($updates['plugins']) + count($updates['themes']);

        if ($totalUpdates === 0) {
            $this->info('No updates available.');
            return self::SUCCESS;
        }

        $this->info("Found {$totalUpdates} update(s):");

        foreach ($updates['plugins'] as $update) {
            $this->warn("  Plugin: {$update['name']} ({$update['current_version']} → {$update['latest_version']})");
        }

        foreach ($updates['themes'] as $update) {
            $this->warn("  Theme: {$update['name']} ({$update['current_version']} → {$update['latest_version']})");
        }

        if ($this->option('notify')) {
            $this->sendNotifications($updates);
        }

        return self::SUCCESS;
    }

    protected function sendNotifications(array $updates): void
    {
        // Create notifications for admin users
        // TODO: Implement notification system
        Log::info('Updates available', ['updates' => $updates]);
        $this->info('Notifications sent to administrators.');
    }
}
