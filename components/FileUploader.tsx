import React, { useRef } from 'react';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        onFileUpload(file);
      } else {
        alert("Please select an image file.");
      }
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div>
        <input
            type="file"
            ref={inputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
        />
        <button
            type="button"
            onClick={handleClick}
            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
        >
            Upload Foto
        </button>
    </div>
  );
};