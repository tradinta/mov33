'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Sparkles, Send, Bot, RefreshCcw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

export function AIAssistant() {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [suggestion, setSuggestion] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        // Simulate AI generation
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSuggestion("Experience the ultimate fusion of urban beats and coastal vibes at 'Oceanic Rhythms'. Join us for a night where the Indian Ocean meets high-energy performances. Secure your spot for the most anticipated beach festival of the year! #MombasaNights #OceanicRhythms");
        setIsGenerating(false);
    };

    const copyToClipboard = () => {
        if (!suggestion) return;
        navigator.clipboard.writeText(suggestion);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <GlassCard className="border-gold/20 bg-gold/[0.02] p-8 overflow-hidden relative">
            <div className="absolute -top-12 -right-12 h-40 w-40 bg-gold/10 blur-3xl rounded-full" />

            <div className="flex items-center gap-3 mb-6 relative">
                <div className="h-10 w-10 rounded-xl bg-gold/20 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-gold" />
                </div>
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter">AI Event Copilot</h3>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Powered by Mov33 Intelligence</p>
                </div>
            </div>

            <div className="space-y-6 relative">
                <div className="relative">
                    <Input
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe your event (e.g., Beach party in Mombasa with local DJs)..."
                        className="bg-white/5 border-white/10 h-14 rounded-2xl pr-32 focus:border-gold/50 font-poppins text-sm"
                    />
                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt}
                        className="absolute right-2 top-2 bottom-2 bg-gold hover:bg-gold/90 text-obsidian font-bold rounded-xl px-4"
                    >
                        {isGenerating ? <RefreshCcw className="h-4 w-4 animate-spin" /> : 'Optimize'}
                    </Button>
                </div>

                <AnimatePresence>
                    {suggestion && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="bg-white/5 border border-white/5 p-6 rounded-2xl relative group">
                                <Bot className="absolute -top-3 -left-3 h-8 w-8 text-gold bg-obsidian rounded-lg p-1.5 border border-gold/20 shadow-xl" />
                                <p className="text-sm leading-relaxed text-white/90 font-poppins italic">
                                    "{suggestion}"
                                </p>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={copyToClipboard}
                                    className="absolute top-2 right-2 text-muted-foreground hover:text-gold"
                                >
                                    {copied ? <Check className="h-4 w-4 text-kenyan-green" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full uppercase font-bold text-muted-foreground">SEO Optimized</span>
                                <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full uppercase font-bold text-muted-foreground">Sales Driven</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </GlassCard>
    );
}
