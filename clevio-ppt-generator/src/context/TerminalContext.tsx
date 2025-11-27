import React, { createContext, useContext, useState, useCallback } from 'react';

export type LogType = 'info' | 'warning' | 'success' | 'error' | 'system';

export interface LogEntry {
    id: string;
    timestamp: string;
    message: string;
    type: LogType;
}

interface TerminalContextType {
    logs: LogEntry[];
    addLog: (message: string, type?: LogType) => void;
    clearLogs: () => void;
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

export const TerminalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [logs, setLogs] = useState<LogEntry[]>([]);

    const addLog = useCallback((message: string, type: LogType = 'info') => {
        const newLog: LogEntry = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
            message,
            type
        };
        setLogs(prev => [...prev.slice(-50), newLog]); // Keep last 50 logs
    }, []);

    const clearLogs = useCallback(() => {
        setLogs([]);
    }, []);

    return (
        <TerminalContext.Provider value={{ logs, addLog, clearLogs }}>
            {children}
        </TerminalContext.Provider>
    );
};

export const useTerminal = () => {
    const context = useContext(TerminalContext);
    if (context === undefined) {
        throw new Error('useTerminal must be used within a TerminalProvider');
    }
    return context;
};
