<?php

namespace ExilonCMS\Models;

use ExilonCMS\Models\Traits\HasImage;
use ExilonCMS\Models\Traits\InteractsWithMoney;
use ExilonCMS\Models\Traits\Loggable;
use ExilonCMS\Models\Traits\Searchable;
use ExilonCMS\Models\Traits\TwoFactorAuthenticatable;
use ExilonCMS\Notifications\ResetPassword as ResetPasswordNotification;
use ExilonCMS\Notifications\VerifyEmail as VerifyEmailNotification;
use ExilonCMS\Support\Discord\LinkedRoles;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $name
 * @property string|null $email
 * @property \Carbon\Carbon|null $email_verified_at
 * @property string $password
 * @property int $role_id
 * @property float $money
 * @property string|null $game_id
 * @property string|null $avatar
 * @property string|null $access_token
 * @property string|null $two_factor_secret
 * @property string[]|null $two_factor_recovery_codes
 * @property string|null $last_login_ip
 * @property \Carbon\Carbon|null $last_login_at
 * @property \Carbon\Carbon|null $password_changed_at
 * @property string|null $remember_token
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \Carbon\Carbon|null $deleted_at
 * @property \ExilonCMS\Models\DiscordAccount|null $discordAccount
 * @property \Illuminate\Support\Collection|\ExilonCMS\Models\Post[] $posts
 * @property \Illuminate\Support\Collection|\ExilonCMS\Models\Comment[] $comments
 * @property \Illuminate\Support\Collection|\ExilonCMS\Models\Like[] $likes
 * @property \Illuminate\Support\Collection|\ExilonCMS\Models\Ban[] $bans
 * @property \Illuminate\Support\Collection|\ExilonCMS\Models\Notification[] $notifications
 * @property \Illuminate\Support\Collection|\ExilonCMS\Models\Notification[] $readNotifications
 * @property \Illuminate\Support\Collection|\ExilonCMS\Models\Notification[] $unreadNotifications
 * @property \ExilonCMS\Models\Role $role
 * @property \ExilonCMS\Models\Ban|null $ban
 * @property bool $is_seller
 * @property \Carbon\Carbon|null $seller_verified_at
 * @property int|null $seller_verified_by
 * @property string|null $stripe_account_id
 * @property string|null $paypal_email
 * @property \Illuminate\Support\Collection|\ExilonCMS\Models\Resource[] $resources
 * @property \Illuminate\Support\Collection|\ExilonCMS\Models\ResourcePurchase[] $purchases
 * @property \Illuminate\Support\Collection|\ExilonCMS\Models\ResourceReview[] $reviews
 */
class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory;
    use HasImage;
    use InteractsWithMoney;
    use Loggable;
    use Notifiable;
    use Searchable;
    use TwoFactorAuthenticatable;

    /**
     * The actions to that should be automatically logged.
     *
     * @var array<int, string>
     */
    protected static array $logEvents = []; // Manually log for users

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name', 'email', 'password', 'money', 'role_id', 'game_id', 'avatar',
        'access_token', 'two_factor_secret', 'password_changed_at',
        'is_seller', 'seller_verified_at', 'seller_verified_by',
        'stripe_account_id', 'paypal_email',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password', 'remember_token', 'access_token', 'last_login_ip', 'two_factor_secret',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'password' => 'hashed',
        'money' => 'float',
        'two_factor_recovery_codes' => 'array',
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'password_changed_at' => 'datetime',
        'deleted_at' => 'datetime',
        'is_seller' => 'boolean',
        'seller_verified_at' => 'datetime',
    ];

    /**
     * The relationships that should always be loaded.
     *
     * @var array
     */
    protected $with = [
        'role',
    ];

    /**
     * The attributes that can be used for search.
     *
     * @var array<int, string>
     */
    protected array $searchable = [
        'email', 'name', 'game_id', 'role.*', 'discordAccount.*',
    ];

    /**
     * The column of the image attribute.
     */
    protected string $imageKey = 'avatar';

    protected static function booted(): void
    {
        self::creating(function (self $user) {
            if ($user->password_changed_at === null) {
                $user->password_changed_at = $user->freshTimestamp();
            }
        });

        self::updated(function (self $user) {
            $discordLink = setting('discord.link_roles', false);

            if ($discordLink && $user->isDirty('role_id') && $user->discordAccount !== null) {
                LinkedRoles::linkRole($user->discordAccount);
            }
        });
    }

    /**
     * Get the posts of this user.
     */
    public function posts()
    {
        return $this->hasMany(Post::class, 'author_id');
    }

    /**
     * Get the comments of this user.
     */
    public function comments()
    {
        return $this->hasMany(Comment::class, 'author_id');
    }

    /**
     * Get the likes of this user.
     */
    public function likes()
    {
        return $this->hasMany(Like::class, 'author_id');
    }

    /**
     * Get the role of this user.
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get the active ban of this user if he is currently banned.
     */
    public function ban()
    {
        return $this->hasOne(Ban::class);
    }

    /**
     * Get the bans that the user receives.
     */
    public function bans()
    {
        return $this->hasMany(Ban::class)->withTrashed();
    }

    /**
     * Get the user's notifications.
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class)->latest();
    }

    public function discordAccount()
    {
        return $this->hasOne(DiscordAccount::class);
    }

    /**
     * Get the user's resources.
     */
    public function resources()
    {
        return $this->hasMany(Resource::class, 'author_id');
    }

    /**
     * Get the user's resource purchases.
     */
    public function purchases()
    {
        return $this->hasMany(ResourcePurchase::class, 'buyer_id');
    }

    /**
     * Get the user's resource reviews.
     */
    public function reviews()
    {
        return $this->hasMany(ResourceReview::class);
    }

    /**
     * Get the user's seller verifier.
     */
    public function sellerVerifier()
    {
        return $this->belongsTo(User::class, 'seller_verified_by');
    }

    /**
     * Get the user's avatar url.
     * The size may not correspond depending on the provider.
     */
    public function getAvatar(int $size = 64): string
    {
        if ($this->avatar === null) {
            return game()->getAvatarUrl($this, $size);
        }

        return $this->hasUploadedAvatar()
            ? $this->imageUrl()
            : str_replace('{size}', $size, $this->avatar);
    }

    public function hasUploadedAvatar(): bool
    {
        return $this->avatar !== null && ! Str::isUrl($this->avatar, ['http', 'https']);
    }

    public function canUploadAvatar(): bool
    {
        return $this->avatar === null || $this->hasUploadedAvatar();
    }

    public function isBanned(bool $useCache = false): bool
    {
        if ($useCache) {
            return Cache::remember("users.{$this->id}.banned", now()->addHour(), function () {
                return $this->ban !== null;
            });
        }

        return $this->ban !== null;
    }

    public function isDeleted(): bool
    {
        return $this->deleted_at !== null;
    }

    /**
     * Perform the actual delete query on this model instance.
     */
    protected function performDeleteOnModel(): void
    {
        $this->comments()->delete();
        $this->likes()->delete();
        $this->setRememberToken(null);

        if ($this->hasUploadedAvatar()) {
            $this->deleteImage();
        }

        $this->forceFill([
            'name' => 'Deleted #'.$this->id,
            'email' => null,
            'avatar' => null,
            'password' => Str::random(),
            'role_id' => Role::defaultRoleId(),
            'game_id' => null,
            'access_token' => null,
            'two_factor_secret' => null,
            'email_verified_at' => null,
            'last_login_ip' => null,
            'password_changed_at' => null,
            'deleted_at' => $this->freshTimestamp(),
        ])->save();
    }

    public function flushBanCache(): void
    {
        Cache::forget("users.{$this->id}.banned");
    }

    public function hasPermission($permission): bool
    {
        return $this->role->hasPermission($permission);
    }

    public function hasTwoFactorAuth(): bool
    {
        return $this->two_factor_secret !== null;
    }

    public function hasAdminAccess(): bool
    {
        return $this->can('admin.access');
    }

    public function isAdmin(): bool
    {
        return $this->role->is_admin;
    }

    public function mustChangePassword(): bool
    {
        return $this->password_changed_at === null;
    }

    /**
     * Send the password reset notification.
     */
    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new ResetPasswordNotification($token));
    }

    /**
     * Send the email verification notification.
     */
    public function sendEmailVerificationNotification(): void
    {
        $this->notify(new VerifyEmailNotification());
    }

    /**
     * Check if the user is a seller.
     */
    public function isSeller(): bool
    {
        return $this->is_seller;
    }

    /**
     * Check if the user is a verified seller.
     */
    public function isSellerVerified(): bool
    {
        return $this->is_seller && $this->seller_verified_at !== null;
    }

    /**
     * Check if the user's seller account is pending verification.
     */
    public function isSellerPending(): bool
    {
        return $this->is_seller && $this->seller_verified_at === null;
    }

    /**
     * Mark the user as a seller.
     */
    public function markAsSeller(): void
    {
        $this->update(['is_seller' => true]);
    }

    /**
     * Verify the user as a seller.
     */
    public function verifySeller(int $adminId): void
    {
        $this->update([
            'seller_verified_at' => now(),
            'seller_verified_by' => $adminId,
        ]);
    }

    /**
     * Revoke seller verification from the user.
     */
    public function revokeSellerVerification(): void
    {
        $this->update([
            'seller_verified_at' => null,
            'seller_verified_by' => null,
        ]);
    }

    /**
     * Remove seller status from the user.
     */
    public function removeSellerStatus(): void
    {
        $this->update([
            'is_seller' => false,
            'seller_verified_at' => null,
            'seller_verified_by' => null,
        ]);
    }

    /**
     * Get the user's total earnings from resource sales.
     */
    public function getTotalEarningsAttribute(): float
    {
        return ResourcePurchase::whereHas('resource', function ($query) {
            $query->where('author_id', $this->id);
        })->completed()->sum('amount');
    }

    /**
     * Get the user's total sales count.
     */
    public function getTotalSalesCountAttribute(): int
    {
        return ResourcePurchase::whereHas('resource', function ($query) {
            $query->where('author_id', $this->id);
        })->completed()->count();
    }
}
