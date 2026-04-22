import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2, Moon, Sun } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, darkMode, toggleDarkMode } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await authService.login(formData);
            login(data.user, data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-cbre-light dark:bg-[#0f0f0f]">
            <button onClick={toggleDarkMode} className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-cbre-dark shadow-md">
                {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-cbre-green" />}
            </button>

            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-cbre-green mb-2 tracking-tight">CBRE</h1>
                    <p className="text-cbre-gray dark:text-gray-400 font-medium uppercase text-xs tracking-widest">Corporate Identity Access</p>
                </div>

                <div className="cbre-card">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Welcome Back</h2>
                    
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-600 dark:text-gray-300">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    className="cbre-input pl-10"
                                    placeholder="example@gmail.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-600 dark:text-gray-300">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="cbre-input pl-10 pr-10"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-cbre-green"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full cbre-btn-primary flex items-center justify-center">
                            {loading ? <Loader2 className="animate-spin mr-2" /> : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-cbre-green font-bold hover:underline">
                            Register Now
                        </Link>
                    </p>
                </div>

                <p className="mt-8 text-center text-xs text-gray-400 uppercase tracking-tighter">
                    © 2024 CBRE Services, Inc. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;
