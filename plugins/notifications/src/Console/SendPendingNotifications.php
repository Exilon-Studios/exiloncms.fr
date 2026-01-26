<?php

namespace ExilonCMS\Plugins\Notifications\Console;

use ExilonCMS\Plugins\Notifications\Services\NotificationService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SendPendingNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:send-pending';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send all pending notifications';

    /**
     * Execute the console command.
     */
    public function handle(NotificationService $notificationService): int
    {
        $this->info('Sending pending notifications...');

        try {
            $sent = $notificationService->sendPendingNotifications();

            $this->info("✓ Sent {$sent} notification(s) successfully");

            Log::info('Pending notifications sent', ['count' => $sent]);

            return self::SUCCESS;
        } catch (\Exception $e) {
            $this->error("Failed to send notifications: {$e->getMessage()}");

            Log::error('Failed to send pending notifications', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return self::FAILURE;
        }
    }
}
