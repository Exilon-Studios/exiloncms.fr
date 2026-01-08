import { Head } from '@inertiajs/react';
import PuckLayout from '@/layouts/PuckLayout';
import { Render } from '@measured/puck';
import '@measured/puck/puck.css';
import { puckConfig } from '@/puck/config';
import { Post } from '@/types';
import { trans } from '@/lib/i18n';
import styles from './Home.module.css';
import { Link } from '@inertiajs/react';
import { ArrowRight, Server, Users, Newspaper, Shield, Zap, Settings } from 'lucide-react';

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

function DefaultHomePage({ siteName, posts, servers }: { siteName?: string; posts: Post[]; servers: Server[] }) {
  const recentPosts = posts?.slice(0, 3) || [];
  const onlineServers = servers?.filter(s => s.isOnline) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px]"></div>

        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              {siteName || 'ExilonCMS'}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              La solution moderne pour votre serveur de jeu
            </p>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Gérez votre communauté avec une plateforme puissante, intuitive et entièrement personnalisable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/news"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
              >
                Actualités
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/90 transition-all shadow-lg hover:shadow-xl"
              >
                Boutique
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Fonctionnalités
            </h2>
            <p className="text-muted-foreground text-lg">
              Tout ce dont vous avez besoin pour gérer votre serveur
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Server className="h-8 w-8" />,
                title: "Serveurs de Jeu",
                description: "Supporte Minecraft, FiveM, Rust et plus encore"
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Gestion des Utilisateurs",
                description: "Système complet avec rôles et permissions"
              },
              {
                icon: <Newspaper className="h-8 w-8" />,
                title: "Blog & Actualités",
                description: "Partagez vos nouveautés avec votre communauté"
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Sécurité Avancée",
                description: "2FA, protection et modération intégrées"
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Performance",
                description: "Optimisé pour la vitesse et l'évolutivité"
              },
              {
                icon: <Settings className="h-8 w-8" />,
                title: "100% Personnalisable",
                description: "Thèmes, plugins et éditeur visuel Puck"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl border bg-card hover:shadow-lg transition-all"
              >
                <div className="text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servers Section */}
      {onlineServers.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nos Serveurs
              </h2>
              <p className="text-muted-foreground text-lg">
                Rejoignez nos serveurs maintenant
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {onlineServers.map((server) => (
                <div
                  key={server.id}
                  className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">
                      {server.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-sm text-green-600 font-medium">
                        En ligne
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {server.fullAddress}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">
                        {server.onlinePlayers} / {server.maxPlayers}
                      </span>
                    </div>
                    {server.joinUrl && (
                      <a
                        href={server.joinUrl}
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        Rejoindre
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Section */}
      {recentPosts.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  Dernières Actualités
                </h2>
                <p className="text-muted-foreground">
                  Restez informé des nouveautés
                </p>
              </div>
              <Link
                href="/news"
                className="hidden sm:inline-flex items-center gap-2 px-6 py-3 rounded-xl border hover:bg-accent transition-colors"
              >
                Voir tout
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/news/${post.slug}`}
                  className="group"
                >
                  <article className="overflow-hidden rounded-2xl border bg-card hover:shadow-lg transition-all">
                    {post.image_url ? (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Newspaper className="h-16 w-16 text-primary/30" />
                      </div>
                    )}
                    <div className="p-6">
                      <p className="text-sm text-muted-foreground mb-2">
                        {new Date(post.published_at || '').toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {post.excerpt || post.content?.substring(0, 150)}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border hover:bg-accent transition-colors"
              >
                Voir tout
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à commencer ?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Rejoignez notre communauté et découvrez tout ce que nous avons à offrir
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
              >
                Créer un compte
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl border bg-background hover:bg-accent font-semibold transition-all"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
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
        <DefaultHomePage
          siteName={siteName}
          posts={posts}
          servers={servers}
        />
      )}
    </PuckLayout>
  );
}
