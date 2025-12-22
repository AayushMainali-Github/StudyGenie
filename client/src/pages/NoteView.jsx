import { useState, useEffect, useContext, useRef } from 'react';
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
    const pdfRef = useRef();

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

    const handleDownloadPDF = () => {
        if (!note || !pdfRef.current) return;
        
        const element = pdfRef.current;
        const opt = {
            margin:       [15, 15],
            filename:     `${note.title.replace(/\s+/g, '_')}_StudyNotes.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
        };

        // Standard PDF download using html2pdf
        window.html2pdf().from(element).set(opt).save();
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-24 text-gray-400">
            <div className="flex flex-col items-center gap-4 animate-pulse">
                <i className="fa-solid fa-brain text-4xl text-gray-200"></i>
                <span className="text-xs uppercase tracking-[0.3em] font-light">Synthesizing Notes</span>
            </div>
        </div>
    );

    if (!note) return (
        <div className="min-h-screen flex items-center justify-center pt-24 text-gray-500 font-light italic">
            Note not found.
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-20 bg-[#fafafa]">
            <div className="max-w-4xl mx-auto px-6">
                <div className="mb-10 flex justify-between items-center">
                    <Link to="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-widest transition-colors group">
                        <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
                        Back to Library
                    </Link>
                    
                    <button 
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2.5 px-6 py-2.5 bg-black text-white rounded-md hover:bg-gray-800 transition-all text-xs font-bold uppercase tracking-widest shadow-xl shadow-black/10 active:scale-95"
                    >
                        <i className="fa-solid fa-file-pdf"></i>
                        Export as PDF
                    </button>
                </div>

                <div className="bg-white border border-gray-200 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] rounded-lg overflow-hidden">
                    {/* Renderable area for PDF */}
                    <div ref={pdfRef} className="p-12 md:p-16">
                        <div className="mb-12 pb-10 border-b border-gray-100 space-y-3">
                            <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
                                <i className="fa-solid fa-sparkles"></i>
                                AI Generated Note
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-[1.1]">
                                {note.title}
                            </h1>
                            <div className="flex items-center gap-4 text-[11px] text-gray-400 font-bold uppercase tracking-widest pt-2">
                                <span className="flex items-center gap-1.5"><i className="fa-solid fa-calendar"></i> {new Date(note.createdAt).toLocaleDateString()}</span>
                                <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
                                <span className="flex items-center gap-1.5"><i className="fa-solid fa-file-lines"></i> {note.fileType || 'Text Source'}</span>
                            </div>
                        </div>

                        {/* Enhanced Markdown Styling */}
                        <div className="prose prose-slate max-w-none 
                            prose-headings:text-gray-900 prose-headings:font-black prose-headings:tracking-tighter
                            prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b-2 prose-h2:border-gray-900
                            prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4 prose-h3:text-gray-800
                            prose-p:text-gray-600 prose-p:leading-[1.8] prose-p:text-xl prose-p:font-light prose-p:mb-8
                            prose-strong:text-black prose-strong:font-bold
                            prose-ul:my-8 prose-ul:space-y-4
                            prose-li:text-gray-600 prose-li:text-lg prose-li:font-light">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {note.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-12 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="p-8 bg-gray-50 rounded-lg border border-gray-200 group hover:border-black transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-black text-white p-2 rounded-md">
                                <i className="fa-solid fa-layer-group text-lg"></i>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white px-2 py-1 rounded border border-gray-100">Phase 4</span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Smart Flashcards</h4>
                        <p className="text-gray-500 font-light text-sm leading-relaxed">Turn this content into spaced-repetition cards automatically.</p>
                     </div>

                     <div className="p-8 bg-gray-50 rounded-lg border border-gray-200 group hover:border-black transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-white border border-gray-200 p-2 rounded-md">
                                <i className="fa-solid fa-circle-question text-lg text-gray-400"></i>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white px-2 py-1 rounded border border-gray-100">Phase 5</span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Knowledge Quiz</h4>
                        <p className="text-gray-500 font-light text-sm leading-relaxed">Test your understanding with generated MCQs and feedback.</p>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default NoteView;
