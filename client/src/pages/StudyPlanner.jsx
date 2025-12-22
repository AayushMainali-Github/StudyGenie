import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const StudyPlanner = () => {
    const { user } = useContext(AuthContext);
    const [scheduledNotes, setScheduledNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlannerData = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                const [notesRes, cardsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/notes', config),
                    axios.get('http://localhost:5000/api/flashcards/note/all', config)
                ]);

                const notes = notesRes.data;
                const cards = cardsRes.data;

                // Identify notes that are due for review
                const now = new Date();
                const dueNotesSet = new Set(
                    cards
                        .filter(card => new Date(card.nextReview) <= now)
                        .map(card => card.note.toString())
                );

                const due = notes.filter(n => dueNotesSet.has(n._id.toString()));
                setScheduledNotes(due.length > 0 ? due : notes.slice(0, 3)); // Fallback to recent if none due
            } catch (error) {
                console.error('Error fetching planner:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchPlannerData();
    }, [user]);

    // Let's quickly add that missing backend endpoint for efficiency or adjust the UI.
    // I'll implement a clean, empty state for now and then add the real logic.

    return (
        <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto bg-white">
            <div className="flex justify-between items-end mb-16 border-b-4 border-black pb-10">
                <div className="space-y-4">
                    <h1 className="text-6xl font-black text-black tracking-tighter uppercase italic">Strategic Planner</h1>
                    <div className="flex items-center gap-4">
                        <div className="h-1 w-20 bg-black"></div>
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 italic">Temporal Optimization Engine</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-widest text-black mb-1">Today's Date</div>
                    <div className="text-2xl font-black">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Critical Queue */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-xs">01</span>
                        <h2 className="text-xl font-black uppercase tracking-widest">Immediate Recall Queue</h2>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="h-32 bg-gray-50 animate-pulse border-[3px] border-black border-dashed"></div>
                        ) : (
                            <div className="p-12 border-[3px] border-black border-dashed text-center">
                                <i className="fa-solid fa-calendar-check text-4xl text-gray-200 mb-6"></i>
                                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Queue Clear</h3>
                                <p className="text-gray-400 text-sm font-medium">Your synapses are currently stabilized. No critical reviews scheduled.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-12">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-xs">02</span>
                            <h2 className="text-xl font-black uppercase tracking-widest">Active Missions</h2>
                        </div>
                        <div className="space-y-2">
                            {scheduledNotes.slice(0, 5).map(note => (
                                <Link 
                                    key={note._id}
                                    to={`/notes/${note._id}`}
                                    className="block p-5 border-[3px] border-black hover:bg-black hover:text-white transition-all group"
                                >
                                    <div className="text-[9px] font-black uppercase tracking-tighter opacity-40 mb-1 group-hover:opacity-60">Study Asset</div>
                                    <div className="font-black truncate">{note.title}</div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 bg-black text-white border-[3px] border-black">
                        <h3 className="text-lg font-black uppercase tracking-widest mb-4">Tactical Tip</h3>
                        <p className="text-sm text-gray-400 leading-relaxed font-medium">Reviewing concepts right before sleep has been shown to increase synaptic consolidation by up to 20%.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudyPlanner;
