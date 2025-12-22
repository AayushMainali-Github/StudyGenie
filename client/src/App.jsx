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
import NoteChat from './pages/NoteChat';
import StudyPlanner from './pages/StudyPlanner';
import MindMapView from './pages/MindMapView';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 bg-white border-b-[4px] border-black">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-black text-white px-3 py-1.5 border-[2px] border-black shadow-[4px_4px_0px_0px_rgba(31,41,55,1)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
            <i className="fa-solid fa-bolt-lightning text-lg"></i>
          </div>
          <span className="text-2xl font-black text-black tracking-tighter uppercase italic">
            StudyGenie
          </span>
        </Link>
        <div className="flex items-center gap-8">
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:-translate-y-1 ${isActive('/dashboard') ? 'text-black border-b-2 border-black' : 'text-gray-400 hover:text-black'}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/planner" 
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:-translate-y-1 ${isActive('/planner') ? 'text-black border-b-2 border-black' : 'text-gray-400 hover:text-black'}`}
              >
                Planner
              </Link>
              <button 
                onClick={logout}
                className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-red-600 transition-all hover:-translate-y-1"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:-translate-y-1 ${isActive('/login') ? 'text-black border-b-2 border-black' : 'text-gray-400 hover:text-black'}`}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="px-6 py-2.5 bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] border-[2px] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                Initialise
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
        <div className="min-h-screen pt-32 px-6 flex flex-col items-center justify-center bg-white overflow-hidden relative">
            {/* Background Accents */}
            <div className="absolute top-40 -left-20 w-80 h-80 border-[10px] border-gray-50 -rotate-12 pointer-events-none"></div>
            <div className="absolute bottom-40 -right-20 w-96 h-96 border-[10px] border-gray-50 rotate-12 pointer-events-none"></div>

            <div className="text-center max-w-5xl mx-auto space-y-10 relative z-10">
                <div className="inline-flex items-center gap-3 px-4 py-2 border-[3px] border-black bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-fade-in">
                    <span className="w-2 h-2 bg-black animate-pulse"></span>
                    Intelligence Overload
                </div>
                
                <h1 className="text-6xl md:text-9xl font-black text-black leading-[0.9] tracking-tighter uppercase italic animate-fade-in-up">
                    DECONSTRUCT <br/>
                    <span className="text-gray-200 outline-text">KNOWLEDGE.</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-bold leading-relaxed uppercase tracking-tight animate-fade-in-up [animation-delay:0.2s]">
                    TRANSFORM RAW PDFS INTO CRYSTALLINE SUMMARIES, SYNAPTIC FLASHCARDS, AND BATTLEFIELD ASSESSMENTS.
                </p>

                <div className="flex flex-col md:flex-row justify-center gap-6 pt-8 animate-fade-in-up [animation-delay:0.4s]">
                    {user ? (
                        <Link to="/dashboard" className="px-12 py-6 bg-black text-white font-black uppercase tracking-[0.3em] text-xs border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all">
                            Enter Command Center
                        </Link>
                    ) : (
                        <>
                            <Link to="/signup" className="px-12 py-6 bg-black text-white font-black uppercase tracking-[0.3em] text-xs border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all">
                                Deploy Intelligence
                            </Link>
                            <Link to="/login" className="px-12 py-6 bg-white text-black font-black uppercase tracking-[0.3em] text-xs border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all">
                                Verify Access
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .outline-text {
                    -webkit-text-stroke: 2px #000;
                    text-stroke: 2px #000;
                    color: transparent;
                }
            `}} />
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
            <Route path="/planner" element={<PrivateRoute><StudyPlanner /></PrivateRoute>} />
            <Route path="/notes/upload" element={<PrivateRoute><NoteUpload /></PrivateRoute>} />
            <Route path="/notes/:id" element={<PrivateRoute><NoteView /></PrivateRoute>} />
            <Route path="/flashcards/:noteId" element={<PrivateRoute><FlashcardReview /></PrivateRoute>} />
            <Route path="/quiz/:noteId" element={<PrivateRoute><QuizView /></PrivateRoute>} />
            <Route path="/chat/:noteId" element={<PrivateRoute><NoteChat /></PrivateRoute>} />
            <Route path="/mindmap/:noteId" element={<PrivateRoute><MindMapView /></PrivateRoute>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
