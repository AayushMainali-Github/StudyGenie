import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const NoteUpload = () => {
    const [title, setTitle] = useState('');
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
            setError('Please provide a document or raw intelligence');
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        if (title) formData.append('title', title);
        
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
            navigate(`/notes/${data._id}`);
        } catch (error) {
            setError(error.response?.data?.message || 'Deconstruction failed. Potential synaptic break.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-white">
            <div className="w-full max-w-3xl space-y-12 animate-fade-in">
                <div className="text-center space-y-4">
                    <h1 className="text-6xl font-black text-black tracking-tighter uppercase italic">Deconstruct Intel</h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-1 w-12 bg-black"></div>
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 italic">Ingestion Pipeline</p>
                    </div>
                </div>

                {error && (
                    <div className="p-6 bg-red-600 text-white font-black uppercase tracking-widest text-[10px] border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <i className="fa-solid fa-triangle-exclamation mr-3 text-lg"></i>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-10 bg-white p-12 border-[3px] border-black shadow-[15px_15px_0px_0px_rgba(0,0,0,0.05)]">
                    {/* Note Title */}
                    <div className="space-y-4">
                        <label className="block text-[11px] font-black text-black uppercase tracking-[0.2em] border-l-4 border-black pl-3">
                            Subject Designation (Title)
                        </label>
                        <input
                            type="text"
                            className="w-full px-6 py-4 bg-white border-[3px] border-black focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] outline-none transition-all font-black text-lg placeholder:text-gray-200 placeholder:italic"
                            placeholder="Enter subject title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Option 1: File */}
                        <div className="space-y-4">
                            <label className="block text-[11px] font-black text-black uppercase tracking-[0.2em] border-l-4 border-black pl-3">
                                File Upload (PDF/TXT)
                            </label>
                            <div className="relative group min-h-[200px] flex flex-col">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    accept=".pdf,.doc,.docx,.txt"
                                />
                                <div className="flex-1 border-[3px] border-dashed border-gray-200 p-8 text-center group-hover:border-black transition-all bg-white flex flex-col items-center justify-center">
                                    <i className="fa-solid fa-file-arrow-up text-4xl text-gray-100 group-hover:text-black transition-colors mb-4"></i>
                                    <p className="text-xs font-black uppercase tracking-tight text-gray-400 group-hover:text-black">
                                        {file ? file.name : "Select Intelligence Stream"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Option 2: Text */}
                        <div className="space-y-4">
                            <label className="block text-[11px] font-black text-black uppercase tracking-[0.2em] border-l-4 border-black pl-3">
                                Raw Data Stream (Text)
                            </label>
                            <textarea
                                className="w-full h-[200px] px-6 py-4 border-[3px] border-black focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] outline-none transition-all text-sm font-bold resize-none bg-white placeholder:text-gray-200"
                                placeholder="Paste raw intel here..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-6 bg-black text-white font-black uppercase tracking-[0.4em] text-xs shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)] transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-none active:translate-y-0'}`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-4 italic">
                                <i className="fa-solid fa-bolt-lightning fa-spin text-xl"></i>
                                Fragmenting Data...
                            </span>
                        ) : (
                            "Initiate Deconstruction"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NoteUpload;
