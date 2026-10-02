/* Starting rental estimates in USD for a 24-hour rental.
   Null prices require a personalized quote; they are not free rentals.
   Original product photos are retained. New listings use the supplied Drive photos.
   Market availability and event-date inventory require confirmation. */
const GNS_CATALOG = [
  {
    "id": "gold-chiavari-chair",
    "name": "Gold Chiavari Chair",
    "category": "Seating",
    "price": 9,
    "image": "gold-chiavari-chair.webp",
    "tag": "A celebration classic",
    "description": "A graceful gold silhouette for ceremony seating and beautifully dressed reception tables.",
    "details": [
      "Gold finish",
      "Cushion options confirmed with your quote",
      "Dimensions and quantities confirmed before booking"
    ],
    "markets": {
      "dc": "request",
      "dfw": "request"
    }
  },
  {
    "id": "white-folding-chair",
    "name": "White Folding Chair",
    "category": "Seating",
    "price": 3.5,
    "image": "white-folding-chair.webp",
    "tag": "Effortlessly versatile",
    "description": "Clean white seating that works beautifully for intimate gatherings, outdoor celebrations and larger guest lists.",
    "details": [
      "White folding design",
      "Suitable placement confirmed with your quote",
      "Dimensions and quantities confirmed before booking"
    ],
    "markets": {
      "dc": "request",
      "dfw": "request"
    }
  },
  {
    "id": "round-table",
    "name": "Round Banquet Table",
    "category": "Tables",
    "price": 16,
    "image": "round-table.webp",
    "tag": "Gather together",
    "description": "A classic round table for shared conversation, family-style dining and elegant centerpieces.",
    "details": [
      "Round tabletop",
      "Linens rented separately",
      "Size and seating capacity confirmed with your quote"
    ],
    "markets": {
      "dc": "request",
      "dfw": "request"
    }
  },
  {
    "id": "banquet-table",
    "name": "Rectangular Banquet Table",
    "category": "Tables",
    "price": 14,
    "image": "banquet-table.webp",
    "tag": "Room for every detail",
    "description": "A versatile foundation for dining, buffets, gifts or a thoughtfully arranged welcome table.",
    "details": [
      "Rectangular tabletop",
      "Linens rented separately",
      "Size and seating capacity confirmed with your quote"
    ],
    "markets": {
      "dc": "request",
      "dfw": "request"
    }
  },
  {
    "id": "cocktail-table",
    "name": "Cocktail Table",
    "category": "Tables",
    "price": 22,
    "image": "cocktail-table.webp",
    "tag": "For the mingling moments",
    "description": "Create inviting gathering spots for a welcome reception, cocktail hour or networking event.",
    "details": [
      "High-top table style",
      "Cover rented separately",
      "Exact height and diameter confirmed with your quote"
    ],
    "markets": {
      "dc": "request",
      "dfw": "request"
    }
  },
  {
    "id": "white-linen",
    "name": "White Table Linen",
    "category": "Linens & Tabletop",
    "price": 18,
    "image": "white-linen.webp",
    "tag": "The finishing layer",
    "description": "A soft white foundation that brings a polished, cohesive feel to your tablescape.",
    "details": [
      "White linen rental",
      "Table and decor not included",
      "Linen size and table fit confirmed with your quote"
    ],
    "markets": {
      "dc": "request",
      "dfw": "request"
    }
  },
  {
    "id": "water-goblet",
    "name": "Clear Water Goblet",
    "category": "Linens & Tabletop",
    "price": 1.25,
    "image": "water-goblet.webp",
    "tag": "A little everyday elegance",
    "description": "Clear stemmed glassware to complement a beautifully set table, from a wedding dinner to a corporate celebration.",
    "details": [
      "Clear stemmed glass",
      "Price per glass",
      "Order quantities and handling confirmed with your quote"
    ],
    "markets": {
      "dc": "request",
      "dfw": "request"
    }
  },
  {
    "id": "gold-arch",
    "name": "Gold Arch Backdrop",
    "category": "Ceremony & Decor",
    "price": 95,
    "image": "gold-arch.webp",
    "tag": "Frame your moment",
    "description": "A sculptural gold backdrop for a ceremony, a Nikkah or an occasion worth remembering.",
    "details": [
      "Gold arch frame rental",
      "Florals and decor shown are inspiration; priced separately",
      "Configuration, dimensions and setup confirmed with your quote"
    ],
    "markets": {
      "dc": "request",
      "dfw": "request"
    }
  },
  {
    "id": "white-canopy",
    "name": "White Event Canopy",
    "category": "Outdoor & Essentials",
    "price": 175,
    "image": "white-canopy.webp",
    "tag": "Celebrate in the open air",
    "description": "An inviting outdoor shelter for garden gatherings, family celebrations and open-air occasions.",
    "details": [
      "White canopy rental",
      "Size, site suitability and installation quoted separately",
      "Weather and venue requirements reviewed before booking"
    ],
    "markets": {
      "dc": "request",
      "dfw": "request"
    }
  },
  {
    "id": "patio-heater",
    "name": "Patio Heater",
    "category": "Outdoor & Essentials",
    "price": 75,
    "image": "patio-heater.webp",
    "tag": "A warm welcome",
    "description": "An outdoor heating option for comfortable evenings and cooler-weather gatherings.",
    "details": [
      "Outdoor use subject to venue approval",
      "Fuel and setup quoted separately",
      "Safety clearances and placement confirmed before booking"
    ],
    "markets": {
      "dc": "request",
      "dfw": "request"
    }
  },
  {
    "id": "cooler",
    "name": "Event Cooler",
    "category": "Outdoor & Essentials",
    "price": 25,
    "image": "cooler.webp",
    "tag": "Keep the refreshments ready",
    "description": "A practical addition to beverage stations, outdoor events and relaxed family gatherings.",
    "details": [
      "Cooler rental",
      "Ice and drinks not included",
      "Capacity confirmed with your quote"
    ],
    "markets": {
      "dc": "request",
      "dfw": "request"
    }
  },
  {
    "id": "waste-bin",
    "name": "Event Waste Bin",
    "category": "Outdoor & Essentials",
    "price": 12,
    "image": "waste-bin.webp",
    "tag": "The thoughtful essentials",
    "description": "Keep your event space welcoming with a convenient waste collection option.",
    "details": [
      "Waste bin rental",
      "Liners and disposal services confirmed with your quote",
      "Capacity confirmed before booking"
    ],
    "markets": {
      "dc": "request",
      "dfw": "request"
    }
  },
  {
    "id": "extension-cord",
    "name": "Extension Cord",
    "category": "Outdoor & Essentials",
    "price": 8,
    "image": "extension-cord.webp",
    "tag": "Behind every seamless setup",
    "description": "A useful event essential for approved equipment and venue electrical plans.",
    "details": [
      "Extension cord rental",
      "Length and electrical rating confirmed with your quote",
      "Use subject to equipment and venue requirements"
    ],
    "markets": {
      "dc": "request",
      "dfw": "request"
    }
  },
  {
    "id": "gold-rim-charger",
    "name": "Gold-Rim Charger Plate",
    "category": "Linens & Tabletop",
    "price": null,
    "image": "gns-charger-tablescape.webp",
    "tag": "An elegant frame",
    "description": "A decorative charger with a gold rim to frame your place setting.",
    "details": [
      "Charger only; dinnerware, flatware, napkins and decor shown are separate",
      "Pricing, quantities and availability require a personalized quote"
    ],
    "markets": {
      "dc": "request",
      "dfw": "request"
    }
  },
  {
    "id": "dinnerware-setting",
    "name": "Dinnerware Place Setting",
    "category": "Linens & Tabletop",
    "price": null,
    "image": "gns-dinnerware-setting.webp",
    "tag": "Layer your table beautifully",
    "description": "Coordinate dinner plates, salad plates and soup bowls for a welcoming table.",
    "details": [
      "Exact pieces and quantities confirmed with your quote; linens, florals and decor are separate",
      "Pricing, quantities and availability require a personalized quote"
    ],
    "markets": {
      "dc": "request",
      "dfw": "request"
    }
  },
  {
    "id": "floral-serving-bowl",
    "name": "Floral Serving Bowl with Handle",
    "category": "Linens & Tabletop",
    "price": null,
    "image": "gns-floral-serving-bowl.webp",
    "tag": "A distinctive serving detail",
    "description": "A white floral-shaped serving bowl with a gold edge and wooden handle.",
    "details": [
      "Serving bowl only; flowers and styling are separate",
      "Pricing, quantities and availability require a personalized quote"
    ],
    "markets": {
      "dc": "request",
      "dfw": "request"
    }
  },
  {
    "id": "black-table-skirt",
    "name": "Black Table Skirt",
    "category": "Linens & Tabletop",
    "price": null,
    "image": "gns-black-table-skirt.webp",
    "tag": "A polished presentation",
    "description": "Dress a buffet, gift or display table with a pleated black skirt.",
    "details": [
      "Skirt only; table and tablecloth inclusion confirmed with your quote",
      "Pricing, quantities and availability require a personalized quote"
    ],
    "markets": {
      "dc": "request",
      "dfw": "request"
    }
  },
  {
    "id": "gold-round-chafer",
    "name": "6L Gold Round Chafer",
    "category": "Chafing Dishes & Catering",
    "price": null,
    "image": "gns-gold-round-chafer.webp",
    "tag": "Serve with a little shimmer",
    "description": "A gold round stainless steel chafing dish for an elegant buffet presentation.",
    "details": [
      "6L stated capacity; fuel, operating instructions and setup confirmed before booking",
      "Pricing, quantities and availability require a personalized quote"
    ],
    "markets": {
      "dc": "request",
      "dfw": "request"
    }
  },
  {
    "id": "gold-9l-chafer",
    "name": "9L Gold-Accent Chafer",
    "category": "Chafing Dishes & Catering",
    "price": null,
    "image": "gns-9l-chafer.webp",
    "tag": "Beautiful buffet details",
    "description": "A rectangular gold-accented chafing dish with an undivided food pan.",
    "details": [
      "9L stated capacity; fuel and setup confirmed with your quote",
      "Pricing, quantities and availability require a personalized quote"
    ],
    "markets": {
      "dc": "request",
      "dfw": "request"
    }
  },
  {
    "id": "rose-gold-chafer",
    "name": "9L Rose-Gold Rim Chafer",
    "category": "Chafing Dishes & Catering",
    "price": null,
    "image": "gns-rose-gold-chafer.webp",
    "tag": "Warm metallic accents",
    "description": "A rectangular chafing dish with rose-gold rim details for your buffet.",
    "details": [
      "9L stated capacity; fuel and setup confirmed with your quote",
      "Pricing, quantities and availability require a personalized quote"
    ],
    "markets": {
      "dc": "request",
      "dfw": "request"
    }
  },
  {
    "id": "red-catering-cooler",
    "name": "Red Catering Cooler",
    "category": "Outdoor & Essentials",
    "price": null,
    "image": "gns-red-catering-cooler.webp",
    "tag": "Keep the refreshments ready",
    "description": "A red insulated catering cooler for transporting food and refreshments. Insert configuration and capacity are confirmed with your quote.",
    "details": [
      "Insulated catering cooler; insert configuration confirmed with your quote",
      "Capacity, rental price and availability confirmed before booking"
    ],
    "markets": {
      "dc": "request",
      "dfw": "request"
    }
  },
  {
    "id": "navy-pintuck-120-round-tablecloth",
    "name": "Pintuck 120\" Round Tablecloth - Navy Blue",
    "category": "Linens & Tabletop",
    "price": 20,
    "image": "gns-navy-pintuck-tablecloth.webp",
    "tag": "Rich color. Beautiful texture.",
    "description": "A navy blue pintuck tablecloth with a 120-inch round shape for an elegant, textured tablescape.",
    "details": [
      "120-inch round tablecloth",
      "Navy blue pintuck fabric",
      "Table fit, quantities and availability confirmed with your quote"
    ],
    "markets": {
      "dc": "request",
      "dfw": "request"
    }
  },
  {
    "id": "eggplant-polyester-19-napkin",
    "name": "Premium Polyester Napkin 19\"x19\" - Eggplant/Plum",
    "category": "Linens & Tabletop",
    "price": null,
    "image": "gns-eggplant-polyester-napkin.webp",
    "tag": "A rich finishing touch",
    "description": "A premium polyester napkin in eggplant/plum, sized 19 by 19 inches, for a beautifully coordinated place setting.",
    "details": [
      "19\" × 19\" napkin",
      "Premium polyester",
      "Eggplant / plum color",
      "Price per napkin, quantities and market availability confirmed with your quote"
    ],
    "markets": {
      "dc": "request",
      "dfw": "request"
    }
  }
];
if (typeof module !== 'undefined') module.exports = GNS_CATALOG;
if (typeof window !== 'undefined') window.GNS_CATALOG = GNS_CATALOG;
