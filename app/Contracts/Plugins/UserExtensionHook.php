<?php

namespace ExilonCMS\Contracts\Plugins;

/**
 * User Extension Hook Contract
 *
 * Plugins can implement this to extend user functionality:
 * - Add custom user fields
 * - Add user profile sections
 * - Add user actions
 * - Extend user permissions
 *
 * Example implementation in plugin.json:
 * "hooks": {
 *   "user": {
 *     "fields": ["discord_id", "minecraft_uuid", "steam_id"],
 *     "profile_sections": ["GamingProfile", "SocialLinks"],
 *     "actions": ["LinkDiscord", "SyncMinecraft"]
 *   }
 * }
 */
interface UserExtensionHook
{
    /**
     * Register custom user fields.
     *
     * @return array<string, array{type: string, label: string, rules: array}>
     */
    public function registerUserFields(): array;

    /**
     * Register user profile sections.
     *
     * @return array<string, array{label: string, component: string, order: int}>
     */
    public function registerProfileSections(): array;

    /**
     * Register custom user actions.
     *
     * @return array<string, array{label: string, action: string, icon: string}>
     */
    public function registerUserActions(): array;

    /**
     * Get custom user data for API responses.
     *
     * @param \ExilonCMS\Models\User $user
     * @return array<string, mixed>
     */
    public function getUserData($user): array;

    /**
     * Validate custom user field values.
     *
     * @param string $field
     * @param mixed $value
     * @return array{valid: bool, error?: string}
     */
    public function validateUserField(string $field, $value): array;

    /**
     * Get user permissions for plugin features.
     *
     * @param \ExilonCMS\Models\User $user
     * @return array<string, bool>
     */
    public function getUserPermissions($user): array;
}
