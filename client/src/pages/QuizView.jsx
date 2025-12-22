import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const QuizView = () => {
    const { noteId } = useParams();
    const { user } = useContext(AuthContext);
    const [quiz, setQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`http://localhost:5000/api/quizzes/note/${noteId}`, config);
                if (data.length > 0) setQuiz(data[0]); // Load latest quiz
            } catch (error) {
                console.error('Error fetching quiz:', error);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchQuiz();
    }, [noteId, user]);

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(`http://localhost:5000/api/quizzes/generate/${noteId}`, {}, config);
            setQuiz(data);
        } catch (error) {
            alert('Generation failed. Check note content.');
        } finally {
            setGenerating(false);
        }
    };

    const handleOptionSelect = (index) => {
        if (isCorrect !== null) return;
        setSelectedOption(index);
        const correct = quiz.questions[currentQuestion].correctAnswer === index;
        setIsCorrect(correct);
        if (correct) setScore(score + 1);
    };

    const handleNext = async () => {
        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(null);
            setIsCorrect(null);
        } else {
            setShowResult(true);
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.post(`http://localhost:5000/api/quizzes/${quiz._id}/submit`, { score: score + (isCorrect ? 1 : 0) }, config);
            } catch (error) {
                console.error('Submit error:', error);
            }
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-xs font-black uppercase tracking-[0.3em] animate-pulse">Initializing Battlefield...</div>;

    if (!quiz) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-white flex flex-col items-center justify-center">
                <div className="w-20 h-20 border-[3px] border-black flex items-center justify-center mb-8 rotate-45">
                    <i className="fa-solid fa-shield-halved text-2xl text-black -rotate-45"></i>
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-center">No Active Assessment</h2>
                <p className="text-gray-500 mb-10 max-w-sm text-center">Challenge your understanding with an AI-generated multiple choice examination.</p>
                <button 
                    onClick={handleGenerate}
                    disabled={generating}
                    className="px-12 py-5 bg-black text-white font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all border-b-4 border-gray-600 disabled:bg-gray-400"
                >
                    {generating ? 'Arming Warhead...' : 'Initialize Quiz'}
                </button>
                <Link to={`/notes/${noteId}`} className="mt-8 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black">Return to Library</Link>
            </div>
        );
    }

    if (showResult) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-white">
                <div className="max-w-xl mx-auto px-10 text-center animate-fade-in">
                    <div className="text-8xl font-black text-black mb-6 tracking-tighter">
                        {Math.round((score / quiz.questions.length) * 100)}%
                    </div>
                    <h2 className="text-3xl font-black text-black mb-10 uppercase tracking-tighter">Mission Accomplished</h2>
                    <div className="grid grid-cols-2 gap-4 mb-16">
                        <div className="p-8 border-[3px] border-black bg-black text-white">
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">Score</div>
                            <div className="text-4xl font-black">{score} / {quiz.questions.length}</div>
                        </div>
                        <div className="p-8 border-[3px] border-black">
                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Questions</div>
                            <div className="text-4xl font-black">{quiz.questions.length}</div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Link to={`/notes/${noteId}`} className="block w-full py-5 bg-black text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-800">Return to Study Report</Link>
                        <button onClick={() => window.location.reload()} className="block w-full py-5 bg-white border-[3px] border-black text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-50">Retake Mission</button>
                    </div>
                </div>
            </div>
        );
    }

    const q = quiz.questions[currentQuestion];

    return (
        <div className="min-h-screen pt-24 pb-32 bg-white">
            <div className="max-w-4xl mx-auto px-8">
                <div className="mb-12 flex justify-between items-end">
                    <div className="space-y-4">
                        <Link to={`/notes/${noteId}`} className="text-[10px] font-black text-gray-400 hover:text-black uppercase tracking-[0.2em]">Abort Mission</Link>
                        <div className="flex items-center gap-3">
                            <div className="h-[1px] w-12 bg-black"></div>
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-black italic">Active Assessment</span>
                        </div>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {currentQuestion + 1} / {quiz.questions.length} QUESTION
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-gray-100 mb-16 relative">
                    <div className="h-full bg-black transition-all duration-500" style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}></div>
                </div>

                {/* Question */}
                <div className="mb-16">
                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest border-b-[2px] border-gray-100 pb-2 mb-8 inline-block">Direct Question</div>
                    <div className="text-3xl md:text-4xl font-black text-black tracking-tighter leading-tight prose prose-slate max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {q.question}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((option, idx) => (
                        <button 
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            className={`p-6 text-left border-[3px] transition-all group relative overflow-hidden ${
                                selectedOption === idx 
                                    ? isCorrect 
                                        ? 'border-green-500 bg-green-50' 
                                        : 'border-red-500 bg-red-50'
                                    : (isCorrect === false && idx === q.correctAnswer)
                                        ? 'border-green-500 bg-green-50 animate-pulse'
                                        : 'border-black hover:bg-black hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-4 relative z-10">
                                <span className={`text-[10px] font-black w-6 h-6 border flex items-center justify-center shrink-0 ${
                                    (selectedOption === idx || (isCorrect === false && idx === q.correctAnswer)) 
                                        ? 'border-current' 
                                        : 'border-gray-200 group-hover:border-white/30'
                                }`}>
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                <div className="text-lg font-bold tracking-tight prose prose-slate">
                                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                                        {option}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Feedback & Next Button */}
                {isCorrect !== null && (
                    <div className="mt-12 animate-slide-up">
                        <div className={`p-8 border-[3px] mb-8 ${isCorrect ? 'border-green-500 bg-green-50 text-green-900' : 'border-red-500 bg-red-50 text-red-900'}`}>
                            <div className="text-[10px] font-black uppercase tracking-widest mb-2">{isCorrect ? 'Correct Analysis' : 'Invalid Logic'}</div>
                            <div className="text-lg font-bold mb-3">{isCorrect ? 'Excellent. Accuracy preserved.' : 'Mistake detected. Knowledge gap identified.'}</div>
                            <p className="text-sm opacity-70 prose prose-slate max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{q.explanation}</ReactMarkdown>
                            </p>
                        </div>
                        <button 
                            onClick={handleNext}
                            className="w-full py-5 bg-black text-white font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all border-b-4 border-gray-600 active:border-b-0 translate-y-0 active:translate-y-1"
                        >
                            {currentQuestion === quiz.questions.length - 1 ? 'Analyze Results' : 'Next Operation'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizView;
