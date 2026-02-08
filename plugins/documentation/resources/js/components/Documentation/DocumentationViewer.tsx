import { Head, usePage, Link } from '@inertiajs/react';
import { trans } from '@/lib/i18n';
import {
  IconBook,
  IconSearch,
  IconMenu,
  IconChevronLeft,
  IconChevronRight,
  IconExternalLink,
} from '@tabler/icons-react';
import { useState } from 'react';
import { PageProps } from '@/types';
import DocSidebar from './DocSidebar';
import DocSearch from './DocSearch';
import DocTableOfContents from './DocTableOfContents';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocumentationPageProps {
  locale: string;
  availableLocales: string[];
  navigation: any[];
  flatNavigation: any[];
  breadcrumb: any[];
  page: {
    category: string;
    slug: string;
    content: string;
    frontmatter: any;
    headings: any[];
    last_modified: number;
    reading_time: number;
  };
  tableOfContents: any[];
  adjacent: {
    prev: any;
    next: any;
  };
}

export default function DocumentationViewer({
  locale = 'fr',
  availableLocales = ['fr', 'en'],
  navigation = [],
  flatNavigation = [],
  breadcrumb = [],
  page,
  tableOfContents = [],
  adjacent = { prev: null, next: null },
}: Partial<DocumentationPageProps>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { settings } = usePage<PageProps>().props;

  // Convert markdown to HTML
  const markdownHtml = page?.content || '';

  const pageTitle = page?.frontmatter?.title || 'Documentation';
  const siteName = settings?.name || 'ExilonCMS';
  const pageDescription = page?.frontmatter?.description;

  return (
    <div className={settings?.darkTheme ? 'dark' : ''}>
      <Head>
        <title>{pageTitle} - {siteName}</title>
        {pageDescription && <meta name="description" content={pageDescription} />}
      </Head>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center px-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-accent rounded-md"
              >
                <IconMenu className="h-5 w-5" />
              </button>

              <Link href="/docs" className="flex items-center gap-2 font-semibold">
                <IconBook className="h-5 w-5" />
                <span>Documentation</span>
              </Link>

              {/* Locale switcher */}
              <div className="hidden sm:flex items-center gap-1 ml-4">
                {(availableLocales || []).map((loc) => (
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

            {/* Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors"
            >
              <IconSearch className="h-4 w-4" />
              <span className="hidden sm:inline">Rechercher...</span>
              <kbd className="hidden sm:inline-flex pointer-events-none ml-auto h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>
        </header>

        <div className="container flex">
          {/* Sidebar */}
          <aside
            className={`
              fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-background p-4 pt-14 transition-transform
              lg:translate-x-0 lg:static lg:block
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            <DocSidebar
              navigation={flatNavigation || []}
              currentPage={page?.slug || ''}
              onClose={() => setSidebarOpen(false)}
            />
          </aside>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground py-4 px-4 lg:px-6 overflow-x-auto">
              {(breadcrumb || []).map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && <IconChevronRight className="h-4 w-4" />}
                  {item.href ? (
                    <Link href={item.href} className="hover:text-foreground transition-colors">
                      {item.title}
                    </Link>
                  ) : (
                    <span className="text-foreground font-medium">{item.title}</span>
                  )}
                </div>
              ))}
            </nav>

            <div className="px-4 lg:px-6 pb-12">
              {/* Page header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                  {page?.frontmatter?.title || 'Untitled'}
                </h1>

                {(page?.frontmatter?.description || page?.reading_time) && (
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                    {page.frontmatter?.description && (
                      <p>{page.frontmatter.description}</p>
                    )}
                    {page.reading_time && (
                      <span>{page.reading_time} min de lecture</span>
                    )}
                  </div>
                )}
              </div>

              {/* Content */}
              <article className="prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="scroll-m-20 text-3xl font-bold tracking-tight" {...props} />,
                    h2: ({node, ...props}) => (
                      <h2 className="scroll-m-20 border-b pb-2 mt-10 mb-4 text-2xl font-semibold tracking-tight first:mt-0" {...props} />
                    ),
                    h3: ({node, ...props}) => (
                      <h3 className="scroll-m-20 mt-8 mb-4 text-xl font-semibold tracking-tight" {...props} />
                    ),
                    h4: ({node, ...props}) => (
                      <h4 className="scroll-m-20 mt-6 mb-4 text-lg font-semibold tracking-tight" {...props} />
                    ),
                    p: ({node, ...props}) => <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />,
                    ul: ({node, ...props}) => <ul className="my-6 ml-6 list-disc" {...props} />,
                    ol: ({node, ...props}) => <ol className="my-6 ml-6 list-decimal" {...props} />,
                    li: ({node, ...props}) => <li className="mt-2" {...props} />,
                    blockquote: ({node, ...props}) => (
                      <blockquote className="mt-6 border-l-4 pl-6 italic" {...props} />
                    ),
                    code: ({node, inline, ...props}: any) =>
                      inline ? (
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm" {...props} />
                      ) : (
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm overflow-x-auto" {...props} />
                      ),
                    pre: ({node, ...props}) => (
                      <pre className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted p-4" {...props} />
                    ),
                    a: ({node, ...props}) => (
                      <a className="font-medium text-primary underline underline-offset-4" {...props} />
                    ),
                    table: ({node, ...props}) => (
                      <div className="my-6 w-full overflow-y-auto">
                        <table className="w-full" {...props} />
                      </div>
                    ),
                  }}
                >
                  {markdownHtml}
                </ReactMarkdown>
              </article>

              {/* Prev/Next navigation */}
              {(adjacent?.prev || adjacent?.next) && (
                <div className="mt-12 flex justify-between gap-4 pt-8 border-t">
                  {adjacent?.prev ? (
                    <Link
                      href={`/docs/${locale}/${adjacent.prev.category_slug}/${adjacent.prev.slug}`}
                      className="flex items-center gap-2 group max-w-[50%]"
                    >
                      <IconChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                      <div>
                        <p className="text-sm text-muted-foreground">Précédent</p>
                        <p className="font-medium">{adjacent.prev.title}</p>
                      </div>
                    </Link>
                  ) : (
                    <div />
                  )}

                  {adjacent?.next ? (
                    <Link
                      href={`/docs/${locale}/${adjacent.next.category_slug}/${adjacent.next.slug}`}
                      className="flex items-center gap-2 group max-w-[50%] ml-auto text-right"
                    >
                      <div>
                        <p className="text-sm text-muted-foreground">Suivant</p>
                        <p className="font-medium">{adjacent.next.title}</p>
                      </div>
                      <IconChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <div />
                  )}
                </div>
              )}
            </div>
          </main>

          {/* Table of Contents sidebar (desktop) */}
          {(tableOfContents?.length || 0) > 0 && (
            <aside className="hidden xl:block w-64 shrink-0">
              <div className="sticky top-14 px-4 py-6">
                <DocTableOfContents headings={tableOfContents || []} />
              </div>
            </aside>
          )}
        </div>

        {/* Search modal */}
        {searchOpen && <DocSearch onClose={() => setSearchOpen(false)} locale={locale} />}
      </div>
    </div>
  );
}
