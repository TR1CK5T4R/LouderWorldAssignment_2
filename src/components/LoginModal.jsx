import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginModal = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [focused, setFocused] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const result = await login(email, password);
            if (!result.success) setError(result.error);
        } catch {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/20 dark:bg-slate-950/80 backdrop-blur-lg"
            />

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.97 }}
                transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative w-full max-w-md overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/60 dark:border-slate-800 shadow-2xl shadow-slate-300/30 dark:shadow-slate-950/70 transition-colors duration-300"
            >
                {/* Top accent bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 dark:from-cyan-500 dark:via-blue-500 dark:to-indigo-600" />

                {/* Glow blobs */}
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-400/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-400/10 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative p-8 sm:p-10">
                    {/* Header */}
                    <div className="flex flex-col items-center text-center mb-9">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 dark:shadow-cyan-500/30 mb-5">
                            <Sparkles size={26} className="text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-2">
                            Welcome back
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[260px]">
                            Sign in to discover personalised events curated just for you.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pl-0.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail
                                    size={18}
                                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === 'email' ? 'text-blue-500 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500'}`}
                                />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onFocus={() => setFocused('email')}
                                    onBlur={() => setFocused(null)}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-11 pr-4 text-[15px] text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400/30 dark:focus:ring-cyan-500/30 focus:border-blue-400 dark:focus:border-cyan-500 transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between pl-0.5">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Password
                                </label>
                                <a href="#" className="text-[11px] font-bold text-blue-500 dark:text-cyan-400 hover:underline transition-colors">
                                    Forgot?
                                </a>
                            </div>
                            <div className="relative">
                                <Lock
                                    size={18}
                                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === 'pwd' ? 'text-blue-500 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500'}`}
                                />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onFocus={() => setFocused('pwd')}
                                    onBlur={() => setFocused(null)}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-11 pr-4 text-[15px] text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400/30 dark:focus:ring-cyan-500/30 focus:border-blue-400 dark:focus:border-cyan-500 transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm py-2.5 px-4 rounded-xl text-center font-medium">
                                        {error}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-[15px] text-white bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-600 dark:to-blue-600 shadow-lg shadow-blue-500/25 dark:shadow-cyan-500/25 transition-all duration-300 group
                                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/35 dark:hover:shadow-cyan-500/35 active:scale-[0.98]'}
                            `}
                        >
                            {loading
                                ? <Loader2 size={22} className="animate-spin" />
                                : <>
                                    <span>Sign In</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            }
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-7 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            No account?{' '}
                            <span className="font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer transition-colors">
                                Create one free
                            </span>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginModal;
