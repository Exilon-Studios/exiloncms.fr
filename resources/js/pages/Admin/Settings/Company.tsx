import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Save, Loader2 } from 'lucide-react';
import { trans } from '@/lib/i18n';

interface CompanySettingsProps {
  settings: {
    company_name?: string;
    company_address?: string;
    company_postal_code?: string;
    company_city?: string;
    company_country?: string;
    company_siret?: string;
    company_vat?: string;
    company_phone?: string;
    company_email?: string;
    company_type?: 'company' | 'association' | 'micro_enterprise' | 'auto_entrepreneur';
    company_vat_rate?: string;
    company_website?: string;
  };
}

const companyTypes = [
  { value: 'company', label: 'Entreprise (SARL, SAS, etc.)' },
  { value: 'association', label: 'Association loi 1901' },
  { value: 'micro_enterprise', label: 'Micro-entreprise' },
  { value: 'auto_entrepreneur', label: 'Auto-entrepreneur' },
];

export default function CompanySettings({ settings }: CompanySettingsProps) {
  const { data, setData, post, processing, errors } = useForm({
    company_name: settings.company_name || '',
    company_address: settings.company_address || '',
    company_postal_code: settings.company_postal_code || '',
    company_city: settings.company_city || '',
    company_country: settings.company_country || 'France',
    company_siret: settings.company_siret || '',
    company_vat: settings.company_vat || '',
    company_phone: settings.company_phone || '',
    company_email: settings.company_email || '',
    company_type: settings.company_type || 'company',
    company_vat_rate: settings.company_vat_rate || '20',
    company_website: settings.company_website || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.settings.company.update'));
  };

  return (
    <AuthenticatedLayout>
      <Head title={trans('admin.company.title')} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{trans('admin.company.title')}</h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
              {trans('admin.company.description')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de l'entreprise</CardTitle>
                <CardDescription>
                  Ces informations apparaîtront sur vos factures et mentions légales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Company Type */}
                <div className="space-y-2">
                  <Label htmlFor="company_type">Type d'entreprise *</Label>
                  <Select
                    value={data.company_type}
                    onValueChange={(value) => setData('company_type', value as any)}
                  >
                    <SelectTrigger id="company_type">
                      <SelectValue placeholder="Sélectionnez le type d'entreprise" />
                    </SelectTrigger>
                    <SelectContent>
                      {companyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.company_type && (
                    <p className="text-sm text-red-600">{errors.company_type}</p>
                  )}
                </div>

                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="company_name">Nom de l'entreprise / Association *</Label>
                  <Input
                    id="company_name"
                    value={data.company_name}
                    onChange={(e) => setData('company_name', e.target.value)}
                    placeholder="Ex: ExilonStudios"
                  />
                  {errors.company_name && (
                    <p className="text-sm text-red-600">{errors.company_name}</p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="company_address">Adresse *</Label>
                  <Input
                    id="company_address"
                    value={data.company_address}
                    onChange={(e) => setData('company_address', e.target.value)}
                    placeholder="123 Rue de la Startup"
                  />
                  {errors.company_address && (
                    <p className="text-sm text-red-600">{errors.company_address}</p>
                  )}
                </div>

                {/* Postal Code and City */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_postal_code">Code postal *</Label>
                    <Input
                      id="company_postal_code"
                      value={data.company_postal_code}
                      onChange={(e) => setData('company_postal_code', e.target.value)}
                      placeholder="75001"
                    />
                    {errors.company_postal_code && (
                      <p className="text-sm text-red-600">{errors.company_postal_code}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_city">Ville *</Label>
                    <Input
                      id="company_city"
                      value={data.company_city}
                      onChange={(e) => setData('company_city', e.target.value)}
                      placeholder="Paris"
                    />
                    {errors.company_city && (
                      <p className="text-sm text-red-600">{errors.company_city}</p>
                    )}
                  </div>
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label htmlFor="company_country">Pays *</Label>
                  <Input
                    id="company_country"
                    value={data.company_country}
                    onChange={(e) => setData('company_country', e.target.value)}
                    placeholder="France"
                  />
                  {errors.company_country && (
                    <p className="text-sm text-red-600">{errors.company_country}</p>
                  )}
                </div>

                {/* SIRET */}
                <div className="space-y-2">
                  <Label htmlFor="company_siret">
                    SIRET
                    {data.company_type === 'association' && ' (ou RNA pour associations)'}
                  </Label>
                  <Input
                    id="company_siret"
                    value={data.company_siret}
                    onChange={(e) => setData('company_siret', e.target.value)}
                    placeholder="123 456 789 00012"
                  />
                  <p className="text-xs text-muted-foreground">
                    14 chiffres pour les entreprises, 10 chiffres (W...) pour les associations
                  </p>
                  {errors.company_siret && (
                    <p className="text-sm text-red-600">{errors.company_siret}</p>
                  )}
                </div>

                {/* VAT Number */}
                <div className="space-y-2">
                  <Label htmlFor="company_vat">Numéro de TVA Intracommunautaire</Label>
                  <Input
                    id="company_vat"
                    value={data.company_vat}
                    onChange={(e) => setData('company_vat', e.target.value)}
                    placeholder="FR12345678901"
                    disabled={data.company_type === 'association' || data.company_type === 'auto_entrepreneur' || data.company_type === 'micro_enterprise'}
                  />
                  {(data.company_type === 'association' || data.company_type === 'auto_entrepreneur' || data.company_type === 'micro_enterprise') && (
                    <p className="text-xs text-muted-foreground">
                      Non applicable pour ce type d'entreprise (franchise de TVA)
                    </p>
                  )}
                  {errors.company_vat && (
                    <p className="text-sm text-red-600">{errors.company_vat}</p>
                  )}
                </div>

                {/* VAT Rate */}
                <div className="space-y-2">
                  <Label htmlFor="company_vat_rate">
                    Taux de TVA (%)
                  </Label>
                  <Input
                    id="company_vat_rate"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={data.company_vat_rate}
                    onChange={(e) => setData('company_vat_rate', e.target.value)}
                    placeholder="20"
                    disabled={data.company_type === 'association' || data.company_type === 'auto_entrepreneur' || data.company_type === 'micro_enterprise'}
                  />
                  {(data.company_type === 'association' || data.company_type === 'auto_entrepreneur' || data.company_type === 'micro_enterprise') && (
                    <p className="text-xs text-muted-foreground">
                      Franchise de TVA - ne s'applique pas
                    </p>
                  )}
                  {errors.company_vat_rate && (
                    <p className="text-sm text-red-600">{errors.company_vat_rate}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Coordonnées de contact</CardTitle>
                <CardDescription>
                  Informations de contact visibles sur les factures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="company_email">Email de contact *</Label>
                  <Input
                    id="company_email"
                    type="email"
                    value={data.company_email}
                    onChange={(e) => setData('company_email', e.target.value)}
                    placeholder="contact@exemple.com"
                  />
                  {errors.company_email && (
                    <p className="text-sm text-red-600">{errors.company_email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="company_phone">Téléphone</Label>
                  <Input
                    id="company_phone"
                    type="tel"
                    value={data.company_phone}
                    onChange={(e) => setData('company_phone', e.target.value)}
                    placeholder="+33 1 23 45 67 89"
                  />
                  {errors.company_phone && (
                    <p className="text-sm text-red-600">{errors.company_phone}</p>
                  )}
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <Label htmlFor="company_website">Site web</Label>
                  <Input
                    id="company_website"
                    type="url"
                    value={data.company_website}
                    onChange={(e) => setData('company_website', e.target.value)}
                    placeholder="https://exemple.com"
                  />
                  {errors.company_website && (
                    <p className="text-sm text-red-600">{errors.company_website}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={processing} className="gap-2">
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Enregistrer les paramètres
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
