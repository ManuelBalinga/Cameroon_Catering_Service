import type { Review } from "@/lib/types";

/**
 * Seed reviews. Trust is the platform's core asset, so reviews carry a
 * `verifiedBooking` flag — only customers who actually booked and paid a
 * deposit through the platform can leave a verified review.
 */
export const reviews: Review[] = [
  {
    id: "rev-1",
    catererId: "mamie-nkeng",
    author: "Estelle M.",
    city: "Douala",
    eventType: "wedding",
    rating: 5,
    comment: {
      en: "The Ndolé was the talk of our wedding! 300 guests served hot, on time. Mamie Nkeng is a professional.",
      fr: "Le Ndolé a fait sensation à notre mariage ! 300 invités servis chauds, à l'heure. Mamie Nkeng est une professionnelle.",
    },
    date: "2026-05-12",
    verifiedBooking: true,
  },
  {
    id: "rev-2",
    catererId: "mamie-nkeng",
    author: "Pastor Ako",
    city: "Douala",
    eventType: "church",
    rating: 5,
    comment: {
      en: "Catered our church anniversary for 500 people. Generous portions and very fair price. God bless this team.",
      fr: "A assuré notre anniversaire d'église pour 500 personnes. Portions généreuses et prix très correct. Que Dieu bénisse cette équipe.",
    },
    date: "2026-04-02",
    verifiedBooking: true,
  },
  {
    id: "rev-3",
    catererId: "mamie-nkeng",
    author: "Junior T.",
    city: "Edéa",
    eventType: "funeral",
    rating: 4,
    comment: {
      en: "Reliable for our family's cry-die. Setup was a little late but food quality made up for it.",
      fr: "Fiable pour le deuil de notre famille. L'installation a pris un peu de retard mais la qualité a compensé.",
    },
    date: "2026-03-18",
    verifiedBooking: true,
  },
  {
    id: "rev-4",
    catererId: "royal-taste",
    author: "MINEPAT Office",
    city: "Yaoundé",
    eventType: "office",
    rating: 5,
    comment: {
      en: "Handled our ministerial luncheon flawlessly. Uniformed staff, elegant presentation. Highly professional.",
      fr: "A géré notre déjeuner ministériel à la perfection. Personnel en uniforme, présentation élégante. Très professionnel.",
    },
    date: "2026-06-01",
    verifiedBooking: true,
  },
  {
    id: "rev-5",
    catererId: "royal-taste",
    author: "Carine N.",
    city: "Yaoundé",
    eventType: "wedding",
    rating: 5,
    comment: {
      en: "Continental buffet was exquisite. Worth every franc. Our guests are still talking about the canapés.",
      fr: "Le buffet continental était exquis. Chaque franc en valait la peine. Nos invités parlent encore des canapés.",
    },
    date: "2026-05-28",
    verifiedBooking: true,
  },
  {
    id: "rev-6",
    catererId: "bamenda-flavors",
    author: "Ma Bih",
    city: "Bamenda",
    eventType: "funeral",
    rating: 5,
    comment: {
      en: "Achu just like home. Fed the whole compound and everyone was satisfied. Very affordable.",
      fr: "L'Achu comme à la maison. A nourri toute la concession et tout le monde était satisfait. Très abordable.",
    },
    date: "2026-04-20",
    verifiedBooking: true,
  },
  {
    id: "rev-7",
    catererId: "buea-delights",
    author: "Frankline E.",
    city: "Limbe",
    eventType: "birthday",
    rating: 5,
    comment: {
      en: "Fresh prawns at my beach birthday — incredible. Booking and deposit on the platform was smooth.",
      fr: "Crevettes fraîches à mon anniversaire sur la plage — incroyable. Réservation et acompte très fluides.",
    },
    date: "2026-06-10",
    verifiedBooking: true,
  },
  {
    id: "rev-8",
    catererId: "buea-delights",
    author: "UB Student Union",
    city: "Buea",
    eventType: "school",
    rating: 4,
    comment: {
      en: "Great value for our faculty dinner. Pepper soup was a hit. Would book again.",
      fr: "Bon rapport qualité-prix pour notre dîner de faculté. Le pepper soup a eu du succès. Je réserverai à nouveau.",
    },
    date: "2026-05-05",
    verifiedBooking: true,
  },
  {
    id: "rev-9",
    catererId: "sweet-celebration",
    author: "Michelle A.",
    city: "Douala",
    eventType: "birthday",
    rating: 5,
    comment: {
      en: "The tiered cake was a masterpiece and tasted amazing. Delivered exactly on time.",
      fr: "Le gâteau à étages était un chef-d'œuvre et délicieux. Livré exactement à l'heure.",
    },
    date: "2026-06-15",
    verifiedBooking: true,
  },
  {
    id: "rev-10",
    catererId: "bafoussam-royal",
    author: "Fongang Family",
    city: "Bafoussam",
    eventType: "funeral",
    rating: 4,
    comment: {
      en: "Fed over 600 people at our succession ceremony without any shortage. Dependable for big events.",
      fr: "A nourri plus de 600 personnes à notre cérémonie de succession sans manquer. Fiable pour les grands événements.",
    },
    date: "2026-03-30",
    verifiedBooking: true,
  },
  {
    id: "rev-11",
    catererId: "kribi-coast",
    author: "Sandrine & Paul",
    city: "Kribi",
    eventType: "wedding",
    rating: 5,
    comment: {
      en: "Sunset beach wedding with grilled gambas — a dream. The team handled everything, we just enjoyed.",
      fr: "Mariage sur la plage au coucher du soleil avec gambas grillées — un rêve. L'équipe a tout géré, nous avons juste profité.",
    },
    date: "2026-06-08",
    verifiedBooking: true,
  },
  {
    id: "rev-12",
    catererId: "green-plate",
    author: "GIZ Team",
    city: "Yaoundé",
    eventType: "office",
    rating: 4,
    comment: {
      en: "Healthy, fresh and colourful office lunches. Our team loves the grain bowls every Friday.",
      fr: "Déjeuners de bureau sains, frais et colorés. Notre équipe adore les bols de céréales chaque vendredi.",
    },
    date: "2026-06-20",
    verifiedBooking: true,
  },
];

export function reviewsFor(catererId: string): Review[] {
  return reviews
    .filter((r) => r.catererId === catererId)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function recentReviews(limit = 6): Review[] {
  return [...reviews].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, limit);
}
