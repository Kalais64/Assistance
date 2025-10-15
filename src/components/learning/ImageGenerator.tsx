import { useState } from 'react';

interface ImageGeneratorProps {
  description: string;
  placeholderImage: string;
}

export default function ImageGenerator({ description, placeholderImage }: ImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    if (!description) return;
    
    setIsGenerating(true);
    
    try {
      // In a real implementation, this would call an image generation API
      // For now, we'll simulate image generation with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Use the placeholder image for now
      // In a real implementation, this would be the generated image URL
      setGeneratedImage(placeholderImage);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
        {generatedImage ? (
          <img 
            src={generatedImage} 
            alt="Generated visualization" 
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center p-4">
              {description ? 'Click generate to create an image' : 'No description available'}
            </p>
          </div>
        )}
        {isGenerating && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent align-[-0.125em]"></div>
          </div>
        )}
      </div>
      
      <button
        onClick={handleGenerateImage}
        disabled={isGenerating || !description}
        className={`px-4 py-2 rounded-md text-white font-medium ${
          isGenerating || !description
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {isGenerating ? 'Generating...' : 'Generate Image'}
      </button>
      
      {description && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md w-full max-w-md">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Image Description:</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      )}
    </div>
  );
}