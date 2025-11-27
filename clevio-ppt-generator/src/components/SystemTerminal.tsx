import React, { useEffect, useRef, useState } from 'react';
import { useTerminal, type LogType } from '../context/TerminalContext';
import { Terminal, Minimize2, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SystemTerminal: React.FC = () => {
    const { logs, addLog } = useTerminal();
    const bottomRef = useRef<HTMLDivElement>(null);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    // Auto-scroll to bottom
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs, isMinimized]);

    // Initial Boot Sequence
    useEffect(() => {
        const bootSequence = [
            { msg: 'Initializing Clevio Kernel v2.0.77...', type: 'system', delay: 500 },
            { msg: 'Loading Neural Modules...', type: 'info', delay: 1200 },
            { msg: 'Bypassing Proxy Server...', type: 'warning', delay: 2000 },
            { msg: 'Connection Established: Secure', type: 'success', delay: 2800 },
            { msg: 'System Online. Awaiting Input.', type: 'system', delay: 3500 },
        ];

        bootSequence.forEach(({ msg, type, delay }) => {
            setTimeout(() => addLog(msg, type as LogType), delay);
        });
    }, [addLog]);

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className={`fixed bottom-4 right-4 z-50 w-full max-w-md bg-surface/90 backdrop-blur-md border border-primary/30 rounded-lg shadow-[0_0_30px_rgba(0,240,255,0.1)] overflow-hidden transition-all duration-300 ${isMinimized ? 'h-10' : 'h-80'}`}
        >
            {/* Header Bar */}
            <div className="h-10 bg-surface border-b border-primary/20 flex items-center justify-between px-3 cursor-move select-none">
                <div className="flex items-center gap-2 text-primary/80">
                    <Terminal className="w-4 h-4" />
                    <span className="text-xs font-mono font-bold tracking-wider">SYSTEM_LOGS</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1 hover:bg-primary/10 rounded text-primary/60 hover:text-primary transition-colors"
                    >
                        {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-1 hover:bg-accent/10 rounded text-accent/60 hover:text-accent transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Terminal Content */}
            <div className="p-4 h-[calc(100%-2.5rem)] overflow-y-auto font-mono text-xs space-y-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/20">
                <AnimatePresence initial={false}>
                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-2"
                        >
                            <span className="text-text/30 select-none">[{log.timestamp}]</span>
                            <span className={`${log.type === 'error' ? 'text-accent' :
                                log.type === 'warning' ? 'text-yellow-400' :
                                    log.type === 'success' ? 'text-green-400' :
                                        log.type === 'system' ? 'text-primary font-bold' :
                                            'text-text/80'
                                }`}>
                                {log.type === 'system' && '> '}
                                {log.message}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={bottomRef} />

                {/* Blinking Cursor */}
                {!isMinimized && (
                    <div className="flex gap-2 mt-2">
                        <span className="text-primary animate-pulse">_</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
