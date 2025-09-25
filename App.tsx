import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { ImageDisplay } from './components/ImageDisplay';
import { editHeadshot, generateImageFromText } from './services/geminiService';
import { ImageFile } from './types';
import { fileToBase64 } from './utils/fileUtils';
import { InspirationGallery } from './components/InspirationGallery';
import { seedInspirationStyles } from './services/seedFirestore';

export type GenerationMode = 'image-to-image' | 'text-to-image';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpscaled, setIsUpscaled] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [generationMode, setGenerationMode] = useState<GenerationMode>('image-to-image');
  const [isInspirationGalleryOpen, setIsInspirationGalleryOpen] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState<{name: string, prompt: string} | null>(null);
  const [lastUsedPrompt, setLastUsedPrompt] = useState<string>('');
  const [isSeeding, setIsSeeding] = useState<boolean>(false);
  const [seedMessage, setSeedMessage] = useState<string>('');


  const handleOriginalImageUpload = async (file: File) => {
    setGeneratedImage(null);
    setError(null);
    setIsLoading(true);
    setLoadingMessage('Preparing image...');
    
    try {
      const imageFile = await fileToBase64(file);
      setOriginalImage(imageFile);
    } catch (err) {
       console.error(err);
       setError("Could not process the uploaded file. Please try another one.");
       setOriginalImage(null); 
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleEditGeneration = useCallback(async (prompt: string) => {
    if (!originalImage) {
      setError("Please upload an original photo first.");
      return;
    }

    setIsLoading(true);
    setLastUsedPrompt(prompt);
    setLoadingMessage('AI lagi nge-glow up fotomu...');
    setError(null);
    setGeneratedImage(null);
    setIsUpscaled(false);

    try {
      const result = await editHeadshot(originalImage, prompt, null);
      setGeneratedImage(result);
    } catch (err) {
      console.error("Error details:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. See the console for details.';
      setError(`Failed to generate headshot: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [originalImage]);

  const handleTextGeneration = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setLastUsedPrompt(prompt);
    setLoadingMessage('Lagi nge-create dari imajinasimu...');
    setError(null);
    setOriginalImage(null);
    setGeneratedImage(null);
    setIsUpscaled(false);

    try {
      const result = await generateImageFromText(prompt);
      setGeneratedImage(result);
    } catch (err) {
      console.error("Error details:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. See the console for details.';
      setError(`Failed to generate image: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, []);

  const handleUpscale = useCallback(async () => {
    if (!generatedImage) {
      setError("No image to upscale.");
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Meningkatkan ke 4K...');
    setError(null);

    try {
      const base64Data = generatedImage.split(',')[1];
      const mimeType = generatedImage.match(/data:(.*);base64,/)?.[1] || 'image/png';
      const imageToUpscale: ImageFile = { b64: base64Data, mimeType };
      const upscalePrompt = "Upscale this image to 4K resolution, enhancing details and photorealism, while preserving the original style and subject.";
      
      const finalResult = await editHeadshot(imageToUpscale, upscalePrompt, null);
      setGeneratedImage(finalResult);
      setIsUpscaled(true);

    } catch (err) {
      console.error("Error details:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. See the console for details.';
      setError(`Failed to upscale image: ${errorMessage}`);
      // If upscale fails, we are no longer in an "upscaled" state
      setIsUpscaled(false); 
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [generatedImage]);

  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setError(null);
    setIsLoading(false);
    setIsUpscaled(false);
    setLoadingMessage('');
    setLastUsedPrompt('');
  };

  const handleStyleSelect = (name: string, prompt: string) => {
    setInitialPrompt({ name, prompt });
    setIsInspirationGalleryOpen(false);
  };

  const handlePromptConsumed = () => {
    setInitialPrompt(null);
  };

  const handleSeedDatabase = async () => {
    if (!window.confirm("Yakin mau memasukkan data contoh ke Firestore? Ini hanya perlu dilakukan sekali.")) {
      return;
    }
    setIsSeeding(true);
    setSeedMessage('Menambahkan data sample ke Firestore...');
    try {
      const message = await seedInspirationStyles();
      setSeedMessage(message);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setSeedMessage(`Error: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsSeeding(false);
    }
  };


  return (
    <div className="min-h-screen text-slate-800 font-sans">
      <Header onOpenInspirationGallery={() => setIsInspirationGalleryOpen(true)} />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Sulap Fotomu Jadi Estetik.</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Gak pake lama, gak pake ribet. AI bikin fotomu auto-glowing.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ControlPanel
              onGenerateFromText={handleTextGeneration}
              onGenerateFromImage={handleEditGeneration}
              isLoading={isLoading}
              originalImage={originalImage}
              onOriginalImageUpload={handleOriginalImageUpload}
              onReset={handleReset}
              generationMode={generationMode}
              setGenerationMode={setGenerationMode}
              initialPrompt={initialPrompt}
              onPromptConsumed={handlePromptConsumed}
            />
            <ImageDisplay
              originalImage={originalImage}
              generatedImage={generatedImage}
              isLoading={isLoading}
              loadingMessage={loadingMessage}
              error={error}
              generationMode={generationMode}
              isUpscaled={isUpscaled}
              prompt={lastUsedPrompt}
              onUpscale={handleUpscale}
            />
          </div>
        </div>
      </main>
      <footer className="text-center py-6 mt-12 text-slate-500">
        <p>Fixora Studio. All rights reserved.</p>

        {/* --- Temporary Seeding Tool --- */}
        <div className="mt-4 border-t pt-4 max-w-md mx-auto">
          <p className="text-xs text-slate-400 mb-2">Alat untuk Developer</p>
          <button 
            onClick={handleSeedDatabase} 
            disabled={isSeeding} 
            className="bg-slate-200 text-slate-600 hover:bg-slate-300 disabled:bg-slate-100 disabled:cursor-wait text-xs font-semibold px-3 py-2 rounded-md transition-colors"
          >
            {isSeeding ? 'Lagi proses...' : 'Masukkan Contoh Style ke Firestore'}
          </button>
          {seedMessage && <p className="text-xs mt-2 text-slate-500">{seedMessage}</p>}
           <p className="text-xs mt-2 text-slate-400">Tombol ini untuk mengisi database Anda dengan contoh style. Klik sekali saja. Setelah selesai, Anda bisa hapus kode untuk tombol ini dari file `App.tsx`.</p>
        </div>
        {/* --- End of Seeding Tool --- */}
      </footer>

      {isInspirationGalleryOpen && (
        <InspirationGallery
          onClose={() => setIsInspirationGalleryOpen(false)}
          onSelect={handleStyleSelect}
        />
      )}
    </div>
  );
};

export default App;