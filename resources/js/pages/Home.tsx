import { Head } from '@inertiajs/react';
import PuckLayout from '@/layouts/PuckLayout';
import { Render } from '@measured/puck';
import '@measured/puck/puck.css';
import { puckConfig } from '@/puck/config';
import { Post } from '@/types';
import { trans } from '@/lib/i18n';
import styles from './Home.module.css';

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
  posts: Post[];
  server?: Server;
  servers: Server[];
  landingSettings: LandingSettings;
}

export default function Home({ message, siteName, posts, server, servers, landingSettings }: Props) {
  // Check if puck_data exists and is valid
  let puckData = null;
  const hasPuckData = landingSettings?.puck_data;

  if (hasPuckData) {
    try {
      puckData = typeof landingSettings.puck_data === 'string'
        ? JSON.parse(landingSettings.puck_data)
        : landingSettings.puck_data;

      // Inject posts into BlogBlock components
      if (puckData?.content) {
        puckData.content = puckData.content.map((item: any) => {
          if (item.type === 'BlogBlock') {
            return {
              ...item,
              props: {
                ...item.props,
                posts: posts,
              }
            };
          }
          return item;
        });
      }
    } catch (e) {
      console.error('Failed to parse puck_data:', e);
      puckData = null;
    }
  }

  // Check if we have valid Puck content
  const hasPuckContent = puckData && puckData.content && puckData.content.length > 0;

  return (
    <PuckLayout>
      <Head title={trans('messages.pages.title')} />

      {hasPuckContent ? (
        <div className={styles.root}>
          <Render config={puckConfig} data={puckData} />
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {siteName || 'ExilonCMS'}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Bienvenue sur notre site !
            </p>
            <p className="text-sm text-muted-foreground">
              La page d'accueil est en cours de configuration.
            </p>
          </div>
        </div>
      )}
    </PuckLayout>
  );
}
