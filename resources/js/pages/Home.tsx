import { Head } from '@inertiajs/react';
import PuckLayout from '@/layouts/PuckLayout';
import { Render } from '@measured/puck';
import '@measured/puck/puck.css';
import { puckConfig } from '@/puck/config';
import { Post } from '@/types';
import { trans } from '@/lib/i18n';
import styles from './Home.module.css';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import LandingPage from '@/components/LandingPage';

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
        <>
          {/*
            Modular Landing Page

            Using the LandingPage component which combines:
            - Navbar (optional, can be disabled with showNavbar={false})
            - Hero section with grid background

            You can also use components separately:
            - <Navbar /> for standalone navbar
            - <Hero /> for standalone hero section
          */}
          <LandingPage
            siteName={siteName}
            servers={servers}
            showNavbar={true}
            showCustomizationNote={true}
          />
        </>
      )}
    </PuckLayout>
  );
}
