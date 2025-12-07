"use client";

import { WorkflowCategory, WorkflowComplexity } from '@/lib/types';
import { useWorkflowFavorites } from '@/context/WorkflowFavoritesContext';

interface CategoryStat {
  category: WorkflowCategory;
  count: number;
}

interface ComplexityStat {
  complexity: WorkflowComplexity;
  count: number;
}

interface WorkflowFilterSidebarProps {
  currentCategory: WorkflowCategory;
  categoryStats: CategoryStat[];
  onCategoryChange: (category: WorkflowCategory) => void;
  currentComplexity?: WorkflowComplexity | 'all';
  complexityStats?: ComplexityStat[];
  onComplexityChange?: (complexity: WorkflowComplexity | 'all') => void;
}

// 复杂度配置 - 初级绿色、中级黄色、高级红色
const COMPLEXITY_CONFIG: { id: WorkflowComplexity | 'all'; label: string; color: string; description: string }[] = [
  { id: 'beginner', label: '初级', color: 'bg-green-500', description: '适合新手,易于理解' },
  { id: 'intermediate', label: '中级', color: 'bg-yellow-500', description: '需要一定工作流基础知识和技术经验' },
  { id: 'advanced', label: '高级', color: 'bg-red-500', description: '需要高超的工作流和相关技术经验' },
];

// 分类配置 - 不包含 'all'，因为取消选中就是全部
const CATEGORY_LIST: { id: Exclude<WorkflowCategory, 'all'>; label: string }[] = [
  { id: 'n8n', label: 'n8n' },
  { id: 'comfyui', label: 'ComfyUI' },
  { id: 'dify', label: 'Dify' },
  { id: 'other', label: '其他' },
  { id: 'favorites', label: '我的收藏' },
];

export default function WorkflowFilterSidebar({
  currentCategory,
  categoryStats,
  onCategoryChange,
  currentComplexity = 'all',
  complexityStats = [],
  onComplexityChange,
}: WorkflowFilterSidebarProps) {
  const { getFavoriteCount } = useWorkflowFavorites();
  
  const getCount = (cat: WorkflowCategory) => {
    if (cat === 'all') {
      return categoryStats.reduce((sum, s) => sum + s.count, 0);
    }
    if (cat === 'favorites') {
      return getFavoriteCount();
    }
    return categoryStats.find(s => s.category === cat)?.count || 0;
  };
  
  const getComplexityCount = (complexity: WorkflowComplexity) => {
    return complexityStats.find(s => s.complexity === complexity)?.count || 0;
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0 px-4 sm:px-6 lg:px-8 py-6 border-r border-zinc-800">
      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
        筛选条件
      </h3>
      
      {/* 分类筛选 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-zinc-400 mb-3">分类</h4>
        <ul className="space-y-2">
          {CATEGORY_LIST.map((item) => {
            const count = getCount(item.id);
            const isActive = currentCategory === item.id;
            
            // 点击逻辑：选中则取消（回到 all），未选中则选中
            const handleClick = () => {
              if (isActive) {
                onCategoryChange('all'); // 取消选中，回到全部
              } else {
                onCategoryChange(item.id);
              }
            };
            
            return (
              <li key={item.id}>
                <button
                  onClick={handleClick}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm transition text-zinc-400 hover:text-zinc-200"
                >
                  <span className="flex items-center gap-2">
                    {/* 复选框样式 */}
                    <span className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                      isActive 
                        ? 'bg-purple-500 border-purple-500' 
                        : 'border-zinc-500 bg-transparent'
                    }`}>
                      {isActive && (
                        <i className="fa-solid fa-check text-white text-xs"></i>
                      )}
                    </span>
                    {item.label}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 复杂度筛选 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-zinc-400 mb-3">复杂度</h4>
        <ul className="space-y-2">
          {COMPLEXITY_CONFIG.map((item) => {
            const isActive = currentComplexity === item.id;
            
            // 点击逻辑：选中则取消（回到 all），未选中则选中
            const handleClick = () => {
              if (isActive) {
                onComplexityChange?.('all'); // 取消选中，回到全部
              } else {
                onComplexityChange?.(item.id);
              }
            };
            
            return (
              <li key={item.id}>
                <button
                  onClick={handleClick}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm transition text-zinc-400 hover:text-zinc-200"
                >
                  <span className="flex items-center gap-2">
                    {/* 复选框样式 */}
                    <span className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                      isActive 
                        ? 'bg-purple-500 border-purple-500' 
                        : 'border-zinc-500 bg-transparent'
                    }`}>
                      {isActive && (
                        <i className="fa-solid fa-check text-white text-xs"></i>
                      )}
                    </span>
                    {item.label}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {getComplexityCount(item.id as WorkflowComplexity)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
