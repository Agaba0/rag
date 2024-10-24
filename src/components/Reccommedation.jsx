import { useState, useEffect, useContext } from 'react';
import { FileContext } from './fileContext';
import { generateRecommendation } from './ai';
import { useNavigate } from 'react-router-dom';

const Recommendation = () => {
  const { fileContent } = useContext(FileContext);
  const [quizProgress, setQuizProgress] = useState(0); 
  const [flashcardProgress, setFlashcardProgress] = useState(0); 
  const [recommendations, setRecommendations] = useState(''); 
  const [hasRequested, setHasRequested] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const quizProgressInterval = setInterval(() => {
      setQuizProgress((prev) => (prev < 100 ? prev + 10 : 100));
    }, 1000);

    const flashcardProgressInterval = setInterval(() => {
      setFlashcardProgress((prev) => (prev < 100 ? prev + 5 : 100));
    }, 1500);

    return () => {
      clearInterval(quizProgressInterval);
      clearInterval(flashcardProgressInterval);
    };
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!fileContent) {
        alert("Kindly go to the dashboard to upload a document");
        navigate("/");
        return;
      }

      if (!hasRequested && fileContent) {
        const prompt = `Based on the following content, suggest related topics for further learning:\n\n${fileContent}`;
        try {
          const recommendations = await generateRecommendation(prompt);
          setRecommendations(recommendations);
          setHasRequested(true); 
        } catch (error) {
          console.error('Error generating recommendations:', error);
        }
      }
    };

    fetchRecommendations();
  }, [fileContent, hasRequested, navigate]);
    
  const formatRecommendations = (text) => {
    const regex = /(\d+)\.\s*([^\d]+)/g;
    const matches = [...text.matchAll(regex)];
    return matches.map((match) => ({
      number: match[1],
      topic: match[2].trim(),
    }));
  };

  const recommendationList = formatRecommendations(recommendations);
    

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Recommendations</h1>
      <div className="bg-blue-100 p-4 rounded-lg mb-6">
        <p className="text-lg">
        See how well you did
        </p>
        <p className="text-lg font-semibold mt-2">
          Note: The AI has recommended some topic you should look into a gain mastery on the file uploaded 
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-bold mb-4">Progress Overview</h2>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Quiz Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full"
              style={{ width: `${quizProgress}%` }}
            ></div>
          </div>
          <p className="text-gray-600 mt-2">{quizProgress}% Completed</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">Flashcard Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full"
              style={{ width: `${flashcardProgress}%` }}
            ></div>
          </div>
          <p className="text-gray-600 mt-2">{flashcardProgress}% Completed</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">AI Recommendations</h2>
        <ul className="list-decimal list-inside text-gray-700">
          {recommendationList.length > 0 ? (
            recommendationList.map((item) => (
              <li key={item.number} className="mb-2">
                {item.topic}
              </li>
            ))
          ) : (
            <p className="text-gray-600">Loading recommendations...</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Recommendation;
