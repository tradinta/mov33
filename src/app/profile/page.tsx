'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MyTickets } from '@/components/profile/my-tickets';
import { useAuth } from '@/context/auth-context';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { TicketRecord, UserProfile } from '@/lib/types';
import { Loader2, Ticket, Crown, Settings, MapPin, Calendar, Share2, LogOut, ChevronRight, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusBadge } from '@/components/profile/plus-badge';
import { UpgradeCard } from '@/components/profile/upgrade-card';
import Image from 'next/image';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user, profile, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tickets');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    const fetchTickets = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(firestore, 'tickets'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        const ticketList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as TicketRecord));
        setTickets(ticketList);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="relative">
          <Loader2 className="h-10 w-10 animate-spin text-gold" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gold/20 rounded-full blur-xl"
          />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gold animate-pulse">Synchronizing Profiles...</p>
      </div>
    );
  }

  /* ... */

  const isPremium = profile?.mov33Plus || false;

  return (
    <div className="bg-background dark:bg-obsidian min-h-screen pt-24 pb-20 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl space-y-10">

        {/* Profile Header Masterpiece */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <GlassCard className="overflow-hidden border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-0">
            <div className="h-32 w-full bg-gradient-to-r from-obsidian via-gold/10 to-obsidian opacity-50 absolute top-0" />

            <div className="p-8 md:p-12 flex flex-col md:flex-row items-start md:items-end gap-10 relative z-10">
              {/* Avatar Section */}
              <div className="relative group">
                <div className="h-28 w-28 md:h-36 md:w-36 rounded-3xl overflow-hidden border-2 border-white/10 group-hover:border-gold/50 transition-all duration-500 shadow-2xl">
                  {user?.photoURL ? (
                    <Image src={user.photoURL} alt={user.displayName || 'User'} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gold/20 to-obsidian flex items-center justify-center text-gold font-black text-4xl">
                      {user?.displayName?.[0] || 'U'}
                    </div>
                  )}
                </div>
                {isPremium && (
                  <div className="absolute -bottom-3 -right-3">
                    <PlusBadge className="px-2" showText={false} />
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
                    {user?.displayName || 'Adventurer'}
                  </h1>
                  {isPremium ? (
                    <PlusBadge />
                  ) : (
                    <Badge variant="outline" className="border-white/10 text-white/40 font-black uppercase tracking-widest text-[9px] py-1">Standard Member</Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-6 text-[11px] font-black uppercase tracking-widest text-white/40">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-gold" />
                    <span>Nairobi, Kenya</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-gold" />
                    <span>Member since {format(user?.metadata?.creationTime ? new Date(user.metadata.creationTime) : new Date(), 'MMM yyyy')}</span>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" size="sm" className="rounded-xl border-white/10 bg-white/5 font-black uppercase text-[10px] tracking-widest h-10 px-6 hover:bg-white/10 transition-all">
                    <Settings className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => logout()} className="rounded-xl border-red-500/20 bg-red-500/5 text-red-400 font-black uppercase text-[10px] tracking-widest h-10 px-6 hover:bg-red-500/20 transition-all">
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </Button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 text-center transition-all hover:border-gold/30">
                  <span className="block text-2xl font-black text-white font-headline tracking-tighter">{tickets.length}</span>
                  <span className="block text-[8px] font-black uppercase text-white/30 tracking-[0.2em] mt-1">Experiences</span>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 text-center transition-all hover:border-gold/30">
                  <span className="block text-2xl font-black text-gold font-headline tracking-tighter">0</span>
                  <span className="block text-[8px] font-black uppercase text-white/30 tracking-[0.2em] mt-1">Saves</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Dashboard Content */}
        <Tabs defaultValue="tickets" onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl h-14 mb-8">
            <TabsTrigger value="tickets" className="rounded-xl px-10 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-gold data-[state=active]:text-obsidian flex items-center gap-2 transition-all">
              <Ticket className="h-3.5 w-3.5" /> Discovery Passes
            </TabsTrigger>
            <TabsTrigger value="premium" className="rounded-xl px-10 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-gold data-[state=active]:text-obsidian flex items-center gap-2 transition-all">
              <Crown className="h-3.5 w-3.5" /> mov33+ Benefits
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent key="tickets" value="tickets" className="mt-0 focus-visible:outline-none min-h-[400px]">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {tickets.length > 0 ? (
                  <MyTickets tickets={tickets} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] rounded-[3rem] border border-white/10 border-dashed">
                    <div className="bg-white/5 p-6 rounded-full mb-6">
                      <Ticket className="h-10 w-10 text-white/20" />
                    </div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-white mb-2">Adventure Awaits</h3>
                    <p className="text-white/40 text-sm font-poppins text-center max-w-xs mb-8">
                      Your haven't secured any passes yet. The world is full of experiences waiting for you.
                    </p>
                    <Button onClick={() => router.push('/events')} className="bg-gold text-obsidian font-black uppercase tracking-widest text-xs h-12 px-10 rounded-2xl">Explore Events</Button>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent key="premium" value="premium" className="mt-0 focus-visible:outline-none">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                {!isPremium && <UpgradeCard />}

                {isPremium && (
                  <GlassCard className="border-gold/30 bg-gold/5 p-12">
                    <div className="flex flex-col items-center text-center space-y-6">
                      <div className="h-20 w-20 rounded-full bg-gold/20 flex items-center justify-center relative">
                        <Crown className="h-10 w-10 text-gold" />
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0, 0.5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute inset-0 bg-gold rounded-full" />
                      </div>
                      <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Active Premium Member</h2>
                      <p className="text-white/60 font-poppins max-w-md">You are part of the mov33+ inner circle. All benefits are automatically applied to your account.</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl pt-6">
                        {[
                          { icon: Zap, label: 'Early Access', status: 'Active' },
                          { icon: Target, label: 'VIP Entry', status: 'Ready' },
                          { icon: Share2, label: 'Concierge', status: 'Priority' }
                        ].map((perk, i) => (
                          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center group hover:border-gold/50 transition-all">
                            <perk.icon className="h-6 w-6 text-gold mx-auto mb-3" />
                            <span className="block text-[10px] font-black uppercase text-white tracking-widest">{perk.label}</span>
                            <span className="block text-[9px] font-bold uppercase text-gold/50 mt-1">{perk.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                  <GlassCard className="border-white/5 bg-white/[0.02]">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                      <span className="h-1 w-1 bg-gold rounded-full" /> Billing Info
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-[10px] uppercase font-black text-white/30 tracking-widest">Plan Type</span>
                        <span className="text-xs font-bold text-white uppercase">{isPremium ? 'mov33+ Annual' : 'Free Tier'}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-[10px] uppercase font-black text-white/30 tracking-widest">Renewal Date</span>
                        <span className="text-xs font-bold text-white">Jan 16, 2027</span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <span className="text-[10px] uppercase font-black text-white/30 tracking-widest">Payment Method</span>
                        <span className="text-xs font-bold text-white flex items-center gap-2">M-Pesa 07•• ••• 45</span>
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard className="border-white/5 bg-white/[0.02]">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                      <span className="h-1 w-1 bg-gold rounded-full" /> Account Security
                    </h3>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 bg-white/5 font-black uppercase text-[10px] tracking-widest justify-between px-6 group transition-all">
                        Password Reset
                        <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-gold transition-colors" />
                      </Button>
                      <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 bg-white/5 font-black uppercase text-[10px] tracking-widest justify-between px-6 group transition-all">
                        2FA Settings
                        <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-gold transition-colors" />
                      </Button>
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}
