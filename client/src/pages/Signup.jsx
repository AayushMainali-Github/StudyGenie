import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await register(username, email, password);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50 p-6">
            <div className="w-full max-w-sm bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
                <div className="text-center space-y-1">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Create account</h2>
                    <p className="text-sm text-gray-500">Start learning smarter today</p>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100 flex items-center gap-2">
                        <i className="fa-solid fa-circle-exclamation text-xs"></i>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Username</label>
                        <input
                            type="text"
                            className="block w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none transition-all text-sm"
                            placeholder="johndoe"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Email</label>
                        <input
                            type="email"
                            className="block w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none transition-all text-sm"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Password</label>
                        <input
                            type="password"
                            className="block w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none transition-all text-sm"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <p className="text-xs text-gray-400">At least 8 characters</p>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2.5 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-all text-sm shadow-sm"
                    >
                        Sign Up
                    </button>
                </form>

                <div className="pt-2 text-center border-t border-gray-100 mt-4">
                    <p className="text-sm text-gray-500 mt-4">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-gray-900 hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
