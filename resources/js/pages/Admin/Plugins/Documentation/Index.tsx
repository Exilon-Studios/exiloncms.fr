import { Head } from '@inertiajs/react';
import { trans } from '@/lib/i18n';
import {
  FileText,
  Folder,
  Globe,
  Database,
  ArrowRight,
} from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Stats {
  total_pages: number;
  total_categories: number;
  total_locales: number;
  cached_pages: number;
}

interface Props {
  stats: Stats;
}

export default function DocumentationIndex({ stats }: Props) {
  const cards = [
    {
      title: trans('admin.documentation.stats.total_pages'),
      value: stats.total_pages,
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: trans('admin.documentation.stats.total_categories'),
      value: stats.total_categories,
      icon: Folder,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: trans('admin.documentation.stats.total_locales'),
      value: stats.total_locales,
      icon: Globe,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: trans('admin.documentation.stats.cached_pages'),
      value: stats.cached_pages,
      icon: Database,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  const quickActions = [
    {
      title: trans('admin.documentation.menu.browse'),
      description: trans('admin.documentation.actions.browse_description'),
      href: route('admin.plugins.documentation.browse'),
      icon: FileText,
    },
    {
      title: trans('admin.documentation.menu.configuration'),
      description: trans('admin.documentation.actions.config_description'),
      href: route('admin.plugins.documentation.config'),
      icon: Database,
    },
    {
      title: trans('admin.documentation.menu.cache'),
      description: trans('admin.documentation.actions.cache_description'),
      href: route('admin.plugins.documentation.cache.index'),
      icon: Database,
    },
  ];

  return (
    <>
      <Head title={trans('admin.documentation.title')} />

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {trans('admin.documentation.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {trans('admin.documentation.description')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {trans('admin.documentation.quick_actions')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="p-2 bg-muted rounded-lg">
                  <action.icon className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{action.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {action.description}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
