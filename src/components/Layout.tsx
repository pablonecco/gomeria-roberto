import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, Menu, Instagram, Lock } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-sans selection:bg-red-600 selection:text-white">
      {/* Glass Header */}
      <header className="fixed w-full top-0 z-50 glass border-b border-white/5">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black tracking-tighter italic group">
            <span className="text-white group-hover:text-red-500 transition-colors">GOMERÍA</span>
            <span className="text-red-600 group-hover:text-white transition-colors ml-1">ROBERTO</span>
          </Link>

          <nav className="hidden md:flex gap-8 items-center font-medium uppercase text-sm tracking-widest">
            <Link href="/" className="hover:text-red-500 transition-colors relative group">
              Inicio
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link href="#servicios" className="hover:text-red-500 transition-colors relative group">
              Servicios
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link href="#ubicacion" className="hover:text-red-500 transition-colors relative group">
              Ubicación
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="flex items-center gap-1 text-xs text-neutral-500 hover:text-white uppercase tracking-widest transition-colors">
              <Lock size={14} />
              <span className="hidden sm:inline">Admin</span>
            </Link>
            <a
              href="https://wa.me/5491140707802"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-sm skew-x-[-10deg] flex items-center gap-2 text-sm font-bold transition-all hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]"
            >
              <div className="skew-x-[10deg] flex items-center gap-2">
                <Phone size={16} />
                <span>WHATSAPP</span>
              </div>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-blue-600 to-red-600 opacity-50"></div>

        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12 relative z-10">
          <div>
            <h3 className="text-2xl font-black italic mb-6">
              <span className="text-white">GOMERÍA</span> <span className="text-red-600">ROBERTO</span>
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              Más de 20 años brindando seguridad y confianza en Temperley. Especialistas en reparación de llantas, balanceo y venta de neumáticos de todas las marcas.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/neumaticosroberto/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center text-neutral-400 hover:bg-pink-600 hover:text-white transition-all">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-6 border-l-4 border-red-600 pl-3">Contacto</h4>
            <ul className="space-y-4 text-neutral-400 text-sm">
              <li className="flex items-start gap-3 group">
                <MapPin size={18} className="text-red-600 mt-0.5 group-hover:text-white transition-colors" />
                <span className="group-hover:text-white transition-colors">Ruben Darío 530, Temperley<br />Provincia de Buenos Aires</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone size={18} className="text-blue-500 group-hover:text-white transition-colors" />
                <span className="group-hover:text-white transition-colors">11-4070-7802</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-6 border-l-4 border-blue-600 pl-3">Horarios</h4>
            <div className="space-y-2 text-neutral-400 text-sm">
              <div className="flex justify-between border-b border-neutral-900 pb-2">
                <span>Lunes a Viernes</span>
                <span className="text-white font-medium">8:30 - 18:00</span>
              </div>
              <div className="flex justify-between border-b border-neutral-900 pb-2">
                <span>Sábados</span>
                <span className="text-white font-medium">8:30 - 13:00</span>
              </div>
              <div className="flex justify-between pt-2">
                <span>Domingos</span>
                <span className="text-red-500 font-medium">Cerrado</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-neutral-900 text-center text-xs text-neutral-600 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Gomería Roberto. Design by Antigravity.
        </div>
      </footer>
    </div>
  );
}
