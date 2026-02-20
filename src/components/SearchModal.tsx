import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { X, Search, ArrowRight, Crown } from 'lucide-react';
import { products } from '@/data/products';
import type { Product } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductClick: (product: Product) => void;
}

export default function SearchModal({ isOpen, onClose, onProductClick }: SearchModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [query, setQuery] = useState('');

  const filteredProducts = query
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    const overlay = overlayRef.current;
    const modal = modalRef.current;

    if (!overlay || !modal) return;

    if (isOpen) {
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(modal, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out',
      });
      setTimeout(() => inputRef.current?.focus(), 400);
    } else {
      gsap.to(modal, {
        y: -20,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      });
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        delay: 0.1,
        ease: 'power2.in',
      });
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleProductClick = (product: Product) => {
    onProductClick(product);
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-[100] bg-burgundy/90 backdrop-blur-sm ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{ opacity: 0 }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="absolute top-0 left-0 right-0 bg-cream shadow-gold-xl"
        style={{ transform: 'translateY(-20px)', opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gold accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        
        {/* Search Input */}
        <div className="w-full px-4 sm:px-6 lg:px-12 py-6 border-b border-gold/20">
          <div className="flex items-center gap-4">
            <Search className="w-6 h-6 text-gold" strokeWidth={1.5} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for jewelry..."
              className="flex-1 bg-transparent font-display text-2xl md:text-3xl text-burgundy placeholder:text-taupe/40 focus:outline-none"
            />
            <button
              onClick={onClose}
              className="p-3 border border-gold/40 text-burgundy hover:bg-gold hover:text-burgundy transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Results */}
        {query && (
          <div className="max-h-[60vh] overflow-auto">
            {filteredProducts.length > 0 ? (
              <div className="py-4">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="w-full px-4 sm:px-6 lg:px-12 py-4 flex items-center gap-6 hover:bg-gold/5 transition-colors text-left group"
                  >
                    <div className="relative w-16 h-16 gold-frame flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="font-mono-label text-gold text-[9px] block mb-1">
                        {product.category.toUpperCase()}
                      </span>
                      <h3 className="font-display text-xl text-burgundy group-hover:text-gold transition-colors">
                        {product.name}
                      </h3>
                      <p className="font-body text-sm text-taupe line-clamp-1">
                        {product.description}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gold opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 sm:px-6 lg:px-12 py-12 text-center">
                <Crown className="w-8 h-8 text-gold/40 mx-auto mb-4" strokeWidth={1.5} />
                <p className="font-body text-taupe">
                  No pieces found matching "{query}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* Quick Links */}
        {!query && (
          <div className="px-4 sm:px-6 lg:px-12 py-8">
            <div className="flex items-center gap-3 mb-6">
              <Crown className="w-4 h-4 text-gold" strokeWidth={1.5} />
              <p className="font-mono-label text-gold">POPULAR SEARCHES</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {['Rings', 'Necklaces', 'Earrings', 'Watches', 'Bracelets'].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-5 py-3 border border-gold/40 text-burgundy hover:border-gold hover:bg-gold hover:text-burgundy transition-all font-body text-sm"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
