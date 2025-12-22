import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUser(userInfo);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const { data } = await axios.post('/api/auth/login', { email, password }, config);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || error.message 
            };
        }
    };

    const register = async (username, email, password) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const { data } = await axios.post('/api/auth/register', { username, email, password }, config);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
             return { 
                success: false, 
                message: error.response?.data?.message || error.message 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
