# Translation System Audit Report - MC-CMS V2

**Generated:** 2026-01-03 22:41:02

---

## Executive Summary

| Metric | Count |
|--------|-------|
| **Total keys defined** | 1377 |
| **Total keys used** | 78 |
| **Unused keys** | 1309 (95.1%) |
| **Missing keys** | 10 |
| **Duplicate patterns** | 3 |
| **Coverage** | 4.9% |

### Health Score: 🔴 Poor (30/100)

## Most Used Translation Keys

Top 20 most frequently referenced translation keys:

 2× `admin.nav.dashboard`
 1× `auth.name`
 1× `id`
 1× `auth.mail.reset.subject`
 1× `auth.mail.reset.line1`
 1× `auth.mail.reset.action`
 1× `auth.mail.reset.line2`
 1× `auth.mail.reset.line3`
 1× `mail.test.subject`
 1× `mail.test.content`
 1× `mail.delete.subject`
 1× `mail.delete.line1`
 1× `mail.delete.action`
 1× `mail.delete.line2`
 1× `mail.delete.line3`
 1× `auth.mail.verify.subject`
 1× `auth.mail.verify.line1`
 1× `auth.mail.verify.action`
 1× `auth.mail.verify.line2`
 1× `validation.hex_color`

## Missing Translation Keys ⚠️

These keys are **used in the code** but **not defined** in language files.

**Total:** 10 keys

### `id`

**Used in:**
- `C:\Users\uranium\Documents\Projets\Minecraft\Outland\outland-cms-v2/app/Games/Game.php`

### `auth.mail.reset.subject`

**Used in:**
- `C:\Users\uranium\Documents\Projets\Minecraft\Outland\outland-cms-v2/app/Notifications/ResetPassword.php`

### `auth.mail.reset.line1`

**Used in:**
- `C:\Users\uranium\Documents\Projets\Minecraft\Outland\outland-cms-v2/app/Notifications/ResetPassword.php`

### `auth.mail.reset.action`

**Used in:**
- `C:\Users\uranium\Documents\Projets\Minecraft\Outland\outland-cms-v2/app/Notifications/ResetPassword.php`

### `auth.mail.reset.line2`

**Used in:**
- `C:\Users\uranium\Documents\Projets\Minecraft\Outland\outland-cms-v2/app/Notifications/ResetPassword.php`

### `auth.mail.reset.line3`

**Used in:**
- `C:\Users\uranium\Documents\Projets\Minecraft\Outland\outland-cms-v2/app/Notifications/ResetPassword.php`

### `auth.mail.verify.subject`

**Used in:**
- `C:\Users\uranium\Documents\Projets\Minecraft\Outland\outland-cms-v2/app/Notifications/VerifyEmail.php`

### `auth.mail.verify.line1`

**Used in:**
- `C:\Users\uranium\Documents\Projets\Minecraft\Outland\outland-cms-v2/app/Notifications/VerifyEmail.php`

### `auth.mail.verify.action`

**Used in:**
- `C:\Users\uranium\Documents\Projets\Minecraft\Outland\outland-cms-v2/app/Notifications/VerifyEmail.php`

### `auth.mail.verify.line2`

**Used in:**
- `C:\Users\uranium\Documents\Projets\Minecraft\Outland\outland-cms-v2/app/Notifications/VerifyEmail.php`

## Unused Translation Keys 🔍

These keys are **defined** in language files but **never used** in the codebase.

**Total:** 1309 keys (95.1% of defined keys)

### `admin.php` (799 unused keys)

<details>
<summary>Click to expand</summary>

```php
admin.nav.settings.settings
admin.nav.settings.global
admin.nav.settings.performances
admin.nav.settings.home
admin.nav.settings.auth
admin.nav.settings.social
admin.nav.other.heading
admin.nav.profile.profile
admin.nav.support
admin.nav.documentation
admin.delete.title
admin.delete.description
admin.footer
admin.dashboard.title
admin.dashboard.welcome
admin.dashboard.users
admin.dashboard.posts
admin.dashboard.pages
admin.dashboard.images
admin.dashboard.registered_accounts
admin.dashboard.published_articles
admin.dashboard.static_pages
admin.dashboard.uploaded_files
admin.dashboard.user_activity
admin.dashboard.registrations_7days
admin.dashboard.security_warning
admin.dashboard.update
admin.dashboard.http
admin.dashboard.cloudflare
admin.dashboard.recent_users
admin.dashboard.active_users
admin.dashboard.emails
admin.settings.index.title
admin.settings.index.name
admin.settings.index.url
admin.settings.index.description
admin.settings.index.meta
admin.settings.index.meta_info
admin.settings.index.favicon
admin.settings.index.background
admin.settings.index.logo
admin.settings.index.timezone
admin.settings.index.locale
admin.settings.index.money
admin.settings.index.copyright
admin.settings.index.user_money_transfer
admin.settings.index.webhook
admin.settings.index.webhook_info
admin.settings.index.site_key
admin.settings.index.site_key_info
... and 749 more
```

</details>

### `messages.php` (171 unused keys)

<details>
<summary>Click to expand</summary>

```php
messages.lang
messages.date.default
messages.date.full
messages.date.compact
messages.nav.toggle
messages.actions.add
messages.actions.back
messages.actions.browse
messages.actions.cancel
messages.actions.choose_file
messages.actions.close
messages.actions.collapse
messages.actions.comment
messages.actions.continue
messages.actions.copy
messages.actions.create
messages.actions.delete
messages.actions.disable
messages.actions.download
messages.actions.duplicate
messages.actions.edit
messages.actions.enable
messages.actions.expand
messages.actions.generate
messages.actions.install
messages.actions.move
messages.actions.refresh
messages.actions.reload
messages.actions.remove
messages.actions.save
messages.actions.search
messages.actions.send
messages.actions.show
messages.actions.sort
messages.actions.update
messages.actions.upload
messages.fields.action
messages.fields.address
messages.fields.author
messages.fields.category
messages.fields.color
messages.fields.content
messages.fields.date
messages.fields.description
messages.fields.enabled
messages.fields.file
messages.fields.game
messages.fields.icon
messages.fields.image
messages.fields.link
... and 121 more
```

</details>

### `validation.php` (165 unused keys)

<details>
<summary>Click to expand</summary>

```php
validation.accepted
validation.accepted_if
validation.active_url
validation.after
validation.after_or_equal
validation.alpha
validation.alpha_dash
validation.alpha_num
validation.array
validation.ascii
validation.before
validation.before_or_equal
validation.between.array
validation.between.file
validation.between.numeric
validation.between.string
validation.boolean
validation.can
validation.confirmed
validation.contains
validation.current_password
validation.date
validation.date_equals
validation.date_format
validation.decimal
validation.declined
validation.declined_if
validation.different
validation.digits
validation.digits_between
validation.dimensions
validation.distinct
validation.doesnt_end_with
validation.doesnt_start_with
validation.email
validation.ends_with
validation.enum
validation.exists
validation.extensions
validation.file
validation.filled
validation.gt.array
validation.gt.file
validation.gt.numeric
validation.gt.string
validation.gte.array
validation.gte.file
validation.gte.numeric
validation.gte.string
validation.image
... and 115 more
```

</details>

### `puck.php` (85 unused keys)

<details>
<summary>Click to expand</summary>

```php
puck.title
puck.description
puck.toolbar.view_page
puck.toolbar.preview
puck.toolbar.edit
puck.toolbar.save
puck.toolbar.saving
puck.toolbar.publish
puck.toolbar.cancel
puck.toolbar.unsaved_changes
puck.toolbar.modifications_discarded
puck.messages.saved
puck.messages.error
puck.components.categories.typography
puck.components.categories.interactive
puck.components.categories.media
puck.components.categories.layout
puck.components.heading_block.name
puck.components.heading_block.description
puck.components.heading_block.fields.level
puck.components.heading_block.fields.text
puck.components.heading_block.fields.align
puck.components.heading_block.align_options.left
puck.components.heading_block.align_options.center
puck.components.heading_block.align_options.right
puck.components.heading_block.level_options.h1
puck.components.heading_block.level_options.h2
puck.components.heading_block.level_options.h3
puck.components.heading_block.level_options.h4
puck.components.heading_block.level_options.h5
puck.components.heading_block.level_options.h6
puck.components.heading_block.default_text
puck.components.paragraph_block.name
puck.components.paragraph_block.description
puck.components.paragraph_block.fields.text
puck.components.paragraph_block.fields.align
puck.components.paragraph_block.align_options.left
puck.components.paragraph_block.align_options.center
puck.components.paragraph_block.align_options.right
puck.components.paragraph_block.default_text
puck.components.button_block.name
puck.components.button_block.description
puck.components.button_block.fields.text
puck.components.button_block.fields.href
puck.components.button_block.fields.variant
puck.components.button_block.fields.size
puck.components.button_block.variant_options.default
puck.components.button_block.variant_options.destructive
puck.components.button_block.variant_options.outline
puck.components.button_block.variant_options.secondary
... and 35 more
```

</details>

### `auth.php` (42 unused keys)

<details>
<summary>Click to expand</summary>

```php
auth.login
auth.register
auth.email
auth.password
auth.confirm_password
auth.remember
auth.no_account
auth.have_account
auth.continue_with
auth.sign_in_with
auth.sign_up_with
auth.google
auth.discord
auth.terms_agree
auth.terms_agree_register
auth.terms_of_service
auth.privacy_policy
auth.and
auth.join_community
auth.community_message
auth.failed
auth.password.incorrect
auth.throttle
auth.verify.title
auth.verify.message
auth.verify.not_received
auth.verify.request_another
auth.verify.sent
auth.two_factor.title
auth.two_factor.code
auth.two_factor.verify
auth.reset.title
auth.reset.send
auth.reset.reset
auth.reset.sent
auth.reset.throttled
auth.reset.token
auth.reset.user
auth.confirm
auth.password_confirm
auth.password_confirm_description
auth.confirming
```

</details>

### `errors.php` (19 unused keys)

<details>
<summary>Click to expand</summary>

```php
errors.error
errors.code
errors.home
errors.whoops
errors.401.title
errors.401.message
errors.403.title
errors.403.message
errors.404.title
errors.404.message
errors.419.title
errors.419.message
errors.429.title
errors.429.message
errors.500.title
errors.500.message
errors.503.title
errors.503.message
errors.fallback.message
```

</details>

### `game.php` (14 unused keys)

<details>
<summary>Click to expand</summary>

```php
game.fivem.id
game.fivem.name
game.fivem.commands
game.steam.id
game.steam.commands
game.epic.id
game.epic.commands
game.xbox.missing
game.minecraft.id
game.minecraft.missing
game.minecraft.child
game.minecraft.commands
game.minecraft_bedrock.id
game.minecraft_bedrock.commands
```

</details>

### `passwords.php` (6 unused keys)

<details>
<summary>Click to expand</summary>

```php
passwords.reset
passwords.sent
passwords.throttled
passwords.token
passwords.user
passwords.change
```

</details>

### `mail.php` (5 unused keys)

<details>
<summary>Click to expand</summary>

```php
mail.hello
mail.whoops
mail.regards
mail.link
mail.copyright
```

</details>

### `pagination.php` (3 unused keys)

<details>
<summary>Click to expand</summary>

```php
pagination.previous
pagination.next
pagination.current
```

</details>

## Duplicate/Overlapping Key Patterns 🔀

These key patterns appear in multiple translation files:

### `email`

- `auth.email`
- `validation.email`

### `home`

- `messages.home`
- `errors.home`

### `whoops`

- `errors.whoops`
- `mail.whoops`

## Translation Coverage by File

| File | Defined | Used | Unused | Coverage |
|------|---------|------|--------|----------|
| `admin.php` | 824 | 25 | 799 | 3% |
| `messages.php` | 201 | 30 | 171 | 14.9% |
| `validation.php` | 169 | 4 | 165 | 2.4% |
| `puck.php` | 85 | 0 | 85 | 0% |
| `auth.php` | 44 | 2 | 42 | 4.5% |
| `errors.php` | 19 | 0 | 19 | 0% |
| `game.php` | 14 | 0 | 14 | 0% |
| `mail.php` | 12 | 7 | 5 | 58.3% |
| `passwords.php` | 6 | 0 | 6 | 0% |
| `pagination.php` | 3 | 0 | 3 | 0% |

## Recommendations 💡

### 🔴 High Priority: Add Missing Keys

- Add the 10 missing translation keys to prevent runtime errors
- Focus on keys used in user-facing components first
- Test all pages in both French and English after adding keys

### 🟡 Medium Priority: Remove Unused Keys

- **1309 unused keys** (95.1% of total) are bloating your translation files
- Consider removing unused keys to reduce maintenance overhead
- Some keys may be used dynamically - verify before removing
- Create a backup before bulk deletion

### 📋 General Best Practices

1. **Consistency**: Follow the existing naming pattern (`file.category.key`)
2. **Documentation**: Document dynamic key construction patterns
3. **Testing**: Test all UI flows in different languages
4. **Automation**: Consider adding translation key validation to CI/CD
5. **Cleanup**: Run this audit quarterly to maintain translation health

---

*This report was generated by the automated translation audit script.*
