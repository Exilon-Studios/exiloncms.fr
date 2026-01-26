<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Models\OnboardingStep;
use ExilonCMS\Models\Server;
use ExilonCMS\Models\Setting;
use ExilonCMS\Models\SocialLink;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OnboardingController extends Controller
{
    /**
     * Show the onboarding wizard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $currentStep = $request->query('step', 'site_name');
        $allSteps = OnboardingStep::getAllSteps();
        $userProgress = OnboardingStep::getUserProgress($user->id);
        $completion = OnboardingStep::getCompletionPercentage($user->id);

        // Find current step index
        $currentStepIndex = collect($allSteps)->search(fn ($step) => $step['key'] === $currentStep) ?? 0;

        // Get existing data for the current step
        $existingData = $this->getStepData($currentStep);

        return Inertia::render('Admin/Onboarding/Index', [
            'allSteps' => $allSteps,
            'currentStep' => $currentStep,
            'currentStepIndex' => $currentStepIndex,
            'userProgress' => $userProgress,
            'completion' => $completion,
            'existingData' => $existingData,
            'settings' => [
                'name' => setting('name'),
                'description' => setting('description'),
                'logo' => setting('logo'),
                'favicon' => setting('favicon'),
                'darkTheme' => setting('dark_theme'),
                'primaryColor' => setting('primary_color'),
                'secondaryColor' => setting('secondary_color'),
            ],
        ]);
    }

    /**
     * Save onboarding step.
     */
    public function saveStep(Request $request, string $step): RedirectResponse
    {
        $user = $request->user();

        match ($step) {
            'site_name' => $this->saveSiteName($request),
            'logo' => $this->saveLogo($request),
            'theme' => $this->saveTheme($request),
            'server' => $this->saveServer($request),
            'navigation' => $this->saveNavigation($request),
            'first_page' => $this->saveFirstPage($request),
            default => null,
        };

        // Mark step as completed
        OnboardingStep::updateOrCreate(
            ['user_id' => $user->id, 'step_key' => $step],
            ['completed' => true, 'completed_at' => now()]
        );

        return redirect()->route('admin.onboarding', ['step' => $this->getNextStepKey($step)]);
    }

    /**
     * Skip onboarding step.
     */
    public function skipStep(Request $request, string $step): RedirectResponse
    {
        $user = $request->user();

        OnboardingStep::updateOrCreate(
            ['user_id' => $user->id, 'step_key' => $step],
            ['skipped' => true, 'completed_at' => now()]
        );

        return redirect()->route('admin.onboarding', ['step' => $this->getNextStepKey($step)]);
    }

    /**
     * Complete onboarding (skip all remaining).
     */
    public function complete(Request $request): RedirectResponse
    {
        $user = $request->user();
        $allSteps = OnboardingStep::getAllSteps();

        foreach ($allSteps as $step) {
            OnboardingStep::updateOrCreate(
                ['user_id' => $user->id, 'step_key' => $step['key']],
                ['completed' => true, 'completed_at' => now()]
            );
        }

        return redirect()->route('admin.dashboard')->with('success', 'Configuration terminée !');
    }

    // ============================================================
    // STEP HANDLERS
    // ============================================================

    protected function saveSiteName(Request $request): void
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        Setting::updateOrCreate(['key' => 'name'], [
            'name' => 'Site Name',
            'value' => $validated['name'],
            'type' => 'text',
            'group' => 'general',
        ]);

        if ($request->filled('description')) {
            Setting::updateOrCreate(['key' => 'description'], [
                'name' => 'Site Description',
                'value' => $validated['description'],
                'type' => 'textarea',
                'group' => 'general',
            ]);
        }
    }

    protected function saveLogo(Request $request): void
    {
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('uploads/logo', 'public');
            Setting::updateOrCreate(['key' => 'logo'], [
                'name' => 'Logo',
                'value' => $path,
                'type' => 'image',
                'group' => 'general',
            ]);
        }

        if ($request->hasFile('favicon')) {
            $path = $request->file('favicon')->store('uploads', 'public');
            Setting::updateOrCreate(['key' => 'favicon'], [
                'name' => 'Favicon',
                'value' => $path,
                'type' => 'image',
                'group' => 'general',
            ]);
        }
    }

    protected function saveTheme(Request $request): void
    {
        $validated = $request->validate([
            'dark_theme' => 'nullable|boolean',
            'primary_color' => 'nullable|string',
            'secondary_color' => 'nullable|string',
        ]);

        if ($request->has('dark_theme')) {
            Setting::updateOrCreate(['key' => 'dark_theme'], [
                'name' => 'Dark Theme',
                'value' => $validated['dark_theme'] ? '1' : '0',
                'type' => 'boolean',
                'group' => 'appearance',
            ]);
        }

        if ($request->filled('primary_color')) {
            Setting::updateOrCreate(['key' => 'primary_color'], [
                'name' => 'Primary Color',
                'value' => $validated['primary_color'],
                'type' => 'color',
                'group' => 'appearance',
            ]);
        }

        if ($request->filled('secondary_color')) {
            Setting::updateOrCreate(['key' => 'secondary_color'], [
                'name' => 'Secondary Color',
                'value' => $validated['secondary_color'],
                'type' => 'color',
                'group' => 'appearance',
            ]);
        }
    }

    protected function saveServer(Request $request): void
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:minecraft-java,minecraft-bedrock,fivem',
            'address' => 'required|string|max:255',
            'port' => 'nullable|integer',
        ]);

        Server::updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                'name' => $validated['name'],
                'type' => $validated['type'],
                'ip' => $validated['address'],
                'port' => $validated['port'] ?? ($validated['type'] === 'minecraft-java' ? 25565 : 19132),
                'is_default' => true,
            ]
        );
    }

    protected function saveNavigation(Request $request): void
    {
        // Save social links
        if ($request->has('social_links')) {
            foreach ($request->input('social_links') as $index => $link) {
                if (! empty($link['url']) && ! empty($link['title'])) {
                    SocialLink::updateOrCreate(
                        ['id' => $link['id'] ?? null],
                        [
                            'title' => $link['title'],
                            'value' => $link['url'],
                            'icon' => $link['icon'] ?? 'link',
                            'color' => $link['color'] ?? '#666666',
                            'position' => $index,
                        ]
                    );
                }
            }
        }
    }

    protected function saveFirstPage(Request $request): void
    {
        // This is just a marker - the user will create pages in the admin
        // We mark this step as done if they click "Create Page Later"
    }

    // ============================================================
    // HELPERS
    // ============================================================

    protected function getNextStepKey(string $currentStep): ?string
    {
        $allSteps = OnboardingStep::getAllSteps();
        $currentIndex = collect($allSteps)->search(fn ($step) => $step['key'] === $currentStep);

        if ($currentIndex === false || $currentIndex === count($allSteps) - 1) {
            return null; // Last step or not found
        }

        return $allSteps[$currentIndex + 1]['key'];
    }

    protected function getStepData(string $step): array
    {
        return match ($step) {
            'site_name' => [
                'name' => setting('name'),
                'description' => setting('description'),
            ],
            'logo' => [
                'logo' => setting('logo'),
                'favicon' => setting('favicon'),
            ],
            'theme' => [
                'dark_theme' => setting('dark_theme') === '1',
                'primary_color' => setting('primary_color'),
                'secondary_color' => setting('secondary_color'),
            ],
            'navigation' => [
                'social_links' => SocialLink::orderBy('position')->get()->toArray(),
            ],
            default => [],
        };
    }
}
