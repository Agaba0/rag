import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Quizzes from './components/Quizzes';
import Flashcards from './components/Flashcards';
import { FileProvider } from './components/fileContext';
import Recommendation from './components/Reccommedation';

const App = () => {
  return (
    <FileProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-blue-500 p-4 flex justify-center">
            <ul className="flex space-x-4 text-white">
              <li className=' border-2 p-2 rounded-md'>
                <Link to="/" className="hover:underline">Dashboard</Link>
              </li>
              <li className=' border-2 p-2 rounded-md'>
                <Link to="/flashcards" className="hover:underline">Flashcards</Link>
              </li>
              <li className=' border-2 p-2 rounded-md'>
                <Link to="/quizzes" className="hover:underline">Quizzes</Link>
              </li>
              <li className=' border-2 p-2 rounded-md'>
                <Link to="/recommend" className="hover:underline">Recommendation</Link>
              </li>
            </ul>
          </nav>

          <main className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/quizzes" element={<Quizzes />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/recommend" element={<Recommendation />} />
            </Routes>
          </main>
        </div>
      </Router>
    </FileProvider>
  );
};

export default App;
