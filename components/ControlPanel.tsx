import React, { useState, useRef, useEffect } from 'react';
import { ImageFile } from '../types';
import { FileUploader } from './FileUploader';
import { GenerationButton } from './GenerationButton';
import { UploadIcon, LoadingSpinner, WandIcon, PhotoIcon } from './icons';
import { quickPrompts } from './quickOptions';
import { GenerationMode } from '../App';

// --- PROPS INTERFACE ---
interface ControlPanelProps {
  onGenerateFromText: (prompt: string) => void;
  onGenerateFromImage: (prompt: string) => void;
  isLoading: boolean;
  originalImage: ImageFile | null;
  onOriginalImageUpload: (file: File) => void;
  onReset: () => void;
  generationMode: GenerationMode;
  setGenerationMode: (mode: GenerationMode) => void;
  initialPrompt: {name: string, prompt: string} | null;
  onPromptConsumed: () => void;
}

// --- DROPDOWN COMPONENT (REUSABLE) ---
interface QuickStyleDropdownProps {
  onSelect: (name: string, prompt: string) => void;
  selectedStyleName: string;
}

const QuickStyleDropdown: React.FC<QuickStyleDropdownProps> = ({ onSelect, selectedStyleName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (name: string, prompt: string) => {
    onSelect(name, prompt);
    setIsOpen(false);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-3 border border-slate-300 rounded-lg bg-white text-slate-700 flex justify-between items-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 truncate"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={!selectedStyleName ? 'text-slate-500' : ''}>
            {selectedStyleName || "Pilih dari style yang udah ada..."}
        </span>
        <svg className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full max-h-60 overflow-y-auto bg-white rounded-xl shadow-lg border border-slate-200 p-2" role="listbox">
          <div className="grid grid-cols-1 gap-2">
            {quickPrompts.map((option) => (
              <button key={option.name} type="button" onClick={() => handleSelect(option.name, option.prompt)} className="w-full text-left p-3 rounded-lg hover:bg-slate-100 transition-colors focus:bg-blue-50 focus:outline-none" role="option" aria-selected={selectedStyleName === option.name}>
                <p className="font-semibold text-slate-800">{option.name}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


// --- MODE-SPECIFIC COMPONENTS ---

const TextToImageStep: React.FC<{
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  onReset: () => void;
  initialPrompt: {name: string, prompt: string} | null;
  onPromptConsumed: () => void;
}> = ({ onGenerate, isLoading, onReset, initialPrompt, onPromptConsumed }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [selectedStyleName, setSelectedStyleName] = useState('');

  useEffect(() => {
    if (initialPrompt) {
        setPrompt(initialPrompt.prompt);
        setSelectedStyleName(initialPrompt.name);
        onPromptConsumed();
    }
  }, [initialPrompt, onPromptConsumed]);

  const handleQuickSelect = (name: string, promptValue: string) => {
    setPrompt(promptValue);
    setSelectedStyleName(name);
  };
  
  return (
    <div className="space-y-6 flex flex-col justify-between h-full">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Bikin Gambar dari Teks</h3>
          <p className="mt-1 text-slate-500">Deskripsiin gambar yang ada di kepalamu.</p>
        </div>
        <div className="space-y-4">
          <div>
              <label htmlFor="prompt-text" className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
              <textarea
                  id="prompt-text"
                  rows={4}
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                    if (selectedStyleName) {
                        setSelectedStyleName('');
                    }
                  }}
                  placeholder="Contoh: Astronot naik kuda di Mars, gaya fotorealistik."
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white text-slate-900 placeholder:text-slate-400"
              />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Cobain style kilat:</label>
            <QuickStyleDropdown onSelect={handleQuickSelect} selectedStyleName={selectedStyleName} />
          </div>
        </div>
      </div>
       <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
        <GenerationButton onClick={() => onGenerate(prompt)} isLoading={isLoading} disabled={isLoading || !prompt}/>
        <button onClick={onReset} className="text-sm font-semibold text-slate-600 hover:text-slate-900">Ulangi</button>
      </div>
    </div>
  );
};


const ImageToImageFlow: React.FC<{
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  originalImage: ImageFile | null;
  onOriginalImageUpload: (file: File) => void;
  onReset: () => void;
  initialPrompt: {name: string, prompt: string} | null;
  onPromptConsumed: () => void;
}> = (props) => {
  if (!props.originalImage) {
    return <UploadStep {...props} />;
  }
  return <StyleStep {...props} />;
};

const UploadStep: React.FC<{
  isLoading: boolean;
  onOriginalImageUpload: (file: File) => void;
}> = ({ isLoading, onOriginalImageUpload }) => (
  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-xl h-full min-h-[400px]">
    <div className="text-center">
      {isLoading ? (
        <>
          <LoadingSpinner className="w-12 h-12 text-blue-600 mx-auto" />
          <h3 className="mt-4 text-xl font-semibold text-slate-900">Mempersiapkan...</h3>
          <p className="mt-2 text-slate-500">Sebentar lagi.</p>
        </>
      ) : (
        <>
          <div className="mx-auto bg-blue-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
            <UploadIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-slate-900">Step 1: Upload Fotomu</h3>
          <p className="mt-2 text-slate-500">Pastiin fotonya jelas ya, biar hasilnya mantap.</p>
          <div className="mt-6">
            <FileUploader onFileUpload={onOriginalImageUpload} />
          </div>
        </>
      )}
    </div>
  </div>
);

const StyleStep: React.FC<{
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  onReset: () => void;
  initialPrompt: {name: string, prompt: string} | null;
  onPromptConsumed: () => void;
}> = ({ onGenerate, isLoading, onReset, initialPrompt, onPromptConsumed }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [selectedStyleName, setSelectedStyleName] = useState('');

  useEffect(() => {
    if (initialPrompt) {
        setPrompt(initialPrompt.prompt);
        setSelectedStyleName(initialPrompt.name);
        onPromptConsumed();
    }
  }, [initialPrompt, onPromptConsumed]);

  const handleQuickSelect = (name: string, promptValue: string) => {
    setPrompt(promptValue);
    setSelectedStyleName(name);
  };

  const handleGenerateClick = () => {
    const fullPrompt = `Ubah foto ini sesuai gaya berikut: "${prompt}". Pastikan fitur wajah orang di foto asli tetap dipertahankan.`;
    onGenerate(fullPrompt);
  };

  return (
    <div className="space-y-6 flex flex-col justify-between h-full">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Step 2: Pilih Stylenya</h3>
          <p className="mt-1 text-slate-500">Tulis mau baju & background apa, atau pilih dari saran di bawah.</p>
        </div>
        <div className="space-y-4">
          <div>
              <label htmlFor="prompt-style" className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Gaya</label>
              <textarea
                  id="prompt-style"
                  rows={3}
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value)
                    if (selectedStyleName) {
                        setSelectedStyleName('');
                    }
                  }}
                  placeholder="Contoh: jas biru dongker, kemeja putih, background kantor modern."
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white text-slate-900 placeholder:text-slate-400"
              />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Cobain style kilat:</label>
            <QuickStyleDropdown onSelect={handleQuickSelect} selectedStyleName={selectedStyleName} />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
        <GenerationButton onClick={handleGenerateClick} isLoading={isLoading} disabled={isLoading || !prompt}/>
        <button onClick={onReset} className="text-sm font-semibold text-slate-600 hover:text-slate-900">Ulangi</button>
      </div>
    </div>
  );
};


// --- MAIN EXPORTED COMPONENT ---
export const ControlPanel: React.FC<ControlPanelProps> = ({
  generationMode,
  setGenerationMode,
  onGenerateFromText,
  onGenerateFromImage,
  initialPrompt,
  onPromptConsumed,
  ...props
}) => {
  const ModeButton: React.FC<{
    mode: GenerationMode;
    label: string;
    icon: React.ReactNode;
  }> = ({ mode, label, icon }) => (
    <button
      onClick={() => {
        setGenerationMode(mode);
        props.onReset();
      }}
      className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg text-sm font-semibold transition-colors ${
        generationMode === mode
          ? 'bg-blue-600 text-white shadow'
          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-slate-100 rounded-xl p-6">
      <div className="mb-6">
        <div className="mb-2">
          <label className="block text-sm font-medium text-slate-700">Pilih Mode</label>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-xl">
          <ModeButton mode="image-to-image" label="Edit Fotoku" icon={<PhotoIcon className="w-5 h-5" />} />
          <ModeButton mode="text-to-image" label="Bikin dari Teks" icon={<WandIcon className="w-5 h-5" />} />
        </div>
      </div>

      <div className="flex-grow">
        {generationMode === 'image-to-image' ? (
          <ImageToImageFlow
            onGenerate={onGenerateFromImage}
            initialPrompt={initialPrompt}
            onPromptConsumed={onPromptConsumed}
            {...props}
          />
        ) : (
          <TextToImageStep
            onGenerate={onGenerateFromText}
            isLoading={props.isLoading}
            onReset={props.onReset}
            initialPrompt={initialPrompt}
            onPromptConsumed={onPromptConsumed}
          />
        )}
      </div>
    </div>
  );
};