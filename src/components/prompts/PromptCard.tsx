"use client";

import Link from 'next/link';
import { PromptItem } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';

interface PromptCardProps {
  data: PromptItem;
  isManageMode: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string | number) => void;
  onEdit?: (prompt: PromptItem) => void; 
}

export default function PromptCard({ data, isManageMode, isSelected, onToggleSelect, onEdit }: PromptCardProps) {
  const { showToast } = useToast();
  const { canEdit: checkCanEdit, isLoggedIn } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(data.prompt);
    showToast('已复制到剪贴板！');
  };

  const handleFavoriteToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      showToast('请先登录后再收藏提示词', 'error');
      return;
    }
    
    toggleFavorite(data.id);
    showToast(isFavorite(data.id) ? '已取消收藏' : '已收藏！', 'success');
  };

  const handleSelect = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onToggleSelect(data.id);
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (onEdit) onEdit(data);
  };

  // 格式化创建时间
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '未知';
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 生成随机数据用于展示 UI 效果 (Mock Data)
  const randomViews = Math.floor(Math.random() * 500) + 50;
  const randomDownloads = Math.floor(Math.random() * 20);
  
  // Complexity UI Logic
  const complexityLevel = data.complexity || 'beginner';
  const levelLabels = {
      'beginner': '初级',
      'intermediate': '中级',
      'advanced': '高级'
  };
  const levelColor = complexityLevel === 'beginner' ? 'bg-yellow-500 text-black' : (complexityLevel === 'intermediate' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white');

  // 权限检查：管理员可以编辑所有，普通用户只能编辑自己创建的
  const canEdit = checkCanEdit(data.isCustom);

  return (
    <div 
        className={`group relative bg-[#111] border rounded-xl flex flex-col h-full overflow-hidden transition-all duration-300 hover:border-zinc-600 hover:shadow-lg hover:shadow-purple-900/10 ${
            isSelected ? 'border-purple-500 ring-1 ring-purple-500' : 'border-zinc-800'
        }`}
    >
      
      {/* Manage Mode Overlay */}
      {isManageMode && (
        <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-[1px] cursor-pointer flex items-start justify-end p-3" onClick={handleSelect}>
            <input 
              type="checkbox" 
              checked={isSelected} 
              readOnly 
              className="w-5 h-5 rounded border-zinc-500 text-purple-600 focus:ring-purple-500 cursor-pointer"
            />
        </div>
      )}

      {/* 右上角复制按钮 */}
      {!isManageMode && (
        <button 
          onClick={handleCopy}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800/80 text-zinc-400 hover:text-purple-400 hover:bg-zinc-700/80 transition"
          title="复制 Prompt"
        >
          <i className="fa-regular fa-copy"></i>
        </button>
      )}

      <Link href={`/prompts/${data.id}`} className="flex-grow flex flex-col">
        
        {/* Middle: Content Info */}
        <div className="p-5 pt-4 flex-grow flex flex-col">
          {/* Floating Tags */}
          <div className="flex gap-2 mb-3">
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${levelColor}`}>
                  {levelLabels[complexityLevel]}
              </span>
          </div>
          <h3 className="text-base font-bold text-gray-100 mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
            {data.title}
          </h3>
          <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed mb-4 flex-grow">
            {data.desc || data.prompt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-2">
              {data.isCustom && (
                  <span className="px-2 py-1 bg-purple-900/20 text-purple-400 text-xs rounded border border-purple-900/30">
                      新建
                  </span>
              )}
              {/* 自定义标签 */}
              {data.tags && data.tags.map((tag, index) => {
                  const colorStyles: Record<string, { bg: string; text: string; border: string }> = {
                      purple: { bg: 'bg-purple-900/30', text: 'text-purple-400', border: 'border-purple-700' },
                      green: { bg: 'bg-green-900/30', text: 'text-green-400', border: 'border-green-700' },
                      blue: { bg: 'bg-blue-900/30', text: 'text-blue-400', border: 'border-blue-700' },
                      yellow: { bg: 'bg-yellow-900/30', text: 'text-yellow-400', border: 'border-yellow-700' }
                  };
                  const style = colorStyles[tag.color] || colorStyles.purple;
                  return (
                      <span 
                          key={index}
                          className={`px-2 py-1 text-xs rounded border ${style.bg} ${style.text} ${style.border}`}
                      >
                          {tag.text}
                      </span>
                  );
              })}
          </div>
        </div>
      </Link>

      {/* Bottom: Stats & Actions Bar */}
      <div className="px-5 py-3 border-t border-zinc-800 flex justify-between items-center bg-[#0e0e0e]">
        
        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
                <i className="fa-regular fa-calendar"></i> {formatDate(data.createdAt)}
            </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
            {/* Edit Button */}
            {canEdit && !isManageMode && (
                <button 
                    onClick={handleEditClick}
                    className="text-zinc-500 hover:text-purple-400 transition"
                    title="编辑"
                >
                    <i className="fa-solid fa-pen-to-square"></i>
                </button>
            )}
            <button 
                onClick={handleFavoriteToggle}
                className={`transition ${
                    isFavorite(data.id) 
                        ? 'text-red-500 hover:text-red-400' 
                        : 'text-zinc-500 hover:text-red-400'
                }`}
                title={isLoggedIn ? '收藏' : '请先登录'}
            >
                <i className={isFavorite(data.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
            </button>
        </div>
      </div>
    </div>
  );
}