import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get('http://localhost:5000/api/notes', config);
                setNotes(data);
            } catch (error) {
                console.error('Error fetching notes:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchNotes();
        }
    }, [user]);

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Library</h1>
                    <p className="text-gray-500 font-light">Manage and access your AI-generated study materials</p>
                </div>
                <Link 
                    to="/upload" 
                    className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-md hover:bg-gray-800 transition-all text-sm font-medium shadow-sm"
                >
                    <i className="fa-solid fa-plus text-xs"></i>
                    New Study Note
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 bg-gray-50 animate-pulse rounded-lg border border-gray-100"></div>
                    ))}
                </div>
            ) : notes.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-2xl">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fa-solid fa-note-sticky text-gray-300 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No notes yet</h3>
                    <p className="text-gray-500 mt-1 max-w-xs mx-auto text-sm">Upload your first document to start generating AI study notes.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map((note) => (
                        <Link 
                            key={note._id} 
                            to={`/note/${note._id}`}
                            className="group block p-6 bg-white border border-gray-200 rounded-lg hover:border-black transition-all hover:shadow-sm"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${note.fileType?.includes('pdf') ? 'text-red-600 border-red-100 bg-red-50' : 'text-blue-600 border-blue-100 bg-blue-50'}`}>
                                    {note.fileType?.includes('pdf') ? 'PDF' : 'Text'}
                                </span>
                                <span className="text-[10px] text-gray-400 font-mono">
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-black leading-tight">
                                {note.title}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2 font-light leading-relaxed">
                                {note.content.substring(0, 100)}...
                            </p>
                            <div className="mt-4 flex items-center gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest pt-4 border-t border-gray-50">
                                <span><i className="fa-solid fa-bolt mr-1"></i> Flashcards</span>
                                <span><i className="fa-solid fa-circle-question mr-1"></i> Quiz</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
