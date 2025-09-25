import React from 'react';
import { XIcon } from './icons';

interface StyleGalleryProps {
    prompts: {
        name: string;
        prompt: string;
        imageUrl: string;
    }[];
    onClose: () => void;
    onSelect: (name: string, prompt: string) => void;
}

export const StyleGallery: React.FC<StyleGalleryProps> = ({ prompts, onClose, onSelect }) => {
    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4" 
            aria-labelledby="style-gallery-title" 
            role="dialog" 
            aria-modal="true"
        >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true"></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-200">
                    <h2 id="style-gallery-title" className="text-xl md:text-2xl font-bold text-slate-900">Galeri Style</h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Tutup galeri"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {prompts.map((prompt) => (
                            <button 
                                key={prompt.name} 
                                className="group text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
                                onClick={() => onSelect(prompt.name, prompt.prompt)}
                            >
                                <div className="aspect-square bg-slate-200 rounded-lg overflow-hidden transition-transform group-hover:scale-105 group-hover:shadow-lg">
                                    <img 
                                        src={prompt.imageUrl} 
                                        alt={prompt.name} 
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <h3 className="mt-2 text-sm font-semibold text-slate-800 text-center truncate group-hover:text-blue-600 transition-colors">{prompt.name}</h3>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};