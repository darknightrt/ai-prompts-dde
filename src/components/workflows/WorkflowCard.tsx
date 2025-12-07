"use client";

import { WorkflowItem, WorkflowCategory, WorkflowComplexity } from '@/lib/types';
import { useWorkflowFavorites } from '@/context/WorkflowFavoritesContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface WorkflowCardProps {
  workflow: WorkflowItem;
  onClick: () => void;
  isManageMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string | number) => void;
  onEdit?: (workflow: WorkflowItem) => void;
}

const CATEGORY_LABELS: Record<WorkflowCategory, string> = {
  all: '全部',
  n8n: 'n8n',
  comfyui: 'ComfyUI',
  dify: 'Dify',
  other: '其他',
  favorites: '我的收藏',
};

const CATEGORY_COLORS: Record<WorkflowCategory, string> = {
  all: 'bg-gray-500',
  n8n: 'bg-orange-500',
  comfyui: 'bg-blue-500',
  dify: 'bg-green-500',
  other: 'bg-purple-500',
  favorites: 'bg-red-500',
};

// 复杂度配置
const COMPLEXITY_CONFIG: Record<WorkflowComplexity, { label: string; color: string }> = {
  beginner: { label: '初级', color: 'bg-green-500 text-black' },
  intermediate: { label: '中级', color: 'bg-yellow-500 text-white' },
  advanced: { label: '高级', color: 'bg-red-500 text-white' },
};

export default function WorkflowCard({ 
  workflow, 
  onClick,
  isManageMode = false,
  isSelected = false,
  onToggleSelect,
  onEdit
}: WorkflowCardProps) {
  const { isFavorite, toggleFavorite } = useWorkflowFavorites();
  const { isLoggedIn, canEdit: checkCanEdit } = useAuth();
  const { showToast } = useToast();
  
  // 权限检查：管理员可以编辑所有，普通用户只能编辑自己创建的
  const canEdit = checkCanEdit(workflow.isCustom);
  
  const coverImage = workflow.images[0] || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800';
  const complexityLevel = workflow.complexity || 'beginner';
  
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSelect?.(workflow.id);
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      showToast('请先登录后再收藏工作流', 'error');
      return;
    }
    
    toggleFavorite(workflow.id);
    showToast(isFavorite(workflow.id) ? '已取消收藏' : '已收藏！', 'success');
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(workflow);
  };

  return (
    <div 
      onClick={onClick}
      className={`group relative bg-[#111] rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer hover:border-purple-600/50 hover:shadow-lg hover:shadow-purple-600/10 ${
        isSelected ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-zinc-800'
      }`}
    >
      {/* 管理模式选择框 */}
      {isManageMode && (
        <div 
          className="absolute top-3 left-3 z-20"
          onClick={handleSelect}
        >
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
            isSelected 
              ? 'bg-purple-600 border-purple-600' 
              : 'border-zinc-500 bg-black/50 hover:border-purple-500'
          }`}>
            {isSelected && <i className="fa-solid fa-check text-white text-xs"></i>}
          </div>
        </div>
      )}

      {/* 封面图片 */}
      <div className="relative aspect-video overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={coverImage} 
          alt={workflow.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {/* 复杂度和分类标签 */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${COMPLEXITY_CONFIG[complexityLevel].color}`}>
            {COMPLEXITY_CONFIG[complexityLevel].label}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-medium text-white rounded ${CATEGORY_COLORS[workflow.category]}`}>
            {CATEGORY_LABELS[workflow.category]}
          </span>
        </div>

        {/* 图片数量指示 */}
        {workflow.images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/60 rounded text-xs text-white">
            <i className="fa-solid fa-images"></i>
            <span>{workflow.images.length}</span>
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-base mb-2 line-clamp-1 group-hover:text-purple-400 transition">
          {workflow.title}
        </h3>
        <p className="text-zinc-400 text-sm line-clamp-2 mb-3">
          {workflow.description}
        </p>
        
        {/* 底部信息 */}
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <i className="fa-solid fa-eye"></i>
              {workflow.views || 0}
            </span>
            <span className="flex items-center gap-1">
              <i className="fa-solid fa-download"></i>
              {workflow.downloads || 0}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>
              {workflow.createdAt 
                ? new Date(workflow.createdAt).toLocaleDateString('zh-CN')
                : '未知日期'
              }
            </span>
            {/* 编辑按钮 */}
            {canEdit && !isManageMode && (
              <button 
                onClick={handleEditClick}
                className="text-zinc-500 hover:text-purple-400 transition"
                title="编辑"
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
            )}
            {/* 收藏按钮 */}
            <button 
              onClick={handleFavoriteToggle}
              className={`transition ${
                isFavorite(workflow.id) 
                  ? 'text-red-500 hover:text-red-400' 
                  : 'text-zinc-500 hover:text-red-400'
              }`}
              title={isLoggedIn ? '收藏' : '请先登录'}
            >
              <i className={isFavorite(workflow.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
