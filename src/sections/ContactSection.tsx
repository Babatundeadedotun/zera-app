import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, MessageCircle, Instagram, Phone, Check, Crown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const contactCardRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    piece: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const form = formRef.current;
    const contactCard = contactCardRef.current;

    if (!section || !headline || !form || !contactCard) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headline,
        { y: 30, opacity: 0 },
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
        form,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        contactCard,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: 0.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', piece: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/2349027026576', '_blank');
  };

  const openInstagram = () => {
    window.open('https://instagram.com/zeraxii_', '_blank');
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-burgundy py-20 md:py-28 lg:py-32"
    >
      {/* Gold accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-40 h-40 border border-gold/10 rounded-full" />
      <div className="absolute bottom-20 right-10 w-60 h-60 border border-gold/10 rounded-full" />
      
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14 md:mb-20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold" />
              <Crown className="w-5 h-5 text-gold" strokeWidth={1.5} />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold" />
            </div>
            <span className="font-mono-label text-gold block mb-4">GET IN TOUCH</span>
            <h2
              ref={headlineRef}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-4 tracking-wide"
            >
              Acquire a Piece
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column - Form */}
            <div>
              <p className="font-body text-sm md:text-base text-cream/70 mb-8 max-w-md">
                Tell us what you're drawn to. We'll confirm availability, sizing, and delivery details.
              </p>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="font-mono-label text-gold block mb-2">NAME</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-cream/10 border border-gold/30 text-cream px-4 py-3 font-body text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-cream/40"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="font-mono-label text-gold block mb-2">EMAIL</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-cream/10 border border-gold/30 text-cream px-4 py-3 font-body text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-cream/40"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono-label text-gold block mb-2">PIECE OF INTEREST</label>
                  <input
                    type="text"
                    name="piece"
                    value={formData.piece}
                    onChange={handleChange}
                    className="w-full bg-cream/10 border border-gold/30 text-cream px-4 py-3 font-body text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-cream/40"
                    placeholder="Which piece are you interested in?"
                  />
                </div>

                <div>
                  <label className="font-mono-label text-gold block mb-2">MESSAGE</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-cream/10 border border-gold/30 text-cream px-4 py-3 font-body text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-cream/40 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitted}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-gold text-burgundy hover:bg-gold-light transition-all font-body text-sm font-medium tracking-wider uppercase disabled:opacity-50"
                >
                  {isSubmitted ? (
                    <>
                      <Check className="w-5 h-5" strokeWidth={2} />
                      <span>Message Sent!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" strokeWidth={2} />
                      <span>Send Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column - Contact Card */}
            <div ref={contactCardRef}>
              <div className="bg-cream/5 backdrop-blur-sm border border-gold/30 p-8 md:p-10">
                {/* Logo accent */}
                <div className="flex items-center gap-3 mb-6">
                  <Crown className="w-6 h-6 text-gold" strokeWidth={1.5} />
                  <div className="w-12 h-px bg-gradient-to-r from-gold to-transparent" />
                </div>

                <h3 className="font-display text-2xl text-cream mb-2">
                  Prefer to message?
                </h3>
                <p className="font-body text-sm text-cream/60 mb-8">
                  Reach out to us directly for immediate assistance
                </p>

                <div className="space-y-4">
                  <button
                    onClick={openWhatsApp}
                    className="w-full flex items-center gap-4 p-4 bg-[#25D366] text-white hover:bg-[#128C7E] transition-all group"
                  >
                    <MessageCircle className="w-5 h-5" strokeWidth={2} />
                    <div className="text-left">
                      <span className="font-mono-label text-white/70 text-[9px] block mb-1">WHATSAPP</span>
                      <span className="font-body text-sm">+234 902 702 6576</span>
                    </div>
                  </button>

                  <button
                    onClick={openInstagram}
                    className="w-full flex items-center gap-4 p-4 border border-gold/40 text-cream hover:border-gold hover:bg-gold hover:text-burgundy transition-all group"
                  >
                    <Instagram className="w-5 h-5" strokeWidth={2} />
                    <div className="text-left">
                      <span className="font-mono-label text-gold/70 text-[9px] block mb-1 group-hover:text-burgundy/70">INSTAGRAM</span>
                      <span className="font-body text-sm">@zeraxii_</span>
                    </div>
                  </button>

                  <a
                    href="tel:+2349027026576"
                    className="w-full flex items-center gap-4 p-4 border border-gold/40 text-cream hover:border-gold hover:bg-gold hover:text-burgundy transition-all group"
                  >
                    <Phone className="w-5 h-5" strokeWidth={2} />
                    <div className="text-left">
                      <span className="font-mono-label text-gold/70 text-[9px] block mb-1 group-hover:text-burgundy/70">PHONE</span>
                      <span className="font-body text-sm">+234 902 702 6576</span>
                    </div>
                  </a>
                </div>

                {/* Gold divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent my-8" />

                <div className="text-center">
                  <p className="font-mono-label text-gold mb-2">BUSINESS HOURS</p>
                  <p className="font-body text-sm text-cream/70">
                    Monday - Saturday: 9AM - 6PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
