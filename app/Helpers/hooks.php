<?php

use ExilonCMS\Events\EventDispatcher;

/**
 * ExilonCMS Event Hooks System
 *
 * Comprehensive event hook system inspired by Paymenter.
 * Allows plugins to hook into:
 * - Laravel model events (created, updated, deleted)
 * - Authentication events (login, logout)
 * - Navigation events (dashboard, account-dropdown)
 * - Custom CMS events
 */

// ============================================================
// MODEL EVENTS
// ============================================================

/**
 * Register a listener for a model created event.
 *
 * Usage: hook_model_created(User::class, function($model) { ... });
 */
function hook_model_created(string $modelClass, callable $callback, int $priority = 0): void
{
    $eventName = 'model.'.str_replace('\\', '.', strtolower($modelClass)).'.created';
    EventDispatcher::listen($eventName, $callback, $priority);
}

/**
 * Register a listener for a model updated event.
 */
function hook_model_updated(string $modelClass, callable $callback, int $priority = 0): void
{
    $eventName = 'model.'.str_replace('\\', '.', strtolower($modelClass)).'.updated';
    EventDispatcher::listen($eventName, $callback, $priority);
}

/**
 * Register a listener for a model deleted event.
 */
function hook_model_deleted(string $modelClass, callable $callback, int $priority = 0): void
{
    $eventName = 'model.'.str_replace('\\', '.', strtolower($modelClass)).'.deleted';
    EventDispatcher::listen($eventName, $callback, $priority);
}

/**
 * Dispatch a model created event.
 */
function dispatch_model_created(string $modelClass, $model): void
{
    $eventName = 'model.'.str_replace('\\', '.', strtolower($modelClass)).'.created';
    EventDispatcher::dispatch($eventName, ['model' => $model]);
}

/**
 * Dispatch a model updated event.
 */
function dispatch_model_updated(string $modelClass, $model): void
{
    $eventName = 'model.'.str_replace('\\', '.', strtolower($modelClass)).'.updated';
    EventDispatcher::dispatch($eventName, ['model' => $model]);
}

/**
 * Dispatch a model deleted event.
 */
function dispatch_model_deleted(string $modelClass, $model): void
{
    $eventName = 'model.'.str_replace('\\', '.', strtolower($modelClass)).'.deleted';
    EventDispatcher::dispatch($eventName, ['model' => $model]);
}

// ============================================================
// AUTH EVENTS
// ============================================================

/**
 * Register a listener for user login event.
 */
function hook_auth_login(callable $callback, int $priority = 0): void
{
    EventDispatcher::listen('auth.login', $callback, $priority);
}

/**
 * Register a listener for user logout event.
 */
function hook_auth_logout(callable $callback, int $priority = 0): void
{
    EventDispatcher::listen('auth.logout', $callback, $priority);
}

/**
 * Register a listener for user registered event.
 */
function hook_auth_registered(callable $callback, int $priority = 0): void
{
    EventDispatcher::listen('auth.registered', $callback, $priority);
}

/**
 * Dispatch auth login event.
 */
function dispatch_auth_login($user): void
{
    EventDispatcher::dispatch('auth.login', ['user' => $user]);
}

/**
 * Dispatch auth logout event.
 */
function dispatch_auth_logout($user): void
{
    EventDispatcher::dispatch('auth.logout', ['user' => $user]);
}

/**
 * Dispatch auth registered event.
 */
function dispatch_auth_registered($user): void
{
    EventDispatcher::dispatch('auth.registered', ['user' => $user]);
}

// ============================================================
// NAVIGATION HOOKS
// ============================================================

/**
 * Register items for dashboard navigation.
 * Returns array of navigation items.
 */
function hook_navigation_dashboard(callable $callback): void
{
    EventDispatcher::listen('navigation.dashboard', $callback);
}

/**
 * Register items for account dropdown navigation.
 */
function hook_navigation_account_dropdown(callable $callback): void
{
    EventDispatcher::listen('navigation.account-dropdown', $callback);
}

/**
 * Get dashboard navigation items.
 */
function get_navigation_dashboard_items(): array
{
    $items = [];
    $listeners = EventDispatcher::getListeners('navigation.dashboard');

    foreach ($listeners as $listener) {
        $result = $listener('navigation.dashboard', []);
        if (is_array($result)) {
            $items = array_merge($items, $result);
        }
    }

    return $items;
}

/**
 * Get account dropdown navigation items.
 */
function get_navigation_account_dropdown_items(): array
{
    $items = [];
    $listeners = EventDispatcher::getListeners('navigation.account-dropdown');

    foreach ($listeners as $listener) {
        $result = $listener('navigation.account-dropdown', []);
        if (is_array($result)) {
            $items = array_merge($items, $result);
        }
    }

    return $items;
}

// ============================================================
// CMS EVENTS
// ============================================================

/**
 * Register listener for settings updated event.
 */
function hook_settings_updated(callable $callback, int $priority = 0): void
{
    EventDispatcher::listen('settings.updated', $callback, $priority);
}

/**
 * Register listener for plugin enabled event.
 */
function hook_plugin_enabled(callable $callback, int $priority = 0): void
{
    EventDispatcher::listen('plugin.enabled', $callback, $priority);
}

/**
 * Register listener for plugin disabled event.
 */
function hook_plugin_disabled(callable $callback, int $priority = 0): void
{
    EventDispatcher::listen('plugin.disabled', $callback, $priority);
}

/**
 * Register listener for theme activated event.
 */
function hook_theme_activated(callable $callback, int $priority = 0): void
{
    EventDispatcher::listen('theme.activated', $callback, $priority);
}

// ============================================================
// GENERIC EVENT HELPERS
// ============================================================

/**
 * Register a listener for any custom event.
 */
function hook_event(string $event, callable $callback, int $priority = 0): void
{
    EventDispatcher::listen($event, $callback, $priority);
}

/**
 * Dispatch any custom event.
 */
function dispatch_event(string $event, array $payload = []): void
{
    EventDispatcher::dispatch($event, $payload);
}

/**
 * Check if an event has listeners.
 */
function has_event_listeners(string $event): bool
{
    return EventDispatcher::hasListeners($event);
}

// ============================================================
// MODEL OBSERVER REGISTRATION
// ============================================================

/**
 * Register event observers for a model.
 * This integrates Laravel model events with the hook system.
 */
function register_model_observers(string $modelClass): void
{
    $modelClass::created(function ($model) use ($modelClass) {
        dispatch_model_created($modelClass, $model);
    });

    $modelClass::updated(function ($model) use ($modelClass) {
        dispatch_model_updated($modelClass, $model);
    });

    $modelClass::deleted(function ($model) use ($modelClass) {
        dispatch_model_deleted($modelClass, $model);
    });
}
