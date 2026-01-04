import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { ArrowRight, Users, Gamepad2, Trophy, Zap } from "lucide-react";
import { trans } from '@/lib/i18n';

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

interface Settings {
  title: {
    main: string;
    highlight: string;
  };
  subtitle: string;
  cta: {
    text: string;
    url: string;
  };
}

interface Props {
  settings?: Settings;
  server?: Server;
  siteName?: string;
}

export default function HeroBanner({ settings = {} as Settings, server, siteName }: Props) {
  // Safe access with defaults
  const title = settings?.title || {
    main: 'Bienvenue sur',
    highlight: siteName || 'Notre Serveur'
  };
  const subtitle = settings?.subtitle || 'Rejoignez notre communauté et commencez votre aventure dès maintenant !';
  const cta = settings?.cta || { text: 'Commencer', url: '/register' };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,black,transparent)]" />

        {/* Glowing Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Server Status Badge */}
              {server && (
                <motion.div
                  className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-card/60 border border-primary/20 backdrop-blur-sm"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-2">
                    <span className={`relative flex h-2.5 w-2.5 ${server.isOnline ? '' : 'opacity-50'}`}>
                      {server.isOnline && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      )}
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${server.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {server.isOnline ? trans('messages.server.online') : trans('messages.server.offline')}
                    </span>
                  </div>
                  {server.isOnline && server.onlinePlayers !== undefined && (
                    <>
                      <div className="w-px h-5 bg-border/50" />
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="font-bold text-foreground">{server.onlinePlayers}</span>
                        {server.maxPlayers && (
                          <span className="text-muted-foreground">/ {server.maxPlayers}</span>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* Main Title */}
              <div className="space-y-4">
                <motion.h1
                  className="text-6xl md:text-7xl xl:text-8xl font-black tracking-tighter leading-none"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <span className="block text-foreground mb-2">{title.main}</span>
                  <span className="block bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
                    {title.highlight}
                  </span>
                </motion.h1>
              </div>

              {/* Subtitle */}
              <motion.p
                className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {subtitle}
              </motion.p>

              {/* CTA */}
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link
                  href={cta.url}
                  className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-lg overflow-hidden transition-all hover:gap-3 hover:shadow-2xl hover:shadow-primary/30"
                >
                  <span className="relative z-10">{cta.text}</span>
                  <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </motion.div>

            </motion.div>

            {/* Right Visual */}
            <motion.div
              className="relative lg:h-[600px] flex items-center justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Decorative Elements */}
              <div className="relative w-full h-full">
                {/* Center Card */}
                <motion.div
                  className="absolute inset-0 m-auto w-80 h-96 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl rounded-2xl border border-primary/20 shadow-2xl overflow-hidden"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />

                  {/* Stats Display */}
                  <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Gamepad2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">{trans('messages.hero.game_mode')}</div>
                          <div className="text-lg font-bold">{trans('messages.hero.survival_pvp')}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">{trans('messages.hero.community')}</div>
                          <div className="text-lg font-bold">{trans('messages.hero.players_count')}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">{trans('messages.hero.events')}</div>
                          <div className="text-lg font-bold">{trans('messages.hero.weekly')}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Zap className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">{trans('messages.hero.performance')}</div>
                          <div className="text-lg font-bold">{trans('messages.hero.tps')}</div>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Bottom */}
                    <div className="h-2 w-full bg-gradient-to-r from-primary via-primary/80 to-transparent rounded-full" />
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute top-20 -left-10 w-32 h-32 bg-primary/10 rounded-2xl backdrop-blur-sm border border-primary/20 flex items-center justify-center"
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Gamepad2 className="w-12 h-12 text-primary" />
                </motion.div>

                <motion.div
                  className="absolute bottom-20 -right-10 w-32 h-32 bg-primary/10 rounded-2xl backdrop-blur-sm border border-primary/20 flex items-center justify-center"
                  animate={{
                    y: [0, 20, 0],
                    rotate: [0, -5, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  <Trophy className="w-12 h-12 text-primary" />
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
