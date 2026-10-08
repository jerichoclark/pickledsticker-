// =====================================================================
//  YOUR TUMBLERS  —  add, remove, or edit products here.
//
//  Each product is one { ... } block. To add a new one, copy a whole
//  block (from { to },) and paste it below the last one, then change it.
//
//  id          a short unique name, no spaces (used behind the scenes)
//  name        what customers see
//  price       in dollars, no $ sign (e.g. 29.99)
//  size        e.g. "20 oz skinny"
//  description a sentence or two about the design
//  image       the photo file inside the "images" folder
//  inStock     true = can be bought, false = shows "Sold out"
//  personalize true = shows a box where the buyer can type a name/text
//  badge       a little sticker on the photo, like "New" or "Our fave" (use "" for none)
// =====================================================================

window.PRODUCTS = [
  {
    id: "pickle-party",
    name: "Pickle Party",
    price: 29.99,
    size: "20 oz skinny",
    description: "Our signature dill-icious design. Bright, bold, and a little bit sour.",
    image: "images/pickle-party.svg",
    inStock: true,
    personalize: false,
    badge: "Our fave",
  },
  {
    id: "sunset-glow",
    name: "Sunset Glow",
    price: 29.99,
    size: "20 oz skinny",
    description: "Warm orange-to-gold fade that looks like golden hour in your hand.",
    image: "images/sunset-glow.svg",
    inStock: true,
    personalize: false,
    badge: "",
  },
  {
    id: "ocean-swirl",
    name: "Ocean Swirl",
    price: 29.99,
    size: "20 oz skinny",
    description: "Cool blue waves for beach days and pool days.",
    image: "images/ocean-swirl.svg",
    inStock: true,
    personalize: false,
    badge: "New",
  },
  {
    id: "floral-dream",
    name: "Floral Dream",
    price: 31.99,
    size: "20 oz skinny",
    description: "Soft pink florals wrapped all the way around.",
    image: "images/floral-dream.svg",
    inStock: true,
    personalize: false,
    badge: "New",
  },
  {
    id: "midnight-stars",
    name: "Midnight Stars",
    price: 31.99,
    size: "20 oz skinny",
    description: "Deep night sky with a sprinkle of stars.",
    image: "images/midnight-stars.svg",
    inStock: true,
    personalize: false,
    badge: "",
  },
  {
    id: "custom-name",
    name: "Personalized Name Tumbler",
    price: 34.99,
    size: "20 oz skinny",
    description: "Pick your favorite style and we'll add a name or short phrase.",
    image: "images/custom-name.svg",
    inStock: true,
    personalize: true,
    badge: "Personalize it",
  },
];
