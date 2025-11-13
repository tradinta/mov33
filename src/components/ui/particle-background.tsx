
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const ParticleBackground: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particleColor, setParticleColor] = useState('hsl(14 78% 57%)'); // Default fallback

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Function to get and set the color from CSS variables
    const updateColor = () => {
      if (typeof window !== 'undefined') {
        const computedStyle = getComputedStyle(document.documentElement);
        const accentColorValue = computedStyle.getPropertyValue('--accent').trim();
        if (accentColorValue) {
          setParticleColor(`hsl(${accentColorValue})`);
        }
      }
    };

    updateColor(); // Initial color set

    let particles: Particle[] = [];
    const particleCount = 70;
    const maxDistance = 150;

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
      ctx.strokeStyle = particleColor;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
          
          if (distance < maxDistance) {
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
      ctx.fillStyle = particleColor;
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    // Observe theme changes to update color
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                updateColor();
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

  }, [particleColor]);

  return (
    <div className={cn('w-full h-full opacity-50', className)}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
