"use client";

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useWorkflows } from '@/context/WorkflowContext';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useDebounce } from '@/hooks/useDebounce';
import { useWorkflowFavorites } from '@/context/WorkflowFavoritesContext';
import { WorkflowItem, WorkflowCategory, WorkflowComplexity } from '@/lib/types';
import {
  WorkflowSearchBar,
  WorkflowFilterSidebar,
  WorkflowGrid,
  CreateWorkflowModal,
  WorkflowImportModal,
  WorkflowSortDropdown,
  WorkflowBatchActionBar,
} from '@/components/workflows';
import { WorkflowSortOption } from '@/components/workflows/WorkflowSortDropdown';
import Pagination from '@/components/prompts/Pagination';

interface CategoryStat {
  category: WorkflowCategory;
  count: number;
}

interface ComplexityStat {
  complexity: WorkflowComplexity;
  count: number;
}

function WorkflowsPageContent() {
  const { workflows, isLoaded, deleteWorkflows } = useWorkflows();
  const { config } = useSiteConfig();
  const { canManage, canCreate } = useAuth();
  const { showToast } = useToast();
  const { favorites, isFavorite } = useWorkflowFavorites();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // URL State
  const currentCategory = (searchParams.get('category') as WorkflowCategory) || 'all';
  const currentComplexity = (searchParams.get('complexity') as WorkflowComplexity | 'all') || 'all';
  const urlSearchQuery = searchParams.get('q') || '';
  const urlSortBy = (searchParams.get('sort') as WorkflowSortOption) || 'latest';
  const urlPage = parseInt(searchParams.get('page') || '1', 10);
  
  // 分页常量
  const ITEMS_PER_PAGE = 12;
  
  // Local Search State
  const [localSearchQuery, setLocalSearchQuery] = useState(urlSearchQuery);
  const [currentPage, setCurrentPage] = useState(urlPage);
  
  // Debounced search query
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300);
  
  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<WorkflowItem | null>(null);

  // 管理模式
  const [isManageMode, setIsManageMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  // 同步 URL 页码到状态
  useEffect(() => {
    setCurrentPage(urlPage);
  }, [urlPage]);

  // 筛选和排序逻辑
  const { filteredWorkflows, categoryStats, complexityStats, totalCount } = useMemo(() => {
    let filtered = [...workflows];
    
    // 分类筛选
    if (currentCategory === 'favorites') {
      // 收藏筛选
      filtered = filtered.filter(w => isFavorite(w.id));
    } else if (currentCategory !== 'all') {
      filtered = filtered.filter(w => w.category === currentCategory);
    }
    
    // 复杂度筛选
    if (currentComplexity !== 'all') {
      filtered = filtered.filter(w => w.complexity === currentComplexity);
    }
    
    // 搜索筛选
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(w => 
        w.title.toLowerCase().includes(query) ||
        w.description.toLowerCase().includes(query)
      );
    }
    
    // 排序
    switch (urlSortBy) {
      case 'latest':
        filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'downloads':
        filtered.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    
    // 计算分类统计
    const stats: CategoryStat[] = [
      { category: 'n8n', count: workflows.filter(w => w.category === 'n8n').length },
      { category: 'comfyui', count: workflows.filter(w => w.category === 'comfyui').length },
      { category: 'dify', count: workflows.filter(w => w.category === 'dify').length },
      { category: 'other', count: workflows.filter(w => w.category === 'other').length },
    ];
    
    // 计算复杂度统计
    const complexityStatsData: ComplexityStat[] = [
      { complexity: 'beginner', count: workflows.filter(w => w.complexity === 'beginner').length },
      { complexity: 'intermediate', count: workflows.filter(w => w.complexity === 'intermediate').length },
      { complexity: 'advanced', count: workflows.filter(w => w.complexity === 'advanced').length },
    ];
    
    return {
      filteredWorkflows: filtered,
      categoryStats: stats,
      complexityStats: complexityStatsData,
      totalCount: filtered.length,
    };
  }, [workflows, currentCategory, currentComplexity, debouncedSearchQuery, urlSortBy, isFavorite]);

  // 分页计算
  const totalPages = useMemo(() => Math.ceil(filteredWorkflows.length / ITEMS_PER_PAGE), [filteredWorkflows.length]);
  
  const paginatedWorkflows = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredWorkflows.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredWorkflows, currentPage]);

  // 当筛选条件变化时重置到第一页
  useEffect(() => {
    if (currentPage > 1 && currentPage > totalPages) {
      handlePageChange(1);
    }
  }, [filteredWorkflows.length]);

  // Handlers
  const handleCategoryChange = (cat: WorkflowCategory) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', cat);
    params.delete('page');
    router.push(`/workflows?${params.toString()}`);
  };

  const handleComplexityChange = (complexity: WorkflowComplexity | 'all') => {
    const params = new URLSearchParams(searchParams.toString());
    if (complexity === 'all') {
      params.delete('complexity');
    } else {
      params.set('complexity', complexity);
    }
    params.delete('page');
    router.push(`/workflows?${params.toString()}`);
  };

  const handleSearch = (query: string) => {
    setLocalSearchQuery(query);
    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set('q', query);
    else params.delete('q');
    params.delete('page');
    router.replace(`/workflows?${params.toString()}`);
  };

  const handleSortChange = (sort: WorkflowSortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    router.push(`/workflows?${params.toString()}`);
  };

  const handleCreate = () => {
    if (!canCreate) {
      showToast('请先登录后再创建工作流', 'error');
      return;
    }
    setEditingWorkflow(null);
    setIsCreateModalOpen(true);
  };

  const handleImport = () => {
    if (!canCreate) {
      showToast('请先登录后再导入工作流', 'error');
      return;
    }
    setIsImportModalOpen(true);
  };

  const handleWorkflowClick = (workflow: WorkflowItem) => {
    if (isManageMode) {
      toggleSelect(workflow.id);
    } else {
      // 跳转到详情页面
      router.push(`/workflows/${workflow.id}`);
    }
  };

  const handleEdit = (workflow: WorkflowItem) => {
    setEditingWorkflow(workflow);
    setIsCreateModalOpen(true);
  };

  const handleToggleManageMode = () => {
    if (isManageMode) {
      setIsManageMode(false);
      setSelectedIds(new Set());
    } else {
      setIsManageMode(true);
    }
  };

  const toggleSelect = (id: string | number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredWorkflows.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredWorkflows.map(w => w.id)));
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.size === 0) return;
    
    if (confirm(`确定要删除选中的 ${selectedIds.size} 个工作流吗？`)) {
      deleteWorkflows(Array.from(selectedIds));
      showToast(`已删除 ${selectedIds.size} 个工作流`, 'success');
      setSelectedIds(new Set());
    }
  };

  const handleBatchExport = () => {
    if (selectedIds.size === 0) return;
    
    const exportData = filteredWorkflows.filter(w => selectedIds.has(w.id));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflows-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`已导出 ${selectedIds.size} 个工作流`, 'success');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    router.push(`/workflows?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-purple-500 mb-4"></i>
          <p className="text-gray-500">正在加载工作流...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-gray-200 animate-fade-in pt-16">
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
          {config.workflowsPage?.title || '工作流库'}
        </h1>
        <p className="text-base text-slate-900 dark:text-white leading-relaxed max-w-4xl">
          {config.workflowsPage?.description || '探索精选的 AI 工作流模板，包括 n8n、ComfyUI、Dify 等平台的自动化流程，助你快速搭建智能工作流。'}
        </p>
      </div>

      {/* Search Section */}
      <WorkflowSearchBar 
        defaultValue={localSearchQuery}
        onSearch={handleSearch}
      />

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row -mx-4 sm:-mx-6 lg:-mx-8">
        
          {/* Left Sidebar */}
          <WorkflowFilterSidebar
            currentCategory={currentCategory}
            categoryStats={categoryStats}
            onCategoryChange={handleCategoryChange}
            currentComplexity={currentComplexity}
            complexityStats={complexityStats}
            onComplexityChange={handleComplexityChange}
          />

          {/* Main Content */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto bg-[#0a0a0a]">
          
            {/* Filter Bar: Count, Sort & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            
              {/* Left: Count & Sort */}
              <div className="flex items-center gap-4">
                <div className="text-zinc-400 text-sm">
                  共找到 <span className="text-white font-semibold">{totalCount}</span> 个工作流
                </div>
                
                {/* Sort Dropdown */}
                <WorkflowSortDropdown value={urlSortBy} onChange={handleSortChange} />
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center gap-3">
                {/* 管理按钮 - 仅管理员可见 */}
                {canManage && (
                  <button 
                    onClick={handleToggleManageMode}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                      isManageMode 
                      ? 'bg-purple-600/20 border-purple-600/50 text-purple-400' 
                      : 'bg-[#111] border-zinc-800 text-gray-400 hover:border-zinc-700 hover:text-gray-200'
                    }`}
                  >
                    <i className="fa-solid fa-sliders mr-2"></i>
                    {isManageMode ? '完成管理' : '管理'}
                  </button>
                )}

                {/* 导入按钮 */}
                <button 
                  onClick={handleImport}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                    canCreate
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                  title={!canCreate ? '请先登录' : '导入工作流'}
                >
                  <i className="fa-solid fa-file-import"></i>
                  导入
                </button>

                {/* 新建按钮 */}
                <button 
                  onClick={handleCreate}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                    canCreate
                      ? 'bg-green-600 hover:bg-green-500 text-white'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                  title={!canCreate ? '请先登录' : '新建工作流'}
                >
                  <i className="fa-solid fa-plus"></i>
                  新建
                </button>
              </div>
            </div>

            {/* Batch Action Bar */}
            {isManageMode && (
              <WorkflowBatchActionBar
                selectedCount={selectedIds.size}
                totalCount={totalCount}
                onDelete={handleBatchDelete}
                onExport={handleBatchExport}
                onSelectAll={toggleSelectAll}
                isAllSelected={selectedIds.size === filteredWorkflows.length && filteredWorkflows.length > 0}
              />
            )}

            {/* Workflow Grid */}
            <WorkflowGrid
              workflows={paginatedWorkflows}
              onWorkflowClick={handleWorkflowClick}
              isManageMode={isManageMode}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onEdit={handleEdit}
            />

            {/* 分页组件 */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </main>
        </div>
      </div>

      {/* Modals */}
      <CreateWorkflowModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        editData={editingWorkflow}
      />

      <WorkflowImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
}

export default function WorkflowsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-purple-500 mb-4"></i>
          <p className="text-gray-500">正在加载...</p>
        </div>
      </div>
    }>
      <WorkflowsPageContent />
    </Suspense>
  );
}
