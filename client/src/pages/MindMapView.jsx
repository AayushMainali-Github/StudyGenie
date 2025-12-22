import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    themeVariables: {
        primaryColor: '#000000',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#000000',
        lineColor: '#000000',
        secondaryColor: '#ffffff',
        tertiaryColor: '#ffffff',
    },
    mindmap: {
        useMaxWidth: true,
    }
});

const MindMapView = () => {
    const { noteId } = useParams();
    const { user } = useContext(AuthContext);
    const [mindmapData, setMindmapData] = useState('');
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const mermaidRef = useRef(null);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`http://localhost:5000/api/notes/${noteId}`, config);
                if (data.mindmap) {
                    setMindmapData(data.mindmap);
                }
            } catch (error) {
                console.error('Error fetching mindmap:', error);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchNote();
    }, [noteId, user]);

    useEffect(() => {
        if (mindmapData && mermaidRef.current) {
            mermaidRef.current.removeAttribute('data-processed');
            mermaid.contentLoaded();
        }
    }, [mindmapData]);

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(`http://localhost:5000/api/mindmaps/generate/${noteId}`, {}, config);
            setMindmapData(data.mindmap);
        } catch (error) {
            alert('Generation failed. Try again.');
        } finally {
            setGenerating(false);
        }
    };

    const toggleDebug = () => setShowDebug(!showDebug);
    const [showDebug, setShowDebug] = useState(false);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-xs font-black uppercase tracking-[0.3em] animate-pulse">Calculating Architecture...</div>;

    return (
        <div className="min-h-screen pt-24 pb-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-12 flex justify-between items-end border-b-4 border-black pb-8">
                    <div className="space-y-4">
                        <Link to={`/notes/${noteId}`} className="text-[10px] font-black text-gray-400 hover:text-black uppercase tracking-[0.2em]">
                            <i className="fa-solid fa-arrow-left mr-2"></i> Back to Report
                        </Link>
                        <div className="flex items-center gap-4">
                            <div className="h-1 w-12 bg-black"></div>
                            <h1 className="text-4xl font-black text-black tracking-tighter uppercase italic">Architecture of Knowledge</h1>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={toggleDebug}
                            className="px-6 py-4 bg-white text-black border-[3px] border-black font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-all shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                        >
                            {showDebug ? 'Hide Source' : 'Debug Source'}
                        </button>
                        {!mindmapData && (
                            <button 
                                onClick={handleGenerate}
                                disabled={generating}
                                className="px-8 py-4 bg-black text-white font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all border-b-4 border-gray-600 disabled:bg-gray-400"
                            >
                                {generating ? 'Mapping Synapses...' : 'Generate Map'}
                            </button>
                        )}
                    </div>
                </div>

                {mindmapData ? (
                    <div className="space-y-8">
                        <div className="p-12 border-[3px] border-black bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)] overflow-auto min-h-[600px] flex items-center justify-center">
                            <div className="mermaid w-full text-center" ref={mermaidRef}>
                                {mindmapData}
                            </div>
                        </div>

                        {showDebug && (
                            <div className="animate-fade-in">
                                <div className="bg-black text-white p-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <i className="fa-solid fa-bug"></i> Raw Mermaid Syntax
                                </div>
                                <pre className="p-8 border-[3px] border-black bg-gray-50 text-xs font-mono overflow-auto max-h-96">
                                    {mindmapData}
                                </pre>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-[500px] border-[3px] border-black border-dashed flex flex-col items-center justify-center text-center p-10">
                        <i className="fa-solid fa-network-wired text-6xl text-gray-100 mb-8"></i>
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-4">No Map Detected</h2>
                        <p className="text-gray-400 max-w-sm font-medium">Render a spatial visualization of your study material to identify hidden connections.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MindMapView;
