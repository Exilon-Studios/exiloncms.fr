import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Wallet, Calendar, ShoppingBag, Settings, Bell, Package, FileText } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { trans } from '@/lib/i18n';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'user': User,
    'wallet': Wallet,
    'calendar': Calendar,
    'shopping-bag': ShoppingBag,
    'settings': Settings,
    'bell': Bell,
    'package': Package,
    'file-text': FileText,
};

interface DashboardUser {
    name: string;
    email: string;
    money: number;
    avatar?: string;
    role: {
        name: string;
    };
    created_at: string;
}

interface DashboardStats {
    account_age: string;
    money: number;
}

interface DashboardSettings {
    money: string;
}

interface DashboardCard {
    id: string;
    title: string;
    description?: string;
    icon?: string;
    link?: string;
    type?: 'info' | 'warning' | 'success' | 'default';
    custom_component?: string;
}

interface DashboardWidget {
    id: string;
    title: string;
    component: string;
    props?: Record<string, any>;
    size?: 'small' | 'medium' | 'large';
    permission?: string;
}

interface DashboardSidebarWidget {
    id: string;
    title: string;
    description?: string;
    icon?: string;
    link?: string;
    props?: Record<string, any>;
}

interface DashboardProps extends PageProps {
    user: DashboardUser;
    stats: DashboardStats;
    settings: DashboardSettings;
    dashboardCards?: DashboardCard[];
    dashboardWidgets?: DashboardWidget[];
    dashboardSidebarWidgets?: DashboardSidebarWidget[];
}

export default function DashboardIndex({ user, stats, settings, dashboardCards = [], dashboardWidgets = [], dashboardSidebarWidgets = [] }: DashboardProps) {
    return (
        <AuthenticatedLayout>
            <Head title={trans('messages.dashboard.title')} />

            <div className="container mx-auto py-8 px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">
                        {trans('messages.dashboard.welcome', { name: user.name })}
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        {trans('messages.dashboard.welcome_subtitle')}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                {trans('messages.dashboard.balance')}
                            </CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {user.money} {settings.money}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                {trans('messages.dashboard.account_age')}
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.account_age}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                {trans('messages.dashboard.role')}
                            </CardTitle>
                            <User className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <Badge variant="secondary">
                                {user.role.name}
                            </Badge>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                {trans('messages.dashboard.status')}
                            </CardTitle>
                            <Bell className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <Badge variant="default" className="bg-green-500">
                                {trans('messages.dashboard.active')}
                            </Badge>
                        </CardContent>
                    </Card>
                </div>

                {/* Plugin Dashboard Cards */}
                {dashboardCards.length > 0 && (
                    <div className="grid gap-6 md:grid-cols-2 mb-8">
                        {dashboardCards.map((card) => (
                            <Card key={card.id} className={card.type === 'warning' ? 'border-yellow-500' : ''}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        {card.icon && <span className="text-2xl">{card.icon}</span>}
                                        {card.title}
                                    </CardTitle>
                                    {card.description && (
                                        <CardDescription>{card.description}</CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    {card.link && (
                                        <Link
                                            href={card.link}
                                            className="inline-flex items-center gap-2 text-primary hover:underline"
                                        >
                                            {trans('messages.dashboard.see_more')}
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Quick Actions */}
                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>{trans('messages.dashboard.quick_actions')}</CardTitle>
                            <CardDescription>
                                {trans('messages.dashboard.quick_actions_subtitle')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link
                                href="/profile"
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                            >
                                <User className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <div className="font-medium">{trans('messages.dashboard.my_profile')}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {trans('messages.dashboard.my_profile_subtitle')}
                                    </div>
                                </div>
                            </Link>
                            <Link
                                href="/notifications"
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                            >
                                <Bell className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <div className="font-medium">{trans('messages.dashboard.notifications')}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {trans('messages.dashboard.notifications_subtitle')}
                                    </div>
                                </div>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Sidebar Widgets (e.g., Shop card with recent orders) */}
                    {dashboardSidebarWidgets.map((widget) => (
                        <Card key={widget.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {widget.icon && <span className="text-2xl">{widget.icon}</span>}
                                    {widget.title}
                                </CardTitle>
                                {widget.description && (
                                    <CardDescription>{widget.description}</CardDescription>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-1">
                                {/* Shop Links */}
                                {widget.props?.links && widget.props.links.length > 0 ? (
                                    widget.props.links.map((link: any, index: number) => {
                                        const IconComponent = iconMap[link.icon] || ShoppingBag;
                                        return (
                                            <Link
                                                key={index}
                                                href={link.href}
                                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                                            >
                                                <IconComponent className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <div className="font-medium">{link.label}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {link.description}
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })
                                ) : widget.link ? (
                                    <Link
                                        href={widget.link}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                                    >
                                        <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">Visiter la boutique</div>
                                            <div className="text-sm text-muted-foreground">
                                                Acheter des articles et des prestiges
                                            </div>
                                        </div>
                                    </Link>
                                ) : null}

                                {/* Recent Orders */}
                                {widget.props?.recentOrders && widget.props.recentOrders.length > 0 && (
                                    <div className="pt-2 border-t">
                                        <div className="text-sm font-medium mb-2">Commandes récentes</div>
                                        <div className="space-y-2">
                                            {widget.props.recentOrders.map((order: any) => (
                                                <div
                                                    key={order.id}
                                                    className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/50"
                                                >
                                                    <div>
                                                        <div className="font-medium">{order.item}</div>
                                                        <div className="text-xs text-muted-foreground">{order.date}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-medium">{order.price} {settings.money}</div>
                                                        <div
                                                            className={`text-xs ${
                                                                order.status === 'completed' || order.status === 'Livré'
                                                                    ? 'text-green-600'
                                                                    : 'text-yellow-600'
                                                            }`}
                                                        >
                                                            {order.status}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Dynamic Widgets Section */}
                {dashboardWidgets.length > 0 ? (
                    <div className="grid gap-6">
                        {dashboardWidgets.map((widget) => (
                            <Card key={widget.id} className={widget.size === 'large' ? 'col-span-2' : ''}>
                                <CardHeader>
                                    <CardTitle>{widget.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-muted-foreground">
                                        Widget: {widget.component}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center text-muted-foreground">
                                <p>Aucun widget disponible pour le moment.</p>
                                <p className="text-sm mt-2">Les plugins peuvent ajouter des widgets personnalisables à cet espace.</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
