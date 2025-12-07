"use client";

import { useState, useRef, useEffect } from 'react';
import { SortOption } from '@/hooks/usePromptFilters';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string; icon: string }[] = [
  { value: 'latest', label: '最新', icon: 'fa-clock' },
  { value: 'oldest', label: '最早', icon: 'fa-clock-rotate-left' },
  { value: 'title-asc', label: '标题 A-Z', icon: 'fa-arrow-up-a-z' },
  { value: 'title-desc', label: '标题 Z-A', icon: 'fa-arrow-up-z-a' },
];

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = SORT_OPTIONS.find(opt => opt.value === value) || SORT_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: SortOption) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#111] border border-zinc-800 rounded-lg text-sm text-gray-400 cursor-pointer hover:border-zinc-700 transition"
      >
        <i className={`fa-solid ${currentOption.icon}`}></i>
        <span>{currentOption.label}</span>
        <i className={`fa-solid fa-chevron-down text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-48 bg-[#111] border border-zinc-800 rounded-lg shadow-xl z-50 py-1 animate-fade-in">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left px-4 py-2 text-sm transition flex items-center gap-3 ${
                value === option.value
                  ? 'bg-zinc-800 text-white'
                  : 'text-gray-400 hover:bg-zinc-900 hover:text-gray-200'
              }`}
            >
              <i className={`fa-solid ${option.icon} w-4`}></i>
              <span>{option.label}</span>
              {value === option.value && (
                <i className="fa-solid fa-check ml-auto text-purple-400"></i>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
