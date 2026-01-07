import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Package, FileText, Settings, PackageSearch, ArrowRight, CreditCard, Gift } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { trans } from '@/lib/i18n';

interface PluginProps {
    plugin: {
        id: string;
        name: string;
        version: string;
        description: string;
        author: string;
    };
}

export default function ShopPluginIndex({ plugin }: PluginProps) {
    return (
        <AuthenticatedLayout>
            <Head title={`Plugin - ${plugin.name}`} />

            <div className="space-y-6 w-full">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-primary/10">
                            <ShoppingBag className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{plugin.name}</h1>
                            <p className="text-muted-foreground">{plugin.description}</p>
                        </div>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                        v{plugin.version}
                    </Badge>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-primary/10">
                                    <Package className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">0</div>
                                    <div className="text-sm text-muted-foreground">{trans('shop.items')}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-primary/10">
                                    <PackageSearch className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">0</div>
                                    <div className="text-sm text-muted-foreground">{trans('shop.orders')}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-primary/10">
                                    <FileText className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">0</div>
                                    <div className="text-sm text-muted-foreground">{trans('shop.invoices')}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Configuration */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            {trans('shop.configuration')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-3">
                            {/* Payment Settings - Single unified item */}
                            <Link href="/admin/settings/payments">
                                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <CreditCard className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-medium">{trans('shop.payment')}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {trans('shop.payment_description')}
                                            </div>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </Link>

                            {/* Promo Codes */}
                            <Link href="/admin/shop/promo-codes">
                                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <Gift className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-medium">{trans('shop.promo_codes')}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {trans('shop.promo_codes_description')}
                                            </div>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </Link>

                            {/* Categories */}
                            <Link href="/admin/shop/categories">
                                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <Package className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-medium">{trans('shop.manage_categories')}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {trans('shop.organize_items_by_category')}
                                            </div>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </Link>

                            {/* Items */}
                            <Link href="/admin/shop/items">
                                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <ShoppingBag className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-medium">{trans('shop.manage_items')}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {trans('shop.add_edit_remove_items')}
                                            </div>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
