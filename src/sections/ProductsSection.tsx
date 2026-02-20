import { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, MessageCircle, Crown } from 'lucide-react';
import { products, getWhatsAppOrderLink } from '@/data/products';
import type { Product } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface ProductsSectionProps {
  onViewDetails: (product: Product) => void;
}

const filterCategories = [
  { id: 'all', name: 'All Pieces' },
  { id: 'rings', name: 'Rings' },
  { id: 'necklaces', name: 'Necklaces' },
  { id: 'watches', name: 'Watches' },
  { id: 'earrings', name: 'Earrings' },
];

export default function ProductsSection({ onViewDetails }: ProductsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    let result = products;
    
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const filters = filtersRef.current;

    if (!section || !headline || !filters) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headline,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        filters,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  // Animate grid items when they change
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    gsap.fromTo(
      grid.children,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out',
      }
    );
  }, [filteredProducts]);

  return (
    <section
      ref={sectionRef}
      id="products"
      className="relative bg-cream py-20 md:py-28 lg:py-32"
    >
      {/* Gold accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold" />
            <Crown className="w-5 h-5 text-gold" strokeWidth={1.5} />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold" />
          </div>
          <span className="font-mono-label text-gold block mb-4">OUR COLLECTION</span>
          <h2
            ref={headlineRef}
            className="section-title mb-6"
          >
            Exquisite Pieces
          </h2>
          <p className="font-body text-sm md:text-base text-taupe max-w-lg mx-auto">
            Discover our curated selection of luxury jewelry, each piece crafted to perfection
          </p>
        </div>

        {/* Search and Filters */}
        <div ref={filtersRef} className="mb-10 md:mb-14">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" strokeWidth={1.5} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for jewelry..."
              className="input-elegant pl-12 pr-4 py-3 w-full"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {filterCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 md:px-6 py-2 md:py-3 font-body text-xs md:text-sm tracking-wider uppercase transition-all duration-300 border ${
                  selectedCategory === category.id
                    ? 'bg-burgundy text-cream border-burgundy shadow-gold'
                    : 'bg-transparent text-burgundy border-gold/40 hover:border-gold hover:bg-gold/10'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
          >
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Crown className="w-12 h-12 text-gold/40 mx-auto mb-6" strokeWidth={1.5} />
            <p className="font-body text-taupe text-lg mb-6">
              No pieces found matching your criteria
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="btn-outline-gold"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// Product Card Component
interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(getWhatsAppOrderLink(product), '_blank');
  };

  return (
    <div
      className="card-luxury group cursor-pointer"
      onClick={() => onViewDetails(product)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden gold-frame">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gold overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-burgundy/80 via-burgundy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Category badge */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-cream/90 backdrop-blur-sm">
          <span className="font-mono-label text-burgundy text-[9px]">
            {product.category.toUpperCase()}
          </span>
        </div>
        
        {/* Hover Actions */}
        <div className="absolute inset-0 flex flex-col items-center justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <button
            onClick={handleWhatsAppClick}
            className="btn-whatsapp w-full flex items-center justify-center gap-2 mb-3"
          >
            <MessageCircle className="w-4 h-4" strokeWidth={2} />
            <span>Order on WhatsApp</span>
          </button>
          <span className="font-body text-xs text-cream/80 tracking-wide">
            Click for details
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 md:p-6 text-center">
        {/* Gold line accent */}
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-4" />
        
        <h3 className="font-display text-xl md:text-2xl font-semibold text-burgundy group-hover:text-gold transition-colors mb-2">
          {product.name}
        </h3>
        <p className="font-body text-sm text-taupe line-clamp-2 mb-4">
          {product.description}
        </p>
        
        {/* WhatsApp Button - Always visible on mobile */}
        <button
          onClick={handleWhatsAppClick}
          className="md:hidden btn-whatsapp w-full flex items-center justify-center gap-2 mt-3"
        >
          <MessageCircle className="w-4 h-4" strokeWidth={2} />
          <span>Order on WhatsApp</span>
        </button>
        
        {/* Desktop: subtle hint */}
        <div className="hidden md:flex items-center justify-center gap-2 text-gold/60">
          <div className="w-8 h-px bg-gold/30" />
          <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
          <div className="w-8 h-px bg-gold/30" />
        </div>
      </div>
    </div>
  );
}
