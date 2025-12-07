"use client";

import { useState, ChangeEvent } from 'react';

interface SearchBarProps {
  defaultValue?: string;
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ 
  defaultValue = '', 
  onSearch,
  placeholder = '搜索提示词...'
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(defaultValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalValue(value);
    onSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localValue);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <form onSubmit={handleSubmit} className="relative max-w-2xl">
        <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 z-10"></i>
        <input 
          type="text" 
          placeholder={placeholder}
          value={localValue}
          onChange={handleChange}
          className="w-full pl-12 pr-24 py-3 rounded-lg border border-zinc-800 bg-[#111] text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-zinc-500 transition-all"
        />
        <button 
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-md transition-colors font-medium"
        >
          搜索
        </button>
      </form>
    </div>
  );
}
