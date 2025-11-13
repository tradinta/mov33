
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

export const ParticleBackground: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [colors, setColors] = useState({
    accent: 'hsl(14 78% 57%)',
    primary: 'hsl(210 20% 15%)',
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Function to get and set the color from CSS variables
    const updateColors = () => {
      if (typeof window !== 'undefined') {
        const computedStyle = getComputedStyle(document.documentElement);
        const accentColorValue = computedStyle.getPropertyValue('--accent').trim();
        const primaryColorValue = computedStyle.getPropertyValue('--primary').trim();
        
        setColors({
            accent: `hsl(${accentColorValue})`,
            primary: `hsl(${primaryColorValue})`,
        });
      }
    };

    updateColors();

    let particles: Particle[] = [];
    const particleCount = 70;
    const maxDistance = 150;
    const availableColors = [colors.accent, colors.primary];

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          color: availableColors[Math.floor(Math.random() * availableColors.length)],
        });
      }
    };

    let animationFrameId: number;
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update particle positions
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      // Draw lines
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
          
          if (distance < maxDistance) {
            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            gradient.addColorStop(0, p1.color);
            gradient.addColorStop(1, p2.color);

            ctx.strokeStyle = gradient;
            ctx.globalAlpha = (1 - distance / maxDistance) * 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
       ctx.globalAlpha = 1;

      // Draw particles
      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0; // Reset shadow for other elements

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    // Observe theme changes to update color
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                updateColors();
            }
        });
    });

    observer.observe(document.documentElement, { attributes: true });


    window.addEventListener('resize', resizeCanvas);
    return () => {
        window.removeEventListener('resize', resizeCanvas);
        cancelAnimationFrame(animationFrameId);
        observer.disconnect();
    };

  }, [colors.accent, colors.primary]);

  return (
    <div className={cn('w-full h-full opacity-50', className)}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
