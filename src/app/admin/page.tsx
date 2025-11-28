'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { Trash2, Edit, Plus, Save, X, LogOut, Settings, Search } from 'lucide-react';

interface Service {
    id: string;
    name: string;
    description: string;
    price: string;
}

export default function Admin() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Service>>({});
    const router = useRouter();

    useEffect(() => {
        // Check authentication by calling the auth endpoint
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth');
                if (!res.ok) {
                    router.push('/ login');
                    return;
                }
                const data = await res.json();
                if (!data.authenticated) {
                    router.push('/login');
                    return;
                }
                // User is authenticated, fetch services
                fetchServices();
            } catch {
                router.push('/login');
            }
        };
        checkAuth();
    }, [router]);

    const fetchServices = async () => {
        try {
            const res = await fetch('/api/services');
            if (res.ok) {
                const data = await res.json();
                setServices(data);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth', { method: 'DELETE' });
        router.push('/login');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este servicio?')) return;

        try {
            const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setServices(services.filter(s => s.id !== id));
            } else {
                if (res.status === 401) router.push('/login');
                else alert('Error al eliminar');
            }
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const handleEdit = (service: Service) => {
        setEditingId(service.id);
        setFormData(service);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({});
    };

    const handleSave = async () => {
        if (!formData.name || !formData.price) {
            alert('Nombre y precio son obligatorios');
            return;
        }

        try {
            const method = editingId === 'new' ? 'POST' : 'PUT';
            const body = editingId === 'new' ? formData : { ...formData, id: editingId };

            const res = await fetch('/api/services', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                const savedService = await res.json();
                if (editingId === 'new') {
                    setServices([...services, savedService]);
                } else {
                    setServices(services.map(s => s.id === savedService.id ? savedService : s));
                }
                setEditingId(null);
                setFormData({});
            } else {
                if (res.status === 401) router.push('/login');
                else alert('Error al guardar');
            }
        } catch (error) {
            console.error('Error saving:', error);
        }
    };

    const handleAddNew = () => {
        setEditingId('new');
        setFormData({ name: '', description: '', price: '' });
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">PANEL DE CONTROL</h1>
                        <p className="text-neutral-400 flex items-center gap-2">
                            <Settings size={16} /> Gestión de servicios y precios
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:border-red-900/50"
                    >
                        <LogOut size={18} /> <span className="font-bold text-sm">CERRAR SESIÓN</span>
                    </button>
                </div>

                <div className="glass-card rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5">
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar servicio..."
                                className="bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white w-full md:w-64 focus:outline-none focus:border-blue-600 transition-colors"
                            />
                        </div>
                        <button
                            onClick={handleAddNew}
                            disabled={editingId !== null}
                            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-blue-600/20"
                        >
                            <Plus size={18} /> NUEVO SERVICIO
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-neutral-400">
                            <thead className="bg-neutral-950/50 text-neutral-300 uppercase font-bold tracking-wider text-xs">
                                <tr>
                                    <th className="px-8 py-5">Nombre del Servicio</th>
                                    <th className="px-8 py-5">Descripción</th>
                                    <th className="px-8 py-5">Precio</th>
                                    <th className="px-8 py-5 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {editingId === 'new' && (
                                    <tr className="bg-blue-900/10 animate-pulse-subtle">
                                        <td className="px-8 py-6">
                                            <input
                                                type="text"
                                                value={formData.name || ''}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="bg-black/50 border border-blue-500/50 rounded-lg p-3 w-full text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                placeholder="Nombre del servicio"
                                                autoFocus
                                            />
                                        </td>
                                        <td className="px-8 py-6">
                                            <input
                                                type="text"
                                                value={formData.description || ''}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                className="bg-black/50 border border-blue-500/50 rounded-lg p-3 w-full text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                placeholder="Descripción corta"
                                            />
                                        </td>
                                        <td className="px-8 py-6">
                                            <input
                                                type="text"
                                                value={formData.price || ''}
                                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                className="bg-black/50 border border-blue-500/50 rounded-lg p-3 w-full text-white font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                placeholder="$0.00"
                                            />
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors shadow-lg"><Save size={20} /></button>
                                                <button onClick={handleCancelEdit} className="bg-neutral-800 hover:bg-neutral-700 text-white p-2 rounded-lg transition-colors"><X size={20} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {services.map(service => (
                                    <tr key={service.id} className="hover:bg-white/5 transition-colors group">
                                        {editingId === service.id ? (
                                            <>
                                                <td className="px-8 py-6">
                                                    <input
                                                        type="text"
                                                        value={formData.name || ''}
                                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                        className="bg-black/50 border border-blue-500/50 rounded-lg p-3 w-full text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-8 py-6">
                                                    <input
                                                        type="text"
                                                        value={formData.description || ''}
                                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                        className="bg-black/50 border border-blue-500/50 rounded-lg p-3 w-full text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-8 py-6">
                                                    <input
                                                        type="text"
                                                        value={formData.price || ''}
                                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                        className="bg-black/50 border border-blue-500/50 rounded-lg p-3 w-full text-white font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex justify-end gap-3">
                                                        <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors shadow-lg"><Save size={20} /></button>
                                                        <button onClick={handleCancelEdit} className="bg-neutral-800 hover:bg-neutral-700 text-white p-2 rounded-lg transition-colors"><X size={20} /></button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-8 py-6">
                                                    <div className="font-bold text-white text-lg">{service.name}</div>
                                                    <div className="text-xs text-neutral-600 uppercase tracking-wider mt-1">ID: {service.id}</div>
                                                </td>
                                                <td className="px-8 py-6 text-neutral-400">{service.description}</td>
                                                <td className="px-8 py-6">
                                                    <span className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full font-bold border border-blue-500/20">
                                                        {service.price}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleEdit(service)} className="bg-neutral-800 hover:bg-blue-600 text-neutral-400 hover:text-white p-2 rounded-lg transition-all"><Edit size={18} /></button>
                                                        <button onClick={() => handleDelete(service.id)} className="bg-neutral-800 hover:bg-red-600 text-neutral-400 hover:text- white p-2 rounded-lg transition-all"><Trash2 size={18} /></button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
