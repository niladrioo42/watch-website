/**
 * AUREX WATCH STUDIO — PRODUCT DATA MODULE
 * ------------------------------------------------------------
 * This file is the single source of truth for catalog data.
 * It is intentionally decoupled from rendering logic (script.js)
 * so it can later be swapped for a Firebase / Supabase fetch
 * without touching any UI code — every consumer just expects
 * an array of objects shaped like WATCH_SCHEMA below.
 *
 * WATCH_SCHEMA (reference only, not enforced at runtime):
 * {
 *   id: string,
 *   brand: string,
 *   model: string,
 *   category: 'luxury'|'sport'|'diver'|'chronograph'|'minimalist',
 *   tags: string[],
 *   price: number,            // current price, USD
 *   originalPrice: number,    // pre-discount price, USD
 *   rating: number,           // 0-5
 *   reviewCount: number,
 *   stock: number,
 *   sku: string,
 *   isNew: boolean,
 *   isBestSeller: boolean,
 *   image: string,            // path to product photo (assets/images/*.jpg)
 *   dial: { face: string, hands: string, marker: string, accent: string }, // hex fallback colors for SVG render if no photo
 *   specs: {
 *     movement, caseSize, caseMaterial, glassType,
 *     waterResistance, warranty, strapMaterial, weight
 *   },
 *   features: string[],
 *   shortDescription: string,
 *   description: string
 * }
 */

const NEXUS_WATCHES = [
  {
    id: "aur-royalbengal-01",
    brand: "Aurex",
    model: "Royal Bengal",
    category: "luxury",
    tags: ["automatic", "dress", "gold", "two-tone"],
    price: 2450,
    originalPrice: 2450,
    rating: 4.9,
    reviewCount: 88,
    stock: 5,
    sku: "AUR-RB-001",
    isNew: false,
    isBestSeller: true,
    image: "assets/images/royal-bengal.jpg",
    dial: { face: "#101317", hands: "#e7c27d", marker: "#e7c27d", accent: "#c9a15c" },
    specs: {
      movement: "Swiss Automatic",
      caseSize: "41mm",
      caseMaterial: "Two-Tone Stainless Steel & Gold PVD",
      glassType: "Domed Sapphire Crystal",
      waterResistance: "50m / 5 ATM",
      warranty: "5-Year International Warranty",
      strapMaterial: "Two-Tone Bracelet",
      weight: "145g"
    },
    features: [
      "Exhibition case-back",
      "Two-tone bezel and bracelet",
      "Anti-reflective coating",
      "Screw-down crown"
    ],
    shortDescription: "Majesty in every second — the house's signature two-tone dress watch.",
    description: "Royal Bengal opens the Aurex line with a two-tone case that catches light without shouting for attention. The gold PVD bezel frames a deep black dial, finished with a Swiss automatic movement regulated before it ever leaves the workshop."
  },
  {
    id: "aur-oceanus-02",
    brand: "Aurex",
    model: "Oceanus",
    category: "diver",
    tags: ["diver", "gmt", "steel", "blue"],
    price: 1680,
    originalPrice: 1680,
    rating: 4.8,
    reviewCount: 152,
    stock: 11,
    sku: "AUR-OC-002",
    isNew: true,
    isBestSeller: false,
    image: "assets/images/oceanus.jpg",
    dial: { face: "#031a2c", hands: "#f5f3ee", marker: "#f5f3ee", accent: "#3d6b8c" },
    specs: {
      movement: "Automatic GMT",
      caseSize: "42mm",
      caseMaterial: "Brushed Stainless Steel",
      glassType: "Sapphire Crystal, AR-Coated",
      waterResistance: "300m / 30 ATM",
      warranty: "3-Year International Warranty",
      strapMaterial: "Steel Bracelet",
      weight: "156g"
    },
    features: [
      "Unidirectional dive bezel",
      "Helium escape valve",
      "Lume-filled markers and hands",
      "Screw-down crown"
    ],
    shortDescription: "Built for depth, crafted for legends.",
    description: "Oceanus is rated to 300m and built like it means it — a unidirectional bezel for dive timing, a helium escape valve for saturation diving, and a blue sunburst dial that stays legible from the surface to the deep end of its range."
  },
  {
    id: "aur-chronoprestige-03",
    brand: "Aurex",
    model: "Chrono Prestige",
    category: "chronograph",
    tags: ["chronograph", "racing", "rose-gold"],
    price: 1980,
    originalPrice: 2200,
    rating: 4.7,
    reviewCount: 74,
    stock: 8,
    sku: "AUR-CP-003",
    isNew: false,
    isBestSeller: false,
    image: "assets/images/chrono-prestige.jpg",
    dial: { face: "#16181c", hands: "#e7c27d", marker: "#f5f3ee", accent: "#c9805c" },
    specs: {
      movement: "Automatic Chronograph",
      caseSize: "42mm",
      caseMaterial: "Rose Gold-Plated Steel",
      glassType: "Sapphire Crystal",
      waterResistance: "100m / 10 ATM",
      warranty: "3-Year International Warranty",
      strapMaterial: "Leather",
      weight: "138g"
    },
    features: [
      "Tri-compax chronograph layout",
      "Tachymeter bezel",
      "Exhibition case-back",
      "Column-wheel chronograph mechanism"
    ],
    shortDescription: "Precision in motion, power in control.",
    description: "Chrono Prestige pairs a column-wheel chronograph with a warm rose gold case — the kind of watch built for people who actually use the pushers, not just admire them. Tri-compax sub-dials keep everything legible at speed."
  },
  {
    id: "aur-skeletonlegacy-04",
    brand: "Aurex",
    model: "Skeleton Legacy",
    category: "luxury",
    tags: ["skeleton", "openwork", "automatic"],
    price: 2890,
    originalPrice: 2890,
    rating: 4.9,
    reviewCount: 41,
    stock: 3,
    sku: "AUR-SL-004",
    isNew: true,
    isBestSeller: false,
    image: "assets/images/skeleton-legacy.jpg",
    dial: { face: "#1a1a1a", hands: "#e7c27d", marker: "#e7c27d", accent: "#9a9a9a" },
    specs: {
      movement: "Automatic Skeleton Cal. A-9",
      caseSize: "43mm",
      caseMaterial: "Gunmetal PVD Steel",
      glassType: "Sapphire Crystal",
      waterResistance: "50m / 5 ATM",
      warranty: "5-Year International Warranty",
      strapMaterial: "Steel Bracelet",
      weight: "168g"
    },
    features: [
      "Full openwork movement",
      "Hand-finished bridges",
      "Exhibition front and back",
      "Skeletonized rotor"
    ],
    shortDescription: "The art of transparency, the soul of time.",
    description: "Every bridge and gear of the Cal. A-9 movement is visible front and back on Skeleton Legacy. It takes longer to finish a skeletonized movement than a solid one — every edge you can see is also an edge that's been hand-polished."
  },
  {
    id: "aur-worldtraveler-05",
    brand: "Aurex",
    model: "World Traveler",
    category: "sport",
    tags: ["gmt", "travel", "titanium", "green"],
    price: 1420,
    originalPrice: 1420,
    rating: 4.6,
    reviewCount: 96,
    stock: 14,
    sku: "AUR-WT-005",
    isNew: false,
    isBestSeller: true,
    image: "assets/images/world-traveler.jpg",
    dial: { face: "#0f2417", hands: "#f5f3ee", marker: "#e7c27d", accent: "#3f9e83" },
    specs: {
      movement: "Automatic GMT",
      caseSize: "41mm",
      caseMaterial: "Brushed Titanium",
      glassType: "Sapphire Crystal",
      waterResistance: "100m / 10 ATM",
      warranty: "3-Year International Warranty",
      strapMaterial: "Titanium Bracelet",
      weight: "92g"
    },
    features: [
      "Independent 24h GMT hand",
      "World-time bezel",
      "Green sunburst dial",
      "Lightweight titanium case"
    ],
    shortDescription: "One world. Countless journeys.",
    description: "World Traveler tracks a second time zone on a case that barely registers on the wrist — titanium comes in at nearly half the weight of steel. The green sunburst dial shifts tone through the day, same as the places it's built to follow you."
  },
  {
    id: "aur-lunaris-06",
    brand: "Aurex",
    model: "Lunaris",
    category: "luxury",
    tags: ["moonphase", "complication", "rose-gold"],
    price: 2650,
    originalPrice: 2650,
    rating: 4.9,
    reviewCount: 53,
    stock: 4,
    sku: "AUR-LN-006",
    isNew: true,
    isBestSeller: false,
    image: "assets/images/lunaris.jpg",
    dial: { face: "#0d1b2e", hands: "#e7c27d", marker: "#e7c27d", accent: "#c9a15c" },
    specs: {
      movement: "Automatic Moonphase",
      caseSize: "40mm",
      caseMaterial: "Rose Gold-Plated Steel",
      glassType: "Box-Domed Sapphire Crystal",
      waterResistance: "30m / 3 ATM",
      warranty: "5-Year International Warranty",
      strapMaterial: "Alligator-Embossed Leather",
      weight: "74g"
    },
    features: [
      "Accurate moonphase complication",
      "Midnight starfield dial",
      "Exhibition case-back",
      "Hand-assembled in-house"
    ],
    shortDescription: "Elegance written in timeless light.",
    description: "Lunaris carries a genuine moonphase complication over a deep midnight dial that shifts under light like the sky it's named for. It's the kind of watch that rewards a second look, and a complication that stays accurate for years between adjustments."
  },
  {
    id: "aur-zephyr-07",
    brand: "Aurex",
    model: "Zephyr",
    category: "sport",
    tags: ["skeleton", "rubber", "lightweight"],
    price: 1150,
    originalPrice: 1150,
    rating: 4.5,
    reviewCount: 63,
    stock: 19,
    sku: "AUR-ZP-007",
    isNew: true,
    isBestSeller: false,
    image: "assets/images/zephyr.jpg",
    dial: { face: "#1c1c1c", hands: "#f5f3ee", marker: "#c8cdd3", accent: "#8fb0cc" },
    specs: {
      movement: "Japanese Automatic",
      caseSize: "44mm",
      caseMaterial: "Brushed Stainless Steel",
      glassType: "Sapphire Crystal",
      waterResistance: "50m / 5 ATM",
      warranty: "2-Year Warranty",
      strapMaterial: "Rubber",
      weight: "118g"
    },
    features: [
      "Open dial construction",
      "Screw-down crown guard",
      "Limited to 99 pieces",
      "Numbered certificate included"
    ],
    shortDescription: "Airy. Light. Limitless. Inspired by the wind.",
    description: "Zephyr strips the dial back to its moving parts — an open construction that lets you watch the movement breathe. Limited to 99 numbered pieces, each comes with its own certificate of authenticity."
  },
  {
    id: "aur-nova-08",
    brand: "Aurex",
    model: "Nova",
    category: "minimalist",
    tags: ["minimalist", "moonphase", "mesh"],
    price: 480,
    originalPrice: 540,
    rating: 4.4,
    reviewCount: 189,
    stock: 32,
    sku: "AUR-NV-008",
    isNew: false,
    isBestSeller: true,
    image: "assets/images/nova.jpg",
    dial: { face: "#1a1a1a", hands: "#c9a15c", marker: "#c9a15c", accent: "#3d6b8c" },
    specs: {
      movement: "Swiss Quartz",
      caseSize: "39mm",
      caseMaterial: "Matte Black Stainless Steel",
      glassType: "Sapphire Crystal",
      waterResistance: "30m / 3 ATM",
      warranty: "2-Year Warranty",
      strapMaterial: "Mesh Bracelet",
      weight: "68g"
    },
    features: [
      "Sub-dial moonphase",
      "Ultra-slim case",
      "Milanese mesh strap",
      "No-date clean layout"
    ],
    shortDescription: "Less is more. Pure design, pure impact.",
    description: "Nova keeps the dial quiet and lets one small detail do the talking — a moonphase sub-dial tucked at six o'clock. The mesh strap micro-adjusts without tools, and the whole watch disappears under a cuff at just 39mm."
  },
  {
    id: "aur-valor-09",
    brand: "Aurex",
    model: "Valor",
    category: "chronograph",
    tags: ["chronograph", "rugged", "bronze"],
    price: 1890,
    originalPrice: 1890,
    rating: 4.7,
    reviewCount: 58,
    stock: 7,
    sku: "AUR-VL-009",
    isNew: true,
    isBestSeller: false,
    image: "assets/images/valor.jpg",
    dial: { face: "#1a1512", hands: "#e0523e", marker: "#c9a15c", accent: "#c9805c" },
    specs: {
      movement: "Automatic Chronograph",
      caseSize: "45mm",
      caseMaterial: "Bronze-Finished Steel",
      glassType: "Sapphire Crystal",
      waterResistance: "100m / 10 ATM",
      warranty: "2-Year Warranty",
      strapMaterial: "Leather",
      weight: "162g"
    },
    features: [
      "Skeleton chronograph dial",
      "Screw-down pushers",
      "Oversized crown",
      "Limited to 75 pieces"
    ],
    shortDescription: "Bold. Rugged. Unstoppable.",
    description: "Valor is built heavier and bolder than the rest of the line on purpose — a bronze-finished case, an oversized crown you can operate with gloves on, and a skeleton chronograph dial that's as much armor as it is instrument."
  },
  {
    id: "aur-lumenis-10",
    brand: "Aurex",
    model: "Lumenis",
    category: "minimalist",
    tags: ["minimalist", "dress", "leather", "blue"],
    price: 620,
    originalPrice: 620,
    rating: 4.6,
    reviewCount: 121,
    stock: 22,
    sku: "AUR-LM-010",
    isNew: false,
    isBestSeller: false,
    image: "assets/images/lumenis.jpg",
    dial: { face: "#16324f", hands: "#f5f3ee", marker: "#f5f3ee", accent: "#8fb0cc" },
    specs: {
      movement: "Japanese Quartz",
      caseSize: "40mm",
      caseMaterial: "Polished Stainless Steel",
      glassType: "Sapphire Crystal",
      waterResistance: "50m / 5 ATM",
      warranty: "2-Year Warranty",
      strapMaterial: "Leather",
      weight: "58g"
    },
    features: [
      "Sub-dial running seconds",
      "Sunburst blue dial",
      "Slim 9mm case",
      "Limited to 100 pieces"
    ],
    shortDescription: "Simple. Pure. Powerful. Designed to inspire.",
    description: "Lumenis is the easiest Aurex to wear every day — a slim 9mm case, a sunburst blue dial that shifts with the light, and a running-seconds sub-dial for the one detail worth keeping. Nothing extra, nothing missing."
  },
  {
    id: "aur-orbitalis-11",
    brand: "Aurex",
    model: "Orbitalis",
    category: "luxury",
    tags: ["avant-garde", "skeleton", "mesh"],
    price: 3200,
    originalPrice: 3200,
    rating: 4.8,
    reviewCount: 29,
    stock: 2,
    sku: "AUR-OR-011",
    isNew: true,
    isBestSeller: false,
    image: "assets/images/orbitalis.jpg",
    dial: { face: "#111014", hands: "#c8cdd3", marker: "#9b7fd4", accent: "#9b7fd4" },
    specs: {
      movement: "Automatic Skeleton",
      caseSize: "43mm",
      caseMaterial: "Gunmetal PVD Steel",
      glassType: "Sapphire Crystal",
      waterResistance: "100m / 10 ATM",
      warranty: "3-Year International Warranty",
      strapMaterial: "Mesh Bracelet",
      weight: "154g"
    },
    features: [
      "Multi-axis openwork dial",
      "Purple accent indices",
      "Cushion-shaped case",
      "Limited to 99 pieces"
    ],
    shortDescription: "Nothing follows. Everything revolves.",
    description: "Orbitalis breaks from the round case entirely — a cushion-shaped silhouette wrapped around a multi-axis openwork movement that looks like it's still deciding what shape time should take. Not for every wrist, and it knows it."
  },
  {
    id: "aur-volterra-12",
    brand: "Aurex",
    model: "Volterra",
    category: "sport",
    tags: ["chronograph", "racing", "carbon"],
    price: 1750,
    originalPrice: 1750,
    rating: 4.7,
    reviewCount: 84,
    stock: 10,
    sku: "AUR-VT-012",
    isNew: false,
    isBestSeller: true,
    image: "assets/images/volterra.jpg",
    dial: { face: "#161616", hands: "#e0523e", marker: "#f5f3ee", accent: "#e0523e" },
    specs: {
      movement: "Swiss Quartz Chronograph",
      caseSize: "44mm",
      caseMaterial: "Carbon Fiber Bezel",
      glassType: "Sapphire Crystal",
      waterResistance: "100m / 10 ATM",
      warranty: "2-Year Warranty",
      strapMaterial: "Leather",
      weight: "132g"
    },
    features: [
      "Multi-chronograph sub-dials",
      "Red accent tachymeter",
      "Carbon fiber bezel",
      "Limited to 75 pieces"
    ],
    shortDescription: "Built for speed, engineered for control.",
    description: "Volterra borrows its color language from the pit lane — red accents against black, a tachymeter for speed-over-distance, and a carbon fiber bezel that keeps the case light without losing the racing-instrument feel."
  }
];

// Convenience export for environments using ES modules later (Firebase/Supabase migration path)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { NEXUS_WATCHES };
}
