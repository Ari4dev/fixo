import React from 'react';
import { GalleryIcon, LogoIcon } from './icons';

interface HeaderProps {
    onOpenInspirationGallery: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenInspirationGallery }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <LogoIcon className="h-8 w-8 text-blue-600" />
            <span>Fixora Studio</span>
          </div>
          <button 
            onClick={onOpenInspirationGallery}
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors px-4 py-2 rounded-lg"
          >
            <GalleryIcon className="w-5 h-5" />
            <span>Inspirasi Style</span>
          </button>
        </div>
      </nav>
    </header>
  );
};