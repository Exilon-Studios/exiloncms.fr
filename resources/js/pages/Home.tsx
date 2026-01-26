import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import { trans } from '@/lib/i18n';
import HeroWithSocial from '@/components/HeroWithSocial';

interface Server {
  id: number;
  name: string;
  fullAddress: string;
  joinUrl?: string;
  isOnline: boolean;
  onlinePlayers?: number;
  maxPlayers?: number;
  playersPercents?: number;
}

interface LandingSettings {
  [key: string]: any;
}

interface Props {
  message?: string;
  siteName?: string;
  server?: Server;
  servers: Server[];
  landingSettings: LandingSettings;
}

export default function Home({ message, siteName, server, servers, landingSettings }: Props) {
  return (
    <PublicLayout>
      <Head title={trans('messages.pages.title')} />

      {/*
        Gaming Landing Page with Social Links

        This is the default landing page.
        Features:
        - Vertical social links on the left
        - Gaming-style grid background
        - Server status display
        - Auth-aware CTAs
        - Fully responsive
      */}
      <HeroWithSocial
        siteName={siteName}
        servers={servers}
        showCustomizationNote={false}
      />
    </PublicLayout>
  );
}
