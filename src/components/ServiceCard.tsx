import React from 'react';
import { Wrench, Disc, CircleDot, Hammer, RefreshCw } from 'lucide-react';

interface ServiceProps {
    id: string;
    name: string;
    description?: string;
    price: string;
}

const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('llanta')) return <Disc size={28} />;
    if (lower.includes('balanceo')) return <CircleDot size={28} />;
    if (lower.includes('cubierta')) return <Disc size={28} />; // Using Disc for tires too
    if (lower.includes('parchado') || lower.includes('vulcanizado')) return <Hammer size={28} />;
    if (lower.includes('rotación') || lower.includes('rotacion')) return <RefreshCw size={28} />;
    return <Wrench size={28} />;
};

export default function ServiceCard({ name, description, price }: ServiceProps) {
    return (
        <div className="glass-card p-8 rounded-xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="w-16 h-16 bg-neutral-900/50 rounded-2xl flex items-center justify-center mb-6 text-neutral-400 group-hover:text-red-500 group-hover:scale-110 transition-all duration-300 border border-white/5 group-hover:border-red-500/30 shadow-lg">
                {getIcon(name)}
            </div>

            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide group-hover:text-red-500 transition-colors">{name}</h3>

            {description && <p className="text-neutral-400 text-sm mb-6 leading-relaxed border-b border-white/5 pb-4">{description}</p>}

            <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-neutral-500 uppercase tracking-widest">Precio</span>
                {price.toLowerCase().includes('consultar') ? (
                    <a
                        href="https://wa.me/5491140707802"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 font-black text-xl text-glow-blue hover:text-blue-300 transition-colors flex items-center gap-1"
                    >
                        {price} <span className="text-xs">↗</span>
                    </a>
                ) : (
                    <div className="text-blue-400 font-black text-xl text-glow-blue">
                        {price}
                    </div>
                )}
            </div>
        </div>
    );
}
