import type { Caterer, EventPackage, MenuItem, Cuisine } from "@/lib/types";

/**
 * Seed caterers.
 *
 * This is mock/seed data standing in for a real database (Supabase/Firebase).
 * It is intentionally realistic for the Cameroonian market: local cities,
 * local dishes, FCFA pricing, WhatsApp numbers and Mobile Money-friendly
 * businesses ranging from home-based cooks to professional companies.
 */

/**
 * Build the four standard event packages (20 / 50 / 100 / 200 guests) that
 * every caterer offers. Common guest counts make it easy for customers to
 * picture the cost of their event at a glance.
 */
function standardPackages(
  base: number,
  opts?: { serviceFrom?: number }
): EventPackage[] {
  const serviceFrom = opts?.serviceFrom ?? 100;
  const tiers: { guests: number; factor: number; name: [string, string] }[] = [
    { guests: 20, factor: 1.15, name: ["Intimate", "Intime"] },
    { guests: 50, factor: 1.0, name: ["Family", "Famille"] },
    { guests: 100, factor: 0.92, name: ["Celebration", "Célébration"] },
    { guests: 200, factor: 0.85, name: ["Grand event", "Grand événement"] },
  ];

  return tiers.map((tier) => {
    const pricePerGuest = Math.round((base * tier.factor) / 50) * 50;
    return {
      id: `pkg-${tier.guests}`,
      name: {
        en: `${tier.name[0]} — ${tier.guests} guests`,
        fr: `${tier.name[1]} — ${tier.guests} invités`,
      },
      guestCount: tier.guests,
      pricePerGuest,
      includesService: tier.guests >= serviceFrom,
      highlights: [
        { en: "2 main dishes + 2 sides", fr: "2 plats + 2 accompagnements" },
        { en: "Starters & fresh juice", fr: "Entrées & jus frais" },
        {
          en: tier.guests >= serviceFrom ? "Waitstaff included" : "Delivery & setup",
          fr: tier.guests >= serviceFrom ? "Service inclus" : "Livraison & installation",
        },
      ],
    };
  });
}

function menu(items: [string, string, string, Cuisine, number][]): MenuItem[] {
  return items.map(([id, name, desc, cuisine, price], i) => ({
    id: `${id}-${i}`,
    name,
    description: { en: desc, fr: desc },
    cuisine,
    pricePerGuest: price,
  }));
}

export const caterers: Caterer[] = [
  {
    id: "mamie-nkeng",
    businessName: "Mamie Nkeng Traiteur",
    tagline: {
      en: "Authentic Cameroonian feasts for weddings & funerals",
      fr: "Festins camerounais authentiques pour mariages & funérailles",
    },
    about: {
      en: "For over 12 years, Mamie Nkeng has cooked for the biggest weddings and traditional ceremonies in Douala. We are famous for Ndolé, Poulet DG and Eru made the way grandma taught. Every dish is prepared fresh on the morning of your event.",
      fr: "Depuis plus de 12 ans, Mamie Nkeng cuisine pour les plus grands mariages et cérémonies traditionnelles de Douala. Nous sommes réputés pour le Ndolé, le Poulet DG et l'Eru préparés comme grand-mère. Chaque plat est préparé frais le matin de votre événement.",
    },
    city: "Douala",
    serviceAreas: ["Douala", "Bonabéri", "Edéa"],
    cuisines: ["cameroonian", "grill", "continental"],
    verified: true,
    featured: true,
    subscriptionTier: "premium",
    rating: 4.9,
    reviewCount: 128,
    completedEvents: 340,
    minGuests: 20,
    priceFromPerGuest: 3500,
    priceToPerGuest: 9000,
    responseTimeHours: 2,
    yearsActive: 12,
    phone: "+237 6 99 12 34 56",
    whatsapp: "237699123456",
    brandHue: 145,
    packages: standardPackages(4500, { serviceFrom: 50 }),
    menu: menu([
      ["ndole", "Ndolé & Prawns", "Bitterleaf stew with prawns and beef, served with fried plantain", "cameroonian", 3500],
      ["dg", "Poulet DG", "Sautéed chicken with plantains, carrots and green beans", "cameroonian", 3000],
      ["eru", "Eru & Water Fufu", "Forest leaves with waterleaf, cow skin and smoked fish", "cameroonian", 2500],
      ["jollof", "Jollof Rice & Grilled Chicken", "Party jollof with barbecue chicken", "grill", 2800],
      ["fish", "Grilled Bar Fish", "Whole grilled fish with pepper sauce and miondo", "seafood", 4000],
    ]),
    gallery: ["Wedding buffet", "Traditional plates", "Grilled fish table", "Ndolé pot"],
    bookedDates: ["2026-07-18", "2026-07-25", "2026-08-01", "2026-08-15"],
  },
  {
    id: "royal-taste",
    businessName: "Royal Taste Events",
    tagline: {
      en: "Professional catering & full event service in Yaoundé",
      fr: "Traiteur professionnel & service complet à Yaoundé",
    },
    about: {
      en: "Royal Taste is a full-service catering company trusted by embassies, ministries and corporate clients. We combine Cameroonian classics with continental fine dining, and can handle events from 20 to 1,000 guests with uniformed waitstaff.",
      fr: "Royal Taste est une entreprise de traiteur complète, choisie par les ambassades, ministères et entreprises. Nous associons classiques camerounais et cuisine continentale, pour des événements de 20 à 1 000 invités avec personnel en uniforme.",
    },
    city: "Yaoundé",
    serviceAreas: ["Yaoundé", "Mbalmayo", "Obala"],
    cuisines: ["continental", "cameroonian", "asian", "pastry"],
    verified: true,
    featured: true,
    subscriptionTier: "premium",
    rating: 4.8,
    reviewCount: 96,
    completedEvents: 210,
    minGuests: 20,
    priceFromPerGuest: 5000,
    priceToPerGuest: 15000,
    responseTimeHours: 3,
    yearsActive: 8,
    phone: "+237 6 77 88 99 00",
    whatsapp: "237677889900",
    brandHue: 205,
    packages: standardPackages(6500, { serviceFrom: 50 }),
    menu: menu([
      ["buffet", "Continental Buffet", "Roast beef, grilled fish, rice pilaf, ratatouille and salads", "continental", 6000],
      ["canape", "Cocktail Canapés", "Assorted finger food for standing receptions", "continental", 4500],
      ["dg", "Poulet DG Deluxe", "Premium Poulet DG with gizzards and plantain", "cameroonian", 3500],
      ["fried", "Fried Rice & Chicken", "Asian-style fried rice with glazed chicken", "asian", 3200],
      ["dessert", "Dessert Station", "Pastries, fruit and mini cakes", "pastry", 2500],
    ]),
    gallery: ["Corporate gala", "Buffet line", "Canapé trays", "Head table"],
    bookedDates: ["2026-07-12", "2026-07-19", "2026-08-08", "2026-08-22", "2026-09-05"],
  },
  {
    id: "bamenda-flavors",
    businessName: "Bamenda Flavors Kitchen",
    tagline: {
      en: "Home-style Grassfield cooking for family gatherings",
      fr: "Cuisine du Grassfield pour les fêtes de famille",
    },
    about: {
      en: "A home-based caterer specialising in North-West favourites — Achu and yellow soup, Corn Fufu and Njama Njama, Kati Kati chicken. Affordable, generous portions and a warm personal touch for weddings, cry-die and thanksgivings.",
      fr: "Traiteur à domicile spécialisé dans les plats du Nord-Ouest — Achu et sauce jaune, Corn Fufu et Njama Njama, poulet Kati Kati. Portions généreuses et abordables pour mariages, deuils et actions de grâce.",
    },
    city: "Bamenda",
    serviceAreas: ["Bamenda", "Bafut", "Bali"],
    cuisines: ["cameroonian", "grill"],
    verified: true,
    featured: false,
    subscriptionTier: "free",
    rating: 4.7,
    reviewCount: 54,
    completedEvents: 130,
    minGuests: 20,
    priceFromPerGuest: 2500,
    priceToPerGuest: 6000,
    responseTimeHours: 5,
    yearsActive: 6,
    phone: "+237 6 71 22 33 44",
    whatsapp: "237671223344",
    brandHue: 25,
    packages: standardPackages(3000, { serviceFrom: 100 }),
    menu: menu([
      ["achu", "Achu & Yellow Soup", "Pounded cocoyam with limestone yellow soup and beef", "cameroonian", 3000],
      ["njama", "Corn Fufu & Njama Njama", "Huckleberry greens with corn fufu", "cameroonian", 2200],
      ["katikati", "Kati Kati Chicken", "Roasted chicken in palm oil with achu spices", "grill", 3200],
      ["rice", "Coconut Rice", "Rice cooked in coconut milk with vegetables", "cameroonian", 2000],
    ]),
    gallery: ["Achu bowls", "Family buffet", "Kati Kati grill", "Village setup"],
    bookedDates: ["2026-07-26", "2026-08-09"],
  },
  {
    id: "buea-delights",
    businessName: "Buea Mountain Delights",
    tagline: {
      en: "Fresh seafood & continental menus at the foot of the mountain",
      fr: "Fruits de mer frais & menus continentaux au pied du mont",
    },
    about: {
      en: "Based in Buea, we bring fresh Limbe seafood to your table — grilled prawns, bar fish, and pepper soup — alongside continental options for a modern crowd. Popular for beach weddings, birthdays and university events.",
      fr: "Basés à Buea, nous apportons les fruits de mer frais de Limbe — crevettes grillées, poisson bar et pepper soup — avec des options continentales pour un public moderne. Idéal pour mariages sur la plage, anniversaires et événements universitaires.",
    },
    city: "Buea",
    serviceAreas: ["Buea", "Limbe", "Tiko", "Mutengene"],
    cuisines: ["seafood", "continental", "grill"],
    verified: true,
    featured: true,
    subscriptionTier: "free",
    rating: 4.6,
    reviewCount: 71,
    completedEvents: 95,
    minGuests: 20,
    priceFromPerGuest: 4000,
    priceToPerGuest: 11000,
    responseTimeHours: 4,
    yearsActive: 5,
    phone: "+237 6 55 44 33 22",
    whatsapp: "237655443322",
    brandHue: 190,
    packages: standardPackages(5000, { serviceFrom: 50 }),
    menu: menu([
      ["prawns", "Grilled Prawn Platter", "Fresh Limbe prawns grilled with garlic butter", "seafood", 5500],
      ["peppersoup", "Fish Pepper Soup", "Spicy catfish pepper soup with country onions", "seafood", 3000],
      ["burger", "Continental Grill", "Beef steak, sausages and grilled vegetables", "grill", 4500],
      ["salad", "Garden Salad Bar", "Fresh salad station with dressings", "continental", 2000],
    ]),
    gallery: ["Seafood platter", "Beach setup", "Pepper soup pots", "Grill station"],
    bookedDates: ["2026-07-15", "2026-07-30", "2026-08-14"],
  },
  {
    id: "sweet-celebration",
    businessName: "Sweet Celebration Bakery",
    tagline: {
      en: "Cakes, pastries & dessert tables that steal the show",
      fr: "Gâteaux, pâtisseries & tables de dessert qui font sensation",
    },
    about: {
      en: "A boutique bakery for weddings, birthdays and corporate events. We design custom cakes, cupcake towers and full dessert tables. Pair us with any caterer on the platform, or book us for a sweet-only event.",
      fr: "Une pâtisserie boutique pour mariages, anniversaires et événements d'entreprise. Nous créons gâteaux sur mesure, tours de cupcakes et tables de dessert complètes. Associez-nous à tout traiteur, ou réservez-nous seuls.",
    },
    city: "Douala",
    serviceAreas: ["Douala", "Yaoundé (on request)"],
    cuisines: ["pastry"],
    verified: true,
    featured: false,
    subscriptionTier: "premium",
    rating: 4.9,
    reviewCount: 143,
    completedEvents: 400,
    minGuests: 20,
    priceFromPerGuest: 1500,
    priceToPerGuest: 5000,
    responseTimeHours: 6,
    yearsActive: 7,
    phone: "+237 6 90 10 20 30",
    whatsapp: "237690102030",
    brandHue: 330,
    packages: standardPackages(2000, { serviceFrom: 999 }),
    menu: menu([
      ["cake", "Custom Tiered Cake", "3-tier celebration cake, your design", "pastry", 3000],
      ["cupcakes", "Cupcake Tower", "Assorted gourmet cupcakes", "pastry", 1200],
      ["table", "Dessert Table", "Cake pops, macarons, tarts and mini pastries", "pastry", 2500],
      ["puff", "Puff-Puff & Chin Chin", "Classic Cameroonian party snacks", "pastry", 800],
    ]),
    gallery: ["Wedding cake", "Cupcake tower", "Dessert table", "Macaron trays"],
    bookedDates: ["2026-07-20"],
  },
  {
    id: "bafoussam-royal",
    businessName: "Bafoussam Royal Kitchen",
    tagline: {
      en: "Big Bamileke ceremonies handled with pride",
      fr: "Grandes cérémonies Bamiléké gérées avec fierté",
    },
    about: {
      en: "We specialise in large West-region ceremonies — funerals, dowries and successions — where hundreds must be fed with dignity. Rice, koki, taro and grilled meats in industrial quantities, delivered on time, every time.",
      fr: "Nous sommes spécialisés dans les grandes cérémonies de l'Ouest — funérailles, dots et successions — où des centaines de personnes doivent être servies avec dignité. Riz, koki, taro et grillades en grande quantité, livrés à temps.",
    },
    city: "Bafoussam",
    serviceAreas: ["Bafoussam", "Dschang", "Mbouda", "Bandjoun"],
    cuisines: ["cameroonian", "grill"],
    verified: true,
    featured: false,
    subscriptionTier: "free",
    rating: 4.5,
    reviewCount: 38,
    completedEvents: 160,
    minGuests: 50,
    priceFromPerGuest: 2000,
    priceToPerGuest: 5500,
    responseTimeHours: 8,
    yearsActive: 10,
    phone: "+237 6 96 55 66 77",
    whatsapp: "237696556677",
    brandHue: 45,
    packages: standardPackages(2600, { serviceFrom: 100 }),
    menu: menu([
      ["koki", "Koki & Ripe Plantain", "Steamed black-eyed pea pudding with plantain", "cameroonian", 2000],
      ["taro", "Taro & Yellow Soup", "Taro with palm-oil yellow soup", "cameroonian", 2400],
      ["rice", "Party Rice & Beef", "Seasoned rice with stewed beef", "cameroonian", 1800],
      ["soya", "Soya Grill", "Spiced grilled beef skewers", "grill", 2200],
    ]),
    gallery: ["Ceremony tent", "Rice service", "Grill line", "Koki leaves"],
    bookedDates: ["2026-07-11", "2026-07-24", "2026-08-07", "2026-08-21"],
  },
  {
    id: "green-plate",
    businessName: "Green Plate Healthy Catering",
    tagline: {
      en: "Vegetarian, vegan & healthy office lunches",
      fr: "Déjeuners de bureau végétariens, végans & sains",
    },
    about: {
      en: "Modern, health-conscious catering for offices, NGOs and private dinners. Colourful vegetarian bowls, plant-based proteins and fresh cold-pressed juices. We make healthy eating easy for busy teams in Yaoundé and Douala.",
      fr: "Traiteur moderne et sain pour bureaux, ONG et dîners privés. Bols végétariens colorés, protéines végétales et jus pressés à froid. Nous facilitons l'alimentation saine des équipes à Yaoundé et Douala.",
    },
    city: "Yaoundé",
    serviceAreas: ["Yaoundé", "Douala"],
    cuisines: ["vegetarian", "continental"],
    verified: false,
    featured: false,
    subscriptionTier: "free",
    rating: 4.4,
    reviewCount: 22,
    completedEvents: 40,
    minGuests: 20,
    priceFromPerGuest: 3000,
    priceToPerGuest: 7000,
    responseTimeHours: 4,
    yearsActive: 2,
    phone: "+237 6 80 40 50 60",
    whatsapp: "237680405060",
    brandHue: 95,
    packages: standardPackages(3800, { serviceFrom: 100 }),
    menu: menu([
      ["bowl", "Power Grain Bowl", "Quinoa, beans, avocado and roasted vegetables", "vegetarian", 3500],
      ["wrap", "Veggie Wraps", "Whole-wheat wraps with hummus and greens", "vegetarian", 2500],
      ["salad", "Rainbow Salad Bar", "Build-your-own salad with 12 toppings", "vegetarian", 3000],
      ["juice", "Cold-Pressed Juice", "Ginger, pineapple and beetroot juices", "continental", 1500],
    ]),
    gallery: ["Grain bowls", "Salad bar", "Juice station", "Office lunch"],
    bookedDates: [],
  },
  {
    id: "kribi-coast",
    businessName: "Kribi Coast Catering",
    tagline: {
      en: "Beachside seafood & grills for coastal celebrations",
      fr: "Fruits de mer & grillades en bord de mer pour vos fêtes",
    },
    about: {
      en: "Kribi's favourite for destination weddings and seaside parties. We serve just-caught seafood, gambas, and beach barbecue with a sunset view. Full setup with canopies, tables and waitstaff available.",
      fr: "Le favori de Kribi pour mariages et fêtes en bord de mer. Nous servons des fruits de mer fraîchement pêchés, gambas et barbecue de plage au coucher du soleil. Installation complète avec bâches, tables et service.",
    },
    city: "Kribi",
    serviceAreas: ["Kribi", "Edéa", "Campo"],
    cuisines: ["seafood", "grill", "continental"],
    verified: true,
    featured: false,
    subscriptionTier: "free",
    rating: 4.7,
    reviewCount: 33,
    completedEvents: 60,
    minGuests: 20,
    priceFromPerGuest: 4500,
    priceToPerGuest: 12000,
    responseTimeHours: 6,
    yearsActive: 4,
    phone: "+237 6 78 12 90 34",
    whatsapp: "237678129034",
    brandHue: 175,
    packages: standardPackages(5500, { serviceFrom: 50 }),
    menu: menu([
      ["gambas", "Grilled Gambas", "Giant prawns grilled with herbs and lime", "seafood", 6000],
      ["lobster", "Lobster & Plantain", "Grilled lobster with fried plantain", "seafood", 8000],
      ["bbq", "Beach BBQ Platter", "Mixed grill of fish, chicken and beef", "grill", 4500],
      ["rice", "Coconut Seafood Rice", "Coconut rice with prawns and calamari", "seafood", 4000],
    ]),
    gallery: ["Beach wedding", "Gambas grill", "Sunset tables", "Seafood spread"],
    bookedDates: ["2026-08-02", "2026-08-16"],
  },
];

export function getCaterer(id: string): Caterer | undefined {
  return caterers.find((c) => c.id === id);
}

export function featuredCaterers(): Caterer[] {
  return caterers.filter((c) => c.featured);
}

/** Unique, sorted list of cities that have at least one caterer. */
export function catererCities(): string[] {
  return Array.from(new Set(caterers.map((c) => c.city))).sort();
}
