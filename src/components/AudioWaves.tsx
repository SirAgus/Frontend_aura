import React, { useRef, useEffect } from 'react';

interface AudioWavesProps {
    isActive: boolean;
    theme?: string;
}

const AudioWaves: React.FC<AudioWavesProps> = ({ isActive, theme = 'dark' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);

    // Use intensity requested by user (0.25 when active, low when not)
    const intensity = isActive ? 0.25 : 0.02;

    // Configuración for waves provided by the user
    const waves = [
        {
            color: "rgba(56, 189, 248, 0.4)", // Cyan
            speed: 0.02,
            lobes: 3,
            amplitudeBase: 40,
        },
        {
            color: "rgba(192, 132, 252, 0.4)", // Purple
            speed: 0.03,
            lobes: 5,
            amplitudeBase: 50,
        },
        {
            color: "rgba(244, 114, 182, 0.4)", // Pink
            speed: 0.01,
            lobes: 4,
            amplitudeBase: 45,
        }
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = container.clientWidth;
        let height = container.clientHeight;
        let time = 0;

        const resizeCanvas = () => {
            if (!container || !canvas) return;
            width = container.clientWidth;
            height = container.clientHeight;
            const dpr = window.devicePixelRatio || 1;

            canvas.width = width * dpr;
            canvas.height = height * dpr;

            ctx.scale(dpr, dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
        }

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.globalCompositeOperation = 'screen';
            time += 0.8;

            const centerX = width / 2;
            const centerY = height / 2;
            const baseRadius = Math.min(width, height) * 0.28;

            waves.forEach((wave) => {
                ctx.beginPath();
                ctx.fillStyle = wave.color;

                const steps = 150;

                for (let j = 0; j <= steps; j++) {
                    const angle = (j / steps) * Math.PI * 2;

                    const waveOffset =
                        Math.sin(angle * wave.lobes + time * wave.speed) * (wave.amplitudeBase * intensity) +
                        Math.sin(angle * (wave.lobes * 1.5) - time * wave.speed * 1.2) * (wave.amplitudeBase * 0.4 * intensity);

                    const radius = baseRadius + waveOffset;

                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY + Math.sin(angle) * radius;

                    if (j === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }

                ctx.closePath();
                ctx.fill();

                ctx.lineWidth = 1;
                ctx.strokeStyle = wave.color.replace('0.4)', '0.6)');
                ctx.stroke();
            });

            // Central core glow
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius * 0.4);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${0.1 + intensity * 0.4})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.beginPath();
            ctx.arc(centerX, centerY, baseRadius * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            animationRef.current = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [intensity]);

    return (
        <div ref={containerRef} className="w-full h-full min-h-[300px] flex items-center justify-center relative overflow-hidden">
            <canvas ref={canvasRef} className="block pointer-events-none" />
        </div>
    );
};

export default AudioWaves;
