export const coffeeProducts = [
  {
    id: 1,
    brand: "Starbucks",
    productTitle: "Pike Place Roast",
    description: "Well-rounded with subtle notes of cocoa and toasted nuts balancing the smooth mouthfeel.",
    attributes: {
      category: "Whole Bean",
      origin: "Multi-Region",
      roastLevel: "Medium",
      flavorNotes: ["Cocoa", "Toasted Nuts"],
      intensity: 5,
      caffeineContent: "Regular",
      organic: false,
      fairTrade: true,
      weight: "12 oz",
      grindOptions: ["Whole Bean"],
      brewMethod: ["Drip", "French Press", "Pour Over"]
    }
  },
  {
    id: 2,
    brand: "Lavazza",
    productTitle: "Crema e Gusto Ground Coffee Blend",
    description: "A mix of Arabica and Robusta beans creates a rich, intense flavor with chocolate undertones.",
    attributes: {
      category: "Ground",
      origin: "Multi-Region",
      roastLevel: "Dark",
      flavorNotes: ["Chocolate", "Spice"],
      intensity: 8,
      caffeineContent: "Regular",
      organic: false,
      fairTrade: false,
      weight: "8.8 oz",
      grindOptions: ["Fine", "Medium"],
      brewMethod: ["Espresso", "Moka Pot"]
    }
  },
  {
    id: 3,
    brand: "Peet's Coffee",
    productTitle: "Major Dickason's Blend",
    description: "Incomparable world blend, rich, complex, and full-bodied.",
    attributes: {
      category: "Whole Bean",
      origin: "Multi-Region",
      roastLevel: "Dark",
      flavorNotes: ["Full-Bodied", "Complex"],
      intensity: 9,
      caffeineContent: "Regular",
      organic: false,
      fairTrade: false,
      weight: "16 oz",
      grindOptions: ["Whole Bean"],
      brewMethod: ["Drip", "French Press", "Pour Over", "Espresso"]
    }
  },
  {
    id: 4,
    brand: "Illy",
    productTitle: "Classico Espresso",
    description: "A smooth, rich and full-bodied blend with notes of caramel and chocolate.",
    attributes: {
      category: "Ground",
      origin: "Multi-Region",
      roastLevel: "Medium",
      flavorNotes: ["Caramel", "Chocolate"],
      intensity: 7,
      caffeineContent: "Regular",
      organic: false,
      fairTrade: false,
      weight: "8.8 oz",
      grindOptions: ["Fine"],
      brewMethod: ["Espresso", "Moka Pot"]
    }
  },
  {
    id: 5,
    brand: "Death Wish Coffee",
    productTitle: "Dark Roast Coffee",
    description: "The world's strongest coffee, with double the caffeine of an average cup.",
    attributes: {
      category: "Whole Bean",
      origin: "Multi-Region",
      roastLevel: "Dark",
      flavorNotes: ["Cherry", "Chocolate"],
      intensity: 10,
      caffeineContent: "Extra Strong",
      organic: true,
      fairTrade: true,
      weight: "16 oz",
      grindOptions: ["Whole Bean"],
      brewMethod: ["Drip", "French Press", "Pour Over", "Cold Brew"]
    }
  },
  {
    id: 6,
    brand: "Keurig",
    productTitle: "Green Mountain Breakfast Blend",
    description: "Light roast coffee that is bright, sweet, and engaging.",
    attributes: {
      category: "Pods",
      origin: "Multi-Region",
      roastLevel: "Light",
      flavorNotes: ["Citrus", "Nutty"],
      intensity: 3,
      caffeineContent: "Regular",
      organic: false,
      fairTrade: false,
      weight: "0.31 oz per pod",
      grindOptions: ["N/A"],
      brewMethod: ["Keurig"]
    }
  },
  {
    id: 7,
    brand: "Nespresso",
    productTitle: "Ristretto Capsules",
    description: "Intense and full-bodied espresso made from a blend of South American and East African Arabicas.",
    attributes: {
      category: "Capsules",
      origin: "Multi-Region",
      roastLevel: "Dark",
      flavorNotes: ["Cocoa", "Woody"],
      intensity: 10,
      caffeineContent: "Regular",
      organic: false,
      fairTrade: false,
      weight: "0.17 oz per capsule",
      grindOptions: ["N/A"],
      brewMethod: ["Nespresso Machine"]
    }
  },
  {
    id: 8,
    brand: "Caribou Coffee",
    productTitle: "Caribou Blend",
    description: "A smooth, classic medium roast with a rich, syrupy body and a complex profile of bittersweet cocoa and cedar.",
    attributes: {
      category: "Whole Bean",
      origin: "Multi-Region",
      roastLevel: "Medium",
      flavorNotes: ["Cocoa", "Cedar"],
      intensity: 6,
      caffeineContent: "Regular",
      organic: false,
      fairTrade: true,
      weight: "12 oz",
      grindOptions: ["Whole Bean"],
      brewMethod: ["Drip", "French Press", "Pour Over"]
    }
  },
  {
    id: 9,
    brand: "Dunkin'",
    productTitle: "Original Blend Ground Coffee",
    description: "A classic, medium-roast coffee with a smooth finish.",
    attributes: {
      category: "Ground",
      origin: "Multi-Region",
      roastLevel: "Medium",
      flavorNotes: ["Smooth", "Balanced"],
      intensity: 5,
      caffeineContent: "Regular",
      organic: false,
      fairTrade: false,
      weight: "12 oz",
      grindOptions: ["Medium"],
      brewMethod: ["Drip", "Pour Over"]
    }
  },
  {
    id: 10,
    brand: "Intelligentsia",
    productTitle: "Black Cat Classic Espresso",
    description: "A sweet and creamy espresso blend with notes of chocolate and caramel.",
    attributes: {
      category: "Whole Bean",
      origin: "Multi-Region",
      roastLevel: "Medium-Dark",
      flavorNotes: ["Chocolate", "Caramel"],
      intensity: 8,
      caffeineContent: "Regular",
      organic: false,
      fairTrade: true,
      weight: "12 oz",
      grindOptions: ["Whole Bean"],
      brewMethod: ["Espresso", "Moka Pot"]
    }
  },
  {
    id: 11,
    brand: "Blue Bottle Coffee",
    productTitle: "Three Africas",
    description: "A blend of Ethiopian, Ugandan, and Burundi coffees with bright, berry-driven flavors.",
    attributes: {
      category: "Whole Bean",
      origin: "Africa",
      roastLevel: "Light-Medium",
      flavorNotes: ["Berry", "Citrus"],
      intensity: 6,
      caffeineContent: "Regular",
      organic: true,
      fairTrade: true,
      weight: "12 oz",
      grindOptions: ["Whole Bean"],
      brewMethod: ["Pour Over", "Drip", "Cold Brew"]
    }
  },
  {
    id: 12,
    brand: "Folgers",
    productTitle: "Classic Roast",
    description: "A classic medium-roast coffee with a rich, pure flavor.",
    attributes: {
      category: "Ground",
      origin: "Multi-Region",
      roastLevel: "Medium",
      flavorNotes: ["Balanced"],
      intensity: 5,
      caffeineContent: "Regular",
      organic: false,
      fairTrade: false,
      weight: "30.5 oz",
      grindOptions: ["Medium"],
      brewMethod: ["Drip"]
    }
  },
  {
    id: 13,
    brand: "Cafe Bustelo",
    productTitle: "Espresso Ground Coffee",
    description: "A rich and full-bodied espresso-style coffee with a robust, Hispanic-style flavor.",
    attributes: {
      category: "Ground",
      origin: "Multi-Region",
      roastLevel: "Dark",
      flavorNotes: ["Bold", "Rich"],
      intensity: 9,
      caffeineContent: "Regular",
      organic: false,
      fairTrade: false,
      weight: "10 oz",
      grindOptions: ["Fine"],
      brewMethod: ["Espresso", "Moka Pot", "Drip"]
    }
  },
  {
    id: 14,
    brand: "Gevalia",
    productTitle: "Colombian Medium Roast",
    description: "A smooth, mild-bodied coffee with a perfectly balanced flavor.",
    attributes: {
      category: "Ground",
      origin: "Colombia",
      roastLevel: "Medium",
      flavorNotes: ["Smooth", "Balanced"],
      intensity: 6,
      caffeineContent: "Regular",
      organic: false,
      fairTrade: false,
      weight: "12 oz",
      grindOptions: ["Medium"],
      brewMethod: ["Drip", "Pour Over"]
    }
  },
  {
    id: 15,
    brand: "Eight O'Clock",
    productTitle: "The Original",
    description: "A sweet, fruity, and well-balanced coffee that's been a favorite since 1859.",
    attributes: {
      category: "Whole Bean",
      origin: "Multi-Region",
      roastLevel: "Medium",
      flavorNotes: ["Fruity", "Sweet"],
      intensity: 5,
      caffeineContent: "Regular",
      organic: false,
      fairTrade: false,
      weight: "12 oz",
      grindOptions: ["Whole Bean"],
      brewMethod: ["Drip", "French Press", "Pour Over"]
    }
  },
  {
    id: 16,
    brand: "Lavazza",
    productTitle: "Super Crema Espresso",
    description: "A velvety crema and persistent aroma with notes of hazelnuts and brown sugar.",
    attributes: {
      category: "Whole Bean",
      origin: "Multi-Region",
      roastLevel: "Medium",
      flavorNotes: ["Hazelnut", "Brown Sugar"],
      intensity: 7,
      caffeineContent: "Regular",
      organic: false,
      fairTrade: false,
      weight: "2.2 lb",
      grindOptions: ["Whole Bean"],
      brewMethod: ["Espresso", "Moka Pot"]
    }
  },
  {
    id: 17,
    brand: "Stumptown Coffee Roasters",
    productTitle: "Hair Bender",
    description: "A complex blend with notes of citrus and dark chocolate.",
    attributes: {
      category: "Whole Bean",
      origin: "Multi-Region",
      roastLevel: "Medium",
      flavorNotes: ["Citrus", "Dark Chocolate"],
      intensity: 7,
      caffeineContent: "Regular",
      organic: false,
      fairTrade: true,
      weight: "12 oz",
      grindOptions: ["Whole Bean"],
      brewMethod: ["Espresso", "Pour Over", "French Press"]
    }
  },
  {
    id: 18,
    brand: "Bulletproof",
    productTitle: "The Original Ground Coffee",
    description: "Clean, toxin-free coffee with a smooth, bold flavor.",
    attributes: {
      category: "Ground",
      origin: "Guatemala",
      roastLevel: "Medium",
      flavorNotes: ["Cinnamon", "Plum"],
      intensity: 6,
      caffeineContent: "Regular",
      organic: true,
      fairTrade: true,
      weight: "12 oz",
      grindOptions: ["Medium"],
      brewMethod: ["Drip", "Pour Over", "French Press"]
    }
  },
  {
    id: 19,
    brand: "Kicking Horse Coffee",
    productTitle: "454 Horse Power",
    description: "A sweet, smoky, and audacious dark roast.",
    attributes: {
      category: "Whole Bean",
      origin: "Indonesia, South America",
      roastLevel: "Dark",
      flavorNotes: ["Chocolate Malt", "Molasses"],
      intensity: 9,
      caffeineContent: "Regular",
      organic: true,
      fairTrade: true,
      weight: "10 oz",
      grindOptions: ["Whole Bean"],
      brewMethod: ["French Press", "Drip", "Pour Over", "Cold Brew"]
    }
  },
  {
    id: 20,
    brand: "Mayorga Organics",
    productTitle: "Cafe Cubano Dark Roast",
    description: "Bold, strong, and intensely flavorful coffee with hints of vanilla and sweet, syrupy smokiness.",
    attributes: {
      category: "Whole Bean",
      origin: "Latin America",
      roastLevel: "Dark",
      flavorNotes: ["Vanilla", "Smoky"],
      intensity: 8,
      caffeineContent: "Regular",
      organic: true,
      fairTrade: true,
      weight: "2 lb",
      grindOptions: ["Whole Bean"],
      brewMethod: ["Espresso", "Drip", "French Press", "Cold Brew"]
    }
  }
];

