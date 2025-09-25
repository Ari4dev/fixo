import React from 'react';
import { XIcon } from './icons';
import { quickPrompts } from './quickOptions';

interface MyGalleryProps {
    onClose: () => void;
}

// Group prompts by category for display
const groupedPrompts = quickPrompts.reduce((acc, prompt) => {
    const category = prompt.category || 'Lainnya'; // Fallback category
    if (!acc[category]) {
        acc[category] = [];
    }
    acc[category].push(prompt);
    return acc;
}, {} as Record<string, typeof quickPrompts>);

const categories = Object.keys(groupedPrompts);

export const MyGallery: React.FC<MyGalleryProps> = ({ onClose }) => {
    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4" 
            aria-labelledby="my-gallery-title" 
            role="dialog" 
            aria-modal="true"
        >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true"></div>

            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col">
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-200">
                    <h2 id="my-gallery-title" className="text-xl md:text-2xl font-bold text-slate-900">Contoh Style</h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Tutup galeri"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    {categories.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500">
                            <p>Tidak ada style yang tersedia saat ini.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {categories.map(category => (
                                <section key={category}>
                                    <h3 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">{category}</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {groupedPrompts[category].map(prompt => (
                                            <div key={prompt.name} className="group relative">
                                                <div className="aspect-square bg-slate-200 rounded-lg overflow-hidden shadow-sm">
                                                    <img 
                                                        src={prompt.imageUrl} 
                                                        alt={prompt.name} 
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end rounded-lg">
                                                    <p className="text-sm font-bold text-white line-clamp-2">{prompt.name}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};