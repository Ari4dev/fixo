import React from 'react';
import { ImageFile } from '../types';
import { GenerationMode } from '../App';
import { LoadingSpinner, ImageIcon, DownloadIcon, ArrowUpOnSquareIcon } from './icons';

interface ImageDisplayProps {
  originalImage: ImageFile | null;
  generatedImage: string | null;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
  generationMode: GenerationMode;
  isUpscaled: boolean;
  prompt: string;
  onUpscale: () => void;
}

const ImageBox: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="relative">
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">{title}</div>
        {children}
    </div>
);

interface GeneratedImageOutputProps {
    isLoading: boolean;
    generatedImage: string | null;
    error: string | null;
    loadingMessage: string;
    isUpscaled: boolean;
    prompt: string;
    onUpscale: () => void;
}

const GeneratedImageOutput: React.FC<GeneratedImageOutputProps> = ({ isLoading, generatedImage, error, loadingMessage, isUpscaled, prompt, onUpscale }) => {
    return (
    <div className="w-full h-full aspect-square bg-slate-200 rounded-lg shadow-md flex justify-center items-center">
       {isLoading && (
          <div className="text-center text-slate-600">
              <LoadingSpinner className="w-10 h-10 mx-auto" />
              <p className="mt-3 font-semibold">{loadingMessage || 'Memproses...'}</p>
              <p className="text-sm">Bentar lagi kelar, santuy...</p>
          </div>
      )}
      {error && !isLoading && <p className="text-center text-red-600 p-4">{error}</p>}
      {generatedImage && !isLoading && (
          <div className="relative group w-full h-full">
              <img src={generatedImage} alt="Generated Headshot" className="w-full h-full object-cover rounded-lg" />
              {isUpscaled && (
                 <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full z-10 shadow-md">
                    4K Ditingkatkan ✨
                 </div>
              )}
              <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!isUpscaled && (
                     <button
                        onClick={onUpscale}
                        className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-slate-900 font-semibold px-4 py-2 rounded-lg hover:bg-white transition-all shadow-md"
                    >
                       <ArrowUpOnSquareIcon className="w-5 h-5"/>
                       <span>Tingkatkan</span>
                    </button>
                )}
                <a
                    href={generatedImage}
                    download="ai-generated-image.png"
                    className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-slate-900 font-semibold px-4 py-2 rounded-lg hover:bg-white transition-all shadow-md"
                >
                    <DownloadIcon className="w-5 h-5"/>
                    <span>Unduh</span>
                </a>
              </div>
          </div>
      )}
      {!isLoading && !generatedImage && !error && (
          <div className="text-center text-slate-500 p-4">
             <p>Gambarmu bakal nongol di sini.</p>
          </div>
      )}
   </div>
   );
};


export const ImageDisplay: React.FC<ImageDisplayProps> = ({ originalImage, generatedImage, isLoading, loadingMessage, error, generationMode, isUpscaled, prompt, onUpscale }) => {
  const originalImageUrl = originalImage ? `data:${originalImage.mimeType};base64,${originalImage.b64}` : null;

  if (generationMode === 'text-to-image') {
      return (
          <div className="bg-slate-100 rounded-xl p-4 min-h-[400px] lg:min-h-full flex flex-col justify-center items-center">
              {!generatedImage && !isLoading ? (
                   <div className="text-center text-slate-500">
                        <ImageIcon className="w-16 h-16 mx-auto text-slate-400" />
                        <p className="mt-4 font-semibold">Gambar buatan AI-mu bakal muncul di sini.</p>
                        <p className="text-sm">Ketik idemu, biar AI yang gambar.</p>
                   </div>
              ) : (
                  <GeneratedImageOutput 
                    isLoading={isLoading} 
                    generatedImage={generatedImage} 
                    error={error} 
                    loadingMessage={loadingMessage}
                    isUpscaled={isUpscaled}
                    prompt={prompt}
                    onUpscale={onUpscale}
                   />
              )}
          </div>
      );
  }

  // Default to image-to-image view
  return (
    <div className="bg-slate-100 rounded-xl p-4 min-h-[400px] lg:min-h-full flex flex-col justify-center items-center">
      {!originalImage && !isLoading ? (
        <div className="text-center text-slate-500">
          <ImageIcon className="w-16 h-16 mx-auto text-slate-400" />
          <p className="mt-4 font-semibold">Hasil fotomu bakal muncul di sini.</p>
          <p className="text-sm">Upload fotomu dulu buat mulai.</p>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageBox title="Original">
            {originalImageUrl && (
                <img src={originalImageUrl} alt="Original" className="w-full h-auto object-cover rounded-lg shadow-md" />
            )}
          </ImageBox>
          <ImageBox title="Generated">
             <GeneratedImageOutput 
                isLoading={isLoading} 
                generatedImage={generatedImage} 
                error={error} 
                loadingMessage={loadingMessage}
                isUpscaled={isUpscaled}
                prompt={prompt}
                onUpscale={onUpscale}
              />
          </ImageBox>
        </div>
      )}
    </div>
  );
};