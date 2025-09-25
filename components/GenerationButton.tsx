import React from 'react';
import { LoadingSpinner, SparklesIcon } from './icons';

interface GenerationButtonProps {
    onClick: () => void;
    isLoading: boolean;
    disabled: boolean;
}

export const GenerationButton: React.FC<GenerationButtonProps> = ({ onClick, isLoading, disabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-sm disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
            {isLoading ? (
                <>
                    <LoadingSpinner className="w-5 h-5"/>
                    <span>Lagi proses...</span>
                </>
            ) : (
                <>
                    <SparklesIcon className="w-5 h-5"/>
                    <span>Gas Bikin!</span>
                </>
            )}
        </button>
    );
};