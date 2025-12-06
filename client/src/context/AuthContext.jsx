import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const loadUser = async (authToken) => {
        if (!authToken) {
            setLoading(false);
            return;
        }

        try {
            axios.defaults.headers.common['x-auth-token'] = authToken;
            const res = await axios.get(`${config.API_URL}/api/auth/user`);
            setUser(res.data);
            setToken(authToken);
        } catch (err) {
            console.error(err.response?.data || err);
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['x-auth-token'];
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser(localStorage.getItem('token'));
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${config.API_URL}/api/auth/login`, { email, password });
            localStorage.setItem('token', res.data.token);
            await loadUser(res.data.token);
            return { success: true };
        } catch (err) {
            console.error(err.response?.data);
            return { success: false, error: err.response?.data?.msg || 'Login failed' };
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const res = await axios.post(`${config.API_URL}/api/auth/register`, { name, email, password, role });
            localStorage.setItem('token', res.data.token);
            await loadUser(res.data.token);
            return { success: true };
        } catch (err) {
            console.error(err.response?.data);
            return { success: false, error: err.response?.data?.msg || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, loadUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
