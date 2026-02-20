import { Instagram, MessageCircle, Mail, MapPin, Phone, Crown } from 'lucide-react';

export default function Footer() {
  const openWhatsApp = () => {
    window.open('https://wa.me/2349027026576', '_blank');
  };

  const openInstagram = () => {
    window.open('https://instagram.com/zeraxii_', '_blank');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-burgundy relative overflow-hidden">
      {/* Gold accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-gold/10 rounded-full" />
      <div className="absolute bottom-20 right-10 w-48 h-48 border border-gold/10 rounded-full" />
      
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-16 lg:py-20 relative">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Crown className="w-6 h-6 text-gold" strokeWidth={1.5} />
                <h3 className="font-display text-3xl text-cream">
                  ZERA <span className="text-gold">XII</span>
                </h3>
              </div>
              
              <p className="font-body text-sm text-cream/70 max-w-sm leading-relaxed mb-6">
                Adorned In Elegance, Defined By You. Luxury jewelry crafted for those who appreciate the finer details of life.
              </p>
              
              {/* Gold divider */}
              <div className="w-16 h-px bg-gradient-to-r from-gold to-transparent mb-6" />
              
              {/* Social Links */}
              <div className="flex items-center gap-3">
                <button
                  onClick={openInstagram}
                  className="p-3 border border-gold/40 text-cream hover:border-gold hover:bg-gold hover:text-burgundy transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" strokeWidth={1.5} />
                </button>
                <button
                  onClick={openWhatsApp}
                  className="p-3 border border-gold/40 text-cream hover:border-gold hover:bg-gold hover:text-burgundy transition-all"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
                </button>
                <a
                  href="mailto:contact@zeraxii.com"
                  className="p-3 border border-gold/40 text-cream hover:border-gold hover:bg-gold hover:text-burgundy transition-all"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" strokeWidth={1.5} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-mono-label text-gold mb-6">QUICK LINKS</h4>
              <ul className="space-y-3">
                {[
                  { id: 'products', label: 'Collections' },
                  { id: 'categories', label: 'Categories' },
                  { id: 'contact', label: 'Contact Us' },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="font-body text-sm text-cream/60 hover:text-gold transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-mono-label text-gold mb-6">CONTACT</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gold mt-1 flex-shrink-0" strokeWidth={1.5} />
                  <a
                    href="tel:+2349027026576"
                    className="font-body text-sm text-cream/60 hover:text-gold transition-colors"
                  >
                    +234 902 702 6576
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MessageCircle className="w-4 h-4 text-gold mt-1 flex-shrink-0" strokeWidth={1.5} />
                  <a
                    href="https://instagram.com/zeraxii_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm text-cream/60 hover:text-gold transition-colors"
                  >
                    @zeraxii_
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gold mt-1 flex-shrink-0" strokeWidth={1.5} />
                  <span className="font-body text-sm text-cream/60">
                    Lagos, Nigeria
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Gold divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-8" />

          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-xs text-cream/40">
              © 2024 ZERA XII. All rights reserved.
            </p>
            <p className="font-body text-xs text-cream/40">
              Crafted with <span className="text-gold">elegance</span> for the discerning few.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
