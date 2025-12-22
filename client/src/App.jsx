import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import AuthContext, { AuthProvider } from './context/AuthContext';
import { useContext } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NoteUpload from './pages/NoteUpload';
import NoteView from './pages/NoteView';
import FlashcardReview from './pages/FlashcardReview';
import QuizView from './pages/QuizView';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-black text-white p-1.5 rounded-md">
            <i className="fa-solid fa-graduation-cap text-lg"></i>
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            StudyGenie
          </span>
        </Link>
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className={`text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-black' : 'text-gray-500 hover:text-black'}`}
              >
                Dashboard
              </Link>
              <button 
                onClick={logout}
                className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`text-sm font-medium transition-colors ${isActive('/login') ? 'text-black' : 'text-gray-500 hover:text-black'}`}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="px-4 py-2 rounded-md bg-black text-white text-sm font-medium hover:bg-gray-800 transition-all"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return null;
    return user ? children : <Navigate to="/login" />;
};

const Home = () => {
    const { user } = useContext(AuthContext);
    return (
        <div className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center bg-white">
            <div className="text-center max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-600 text-xs font-medium uppercase tracking-wider mb-4">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                AI-Powered Learning
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
                Master Your Studies <br/>
                <span className="text-gray-400">with Intelligence.</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
                Transform your reading materials into interactive flashcards, concise summaries, and challenging quizzes instantly.
            </p>
            <div className="flex justify-center gap-4 pt-4">
                {user ? (
                    <Link to="/dashboard" className="px-8 py-3.5 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-all shadow-sm">
                        Go to Dashboard
                    </Link>
                ) : (
                    <>
                        <Link to="/signup" className="px-8 py-3.5 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-all shadow-sm">
                            Get Started
                        </Link>
                        <button className="px-8 py-3.5 rounded-lg bg-white text-gray-900 font-medium border border-gray-200 hover:border-gray-900 transition-all">
                            View Demo
                        </button>
                    </>
                )}
            </div>
            </div>
        </div>
    );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen font-sans text-gray-900 antialiased bg-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/notes/upload" element={<PrivateRoute><NoteUpload /></PrivateRoute>} />
            <Route path="/notes/:id" element={<PrivateRoute><NoteView /></PrivateRoute>} />
            <Route path="/flashcards/:noteId" element={<PrivateRoute><FlashcardReview /></PrivateRoute>} />
            <Route path="/quiz/:noteId" element={<PrivateRoute><QuizView /></PrivateRoute>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
