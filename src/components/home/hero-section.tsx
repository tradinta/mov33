'use client';
import { Button } from "@/components/ui/button";
import { Sparkles, Ticket, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section
      className="relative w-full min-h-[85vh] flex items-center justify-center bg-transparent py-12 md:py-24 overflow-hidden"
    >
      {/* Background Orbs for 'Wow' Factor */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-kenyan-green/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gold/5 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kenyan-green/10 border border-kenyan-green/20 text-kenyan-green text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" />
            <span>Kenya's #1 Premium Ticketing Platform</span>
          </div>

          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-foreground mb-6">
            EXPERIENCE THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-kenyan-green to-gold">EXTRAORDINARY</span>
          </h1>

          <p className="mt-6 text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto font-poppins font-light leading-relaxed">
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
          <Button
            size="lg"
            className="group bg-kenyan-green hover:bg-kenyan-green/90 text-white font-poppins font-bold text-lg px-10 py-8 rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(142,121,36,0.3)] shadow-xl"
          >
            <Ticket className="mr-2 h-6 w-6 transition-transform group-hover:rotate-12" />
            Explore All Events
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="group font-poppins font-bold text-lg px-10 py-8 rounded-2xl border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 text-foreground transition-all duration-500 hover:scale-[1.02]"
          >
            Become an Organizer
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>

        {/* Floating Quick Stats - Desktop Only */}
        <motion.div
          className="hidden lg:flex mt-20 justify-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <GlassCard className="px-8 py-4 flex items-center gap-4 hover:border-gold/30 cursor-default">
            <div className="text-3xl font-black text-gold">500+</div>
            <div className="text-xs text-left uppercase tracking-widest text-muted-foreground">Certified<br />Partners</div>
          </GlassCard>
          <GlassCard className="px-8 py-4 flex items-center gap-4 hover:border-kenyan-green/30 cursor-default">
            <div className="text-3xl font-black text-kenyan-green">50k+</div>
            <div className="text-xs text-left uppercase tracking-widest text-muted-foreground">Monthly<br />Attendees</div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
