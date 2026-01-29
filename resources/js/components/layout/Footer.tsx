import { Link, usePage } from '@inertiajs/react';
import { trans } from '@/lib/i18n';

interface SocialLink {
  title: string;
  value: string;
  icon: string;
  color: string;
}

interface FooterLink {
  plugin: string;
  label: string;
  url?: string;
  route?: string;
  position: number;
}

export default function Footer() {
  const { settings, socialLinks, navbar, pluginFooterLinks = {} } = usePage().props as any;

  const pages = navbar || [];

  // Build dynamic footer categories from plugins
  const footerCategories = Object.entries(pluginFooterLinks).map(([category, links]: [string, FooterLink[]]) => ({
    title: category,
    links: links.sort((a, b) => a.position - b.position),
  }));

  // Default pages category
  const pagesCategory = {
    title: trans('messages.footer.pages'),
    links: pages.slice(0, 5).map((page: any) => ({
      label: page.name,
      url: page.link,
    })),
  };

  // Social links category
  const socialsCategory = {
    title: trans('messages.footer.socials'),
    links: socialLinks?.map((social: SocialLink) => ({
      label: social.title,
      url: social.value,
    })) || [],
  };

  // Combine all categories
  const allCategories = [pagesCategory, socialsCategory, ...footerCategories];

  return (
    <div className="relative w-full overflow-hidden border-t border-border bg-background px-8 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between text-sm text-muted-foreground sm:flex-row md:px-8">
        <div>
          <div className="mr-0 mb-4 md:mr-4 md:flex">
            <Logo siteName={settings.name} />
          </div>
          <div className="mt-2 ml-2">
            © {new Date().getFullYear()} {settings.name}. Tous droits réservés.
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 items-start gap-10 sm:mt-0 md:mt-0 lg:grid-cols-3">
          {allCategories.slice(0, 3).map((category, idx) => (
            <div key={`cat-${idx}`} className="flex w-full flex-col justify-center space-y-4">
              <p className="font-bold text-foreground">
                {category.title}
              </p>
              <ul className="list-none space-y-4 text-muted-foreground">
                {category.links?.map((link: any, linkIdx: number) => (
                  <li key={`link-${idx}-${linkIdx}`} className="list-none">
                    <Link
                      className="hover:text-foreground transition-colors no-underline"
                      href={link.url || link.route || '#'}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const Logo = ({ siteName }: { siteName: string }) => {
  return (
    <Link
      href="/"
      className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal"
    >
      <div className="h-6 w-6 flex-shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-primary" />
      <span className="font-bold text-foreground">{siteName}</span>
    </Link>
  );
};
