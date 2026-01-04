/**
 * Footer Component - Four-column grid layout
 * Data from database (no mocks) - configurable links
 */

import { Link } from "@inertiajs/react";
import React from "react";
import { trans } from '@/lib/i18n';

interface FooterLink {
  title: string;
  href: string;
}

interface FooterProps {
  siteName?: string;
  logoUrl?: string;
  pages?: FooterLink[];
  socials?: FooterLink[];
  legals?: FooterLink[];
}

export default function Footer({
  siteName = "MC-CMS",
  logoUrl,
  pages = [],
  socials = [],
  legals = [],
}: FooterProps) {
  const authLinks: FooterLink[] = [
    {
      title: trans('messages.footer.auth.register'),
      href: route('register'),
    },
    {
      title: trans('messages.footer.auth.login'),
      href: route('login'),
    },
  ];

  return (
    <div className="relative w-full overflow-hidden border-t border-neutral-100 bg-white px-8 py-20 dark:border-white/[0.1] dark:bg-neutral-950">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between text-sm text-neutral-500 sm:flex-row md:px-8">
        <div>
          <div className="mr-0 mb-4 md:mr-4 md:flex">
            <Logo siteName={siteName} logoUrl={logoUrl} />
          </div>

          <div className="mt-2 ml-2">
            {trans('messages.footer.copyright', { year: new Date().getFullYear() })}
          </div>
        </div>
        <div className="mt-10 grid grid-cols-2 items-start gap-10 sm:mt-0 md:mt-0 lg:grid-cols-4">
          {/* Pages Column */}
          {pages.length > 0 && (
            <div className="flex w-full flex-col justify-center space-y-4">
              <p className="hover:text-text-neutral-800 font-bold text-neutral-600 transition-colors dark:text-neutral-300">
                {trans('messages.footer.pages')}
              </p>
              <ul className="hover:text-text-neutral-800 list-none space-y-4 text-neutral-600 transition-colors dark:text-neutral-300">
                {pages.map((page, idx) => (
                  <li key={"pages" + idx} className="list-none">
                    <Link
                      className="hover:text-text-neutral-800 transition-colors"
                      href={page.href}
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Socials Column */}
          {socials.length > 0 && (
            <div className="flex flex-col justify-center space-y-4">
              <p className="hover:text-text-neutral-800 font-bold text-neutral-600 transition-colors dark:text-neutral-300">
                {trans('messages.footer.socials')}
              </p>
              <ul className="hover:text-text-neutral-800 list-none space-y-4 text-neutral-600 transition-colors dark:text-neutral-300">
                {socials.map((social, idx) => (
                  <li key={"social" + idx} className="list-none">
                    <a
                      className="hover:text-text-neutral-800 transition-colors"
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Legal Column */}
          {legals.length > 0 && (
            <div className="flex flex-col justify-center space-y-4">
              <p className="hover:text-text-neutral-800 font-bold text-neutral-600 transition-colors dark:text-neutral-300">
                {trans('messages.footer.legal')}
              </p>
              <ul className="hover:text-text-neutral-800 list-none space-y-4 text-neutral-600 transition-colors dark:text-neutral-300">
                {legals.map((legal, idx) => (
                  <li key={"legal" + idx} className="list-none">
                    <Link
                      className="hover:text-text-neutral-800 transition-colors"
                      href={legal.href}
                    >
                      {legal.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Auth Column */}
          <div className="flex flex-col justify-center space-y-4">
            <p className="hover:text-text-neutral-800 font-bold text-neutral-600 transition-colors dark:text-neutral-300">
              {trans('messages.footer.account')}
            </p>
            <ul className="hover:text-text-neutral-800 list-none space-y-4 text-neutral-600 transition-colors dark:text-neutral-300">
              {authLinks.map((auth, idx) => (
                <li key={"auth" + idx} className="list-none">
                  <Link
                    className="hover:text-text-neutral-800 transition-colors"
                    href={auth.href}
                  >
                    {auth.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <p className="inset-x-0 mt-20 bg-gradient-to-b from-neutral-50 to-neutral-200 bg-clip-text text-center text-5xl font-bold text-transparent md:text-9xl lg:text-[12rem] xl:text-[13rem] dark:from-neutral-950 dark:to-neutral-800">
        {siteName}
      </p>
    </div>
  );
}

const Logo = ({ siteName, logoUrl }: { siteName: string; logoUrl?: string }) => {
  return (
    <Link
      href="/"
      className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black"
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt="logo"
          width={30}
          height={30}
        />
      ) : (
        <div className="h-6 w-6 rounded bg-black dark:bg-white" />
      )}
      <span className="font-medium text-black dark:text-white">{siteName}</span>
    </Link>
  );
};
