import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const NoteView = () => {
    const { id } = useParams();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get(`http://localhost:5000/api/notes/${id}`, config);
                setNote(data);
            } catch (error) {
                console.error('Error fetching note:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchNote();
        }
    }, [id, user]);

    const handleDownload = () => {
        if (!note) return;
        const element = document.createElement("a");
        const file = new Blob([note.content], { type: 'text/markdown' });
        element.href = URL.createObjectURL(file);
        element.download = `${note.title.replace(/\s+/g, '_')}_StudyNotes.md`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-24 text-gray-500">
            <div className="text-center font-mono text-xs tracking-widest text-gray-400 uppercase italic animate-pulse">
                Parsing generated intelligence...
            </div>
        </div>
    );

    if (!note) return (
        <div className="min-h-screen flex items-center justify-center pt-24 text-gray-500">
            Note not found.
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-6">
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-widest mb-8 transition-colors">
                    <i className="fa-solid fa-arrow-left"></i>
                    Back to Library
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-8 border-b border-gray-100 bg-white sticky top-0 z-10 flex justify-between items-center sm:flex-row flex-col gap-4">
                        <div className="space-y-1 text-center sm:text-left">
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight leading-tight">{note.title}</h1>
                            <div className="flex items-center justify-center sm:justify-start gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                <span><i className="fa-solid fa-calendar mr-1.5"></i> {new Date(note.createdAt).toLocaleDateString()}</span>
                                <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                <span className="truncate max-w-[150px]"><i className="fa-solid fa-file-lines mr-1.5"></i> {note.fileType || 'Text'}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                             <button 
                                onClick={handleDownload}
                                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md hover:border-black hover:bg-black hover:text-white transition-all text-xs font-bold uppercase tracking-widest" 
                                title="Download Markdown"
                             >
                                <i className="fa-solid fa-download"></i>
                                Download
                             </button>
                        </div>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="prose prose-slate max-w-none 
                            prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
                            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-100
                            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                            prose-p:text-gray-600 prose-p:leading-relaxed prose-p:font-light prose-p:text-lg
                            prose-strong:text-gray-900 prose-strong:font-bold
                            prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
                            prose-li:text-gray-600 prose-li:text-lg font-sans">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {note.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button className="group p-6 bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:-translate-y-1 text-left">
                        <div className="flex justify-between items-center mb-2">
                            <i className="fa-solid fa-bolt text-indigo-400 text-xl"></i>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Coming Soon</span>
                        </div>
                        <h4 className="text-lg font-bold mb-1">Generate Flashcards</h4>
                        <p className="text-xs text-indigo-200 font-light opacity-80 leading-relaxed">Transform these notes into interactive memory cards for active recall study.</p>
                    </button>
                    
                    <button className="group p-6 bg-white border border-gray-200 rounded-xl hover:border-black transition-all shadow-sm hover:-translate-y-1 text-left">
                        <div className="flex justify-between items-center mb-2">
                            <i className="fa-solid fa-circle-question text-gray-400 group-hover:text-black text-xl"></i>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-30 group-hover:opacity-50">Coming Soon</span>
                        </div>
                        <h4 className="text-lg font-bold mb-1 text-gray-900">Take a Quiz</h4>
                        <p className="text-xs text-gray-500 font-light leading-relaxed">Knowledge assessment via AI-generated multiple choice questions.</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NoteView;
