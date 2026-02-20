import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface ProductSpotlightProps {
  product: Product;
  layout: 'left' | 'right';
  zIndex: number;
  onViewDetails: (product: Product) => void;
}

export default function ProductSpotlight({ product, layout, zIndex, onViewDetails }: ProductSpotlightProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const content = contentRef.current;
    const label = labelRef.current;
    const title = titleRef.current;
    const desc = descRef.current;
    const cta = ctaRef.current;
    const hairline = hairlineRef.current;

    if (!section || !image || !content || !label || !title || !desc || !cta || !hairline) return;

    const imageEnterX = layout === 'right' ? '60vw' : '-60vw';
    const contentEnterX = layout === 'right' ? '-40vw' : '40vw';
    const imageExitX = layout === 'right' ? '-18vw' : '18vw';
    const contentExitX = layout === 'right' ? '-10vw' : '10vw';

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0%-30%)
      scrollTl.fromTo(
        image,
        { x: imageEnterX, opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        content,
        { x: contentEnterX, opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.05
      );

      scrollTl.fromTo(
        label,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.08
      );

      scrollTl.fromTo(
        title,
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.1
      );

      scrollTl.fromTo(
        desc,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.12
      );

      scrollTl.fromTo(
        cta,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.15
      );

      scrollTl.fromTo(
        hairline,
        { scaleY: 0 },
        { scaleY: 1, transformOrigin: 'top', ease: 'none' },
        0
      );

      // SETTLE (30%-70%): Hold

      // EXIT (70%-100%)
      scrollTl.fromTo(
        image,
        { x: 0, opacity: 1 },
        { x: imageExitX, opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        content,
        { x: 0, opacity: 1 },
        { x: contentExitX, opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        hairline,
        { scaleY: 1 },
        { scaleY: 0, transformOrigin: 'bottom', ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, [layout]);

  const isRightLayout = layout === 'right';

  return (
    <section
      ref={sectionRef}
      className="section-pinned bg-cream"
      style={{ zIndex }}
    >
      {/* Product Image */}
      <div
        ref={imageRef}
        className={`absolute ${isRightLayout ? 'right-0' : 'left-0'} top-0 w-full lg:w-[55vw] h-full`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-${isRightLayout ? 'l' : 'r'} from-transparent to-cream/20 lg:to-cream/40`} />
      </div>

      {/* Hairline */}
      <div
        ref={hairlineRef}
        className={`hidden lg:block absolute ${isRightLayout ? 'left-[44vw]' : 'left-[58vw]'} top-[18vh] w-px h-[64vh] bg-gold/45`}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className={`absolute bottom-0 lg:bottom-auto ${isRightLayout ? 'lg:left-[8vw] left-0' : 'lg:left-[58vw] left-0'} lg:top-0 w-full lg:w-[38vw] h-auto lg:h-full bg-cream/95 lg:bg-transparent flex flex-col justify-center px-8 lg:px-0 py-12 lg:py-0`}
      >
        <div className={`max-w-md mx-auto lg:mx-0 ${isRightLayout ? '' : 'lg:ml-12'}`}>
          {/* Category Label */}
          <span
            ref={labelRef}
            className="font-mono-label text-gold block mb-4"
          >
            {product.category.toUpperCase()}
          </span>

          {/* Product Name */}
          <h2
            ref={titleRef}
            className="font-display text-4xl lg:text-5xl xl:text-6xl font-semibold text-espresso mb-6"
          >
            {product.name}
          </h2>

          {/* Description */}
          <p
            ref={descRef}
            className="font-body text-base lg:text-lg text-taupe leading-relaxed mb-8"
          >
            {product.fullDescription}
          </p>

          {/* CTA */}
          <button
            ref={ctaRef}
            onClick={() => onViewDetails(product)}
            className="btn-primary group flex items-center gap-3"
          >
            <span>Request Details</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
