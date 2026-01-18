'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Music,
    MapPin,
    User,
    ChevronRight,
    Check,
    Sparkles,
    PartyPopper,
    Beer,
    Mic2,
    Palette,
    Moon
} from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { useAuth } from '@/context/auth-context';
import { useMarketingConfig } from '@/hooks/use-marketing-config';
import { cn } from '@/lib/utils';

const GENRES = [
    { id: 'techno', label: 'Techno', icon: <Music className="h-4 w-4" /> },
    { id: 'house', label: 'House', icon: <Music className="h-4 w-4" /> },
    { id: 'amapiano', label: 'Amapiano', icon: <Music className="h-4 w-4" /> },
    { id: 'hiphop', label: 'Hip Hop', icon: <Mic2 className="h-4 w-4" /> },
    { id: 'jazz', label: 'Jazz & Soul', icon: <Music className="h-4 w-4" /> },
    { id: 'art', label: 'Art & Culture', icon: <Palette className="h-4 w-4" /> },
];

const PERSONAS = [
    { id: 'raver', label: 'The Raver', desc: 'Up all night, front row.' },
    { id: 'socialite', label: 'The Socialite', desc: 'Networking & Cocktails.' },
    { id: 'explorer', label: 'The Explorer', desc: 'Hidden gems & Nature.' },
    { id: 'exclusive', label: 'The VIP', desc: 'Premium & Private.' },
];

const LOCATIONS = ['Nairobi', 'Mombasa', 'Diani', 'Naivasha', 'Watamu'];

export function VibeCheckWizard() {
    const { user, profile } = useAuth();
    const { config, loading: configLoading } = useMarketingConfig();
    const [step, setStep] = useState(1);
    const [isOpen, setIsOpen] = useState(false);

    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

    React.useEffect(() => {
        if (configLoading) return;
        if (config?.onboarding?.vibeCheckEnabled === false) return;

        if (user && profile && !profile.vibeCheckCompleted) {
            setIsOpen(true);
        }
    }, [user, profile, config, configLoading]);

    const handleToggle = (id: string, list: string[], setter: (val: string[]) => void) => {
        if (list.includes(id)) {
            setter(list.filter(i => i !== id));
        } else {
            setter([...list, id]);
        }
    };

    const handleFinish = async () => {
        if (!user) return;
        try {
            await updateDoc(doc(firestore, 'users', user.uid), {
                vibeCheckCompleted: true,
                preferredGenres: selectedGenres,
                preferredPersonas: selectedPersonas,
                preferredLocations: selectedLocations,
            });
            setIsOpen(false);
        } catch (error) {
            console.error("Error saving vibe check:", error);
        }
    };

    const nextStep = () => setStep(step + 1);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[600px] bg-obsidian border-white/10 text-white p-0 overflow-hidden">
                <div className="relative p-8 md:p-12">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
                        <motion.div
                            className="h-full bg-gold"
                            initial={{ width: 0 }}
                            animate={{ width: `${(step / 4) * 100}%` }}
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <div className="h-12 w-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                                        <Sparkles className="h-6 w-6" />
                                    </div>
                                    <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                                        The <span className="text-gold">Vibe Check</span>
                                    </h2>
                                    <p className="text-white/40 font-poppins text-sm leading-relaxed">
                                        Welcome to Mov33. To curate your discovery feed, we need to know what makes you move. Ready to customize your journey?
                                    </p>
                                </div>
                                <Button onClick={nextStep} className="w-full h-16 bg-gold text-obsidian font-black uppercase tracking-widest rounded-2xl">
                                    Start Curation
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">What sounds good?</h3>
                                    <p className="text-white/40 text-sm font-poppins">Select your favorite genres.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {GENRES.map(genre => (
                                        <button
                                            key={genre.id}
                                            onClick={() => handleToggle(genre.id, selectedGenres, setSelectedGenres)}
                                            className={cn(
                                                "flex items-center gap-3 p-4 rounded-2xl border transition-all text-left",
                                                selectedGenres.includes(genre.id)
                                                    ? "bg-gold border-gold text-obsidian font-bold"
                                                    : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                                            )}
                                        >
                                            {genre.icon}
                                            <span className="text-sm font-black uppercase tracking-tight">{genre.label}</span>
                                        </button>
                                    ))}
                                </div>
                                <Button onClick={nextStep} className="w-full h-14 bg-white text-obsidian font-black uppercase tracking-widest rounded-2xl" disabled={selectedGenres.length === 0}>
                                    Next: Your Persona
                                </Button>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">Who are you at 1 AM?</h3>
                                    <p className="text-white/40 text-sm font-poppins">Pick your experience style.</p>
                                </div>
                                <div className="space-y-4">
                                    {PERSONAS.map(persona => (
                                        <button
                                            key={persona.id}
                                            onClick={() => handleToggle(persona.id, selectedPersonas, setSelectedPersonas)}
                                            className={cn(
                                                "w-full flex items-center justify-between p-6 rounded-[2rem] border transition-all text-left",
                                                selectedPersonas.includes(persona.id)
                                                    ? "bg-kenyan-green border-kenyan-green text-white"
                                                    : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                                            )}
                                        >
                                            <div>
                                                <div className="text-lg font-black uppercase italic tracking-tight">{persona.label}</div>
                                                <div className="text-xs opacity-60 font-poppins">{persona.desc}</div>
                                            </div>
                                            {selectedPersonas.includes(persona.id) && <Check className="h-6 w-6" />}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-4">
                                    <Button onClick={() => setStep(2)} variant="ghost" className="h-14 font-black uppercase tracking-widest text-white/30 hover:text-white">Back</Button>
                                    <Button onClick={nextStep} className="flex-1 h-14 bg-white text-obsidian font-black uppercase tracking-widest rounded-2xl" disabled={selectedPersonas.length === 0}>
                                        Almost Done
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                <div className="text-center space-y-4">
                                    <div className="mx-auto h-24 w-24 rounded-[2rem] bg-kenyan-green/20 flex items-center justify-center text-kenyan-green">
                                        <PartyPopper className="h-12 w-12" />
                                    </div>
                                    <h3 className="text-4xl font-black uppercase italic tracking-tighter">Discovery Ready</h3>
                                    <p className="text-white/40 text-sm font-poppins">Your personalized feed is being generated based on your vibes.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-white/20 text-center">Summary</div>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {selectedGenres.map(g => <Badge key={g} className="bg-white/5 text-gold border-none font-black uppercase tracking-widest text-[8px] px-3">{g}</Badge>)}
                                        {selectedPersonas.map(p => <Badge key={p} className="bg-white/5 text-kenyan-green border-none font-black uppercase tracking-widest text-[8px] px-3">{p}</Badge>)}
                                    </div>
                                </div>

                                <Button onClick={handleFinish} className="w-full h-16 bg-gold text-obsidian font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-gold/20">
                                    Enter the Sanctuary
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
}
