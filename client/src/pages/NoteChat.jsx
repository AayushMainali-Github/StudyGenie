import { useState, useRef, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const NoteChat = () => {
    const { noteId } = useParams();
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([
        { role: 'ai', text: "Systems online. I am your Academic Architect. Ask me anything about this document." }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.post(`http://localhost:5000/api/chat/${noteId}`, { message: userMsg }, config);
            setMessages(prev => [...prev, { role: 'ai', text: data.text }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', text: "Error: Synaptic connection interrupted. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-8 bg-white flex flex-col max-w-5xl mx-auto px-6">
            <div className="mb-8 flex justify-between items-center border-b border-gray-100 pb-6">
                <div className="space-y-1">
                    <Link to={`/notes/${noteId}`} className="text-[10px] font-black text-gray-400 hover:text-black uppercase tracking-widest mb-2 block">
                        <i className="fa-solid fa-arrow-left mr-2"></i> Back to Report
                    </Link>
                    <h1 className="text-3xl font-black text-black tracking-tighter uppercase italic">AI Tutor Interaction</h1>
                </div>
                <div className="bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Architect Online
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto space-y-8 pr-4 scrollbar-hide mb-8 min-h-[500px]">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                        <div className={`max-w-[85%] p-8 border-[3px] ${
                            msg.role === 'user' 
                                ? 'bg-black text-white border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]' 
                                : 'bg-white text-black border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]'
                        }`}>
                            <div className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-30">
                                {msg.role === 'user' ? 'Direct Inquiry' : 'Architect Insight'}
                            </div>
                            <div className="prose prose-slate max-w-none text-lg font-medium leading-relaxed">
                                <ReactMarkdown 
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                >
                                    {msg.text}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start animate-fade-in">
                        <div className="p-8 border-[3px] border-black bg-gray-50 text-black">
                            <div className="flex gap-2 items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="w-1 h-1 bg-black animate-bounce"></span>
                                <span className="w-1 h-1 bg-black animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-1 h-1 bg-black animate-bounce [animation-delay:0.4s]"></span>
                                Analyzing Notes...
                            </div>
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="relative mb-4">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about formulas, derivations, or summaries..."
                    className="w-full p-8 border-[3px] border-black bg-white text-black font-bold focus:outline-none shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)] transition-all focus:translate-x-1 focus:translate-y-1 focus:shadow-none"
                />
                <button 
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black text-white px-8 py-3 font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all border-b-4 border-gray-600 active:border-b-0 active:translate-y-1"
                >
                    Send
                </button>
            </form>
            <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">Powered by Gemini 2.5 Flash • Context: Active Note</p>

            <style dangerouslySetInnerHTML={{ __html: `
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </div>
    );
};

export default NoteChat;
