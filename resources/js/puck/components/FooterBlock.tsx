import { ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { NavLink } from './NavLink';

// ============================================================================
// TYPES
// ============================================================================

export interface FooterBlockProps {
  puck?: {
    isEditing?: boolean;
  };
}

// ============================================================================
// FOOTER BLOCK COMPONENT
// ============================================================================

export const FooterBlock = ({ puck }: FooterBlockProps) => {
  const { settings, navbar, socialLinks } = usePage<PageProps>().props;
  const isEditing = puck?.isEditing || false;

  const currentYear = new Date().getFullYear();
  const siteName = settings?.name || 'ExilonCMS';
  const copyrightText = settings?.copyright || '';

  // Use navbar links as pages
  const pages = (navbar || []).map((link: any) => ({
    name: link.name,
    link: link.link,
  }));

  // Social links from database
  const socials = (socialLinks || []).map((link: any) => ({
    title: link.title,
    value: link.value,
    icon: link.icon,
  }));

  return (
    <div className="relative w-full overflow-hidden border-t border-border bg-background px-8 py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between text-sm text-muted-foreground sm:flex-row md:px-8">
        {/* Left section: Logo and copyright */}
        <div>
          <div className="mr-0 mb-4 md:mr-4 md:flex">
            <NavLink
              href="/"
              disabledInEditor={isEditing}
              className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal"
            >
              <div className="h-6 w-6 flex-shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-primary" />
              <span className="font-bold text-foreground">{siteName}</span>
            </NavLink>
          </div>
          <div className="mt-2 ml-2">
            {copyrightText ? (
              <span>{copyrightText}</span>
            ) : (
              <>
                © {currentYear} {siteName}. Tous droits réservés.
              </>
            )}
          </div>
        </div>

        {/* Right section: Links grid */}
        <div className="mt-10 grid grid-cols-2 items-start gap-10 sm:mt-0 md:mt-0 lg:grid-cols-3">
          {/* Pages section */}
          {pages.length > 0 && (
            <div className="flex w-full flex-col justify-center space-y-4">
              <p className="font-bold text-foreground">
                Pages
              </p>
              <ul className="list-none space-y-4 text-muted-foreground">
                {pages.slice(0, 5).map((page, idx) => (
                  <li key={`page-${idx}`} className="list-none">
                    <NavLink
                      href={page.link}
                      disabledInEditor={isEditing}
                      className="hover:text-foreground transition-colors no-underline"
                    >
                      {page.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Socials section */}
          {socials.length > 0 && (
            <div className="flex flex-col justify-center space-y-4">
              <p className="font-bold text-foreground">
                Réseaux sociaux
              </p>
              <ul className="list-none space-y-4 text-muted-foreground">
                {socials.map((social, idx) => (
                  <li key={`social-${idx}`} className="list-none">
                    <NavLink
                      href={social.value}
                      disabledInEditor={isEditing}
                      className="hover:text-foreground transition-colors no-underline"
                    >
                      {social.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Legal section */}
          <div className="flex flex-col justify-center space-y-4">
            <p className="font-bold text-foreground">
              Légal
            </p>
            <ul className="list-none space-y-4 text-muted-foreground">
              <li className="list-none">
                <NavLink
                  href="/privacy"
                  disabledInEditor={isEditing}
                  className="hover:text-foreground transition-colors no-underline"
                >
                  Politique de confidentialité
                </NavLink>
              </li>
              <li className="list-none">
                <NavLink
                  href="/terms"
                  disabledInEditor={isEditing}
                  className="hover:text-foreground transition-colors no-underline"
                >
                  Conditions d'utilisation
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Site name watermark */}
      <p className="inset-x-0 mt-20 bg-gradient-to-b from-muted/50 to-muted bg-clip-text text-center text-5xl font-bold text-transparent md:text-9xl lg:text-[12rem] xl:text-[13rem]">
        {siteName}
      </p>
    </div>
  );
};

// ============================================================================
// PUCK CONFIG
// ============================================================================

export const footerBlockConfig = {
  label: 'Footer',
  fields: {},
  defaultProps: {},
  render: FooterBlock,
};
