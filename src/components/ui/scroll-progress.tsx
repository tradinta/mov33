'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useMarketingConfig } from '@/hooks/use-marketing-config';

export function ScrollProgress() {
    const { config } = useMarketingConfig();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    if (config?.aesthetics?.scrollProgressEnabled === false) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gold z-[100] origin-left"
            style={{ scaleX }}
        />
    );
}
