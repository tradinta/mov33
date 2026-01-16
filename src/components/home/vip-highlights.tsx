"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Sparkles, Award, Loader2, ChevronRight } from "lucide-react";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { firestore } from "@/firebase";
import { Event } from "@/lib/types";
import { format } from "date-fns";
import Link from "next/link";

export function VipHighlights() {
  const [premiumEvents, setPremiumEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPremium = async () => {
      try {
        const q = query(
          collection(firestore, "events"),
          where("status", "==", "published"),
          where("isPremium", "==", true),
          limit(2)
        );
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Event[];
        setPremiumEvents(fetched);
      } catch (error) {
        console.error("Error fetching premium events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPremium();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
        <p className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50">Opening The Vault...</p>
      </div>
    );
  }

  if (premiumEvents.length === 0) return null;

  return (
    <section className="bg-white/[0.02] border border-white/5 rounded-[4rem] p-10 md:p-20 relative overflow-hidden group/section">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-gold" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">Exclusive Access</span>
          </div>
          <h2 className="font-headline text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.8]">
            The <span className="text-gold">Vault</span>
          </h2>
        </div>
        <p className="text-white/40 font-poppins max-w-xs text-sm">
          A clandestine collection of the most exclusive gatherings, reserved for the discerning elite.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {premiumEvents.map((event) => (
          <Card key={event.id} className="bg-white/5 border-white/10 rounded-[3rem] overflow-hidden group transition-all duration-700 hover:border-gold/40 hover:translate-y-[-4px]">
            <Link href={`/events/${event.id}`} className="block h-full">
              <div className="md:flex h-full">
                <div className="md:w-5/12 relative min-h-[300px] overflow-hidden">
                  <Image
                    src={event.imageUrl || 'https://images.unsplash.com/photo-1514525253361-bee8a48790c3'}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-obsidian/40 to-transparent" />
                </div>
                <div className="md:w-7/12 p-10 flex flex-col justify-center space-y-6">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-gold text-obsidian font-black text-[9px] px-3 py-1 rounded-full uppercase tracking-tighter italic">
                      VIP ACCESS
                    </Badge>
                    <Sparkles className="h-4 w-4 text-gold animate-pulse" />
                  </div>

                  <h3 className="font-headline text-3xl font-black text-white italic tracking-tighter uppercase leading-none group-hover:text-gold transition-colors">
                    {event.title}
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center text-xs font-bold text-white/50 uppercase tracking-tight">
                      <MapPin className="h-4 w-4 mr-3 text-gold" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center text-xs font-bold text-white/50 uppercase tracking-tight">
                      <Calendar className="h-4 w-4 mr-3 text-gold" />
                      <span>{format(event.date.toDate(), 'MMMM d, yyyy')}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-gold italic group-hover:gap-3 transition-all">
                      Ascend to Experience <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}
