"use client";

import { useState, useRef, useEffect } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

export default function Accordion({ title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div className="group border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md hover:border-purple-500/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
      >
        <span className="font-semibold text-slate-900 dark:text-white">
          {title}
        </span>
        <span className={`transform transition-transform duration-300 text-gray-400 ${isOpen ? 'rotate-180' : ''}`}>
          <i className="fa-solid fa-chevron-down"></i>
        </span>
      </button>
      
      <div 
        style={{ height: `${height}px` }} 
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div ref={contentRef} className="px-6 pb-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}