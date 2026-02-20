import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X, ShoppingBag, MessageCircle, Crown } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const drawer = drawerRef.current;

    if (!overlay || !drawer) return;

    if (isOpen) {
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(drawer, {
        x: 0,
        duration: 0.4,
        ease: 'power3.out',
      });
    } else {
      gsap.to(drawer, {
        x: '100%',
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

  const openWhatsApp = () => {
    window.open('https://wa.me/2349027026576', '_blank');
  };

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-[100] bg-burgundy/50 backdrop-blur-sm ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{ opacity: 0 }}
      onClick={onClose}
    >
      <div
        ref={drawerRef}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-cream shadow-gold-xl"
        style={{ transform: 'translateX(100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gold accent line */}
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-gold to-transparent" />
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gold/20">
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-gold" strokeWidth={1.5} />
            <h2 className="font-display text-xl text-burgundy font-semibold">Your Selection</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 border border-gold/40 text-burgundy hover:bg-gold hover:text-burgundy transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center h-[calc(100%-280px)] p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center mb-6 gold-frame">
            <ShoppingBag className="w-10 h-10 text-gold" strokeWidth={1.5} />
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-gold" />
            <Crown className="w-4 h-4 text-gold" strokeWidth={1.5} />
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-gold" />
          </div>
          
          <h3 className="font-display text-2xl text-burgundy mb-3">
            Direct Ordering
          </h3>
          <p className="font-body text-sm text-taupe max-w-xs leading-relaxed">
            At ZERA XII, we offer a personalized ordering experience. Browse our collection and contact us directly to place your order.
          </p>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gold/20 bg-cream">
          <button
            onClick={openWhatsApp}
            className="w-full flex items-center justify-center gap-3 p-4 bg-[#25D366] text-white hover:bg-[#128C7E] transition-all"
          >
            <MessageCircle className="w-5 h-5" strokeWidth={2} />
            <span className="font-body text-sm font-medium tracking-wide">Contact to Order</span>
          </button>
          
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-taupe">
            <div className="w-8 h-px bg-gold/30" />
            <span>WhatsApp: +234 902 702 6576</span>
            <div className="w-8 h-px bg-gold/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
