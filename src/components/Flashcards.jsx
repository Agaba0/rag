import { useState, useContext } from 'react';
import { FileContext } from './fileContext';
import { genarateFlashCard } from './ai';

const Flashcard = () => {
  const { fileContent } = useContext(FileContext);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [flipped, setFlipped] = useState(false); 
  const [currentIndex, setCurrentIndex] = useState(0); 

  const handleStart = async () => {
    if (!fileContent) {
      alert('No file content available. Please upload a file on the Dashboard.');
      return;
    }

    setLoading(true);
    try {
      const prompt = `Generate a list of 10 flashcards with 10 questions and answers based on the following content:\n\n${fileContent}`;
      const generatedFlashcards = await genarateFlashCard(prompt);

      setFlashcards(generatedFlashcards); 
      setCurrentIndex(0); 
      setFlipped(false); 
    } catch (error) {
      console.error('Error generating flashcards:', error);
      alert('An error occurred while generating the flashcards.');
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    setFlipped(!flipped); 
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false); 
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1); 
      setFlipped(false); 
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Flashcards</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <button
          onClick={handleStart}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          {loading ? 'Generating Flashcards...' : 'Start'}
        </button>

        {flashcards.length > 0 && (
          <div className="mt-6 text-center">
            <div
              className={`relative flip-card w-1/2 h-64 mx-auto cursor-pointer ${flipped ? 'flipped' : ''}`}
              onClick={handleFlip}
            >
              <div className="absolute w-full h-full flip-card-inner transform transition-transform duration-500 ease-in-out">
                <div className="flip-card-front bg-white text-center p-6 rounded-lg shadow-lg flex items-center justify-center">
                  <h2 className="text-xl font-bold">
                    {flashcards[currentIndex].question}
                  </h2>
                </div>

                <div className="flip-card-back bg-blue-500 text-white text-center p-6 rounded-lg shadow-lg flex items-center justify-center transform rotateY-180">
                  <p className="text-lg">
                    {flashcards[currentIndex].answer}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0} 
                className={`bg-gray-500 text-white px-4 py-2 rounded-lg ${
                  currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
                }`}
              >
                Prev
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === flashcards.length - 1} 
                className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${
                  currentIndex === flashcards.length - 1
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-600'
                }`}
              >
                Next
              </button>
            </div>

            <p className="mt-4 text-gray-500">
              {currentIndex + 1} / {flashcards.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcard;
