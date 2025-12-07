"use client";

import { useEffect, useState } from 'react';

interface LightboxProps {
  src: string | null;
  onClose: () => void;
}

export default function Lightbox({ src, onClose }: LightboxProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (src) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [src]);

  if (!src) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-black/90 flex items-center justify-center cursor-zoom-out p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={src} 
        alt="Lightbox Preview" 
        className={`max-w-full max-h-full rounded-lg shadow-2xl transition-transform duration-300 ${isVisible ? 'scale-100' : 'scale-95'}`} 
      />
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 text-white/70 hover:text-white text-4xl focus:outline-none"
      >
        &times;
      </button>
    </div>
  );
}
