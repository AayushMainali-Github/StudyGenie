import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

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
            margin:       [10, 10],
            filename:     `${note.title.replace(/\s+/g, '_')}_StudyNotes.pdf`,
            image:        { type: 'jpeg', quality: 1 },
            html2canvas:  { scale: 3, useCORS: true, letterRendering: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
        };

        window.html2pdf().from(element).set(opt).save();
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-24 text-gray-400">
            <div className="flex flex-col items-center gap-4 animate-pulse">
                <i className="fa-solid fa-brain text-5xl text-black"></i>
                <span className="text-[10px] uppercase tracking-[0.5em] font-black text-black">Synthesizing Intelligence</span>
            </div>
        </div>
    );

    if (!note) return (
        <div className="min-h-screen flex items-center justify-center pt-24 text-gray-500 font-light italic text-xs uppercase tracking-widest">
            Identity extraction failed.
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-32 bg-[#fff]">
            <div className="max-w-5xl mx-auto px-10">
                <div className="mb-12 flex justify-between items-end">
                    <div className="space-y-4">
                        <Link to="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-black uppercase tracking-[0.2em] transition-all group">
                            <i className="fa-solid fa-chevron-left group-hover:-translate-x-1 transition-transform"></i>
                            Back to Library
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="h-[1px] w-12 bg-black"></div>
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-black">Study Report</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-none hover:bg-gray-800 transition-all text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/20 active:scale-95 border-b-4 border-gray-600 active:border-b-0 translate-y-0 active:translate-y-1"
                    >
                        <i className="fa-solid fa-print"></i>
                        Export Intelligence
                    </button>
                </div>

                <div className="bg-white border-[3px] border-black overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 -mr-16 -mt-16 rotate-45 border-b-[3px] border-l-[3px] border-black z-0"></div>
                    
                    <div ref={pdfRef} className="p-16 md:p-24 relative z-10">
                        <header className="mb-12 pb-10 border-b-2 border-gray-100">
                            <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter leading-[1.1] mb-6">
                                {note.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                                <span className="flex items-center gap-2 text-black"><i className="fa-solid fa-calendar"></i> {new Date(note.createdAt).toLocaleDateString()}</span>
                                <span className="h-3 w-[1px] bg-gray-200"></span>
                                <span className="flex items-center gap-2"><i className="fa-solid fa-hashtag"></i> {note._id.toString().slice(-6)}</span>
                                <span className="h-3 w-[1px] bg-gray-200"></span>
                                <span className="flex items-center gap-2"><i className="fa-solid fa-cube"></i> {note.fileType || 'SOURCE'}</span>
                            </div>
                        </header>

                        {/* Refined Custom Component Mapping */}
                        <div className="custom-markdown-content">
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm, remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                                components={{
                                    h2: ({node, ...props}) => (
                                        <div className="mt-20 mb-8">
                                            <h2 className="text-3xl font-black text-black uppercase tracking-tight mb-3" {...props} />
                                            <div className="h-1 w-full bg-black"></div>
                                        </div>
                                    ),
                                    h3: ({node, ...props}) => (
                                        <h3 className="text-xl font-black text-gray-900 mt-12 mb-4 tracking-tight" {...props} />
                                    ),
                                    p: ({node, ...props}) => (
                                        <p className="text-lg leading-[1.7] font-normal text-gray-700 mb-8" {...props} />
                                    ),
                                    li: ({node, ...props}) => (
                                        <li className="relative pl-8 mb-4 text-base text-gray-800 before:content-[''] before:absolute before:left-0 before:top-[0.7em] before:w-4 before:h-[2px] before:bg-black" {...props} />
                                    ),
                                    ul: ({node, ...props}) => (
                                        <ul className="my-8 space-y-2 list-none" {...props} />
                                    ),
                                    hr: ({node, ...props}) => (
                                        <hr className="my-14 border-t-2 border-black opacity-5" {...props} />
                                    ),
                                    strong: ({node, ...props}) => (
                                        <strong className="font-black text-black" {...props} />
                                    )
                                }}
                            >
                                {note.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>

                <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-10">
                     <Link 
                        to={`/mindmap/${id}`}
                        className="p-10 bg-white border-[3px] border-black group hover:translate-x-2 transition-all cursor-pointer block"
                     >
                        <div className="flex justify-between items-start mb-6">
                            <i className="fa-solid fa-network-wired text-3xl text-black"></i>
                        </div>
                        <h4 className="text-2xl font-black mb-3">ARCHITECTURE MAP</h4>
                        <p className="text-gray-500 font-normal text-sm leading-relaxed">Visualize the spatial hierarchy and hidden connections of knowledge.</p>
                     </Link>

                     <Link 
                        to={`/flashcards/${id}`}
                        className="p-10 bg-black text-white group hover:translate-x-2 transition-all cursor-pointer block"
                     >
                        <div className="flex justify-between items-start mb-6">
                            <i className="fa-solid fa-bolt-lightning text-3xl text-white"></i>
                        </div>
                        <h4 className="text-2xl font-black mb-3">SYNAPTIC FLASHCARDS</h4>
                        <p className="text-gray-400 font-normal text-sm leading-relaxed">Deconstruct intelligence into mnemonic triggers for accelerated recall.</p>
                     </Link>

                     <Link 
                        to={`/quiz/${id}`}
                        className="p-10 bg-white border-[3px] border-black group hover:translate-x-2 transition-all cursor-pointer block"
                     >
                        <div className="flex justify-between items-start mb-6">
                            <i className="fa-solid fa-shield-halved text-3xl text-black"></i>
                        </div>
                        <h4 className="text-2xl font-black mb-3">BATTLEFIELD QUIZZES</h4>
                        <p className="text-gray-500 font-normal text-sm leading-relaxed">Simulate high-stakes examination environments with randomized challenges.</p>
                     </Link>
                </div>

                {/* AI Tutor Floating Button */}
                <Link 
                    to={`/chat/${id}`}
                    className="fixed bottom-10 right-10 w-20 h-20 bg-black text-white rounded-none border-[3px] border-black flex items-center justify-center shadow-[10px_10px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group z-50"
                >
                    <div className="absolute -top-12 right-0 bg-white border-[2px] border-black text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Consult Architect</div>
                    <i className="fa-solid fa-comment-dots text-2xl"></i>
                </Link>
            </div>
        </div>
    );
};

export default NoteView;
