import { motion } from "framer-motion";
import { Download, Server, UserPlus, Play } from "lucide-react";

interface Step {
  icon: string;
  number: string;
  title: string;
  description: string;
}

interface Settings {
  section: {
    badge: string;
    title: {
      main: string;
      highlight: string;
    };
    subtitle: string;
  };
  server_address: string;
  steps: Step[];
}

interface Props {
  settings?: Settings;
}

// Icon mapping
const iconMap: Record<string, any> = {
  Download,
  Server,
  UserPlus,
  Play,
};

export default function HowItWorksSection({ settings = {} as Settings }: Props) {
  // Safe access with defaults
  const section = settings?.section || {
    badge: 'Comment ça marche ?',
    title: { main: 'Commencez votre', highlight: 'Aventure' },
    subtitle: 'Rejoignez notre serveur en quelques étapes simples'
  };
  const serverAddress = settings?.server_address || 'play.outland.fr';
  const steps = settings?.steps || [
    { icon: 'Download', number: '01', title: 'Télécharger', description: 'Téléchargez la dernière version de Minecraft' },
    { icon: 'UserPlus', number: '02', title: 'S\'inscrire', description: 'Créez votre compte sur notre site web' },
    { icon: 'Play', number: '03', title: 'Se connecter', description: 'Connectez-vous avec votre pseudo Minecraft' },
    { icon: 'Server', number: '04', title: 'Jouer', description: 'Rejoignez le serveur et commencez à jouer' },
  ];
  return (
    <section className="relative py-32 overflow-hidden bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-primary/10 border border-primary/20 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">
              {section.badge}
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="block text-foreground">{section.title.main}</span>
            <span className="block bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
              {section.title.highlight}
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {section.subtitle}
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = iconMap[step.icon] || Server;
            return (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Connecting Line (hidden on last item and mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/40 to-transparent -z-10" />
                )}

                {/* Card */}
                <div className="relative h-full p-8 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group-hover:scale-105">
                  {/* Number Badge */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 rounded-xl bg-background border border-primary/30 flex items-center justify-center">
                    <span className="text-lg font-black text-primary">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className="mb-6 w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-card/60 border border-border/50 rounded-lg">
            <Server className="w-5 h-5 text-primary" />
            <div className="text-left">
              <div className="text-sm text-muted-foreground">Adresse du serveur</div>
              <div className="text-lg font-bold text-foreground font-mono">{serverAddress}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
