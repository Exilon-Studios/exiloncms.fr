export const graphData: Array<{
  id: number;
  currentHeight?: string;
  previousHeight?: string;
}> = [
  {
    id: 1,
    currentHeight: "50px",
    previousHeight: "38px",
  },
  {
    id: 2,
    currentHeight: "101px",
    previousHeight: "67px",
  },
  {
    id: 3,
    currentHeight: "122px",
    previousHeight: "92px",
  },
  {
    id: 4,
    currentHeight: "85px",
    previousHeight: "44px",
  },
  {
    id: 5,
    currentHeight: "50px",
    previousHeight: "31px",
  },
  {
    id: 6,
    currentHeight: "106px",
    previousHeight: "80px",
  },
];

export const transition = { duration: 0, ease: [0, 0, 0, 0] as const };
export const variants = {
  hidden: { transform: "translateY(0)", opacity: 1 },
  visible: { transform: "translateY(0)", opacity: 1 },
};
export const cardVariants = {
  hidden: { opacity: 1, transform: "scale(1) rotate(0deg)" },
  visible: { opacity: 1, transform: "scale(1) rotate(0deg)" },
};

export const FAQData: {
  title: string;
  description: string;
}[] = [
  {
    title: "What is this blog about?",
    description:
      "Welcome to our blog, where we share articles, insights, and stories on topics that matter to you. Our purpose is to inform, inspire, and engage our readers with high-quality content. We cover a wide range of topics including technology, lifestyle, tutorials, and opinion pieces.",
  },
  {
    title: "How do I contact the team?",
    description:
      "If you have any questions or suggestions, please don't hesitate to reach out. We value your feedback and are always looking to improve. You can contact us through our contact form, or via email. We typically respond within 24-48 hours.",
  },
  {
    title: "How often do you publish new content?",
    description:
      "We publish new articles regularly, typically several times per week. Our editorial team works hard to bring you fresh, relevant content on a consistent basis. You can subscribe to our newsletter to never miss an update.",
  },
  {
    title: "Can I submit a guest post?",
    description:
      "Yes, we accept guest posts from qualified writers. Please review our guest post guidelines and submit your article for review. We look for well-written, original content that provides value to our readers.",
  },
  {
    title: "Do you have a newsletter?",
    description:
      "Yes! Subscribe to our newsletter to receive the latest articles, exclusive content, and updates directly in your inbox. We respect your privacy and you can unsubscribe at any time.",
  },
  {
    title: "How can I share articles?",
    description:
      "You can easily share our articles using the social media buttons on each post. Help us spread the word by sharing content you find valuable with your friends, family, and followers.",
  },
];

// World Map data
export const WorldMapDotsData = [
  {
    start: {
      lat: 60.2008,
      lng: -149.4937,
    },
    end: {
      lat: -21.7975,
      lng: -60.8919,
    },
  },
  {
    start: { lat: 60.2008, lng: -149.4937 },
    end: { lat: 75.7975, lng: -42.8919 },
  },
  {
    start: { lat: -21.7975, lng: -60.8919 },
    end: { lat: 4.7223, lng: 16.1393 },
  },
  {
    start: {
      lat: 70.7975,
      lng: -42.8919,
    },
    end: {
      lat: 4.7223,
      lng: 16.1393,
    },
  },
  {
    start: {
      lat: 65.5074,
      lng: 100.1278,
    },
    end: {
      lat: 75.7975,
      lng: -42.8919,
    },
  },
  {
    start: {
      lat: 4.7223,
      lng: 16.1393,
    },
    end: {
      lat: 65.5074,
      lng: 100.1278,
    },
  },
  {
    start: {
      lat: 10.5074,
      lng: 95.1278,
    },
    end: {
      lat: 4.7223,
      lng: 16.1393,
    },
  },
];

export const WorldMapAvatarsData = [
  {
    lat: 60.2008,
    lng: -149.4937,
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar1",
    size: 20,
  },
  {
    lat: -21.7975,
    lng: -60.8919,
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar2",
    size: 26,
  },
  {
    lat: 75.7975,
    lng: -42.8919,
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar3",
    size: 28,
  },
  {
    lat: 4.7223,
    lng: 16.1393,
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar4",
    size: 30,
  },
  {
    lat: 65.5074,
    lng: 100.1278,
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar5",
    size: 35,
  },
  {
    lat: 10.5074,
    lng: 95.1278,
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar6",
    size: 19,
  },
];
