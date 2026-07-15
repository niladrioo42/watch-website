/**
 * NEXUS WATCH STUDIO — PRODUCT DATA MODULE
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
 *   category: 'luxury'|'sport'|'smart'|'minimalist'|'diver'|'chronograph',
 *   tags: string[],
 *   price: number,            // current price, USD
 *   originalPrice: number,    // pre-discount price, USD
 *   rating: number,           // 0-5
 *   reviewCount: number,
 *   stock: number,
 *   sku: string,
 *   isNew: boolean,
 *   isBestSeller: boolean,
 *   dial: { face: string, hands: string, marker: string, accent: string }, // hex colors for SVG render
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
    id: "mer-aurelia-01",
    brand: "Meridian",
    model: "Aurelia Automatic",
    category: "luxury",
    tags: ["automatic", "dress", "gold"],
    price: 1249,
    originalPrice: 1480,
    rating: 4.8,
    reviewCount: 214,
    stock: 6,
    sku: "MER-AUR-001",
    isNew: false,
    isBestSeller: true,
    dial: { face: "#101317", hands: "#e7c27d", marker: "#e7c27d", accent: "#c9a15c" },
    specs: {
      movement: "Swiss Automatic Cal. M-24",
      caseSize: "40mm",
      caseMaterial: "316L Stainless Steel, PVD Gold",
      glassType: "Domed Sapphire Crystal",
      waterResistance: "50m / 5 ATM",
      warranty: "5-Year International Warranty",
      strapMaterial: "Italian Calfskin Leather",
      weight: "68g"
    },
    features: [
      "Exhibition case-back",
      "38-hour power reserve",
      "Anti-reflective coating",
      "Screw-down crown"
    ],
    shortDescription: "A dress watch built for boardrooms and black tie, in equal measure.",
    description: "The Aurelia Automatic pairs a hand-finished Swiss movement with a PVD gold case that catches light without shouting for attention. Every Aurelia is regulated for six positions before it leaves the workshop, and the exhibition case-back means the movement is part of the design, not hidden behind it."
  },
  {
    id: "van-ridgeline-02",
    brand: "Vantage",
    model: "Ridgeline GMT",
    category: "sport",
    tags: ["gmt", "travel", "steel"],
    price: 890,
    originalPrice: 890,
    rating: 4.6,
    reviewCount: 132,
    stock: 14,
    sku: "VAN-RID-002",
    isNew: true,
    isBestSeller: false,
    dial: { face: "#0c1420", hands: "#f5f3ee", marker: "#f5f3ee", accent: "#3d6b8c" },
    specs: {
      movement: "Automatic GMT Cal. V-12",
      caseSize: "41mm",
      caseMaterial: "Brushed Stainless Steel",
      glassType: "Flat Sapphire Crystal",
      waterResistance: "100m / 10 ATM",
      warranty: "3-Year International Warranty",
      strapMaterial: "Steel Bracelet, Quick-Release",
      weight: "132g"
    },
    features: [
      "Independent 24h GMT hand",
      "Bidirectional coin-edge bezel",
      "Lume-filled indices",
      "Quick-release strap system"
    ],
    shortDescription: "Track two time zones without touching a settings menu.",
    description: "Built for people who live out of a carry-on, the Ridgeline GMT tracks a second time zone with a fully independent hand you can jump without stopping the main movement. The bezel is coin-edged for grip with gloves on, and the bracelet swaps out in seconds for a rubber strap when the trip calls for it."
  },
  {
    id: "aur-pulse-03",
    brand: "Aurum",
    model: "Pulse Connect",
    category: "smart",
    tags: ["smartwatch", "health", "amoled"],
    price: 329,
    originalPrice: 399,
    rating: 4.4,
    reviewCount: 561,
    stock: 42,
    sku: "AUR-PUL-003",
    isNew: true,
    isBestSeller: true,
    dial: { face: "#0a0a0d", hands: "#7ee3c3", marker: "#7ee3c3", accent: "#7ee3c3" },
    specs: {
      movement: "Digital, Always-On AMOLED",
      caseSize: "44mm",
      caseMaterial: "Aerospace-Grade Aluminum",
      glassType: "Flat Sapphire Crystal",
      waterResistance: "50m / 5 ATM",
      warranty: "2-Year Warranty",
      strapMaterial: "Silicone, Interchangeable",
      weight: "38g"
    },
    features: [
      "7-day battery life",
      "Continuous heart-rate + SpO2",
      "Offline GPS route tracking",
      "Voice assistant on-wrist"
    ],
    shortDescription: "A week of battery, real GPS, and a screen you can read at noon.",
    description: "The Pulse Connect is built around one idea: a smartwatch shouldn't need daily charging to be useful. It holds a full week on a charge with the display always on, tracks routes without a paired phone, and reads heart-rate and SpO2 continuously in the background."
  },
  {
    id: "sol-fieldline-04",
    brand: "Solace",
    model: "Fieldline 38",
    category: "minimalist",
    tags: ["minimalist", "everyday", "quartz"],
    price: 210,
    originalPrice: 245,
    rating: 4.7,
    reviewCount: 389,
    stock: 27,
    sku: "SOL-FLD-004",
    isNew: false,
    isBestSeller: true,
    dial: { face: "#f5f3ee", hands: "#1a1f26", marker: "#1a1f26", accent: "#c9a15c" },
    specs: {
      movement: "Swiss Quartz Ronda 762",
      caseSize: "38mm",
      caseMaterial: "Brushed Stainless Steel",
      glassType: "Mineral Crystal",
      waterResistance: "30m / 3 ATM",
      warranty: "2-Year International Warranty",
      strapMaterial: "Vegetable-Tanned Leather",
      weight: "42g"
    },
    features: [
      "No-date clean dial",
      "Ultra-thin 6.8mm case",
      "Interchangeable 18mm strap",
      "Sapphire-coated mineral glass"
    ],
    shortDescription: "The watch that disappears under a cuff until you need it.",
    description: "Fieldline strips a watch down to what a glance actually needs: two hands, clean markers, nothing competing for attention. At 6.8mm thick it sits flat under a shirt cuff, and the 18mm lug width means the strap is yours to change whenever the mood does."
  },
  {
    id: "van-abyssal-05",
    brand: "Vantage",
    model: "Abyssal 300",
    category: "diver",
    tags: ["diver", "professional", "steel"],
    price: 745,
    originalPrice: 745,
    rating: 4.9,
    reviewCount: 178,
    stock: 9,
    sku: "VAN-ABY-005",
    isNew: false,
    isBestSeller: false,
    dial: { face: "#031a1c", hands: "#f5f3ee", marker: "#f5f3ee", accent: "#1fa38a" },
    specs: {
      movement: "Automatic Cal. V-9 Diver",
      caseSize: "42mm",
      caseMaterial: "Forged Stainless Steel",
      glassType: "Domed Sapphire, AR-coated",
      waterResistance: "300m / 30 ATM",
      warranty: "5-Year International Warranty",
      strapMaterial: "Rubber, Extension Clasp",
      weight: "148g"
    },
    features: [
      "Helium escape valve",
      "120-click unidirectional bezel",
      "C3 Super-LumiNova markers",
      "ISO 6425 dive-rated"
    ],
    shortDescription: "Certified for the depths, comfortable everywhere else.",
    description: "Abyssal 300 is ISO 6425 certified, which means every claim on the spec sheet — depth rating, bezel action, lume legibility — has actually been tested, not just marketed. The extension clasp adjusts over a wetsuit sleeve in seconds and the case is forged, not stamped, for long-term shock resistance."
  },
  {
    id: "mer-vantpoint-06",
    brand: "Meridian",
    model: "Vantpoint Chrono",
    category: "chronograph",
    tags: ["chronograph", "racing", "steel"],
    price: 615,
    originalPrice: 680,
    rating: 4.5,
    reviewCount: 96,
    stock: 18,
    sku: "MER-VNT-006",
    isNew: true,
    isBestSeller: false,
    dial: { face: "#16181c", hands: "#e0523e", marker: "#f5f3ee", accent: "#e0523e" },
    specs: {
      movement: "Quartz Chronograph Miyota OS20",
      caseSize: "42mm",
      caseMaterial: "Stainless Steel",
      glassType: "Flat Sapphire Crystal",
      waterResistance: "100m / 10 ATM",
      warranty: "3-Year International Warranty",
      strapMaterial: "Perforated Leather",
      weight: "118g"
    },
    features: [
      "1/20-second chronograph",
      "Tachymeter bezel",
      "Screw-down pushers",
      "Panda dial layout"
    ],
    shortDescription: "Motorsport styling with the precision to actually time a lap.",
    description: "The Vantpoint Chrono borrows its layout from the timing dashboards of endurance racing: high-contrast sub-dials, a tachymeter for speed-over-distance, and pushers sealed against the elements. It's a tool watch first, and it happens to look sharp doing the job."
  },
  {
    id: "sol-halcyon-07",
    brand: "Solace",
    model: "Halcyon Two-Hand",
    category: "minimalist",
    tags: ["minimalist", "gift", "quartz"],
    price: 165,
    originalPrice: 165,
    rating: 4.3,
    reviewCount: 152,
    stock: 33,
    sku: "SOL-HAL-007",
    isNew: false,
    isBestSeller: false,
    dial: { face: "#eae6da", hands: "#3a3f36", marker: "#3a3f36", accent: "#8a6d3b" },
    specs: {
      movement: "Japanese Quartz Miyota 2035",
      caseSize: "36mm",
      caseMaterial: "Polished Stainless Steel",
      glassType: "Mineral Crystal",
      waterResistance: "30m / 3 ATM",
      warranty: "1-Year Warranty",
      strapMaterial: "Mesh Steel Bracelet",
      weight: "46g"
    },
    features: [
      "Micro-adjust mesh clasp",
      "Sunburst dial finish",
      "Low-profile 36mm case",
      "Hypoallergenic case back"
    ],
    shortDescription: "A quiet everyday watch, sized to actually fit a smaller wrist.",
    description: "Halcyon was designed at 36mm because not every wrist wants a 42mm case. The sunburst dial shifts tone with the light, the mesh bracelet micro-adjusts without tools, and the whole watch is priced to be a genuine daily-wear, not a special-occasion piece."
  },
  {
    id: "aur-slate-08",
    brand: "Aurum",
    model: "Slate Hybrid",
    category: "smart",
    tags: ["smartwatch", "hybrid", "analog"],
    price: 275,
    originalPrice: 320,
    rating: 4.2,
    reviewCount: 208,
    stock: 21,
    sku: "AUR-SLT-008",
    isNew: false,
    isBestSeller: false,
    dial: { face: "#1c1c1c", hands: "#c8cdd3", marker: "#c8cdd3", accent: "#9aa5b1" },
    specs: {
      movement: "Hybrid Analog + Digital Sensors",
      caseSize: "42mm",
      caseMaterial: "Stainless Steel",
      glassType: "Mineral Crystal",
      waterResistance: "50m / 5 ATM",
      warranty: "2-Year Warranty",
      strapMaterial: "Milanese Loop",
      weight: "58g"
    },
    features: [
      "6-month battery (coin cell)",
      "Real analog hands, no charging cable",
      "Sleep + step tracking",
      "Smart notifications via vibration"
    ],
    shortDescription: "Looks like a normal watch. Quietly tracks your day anyway.",
    description: "Slate Hybrid is for people who want the data without wearing a screen on their wrist. Real analog hands sweep the dial while hidden sensors log steps and sleep, and the whole thing runs half a year on a single coin-cell battery."
  },
  {
    id: "van-basecamp-09",
    brand: "Vantage",
    model: "Basecamp Field",
    category: "sport",
    tags: ["field", "budget", "rugged"],
    price: 128,
    originalPrice: 150,
    rating: 4.4,
    reviewCount: 271,
    stock: 55,
    sku: "VAN-BSC-009",
    isNew: false,
    isBestSeller: true,
    dial: { face: "#2b2b26", hands: "#f5f3ee", marker: "#e7c27d", accent: "#6b7a4f" },
    specs: {
      movement: "Japanese Quartz Miyota 2115",
      caseSize: "40mm",
      caseMaterial: "Matte Stainless Steel",
      glassType: "Mineral Crystal, Scratch-Resistant",
      waterResistance: "100m / 10 ATM",
      warranty: "2-Year Warranty",
      strapMaterial: "Nylon NATO",
      weight: "51g"
    },
    features: [
      "Full lume dial",
      "Recessed crown guard",
      "Field-style numeral dial",
      "Swappable NATO strap"
    ],
    shortDescription: "An honest, budget field watch that doesn't feel budget on the wrist.",
    description: "Basecamp Field exists to prove a sub-$150 watch can still feel deliberate: a fully lumed dial for low light, a recessed crown so it won't catch on a pack strap, and a matte case that won't flash in direct sun. The NATO strap swaps in seconds for whatever the day calls for."
  },
  {
    id: "mer-solstice-10",
    brand: "Meridian",
    model: "Solstice Moonphase",
    category: "luxury",
    tags: ["moonphase", "complication", "gold"],
    price: 1890,
    originalPrice: 2150,
    rating: 4.9,
    reviewCount: 64,
    stock: 4,
    sku: "MER-SOL-010",
    isNew: true,
    isBestSeller: false,
    dial: { face: "#0d1b2e", hands: "#e7c27d", marker: "#e7c27d", accent: "#c9a15c" },
    specs: {
      movement: "Swiss Automatic Cal. M-31 Moonphase",
      caseSize: "40mm",
      caseMaterial: "18k Gold-Plated Steel",
      glassType: "Box-Domed Sapphire Crystal",
      waterResistance: "30m / 3 ATM",
      warranty: "5-Year International Warranty",
      strapMaterial: "Alligator-Embossed Leather",
      weight: "72g"
    },
    features: [
      "Accurate moonphase complication",
      "Guilloché dial pattern",
      "Exhibition case-back",
      "Hand-assembled in-house"
    ],
    shortDescription: "A moonphase complication accurate to within one day per 122 years.",
    description: "Solstice carries a genuine moonphase complication over a hand-guilloché dial, finished in a deep midnight blue that shifts under light. It's the kind of watch that rewards a second look, and the kind of complication that's still accurate to within a day after over a century."
  },
  {
    id: "sol-current-11",
    brand: "Solace",
    model: "Current Titanium",
    category: "sport",
    tags: ["titanium", "lightweight", "everyday"],
    price: 540,
    originalPrice: 540,
    rating: 4.6,
    reviewCount: 87,
    stock: 16,
    sku: "SOL-CUR-011",
    isNew: true,
    isBestSeller: false,
    dial: { face: "#e9e9e6", hands: "#2b2f33", marker: "#2b2f33", accent: "#5c88a6" },
    specs: {
      movement: "Automatic Cal. S-7",
      caseSize: "40mm",
      caseMaterial: "Grade 2 Titanium",
      glassType: "Flat Sapphire Crystal",
      waterResistance: "100m / 10 ATM",
      warranty: "3-Year International Warranty",
      strapMaterial: "Titanium Bracelet",
      weight: "79g"
    },
    features: [
      "Full titanium build, 42% lighter than steel",
      "Hypoallergenic case",
      "Brushed + sandblasted finish",
      "Anti-magnetic to 4,800 A/m"
    ],
    shortDescription: "All the durability of steel, at almost half the weight on the wrist.",
    description: "Current Titanium swaps steel for grade 2 titanium end to end, so the case and bracelet come in at roughly 42% lighter without giving up scratch resistance. It's built for people who wear a watch every single day and can feel the difference by hour six."
  },
  {
    id: "aur-nightframe-12",
    brand: "Aurum",
    model: "Nightframe Pro",
    category: "smart",
    tags: ["smartwatch", "amoled", "fitness"],
    price: 399,
    originalPrice: 459,
    rating: 4.5,
    reviewCount: 342,
    stock: 24,
    sku: "AUR-NGT-012",
    isNew: false,
    isBestSeller: true,
    dial: { face: "#000000", hands: "#e0523e", marker: "#e0523e", accent: "#e0523e" },
    specs: {
      movement: "Digital, Always-On AMOLED",
      caseSize: "46mm",
      caseMaterial: "Titanium Bezel",
      glassType: "Sapphire Crystal",
      waterResistance: "100m / 10 ATM",
      warranty: "2-Year Warranty",
      strapMaterial: "Fluoroelastomer",
      weight: "44g"
    },
    features: [
      "Dual-frequency GPS",
      "Training load + recovery scoring",
      "10-day battery (low power mode)",
      "Titanium bezel, sapphire crystal"
    ],
    shortDescription: "Built for people who train, not just people who track steps.",
    description: "Nightframe Pro is aimed squarely at serious training: dual-frequency GPS for accurate pace even in cities, a recovery score that actually adjusts to your last few workouts, and a titanium bezel that can take a rack drop without a mark."
  }
];

// Convenience export for environments using ES modules later (Firebase/Supabase migration path)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { NEXUS_WATCHES };
}
