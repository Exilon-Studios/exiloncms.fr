<?php

namespace ExilonCMS\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Models\LandingSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ThemeSettingsController extends Controller
{
    public function index()
    {
        $settings = LandingSetting::orderBy('group')->orderBy('order')->get();

        $grouped = $settings->groupBy('group')->map(function ($groupSettings) {
            return $groupSettings->map(function ($setting) {
                return [
                    'id' => $setting->id,
                    'key' => $setting->key,
                    'value' => $setting->value,
                    'type' => $setting->type,
                    'group' => $setting->group,
                    'order' => $setting->order,
                ];
            });
        });

        return Inertia::render('Admin/ThemeSettings/Index', [
            'settings' => $grouped,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.id' => 'required|exists:landing_settings,id',
            'settings.*.value' => 'nullable',
        ]);

        foreach ($validated['settings'] as $settingData) {
            $setting = LandingSetting::find($settingData['id']);
            if ($setting) {
                $setting->value = $settingData['value'];
                $setting->save();
            }
        }

        return redirect()
            ->route('admin.theme-settings.index')
            ->with('success', 'Paramètres du thème mis à jour avec succès.');
    }
}
