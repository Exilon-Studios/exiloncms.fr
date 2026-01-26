<?php

namespace ExilonCMS\Plugins\Legal\Http\Controllers\Admin;

use ExilonCMS\Http\Controllers\Controller;
use ExilonCMS\Plugins\Legal\Models\LegalPage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LegalPageController extends Controller
{
    public function index(Request $request)
    {
        $locale = $request->get('locale', app()->getLocale());
        $pages = LegalPage::forLocale($locale)->get();

        return Inertia::render('Admin/Legal/Index', [
            'pages' => $pages,
            'locale' => $locale,
            'availableLocales' => config('locales.available', ['en', 'fr']),
        ]);
    }

    public function edit(Request $request, LegalPage $page)
    {
        return Inertia::render('Admin/Legal/Edit', [
            'page' => $page,
            'availableLocales' => config('locales.available', ['en', 'fr']),
        ]);
    }

    public function update(Request $request, LegalPage $page)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'is_enabled' => 'boolean',
        ]);

        $validated['last_modified_by'] = $request->user()->id;
        $page->update($validated);

        return back()->with('success', 'Legal page updated successfully.');
    }

    public function createDefault(Request $request)
    {
        $type = $request->input('type');
        $locale = $request->input('locale', app()->getLocale());

        // Check if already exists
        $existing = LegalPage::byType($type)->forLocale($locale)->first();
        if ($existing) {
            return back()->with('error', 'This legal page already exists.');
        }

        $defaultContent = $this->getDefaultContent($type, $locale);

        LegalPage::create([
            'type' => $type,
            'locale' => $locale,
            'title' => $defaultContent['title'],
            'content' => $defaultContent['content'],
            'is_enabled' => true,
            'last_modified_by' => $request->user()->id,
        ]);

        return back()->with('success', 'Legal page created successfully.');
    }

    protected function getDefaultContent(string $type, string $locale): array
    {
        $defaults = [
            'privacy' => [
                'en' => [
                    'title' => 'Privacy Policy',
                    'content' => "<h1>Privacy Policy</h1>\n<p>Last updated: {date}</p>\n\n<h2>1. Information We Collect</h2>\n<p>We collect information you provide directly to us...</p>\n\n<h2>2. How We Use Your Information</h2>\n<p>We use the information we collect to...</p>\n\n<h2>3. Data Security</h2>\n<p>We implement security measures to protect your data...</p>\n\n<h2>4. Your Rights</h2>\n<p>You have the right to access, update, or delete your data...</p>\n\n<h2>5. Contact Us</h2>\n<p>If you have questions, contact us at...</p>",
                ],
                'fr' => [
                    'title' => 'Politique de Confidentialité',
                    'content' => "<h1>Politique de Confidentialité</h1>\n<p>Dernière mise à jour : {date}</p>\n\n<h2>1. Informations Collectées</h2>\n<p>Nous collectons les informations que vous nous fournissez...</p>\n\n<h2>2. Utilisation des Informations</h2>\n<p>Nous utilisons les informations collectées pour...</p>\n\n<h2>3. Sécurité des Données</h2>\n<p>Nous mettons en œuvre des mesures de sécurité pour protéger vos données...</p>\n\n<h2>4. Vos Droits</h2>\n<p>Vous avez le droit d'accéder, mettre à jour ou supprimer vos données...</p>\n\n<h2>5. Nous Contacter</h2>\n<p>Pour toute question, contactez-nous à...</p>",
                ],
            ],
            'terms' => [
                'en' => [
                    'title' => 'Terms of Service',
                    'content' => "<h1>Terms of Service</h1>\n<p>Last updated: {date}</p>\n\n<h2>1. Acceptance of Terms</h2>\n<p>By accessing this website, you agree to be bound by these terms...</p>\n\n<h2>2. Use License</h2>\n<p>Permission is granted to use this website for personal use...</p>\n\n<h2>3. User Conduct</h2>\n<p>You agree not to engage in any conduct that...</p>\n\n<h2>4. Disclaimer</h2>\n<p>The materials on this website are provided 'as is'...</p>\n\n<h2>5. Governing Law</h2>\n<p>These terms are governed by the laws of...</p>",
                ],
                'fr' => [
                    'title' => 'Conditions d\'Utilisation',
                    'content' => "<h1>Conditions d'Utilisation</h1>\n<p>Dernière mise à jour : {date}</p>\n\n<h2>1. Acceptation des Conditions</h2>\n<p>En accédant à ce site web, vous acceptez d'être lié par ces conditions...</p>\n\n<h2>2. Licence d'Utilisation</h2>\n<p>La permission est accordée d'utiliser ce site web pour un usage personnel...</p>\n\n<h2>3. Conduite de l'Utilisateur</h2>\n<p>Vous acceptez de ne pas vous engager dans tout comportement qui...</p>\n\n<h2>4. Clause de Non-Responsabilité</h2>\n<p>Les matériaux de ce site web sont fournis 'tels quels'...</p>\n\n<h2>5. Loi Applicable</h2>\n<p>Ces conditions sont régies par les lois de...</p>",
                ],
            ],
            'cookies' => [
                'en' => [
                    'title' => 'Cookie Policy',
                    'content' => "<h1>Cookie Policy</h1>\n<p>Last updated: {date}</p>\n\n<h2>1. What Are Cookies</h2>\n<p>Cookies are small text files stored on your device...</p>\n\n<h2>2. How We Use Cookies</h2>\n<p>We use cookies to...</p>\n\n<h2>3. Types of Cookies We Use</h2>\n<ul>\n<li>Essential cookies</li>\n<li>Analytics cookies</li>\n<li>Functional cookies</li>\n</ul>\n\n<h2>4. Managing Cookies</h2>\n<p>You can control and manage cookies through your browser settings...</p>\n\n<h2>5. Third-Party Cookies</h2>\n<p>Some cookies are placed by third-party services...</p>",
                ],
                'fr' => [
                    'title' => 'Politique de Cookies',
                    'content' => "<h1>Politique de Cookies</h1>\n<p>Dernière mise à jour : {date}</p>\n\n<h2>1. Qu'est-ce que les Cookies</h2>\n<p>Les cookies sont de petits fichiers texte stockés sur votre appareil...</p>\n\n<h2>2. Utilisation des Cookies</h2>\n<p>Nous utilisons des cookies pour...</p>\n\n<h2>3. Types de Cookies Utilisés</h2>\n<ul>\n<li>Cookies essentiels</li>\n<li>Cookies analytiques</li>\n<li>Cookies fonctionnels</li>\n</ul>\n\n<h2>4. Gestion des Cookies</h2>\n<p>Vous pouvez contrôler et gérer les cookies via les paramètres de votre navigateur...</p>\n\n<h2>5. Cookies Tiers</h2>\n<p>Certains cookies sont placés par des services tiers...</p>",
                ],
            ],
            'refund' => [
                'en' => [
                    'title' => 'Refund Policy',
                    'content' => "<h1>Refund Policy</h1>\n<p>Last updated: {date}</p>\n\n<h2>1. Digital Products</h2>\n<p>Due to the nature of digital products, all sales are final...</p>\n\n<h2>2. Subscription Refunds</h2>\n<p>You may request a refund within 7 days of purchase...</p>\n\n<h2>3. How to Request a Refund</h2>\n<p>To request a refund, contact our support team with...</p>\n\n<h2>4>Refund Processing</h2>\n<p>Refunds are processed within 5-10 business days...</p>\n\n<h2>5>Exceptions</h2>\n<p>We reserve the right to refuse refunds in cases of...</p>",
                ],
                'fr' => [
                    'title' => 'Politique de Remboursement',
                    'content' => "<h1>Politique de Remboursement</h1>\n<p>Dernière mise à jour : {date}</p>\n\n<h2>1. Produits Numériques</h2>\n<p>En raison de la nature des produits numériques, toutes les ventes sont finales...</p>\n\n<h2>2. Remboursements d'Abonnements</h2>\n<p>Vous pouvez demander un remboursement dans les 7 jours suivant l'achat...</p>\n\n<h2>3. Comment Demander un Remboursement</h2>\n<p>Pour demander un remboursement, contactez notre équipe de support avec...</p>\n\n<h2>4. Traitement des Remboursements</h2>\n<p>Les remboursements sont traités dans les 5 à 10 jours ouvrables...</p>\n\n<h2>5. Exceptions</h2>\n<p>Nous nous réservons le droit de refuser les remboursements en cas de...</p>",
                ],
            ],
        ];

        return $defaults[$type][$locale] ?? $defaults[$type]['en'];
    }
}
