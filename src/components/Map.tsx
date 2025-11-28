import React from 'react';

export default function Map() {
    return (
        <div className="relative w-full h-[500px] rounded-2xl overflow-hidden glass-card p-2 group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"></div>

            <div className="w-full h-full rounded-xl overflow-hidden relative z-0">
                <iframe
                    width="100%"
                    height="100%"
                    id="gmap_canvas"
                    src="https://maps.google.com/maps?q=Ruben+Dario+530,Temperley&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    title="Ubicación Gomería Roberto"
                    className="filter grayscale contrast-125 invert-[.9] hue-rotate-180 transition-all duration-700 group-hover:grayscale-0 group-hover:invert-0 group-hover:hue-rotate-0"
                ></iframe>
            </div>

            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-red-600 rounded-tl-xl z-20"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-600 rounded-br-xl z-20"></div>
        </div>
    );
}
