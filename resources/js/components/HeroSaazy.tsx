import { Link, usePage } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ArrowRight, Play, Check, ChevronDown, Star, Server, Zap, Shield, Users, Code, Globe, TrendingUp, Package, ShoppingBag, Download, Palette } from 'lucide-react';
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
  showCustomizationNote?: boolean;
}

// Feature data
const features = [
  {
    icon: Zap,
    title: "Page Builder Visuel",
    description: "Créez des pages uniques en glissant-déposant des blocs. Aucune compétence en code requise grâce à l'éditeur Puck.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Server,
    title: "Multi-Serveurs",
    description: "Gérez plusieurs serveurs de jeux depuis une seule interface. Minecraft, FiveM, Rust, et plus encore.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Shield,
    title: "Système de Plugins",
    description: "Étendez les fonctionnalités avec notre marketplace de plugins : boutique, vote, wiki, statistiques…",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Globe,
    title: "Thèmes Personnalisables",
    description: "Choisissez parmi des thèmes modernes ou créez le vôtre. Personnalisation complète garantie.",
    color: "from-green-500 to-emerald-500"
  },
];

// Stack data
const stackItems = [
  { label: "Stack Moderne", description: "Laravel 12, React 19, TypeScript, Tailwind CSS v4" },
  { label: "Mises à jour auto", description: "Mettez à jour en un clic depuis le panel admin" },
  { label: "100% Open Source", description: "Code source disponible sur GitHub. Licence MIT" },
  { label: "Permissions avancées", description: "Système de rôles complet pour gérer votre équipe" },
  { label: "Multi-langue", description: "Interface disponible en français et anglais" },
  { label: "Personnalisation totale", description: "Thèmes, plugins, page builder…" },
];

// Testimonials data
const testimonials = [
  {
    name: "Alexandre",
    role: "Admin serveur Minecraft",
    content: "On tournait sur Azuriom depuis 2 ans. Le passage à ExilonCMS a été une révélation : le page builder nous fait gagner un temps fou et le site est beaucoup plus rapide.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexandre",
    rating: 5
  },
  {
    name: "Marie",
    role: "Owner FiveM",
    content: "La meilleure décision pour notre équipe ! De l'automatisation à l'analytics, cette plateforme a tout ce dont nous avons besoin pour grandir.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
    rating: 5
  },
  {
    name: "Thomas",
    role: "Gérant communauté Rust",
    content: "Grâce à ExilonCMS, nos taux d'ouverture ont augmenté de 60% ! L'interface est moderne et très intuitive.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas",
    rating: 5
  },
];

// FAQ data
const faqs = [
  {
    question: "ExilonCMS est-il vraiment gratuit ?",
    answer: "Oui, 100% gratuit et open source sous licence MIT. Vous pouvez l'utiliser pour des projets personnels ou commerciaux.",
  },
  {
    question: "Puis-je migrer depuis Azuriom ?",
    answer: "Un outil de migration est prévu. Rejoignez notre Discord pour être informé de sa sortie.",
  },
  {
    question: "Puis-je utiliser ExilonCMS pour un usage commercial ?",
    answer: "Absolument. La licence MIT vous permet de l'utiliser sans restriction, y compris pour vendre des accès ou services sur votre serveur.",
  },
  {
    question: "ExilonCMS est-il adapté aux débutants ?",
    answer: "Oui ! L'installation web et le page builder visuel ne nécessitent aucune compétence technique. Tout se fait en quelques clics.",
  },
];

// Scroll-triggered animation wrapper
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

// Parallax section component
function ParallaxSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// Animated background gradient
function AnimatedGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15), transparent 50%)',
          backgroundSize: '200% 200%',
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
      />
    </div>
  );
}

// Hero Section Component
function HeroSection({ siteName }: { siteName?: string }) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AnimatedGradient />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />

      <motion.div
        style={{ y: y1, opacity }}
        className="relative container mx-auto px-4 py-32"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-semibold backdrop-blur-sm"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Le CMS open source pour serveurs de jeu</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight"
            >
              Créez un site
              <br />
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                professionnel
              </span>
              <br />
              pour votre serveur
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl text-slate-300 max-w-xl leading-relaxed"
            >
              Open source, extensible, et conçu pour les gamers. Minecraft, FiveM, Rust et bien plus.
              <br />
              <span className="text-slate-400">Installez-le en quelques minutes.</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <Link
                href="https://github.com/ExilonStudios/ExilonCMS"
                target="_blank"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Télécharger ExilonCMS
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </Link>

              <Link
                href="https://github.com/ExilonStudios/ExilonCMS"
                target="_blank"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all font-semibold text-sm"
              >
                <Code className="mr-2 h-5 w-5" />
                Voir sur GitHub
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex items-center gap-8 pt-8 border-t border-white/10"
            >
              <div>
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-slate-400">Open Source</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">MIT</div>
                <div className="text-sm text-slate-400">Licence</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">∞</div>
                <div className="text-sm text-slate-400">Extensions</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Hero Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="hidden lg:block relative"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className="relative z-10"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 border border-white/10 backdrop-blur-sm p-8 flex items-center justify-center shadow-2xl">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    repeatType: 'loop',
                  }}
                  className="relative"
                >
                  <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-2xl">
                    <Server className="h-24 w-24 text-white" />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Floating elements */}
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className="absolute top-10 -right-10 px-4 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/20"
            >
              <div className="flex items-center gap-2 text-white text-sm">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span>Super Rapide</span>
              </div>
            </motion.div>

            <motion.div
              animate={{
                y: [0, 20, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: 1,
              }}
              className="absolute -bottom-10 -left-10 px-4 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/20"
            >
              <div className="flex items-center gap-2 text-white text-sm">
                <Shield className="h-4 w-4 text-green-400" />
                <span>Sécurisé</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-sm">Découvrir</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'loop',
            }}
          >
            <ChevronDown className="h-6 w-6" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// Compatible Games Section
function CompatibleGames() {
  const games = [
    { name: 'Minecraft', icon: '⛏️' },
    { name: 'FiveM', icon: '🚗' },
    { name: 'Rust', icon: '🔧' },
    { name: 'Garry\'s Mod', icon: '🔫' },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-sm font-semibold mb-4"
            >
              Compatible avec
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Vos jeux préférés
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tous les serveurs de jeux populaires sont supportés
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {games.map((game, index) => (
            <ScrollReveal key={game.name} delay={index * 0.1}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative p-8 rounded-2xl bg-muted/50 border border-border hover:border-blue-500/50 transition-all cursor-pointer"
              >
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      delay: index * 0.5,
                    }}
                    className="text-6xl"
                  >
                    {game.icon}
                  </motion.div>
                  <span className="font-bold text-lg group-hover:text-blue-500 transition-colors">
                    {game.name}
                  </span>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-2 rounded-full bg-purple-500/10 text-purple-500 text-sm font-semibold mb-4"
            >
              Fonctionnalités
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tout pour votre communauté
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Des outils puissants pour gérer et développer votre serveur
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.title} delay={index * 0.1}>
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative p-8 rounded-2xl bg-background border border-border hover:border-blue-500/50 transition-all overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                <div className="relative flex gap-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all"
                  >
                    <feature.icon className="h-8 w-8 text-blue-500" />
                  </motion.div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// Marketplace Section
function MarketplaceSection() {
  const categories = [
    {
      icon: Package,
      title: "Plugins",
      description: "Étendez les fonctionnalités de votre site avec des plugins communautaires",
      items: ["Boutique en ligne", "Système de vote", "Wiki intégré", "Statistiques avancées"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Palette,
      title: "Thèmes",
      description: "Personnalisez l'apparence de votre site avec des thèmes modernes",
      items: ["Thèmes sombres", "Designs modernes", "Responsive", "Facile à personnaliser"],
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4"
            >
              Marketplace
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Extensions & Thèmes
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre marketplace de plugins et thèmes créés par la communauté
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <ScrollReveal key={category.title} delay={index * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                  <div className="relative">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6"
                    >
                      <Icon className="h-8 w-8 text-primary" />
                    </motion.div>

                    <h3 className="text-2xl font-bold mb-3">{category.title}</h3>
                    <p className="text-muted-foreground mb-6">{category.description}</p>

                    <ul className="space-y-2">
                      {category.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* CTA */}
        <ScrollReveal>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <ShoppingBag className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">
                Devenez vendeur
              </h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Créez et vendez vos propres plugins et thèmes sur notre marketplace.
                <strong> 100% des revenus vous reviennent</strong> - nous ne prenons aucune commission !
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={route('resources.index')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all font-semibold"
                >
                  <Package className="h-5 w-5" />
                  Explorer le Marketplace
                </Link>
                <Link
                  href={route('resources.create')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-card border border-border rounded-xl hover:bg-muted transition-all font-semibold"
                >
                  <Download className="h-5 w-5" />
                  Publier une ressource
                </Link>
              </div>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// Stack Section
function StackSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-sm font-semibold mb-4"
            >
              Stack Technique
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Votre site, votre style
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une technologie moderne pour des performances optimales
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {stackItems.map((item, index) => (
            <ScrollReveal key={item.label} delay={index * 0.1}>
              <motion.div
                whileHover={{ scale: 1.05, borderColor: 'rgba(59, 130, 246, 0.5)' }}
                className="p-6 rounded-xl bg-muted/50 border border-border hover:border-blue-500/50 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Check className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{item.label}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-500 text-sm font-semibold mb-4"
            >
              Témoignages
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ce qu'en pensent les utilisateurs
            </h2>
          </div>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="p-8 md:p-12 rounded-3xl bg-background border border-border shadow-xl">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  src={testimonials[currentIndex].avatar}
                  alt={testimonials[currentIndex].name}
                  className="w-20 h-20 rounded-full border-4 border-blue-500/20"
                />
                <div className="flex-1 text-center md:text-left">
                  <h4 className="font-bold text-xl mb-1">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {testimonials[currentIndex].role}
                  </p>
                  <div className="flex gap-1 justify-center md:justify-start">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-lg text-muted-foreground italic text-center leading-relaxed">
                "{testimonials[currentIndex].content}"
              </p>
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-blue-500 w-8'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-2 rounded-full bg-red-500/10 text-red-500 text-sm font-semibold mb-4"
            >
              FAQ
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Questions fréquentes
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tout ce que vous devez savoir
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border border-border rounded-2xl overflow-hidden bg-muted/30"
              >
                <motion.button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-semibold text-lg">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  </motion.div>
                </motion.button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === index ? 'auto' : 0,
                    opacity: openIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      <AnimatedGradient />

      <div className="relative container mx-auto px-4">
        <ScrollReveal>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prêt à transformer votre serveur ?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Rejoignez des centaines d'administrateurs qui font confiance à ExilonCMS pour leur communauté.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="https://github.com/ExilonStudios/ExilonCMS"
                target="_blank"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-white/90 transition-all font-semibold text-sm shadow-xl"
              >
                <Download className="mr-2 h-5 w-5" />
                Télécharger Maintenant
              </Link>
              <Link
                href="https://github.com/ExilonStudios/ExilonCMS"
                target="_blank"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur border border-white/20 rounded-xl hover:bg-white/20 transition-all font-semibold text-sm"
              >
                <Play className="mr-2 h-5 w-5" />
                Voir la Démo
              </Link>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// Main component
export default function HeroSaazy({ siteName, servers, showCustomizationNote }: Props) {
  const { auth } = usePage<PageProps>().props;

  return (
    <div className="min-h-screen bg-background">
      <HeroSection siteName={siteName} />
      <CompatibleGames />
      <FeaturesSection />
      <MarketplaceSection />
      <StackSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />

      {showCustomizationNote && (
        <div className="py-16 bg-muted/30 text-center">
          <div className="container mx-auto px-4">
            <p className="text-muted-foreground mb-4">
              Personnalisez cette page dans le panel admin
            </p>
            {auth?.user ? (
              <Link
                href="/admin/pages"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium text-sm"
              >
                <Settings className="h-4 w-4" />
                Personnaliser
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium text-sm"
              >
                Connexion Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Add CSS for grid pattern
const style = document.createElement('style');
style.textContent = `
  .bg-grid-pattern {
    background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
  }
`;
document.head.appendChild(style);
