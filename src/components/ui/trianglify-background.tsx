'use client';

import { useEffect, useRef } from 'react';
import trianglify from 'trianglify';

export function TrianglifyBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const generatePattern = () => {
        if (!ref.current || ref.current.clientWidth === 0 || ref.current.clientHeight === 0) {
            return;
        }
        
        // Get colors from CSS variables
        const style = getComputedStyle(document.documentElement);
        const primary = style.getPropertyValue('--primary').trim();
        const accent = style.getPropertyValue('--accent').trim();

        // Convert HSL strings to something Trianglify understands
        const hslToHex = (hsl: string) => {
            const [h, s, l] = hsl.split(' ').map(parseFloat);
            if (isNaN(h) || isNaN(s) || isNaN(l)) return '#000000'; // fallback
            
            const sNorm = s / 100;
            const lNorm = l / 100;
            const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
            const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
            const m = lNorm - c / 2;
            let r = 0, g = 0, b = 0;

            if (h >= 0 && h < 60) {
                r = c; g = x; b = 0;
            } else if (h >= 60 && h < 120) {
                r = x; g = c; b = 0;
            } else if (h >= 120 && h < 180) {
                r = 0; g = c; b = x;
            } else if (h >= 180 && h < 240) {
                r = 0; g = x; b = c;
            } else if (h >= 240 && h < 300) {
                r = x; g = 0; b = c;
            } else if (h >= 300 && h < 360) {
                r = c; g = 0; b = x;
            }

            const toHex = (val: number) => {
                const hex = Math.round((val + m) * 255).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            };

            return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        };

        const pattern = trianglify({
            width: ref.current.clientWidth,
            height: ref.current.clientHeight,
            cellSize: 90,
            variance: 0.75,
            xColors: [hslToHex(primary), hslToHex(accent)],
            yColors: 'match',
            colorSpace: 'lab',
            strokeWidth: 0,
            fill: true,
        });

        // Clear previous and append new SVG
        while (ref.current.firstChild) {
            ref.current.removeChild(ref.current.firstChild);
        }
        ref.current.appendChild(pattern.toSVG());
    }
    
    generatePattern();

    const resizeObserver = new ResizeObserver(generatePattern);
    resizeObserver.observe(ref.current);

    return () => {
        if(ref.current) {
            resizeObserver.unobserve(ref.current);
        }
    };
  }, []);

  return <div ref={ref} className="absolute inset-0 z-0" />;
}
