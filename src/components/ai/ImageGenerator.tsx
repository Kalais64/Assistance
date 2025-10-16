import { useState } from 'react';
import { geminiImageService, GeneratedImage } from '@/lib/gemini-image';

interface ImageGeneratorProps {
  description: string;
  placeholderImage: string;
}

export default function ImageGenerator({ description, placeholderImage }: ImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    if (!description) return;
    
    setIsGenerating(true);
    setGeneratedImage(null);
    setError(null);
    
    try {
      const images: GeneratedImage[] = await geminiImageService.generateImages(description, {
        numberOfImages: 1,
        style: 'digital_art',
        aspectRatio: '16:9'
      });
      
      if (images.length > 0) {
        setGeneratedImage(images[0].url);
      } else {
        setError('Image generation failed. No image was returned.');
      }
    } catch (err) {
      console.error('Error generating image:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4 relative flex items-center justify-center">
        {isGenerating ? (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent align-[-0.125em]"></div>
          </div>
        ) : generatedImage ? (
          <img 
            src={generatedImage} 
            alt="Generated visualization" 
            className="w-full h-full object-contain"
          />
        ) : (
          <img 
            src={placeholderImage} 
            alt="Placeholder" 
            className="w-full h-full object-contain"
          />
        )}
      </div>
      
      <button
        onClick={handleGenerateImage}
        disabled={isGenerating || !description}
        className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
          isGenerating || !description
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {isGenerating ? 'Generating...' : 'Generate Image'}
      </button>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {description && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md w-full max-w-md">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Image Description:</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      )}
    </div>
  );
}
