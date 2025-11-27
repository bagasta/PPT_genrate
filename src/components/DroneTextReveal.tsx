import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DroneTextRevealProps {
    text: string;
    className?: string;
    delay?: number;
}

export const DroneTextReveal: React.FC<DroneTextRevealProps> = ({ text, className = '', delay = 0 }) => {
    const letters = Array.from(text);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsComplete(true);
        }, (letters.length * 100) + 1000 + (delay * 1000));
        return () => clearTimeout(timer);
    }, [letters.length, delay]);

    return (
        <div className={`relative inline-block ${className}`}>
            {letters.map((letter, index) => (
                <Letter
                    key={index}
                    letter={letter}
                    index={index}
                    delay={delay}
                    isComplete={isComplete}
                />
            ))}
        </div>
    );
};

const Letter = ({ letter, index, delay, isComplete }: { letter: string, index: number, delay: number, isComplete: boolean }) => {
    // Random start position for the drone
    const startX = (Math.random() - 0.5) * 500;
    const startY = (Math.random() - 0.5) * 500;

    return (
        <span className="relative inline-block min-w-[0.3em] whitespace-pre">
            {/* The actual letter (hidden initially) */}
            <motion.span
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{
                    opacity: 1,
                    filter: 'blur(0px)',
                    color: ['#00F0FF', '#E0E6ED'] // Flash cyan then settle to white
                }}
                transition={{
                    duration: 0.2,
                    delay: delay + (index * 0.1) + 0.5, // Wait for drone to arrive
                    ease: "easeOut"
                }}
                className="relative z-10"
            >
                {letter}
            </motion.span>

            {/* The Drone Particle */}
            <AnimatePresence>
                {!isComplete && (
                    <motion.div
                        initial={{
                            x: startX,
                            y: startY,
                            opacity: 0,
                            scale: 0
                        }}
                        animate={{
                            x: [startX, 0], // Move to center (0,0 relative to span)
                            y: [startY, 0],
                            opacity: [0, 1, 1, 0], // Fade in, stay, fade out
                            scale: [0, 1.5, 0.5]
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: delay + (index * 0.1),
                            times: [0, 0.8, 0.9, 1],
                            ease: "circOut"
                        }}
                        className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_#00F0FF] z-20 pointer-events-none"
                    >
                        {/* Drone Trail */}
                        <motion.div
                            className="absolute inset-0 bg-secondary rounded-full blur-sm"
                            animate={{ scale: [1, 2, 0], opacity: [0.5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.2 }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Impact Flash */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 3] }}
                transition={{
                    duration: 0.3,
                    delay: delay + (index * 0.1) + 0.5,
                    times: [0, 0.1, 1]
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-md z-30 pointer-events-none"
            />
        </span>
    );
};
