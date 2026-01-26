<?php

namespace ShopPlugin\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ShopPlugin\Models\Gateway;
use ShopPlugin\Payment\PaymentManager;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class GatewayController extends Controller
{
    private PaymentManager $paymentManager;

    public function __construct(PaymentManager $paymentManager)
    {
        $this->paymentManager = $paymentManager;
    }

    /**
     * Display a listing of payment gateways.
     */
    public function index()
    {
        return inertia('Shop/Admin/Gateways/Index', [
            'gateways' => Gateway::all()->map(fn ($gateway) => [
                'id' => $gateway->id,
                'type' => $gateway->type,
                'name' => $gateway->name,
                'is_active' => $gateway->is_active,
                'test_mode' => $gateway->test_mode,
                'created_at' => $gateway->created_at,
            ]),
            'availableTypes' => $this->paymentManager->getPaymentMethods()->map(fn ($class, $id) => [
                'id' => $id,
                'name' => app($class)->getName(),
                'image' => app($class)->getImage(),
            ]),
        ]);
    }

    /**
     * Show the form for creating a new gateway.
     */
    public function create()
    {
        return inertia('Shop/Admin/Gateways/Create', [
            'types' => $this->paymentManager->getPaymentMethods()->map(fn ($class, $id) => [
                'id' => $id,
                'name' => app($class)->getName(),
                'image' => app($class)->getImage(),
            ]),
        ]);
    }

    /**
     * Store a newly created gateway in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => ['required', Rule::in($this->paymentManager->getPaymentMethods()->keys()->toArray())],
            'name' => ['required', 'string', 'max:255'],
            'is_active' => ['boolean'],
            'test_mode' => ['boolean'],
            'config' => ['array'],
        ]);

        // Get payment method to validate config
        $paymentMethod = $this->paymentManager->getPaymentMethod($validated['type']);
        if ($paymentMethod) {
            $configRules = $paymentMethod->getConfigRules();
            if (! empty($configRules)) {
                $request->validate($configRules);
            }
        }

        $gateway = Gateway::create($validated);

        return redirect()->route('admin.shop.gateways.index')
            ->with('success', 'Passerelle de paiement créée avec succès.');
    }

    /**
     * Show the form for editing the specified gateway.
     */
    public function edit(Gateway $gateway)
    {
        $paymentMethod = $this->paymentManager->getPaymentMethod($gateway->type, $gateway);

        return inertia('Shop/Admin/Gateways/Edit', [
            'gateway' => [
                'id' => $gateway->id,
                'type' => $gateway->type,
                'name' => $gateway->name,
                'is_active' => $gateway->is_active,
                'test_mode' => $gateway->test_mode,
                'config' => $gateway->config,
            ],
            'paymentMethod' => [
                'name' => $paymentMethod ? $paymentMethod->getName() : $gateway->type,
                'image' => $paymentMethod ? $paymentMethod->getImage() : null,
                'configView' => $paymentMethod ? $paymentMethod->getConfigView() : null,
                'configRules' => $paymentMethod ? $paymentMethod->getConfigRules() : [],
            ],
        ]);
    }

    /**
     * Update the specified gateway in storage.
     */
    public function update(Request $request, Gateway $gateway)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'is_active' => ['boolean'],
            'test_mode' => ['boolean'],
            'config' => ['array'],
        ]);

        // Get payment method to validate config
        $paymentMethod = $this->paymentManager->getPaymentMethod($gateway->type, $gateway);
        if ($paymentMethod) {
            $configRules = $paymentMethod->getConfigRules();
            if (! empty($configRules)) {
                $request->validate($configRules);
            }
        }

        $gateway->update($validated);

        return redirect()->route('admin.shop.gateways.index')
            ->with('success', 'Passerelle de paiement mise à jour avec succès.');
    }

    /**
     * Remove the specified gateway from storage.
     */
    public function destroy(Gateway $gateway)
    {
        $gateway->delete();

        return redirect()->route('admin.shop.gateways.index')
            ->with('success', 'Passerelle de paiement supprimée avec succès.');
    }

    /**
     * Test the gateway connection.
     */
    public function test(Gateway $gateway)
    {
        $paymentMethod = $this->paymentManager->getPaymentMethod($gateway->type, $gateway);

        if (! $paymentMethod) {
            return back()->with('error', 'Type de passerelle invalide.');
        }

        try {
            // For Tebex, test server connection
            if ($gateway->type === 'tebex') {
                $info = $paymentMethod->getServerInfo();
                if ($info) {
                    return back()->with('success', 'Connexion au serveur Tebex réussie.');
                }
            }

            return back()->with('error', 'Impossible de se connecter à la passerelle.');
        } catch (\Exception $e) {
            return back()->with('error', 'Erreur de connexion: ' . $e->getMessage());
        }
    }

    /**
     * Sync packages from Tebex.
     */
    public function syncPackages(Gateway $gateway)
    {
        if ($gateway->type !== 'tebex') {
            return back()->with('error', 'Cette fonctionnalité est uniquement disponible pour Tebex.');
        }

        $paymentMethod = $this->paymentManager->getPaymentMethod($gateway->type, $gateway);

        try {
            $count = $paymentMethod->syncPackages();

            return back()->with('success', "{$count} packages synchronisés depuis Tebex.");
        } catch (\Exception $e) {
            return back()->with('error', 'Erreur lors de la synchronisation: ' . $e->getMessage());
        }
    }
}
