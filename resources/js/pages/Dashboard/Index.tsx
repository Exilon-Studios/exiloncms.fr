import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
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
        <DashboardLayout showCart={true}>
            <Head title={trans('dashboard.title')} />

            <div className="container mx-auto py-8 px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">
                        {trans('dashboard.welcome', { name: user.name })}
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        {trans('dashboard.welcome_subtitle')}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                {trans('dashboard.balance')}
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
                                {trans('dashboard.account_age')}
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
                                {trans('dashboard.role')}
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
                                {trans('dashboard.status')}
                            </CardTitle>
                            <Bell className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <Badge variant="default" className="bg-green-500">
                                {trans('dashboard.active')}
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
                                            {trans('dashboard.see_more')}
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Quick Actions */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                    {/* Profile Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{trans('dashboard.my_account')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link
                                href="/profile"
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                            >
                                <User className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <div className="font-medium">{trans('dashboard.my_profile')}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {trans('dashboard.manage_info')}
                                    </div>
                                </div>
                            </Link>
                            <Link
                                href="/notifications"
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                            >
                                <Bell className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <div className="font-medium">{trans('dashboard.notifications')}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {trans('dashboard.view_notifications')}
                                    </div>
                                </div>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Shop Actions */}
                    {dashboardSidebarWidgets.map((widget) => (
                        <Card key={widget.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {widget.icon && widget.icon !== '🛒' && <span className="text-2xl">{widget.icon}</span>}
                                    {widget.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
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
                                            <div className="font-medium">{trans('dashboard.visit_shop')}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {trans('dashboard.buy_items')}
                                            </div>
                                        </div>
                                    </Link>
                                ) : null}
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
                                <p>{trans('dashboard.no_widgets')}</p>
                                <p className="text-sm mt-2">{trans('dashboard.no_widgets_hint')}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}
