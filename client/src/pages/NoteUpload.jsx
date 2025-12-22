import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const NoteUpload = () => {
    const [file, setFile] = useState(null);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file && !text) {
            setError('Please select a file or enter text');
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        if (file) {
            formData.append('file', file);
        } else {
            formData.append('text', text);
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post('http://localhost:5000/api/notes', formData, config);
            navigate(`/note/${data._id}`);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to generate notes');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center bg-white">
            <div className="w-full max-w-2xl space-y-8 animate-fade-in">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Generate Study Notes</h1>
                    <p className="text-gray-500 font-light">Upload a PDF or paste text to create AI summaries</p>
                </div>

                {error && (
                    <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8 bg-gray-50 p-8 rounded-2xl border border-gray-100">
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-800 uppercase tracking-widest">
                            Option 1: Upload Document
                        </label>
                        <div className="relative group">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                accept=".pdf,.doc,.docx,.txt"
                            />
                            <div className="border-2 border-dashed border-gray-200 rounded-xl py-12 px-6 text-center group-hover:border-black transition-all bg-white">
                                <i className="fa-solid fa-cloud-arrow-up text-3xl text-gray-300 mb-4 group-hover:text-black transition-colors"></i>
                                <p className="text-sm text-gray-600">
                                    {file ? file.name : "Click to upload or drag & drop"}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-tight">PDF, DOCX, TXT UP TO 10MB</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">OR</span>
                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-800 uppercase tracking-widest">
                            Option 2: Paste Raw Text
                        </label>
                        <textarea
                            className="w-full h-48 px-4 py-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-black focus:border-black outline-none transition-all text-sm font-light leading-relaxed resize-none bg-white"
                            placeholder="Paste your study materials or lecture transcripts here..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 bg-black text-white font-bold rounded-xl shadow-lg hover:shadow-black/10 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5 active:translate-y-0'}`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-3 italic">
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                StudyGenie is thinking...
                            </span>
                        ) : (
                            "Generate Notes"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NoteUpload;
