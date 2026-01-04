import React from "react";
import { motion } from "framer-motion";
import { Download, Server, UserPlus, Play } from "lucide-react";

interface HowItWorksBlockProps {
  badge?: string;
  title_main?: string;
  title_highlight?: string;
  subtitle?: string;
  server_address?: string;
  step1_title?: string;
  step1_desc?: string;
  step2_title?: string;
  step2_desc?: string;
  step3_title?: string;
  step3_desc?: string;
  step4_title?: string;
  step4_desc?: string;
  puck?: {
    isEditing?: boolean;
  };
}

export const HowItWorksBlock: React.FC<HowItWorksBlockProps> = (props) => {
  const {
    badge = "Comment ça marche ?",
    title_main = "Commencez votre",
    title_highlight = "Aventure",
    subtitle = "Rejoignez le serveur en quelques étapes simples",
    server_address = 'play.outland.fr',
    step1_title = "Télécharger",
    step1_desc = "Téléchargez Minecraft Java Edition",
    step2_title = "S'inscrire",
    step2_desc = "Créez votre compte sur le site",
    step3_title = "Se connecter",
    step3_desc = "Lancez Minecraft et ajoutez le serveur",
    step4_title = "Jouer",
    step4_desc = "Rejoignez l'aventure !",
    puck,
  } = props || {};

  const isEditing = puck?.isEditing || false;

  const steps = [
    { icon: Download, number: '01', title: step1_title, desc: step1_desc },
    { icon: UserPlus, number: '02', title: step2_title, desc: step2_desc },
    { icon: Play, number: '03', title: step3_title, desc: step3_desc },
    { icon: Server, number: '04', title: step4_title, desc: step4_desc },
  ];

  return (
    <section
      className="relative overflow-hidden bg-background"
      style={{
        paddingTop: isEditing ? '40px' : '8rem',
        paddingBottom: isEditing ? '40px' : '8rem',
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          className={`text-center ${isEditing ? 'mb-12' : 'mb-20'}`}
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full"
            initial={false}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">
              {badge}
            </span>
          </motion.div>

          <h2 className={`${isEditing ? 'text-3xl md:text-4xl' : 'text-5xl md:text-6xl'} font-black mb-6`}>
            <span className="block text-foreground">{title_main}</span>
            <span className="block bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
              {title_highlight}
            </span>
          </h2>

          <p className={`${isEditing ? 'text-base' : 'text-xl'} text-muted-foreground max-w-3xl mx-auto`}>
            {subtitle}
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className={`grid gap-8 ${isEditing ? 'grid-cols-2 md:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                className="relative group"
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Connecting Line (hidden on last item and mobile) */}
                {index < steps.length - 1 && !isEditing && (
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
                  <p className={`${isEditing ? 'text-sm' : 'text-base'} text-muted-foreground leading-relaxed`}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-card/60 border border-border/50 rounded-lg">
            <Server className="w-5 h-5 text-primary" />
            <div className="text-left">
              <div className="text-sm text-muted-foreground">Adresse du serveur</div>
              <div className="text-lg font-bold text-foreground font-mono">{server_address}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
