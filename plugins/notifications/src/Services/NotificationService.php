<?php

namespace ExilonCMS\Plugins\Notifications\Services;

use ExilonCMS\Models\User;
use ExilonCMS\Plugins\Notifications\Models\NotificationChannel;
use ExilonCMS\Plugins\Notifications\Models\NotificationLog;
use ExilonCMS\Plugins\Notifications\Models\NotificationTemplate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;

class NotificationService
{
    public function send(User|null $user, string $type, array $data = []): bool
    {
        $template = NotificationTemplate::bySlug($type)->enabled()->first();

        if (!$template) {
            Log::warning("Notification template not found: {$type}");
            return false;
        }

        $channels = NotificationChannel::enabled()
            ->byType($template->type)
            ->get();

        $success = true;

        foreach ($channels as $channel) {
            $result = $this->sendViaChannel($user, $channel, $template, $data);
            if (!$result) {
                $success = false;
            }
        }

        return $success;
    }

    /**
     * Send all pending notifications.
     */
    public function sendPendingNotifications(): int
    {
        $pendingLogs = NotificationLog::where('status', NotificationLog::STATUS_PENDING)
            ->where('created_at', '>=', now()->subHours(24))
            ->limit(100)
            ->get();

        $sent = 0;

        foreach ($pendingLogs as $log) {
            try {
                $channel = NotificationChannel::find($log->channel_id);
                $template = NotificationTemplate::where('slug', $log->type)->first();
                $user = User::find($log->user_id);

                if ($channel && $template) {
                    $result = $this->sendViaChannel($user, $channel, $template, $log->data ?? []);
                    if ($result) {
                        $sent++;
                    }
                }
            } catch (\Exception $e) {
                Log::error("Failed to send pending notification: {$e->getMessage()}", [
                    'log_id' => $log->id,
                ]);
            }
        }

        return $sent;
    }

    protected function sendViaChannel(
        User|null $user,
        NotificationChannel $channel,
        NotificationTemplate $template,
        array $data = []
    ): bool {
        $log = NotificationLog::create([
            'user_id' => $user?->id,
            'channel_id' => $channel->id,
            'type' => $template->slug,
            'subject' => $template->subject,
            'content' => $template->render($data),
            'data' => $data,
            'status' => NotificationLog::STATUS_PENDING,
        ]);

        try {
            $result = match ($channel->type) {
                NotificationChannel::TYPE_EMAIL => $this->sendEmail($user, $channel, $template, $data),
                NotificationChannel::TYPE_SMS => $this->sendSms($user, $channel, $template, $data),
                NotificationChannel::TYPE_PUSH => $this->sendPush($user, $channel, $template, $data),
                NotificationChannel::TYPE_WEBHOOK => $this->sendWebhook($user, $channel, $template, $data),
                default => throw new \Exception("Unknown channel type: {$channel->type}"),
            };

            if ($result) {
                $log->markAsSent();
                return true;
            } else {
                $log->markAsFailed('Failed to send notification');
                return false;
            }
        } catch (\Exception $e) {
            $log->markAsFailed($e->getMessage());
            Log::error("Failed to send notification: {$e->getMessage()}");
            return false;
        }
    }

    protected function sendEmail(
        User|null $user,
        NotificationChannel $channel,
        NotificationTemplate $template,
        array $data
    ): bool {
        if (!$user || !$user->email) {
            return false;
        }

        try {
            Mail::raw($template->render($data), function ($message) use ($user, $template) {
                $message->to($user->email)
                    ->subject($template->subject);
            });

            return true;
        } catch (\Exception $e) {
            Log::error("Failed to send email: {$e->getMessage()}");
            return false;
        }
    }

    protected function sendSms(
        User|null $user,
        NotificationChannel $channel,
        NotificationTemplate $template,
        array $data
    ): bool {
        if (!$user) {
            return false;
        }

        $config = $channel->config;

        // Example with Twilio
        // $sid = $config['twilio_sid'] ?? config('services.twilio.sid');
        // $token = $config['twilio_token'] ?? config('services.twilio.token');
        // $from = $config['twilio_from'] ?? config('services.twilio.from');

        // Implementation depends on SMS provider
        return true;
    }

    protected function sendPush(
        User|null $user,
        NotificationChannel $channel,
        NotificationTemplate $template,
        array $data
    ): bool {
        if (!$user) {
            return false;
        }

        // Push notification implementation (Firebase, OneSignal, etc.)
        return true;
    }

    protected function sendWebhook(
        User|null $user,
        NotificationChannel $channel,
        NotificationTemplate $template,
        array $data
    ): bool {
        $url = $channel->config['url'] ?? null;

        if (!$url) {
            return false;
        }

        try {
            Http::post($url, [
                'user_id' => $user?->id,
                'type' => $template->slug,
                'subject' => $template->subject,
                'content' => $template->render($data),
                'data' => $data,
            ])->throw();

            return true;
        } catch (\Exception $e) {
            Log::error("Failed to send webhook: {$e->getMessage()}");
            return false;
        }
    }
}
