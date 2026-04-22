import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Loader2, RefreshCw, CheckCircle2 } from 'lucide-react';

const VerifyOTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [timer, setTimer] = useState(300); // 5 minutes
    const navigate = useNavigate();
    const { login } = useAuth();
    const email = localStorage.getItem('tempEmail');

    useEffect(() => {
        if (!email) navigate('/signup');

        const countdown = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(countdown);
    }, [email, navigate]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Auto focus next
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');
        if (otpCode.length < 6) return setError('Please enter full OTP');

        setError('');
        setLoading(true);
        try {
            const { data } = await authService.verifyOTP({ email, otp: otpCode });
            setSuccess(true);
            setTimeout(() => {
                login(data.user, data.token);
                localStorage.removeItem('tempEmail');
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError('');
        try {
            await authService.resendOTP(email);
            setTimer(300);
            alert('New OTP sent!');
        } catch (err) {
            setError('Failed to resend OTP');
        } finally {
            setResending(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-cbre-light dark:bg-cbre-dark">
                <div className="cbre-card text-center max-w-sm w-full py-12">
                    <div className="flex justify-center mb-6">
                        <CheckCircle2 className="h-20 w-20 text-cbre-green animate-bounce" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Verification Successful</h2>
                    <p className="text-gray-600 dark:text-gray-400">Account activated. Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-cbre-light dark:bg-[#0f0f0f]">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-cbre-green mb-2 tracking-tight">CBRE</h1>
                    <p className="text-cbre-gray dark:text-gray-400 font-medium uppercase text-xs tracking-widest">Corporate Security</p>
                </div>

                <div className="cbre-card">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-cbre-green/10 rounded-full">
                            <ShieldCheck className="h-8 w-8 text-cbre-green" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-center text-gray-800 dark:text-white">Verify Your Email</h2>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-8">
                        We sent a 6-digit code to <span className="font-bold text-cbre-dark dark:text-white">{email}</span>
                    </p>

                    {error && (
                        <div className="mb-6 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-between gap-2 mb-8">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:border-cbre-green focus:ring-0 outline-none transition-all dark:bg-[#2a2a2a] dark:text-white dark:border-gray-700"
                                />
                            ))}
                        </div>

                        <button type="submit" disabled={loading} className="w-full cbre-btn-primary flex items-center justify-center mb-6">
                            {loading ? <Loader2 className="animate-spin mr-2" /> : 'Verify Account'}
                        </button>

                        <div className="text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                Code expires in <span className={`font-mono font-bold ${timer < 60 ? 'text-red-500' : 'text-cbre-green'}`}>{formatTime(timer)}</span>
                            </p>
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resending || timer > 240}
                                className="flex items-center justify-center mx-auto text-sm font-bold text-cbre-green hover:underline disabled:opacity-30 disabled:no-underline"
                            >
                                {resending ? <RefreshCw className="h-4 w-4 animate-spin mr-1" /> : 'Resend Code'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
