import type { Config } from "@measured/puck";

// Import all components
import { HeadingBlock } from "./components/HeadingBlock";
import { ParagraphBlock } from "./components/ParagraphBlock";
import { ButtonBlock } from "./components/ButtonBlock";
import { ImageBlock } from "./components/ImageBlock";
import { HeroBlock } from "./components/HeroBlock";
import { HowItWorksBlock } from "./components/HowItWorksBlock";
import { BlogBlock } from "./components/BlogBlock";
import { ContainerBlock } from "./components/ContainerBlock";
import { SpacerBlock } from "./components/SpacerBlock";
import { NavbarBlock } from "./components/NavbarBlock";
import { FooterBlock, type FooterBlockProps } from "./components/FooterBlock";

// ============================================
// TYPES
// ============================================

export type PuckComponents = {
  // Navigation
  NavbarBlock: {
    layout: "left" | "center";
  };

  // Footer
  FooterBlock: FooterBlockProps;

  // Typography
  HeadingBlock: {
    level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    text: string;
    align: "left" | "center" | "right";
    color?: string;
  };
  ParagraphBlock: {
    text: string;
    align: "left" | "center" | "right";
    size: "sm" | "base" | "lg";
  };

  // Interactive
  ButtonBlock: {
    text: string;
    href: string;
    variant: "primary" | "secondary" | "outline" | "ghost";
    size: "sm" | "md" | "lg";
    align: "left" | "center" | "right";
  };

  // Media
  ImageBlock: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    rounded: boolean;
  };

  // Landing Page Components
  HeroBlock: {
    title_main: string;
    title_highlight: string;
    subtitle: string;
    cta_text: string;
    cta_url: string;
    show_server_status: boolean;
    show_stats_card: boolean;
  };
  HowItWorksBlock: {
    badge: string;
    title_main: string;
    title_highlight: string;
    subtitle: string;
    server_address: string;
    step1_title: string;
    step1_desc: string;
    step2_title: string;
    step2_desc: string;
    step3_title: string;
    step3_desc: string;
    step4_title: string;
    step4_desc: string;
  };
  BlogBlock: {
    title: string;
    subtitle: string;
    show_view_all: boolean;
  };

  // Layout
  ContainerBlock: {
    max_width: "sm" | "md" | "lg" | "xl" | "full";
    padding: "none" | "sm" | "md" | "lg";
    background_color: string;
  };
  SpacerBlock: {
    height: number;
  };
};

export type RootProps = {
  title: string;
  description?: string;
};

// ============================================
// PUCK CONFIGURATION
// ============================================

export const puckConfig: Config<PuckComponents, RootProps> = {
  // Component categories for better organization
  categories: {
    navigation: {
      components: ["NavbarBlock"],
      title: "🧭 Navigation",
      defaultExpanded: true,
    },
    footer: {
      components: ["FooterBlock"],
      title: "🦶 Pied de page",
      defaultExpanded: false,
    },
    hero: {
      components: ["HeroBlock"],
      title: "🦸 Hero Sections",
      defaultExpanded: true,
    },
    content: {
      components: ["HowItWorksBlock", "BlogBlock"],
      title: "📄 Contenu",
      defaultExpanded: false,
    },
    typography: {
      components: ["HeadingBlock", "ParagraphBlock"],
      title: "✏️ Typographie",
      defaultExpanded: false,
    },
    interactive: {
      components: ["ButtonBlock"],
      title: "🔘 Interactif",
      defaultExpanded: false,
    },
    media: {
      components: ["ImageBlock"],
      title: "🖼️ Média",
      defaultExpanded: false,
    },
    layout: {
      components: ["ContainerBlock", "SpacerBlock"],
      title: "📐 Mise en page",
      defaultExpanded: false,
    },
  },

  // Component definitions
  components: {
    // ============================================
    // NAVIGATION
    // ============================================
    NavbarBlock: {
      label: "Navbar",
      fields: {
        layout: {
          type: "select",
          label: "Disposition",
          options: [
            { label: "Logo + liens à gauche", value: "left" },
            { label: "Logo centré, liens à gauche", value: "center" },
          ],
        },
      },
      defaultProps: {
        layout: "left",
      },
      render: NavbarBlock,
    },

    // ============================================
    // FOOTER
    // ============================================
    FooterBlock: {
      label: "Pied de page (Footer)",
      fields: {
        siteName: {
          type: "text",
          label: "Nom du site",
        },
        copyrightText: {
          type: "text",
          label: "Texte copyright personnalisé",
          description: "Laissez vide pour utiliser le format par défaut",
        },
        showSiteNameWatermark: {
          type: "radio",
          label: "Afficher le watermark",
          options: [
            { label: "Oui", value: true },
            { label: "Non", value: false },
          ],
        },
        showPagesSection: {
          type: "radio",
          label: "Afficher section Pages",
          options: [
            { label: "Oui", value: true },
            { label: "Non", value: false },
          ],
        },
        pagesTitle: {
          type: "text",
          label: "Titre section Pages",
        },
        showSocialsSection: {
          type: "radio",
          label: "Afficher section Réseaux sociaux",
          options: [
            { label: "Oui", value: true },
            { label: "Non", value: false },
          ],
        },
        socialsTitle: {
          type: "text",
          label: "Titre section Réseaux sociaux",
        },
        showLegalSection: {
          type: "radio",
          label: "Afficher section Légal",
          options: [
            { label: "Oui", value: true },
            { label: "Non", value: false },
          ],
        },
        legalTitle: {
          type: "text",
          label: "Titre section Légal",
        },
        privacyLinkText: {
          type: "text",
          label: "Texte lien Confidentialité",
        },
        termsLinkText: {
          type: "text",
          label: "Texte lien Conditions",
        },
      },
      defaultProps: {
        siteName: "ExilonCMS",
        copyrightText: "",
        showSiteNameWatermark: true,
        showPagesSection: true,
        pagesTitle: "Pages",
        showSocialsSection: true,
        socialsTitle: "Réseaux sociaux",
        showLegalSection: true,
        legalTitle: "Légal",
        privacyLinkText: "Politique de confidentialité",
        termsLinkText: "Conditions d'utilisation",
      },
      render: FooterBlock,
    },

    // ============================================
    // TYPOGRAPHY
    // ============================================
    HeadingBlock: {
      label: "Titre",
      fields: {
        level: {
          type: "select",
          label: "Niveau",
          options: [
            { label: "H1 (Titre principal)", value: "h1" },
            { label: "H2 (Grand titre)", value: "h2" },
            { label: "H3 (Titre moyen)", value: "h3" },
            { label: "H4 (Petit titre)", value: "h4" },
            { label: "H5", value: "h5" },
            { label: "H6", value: "h6" },
          ],
        },
        text: {
          type: "text",
          label: "Texte",
        },
        align: {
          type: "radio",
          label: "Alignement",
          options: [
            { label: "Gauche", value: "left" },
            { label: "Centre", value: "center" },
            { label: "Droite", value: "right" },
          ],
        },
        color: {
          type: "text",
          label: "Couleur (optionnel)",
          description: "Ex: primary, foreground, gray-900, #000000",
          placeholder: "primary",
        },
      },
      defaultProps: {
        level: "h2",
        text: "Votre titre ici",
        align: "left",
      },
      render: HeadingBlock,
    },

    ParagraphBlock: {
      label: "Paragraphe",
      fields: {
        text: {
          type: "textarea",
          label: "Texte",
        },
        align: {
          type: "radio",
          label: "Alignement",
          options: [
            { label: "Gauche", value: "left" },
            { label: "Centre", value: "center" },
            { label: "Droite", value: "right" },
          ],
        },
        size: {
          type: "radio",
          label: "Taille",
          options: [
            { label: "Petit", value: "sm" },
            { label: "Normal", value: "base" },
            { label: "Grand", value: "lg" },
          ],
        },
      },
      defaultProps: {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        align: "left",
        size: "base",
      },
      render: ParagraphBlock,
    },

    // ============================================
    // INTERACTIVE
    // ============================================
    ButtonBlock: {
      label: "Bouton",
      fields: {
        text: {
          type: "text",
          label: "Texte du bouton",
        },
        href: {
          type: "text",
          label: "Lien (URL)",
        },
        variant: {
          type: "select",
          label: "Style",
          options: [
            { label: "Primaire (primary)", value: "primary" },
            { label: "Secondaire (gray)", value: "secondary" },
            { label: "Contour", value: "outline" },
            { label: "Transparent", value: "ghost" },
          ],
        },
        size: {
          type: "radio",
          label: "Taille",
          options: [
            { label: "Petit", value: "sm" },
            { label: "Moyen", value: "md" },
            { label: "Grand", value: "lg" },
          ],
        },
        align: {
          type: "radio",
          label: "Alignement",
          options: [
            { label: "Gauche", value: "left" },
            { label: "Centre", value: "center" },
            { label: "Droite", value: "right" },
          ],
        },
      },
      defaultProps: {
        text: "Cliquez ici",
        href: "#",
        variant: "primary",
        size: "md",
        align: "left",
      },
      render: ButtonBlock,
    },

    // ============================================
    // MEDIA
    // ============================================
    ImageBlock: {
      label: "Image",
      fields: {
        src: {
          type: "text",
          label: "URL de l'image",
        },
        alt: {
          type: "text",
          label: "Texte alternatif",
        },
        width: {
          type: "number",
          label: "Largeur (optionnel)",
        },
        height: {
          type: "number",
          label: "Hauteur (optionnel)",
        },
        rounded: {
          type: "radio",
          label: "Bords arrondis",
          options: [
            { label: "Non", value: false },
            { label: "Oui", value: true },
          ],
        },
      },
      defaultProps: {
        src: "https://via.placeholder.com/800x400",
        alt: "Image",
        rounded: true,
      },
      render: ImageBlock,
    },

    // ============================================
    // LANDING PAGE COMPONENTS
    // ============================================
    HeroBlock: {
      label: "Hero Principal",
      fields: {
        title_main: {
          type: "text",
          label: "Titre principal",
          description: "Utilisez les clés de traduction ou texte direct",
        },
        title_highlight: {
          type: "text",
          label: "Titre en surbrillance",
        },
        subtitle: {
          type: "textarea",
          label: "Sous-titre",
        },
        cta_text: {
          type: "text",
          label: "Texte du bouton CTA",
        },
        cta_url: {
          type: "text",
          label: "URL du bouton CTA",
        },
        show_server_status: {
          type: "radio",
          label: "Afficher le statut du serveur",
          options: [
            { label: "Oui", value: true },
            { label: "Non", value: false },
          ],
        },
        show_stats_card: {
          type: "radio",
          label: "Afficher la carte des stats",
          options: [
            { label: "Oui", value: true },
            { label: "Non", value: false },
          ],
        },
      },
      defaultProps: {
        title_main: "Bienvenue sur",
        title_highlight: "Notre Serveur",
        subtitle: "Rejoignez notre communauté et commencez votre aventure !",
        cta_text: "Commencer",
        cta_url: "/register",
        show_server_status: true,
        show_stats_card: true,
      },
      render: HeroBlock,
    },

    HowItWorksBlock: {
      label: "Comment ça marche",
      fields: {
        badge: { type: "text", label: "Badge" },
        title_main: { type: "text", label: "Titre principal" },
        title_highlight: { type: "text", label: "Titre en surbrillance" },
        subtitle: { type: "textarea", label: "Sous-titre" },
        server_address: { type: "text", label: "Adresse du serveur" },
        step1_title: { type: "text", label: "Étape 1 - Titre" },
        step1_desc: { type: "textarea", label: "Étape 1 - Description" },
        step2_title: { type: "text", label: "Étape 2 - Titre" },
        step2_desc: { type: "textarea", label: "Étape 2 - Description" },
        step3_title: { type: "text", label: "Étape 3 - Titre" },
        step3_desc: { type: "textarea", label: "Étape 3 - Description" },
        step4_title: { type: "text", label: "Étape 4 - Titre" },
        step4_desc: { type: "textarea", label: "Étape 4 - Description" },
      },
      defaultProps: {
        badge: "Comment ça marche ?",
        title_main: "Commencez votre",
        title_highlight: "Aventure",
        subtitle: "Rejoignez le serveur en quelques étapes simples",
        server_address: "play.outland.fr",
        step1_title: "Télécharger",
        step1_desc: "Téléchargez Minecraft Java Edition",
        step2_title: "S'inscrire",
        step2_desc: "Créez votre compte sur le site",
        step3_title: "Se connecter",
        step3_desc: "Lancez Minecraft et ajoutez le serveur",
        step4_title: "Jouer",
        step4_desc: "Rejoignez l'aventure !",
      },
      render: HowItWorksBlock,
    },

    BlogBlock: {
      label: "Section Blog",
      fields: {
        title: {
          type: "text",
          label: "Titre de la section",
        },
        subtitle: {
          type: "text",
          label: "Sous-titre (badge)",
        },
        show_view_all: {
          type: "radio",
          label: "Afficher le lien 'Voir tout'",
          options: [
            { label: "Oui", value: true },
            { label: "Non", value: false },
          ],
        },
      },
      defaultProps: {
        title: "Dernières nouvelles",
        subtitle: "Actualités",
        show_view_all: true,
      },
      render: BlogBlock,
    },

    // ============================================
    // LAYOUT
    // ============================================
    ContainerBlock: {
      label: "Conteneur",
      fields: {
        max_width: {
          type: "select",
          label: "Largeur maximale",
          options: [
            { label: "Petit (640px)", value: "sm" },
            { label: "Moyen (768px)", value: "md" },
            { label: "Grand (1024px)", value: "lg" },
            { label: "Très grand (1280px)", value: "xl" },
            { label: "Plein écran", value: "full" },
          ],
        },
        padding: {
          type: "select",
          label: "Espacement interne",
          options: [
            { label: "Aucun", value: "none" },
            { label: "Petit", value: "sm" },
            { label: "Moyen", value: "md" },
            { label: "Grand", value: "lg" },
          ],
        },
        background_color: {
          type: "text",
          label: "Couleur de fond (optionnel)",
          description: "Ex: transparent, primary/10, card, #ffffff",
          placeholder: "transparent",
        },
      },
      defaultProps: {
        max_width: "xl",
        padding: "md",
        background_color: "transparent",
      },
      render: ContainerBlock,
    },

    SpacerBlock: {
      label: "Espacement",
      fields: {
        height: {
          type: "number",
          label: "Hauteur en pixels",
        },
      },
      defaultProps: {
        height: 40,
      },
      render: SpacerBlock,
    },
  },

  // Root configuration with theme support
  root: {
    fields: {
      title: {
        type: "text",
        label: "Titre de la page",
      },
    },
    render: ({ children }) => {
      return (
        <div className="min-h-screen" style={{ minHeight: '100vh' }}>
          {children}
        </div>
      );
    },
  },

  // Zone configuration for global settings
  zones: {},
};
