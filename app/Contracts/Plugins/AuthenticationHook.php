<?php

namespace ExilonCMS\Contracts\Plugins;

/**
 * Authentication Hook Contract
 *
 * Plugins can implement this to add authentication methods:
 * - OAuth providers (Steam, Discord, Google, etc.)
 * - Custom authentication flows
 * - 2FA methods
 *
 * Example implementation in plugin.json:
 * "hooks": {
 *   "auth": {
 *     "providers": ["SteamAuth", "DiscordAuth"],
 *     "2fa_methods": ["EmailOTP", "AuthenticatorApp"]
 *   }
 * }
 */
interface AuthenticationHook
{
    /**
     * Register custom OAuth providers.
     * Returns array of provider instances or configurations.
     *
     * @return array<string, mixed>
     */
    public function registerAuthProviders(): array;

    /**
     * Register custom 2FA methods.
     *
     * @return array<string, mixed>
     */
    public function registerTwoFactorMethods(): array;

    /**
     * Validate user credentials from custom source.
     * Used for external authentication (LDAP, SAML, etc.)
     *
     * @return array{success: bool, user_data?: array, error?: string}
     */
    public function validateCredentials(array $credentials): array;

    /**
     * Get user profile data from external source.
     * Used for OAuth/SSO flows.
     *
     * @return array<string, mixed>
     */
    public function getUserProfile(string $provider, string $token): array;

    /**
     * Synchronize user data with external source.
     * Called during login or on schedule.
     *
     * @param  \ExilonCMS\Models\User  $user
     */
    public function syncUser($user): bool;
}
