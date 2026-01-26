# Changelog

All notable changes to ExilonCMS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 2026-01-26

FIX: Fix JavaScript "Cannot access before initialization" error in Requirements component
FEATURE: Add plugin/theme update checker system with source URL tracking
FEATURE: Updates are checked from original download URL (marketplace, GitHub, etc.)
FEATURE: Admin notifications when updates are available
FEATURE: Add default themes (Blog, Gaming, E-Commerce) included with CMS distribution
FEATURE: All themes are marketplace-ready with proper versioning for API updates
FIX: Add type checks to ThemeLoader to prevent "Cannot access offset of type Theme on array" error
FIX: Auto-redirect from requirements page to database step when all checks pass
FIX: Fix Inertia redirect loop - use Inertia::location() instead of Laravel redirect() for installation
FIX: Fix syntax error in ResourceInstallController (space instead of backslash in use statement)
FEATURE: Add Hytale game support with player UUID lookup via playerdb.co API
FEATURE: Add HytaleGame class with avatar URL and username lookup
FEATURE: Add Hytale to game selection in installer
FEATURE: Add French translations for Hytale game

FEATURE: Complete shop plugin rewrite with payment gateway system
FEATURE: Add Tebex payment gateway integration (official FiveM payment platform)
FEATURE: Add PaymentManager with support for multiple payment gateways
FEATURE: Add Payment, PaymentItem, Gateway, Order, OrderItem models
FEATURE: Add webhook handlers for payment notifications
FEATURE: Add payment status tracking (pending, completed, failed, refunded, chargeback)
FEATURE: Add migrations for shop_payments, shop_payment_items, shop_gateways tables
FEATURE: Add PaymentMethod abstract base class for custom payment gateways
FEATURE: Add support for in-game item delivery via server bridge commands
