import { ImageFile } from '../types';

export const fileToBase64 = (file: File): Promise<ImageFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const b64 = result.split(',')[1];
      if (b64) {
        resolve({
          b64: b64,
          mimeType: file.type,
        });
      } else {
        reject(new Error("Failed to convert file to base64."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
