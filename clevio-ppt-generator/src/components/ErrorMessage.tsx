import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
    return (
        <div className="flex flex-col items-center justify-center p-6 text-center bg-red-50 rounded-lg border border-red-100">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">Terjadi Kesalahan</h3>
            <p className="text-red-600 mb-4 max-w-md">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Coba Lagi
                </button>
            )}
        </div>
    );
};
