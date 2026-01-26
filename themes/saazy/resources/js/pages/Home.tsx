import { Head, usePage } from '@inertiajs/react';
import HeroSaazy from '@/components/HeroSaazy';
import { PageProps } from '@/types';

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

interface Props {
  siteName?: string;
  servers: Server[];
  posts: any[];
  settings?: {
    description?: string;
    logo?: string;
    background?: string;
  };
}

export default function ThemeHome({ siteName, servers, posts, settings }: Props) {
  const { auth } = usePage<PageProps>().props;

  return (
    <>
      <Head title={siteName || 'ExilonCMS'} />

      {/* Hero Saazy Component with all sections */}
      <HeroSaazy
        siteName={siteName}
        servers={servers}
        showCustomizationNote={true}
      />
    </>
  );
}
