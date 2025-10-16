'use client';

import { useState, useEffect } from 'react';
import { generateTutorial, generateQuiz, generateVideoScript, generateImageDescription } from '@/lib/learning-modules';
import ImageGenerator from '@/components/learning/ImageGenerator';
import { BookOpenIcon, AcademicCapIcon, VideoCameraIcon, DocumentTextIcon, ArchiveBoxIcon, FilmIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { learningModulesService, FirebaseLearningModule } from '@/lib/firestore';
import { useNotifications } from '@/hooks/useNotifications';
// Hapus impor langsung ke huggingface-video
// import { generateVideoFromHuggingFace } from '@/lib/huggingface-video';

function LearningModulesContent() {
  const { currentUser: user } = useAuth();
  const { showSuccess, showError, showInfo } = useNotifications();

  // State untuk input
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('tutorial');

  // State untuk konten yang ditampilkan
  const [currentModule, setCurrentModule] = useState<Partial<FirebaseLearningModule> | null>(null);
  const [quizData, setQuizData] = useState<any[]>([]);
  
  // State untuk kuis
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // State untuk modul yang disimpan
  const [savedModules, setSavedModules] = useState<FirebaseLearningModule[]>([]);

  // State baru untuk generasi video
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [videoGenerationError, setVideoGenerationError] = useState('');

  // Memuat modul yang disimpan dari Firestore
  useEffect(() => {
    if (user) {
      const unsubscribe = learningModulesService.subscribeToLearningModules(user.uid, (modules) => {
        setSavedModules(modules);
      });
      return () => unsubscribe();
    }
  }, [user]);

  // Fungsi untuk memuat konten dari modul yang dipilih
  const loadModule = (module: Partial<FirebaseLearningModule>) => {
    setCurrentModule(module);
    try {
      if (module.quizData) {
        setQuizData(JSON.parse(module.quizData));
      } else {
        setQuizData([]);
      }
    } catch (e) {
      console.error("Failed to parse quiz data:", e);
      setQuizData([]);
    }
    setActiveTab('tutorial');
    resetQuiz();
    setShowResults(false);
  };
  
  const handleGeneration = async () => {
    if (!topic || !grade) {
      setError('Please fill in both the topic and grade level.');
      return;
    }

    setIsLoading(true);
    setError('');
    setCurrentModule(null);
    setQuizData([]);

    try {
      const [tutorialResponse, quizResponse, videoScriptResponse, imageDescResponse] = await Promise.all([
        generateTutorial(topic, grade),
        generateQuiz(topic, grade),
        generateVideoScript(topic, grade),
        generateImageDescription(topic, grade)
      ]);
      
      const newModuleData = {
        topic,
        grade,
        tutorialContent: tutorialResponse,
        quizData: JSON.stringify(quizResponse), // Simpan sebagai string
        videoScript: videoScriptResponse,
        imageDescription: imageDescResponse,
      };

      loadModule(newModuleData);
      
      // Simpan ke Firestore jika user login
      if (user) {
        const moduleId = await learningModulesService.addLearningModule(user.uid, newModuleData);
        // Set ID pada modul saat ini agar bisa diupdate nanti
        setCurrentModule(prev => ({ ...prev, id: moduleId }));
        showSuccess('Module Saved', 'Your new learning module has been saved to your account.');
      } else {
        showInfo('Login to Save', 'Sign in to save your generated modules permanently.');
      }
      
    } catch (error) {
      console.error('Generation failed:', error);
      setError('An error occurred during content generation. Please try again.');
      showError('Generation Failed', 'Could not generate the learning module.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    const moduleId = currentModule?.id;
    const script = currentModule?.videoScript;

    if (!moduleId || !script || !user) {
      const errorMsg = 'Module ID, script, or user is missing. Please generate and save a module first.';
      setVideoGenerationError(errorMsg);
      showError('Error', errorMsg);
      return;
    }

    setIsVideoGenerating(true);
    setVideoGenerationError('');
    showInfo('Starting Video Generation', 'Your video is being created. This may take a few minutes...');

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ moduleId, script }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate video.');
      }

      // Listener real-time dari `subscribeToLearningModules` akan menangani pembaruan UI
      // secara otomatis ketika `generatedVideoUrl` diperbarui di Firestore.
      showSuccess('Video Generation Complete!', 'Your video has been generated and will appear shortly.');

    } catch (error: any) {
      console.error('Video generation failed:', error);
      setVideoGenerationError(error.message);
      showError('Video Generation Failed', error.message);
    } finally {
      setIsVideoGenerating(false);
    }
  };


  const handleAnswerSelection = (selectedOption: string, correctAnswer: string) => {
    setSelectedAnswer(selectedOption);
    const correct = selectedOption === correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuestionIndex < quizData.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
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
    if (!currentModule?.tutorialContent && !isLoading) {
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
          <div className="bg-white p-6 rounded-lg shadow-md" dangerouslySetInnerHTML={{ __html: currentModule?.tutorialContent || '' }} />
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

    if (showResults) {
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
    if (!currentQuestion) return null;
    
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
    if (!currentModule?.videoScript && !isLoading) {
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
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
            <h3 className="text-xl font-semibold mb-2">Video Materials</h3>
            <div className="prose max-w-none mb-6">
              <h4 className="font-semibold">Generated Script:</h4>
              <p className="whitespace-pre-line bg-gray-50 p-3 rounded-md">{currentModule?.videoScript}</p>
            </div>

            {currentModule?.generatedVideoUrl ? (
              <div>
                <h4 className="font-semibold mb-2">Generated Video:</h4>
                <video src={currentModule.generatedVideoUrl} controls className="w-full rounded-lg" />
              </div>
            ) : (
               <div className="text-center p-6 border-2 border-dashed rounded-lg">
                <FilmIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Generate Video</h3>
                <p className="mt-1 text-sm text-gray-500">Click the button below to turn the script into a video using AI.</p>
                <div className="mt-6">
                  <button
                    onClick={handleGenerateVideo}
                    disabled={isVideoGenerating}
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-400"
                  >
                    {isVideoGenerating ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5"/>
                        Generating...
                      </>
                    ) : (
                       "Generate Video from Script"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Kolom utama */}
      <div className="lg:col-span-3">
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
                placeholder="e.g., Photosynthesis"
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
            {isLoading ? 'Generating...' : 'Generate & Save Module'}
          </button>
          
          {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
        </div>

        {currentModule && (
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-6">
                <button
                  onClick={() => setActiveTab('tutorial')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === 'tutorial'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <DocumentTextIcon className="h-5 w-5" /> Tutorial
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === 'quiz'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <AcademicCapIcon className="h-5 w-5" /> Quiz
                </button>
                <button
                  onClick={() => setActiveTab('video')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === 'video'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <VideoCameraIcon className="h-5 w-5" /> Video Materials
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

      {/* Kolom sidebar untuk modul yang disimpan */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ArchiveBoxIcon className="h-6 w-6 text-blue-600" />
            Saved Modules
          </h2>
          {user ? (
            savedModules.length > 0 ? (
              <ul className="space-y-2 max-h-96 overflow-y-auto">
                {savedModules.map(module => (
                  <li key={module.id}>
                    <button 
                      onClick={() => loadModule(module)}
                      className="w-full text-left p-3 rounded-md hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <p className="font-medium text-sm text-gray-900">{module.topic}</p>
                      <p className="text-xs text-gray-500">{module.grade} {module.generatedVideoUrl && "(Video)"}</p>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No saved modules yet. Generate one to get started!</p>
            )
          ) : (
            <p className="text-sm text-gray-500 p-3 bg-yellow-50 border border-yellow-200 rounded-md">Please sign in to view and manage your saved modules.</p>
          )}
        </div>
      </div>
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