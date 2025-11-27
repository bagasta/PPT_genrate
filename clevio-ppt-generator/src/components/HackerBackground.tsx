import React, { useEffect, useRef } from 'react';

export const HackerBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

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

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const columns = Math.floor(canvas.width / 20);
        const drops: number[] = new Array(columns).fill(1);

        // Characters to display (Katakana + Latin + Numbers)
        const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        const draw = () => {
            // Semi-transparent black to create trail effect
            ctx.fillStyle = 'rgba(11, 12, 21, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = '15px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                const x = i * 20;
                const y = drops[i] * 20;

                // Interaction: Check distance to mouse
                const dist = Math.hypot(x - mouseRef.current.x, y - mouseRef.current.y);
                const isHovered = dist < 100;

                // Color logic
                if (isHovered) {
                    ctx.fillStyle = '#E0E6ED'; // White highlight near mouse
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = '#E0E6ED';
                } else if (Math.random() > 0.98) {
                    ctx.fillStyle = '#00F0FF'; // Occasional Cyan glitch
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = '#00F0FF';
                } else {
                    ctx.fillStyle = '#0F0'; // Classic Matrix Green (or Cyan based on theme?)
                    // Let's stick to our theme: Cyan/Purple
                    ctx.fillStyle = 'rgba(0, 240, 255, 0.3)'; // Dim Cyan
                    ctx.shadowBlur = 0;
                }

                ctx.fillText(text, x, y);

                // Reset drop or move it down
                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                // Interactive speed up
                if (isHovered) {
                    drops[i] += 2; // Fall faster near mouse
                } else {
                    drops[i]++;
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none opacity-40"
        />
    );
};
