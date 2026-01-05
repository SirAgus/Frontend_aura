'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    size: number;
    color: string;
}

interface CursorTrailProps {
    theme: 'light' | 'dark';
}

const CursorTrail: React.FC<CursorTrailProps> = ({ theme }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);
    const mouse = useRef({ x: 0, y: 0 });
    const isActive = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY };
            isActive.current = true;

            // Add particles on move for a denser trail
            for (let i = 0; i < 3; i++) {
                addParticle(e.clientX, e.clientY);
            }
        };

        const addParticle = (x: number, y: number) => {
            const color = theme === 'light'
                ? `rgba(0, 0, 0, ${Math.random() * 0.5 + 0.2})`
                : `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;

            particles.current.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                life: 1.0,
                size: Math.random() * 5 + 2,
                color,
            });
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Add a standardized particle if mouse is moving (or just constantly to show presence)
            // Actually, relying on mouse move is better for performance.

            // Update and draw particles
            for (let i = 0; i < particles.current.length; i++) {
                const p = particles.current[i];

                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.02; // Fade out speed
                p.size *= 0.95; // Shrink speed

                if (p.life <= 0) {
                    particles.current.splice(i, 1);
                    i--;
                    continue;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();

                // Connect particles with lines if they are close (optional, adds "web" effect)
                // For a simple trail, maybe not needed. Let's keep it simple circles for now, 
                // effectively a dust trail.
            }

            // Draw a "glow" at cursor position
            if (isActive.current) {
                const gradient = ctx.createRadialGradient(mouse.current.x, mouse.current.y, 0, mouse.current.x, mouse.current.y, 80);
                gradient.addColorStop(0, theme === 'light' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)');
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(mouse.current.x, mouse.current.y, 80, 0, Math.PI * 2);
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);

        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]);

    // Use mix-blend-mode to make it look interesting over different backgrounds
    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[9999]"
            style={{
                mixBlendMode: theme === 'light' ? 'multiply' : 'screen'
            }}
        />
    );
};

export default CursorTrail;
