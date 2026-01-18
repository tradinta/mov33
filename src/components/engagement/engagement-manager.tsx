'use client';

import dynamic from 'next/dynamic';

const ExitIntentPopup = dynamic(() => import('@/components/engagement/exit-intent-popup').then(m => m.ExitIntentPopup), { ssr: false });
const FomoBar = dynamic(() => import('@/components/engagement/fomo-bar').then(m => m.FomoBar), { ssr: false });
const VibeCheckWizard = dynamic(() => import('@/components/personalization/vibe-check-wizard').then(m => m.VibeCheckWizard), { ssr: false });
const ScrollProgress = dynamic(() => import('@/components/ui/scroll-progress').then(m => m.ScrollProgress), { ssr: false });
const CommandPalette = dynamic(() => import('@/components/navigation/command-palette').then(m => m.CommandPalette), { ssr: false });

export function EngagementManager() {
    return (
        <>
            <ScrollProgress />
            <CommandPalette />
            <FomoBar />
            <VibeCheckWizard />
            <ExitIntentPopup />
        </>
    );
}
