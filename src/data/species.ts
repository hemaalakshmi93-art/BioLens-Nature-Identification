/**
 * BioLens built-in species dataset.
 * Small, curated and intentionally simple — a real model can map its
 * class labels onto these `id`s later.
 */

export type Category = "flower" | "tree" | "leaf" | "insect" | "bird";

export interface CategoryMeta {
  id: Category;
  label: string;
  plural: string;
  emoji: string;
  tone: string; // tailwind bg token class for badges
}

export const CATEGORIES: CategoryMeta[] = [
  { id: "flower", label: "Flower", plural: "Flowers", emoji: "🌸", tone: "bg-petal-soft text-petal" },
  { id: "tree", label: "Tree", plural: "Trees", emoji: "🌳", tone: "bg-leaf-soft text-moss" },
  { id: "leaf", label: "Leaf", plural: "Leaves", emoji: "🍃", tone: "bg-leaf-soft text-primary" },
  { id: "insect", label: "Insect", plural: "Insects", emoji: "🦋", tone: "bg-sun-soft text-bark" },
  { id: "bird", label: "Bird", plural: "Birds", emoji: "🐦", tone: "bg-sky-soft text-sky" },
];

export const categoryMeta = (id: Category) => CATEGORIES.find((c) => c.id === id)!;

export interface Species {
  id: string;
  category: Category;
  english: string;
  tamil: string;
  scientific: string;
  about: string;
  uses: string;
  ecology: string;
  safety: string;
  similar: string[]; // ids of other species in this dataset
  /** Dominant colours used by the prototype colour-matching engine */
  colorHints: ("red" | "yellow" | "green" | "blue" | "brown" | "white" | "pink")[];
}

export const SPECIES: Species[] = [
  // FLOWERS
  {
    id: "hibiscus",
    category: "flower",
    english: "Hibiscus",
    tamil: "செம்பருத்தி",
    scientific: "Hibiscus rosa-sinensis",
    about:
      "A large, showy flower with five broad petals and a long central stamen. Very common in South Indian gardens and temple offerings.",
    uses: "Used in hair oils, herbal teas and traditional medicine. Popular as an ornamental hedge plant.",
    ecology: "Provides nectar for sunbirds, butterflies and bees throughout the year.",
    safety: "Generally safe. Petals are edible in small amounts; avoid unknown garden sprays.",
    similar: ["rose", "sunflower"],
    colorHints: ["red", "pink"],
  },
  {
    id: "rose",
    category: "flower",
    english: "Rose",
    tamil: "ரோஜா",
    scientific: "Rosa",
    about: "A woody flowering shrub with layered, fragrant petals and thorny stems. Grown worldwide in many colours.",
    uses: "Perfumes, rose water, garlands, cosmetics and decorative gardening.",
    ecology: "Flowers feed pollinators; rose hips are eaten by birds and small mammals.",
    safety: "Thorns can scratch. Petals are edible if unsprayed.",
    similar: ["hibiscus"],
    colorHints: ["red", "pink", "white"],
  },
  {
    id: "sunflower",
    category: "flower",
    english: "Sunflower",
    tamil: "சூரியகாந்தி",
    scientific: "Helianthus annuus",
    about: "A tall annual with a large golden flower head that tracks the sun when young.",
    uses: "Seeds for cooking oil and snacks; grown as a cash crop and ornamental.",
    ecology: "An excellent nectar and seed source for bees and birds.",
    safety: "Safe. Seeds are edible.",
    similar: ["hibiscus"],
    colorHints: ["yellow"],
  },

  // TREES
  {
    id: "neem-tree",
    category: "tree",
    english: "Neem Tree",
    tamil: "வேம்பு",
    scientific: "Azadirachta indica",
    about: "A fast-growing evergreen tree with a dense, spreading crown. Known across India as the 'village pharmacy'.",
    uses: "Leaves, bark and oil are used in medicine, pesticides, soaps and toothpaste. Valued for shade.",
    ecology: "Improves soil, offers shelter to birds, and its flowers feed bees.",
    safety: "Neem oil should not be swallowed. Leaves are very bitter.",
    similar: ["banyan-tree", "mango-tree"],
    colorHints: ["green", "brown"],
  },
  {
    id: "banyan-tree",
    category: "tree",
    english: "Banyan Tree",
    tamil: "ஆலமரம்",
    scientific: "Ficus benghalensis",
    about: "India's national tree. Grows aerial roots that become new trunks, forming a huge canopy.",
    uses: "Shade, community gathering spaces, traditional medicine from bark and latex.",
    ecology: "A keystone species: figs feed birds, bats, monkeys and many insects.",
    safety: "Latex can irritate skin. Otherwise harmless.",
    similar: ["neem-tree", "mango-tree"],
    colorHints: ["green", "brown"],
  },
  {
    id: "mango-tree",
    category: "tree",
    english: "Mango Tree",
    tamil: "மாமரம்",
    scientific: "Mangifera indica",
    about: "A large, long-lived evergreen tree famous for its sweet fruit. Widely cultivated in Tamil Nadu.",
    uses: "Fruit, pickles, timber, and leaves used in festival decorations.",
    ecology: "Flowers attract pollinators; the canopy shelters birds, squirrels and bats.",
    safety: "Sap and skin of fruit can irritate sensitive skin.",
    similar: ["neem-tree", "banyan-tree"],
    colorHints: ["green", "brown"],
  },

  // LEAVES
  {
    id: "neem-leaf",
    category: "leaf",
    english: "Neem Leaf",
    tamil: "வேப்பிலை",
    scientific: "Azadirachta indica",
    about: "Small, serrated leaflets arranged in pairs along a thin stalk. Strongly bitter to taste.",
    uses: "Traditional medicine, natural insect repellent, skin care and stored-grain protection.",
    ecology: "Fallen leaves enrich soil and deter pests naturally.",
    safety: "Safe to handle. Do not eat large quantities.",
    similar: ["mango-leaf", "banana-leaf"],
    colorHints: ["green"],
  },
  {
    id: "mango-leaf",
    category: "leaf",
    english: "Mango Leaf",
    tamil: "மாங்கிலை",
    scientific: "Mangifera indica",
    about: "Long, narrow, glossy leaves with a pointed tip. New leaves emerge coppery-red before turning green.",
    uses: "Strung as festive door hangings (thoranam); used in herbal remedies.",
    ecology: "Leaf litter supports soil insects and fungi under the tree.",
    safety: "Safe to touch. Not typically eaten.",
    similar: ["neem-leaf", "banana-leaf"],
    colorHints: ["green"],
  },
  {
    id: "banana-leaf",
    category: "leaf",
    english: "Banana Leaf",
    tamil: "வாழையிலை",
    scientific: "Musa",
    about: "Very large, smooth, flexible leaves with a strong central midrib. Iconic in South Indian culture.",
    uses: "Traditional eco-friendly plate for meals, food wrapping and decorations.",
    ecology: "Biodegradable; provides shade and habitat for insects and frogs.",
    safety: "Completely safe. Food-grade surface.",
    similar: ["mango-leaf", "neem-leaf"],
    colorHints: ["green"],
  },

  // INSECTS
  {
    id: "ladybird",
    category: "insect",
    english: "Ladybird Beetle",
    tamil: "பொறிவண்டு",
    scientific: "Coccinellidae",
    about: "A small, rounded beetle with bright red wing covers and black spots. Often found on leaves and stems.",
    uses: "Farmers welcome ladybirds as natural pest control for aphids.",
    ecology: "A single ladybird can eat thousands of aphids in its lifetime.",
    safety: "Harmless to humans. Do not squash — they are beneficial.",
    similar: ["butterfly", "honey-bee"],
    colorHints: ["red"],
  },
  {
    id: "butterfly",
    category: "insect",
    english: "Butterfly",
    tamil: "வண்ணத்துப்பூச்சி",
    scientific: "Lepidoptera",
    about: "Delicate insects with large, colourful scaled wings. They begin life as caterpillars.",
    uses: "Indicators of a healthy environment; popular in eco-tourism and gardens.",
    ecology: "Important pollinators and a food source for birds and lizards.",
    safety: "Harmless. Avoid touching wings — scales rub off easily.",
    similar: ["ladybird", "honey-bee"],
    colorHints: ["yellow", "blue", "brown"],
  },
  {
    id: "honey-bee",
    category: "insect",
    english: "Honey Bee",
    tamil: "தேனீ",
    scientific: "Apis",
    about: "A social insect living in large colonies. Fuzzy body with golden-brown bands.",
    uses: "Honey, beeswax and crop pollination worth billions to agriculture.",
    ecology: "One of the most important pollinators on Earth.",
    safety: "Can sting if threatened. Stay calm and move away slowly.",
    similar: ["butterfly", "ladybird"],
    colorHints: ["yellow", "brown"],
  },

  // BIRDS
  {
    id: "indian-peafowl",
    category: "bird",
    english: "Indian Peafowl",
    tamil: "மயில்",
    scientific: "Pavo cristatus",
    about: "India's national bird. Males display a spectacular fan of iridescent blue-green tail feathers.",
    uses: "Culturally significant in art, religion and folklore; a protected species.",
    ecology: "Eats insects, small snakes and seeds, helping control pests.",
    safety: "Keep distance — they can be defensive during breeding season.",
    similar: ["house-sparrow", "indian-robin"],
    colorHints: ["blue", "green"],
  },
  {
    id: "house-sparrow",
    category: "bird",
    english: "House Sparrow",
    tamil: "சிட்டுக்குருவி",
    scientific: "Passer domesticus",
    about: "A small brown-and-grey bird that lives close to people. Its numbers have declined in cities.",
    uses: "Symbol of urban biodiversity; World Sparrow Day is celebrated on 20 March.",
    ecology: "Feeds chicks with insects, controlling garden pests.",
    safety: "Completely harmless.",
    similar: ["indian-robin"],
    colorHints: ["brown"],
  },
  {
    id: "indian-robin",
    category: "bird",
    english: "Indian Robin",
    tamil: "கருஞ்சிட்டு",
    scientific: "Copsychus fulicatus",
    about: "A small, active bird; males are glossy black with a white shoulder patch and cocked tail.",
    uses: "A common sight in dry scrubland and gardens, loved by birdwatchers.",
    ecology: "Eats insects and spiders, helping balance garden ecosystems.",
    safety: "Completely harmless.",
    similar: ["house-sparrow"],
    colorHints: ["brown"],
  },
];

export const speciesById = (id: string) => SPECIES.find((s) => s.id === id);

/** Demo examples guaranteed to work offline, with prototype demo scores. */
export interface DemoExample {
  speciesId: string;
  label: string;
  image: string;
  confidence: number;
}

export const DEMO_EXAMPLES: DemoExample[] = [
  { speciesId: "hibiscus", label: "Hibiscus", image: "/images/hibiscus.jpg", confidence: 94 },
  { speciesId: "neem-tree", label: "Neem Tree", image: "/images/neem-tree.jpg", confidence: 91 },
  { speciesId: "mango-leaf", label: "Mango Leaf", image: "/images/mango-leaf.jpg", confidence: 96 },
  { speciesId: "ladybird", label: "Ladybird", image: "/images/ladybird.jpg", confidence: 89 },
  { speciesId: "indian-peafowl", label: "Indian Peafowl", image: "/images/peafowl.jpg", confidence: 97 },
];
