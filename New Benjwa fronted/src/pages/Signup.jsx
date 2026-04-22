import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { User, Mail, Lock, Eye, EyeOff, Loader2, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useAuth();

    const validateForm = () => {
        if (!/^[a-zA-Z ]+$/.test(formData.fullName)) return "Name can only contain letters and spaces";
        if (formData.fullName.length < 3) return "Name must be at least 3 characters";
        if (!/\S+@\S+\.\S+/.test(formData.email)) return "Invalid email format";
        if (formData.password.length < 8) return "Password must be at least 8 characters";
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(formData.password)) 
            return "Password must include uppercase, lowercase, number, and special character";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const validationError = validateForm();
        if (validationError) return setError(validationError);

        setLoading(true);
        try {
            await authService.signup(formData);
            localStorage.setItem('tempEmail', formData.email);
            navigate('/verify-otp');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
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
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Create Account</h2>
                    
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm animate-pulse">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-600 dark:text-gray-300">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    className="cbre-input pl-10"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

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
                            {loading ? <Loader2 className="animate-spin mr-2" /> : 'Create Account'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-cbre-green font-bold hover:underline">
                            Log In
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

export default Signup;
