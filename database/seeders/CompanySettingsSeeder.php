<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CompanySettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // Company information for invoices
            'company_name' => 'ExilonStudios',
            'company_address' => '123 Rue de la Startup',
            'company_postal_code' => '75001',
            'company_city' => 'Paris',
            'company_country' => 'France',
            'company_siret' => '123 456 789 00012',
            'company_vat' => 'FR12345678901',
            'company_phone' => '+33 1 23 45 67 89',
            'company_email' => 'contact@exiloncms.com',

            // VAT settings
            'company_vat_rate' => '20',

            // Invoice settings
            'invoice_prefix' => 'FACT-',
            'invoice_footer' => 'Merci de votre confiance !',
        ];

        foreach ($settings as $key => $value) {
            DB::table('settings')->updateOrInsert(
                ['name' => $key],
                ['value' => $value]
            );
        }

        $this->command->info('Company settings seeded successfully!');
    }
}
