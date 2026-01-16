'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Sparkles, Users, Megaphone, Calendar, DollarSign,
    CheckCircle, ArrowRight, Star, TrendingUp, Mic,
    Instagram, Twitter, Youtube, Send, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { toast } from 'sonner';

const organizerBenefits = [
    { icon: Calendar, title: 'Event Management Tools', desc: 'Full dashboard to create, manage, and track your events' },
    { icon: DollarSign, title: 'Competitive Payouts', desc: 'Get paid quickly with our 95% payout rate' },
    { icon: Users, title: 'Reach Thousands', desc: 'Access our growing community of 5k+ monthly attendees' },
    { icon: TrendingUp, title: 'Analytics & Insights', desc: 'Track sales, attendance, and audience demographics' },
];

const influencerBenefits = [
    { icon: DollarSign, title: 'Earn Commissions', desc: 'Get 10-15% on every ticket sold through your link' },
    { icon: Megaphone, title: 'Exclusive Access', desc: 'VIP passes and early access to premium events' },
    { icon: Star, title: 'Brand Partnerships', desc: 'Collaborate with top event organizers' },
    { icon: Mic, title: 'Grow Your Audience', desc: 'Cross-promote with our platform and partners' },
];

type ApplicationType = 'organizer' | 'influencer' | null;

export default function PartnerPage() {
    const [selectedType, setSelectedType] = useState<ApplicationType>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        socialHandle: '',
        followers: '',
        experience: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedType) return;

        setSubmitting(true);
        try {
            await addDoc(collection(firestore, 'partner_applications'), {
                type: selectedType,
                ...formData,
                status: 'pending',
                createdAt: Timestamp.now(),
            });
            toast.success('Application submitted successfully! We\'ll be in touch soon.');
            setFormData({ fullName: '', email: '', phone: '', socialHandle: '', followers: '', experience: '', message: '' });
            setSelectedType(null);
        } catch (error) {
            console.error('Error submitting application:', error);
            toast.error('Failed to submit application. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <MainLayout>
            <div className="bg-background dark:bg-obsidian min-h-screen pt-24 pb-20">
                {/* Hero */}
                <section className="container mx-auto px-4 max-w-6xl text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Badge className="mb-6 bg-gold/10 text-gold border-gold/20 font-black uppercase tracking-widest text-xs py-1.5 px-4">
                            <Sparkles className="h-3 w-3 mr-2" /> Join The Movement
                        </Badge>
                        <h1 className="font-headline text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-foreground dark:text-white mb-6">
                            Become a <span className="text-gold">mov33 Partner</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-poppins">
                            Whether you're an event organizer or social media influencer, we have a partnership opportunity for you.
                        </p>
                    </motion.div>
                </section>

                {/* Partner Type Selection */}
                <section className="container mx-auto px-4 max-w-5xl mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Organizer Card */}
                        <GlassCard
                            className={`p-8 cursor-pointer transition-all duration-300 ${selectedType === 'organizer' ? 'border-kenyan-green ring-2 ring-kenyan-green/20' : 'border-white/10 hover:border-kenyan-green/50'}`}
                            onClick={() => setSelectedType('organizer')}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-14 w-14 rounded-2xl bg-kenyan-green/10 flex items-center justify-center">
                                    <Calendar className="h-7 w-7 text-kenyan-green" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Event Organizer</h2>
                                    <p className="text-white/60 text-sm">Host and sell tickets to your events</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {organizerBenefits.map((benefit, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle className="h-5 w-5 text-kenyan-green shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-white font-bold text-sm">{benefit.title}</p>
                                            <p className="text-white/50 text-xs">{benefit.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button className="w-full mt-8 bg-kenyan-green hover:bg-kenyan-green/90 text-white font-black uppercase tracking-widest h-12 rounded-xl">
                                Apply as Organizer <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </GlassCard>

                        {/* Influencer Card */}
                        <GlassCard
                            className={`p-8 cursor-pointer transition-all duration-300 ${selectedType === 'influencer' ? 'border-gold ring-2 ring-gold/20' : 'border-white/10 hover:border-gold/50'}`}
                            onClick={() => setSelectedType('influencer')}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-14 w-14 rounded-2xl bg-gold/10 flex items-center justify-center">
                                    <Megaphone className="h-7 w-7 text-gold" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Influencer</h2>
                                    <p className="text-white/60 text-sm">Promote events and earn commissions</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {influencerBenefits.map((benefit, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-white font-bold text-sm">{benefit.title}</p>
                                            <p className="text-white/50 text-xs">{benefit.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button className="w-full mt-8 bg-gold hover:bg-gold/90 text-obsidian font-black uppercase tracking-widest h-12 rounded-xl">
                                Apply as Influencer <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </GlassCard>
                    </div>
                </section>

                {/* Application Form */}
                {selectedType && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="container mx-auto px-4 max-w-2xl"
                    >
                        <GlassCard className="p-8 md:p-12 border-white/10">
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">
                                {selectedType === 'organizer' ? 'Organizer Application' : 'Influencer Application'}
                            </h2>
                            <p className="text-white/60 text-sm mb-8">Fill in your details and we'll get back to you within 48 hours.</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-white/60 text-xs uppercase font-bold">Full Name *</Label>
                                        <Input
                                            required
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="bg-white/5 border-white/10 h-12"
                                            placeholder="John Kamau"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-white/60 text-xs uppercase font-bold">Email *</Label>
                                        <Input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="bg-white/5 border-white/10 h-12"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-white/60 text-xs uppercase font-bold">Phone Number *</Label>
                                        <Input
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="bg-white/5 border-white/10 h-12"
                                            placeholder="+254 700 000 000"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-white/60 text-xs uppercase font-bold">
                                            {selectedType === 'influencer' ? 'Instagram/TikTok Handle' : 'Company/Brand Name'}
                                        </Label>
                                        <Input
                                            value={formData.socialHandle}
                                            onChange={(e) => setFormData({ ...formData, socialHandle: e.target.value })}
                                            className="bg-white/5 border-white/10 h-12"
                                            placeholder={selectedType === 'influencer' ? '@yourhandle' : 'Your Company Ltd'}
                                        />
                                    </div>
                                </div>

                                {selectedType === 'influencer' && (
                                    <div className="space-y-2">
                                        <Label className="text-white/60 text-xs uppercase font-bold">Total Social Following</Label>
                                        <Input
                                            value={formData.followers}
                                            onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                                            className="bg-white/5 border-white/10 h-12"
                                            placeholder="e.g. 50,000"
                                        />
                                    </div>
                                )}

                                {selectedType === 'organizer' && (
                                    <div className="space-y-2">
                                        <Label className="text-white/60 text-xs uppercase font-bold">Event Experience</Label>
                                        <Input
                                            value={formData.experience}
                                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                            className="bg-white/5 border-white/10 h-12"
                                            placeholder="e.g. 2 years, 10+ events hosted"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label className="text-white/60 text-xs uppercase font-bold">Tell us about yourself</Label>
                                    <Textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="bg-white/5 border-white/10 min-h-[120px]"
                                        placeholder="Why do you want to partner with mov33? What kind of events/content do you create?"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className={`w-full h-14 rounded-xl font-black uppercase tracking-widest text-sm ${selectedType === 'organizer'
                                            ? 'bg-kenyan-green hover:bg-kenyan-green/90 text-white'
                                            : 'bg-gold hover:bg-gold/90 text-obsidian'
                                        }`}
                                >
                                    {submitting ? (
                                        <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Submitting...</>
                                    ) : (
                                        <><Send className="h-5 w-5 mr-2" /> Submit Application</>
                                    )}
                                </Button>
                            </form>
                        </GlassCard>
                    </motion.section>
                )}
            </div>
        </MainLayout>
    );
}
