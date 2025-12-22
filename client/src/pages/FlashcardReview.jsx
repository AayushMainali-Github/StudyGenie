import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const FlashcardReview = () => {
    const { noteId } = useParams();
    const { user } = useContext(AuthContext);
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [complete, setComplete] = useState(false);
    const [stats, setStats] = useState({ forgot: 0, hard: 0, good: 0, easy: 0 });

    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                const { data } = await axios.get(`http://localhost:5000/api/flashcards/note/${noteId}`, config);
                setFlashcards(data);
            } catch (error) {
                console.error('Error fetching cards:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchFlashcards();
    }, [noteId, user]);

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.post(`http://localhost:5000/api/flashcards/generate/${noteId}`, {}, config);
            setFlashcards(data);
        } catch (error) {
            alert('Generation failed. Ensure Note has content.');
        } finally {
            setGenerating(false);
        }
    };

    const handleRate = async (rating) => {
        const currentCard = flashcards[currentIndex];
        
        // Update local stats
        setStats(prev => {
            if (rating === 1) return { ...prev, forgot: prev.forgot + 1 };
            if (rating === 2) return { ...prev, hard: prev.hard + 1 };
            if (rating === 4) return { ...prev, good: prev.good + 1 };
            if (rating === 5) return { ...prev, easy: prev.easy + 1 };
            return prev;
        });

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.put(`http://localhost:5000/api/flashcards/${currentCard._id}/progress`, { rating }, config);
            
            if (currentIndex < flashcards.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setIsFlipped(false);
            } else {
                setComplete(true);
            }
        } catch (error) {
            console.error('Rating error:', error);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center pt-24 text-gray-400 animate-pulse uppercase tracking-widest text-xs font-black">Aligning Synapses...</div>;

    if (flashcards.length === 0) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-white">
                <div className="max-w-xl mx-auto px-6 text-center">
                    <div className="w-20 h-20 bg-gray-50 border-[2px] border-black mx-auto mb-8 flex items-center justify-center">
                        <i className="fa-solid fa-bolt-lightning text-2xl text-black"></i>
                    </div>
                    <h2 className="text-3xl font-black text-black mb-4 uppercase tracking-tighter">Deck Empty</h2>
                    <p className="text-gray-500 mb-10 font-normal leading-relaxed">No flashcards found for this material. Initialize the AI engine to generate them.</p>
                    <button 
                        onClick={handleGenerate}
                        disabled={generating}
                        className="w-full py-4 bg-black text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-800 transition-all border-b-4 border-gray-600 active:border-b-0 translate-y-0 active:translate-y-1"
                    >
                        {generating ? 'Processing Knowledge...' : 'Generate Flashcards'}
                    </button>
                    <Link to={`/notes/${noteId}`} className="block mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black transition-colors">Abort Mission</Link>
                </div>
            </div>
        );
    }

    if (complete) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-white">
                <div className="max-w-xl mx-auto px-10 text-center animate-fade-in">
                    <div className="w-24 h-24 border-[3px] border-black mx-auto mb-10 flex items-center justify-center bg-black animate-bounce-short">
                        <i className="fa-solid fa-check text-4xl text-white"></i>
                    </div>
                    <h2 className="text-5xl font-black text-black mb-2 uppercase tracking-tighter">Session Over</h2>
                    <div className="h-1 w-20 bg-black mx-auto mb-10"></div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-12">
                        <div className="p-6 bg-gray-50 border border-gray-100">
                            <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Mastered</div>
                            <div className="text-3xl font-black text-black">{stats.easy + stats.good}</div>
                        </div>
                        <div className="p-6 bg-gray-50 border border-gray-100">
                            <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Needs Work</div>
                            <div className="text-3xl font-black text-black">{stats.forgot + stats.hard}</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Link to={`/notes/${noteId}`} className="block w-full py-5 bg-black text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-800 transition-all shadow-xl shadow-black/10">Return to Study Report</Link>
                        <button onClick={() => window.location.reload()} className="block w-full py-5 bg-white border-[3px] border-black text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-50 transition-all">Review Again</button>
                    </div>
                </div>
            </div>
        );
    }

    const currentCard = flashcards[currentIndex];

    return (
        <div className="min-h-screen pt-24 pb-32 bg-[#fff]">
            <div className="max-w-3xl mx-auto px-8">
                <div className="mb-12 flex justify-between items-end">
                    <div className="space-y-4">
                        <Link to={`/notes/${noteId}`} className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-black uppercase tracking-[0.2em] transition-all group">
                            <i className="fa-solid fa-chevron-left group-hover:-translate-x-1 transition-transform"></i>
                            Back to Notes
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="h-[1px] w-12 bg-black"></div>
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-black italic">Active Recall</span>
                        </div>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {currentIndex + 1} / {flashcards.length} Card
                    </div>
                </div>

                <div className="w-full h-1.5 bg-gray-100 mb-16 relative">
                    <div 
                        className="h-full bg-black transition-all duration-700 ease-out" 
                        style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
                    ></div>
                </div>

                <div 
                    className="relative w-full aspect-[4/3.2] cursor-pointer group perspective"
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    <div className={`relative w-full h-full duration-700 preserve-3d transition-all ${isFlipped ? 'rotate-y-180' : ''}`}>
                        <div className="absolute inset-0 backface-hidden bg-white border-[3px] border-black p-12 md:p-20 flex flex-col justify-center items-center text-center shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)] overflow-auto scrollbar-hide">
                            <span className="absolute top-8 left-8 text-[10px] font-black text-gray-300 uppercase tracking-widest border-b-[2px] border-gray-100 pb-1">Question</span>
                            <div className="text-2xl md:text-3xl font-black text-black tracking-tighter leading-tight w-full">
                                <ReactMarkdown 
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                >
                                    {currentCard.question}
                                </ReactMarkdown>
                            </div>
                        </div>

                        <div className="absolute inset-0 backface-hidden bg-black border-[3px] border-black p-12 md:p-20 flex flex-col justify-center items-center text-center rotate-y-180 overflow-auto scrollbar-hide">
                            <span className="absolute top-8 left-8 text-[10px] font-black text-white/30 uppercase tracking-widest border-b-[2px] border-white/10 pb-1">Intelligence</span>
                            <div className="text-xl md:text-2xl font-bold text-white leading-relaxed w-full">
                                <ReactMarkdown 
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                >
                                    {currentCard.answer}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`mt-12 grid grid-cols-4 gap-4 transition-all duration-500 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <button onClick={(e) => { e.stopPropagation(); handleRate(1); }} className="py-4 bg-white border-[2px] border-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all hover:-translate-y-1 active:translate-y-0">Forgot</button>
                    <button onClick={(e) => { e.stopPropagation(); handleRate(2); }} className="py-4 bg-white border-[2px] border-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all hover:-translate-y-1 active:translate-y-0">Hard</button>
                    <button onClick={(e) => { e.stopPropagation(); handleRate(4); }} className="py-4 bg-white border-[2px] border-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all hover:-translate-y-1 active:translate-y-0">Good</button>
                    <button onClick={(e) => { e.stopPropagation(); handleRate(5); }} className="py-4 bg-white border-[2px] border-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all hover:-translate-y-1 active:translate-y-0">Easy</button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .perspective { perspective: 2000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .animate-bounce-short { animation: bounce 1s infinite; }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </div>
    );
};

export default FlashcardReview;
