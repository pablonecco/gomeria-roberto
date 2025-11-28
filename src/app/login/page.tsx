'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                router.push('/admin');
            } else {
                setError('Usuario o contraseña incorrectos');
                setLoading(false);
            }
        } catch (err) {
            setError('Ocurrió un error al intentar ingresar');
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2566&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black"></div>

                <div className="relative z-10 w-full max-w-md px-4">
                    <div className="glass-card p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl">
                        <div className="flex justify-center mb-8">
                            <div className="w-20 h-20 bg-neutral-900/80 rounded-full flex items-center justify-center border border-red-600/30 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                                <ShieldCheck className="text-red-600" size={40} />
                            </div>
                        </div>

                        <h2 className="text-3xl font-black text-center text-white mb-2 tracking-tight">ACCESO ADMIN</h2>
                        <p className="text-neutral-500 text-center mb-8 text-sm uppercase tracking-widest">Neumáticos Roberto</p>

                        {error && (
                            <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-4 rounded-lg mb-6 text-sm text-center flex items-center justify-center gap-2 animate-shake">
                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-neutral-400 text-xs font-bold uppercase tracking-widest ml-1">Usuario</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 text-white focus:border-red-600 focus:bg-neutral-900 focus:outline-none transition-all placeholder:text-neutral-700"
                                        placeholder="Ingrese su usuario"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-neutral-400 text-xs font-bold uppercase tracking-widest ml-1">Contraseña</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 text-white focus:border-red-600 focus:bg-neutral-900 focus:outline-none transition-all placeholder:text-neutral-700"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>INGRESAR AL SISTEMA <ArrowRight size={20} /></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
