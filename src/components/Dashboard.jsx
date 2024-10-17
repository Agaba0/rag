import { useState, useContext } from 'react';
import Papa from 'papaparse';
import mammoth from 'mammoth';
import { FileContext } from './fileContext';
import { generateFlashcardsAndQuizzes } from './ai';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { setFileContent } = useContext(FileContext);
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    setLoading(true);
    setGeneratedContent(''); // Clear previously generated content

    try {
      if (
        uploadedFile.type === 'text/csv' || 
        uploadedFile.type === 'application/vnd.ms-excel'
      ) {
        const csvText = await extractCsvText(uploadedFile);
        setFileContent(csvText);
        await generateContent(csvText); // Send CSV content to the AI
        setGeneratedContent(csvText); // Preview for CSV
      } else if (
        uploadedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const text = await extractDocxText(uploadedFile);
        setFileContent(text);
        await generateContent(text); // Send DOCX content to the AI
        setGeneratedContent(text); // Preview for DOCX
      } else {
        alert('Unsupported file format. Please upload a DOCX or CSV file.');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert('An error occurred while processing the file.');
    } finally {
      setLoading(false);
    }
  };

  const extractCsvText = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (result) => {
          const csvText = result.data.map(row => row.join(', ')).join('\n');
          resolve(csvText);
        },
        error: (error) => {
          reject('Error parsing CSV file');
          console.error(error);
        }
      });
    });
  };

  const extractDocxText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const { value: docText } = await mammoth.extractRawText({ arrayBuffer });
    return docText;
  };

  const generateContent = async (text) => {
    try {
      const prompt = `summarize and itemize the key points\n\n${text}`;
      const generated = await generateFlashcardsAndQuizzes(prompt);
      setGeneratedContent(generated); // Only set generated content for CSV and DOCX
    } catch (error) {
      console.error('Error generating content:', error);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Information about file upload */}
      <div className="bg-blue-100 p-4 rounded-lg mb-6">
        <p className="text-lg">
        Upload the document you wish to learn about. We are here to guide you towards mastery within 30 to 60 minutes
        </p>
        <p className="text-lg font-semibold mt-2">
          Note: We currently only accept DOCS and CSV file formats at this moment.
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <input
          type="file"
          accept=".csv, .docx"
          onChange={handleFileUpload}
          className="mb-4"
        />
        {loading ? (
          <p>Processing your file...</p>
        ) : (
          generatedContent && (
            <div>
              <h2 className="text-xl font-bold mb-4">File Content Preview:</h2>
              <textarea
                value={generatedContent}
                readOnly
                className="w-full h-64 p-2 border rounded-md bg-gray-100"
              ></textarea>
            </div>
          )
        )}
      </div>

    
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-2">Flashcards</h2>
          <p className="text-gray-700 mb-4">
            Improve your learning with flashcards created from your uploaded documents.
          </p>
          <Link to="/flashcards" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Go to Flashcards
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-2">Quizzes</h2>
          <p className="text-gray-700 mb-4">
            Test your knowledge and challenge yourself with quizzes generated from the content.
          </p>
          <Link to="/quizzes" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Go to Quizzes
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-2">Recommendations</h2>
          <p className="text-gray-700 mb-4">
            Get tailored recommendations to optimize your study sessions and improve learning outcomes.
          </p>
          <Link to="/recommend" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Get Recommendations
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
