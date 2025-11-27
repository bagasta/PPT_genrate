import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="relative w-24 h-24 mb-8">
                {/* Outer Ring */}
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>

                {/* Middle Ring */}
                <div className="absolute inset-4 border-4 border-secondary/20 rounded-full"></div>
                <div className="absolute inset-4 border-4 border-transparent border-b-secondary rounded-full animate-spin-reverse"></div>

                {/* Inner Core */}
                <div className="absolute inset-8 bg-accent/20 rounded-full animate-pulse"></div>
                <div className="absolute inset-10 bg-accent rounded-full animate-ping"></div>
            </div>

            <div className="space-y-2 text-center">
                <h3 className="text-xl font-display font-bold text-white tracking-widest animate-pulse">
                    {message}
                </h3>
                <div className="flex gap-1 justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-0"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                </div>
            </div>
        </div>
    );
};
