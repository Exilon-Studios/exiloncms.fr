import { Link, usePage } from '@inertiajs/react';
import { trans } from '@/lib/i18n';

interface SocialLink {
  title: string;
  value: string;
  icon: string;
  color: string;
}

export default function Footer() {
  const { settings, socialLinks, navbar } = usePage().props as any;

  const pages = navbar || [];
  const legals = [
    { title: trans('messages.footer.privacy'), href: '/privacy' },
    { title: trans('messages.footer.terms'), href: '/terms' },
  ];

  return (
    <div className="relative w-full overflow-hidden border-t border-border bg-background px-8 py-20">
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
          <div className="flex w-full flex-col justify-center space-y-4">
            <p className="font-bold text-foreground">
              {trans('messages.footer.pages')}
            </p>
            <ul className="list-none space-y-4 text-muted-foreground">
              {pages.slice(0, 5).map((page: any, idx: number) => (
                <li key={'page-' + idx} className="list-none">
                  <Link
                    className="hover:text-foreground transition-colors no-underline"
                    href={page.link}
                  >
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-center space-y-4">
            <p className="font-bold text-foreground">
              {trans('messages.footer.socials')}
            </p>
            <ul className="list-none space-y-4 text-muted-foreground">
              {socialLinks?.map((social: SocialLink, idx: number) => (
                <li key={'social-' + idx} className="list-none">
                  <a
                    className="hover:text-foreground transition-colors no-underline"
                    href={social.value}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-center space-y-4">
            <p className="font-bold text-foreground">
              {trans('messages.footer.legal')}
            </p>
            <ul className="list-none space-y-4 text-muted-foreground">
              {legals.map((legal, idx) => (
                <li key={'legal-' + idx} className="list-none">
                  <Link
                    className="hover:text-foreground transition-colors no-underline"
                    href={legal.href}
                  >
                    {legal.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="inset-x-0 mt-20 bg-gradient-to-b from-muted/50 to-muted bg-clip-text text-center text-5xl font-bold text-transparent md:text-9xl lg:text-[12rem] xl:text-[13rem]">
        {settings.name}
      </p>
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
