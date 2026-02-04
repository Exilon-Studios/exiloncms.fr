import { Head, usePage, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { IconBook, IconFileText, IconArrowRight } from '@tabler/icons-react';

interface DocumentationIndexProps {
  locale: string;
  availableLocales: string[];
  categories: any[];
  navigation: any[];
}

export default function DocumentationIndex({
  locale,
  availableLocales,
  categories,
  navigation,
}: DocumentationIndexProps) {
  const { settings } = usePage<PageProps>().props;

  return (
    <div className={settings.darkTheme ? 'dark' : ''}>
      <Head>
        <title>Documentation - {settings.name}</title>
        <meta name="description" content="Documentation complète d'ExilonCMS" />
      </Head>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur">
          <div className="container flex h-14 items-center px-4">
            <Link href="/docs" className="flex items-center gap-2 font-semibold">
              <IconBook className="h-5 w-5" />
              <span>Documentation</span>
            </Link>

            <div className="ml-auto flex items-center gap-4">
              {/* Locale switcher */}
              <div className="flex items-center gap-1">
                {availableLocales.map((loc) => (
                  <Link
                    key={loc}
                    href={`/docs/${loc}`}
                    className={`px-2 py-1 text-sm rounded-md transition-colors ${
                      locale === loc
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                  >
                    {loc.toUpperCase()}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </header>

        <main className="container py-12 px-4">
          {/* Hero section */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Documentation ExilonCMS
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Guides complets pour installer, configurer et utiliser ExilonCMS.
              <br />
              Tout ce dont vous avez besoin pour créer des plugins et des thèmes.
            </p>

            <div className="flex justify-center gap-4">
              <Link
                href={`/docs/${locale}/installation`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Commencer
                <IconArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/docs/${locale}/plugins`}
                className="inline-flex items-center gap-2 px-6 py-3 border rounded-md font-medium hover:bg-accent transition-colors"
              >
                Plugins
              </Link>
            </div>
          </div>

          {/* Categories grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/docs/${locale}/${category.slug}`}
                className="group p-6 border rounded-lg hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <IconFileText className="h-6 w-6 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>

                    {(category.pages?.length ?? 0) > 0 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {category.pages.length} page{category.pages.length > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick links */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Liens rapides</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="https://github.com/Exilon-Studios/exiloncms"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <IconBook className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">GitHub Repository</p>
                  <p className="text-sm text-muted-foreground">Code source et développement</p>
                </div>
              </Link>

              <Link
                href="https://docs.exiloncms.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <IconFileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Documentation en ligne</p>
                  <p className="text-sm text-muted-foreground">Version hébergée</p>
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
