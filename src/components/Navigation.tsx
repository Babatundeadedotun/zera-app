import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X, Crown } from 'lucide-react';

interface NavigationProps {
  onSearchClick: () => void;
  onCartClick: () => void;
}

export default function Navigation({ onSearchClick, onCartClick }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-cream/95 backdrop-blur-md shadow-luxury'
            : 'bg-transparent'
        }`}
      >
        {/* Gold accent line at bottom when scrolled */}
        <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`} />
        
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <button
              onClick={() => scrollToSection('hero')}
              className="flex items-center gap-2 group"
            >
              <Crown className={`w-5 h-5 transition-colors ${isScrolled ? 'text-gold' : 'text-gold'}`} strokeWidth={1.5} />
              <span className={`font-display text-xl lg:text-2xl font-bold tracking-wide transition-colors ${
                isScrolled ? 'text-burgundy' : 'text-burgundy'
              } group-hover:text-gold`}>
                ZERA <span className="text-gold">XII</span>
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {[
                { id: 'products', label: 'Collections' },
                { id: 'categories', label: 'Categories' },
                { id: 'contact', label: 'Contact' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative font-body text-sm text-burgundy/80 hover:text-burgundy transition-colors tracking-wide group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={onSearchClick}
                className="p-2 md:p-3 text-burgundy/80 hover:text-gold transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <button
                onClick={onCartClick}
                className="p-2 md:p-3 text-burgundy/80 hover:text-gold transition-colors"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              </button>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 md:p-3 text-burgundy hover:text-gold transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" strokeWidth={1.5} />
                ) : (
                  <Menu className="w-5 h-5" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-cream/98 backdrop-blur-lg transition-all duration-500 lg:hidden ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <div className="flex items-center gap-2 mb-8">
            <Crown className="w-6 h-6 text-gold" strokeWidth={1.5} />
            <span className="font-display text-3xl font-bold text-burgundy">
              ZERA <span className="text-gold">XII</span>
            </span>
          </div>
          
          {[
            { id: 'products', label: 'Collections' },
            { id: 'categories', label: 'Categories' },
            { id: 'contact', label: 'Contact' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="font-display text-3xl text-burgundy hover:text-gold transition-colors"
            >
              {item.label}
            </button>
          ))}
          
          {/* Gold divider */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent my-4" />
          
          <p className="font-mono-label text-gold text-center">
            LUXURY JEWELRY
          </p>
        </div>
      </div>
    </>
  );
}
