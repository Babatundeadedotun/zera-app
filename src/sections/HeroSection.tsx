import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    const content = contentRef.current;
    const wordmark = wordmarkRef.current;
    const tagline = taglineRef.current;
    const cta = ctaRef.current;

    if (!image || !content || !wordmark || !tagline || !cta) return;

    // Initial load animation timeline (no scroll trigger)
    const loadTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Image fade in with scale
    loadTl.fromTo(
      image,
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 1 }
    );

    // Content panel slide in
    loadTl.fromTo(
      content,
      { x: 40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8 },
      0.2
    );

    // Wordmark reveal
    loadTl.fromTo(
      wordmark,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      0.4
    );

    // Tagline reveal
    loadTl.fromTo(
      tagline,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      0.6
    );

    // CTA button
    loadTl.fromTo(
      cta,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      0.8
    );

    return () => {
      loadTl.kill();
    };
  }, []);

  const scrollToCollections = () => {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative bg-cream w-full"
      style={{ marginTop: 0, paddingTop: 0 }}
    >
      {/* Compact Hero Layout - No full height */}
      <div className="flex flex-col lg:flex-row min-h-[auto] h-auto">
        {/* Hero Image - Left Side */}
        <div
          ref={imageRef}
          className="relative w-full lg:w-1/2 h-[50vh] lg:h-[600px]"
        >
          <img
            src="/images/hero-ring.jpg"
            alt="Luxury gold ring on cream silk"
            className="w-full h-full object-cover"
          />
          {/* Gold-tinted gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-cream/90 lg:to-cream" />
          <div className="absolute inset-0 bg-gradient-to-t from-cream/60 via-transparent to-transparent lg:hidden" />
          
          {/* Gold frame overlay */}
          <div className="absolute inset-3 border border-gold/30 pointer-events-none" />
          
          {/* Corner accents */}
          <div className="absolute top-4 left-4 w-10 h-10 border-l border-t border-gold/40" />
          <div className="absolute top-4 right-4 w-10 h-10 border-r border-t border-gold/40" />
          <div className="absolute bottom-4 left-4 w-10 h-10 border-l border-b border-gold/40" />
          <div className="absolute bottom-4 right-4 w-10 h-10 border-r border-b border-gold/40" />
        </div>

        {/* Right Content Panel */}
        <div
          ref={contentRef}
          className="relative w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-10 lg:py-12 bg-cream"
        >
          <div className="max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
            {/* Gold accent line */}
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-5">
              <div className="w-10 h-px bg-gradient-to-r from-gold to-transparent" />
              <Sparkles className="w-4 h-4 text-gold" strokeWidth={1.5} />
              <div className="w-10 h-px bg-gradient-to-l from-gold to-transparent lg:hidden" />
            </div>

            {/* Wordmark */}
            <h1
              ref={wordmarkRef}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-burgundy mb-3 tracking-wide"
            >
              ZERA <span className="text-gold">XII</span>
            </h1>

            {/* Gold divider */}
            <div className="w-20 h-0.5 bg-gradient-to-r from-gold via-gold-light to-gold mx-auto lg:mx-0 mb-5" />

            {/* Tagline */}
            <p
              ref={taglineRef}
              className="font-display text-lg sm:text-xl lg:text-2xl text-taupe italic mb-6 leading-relaxed"
            >
              Adorned In Elegance,<br />
              <span className="text-gold">Defined By You.</span>
            </p>

            {/* Description */}
            <p className="font-body text-sm text-taupe/80 mb-8 max-w-md mx-auto lg:mx-0">
              Discover our exclusive collection of handcrafted luxury jewelry, 
              designed to celebrate your unique style.
            </p>

            {/* CTA Button */}
            <button
              ref={ctaRef}
              onClick={scrollToCollections}
              className="btn-primary group inline-flex items-center gap-3"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
            </button>

            {/* Trust badges */}
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-5">
              <div className="text-center">
                <span className="font-display text-xl text-gold font-semibold">18K</span>
                <p className="font-mono-label text-[8px] text-taupe mt-1">GOLD</p>
              </div>
              <div className="w-px h-6 bg-gold/30" />
              <div className="text-center">
                <span className="font-display text-xl text-gold font-semibold">100%</span>
                <p className="font-mono-label text-[8px] text-taupe mt-1">HANDCRAFTED</p>
              </div>
              <div className="w-px h-6 bg-gold/30" />
              <div className="text-center">
                <span className="font-display text-xl text-gold font-semibold">5★</span>
                <p className="font-mono-label text-[8px] text-taupe mt-1">RATED</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom gold accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
    </section>
  );
}
