"use client";

import { useState, useRef, useEffect } from 'react';

export type WorkflowSortOption = 'latest' | 'popular' | 'downloads' | 'name';

interface WorkflowSortDropdownProps {
  value: WorkflowSortOption;
  onChange: (value: WorkflowSortOption) => void;
}

const SORT_OPTIONS: { value: WorkflowSortOption; label: string; icon: string }[] = [
  { value: 'latest', label: '最新发布', icon: 'fa-solid fa-clock' },
  { value: 'popular', label: '最多浏览', icon: 'fa-solid fa-fire' },
  { value: 'downloads', label: '最多下载', icon: 'fa-solid fa-download' },
  { value: 'name', label: '名称排序', icon: 'fa-solid fa-font' },
];

export default function WorkflowSortDropdown({ value, onChange }: WorkflowSortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption = SORT_OPTIONS.find(opt => opt.value === value) || SORT_OPTIONS[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 transition"
      >
        <i className={`${currentOption.icon} text-xs`}></i>
        <span>{currentOption.label}</span>
        <i className={`fa-solid fa-chevron-down text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-20 overflow-hidden animate-fade-in">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition ${
                value === option.value
                  ? 'bg-purple-600/20 text-purple-400'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <i className={`${option.icon} w-4`}></i>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
