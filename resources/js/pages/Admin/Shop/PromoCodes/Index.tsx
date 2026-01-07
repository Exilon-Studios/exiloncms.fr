/**
 * Admin Shop Promo Codes Index
 */

import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import {
  AdminLayout,
  AdminLayoutHeader,
  AdminLayoutContent,
  AdminLayoutTitle,
} from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Trash2, Edit, Gift, Calendar, Tag } from 'lucide-react';
import { useForm } from '@inertiajs/react';

interface PromoCode {
  id: number;
  code: string;
  description: string | null;
  type: 'percentage' | 'fixed';
  value: number;
  min_amount: number | null;
  max_uses: number | null;
  used_count: number;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
}

interface Pagination {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

interface Props extends PageProps {
  promoCodes: PromoCode[];
  pagination: Pagination;
}

export default function PromoCodesIndex({ promoCodes, pagination }: Props) {
  const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
    code: '',
    description: '',
    type: 'percentage',
    value: 0,
    min_amount: null,
    max_uses: null,
    valid_from: '',
    valid_until: '',
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.shop.promo-codes.store'), {
      onSuccess: () => reset(),
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Supprimer ce code promo ?')) {
      router.delete(route('admin.shop.promo-codes.destroy', id));
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Codes promo - Boutique" />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title="Codes promo"
            description="Gérer les codes de réduction"
          />
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="space-y-6">
            {/* Create Form */}
            <div className="border border-border rounded-lg bg-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Créer un code promo
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Code *</label>
                    <input
                      type="text"
                      value={data.code}
                      onChange={e => setData('code', e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      placeholder="PROMO2025"
                      required
                    />
                    {errors.code && <p className="text-sm text-destructive mt-1">{errors.code}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <input
                      type="text"
                      value={data.description}
                      onChange={e => setData('description', e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      placeholder="Description du code"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Type *</label>
                    <select
                      value={data.type}
                      onChange={e => setData('type', e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="percentage">Pourcentage (%)</option>
                      <option value="fixed">Montant fixe</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Valeur *</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        value={data.value}
                        onChange={e => setData('value', parseFloat(e.target.value))}
                        className="flex-1 px-3 py-2 border border-input rounded-md bg-background"
                        placeholder={data.type === 'percentage' ? '10' : '10.00'}
                        required
                      />
                      <span className="text-sm text-muted-foreground">
                        {data.type === 'percentage' ? '%' : '€'}
                      </span>
                    </div>
                    {errors.value && <p className="text-sm text-destructive mt-1">{errors.value}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Montant minimum</label>
                    <input
                      type="number"
                      step="0.01"
                      value={data.min_amount || ''}
                      onChange={e => setData('min_amount', e.target.value ? parseFloat(e.target.value) : null)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      placeholder="50.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Utilisations max</label>
                    <input
                      type="number"
                      value={data.max_uses || ''}
                      onChange={e => setData('max_uses', e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Valide du</label>
                    <input
                      type="date"
                      value={data.valid_from}
                      onChange={e => setData('valid_from', e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Valable jusqu'au</label>
                    <input
                      type="date"
                      value={data.valid_until}
                      onChange={e => setData('valid_until', e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={data.is_active}
                      onChange={e => setData('is_active', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium">Actif</label>
                  </div>
                </div>

                <Button type="submit" disabled={processing}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer le code
                </Button>
              </form>
            </div>

            {/* Promo Codes List */}
            <div className="border border-border rounded-lg overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Valeur</TableHead>
                    <TableHead>Utilisations</TableHead>
                    <TableHead>Validité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promoCodes.map((promo) => (
                    <TableRow key={promo.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{promo.code}</p>
                          {promo.description && (
                            <p className="text-sm text-muted-foreground">{promo.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <Tag className="h-3 w-3" />
                          {promo.type === 'percentage' ? '%' : 'Fixe'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {promo.type === 'percentage' ? `${Number(promo.value)}%` : `${Number(promo.value).toFixed(2)}€`}
                        {promo.min_amount && (
                          <p className="text-xs text-muted-foreground">Min: {Number(promo.min_amount).toFixed(2)}€</p>
                        )}
                      </TableCell>
                      <TableCell>
                        {promo.max_uses ? `${promo.used_count}/${promo.max_uses}` : `${promo.used_count}`}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {promo.valid_from && <p>Du: {new Date(promo.valid_from).toLocaleDateString('fr-FR')}</p>}
                          {promo.valid_until && <p>Au: {new Date(promo.valid_until).toLocaleDateString('fr-FR')}</p>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={promo.is_active ? 'default' : 'secondary'}>
                          {promo.is_active ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.put(route('admin.shop.promo-codes.update', promo.id), {
                              ...data,
                              code: promo.code,
                            })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(promo.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {promoCodes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Aucun code promo
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </AdminLayoutContent>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
