"use client";

import { WorkflowItem } from '@/lib/types';
import WorkflowCard from './WorkflowCard';

interface WorkflowGridProps {
  workflows: WorkflowItem[];
  onWorkflowClick: (workflow: WorkflowItem) => void;
  isManageMode?: boolean;
  selectedIds?: Set<string | number>;
  onToggleSelect?: (id: string | number) => void;
  onEdit?: (workflow: WorkflowItem) => void;
}

export default function WorkflowGrid({ 
  workflows, 
  onWorkflowClick,
  isManageMode = false,
  selectedIds = new Set(),
  onToggleSelect,
  onEdit
}: WorkflowGridProps) {
  if (workflows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <i className="fa-solid fa-folder-open text-5xl text-zinc-600 mb-4"></i>
        <h3 className="text-lg font-medium text-zinc-400 mb-2">暂无工作流</h3>
        <p className="text-sm text-zinc-500">尝试调整筛选条件或创建新的工作流</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {workflows.map((workflow) => (
        <WorkflowCard
          key={workflow.id}
          workflow={workflow}
          onClick={() => onWorkflowClick(workflow)}
          isManageMode={isManageMode}
          isSelected={selectedIds.has(workflow.id)}
          onToggleSelect={onToggleSelect}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
