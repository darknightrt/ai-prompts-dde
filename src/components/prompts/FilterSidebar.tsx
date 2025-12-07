"use client";

import { Category, Complexity } from '@/lib/types';

interface FilterSidebarProps {
  currentCategory: Category;
  currentComplexity: Complexity | 'all';
  categoryStats: Record<Category, number>;
  onCategoryChange: (category: Category) => void;
  onComplexityChange: (complexity: Complexity | 'all') => void;
}

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'all', label: '全部提示词' },
  { id: 'code', label: '编程开发' },
  { id: 'writing', label: '写作助手' },
  { id: 'mj', label: 'AI绘画' },
  { id: 'business', label: '商务办公' },
  { id: 'roleplay', label: '角色扮演' },
  { id: 'custom', label: '我的收藏' },
];

const COMPLEXITY_LEVELS: { id: Complexity; label: string }[] = [
  { id: 'beginner', label: '初级' },
  { id: 'intermediate', label: '中级' },
  { id: 'advanced', label: '高级' }
];

export default function FilterSidebar({
  currentCategory,
  currentComplexity,
  categoryStats,
  onCategoryChange,
  onComplexityChange
}: FilterSidebarProps) {
  return (
    <aside className="w-full md:w-64 flex-shrink-0 border-r border-zinc-800/50 bg-[#0a0a0a] px-4 sm:px-6 lg:px-8 py-6 hidden md:block">
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
          筛选条件
        </h3>
        
        {/* Category Filter Group */}
        <div className="mb-6">
          <h4 className="text-sm text-gray-500 mb-3">分类</h4>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                  currentCategory === cat.id 
                  ? 'bg-zinc-800 text-white font-medium' 
                  : 'text-gray-400 hover:bg-zinc-900 hover:text-gray-200'
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded text-gray-400">
                  {categoryStats[cat.id] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Complexity Filter */}
        <div className="mb-6">
          <h4 className="text-sm text-gray-500 mb-3">复杂度</h4>
          <div className="space-y-1">
            {COMPLEXITY_LEVELS.map(level => (
              <button
                key={level.id}
                onClick={() => onComplexityChange(currentComplexity === level.id ? 'all' : level.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  currentComplexity === level.id 
                  ? 'bg-zinc-800 text-white font-medium' 
                  : 'text-gray-400 hover:bg-zinc-900 hover:text-gray-200'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
