import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Crown } from 'lucide-react';
import { categories } from '@/data/products';
import type { Category } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface CategoriesSectionProps {
  onCategoryClick: (category: Category) => void;
}

export default function CategoriesSection({ onCategoryClick }: CategoriesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const subhead = subheadRef.current;
    const cards = cardRefs.current.filter(Boolean);

    if (!section || !headline || !subhead || cards.length === 0) return;

    const ctx = gsap.context(() => {
      // Headline animation
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

      // Subhead animation
      gsap.fromTo(
        subhead,
        { y: 30, opacity: 0 },
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

      // Cards stagger animation
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: 0.15 * index,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="categories"
      className="relative bg-cream py-12 md:py-16 lg:py-20"
    >
      {/* Gold accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold" />
            <Crown className="w-5 h-5 text-gold" strokeWidth={1.5} />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold" />
          </div>
          <span className="font-mono-label text-gold block mb-4">BROWSE BY CATEGORY</span>
          <h2
            ref={headlineRef}
            className="section-title mb-6"
          >
            Curated Collections
          </h2>
          <p
            ref={subheadRef}
            className="font-body text-sm md:text-base text-taupe max-w-xl mx-auto"
          >
            Each piece in our collection is meticulously crafted to embody elegance and sophistication
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <div
              key={category.id}
              ref={(el) => { cardRefs.current[index] = el; }}
              onClick={() => onCategoryClick(category)}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden gold-frame mb-4">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gold overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy/70 via-burgundy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Hover arrow */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-500">
                    <ArrowRight className="w-5 h-5 text-burgundy" strokeWidth={2} />
                  </div>
                </div>
                
                {/* Gold border on hover */}
                <div className="absolute inset-0 border-2 border-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content */}
              <div className="text-center">
                <span className="font-mono-label text-gold/70 text-[9px] block mb-1">
                  {category.description}
                </span>
                <h3 className="font-display text-lg md:text-xl font-semibold text-burgundy group-hover:text-gold transition-colors">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
