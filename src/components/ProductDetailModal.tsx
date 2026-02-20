import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X, MessageCircle, Instagram, Crown } from 'lucide-react';
import type { Product } from '@/types';
import { getWhatsAppOrderLink } from '@/data/products';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const modal = modalRef.current;
    const content = contentRef.current;

    if (!overlay || !modal || !content) return;

    if (isOpen) {
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(modal, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out',
      });
      gsap.fromTo(
        content.children,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          delay: 0.2,
          ease: 'power3.out',
        }
      );
    } else {
      gsap.to(modal, {
        scale: 0.95,
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

  if (!product) return null;

  const openWhatsApp = () => {
    window.open(getWhatsAppOrderLink(product), '_blank');
  };

  const openInstagram = () => {
    window.open('https://instagram.com/zeraxii_', '_blank');
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
        className="absolute inset-2 md:inset-6 lg:inset-12 bg-cream overflow-auto"
        style={{ transform: 'scale(0.95)', opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gold border frame */}
        <div className="absolute inset-3 md:inset-4 border border-gold/40 pointer-events-none" />
        
        {/* Corner accents */}
        <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-gold" />
        <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-gold" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-gold" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-gold" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 lg:top-10 lg:right-10 z-10 p-3 bg-cream border border-gold/40 text-burgundy hover:bg-gold hover:text-burgundy transition-all"
          aria-label="Close"
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </button>

        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 min-h-full">
          {/* Image */}
          <div className="relative aspect-square lg:aspect-auto lg:h-full gold-frame">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {/* Gold overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-burgundy/20 via-transparent to-gold/10" />
          </div>

          {/* Content */}
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
            {/* Logo accent */}
            <div className="flex items-center gap-3 mb-6">
              <Crown className="w-5 h-5 text-gold" strokeWidth={1.5} />
              <div className="w-16 h-px bg-gradient-to-r from-gold to-transparent" />
            </div>

            {/* Category */}
            <span className="font-mono-label text-gold block mb-4">
              {product.category.toUpperCase()}
            </span>

            {/* Name */}
            <h2 className="font-display text-4xl md:text-5xl font-bold text-burgundy mb-4">
              {product.name}
            </h2>

            {/* Gold divider */}
            <div className="w-20 h-0.5 bg-gradient-to-r from-gold via-gold-light to-transparent mb-6" />

            {/* Description */}
            <p className="font-body text-base md:text-lg text-taupe leading-relaxed mb-8">
              {product.fullDescription}
            </p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 border border-gold/30">
                <span className="font-display text-xl text-gold font-semibold">18K</span>
                <p className="font-mono-label text-[8px] text-taupe mt-1">GOLD</p>
              </div>
              <div className="text-center p-4 border border-gold/30">
                <span className="font-display text-xl text-gold font-semibold">100%</span>
                <p className="font-mono-label text-[8px] text-taupe mt-1">HANDMADE</p>
              </div>
              <div className="text-center p-4 border border-gold/30">
                <span className="font-display text-xl text-gold font-semibold">1YR</span>
                <p className="font-mono-label text-[8px] text-taupe mt-1">WARRANTY</p>
              </div>
            </div>

            {/* Price Note */}
            <div className="p-4 bg-gold/10 border border-gold/30 mb-8">
              <p className="font-body text-sm text-burgundy">
                <span className="font-semibold">Price:</span> Available upon request. 
                Contact us for pricing, availability, and sizing options.
              </p>
            </div>

            {/* Contact Options */}
            <div className="space-y-4">
              <p className="font-mono-label text-gold">ORDER NOW</p>
              
              <button
                onClick={openWhatsApp}
                className="w-full flex items-center justify-center gap-3 p-4 bg-[#25D366] text-white hover:bg-[#128C7E] transition-all group"
              >
                <MessageCircle className="w-5 h-5" strokeWidth={2} />
                <span className="font-body text-sm font-medium tracking-wide">Order on WhatsApp</span>
              </button>

              <button
                onClick={openInstagram}
                className="w-full flex items-center justify-center gap-3 p-4 border-2 border-burgundy text-burgundy hover:bg-burgundy hover:text-cream transition-all group"
              >
                <Instagram className="w-5 h-5" strokeWidth={2} />
                <span className="font-body text-sm font-medium tracking-wide">Order via Instagram</span>
              </button>
            </div>

            {/* Contact info */}
            <div className="mt-8 pt-6 border-t border-gold/30">
              <div className="flex items-center justify-center gap-6 text-sm text-taupe">
                <span>WhatsApp: +234 902 702 6576</span>
                <span className="text-gold">|</span>
                <span>@zeraxii_</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
