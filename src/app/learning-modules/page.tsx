'use client';

import { useState } from 'react';
import { generateTutorial, generateQuiz, generateVideoScript, generateImageDescription } from '@/lib/learning-modules';
import ImageGenerator from '@/components/learning/ImageGenerator';
import { BookOpenIcon, AcademicCapIcon, VideoCameraIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function LearningModulesContent() {
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('tutorial');
  
  const [tutorialContent, setTutorialContent] = useState('');
  const [quizData, setQuizData] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Video state
  const [videoScript, setVideoScript] = useState('');
  const [videoImageUrl, setVideoImageUrl] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  
  const handleGeneration = async () => {
    if (!topic || !grade) {
      setError('Please fill in both the topic and grade level.');
      return;
    }

    setIsLoading(true);
    setError('');
    setShowResults(false);

    try {
      // Generate content in parallel for better performance
      const [tutorialResponse, quizResponse, videoScriptResponse, imageDescResponse] = await Promise.all([
        generateTutorial(topic, grade),
        generateQuiz(topic, grade),
        generateVideoScript(topic, grade),
        generateImageDescription(topic, grade)
      ]);
      
      // Set the tutorial content
      setTutorialContent(tutorialResponse);
      
      // Set the quiz data
      setQuizData(quizResponse);
      
      // Set the video content
      setVideoScript(videoScriptResponse);
      setImageDescription(imageDescResponse);
      
      // For demo purposes, we'll use a placeholder image
      setVideoImageUrl('/file.svg');
      
      setShowResults(true);
      setCurrentQuestionIndex(0);
      setScore(0);
      
    } catch (error) {
      console.error('Generation failed:', error);
      setError('An error occurred during content generation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelection = (selectedOption: string, correctAnswer: string) => {
    setSelectedAnswer(selectedOption);
    const correct = selectedOption === correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }
    
    // Move to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < quizData.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        // Show final results when all questions are answered
        setShowResults(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowResults(false);
  };

  const renderTutorial = () => {
    if (!tutorialContent && !isLoading) {
      return (
        <div className="text-center py-10 bg-blue-50 rounded-lg">
          <BookOpenIcon className="h-16 w-16 mx-auto text-blue-500 mb-4" />
          <p className="text-gray-600">Generate a tutorial to see content here</p>
        </div>
      );
    }

    return (
      <div className="prose max-w-none">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md" dangerouslySetInnerHTML={{ __html: tutorialContent }} />
        )}
      </div>
    );
  };

  const renderQuiz = () => {
    if (quizData.length === 0 && !isLoading) {
      return (
        <div className="text-center py-10 bg-blue-50 rounded-lg">
          <AcademicCapIcon className="h-16 w-16 mx-auto text-blue-500 mb-4" />
          <p className="text-gray-600">Generate a quiz to test your knowledge</p>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (showResults && currentQuestionIndex === quizData.length - 1) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-2xl font-bold mb-4">Quiz Results</h3>
          <div className="text-5xl font-bold text-blue-600 mb-4">{score} / {quizData.length}</div>
          <p className="mb-6 text-gray-600">
            {score === quizData.length 
              ? 'Perfect score! Excellent work!' 
              : score > quizData.length / 2 
                ? 'Good job! Keep practicing to improve.' 
                : 'Keep studying and try again!'}
          </p>
          <button 
            onClick={resetQuiz} 
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    const currentQuestion = quizData[currentQuestionIndex];
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Question {currentQuestionIndex + 1} of {quizData.length}</span>
          <span className="text-sm font-medium text-blue-600">Score: {score}</span>
        </div>
        
        <h3 className="text-xl font-semibold mb-4">{currentQuestion.question}</h3>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => handleAnswerSelection(option, currentQuestion.answer)}
              disabled={selectedAnswer !== null}
              className={`w-full text-left p-3 rounded-md border transition-colors ${
                selectedAnswer === option
                  ? isCorrect
                    ? 'bg-green-100 border-green-500 text-green-800'
                    : 'bg-red-100 border-red-500 text-red-800'
                  : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        
        {selectedAnswer && (
          <div className={`mt-4 p-3 rounded-md ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isCorrect ? 'Correct!' : `Incorrect. The correct answer is: ${currentQuestion.answer}`}
          </div>
        )}
      </div>
    );
  };

  const renderVideo = () => {
    if (!videoScript && !isLoading) {
      return (
        <div className="text-center py-10 bg-blue-50 rounded-lg">
          <VideoCameraIcon className="h-16 w-16 mx-auto text-blue-500 mb-4" />
          <p className="text-gray-600">Generate a video script to see content here</p>
        </div>
      );
    }

    return (
      <div>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 bg-blue-100 flex items-center justify-center">
              {videoImageUrl ? (
                <img src={videoImageUrl} alt="Video thumbnail" className="w-full h-64 object-contain" />
              ) : (
                <VideoCameraIcon className="h-20 w-20 text-blue-500" />
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Video Script</h3>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{videoScript}</p>
              </div>
              <div className="mt-4">
                <ImageGenerator 
                    description={imageDescription} 
                    placeholderImage="/api/placeholder/400/300"
                  />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Learning Modules</h1>
        <p className="text-gray-600">Generate personalized learning content with AI</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
              Learning Topic
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Photosynthesis, World War II, Algebra"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
              Grade Level
            </label>
            <select
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select grade level</option>
              <option value="elementary">Elementary School</option>
              <option value="middle">Middle School</option>
              <option value="high">High School</option>
              <option value="college">College</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={handleGeneration}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-blue-300"
        >
          {isLoading ? 'Generating...' : 'Generate Learning Content'}
        </button>
        
        {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
      </div>

      {(tutorialContent || quizData.length > 0 || videoScript || isLoading) && (
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6">
              <button
                onClick={() => setActiveTab('tutorial')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tutorial'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Tutorial
                </div>
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'quiz'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <AcademicCapIcon className="h-5 w-5 mr-2" />
                  Quiz
                </div>
              </button>
              <button
                onClick={() => setActiveTab('video')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'video'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <VideoCameraIcon className="h-5 w-5 mr-2" />
                  Video
                </div>
              </button>
            </nav>
          </div>
          
          <div className="mt-6">
            {activeTab === 'tutorial' && renderTutorial()}
            {activeTab === 'quiz' && renderQuiz()}
            {activeTab === 'video' && renderVideo()}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LearningModulesPage() {
  return (
    <ProtectedRoute>
      <LearningModulesContent />
    </ProtectedRoute>
  );
}