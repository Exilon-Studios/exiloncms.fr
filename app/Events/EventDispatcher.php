<?php

namespace ExilonCMS\Events;

use Illuminate\Support\Facades\Log;

/**
 * Event Dispatcher for Plugins
 *
 * A simple event system that allows plugins to listen to and dispatch events.
 * This is separate from Laravel's event system and provides a lightweight
 * way for plugins to hook into CMS events without requiring configuration.
 *
 * Usage:
 * - Listen to events: EventDispatcher::listen('user.created', function($event, $data) { ... });
 * - Dispatch events: EventDispatcher::dispatch('user.created', ['user' => $user]);
 * - Remove listeners: EventDispatcher::forget('user.created');
 */
class EventDispatcher
{
    /**
     * Registered event listeners.
     *
     * @var array<string, array<int, array{listener: callable, priority: int}>>
     */
    protected static array $listeners = [];

    /**
     * Register a listener for an event.
     *
     * @param  string  $event  Event name (e.g., 'user.created', 'order.completed')
     * @param  callable  $listener  Callback function to execute when event is dispatched
     * @param  int  $priority  Priority (higher = executed first). Default 0.
     */
    public static function listen(string $event, callable $listener, int $priority = 0): void
    {
        if (! isset(static::$listeners[$event])) {
            static::$listeners[$event] = [];
        }

        static::$listeners[$event][] = [
            'listener' => $listener,
            'priority' => $priority,
        ];
    }

    /**
     * Dispatch an event to all registered listeners.
     *
     * @param  string  $event  Event name
     * @param  array  $payload  Data to pass to listeners
     */
    public static function dispatch(string $event, array $payload = []): void
    {
        if (! isset(static::$listeners[$event])) {
            return;
        }

        // Sort listeners by priority (highest first)
        $listeners = collect(static::$listeners[$event])
            ->sortByDesc('priority')
            ->pluck('listener')
            ->toArray();

        foreach ($listeners as $listener) {
            try {
                $listener($event, $payload);
            } catch (\Throwable $e) {
                Log::warning("Event listener failed for {$event}: {$e->getMessage()}", [
                    'event' => $event,
                    'exception' => $e,
                ]);
            }
        }
    }

    /**
     * Get all listeners for an event.
     */
    public static function getListeners(string $event): array
    {
        return static::$listeners[$event] ?? [];
    }

    /**
     * Remove all listeners for an event.
     */
    public static function forget(string $event): void
    {
        unset(static::$listeners[$event]);
    }

    /**
     * Check if an event has any listeners.
     */
    public static function hasListeners(string $event): bool
    {
        return isset(static::$listeners[$event]) && ! empty(static::$listeners[$event]);
    }

    /**
     * Clear all event listeners.
     */
    public static function flush(): void
    {
        static::$listeners = [];
    }

    /**
     * Register plugin listeners from plugin.json manifest.
     *
     * This method is called during plugin boot to register all event listeners
     * defined in the plugin's manifest file.
     *
     * @param  string  $pluginId  Plugin ID
     */
    public static function registerPluginListeners(string $pluginId): void
    {
        $manifest = plugin_manifest($pluginId);

        if (! $manifest || ! isset($manifest['events']['listen'])) {
            return;
        }

        $events = $manifest['events']['listen'];

        foreach ($events as $event) {
            // Try to find a listener class for this event
            // Format: ExilonCMS\Plugins\{PluginId}\Listeners\{Event}Listener
            $eventClass = str_replace('.', '', ucwords($event, '.'));
            $listenerClass = "ExilonCMS\\Plugins\\{$pluginId}\\Listeners\\{$eventClass}Listener";

            if (class_exists($listenerClass)) {
                $instance = app($listenerClass);
                if (method_exists($instance, 'handle')) {
                    static::listen($event, [$instance, 'handle']);
                }
            }
        }
    }
}

// Register the plugin event listeners helper if not already exists
if (! function_exists('register_plugin_event_listeners')) {
    /**
     * Register event listeners from a plugin's manifest.
     */
    function register_plugin_event_listeners(string $pluginId): void
    {
        \ExilonCMS\Events\EventDispatcher::registerPluginListeners($pluginId);
    }
}
