"use client";

interface WorkflowBatchActionBarProps {
  selectedCount: number;
  totalCount: number;
  onDelete: () => void;
  onExport: () => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
}

export default function WorkflowBatchActionBar({
  selectedCount,
  totalCount,
  onDelete,
  onExport,
  onSelectAll,
  isAllSelected,
}: WorkflowBatchActionBarProps) {
  return (
    <div className="flex items-center justify-between p-3 mb-4 bg-purple-600/10 border border-purple-600/30 rounded-lg">
      <div className="flex items-center gap-4">
        <button
          onClick={onSelectAll}
          className="text-sm text-purple-400 hover:text-purple-300 transition"
        >
          {isAllSelected ? '取消全选' : '全选'}
        </button>
        <span className="text-sm text-zinc-400">
          已选择 <span className="text-purple-400 font-semibold">{selectedCount}</span> / {totalCount} 个工作流
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onExport}
          disabled={selectedCount === 0}
          className={`px-3 py-1.5 rounded-lg text-sm transition flex items-center gap-2 ${
            selectedCount > 0
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          <i className="fa-solid fa-file-export"></i>
          导出
        </button>
        <button
          onClick={onDelete}
          disabled={selectedCount === 0}
          className={`px-3 py-1.5 rounded-lg text-sm transition flex items-center gap-2 ${
            selectedCount > 0
              ? 'bg-red-600 hover:bg-red-500 text-white'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          <i className="fa-solid fa-trash"></i>
          删除
        </button>
      </div>
    </div>
  );
}
