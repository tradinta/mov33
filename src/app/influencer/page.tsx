'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { BarChart3, Users, Wallet, TrendingUp, Copy, ExternalLink, Trophy, Loader2, Sparkles, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { Promocode } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function InfluencerDashboard() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [codes, setCodes] = useState<Promocode[]>([]);

  useEffect(() => {
    const fetchPerformance = async () => {
      if (!profile?.uid) return;
      try {
        const q = query(collection(firestore, 'promocodes'), where('influencerId', '==', profile.uid));
        const snap = await getDocs(q);
        const fetchedCodes = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Promocode));
        setCodes(fetchedCodes);
      } catch (error) {
        console.error("Error fetching performance:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, [profile?.uid]);

  const totalConversions = codes.reduce((acc: number, code: Promocode) => acc + (code.usageCount || 0), 0);

  // Simulated clicks (usually tracked via an analytics service or a redirect link)
  const totalClicks = totalConversions * 4.2; // Estimation for demo purposes

  const totalEarnings = codes.reduce((acc: number, code: Promocode) => {
    if (!code.commissionValue) return acc;
    // For simplicity in this demo, we use commissionValue * usageCount 
    // In a real system, you'd calculate based on order value for percentage commissions
    return acc + (code.commissionValue * (code.usageCount || 0));
  }, 0);

  const stats = [
    { label: 'Potential Clicks', value: Math.round(totalClicks).toLocaleString(), icon: BarChart3, color: 'text-blue-400' },
    { label: 'Conversions', value: totalConversions.toLocaleString(), icon: Users, color: 'text-kenyan-green' },
    { label: 'Total Earnings', value: `KES ${totalEarnings.toLocaleString()}`, icon: Wallet, color: 'text-gold' },
    { label: 'Conversion Rate', value: totalClicks > 0 ? `${((totalConversions / totalClicks) * 100).toFixed(1)}%` : '0%', icon: TrendingUp, color: 'text-purple-400' },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://mov33.co.ke/?ref=${profile?.uid}`);
    toast({
      title: "Link Copied!",
      description: "Your global referral link is ready to share.",
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Influencer Nexus</h1>
          <p className="text-muted-foreground">Track your performance and maximize your impact.</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={handleCopyLink} className="bg-gold hover:bg-gold/90 text-obsidian font-bold rounded-2xl h-12">
            <Copy className="mr-2 h-4 w-4" />
            Copy Global Link
          </Button>
          <Button variant="outline" className="border-white/10 bg-white/5 font-bold rounded-2xl h-12">
            Withdraw Funds
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <GlassCard key={stat.label} className="p-6 border-white/5 hover:border-white/10 transition-colors cursor-default">
            <div className="flex flex-col gap-4">
              <div className={`h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-3xl font-black tracking-tighter text-white">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{stat.label}</div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <div className="h-1 w-4 bg-kenyan-green rounded-full" />
            Your Campaigns
          </h2>

          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-gold/30" />
            </div>
          ) : (
            <div className="space-y-3">
              {codes.map((c: Promocode) => (
                <GlassCard key={c.id} className="p-4 border-white/5 hover:bg-white/[0.02] transition-colors overflow-hidden group">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                        <Ticket className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-bold text-sm uppercase tracking-tight flex items-center gap-2">
                          {c.code}
                          {c.active && <div className="h-1.5 w-1.5 rounded-full bg-kenyan-green animate-pulse" />}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                          {c.usageCount || 0} Redemptions • {c.discountValue}{c.discountType === 'percentage' ? '%' : ' KES'} OFF
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-kenyan-green truncate">
                        KES {(c.commissionValue || 0) * (c.usageCount || 0)}
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">Earned</div>
                    </div>
                  </div>
                </GlassCard>
              ))}
              {codes.length === 0 && (
                <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-3xl opacity-50 italic text-sm font-medium">
                  No active referral campaigns found.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Trophy className="h-5 w-5 text-gold" />
            Hall of Fame
          </h2>
          <GlassCard className="p-6 border-gold/20 bg-gold/[0.02]">
            <div className="space-y-6">
              {[
                { rank: 1, name: 'Sauti Sol', score: '4,200', current: true },
                { rank: 2, name: 'Azziad N.', score: '3,840' },
                { rank: 3, name: 'Khaligraph J.', score: '2,910' },
              ].map((user) => (
                <div key={user.rank} className={`flex items-center justify-between ${user.current ? 'bg-white/5 -mx-4 px-4 py-2 rounded-xl' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center font-black text-xs ${user.rank === 1 ? 'bg-gold text-obsidian' : 'bg-white/10'}`}>
                      {user.rank}
                    </div>
                    <div className="font-bold text-sm">{user.name} {user.current && '(You)'}</div>
                  </div>
                  <div className="text-xs font-black text-muted-foreground tracking-tighter">{user.score} pts</div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <div className="text-[10px] uppercase font-black text-gold/50 tracking-[0.2em] mb-4">Your Next Milestone</div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gold w-[60%] rounded-full shadow-[0_0_10px_rgba(255,215,0,0.3)]" />
              </div>
              <div className="flex justify-between mt-2 font-black text-[10px] uppercase tracking-tighter opacity-40">
                <span>Rank #4</span>
                <span>1,000 pts to Rank #3</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
