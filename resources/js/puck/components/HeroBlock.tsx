import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Users, Gamepad2, Trophy, Zap } from "lucide-react";
import { trans } from '@/lib/i18n';
import { NavLink } from './NavLink';

interface HeroBlockProps {
  title_main?: string;
  title_highlight?: string;
  subtitle?: string;
  cta_text?: string;
  cta_url?: string;
  show_server_status?: boolean;
  show_stats_card?: boolean;
  puck?: {
    isEditing?: boolean;
  };
}

export const HeroBlock: React.FC<HeroBlockProps> = (props) => {
  const {
    title_main = 'Bienvenue sur',
    title_highlight = 'Notre Serveur',
    subtitle = 'Rejoignez notre communauté et commencez votre aventure !',
    cta_text = 'Commencer',
    cta_url = "/register",
    show_server_status = true,
    show_stats_card = true,
    puck,
  } = props || {};

  const isEditing = puck?.isEditing || false;

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden bg-background"
      style={{
        paddingTop: isEditing ? '40px' : '6rem',
        paddingBottom: isEditing ? '40px' : '5rem',
        minHeight: isEditing ? '400px' : '100vh',
      }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,black,transparent)]" />

        {/* Glowing Orbs */}
        {!isEditing && (
          <>
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
          </>
        )}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className={`grid gap-12 items-center ${isEditing ? 'grid-cols-1' : 'lg:grid-cols-2'}`}>

            {/* Left Content */}
            <motion.div
              className="space-y-8"
              initial={false}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Main Title */}
              <div className="space-y-4">
                <h1 className={`${isEditing ? 'text-4xl md:text-5xl' : 'text-6xl md:text-7xl xl:text-8xl'} font-black tracking-tighter leading-none`}>
                  <span className="block text-foreground mb-2">{title_main}</span>
                  <span className="block bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
                    {title_highlight}
                  </span>
                </h1>
              </div>

              {/* Subtitle */}
              <motion.p
                className={`${isEditing ? 'text-lg' : 'text-xl md:text-2xl'} text-muted-foreground leading-relaxed max-w-xl`}
              >
                {subtitle}
              </motion.p>

              {/* CTA */}
              <motion.div className="flex items-center gap-4">
                <NavLink
                  href={cta_url}
                  className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-lg overflow-hidden transition-all hover:gap-3 hover:shadow-2xl hover:shadow-primary/30"
                >
                  <span className="relative z-10">{cta_text}</span>
                  <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                </NavLink>
              </motion.div>

            </motion.div>

            {/* Right Visual */}
            {show_stats_card && (
              <motion.div
                className="relative lg:h-[600px] flex items-center justify-center"
                initial={false}
              >
                {/* Decorative Elements */}
                <div className="relative w-full h-full">
                  {/* Center Card */}
                  <motion.div
                    className="absolute inset-0 m-auto w-80 h-96 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl rounded-2xl border border-primary/20 shadow-2xl overflow-hidden"
                    animate={!isEditing ? {
                      y: [0, -10, 0],
                    } : undefined}
                    transition={!isEditing ? {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    } : undefined}
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
                    animate={!isEditing ? {
                      y: [0, -20, 0],
                      rotate: [0, 5, 0],
                    } : undefined}
                    transition={!isEditing ? {
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    } : undefined}
                  >
                    <Gamepad2 className="w-12 h-12 text-primary" />
                  </motion.div>

                  <motion.div
                    className="absolute bottom-20 -right-10 w-32 h-32 bg-primary/10 rounded-2xl backdrop-blur-sm border border-primary/20 flex items-center justify-center"
                    animate={!isEditing ? {
                      y: [0, 20, 0],
                      rotate: [0, -5, 0],
                    } : undefined}
                    transition={!isEditing ? {
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    } : undefined}
                  >
                    <Trophy className="w-12 h-12 text-primary" />
                  </motion.div>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </div>

      {/* Scroll Indicator - only in render mode */}
      {!isEditing && (
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
      )}
    </section>
  );
};
