import type { Product, Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'rings',
    name: 'Rings',
    image: '/images/category-rings.jpg',
    description: 'Engagement & Wedding Rings',
  },
  {
    id: 'necklaces',
    name: 'Necklaces',
    image: '/images/category-necklace.jpg',
    description: 'Chains & Pendants',
  },
  {
    id: 'earrings',
    name: 'Earrings',
    image: '/images/category-earrings.jpg',
    description: 'Stud & Drop Earrings',
  },
  {
    id: 'watches',
    name: 'Watches',
    image: '/images/category-watches.jpg',
    description: 'Luxury Timepieces',
  },
  {
    id: 'bracelets',
    name: 'Bracelets',
    image: '/images/category-bracelets.jpg',
    description: 'Wrist Accessories',
  },
  {
    id: 'couple',
    name: 'Couple Sets',
    image: '/images/category-couple.jpg',
    description: 'Matching Jewelry',
  },
];

export const products: Product[] = [
  {
    id: 'royal-solitaire',
    name: 'Royal Solitaire',
    category: 'rings',
    description: 'Crowning elegance in pure gold',
    fullDescription: 'A magnificent solitaire diamond ring that captures the essence of eternal love. Set in pure 18K gold with exceptional craftsmanship that speaks of timeless luxury.',
    image: '/images/hero-ring.jpg',
    price: 'Contact for Price',
  },
  {
    id: 'eternity-band',
    name: 'Eternity Band',
    category: 'rings',
    description: 'A continuous circle of light',
    fullDescription: 'A continuous circle of light—set in polished gold for everyday permanence. This exquisite eternity band features meticulously set diamonds that sparkle from every angle.',
    image: '/images/product-ring-band.jpg',
    price: 'Contact for Price',
  },
  {
    id: 'gilded-chain',
    name: 'Gilded Chain',
    category: 'necklaces',
    description: 'Weight that feels expensive',
    fullDescription: 'Weight that feels expensive, links that lie perfectly—made to layer or stand alone. This gilded chain necklace is a statement piece for any occasion.',
    image: '/images/product-necklace.jpg',
    price: 'Contact for Price',
  },
  {
    id: 'solitaire-drop',
    name: 'Solitaire Drop',
    category: 'necklaces',
    description: 'A single point of focus',
    fullDescription: 'A single point of focus—set to move with you, gleam without glare. This solitaire pendant features a brilliant diamond suspended from a delicate gold chain.',
    image: '/images/product-pendant.jpg',
    price: 'Contact for Price',
  },
  {
    id: 'heritage-timepiece',
    name: 'Heritage Timepiece',
    category: 'watches',
    description: 'Tradition made modern',
    fullDescription: 'Clean indices, warm leather, and a case that feels like tradition made modern. This heritage timepiece combines classic design with contemporary elegance.',
    image: '/images/product-watch.jpg',
    price: 'Contact for Price',
  },
  {
    id: 'pearl-droplets',
    name: 'Pearl Droplets',
    category: 'earrings',
    description: 'Soft luster, quiet movement',
    fullDescription: 'Soft luster, quiet movement—designed to catch light without asking for it. These pearl drop earrings feature lustrous pearls suspended from delicate gold hooks.',
    image: '/images/product-earrings.jpg',
    price: 'Contact for Price',
  },
  {
    id: 'cuff-link',
    name: 'Cuff & Link',
    category: 'bracelets',
    description: 'Architecture for your wrist',
    fullDescription: 'A bracelet that sits like architecture—polished planes, soft edges, effortless closure. This cuff bracelet combines modern design with timeless elegance.',
    image: '/images/product-bracelet.jpg',
    price: 'Contact for Price',
  },
  {
    id: 'union-bands',
    name: 'Union Bands',
    category: 'couple',
    description: 'Two finishes, one intention',
    fullDescription: 'Two finishes, one intention—rings designed to belong together, even when apart. These matching couple bands symbolize eternal love and commitment.',
    image: '/images/product-couple-rings.jpg',
    price: 'Contact for Price',
  },
];

export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(product => product.category === categoryId);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

// WhatsApp order link generator
export const getWhatsAppOrderLink = (product: Product): string => {
  const message = `Hello ZERA XII, I'm interested in ordering the ${product.name}. Could you please provide more details about pricing and availability?`;
  return `https://wa.me/2349027026576?text=${encodeURIComponent(message)}`;
};
