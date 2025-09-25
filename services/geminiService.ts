import { GoogleGenAI, Modality, Part } from "@google/genai";
import { ImageFile } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const editHeadshot = async (
  originalImage: ImageFile,
  prompt: string,
  referenceImage: ImageFile | null
): Promise<string> => {
    try {
        const parts: Part[] = [
            { text: prompt },
            {
                inlineData: {
                    data: originalImage.b64,
                    mimeType: originalImage.mimeType,
                },
            },
        ];

        if (referenceImage) {
            parts.push({
                inlineData: {
                    data: referenceImage.b64,
                    mimeType: referenceImage.mimeType,
                },
            });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        if (response.candidates && response.candidates.length > 0) {
            const candidate = response.candidates[0];
            for (const part of candidate.content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    const mimeType = part.inlineData.mimeType || 'image/png';
                    return `data:${mimeType};base64,${part.inlineData.data}`;
                }
            }
        }

        throw new Error("The AI model did not return a valid image. Please try again with a different prompt or image.");

    } catch (error) {
        console.error("Error calling Gemini API for image editing:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred during image editing.";
        throw new Error(message);
    }
};


export const generateImageFromText = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const image = response.generatedImages[0];
            if (image.image.imageBytes) {
                return `data:image/png;base64,${image.image.imageBytes}`;
            }
        }
        
        throw new Error("The AI model did not return a valid image. Please try again with a different prompt.");

    } catch (error) {
        console.error("Error calling Gemini API for text-to-image generation:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred during text-to-image generation.";
        throw new Error(message);
    }
};