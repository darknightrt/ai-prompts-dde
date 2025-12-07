"use client";

import { PromptItem } from '@/lib/types';
import PromptCard from './PromptCard';

interface PromptGridProps {
  prompts: PromptItem[];
  isManageMode: boolean;
  selectedIds: Set<string | number>;
  onToggleSelect: (id: string | number) => void;
  onEdit: (prompt: PromptItem) => void;
}

export default function PromptGrid({
  prompts,
  isManageMode,
  selectedIds,
  onToggleSelect,
  onEdit
}: PromptGridProps) {
  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-zinc-500">
        <i className="fa-solid fa-box-open text-6xl mb-4 opacity-30"></i>
        <p className="text-sm">未找到匹配的提示词</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 auto-rows-fr">
      {prompts.map((prompt) => (
        <PromptCard 
          key={prompt.id} 
          data={prompt} 
          isManageMode={isManageMode}
          isSelected={selectedIds.has(prompt.id)}
          onToggleSelect={onToggleSelect}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
