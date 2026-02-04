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
import { trans } from '@/lib/i18n';

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
  const typeLabels: Record<string, { label: string; badge: string; suffix: string }> = {
    percentage: {
      label: trans('admin.shop.promo_codes.type.percentage'),
      badge: trans('admin.shop.promo_codes.type_badge.percentage'),
      suffix: '%',
    },
    fixed: {
      label: trans('admin.shop.promo_codes.type.fixed'),
      badge: trans('admin.shop.promo_codes.type_badge.fixed'),
      suffix: '€',
    },
  };

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
    if (confirm(trans('admin.shop.promo_codes.delete_confirm'))) {
      router.delete(route('admin.shop.promo-codes.destroy', id));
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title={`${trans('admin.shop.promo_codes.title')} - Boutique`} />

      <AdminLayout>
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title={trans('admin.shop.promo_codes.title')}
            description={trans('admin.shop.promo_codes.description')}
          />
        </AdminLayoutHeader>

        <AdminLayoutContent>
          <div className="space-y-6">
            {/* Create Form */}
            <div className="border border-border rounded-lg bg-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Gift className="h-5 w-5" />
                {trans('admin.shop.promo_codes.create')}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{trans('admin.shop.promo_codes.form.code')} *</label>
                    <input
                      type="text"
                      value={data.code}
                      onChange={e => setData('code', e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      placeholder={trans('admin.shop.promo_codes.form.code_placeholder')}
                      required
                    />
                    {errors.code && <p className="text-sm text-destructive mt-1">{errors.code}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">{trans('admin.shop.promo_codes.form.description')}</label>
                    <input
                      type="text"
                      value={data.description}
                      onChange={e => setData('description', e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      placeholder={trans('admin.shop.promo_codes.form.description_placeholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">{trans('admin.shop.promo_codes.form.type')} *</label>
                    <select
                      value={data.type}
                      onChange={e => setData('type', e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="percentage">{trans('admin.shop.promo_codes.type.percentage')} (%)</option>
                      <option value="fixed">{trans('admin.shop.promo_codes.type.fixed')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">{trans('admin.shop.promo_codes.form.value')} *</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        value={data.value}
                        onChange={e => setData('value', parseFloat(e.target.value))}
                        className="flex-1 px-3 py-2 border border-input rounded-md bg-background"
                        placeholder={data.type === 'percentage' ? trans('admin.shop.promo_codes.form.value_placeholder_percentage') : trans('admin.shop.promo_codes.form.value_placeholder_fixed')}
                        required
                      />
                      <span className="text-sm text-muted-foreground">
                        {typeLabels[data.type].suffix}
                      </span>
                    </div>
                    {errors.value && <p className="text-sm text-destructive mt-1">{errors.value}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">{trans('admin.shop.promo_codes.form.min_amount')}</label>
                    <input
                      type="number"
                      step="0.01"
                      value={data.min_amount || ''}
                      onChange={e => setData('min_amount', e.target.value ? parseFloat(e.target.value) : null)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      placeholder={trans('admin.shop.promo_codes.form.min_amount_placeholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">{trans('admin.shop.promo_codes.form.max_uses')}</label>
                    <input
                      type="number"
                      value={data.max_uses || ''}
                      onChange={e => setData('max_uses', e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      placeholder={trans('admin.shop.promo_codes.form.max_uses_placeholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">{trans('admin.shop.promo_codes.form.valid_from')}</label>
                    <input
                      type="date"
                      value={data.valid_from}
                      onChange={e => setData('valid_from', e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">{trans('admin.shop.promo_codes.form.valid_until')}</label>
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
                    <label htmlFor="is_active" className="text-sm font-medium">{trans('admin.shop.promo_codes.form.is_active')}</label>
                  </div>
                </div>

                <Button type="submit" disabled={processing}>
                  <Plus className="h-4 w-4 mr-2" />
                  {trans('admin.shop.promo_codes.create_button')}
                </Button>
              </form>
            </div>

            {/* Promo Codes List */}
            <div className="border border-border rounded-lg overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{trans('admin.shop.promo_codes.table.code')}</TableHead>
                    <TableHead>{trans('admin.shop.promo_codes.table.type')}</TableHead>
                    <TableHead>{trans('admin.shop.promo_codes.table.value')}</TableHead>
                    <TableHead>{trans('admin.shop.promo_codes.table.used')}</TableHead>
                    <TableHead>{trans('admin.shop.promo_codes.table.valid_until')}</TableHead>
                    <TableHead>{trans('admin.shop.promo_codes.table.status')}</TableHead>
                    <TableHead>{trans('admin.shop.promo_codes.table.actions')}</TableHead>
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
                          {typeLabels[promo.type].badge}
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
                          {promo.valid_from && <p>{trans('admin.shop.promo_codes.date_from')} {new Date(promo.valid_from).toLocaleDateString('fr-FR')}</p>}
                          {promo.valid_until && <p>{trans('admin.shop.promo_codes.date_until')} {new Date(promo.valid_until).toLocaleDateString('fr-FR')}</p>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={promo.is_active ? 'default' : 'secondary'}>
                          {promo.is_active ? trans('admin.shop.promo_codes.status.active') : trans('admin.shop.promo_codes.status.inactive')}
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
                        {trans('admin.shop.promo_codes.empty')}
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
