export const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const variants = {
  initial: {
    opacity: 0,
    y: 40,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const graphData = [
  { id: 1, currentHeight: "120px", previousHeight: "80px" },
  { id: 2, currentHeight: "90px", previousHeight: "110px" },
  { id: 3, currentHeight: "140px", previousHeight: "60px" },
  { id: 4, currentHeight: "100px", previousHeight: "90px" },
  { id: 5, currentHeight: "70px", previousHeight: "120px" },
  { id: 6, currentHeight: "110px", previousHeight: "75px" },
  { id: 7, currentHeight: "95px", previousHeight: "100px" },
];

export const FAQData = [
  {
    question: "Comment rejoindre le serveur ?",
    answer:
      "Il suffit de créer un compte sur notre site, puis d'utiliser l'adresse IP du serveur fournie dans votre profil pour vous connecter depuis Minecraft.",
  },
  {
    question: "Le serveur est-il gratuit ?",
    answer:
      "Oui, le serveur est entièrement gratuit. Nous proposons également des packs premium optionnels pour soutenir le serveur et obtenir des avantages cosmétiques.",
  },
  {
    question: "Quelles versions de Minecraft sont supportées ?",
    answer:
      "Nous supportons les versions Java Edition de la 1.19 à la dernière version disponible. Assurez-vous d'avoir une version compatible pour rejoindre le serveur.",
  },
  {
    question: "Y a-t-il des règles à respecter ?",
    answer:
      "Oui, nous avons un ensemble de règles visant à maintenir une communauté respectueuse et agréable. Consultez notre page 'Règlement' pour plus de détails.",
  },
  {
    question: "Comment signaler un problème ou un bug ?",
    answer:
      "Vous pouvez signaler tout problème via notre Discord officiel ou en créant un ticket depuis votre espace membre sur le site.",
  },
];
