'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import ServiceCard from '@/components/ServiceCard';
import MapComponent from '@/components/Map';
import { Phone, ArrowRight, MapPin } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error('Error fetching services:', err));
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-20 pt-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1535970793482-07de93762dc4?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-60"></div>
        </div>

        <div className="container mx-auto px-4 relative z-20 text-center">
          <div className="inline-block mb-4 px-4 py-1 rounded-full border border-red-600/50 bg-red-900/20 text-red-400 text-sm font-bold uppercase tracking-widest backdrop-blur-sm animate-fade-in-up">
            Especialistas en Neumáticos y llantas
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none animate-fade-in-up delay-100">
            <span className="text-white block">TU AUTO</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 text-glow">EN LAS MEJORES</span>
            <span className="text-white block">MANOS</span>
          </h1>

          <p className="text-xl md:text-2xl text-neutral-300 mb-10 max-w-2xl mx-auto font-light animate-fade-in-up delay-200">
            Servicio premium de gomería en Temperley. Atención personalizada para tu vehículo.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center animate-fade-in-up delay-300">
            <a
              href="#servicios"
              className="group bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-sm font-bold text-lg transition-all flex items-center justify-center gap-3 skew-x-[-10deg] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]"
            >
              <span className="skew-x-[10deg] flex items-center gap-2">VER SERVICIOS</span>
            </a>
            <a
              href="https://wa.me/5491140707802"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-transparent border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-sm font-bold text-lg transition-all flex items-center justify-center gap-3 skew-x-[-10deg] backdrop-blur-sm"
            >
              <span className="skew-x-[10deg] flex items-center gap-2"><Phone size={20} /> CONSULTAR AHORA</span>
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-32 bg-black relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-900/10 to-transparent pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-5xl font-black text-white mb-2 tracking-tighter">NUESTROS <span className="text-blue-600">SERVICIOS</span></h2>
              <div className="w-24 h-2 bg-red-600 skew-x-[-20deg]"></div>
            </div>
            <p className="text-neutral-400 max-w-md text-right md:text-left">
              Ofrecemos una gama completa de soluciones para mantener tus ruedas en perfecto estado.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.length > 0 ? (
              services.map(service => (
                <ServiceCard
                  key={service.id}
                  id={service.id}
                  name={service.name}
                  description={service.description}
                  price={service.price}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="inline-block w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-neutral-500">Cargando servicios...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="ubicacion" className="py-32 bg-neutral-950 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute -left-20 top-20 w-96 h-96 bg-red-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute -right-20 bottom-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>

        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <div className="mb-12">
              <h2 className="text-5xl font-black text-white mb-2 tracking-tighter">DÓNDE <span className="text-red-600">ESTAMOS</span></h2>
              <div className="w-24 h-2 bg-blue-600 skew-x-[-20deg] mb-6"></div>
              <p className="text-neutral-400 text-lg leading-relaxed">
                Contamos con un taller amplio y equipado para brindarte la mejor atención.
              </p>
            </div>

            <div className="space-y-8">
              <div className="glass-card p-6 rounded-xl flex items-start gap-6 group hover:border-red-600/30 transition-colors">
                <div className="bg-neutral-900 p-4 rounded-lg text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-lg">
                  <MapPin size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Dirección</h3>
                  <p className="text-neutral-300 text-lg">Ruben Darío 530</p>
                  <p className="text-neutral-500">Temperley, Buenos Aires</p>
                </div>
              </div>

              <a href="https://wa.me/5491140707802" target="_blank" rel="noopener noreferrer" className="glass-card p-6 rounded-xl flex items-start gap-6 group hover:border-green-600/30 transition-colors cursor-pointer">
                <div className="bg-neutral-900 p-4 rounded-lg text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300 shadow-lg">
                  <Phone size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Contacto Directo</h3>
                  <p className="text-neutral-300 text-lg">11-4070-7802</p>
                  <p className="text-neutral-500">Atención inmediata por WhatsApp</p>
                </div>
              </a>
            </div>
          </div>

          <div className="relative">
            <MapComponent />
          </div>
        </div>
      </section>
    </Layout>
  );
}
