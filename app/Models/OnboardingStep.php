<?php

namespace ExilonCMS\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OnboardingStep extends Model
{
    protected $fillable = [
        'user_id',
        'step_key',
        'completed',
        'skipped',
        'completed_at',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'skipped' => 'boolean',
        'completed_at' => 'datetime',
    ];

    /**
     * The user that owns this onboarding step.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Mark step as completed.
     */
    public function markAsCompleted(): void
    {
        $this->update([
            'completed' => true,
            'skipped' => false,
            'completed_at' => now(),
        ]);
    }

    /**
     * Mark step as skipped.
     */
    public function markAsSkipped(): void
    {
        $this->update([
            'completed' => false,
            'skipped' => true,
            'completed_at' => now(),
        ]);
    }

    /**
     * Get all onboarding steps in order.
     */
    public static function getAllSteps(): array
    {
        return [
            [
                'key' => 'site_name',
                'title' => 'Nom du site',
                'description' => 'Définissez le nom et la description de votre site',
                'icon' => 'type',
                'importance' => 1, // Most important
            ],
            [
                'key' => 'logo',
                'title' => 'Logo et favicon',
                'description' => 'Ajoutez votre logo personnalisé',
                'icon' => 'image',
                'importance' => 2,
            ],
            [
                'key' => 'theme',
                'title' => 'Apparence',
                'description' => 'Choisissez vos couleurs et le thème',
                'icon' => 'palette',
                'importance' => 3,
            ],
            [
                'key' => 'server',
                'title' => 'Serveur de jeu',
                'description' => 'Connectez votre serveur Minecraft/FiveM',
                'icon' => 'server',
                'importance' => 4,
            ],
            [
                'key' => 'navigation',
                'title' => 'Navigation',
                'description' => 'Configurez votre menu et réseaux sociaux',
                'icon' => 'navigation',
                'importance' => 5,
            ],
            [
                'key' => 'first_page',
                'title' => 'Première page',
                'description' => 'Créez votre page d\'accueil',
                'icon' => 'file',
                'importance' => 6,
            ],
        ];
    }

    /**
     * Get user's onboarding progress.
     */
    public static function getUserProgress(int $userId): array
    {
        $allSteps = self::getAllSteps();
        $userSteps = self::where('user_id', $userId)->pluck('completed', 'step_key')->toArray();

        $progress = [];
        foreach ($allSteps as $step) {
            $progress[] = [
                ...$step,
                'completed' => $userSteps[$step['key']] ?? false,
            ];
        }

        return $progress;
    }

    /**
     * Calculate completion percentage.
     */
    public static function getCompletionPercentage(int $userId): int
    {
        $allSteps = self::getAllSteps();
        $userSteps = self::where('user_id', $userId)
            ->where('completed', true)
            ->count();

        return (int) (($userSteps / count($allSteps)) * 100);
    }

    /**
     * Get next incomplete step.
     */
    public static function getNextStep(int $userId): ?array
    {
        $allSteps = self::getAllSteps();
        $completedKeys = self::where('user_id', $userId)
            ->where(function ($query) {
                $query->where('completed', true)->orWhere('skipped', true);
            })
            ->pluck('step_key')
            ->toArray();

        foreach ($allSteps as $step) {
            if (! in_array($step['key'], $completedKeys)) {
                return $step;
            }
        }

        return null; // All steps completed
    }

    /**
     * Check if onboarding is complete.
     */
    public static function isComplete(int $userId): bool
    {
        return self::getCompletionPercentage($userId) === 100;
    }
}
