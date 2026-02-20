import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const content = contentRef.current;
    const headline = headlineRef.current;
    const body = bodyRef.current;
    const cta = ctaRef.current;
    const hairline = hairlineRef.current;

    if (!section || !image || !content || !headline || !body || !cta || !hairline) return;

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
        { x: '-60vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        content,
        { x: '40vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.05
      );

      scrollTl.fromTo(
        headline,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.1
      );

      scrollTl.fromTo(
        body,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.12
      );

      scrollTl.fromTo(
        cta,
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'none' },
        0.15
      );

      scrollTl.fromTo(
        hairline,
        { scaleY: 0 },
        { scaleY: 1, transformOrigin: 'top', ease: 'none' },
        0
      );

      // SETTLE (30%-70%): Hold positions

      // EXIT (70%-100%)
      scrollTl.fromTo(
        image,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        content,
        { x: 0, opacity: 1 },
        { x: '10vw', opacity: 0, ease: 'power2.in' },
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
  }, []);

  const scrollToProducts = () => {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-pinned bg-cream z-20"
    >
      {/* Model Portrait Image */}
      <div
        ref={imageRef}
        className="absolute left-0 top-0 w-full lg:w-[55vw] h-full"
      >
        <img
          src="/images/collection-model.jpg"
          alt="Elegant woman wearing gold jewelry"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-cream/20 lg:to-cream/40" />
      </div>

      {/* Hairline */}
      <div
        ref={hairlineRef}
        className="hidden lg:block absolute left-[58vw] top-[18vh] w-px h-[64vh] bg-gold/45"
      />

      {/* Right Content */}
      <div
        ref={contentRef}
        className="absolute bottom-0 lg:bottom-auto lg:left-[58vw] lg:top-0 left-0 w-full lg:w-[42vw] h-auto lg:h-full bg-cream/95 lg:bg-cream flex flex-col justify-center px-8 lg:px-12 py-12 lg:py-0"
      >
        <div className="max-w-md mx-auto lg:mx-0 lg:ml-12">
          {/* Headline */}
          <h2
            ref={headlineRef}
            className="font-display text-4xl lg:text-5xl xl:text-6xl font-semibold text-espresso mb-6"
          >
            The Collection
          </h2>

          {/* Body */}
          <p
            ref={bodyRef}
            className="font-body text-base lg:text-lg text-taupe leading-relaxed mb-8"
          >
            Pieces chosen for presence—crafted to move with you from morning light to evening gold. Each creation tells a story of elegance, designed for those who appreciate the finer details of life.
          </p>

          {/* CTA */}
          <button
            ref={ctaRef}
            onClick={scrollToProducts}
            className="btn-primary group flex items-center gap-3"
          >
            <span>Explore the Edit</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
