import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                const [notesRes, statsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/notes', config),
                    axios.get('http://localhost:5000/api/stats/overview', config)
                ]);
                setNotes(notesRes.data);
                setStats(statsRes.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    const stripMarkdown = (text) => {
        return text
            .replace(/[#*`_~]/g, '')
            .replace(/\[.*?\]\(.*?\)/g, '')
            .substring(0, 150)
            .trim() + '...';
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto">
            {/* Command Center Stats */}
            {!loading && stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-fade-in text-black">
                    <div className="p-8 bg-black text-white border-[3px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)]">
                        <div className="flex justify-between items-start mb-6">
                            <i className="fa-solid fa-brain text-2xl opacity-50"></i>
                            <span className="text-[10px] font-black uppercase tracking-widest border-b border-white/20 pb-1">Knowledge Base</span>
                        </div>
                        <div className="text-5xl font-black mb-1">{stats.notes.total}</div>
                        <div className="text-[11px] font-black uppercase tracking-widest text-gray-400">Total Study Reports</div>
                    </div>

                    <div className="p-8 bg-white text-black border-[3px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)]">
                        <div className="flex justify-between items-start mb-6">
                            <i className="fa-solid fa-bolt text-2xl opacity-30"></i>
                            <span className="text-[10px] font-black uppercase tracking-widest border-b border-black/10 pb-1">Synaptic Retention</span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-5xl font-black">{stats.flashcards.mastered}</span>
                            <span className="text-lg font-bold text-gray-400">/ {stats.flashcards.total}</span>
                        </div>
                        <div className="text-[11px] font-black uppercase tracking-widest text-gray-500">Mastered Triggers</div>
                    </div>

                    <div className="p-8 bg-white text-black border-[3px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)]">
                        <div className="flex justify-between items-start mb-6">
                            <i className="fa-solid fa-crosshairs text-2xl opacity-30"></i>
                            <span className="text-[10px] font-black uppercase tracking-widest border-b border-black/10 pb-1">Validation Accuracy</span>
                        </div>
                        <div className="text-5xl font-black mb-1">{stats.quizzes.accuracy}%</div>
                        <div className="text-[11px] font-black uppercase tracking-widest text-gray-500">Average Quiz Score</div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-end mb-10 border-b-4 border-black pb-8">
                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-black tracking-tighter uppercase italic">Local Library</h2>
                    <div className="flex items-center gap-3">
                        <div className="h-1 w-12 bg-black"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Stored Intelligence</p>
                    </div>
                </div>
                <Link 
                    to="/notes/upload" 
                    className="flex items-center gap-3 px-8 py-4 bg-black text-white hover:bg-gray-800 transition-all text-xs font-black uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:translate-y-1 hover:shadow-none"
                >
                    <i className="fa-solid fa-plus"></i>
                    New Document
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 bg-gray-50 animate-pulse border-[3px] border-black/5"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {notes.map((note) => (
                        <Link 
                            key={note._id} 
                            to={`/notes/${note._id}`}
                            className="group block p-8 bg-white border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border-[2px] ${note.fileType?.includes('pdf') ? 'text-red-600 border-red-600 bg-red-50' : 'text-black border-black bg-gray-50'}`}>
                                    {note.fileType?.includes('pdf') ? 'PDF.DUMP' : 'TXT.DUMP'}
                                </span>
                                <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="text-2xl font-black text-black mb-4 truncate leading-tight group-hover:italic italic transition-all">
                                {note.title}
                            </h3>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8 h-12 overflow-hidden opacity-70">
                                {stripMarkdown(note.content)}
                            </p>
                            <div className="flex items-center gap-6 pt-6 border-t-[2px] border-gray-100">
                                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${note.hasFlashcards ? 'text-pink-600' : 'text-gray-300'}`}>
                                    <i className="fa-solid fa-bolt"></i> Flashcards
                                </div>
                                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${note.hasQuiz ? 'text-cyan-600' : 'text-gray-300'}`}>
                                    <i className="fa-solid fa-circle-question"></i> Quiz
                                </div>
                                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${note.hasMindMap ? 'text-purple-600' : 'text-gray-300'}`}>
                                    <i className="fa-solid fa-network-wired"></i> Map
                                </div>
                                <i className="fa-solid fa-arrow-right ml-auto text-gray-200 group-hover:text-black transition-colors"></i>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
