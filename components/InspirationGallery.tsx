import React, { useState, useEffect } from 'react';
import { XIcon, LoadingSpinner } from './icons';
import { getInspirationStyles, InspirationStyle } from '../services/firestoreService';

interface InspirationGalleryProps {
    onClose: () => void;
    onSelect: (name: string, prompt: string) => void;
}

// Helper to group styles by category
const groupStylesByCategory = (styles: InspirationStyle[]) => {
    return styles.reduce((acc, style) => {
        const category = style.category || 'Lainnya';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(style);
        return acc;
    }, {} as Record<string, InspirationStyle[]>);
};

export const InspirationGallery: React.FC<InspirationGalleryProps> = ({ onClose, onSelect }) => {
    const [groupedStyles, setGroupedStyles] = useState<Record<string, InspirationStyle[]>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStyles = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const styles = await getInspirationStyles();
                const grouped = groupStylesByCategory(styles);
                setGroupedStyles(grouped);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Terjadi kesalahan yang tidak diketahui.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchStyles();
    }, []);

    const categories = Object.keys(groupedStyles);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <LoadingSpinner className="w-10 h-10" />
                    <p className="mt-4">Memuat galeri inspirasi...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center text-red-500 p-6">
                    <h3 className="font-semibold">Oops! Terjadi Kesalahan</h3>
                    <p className="mt-2 text-sm">{error}</p>
                </div>
            );
        }

        if (categories.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <p>Tidak ada style yang tersedia saat ini.</p>
                </div>
            );
        }

        return (
             <div className="space-y-8">
                {categories.map(category => (
                    <section key={category}>
                        <h3 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">{category}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {groupedStyles[category].map(style => (
                                <button
                                    key={style.id}
                                    className="group relative text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg overflow-hidden shadow-sm"
                                    onClick={() => onSelect(style.name, style.prompt)}
                                >
                                    <img
                                        src={style.imageUrl}
                                        alt={style.name}
                                        className="w-full h-full object-cover aspect-square transition-transform duration-300 ease-in-out group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-12">
                                        <h3 className="text-sm font-semibold text-white truncate">{style.name}</h3>
                                    </div>
                                    <div className="absolute inset-0 bg-black/75 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out flex items-center justify-center">
                                        <p className="text-center text-xs text-white/90 leading-snug line-clamp-6">
                                            {style.prompt}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        );
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4" 
            aria-labelledby="inspiration-gallery-title" 
            role="dialog" 
            aria-modal="true"
        >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true"></div>

            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col">
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-200">
                    <h2 id="inspiration-gallery-title" className="text-xl md:text-2xl font-bold text-slate-900">Galeri Inspirasi Style</h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Tutup galeri"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};
