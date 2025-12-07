"use client";

import { PromptItem } from '@/lib/types';

interface BatchActionBarProps {
  selectedCount: number;
  totalCount: number;
  onDelete: () => void;
  onExport: () => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
}

export default function BatchActionBar({
  selectedCount,
  totalCount,
  onDelete,
  onExport,
  onSelectAll,
  isAllSelected
}: BatchActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="mb-6 p-4 bg-purple-900/10 border border-purple-900/30 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-fade-in">
      <div className="flex items-center gap-4">
        <span className="text-purple-400 font-medium text-sm">
          已选择 {selectedCount} / {totalCount} 项
        </span>
        <button
          onClick={onSelectAll}
          className="text-xs text-purple-400 hover:text-purple-300 underline transition"
        >
          {isAllSelected ? '取消全选' : '全选'}
        </button>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={onExport}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition text-sm font-medium flex items-center gap-2"
        >
          <i className="fa-solid fa-download"></i>
          导出
        </button>
        <button 
          onClick={onDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition text-sm font-medium flex items-center gap-2"
        >
          <i className="fa-solid fa-trash"></i>
          删除
        </button>
      </div>
    </div>
  );
}
