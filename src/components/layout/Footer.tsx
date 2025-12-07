import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-10 text-center border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <p className="mb-2 text-lg font-semibold text-white">AI Prompts Master</p>
        <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} AI Prompt Development. Built with Next.js & Tailwind.</p>
      </div>
    </footer>
  );
}