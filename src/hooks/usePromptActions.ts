import { useState, useCallback } from 'react';
import { PromptItem } from '@/lib/types';
import { usePrompts } from '@/context/PromptContext';
import { useToast } from '@/context/ToastContext';

export function usePromptActions() {
  const { deletePrompts } = usePrompts();
  const { showToast } = useToast();
  
  const [isManageMode, setIsManageMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  // 切换选择
  const toggleSelect = useCallback((id: string | number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // 全选/取消全选
  const toggleSelectAll = useCallback((prompts: PromptItem[]) => {
    if (selectedIds.size === prompts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(prompts.map(p => p.id)));
    }
  }, [selectedIds.size]);

  // 批量删除
  const batchDelete = useCallback(() => {
    if (selectedIds.size === 0) {
      showToast('请先选择要删除的项', 'error');
      return;
    }

    if (confirm(`确定删除选中的 ${selectedIds.size} 个提示词吗？`)) {
      deletePrompts(Array.from(selectedIds));
      setSelectedIds(new Set());
      setIsManageMode(false);
      showToast('删除成功', 'success');
    }
  }, [selectedIds, deletePrompts, showToast]);

  // 批量导出（格式与导入一致）
  const batchExport = useCallback((prompts: PromptItem[]) => {
    if (selectedIds.size === 0) {
      showToast('请先选择要导出的项', 'error');
      return;
    }

    const selectedPrompts = prompts.filter(p => selectedIds.has(p.id));
    // 导出格式与导入格式保持一致
    const exportData = selectedPrompts.map(p => ({
      title: p.title,
      prompt: p.prompt,
      category: p.category,
      complexity: p.complexity || 'beginner',
      desc: p.desc || '',
      type: p.type || 'text',
    }));
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prompts-export-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    showToast(`已导出 ${selectedIds.size} 个提示词`, 'success');
  }, [selectedIds, showToast]);

  // 清空选择
  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // 退出管理模式
  const exitManageMode = useCallback(() => {
    setIsManageMode(false);
    setSelectedIds(new Set());
  }, []);

  return {
    isManageMode,
    setIsManageMode,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    batchDelete,
    batchExport,
    clearSelection,
    exitManageMode
  };
}
