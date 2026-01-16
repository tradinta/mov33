'use client';
import { Button } from "@/components/ui/button";
import { Sparkles, Ticket, ArrowRight, Zap } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

const heroSlogans = [
  { text: 'EXPERIENCE THE', highlight: 'EXTRAORDINARY' },
  { text: 'DISCOVER THE', highlight: 'UNFORGETTABLE' },
  { text: 'UNLOCK THE', highlight: 'IMPOSSIBLE' },
];

// Glitch animation component
function GlitchText({ text, highlight }: { text: string; highlight: string }) {
  return (
    <span className="relative inline-block">
      {/* Main text */}
      <span className="relative z-10">{text} </span>
      <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-kenyan-green to-gold">
        {highlight}
      </span>

      {/* Glitch layers */}
      <span
        className="absolute top-0 left-0 text-kenyan-green/50 z-0 animate-pulse"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
          transform: 'translate(-2px, -1px)',
          opacity: 0.8
        }}
        aria-hidden
      >
        {text} <span className="text-gold/50">{highlight}</span>
      </span>
      <span
        className="absolute top-0 left-0 text-gold/30 z-0"
        style={{
          clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
          transform: 'translate(2px, 1px)',
          opacity: 0.6
        }}
        aria-hidden
      >
        {text} <span className="text-kenyan-green/50">{highlight}</span>
      </span>
    </span>
  );
}

export function HeroSection() {
  const [currentSlogan, setCurrentSlogan] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => {
        setCurrentSlogan((prev) => (prev + 1) % heroSlogans.length);
        setIsGlitching(false);
      }, 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative w-full min-h-[85vh] flex items-center justify-center bg-transparent py-12 md:py-24 overflow-hidden"
    >
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-kenyan-green/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gold/5 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated Glitchy Headline */}
          <div className="min-h-[120px] md:min-h-[160px] flex items-center justify-center mb-6">
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentSlogan}
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  x: isGlitching ? [0, -3, 3, -2, 0] : 0,
                }}
                exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                transition={{ duration: 0.4 }}
                className="font-headline text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-foreground"
              >
                <GlitchText
                  text={heroSlogans[currentSlogan].text}
                  highlight={heroSlogans[currentSlogan].highlight}
                />
              </motion.h1>
            </AnimatePresence>
          </div>

          <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto font-poppins font-light leading-relaxed">
            From exclusive coastal retreats to high-energy Nairobi nightlife.
            Secure your spot at the <span className="text-foreground font-medium">most elite</span> events in Kenya.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 flex flex-col sm:flex-row justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/events">
            <Button
              size="lg"
              className="group relative bg-gradient-to-r from-kenyan-green via-kenyan-green to-gold hover:from-gold hover:via-gold hover:to-kenyan-green text-white font-poppins font-black text-lg uppercase tracking-widest px-12 py-8 rounded-2xl transition-all duration-700 hover:scale-[1.05] hover:shadow-[0_0_60px_rgba(142,121,36,0.5)] shadow-2xl overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <Ticket className="mr-3 h-6 w-6 transition-transform group-hover:rotate-12 group-hover:scale-110" />
              Explore All Events
              <Zap className="ml-2 h-5 w-5 text-gold group-hover:text-white transition-colors" />
            </Button>
          </Link>

          <Link href="/partner">
            <Button
              size="lg"
              variant="outline"
              className="group font-poppins font-bold text-lg px-10 py-8 rounded-2xl border-gold/30 bg-gold/5 backdrop-blur-md hover:bg-gold/10 hover:border-gold text-foreground transition-all duration-500 hover:scale-[1.02]"
            >
              <Sparkles className="mr-2 h-5 w-5 text-gold group-hover:rotate-12 transition-transform" />
              Become a mov33 Partner
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

        {/* Floating Quick Stats - Desktop Only */}
        <motion.div
          className="hidden lg:flex mt-20 justify-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <GlassCard className="px-8 py-4 flex items-center gap-4 hover:border-gold/30 cursor-default">
            <div className="text-3xl font-black text-gold">20+</div>
            <div className="text-xs text-left uppercase tracking-widest text-muted-foreground">Certified<br />Partners</div>
          </GlassCard>
          <GlassCard className="px-8 py-4 flex items-center gap-4 hover:border-kenyan-green/30 cursor-default">
            <div className="text-3xl font-black text-kenyan-green">5k+</div>
            <div className="text-xs text-left uppercase tracking-widest text-muted-foreground">Monthly<br />Attendance</div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
