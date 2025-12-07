"use client";

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePrompts } from '@/context/PromptContext';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useFavorites } from '@/context/FavoritesContext';
import { usePromptFilters, SortOption } from '@/hooks/usePromptFilters';
import { usePromptActions } from '@/hooks/usePromptActions';
import { useDebounce } from '@/hooks/useDebounce';
import FilterSidebar from '@/components/prompts/FilterSidebar';
import SearchBar from '@/components/prompts/SearchBar';
import BatchActionBar from '@/components/prompts/BatchActionBar';
import SortDropdown from '@/components/prompts/SortDropdown';
import PromptGrid from '@/components/prompts/PromptGrid';
import CreatePromptModal from '@/components/prompts/CreatePromptModal';
import ImportModal from '@/components/prompts/ImportModal';
import Pagination from '@/components/prompts/Pagination';
import { Category, PromptItem, Complexity } from '@/lib/types';

function PromptsPageContent() {
  const { prompts, isLoaded } = usePrompts();
  const { config } = useSiteConfig();
  const { canManage, canCreate, isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const { favorites } = useFavorites();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // URL State
  const currentCategory = (searchParams.get('category') as Category) || 'all';
  const currentComplexity = (searchParams.get('complexity') as Complexity | 'all') || 'all';
  const urlSearchQuery = searchParams.get('q') || '';
  const urlSortBy = (searchParams.get('sort') as SortOption) || 'latest';
  const urlPage = parseInt(searchParams.get('page') || '1', 10);
  
  // 分页常量
  const ITEMS_PER_PAGE = 15;
  
  // Local Search State (for immediate UI feedback)
  const [localSearchQuery, setLocalSearchQuery] = useState(urlSearchQuery);
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(urlPage);
  
  // 同步 URL 页码到状态
  useEffect(() => {
    setCurrentPage(urlPage);
  }, [urlPage]);
  
  // Debounced search query
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<PromptItem | null>(null);

  // Custom Hooks
  const { filteredPrompts, categoryStats, totalCount } = usePromptFilters({
    prompts,
    category: currentCategory,
    complexity: currentComplexity,
    searchQuery: debouncedSearchQuery,
    sortBy: urlSortBy,
    favorites
  });

  const {
    isManageMode,
    setIsManageMode,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    batchDelete,
    batchExport,
    exitManageMode
  } = usePromptActions();

  // 分页计算
  const totalPages = useMemo(() => Math.ceil(filteredPrompts.length / ITEMS_PER_PAGE), [filteredPrompts.length]);
  
  const paginatedPrompts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPrompts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPrompts, currentPage]);

  // 当筛选条件变化时重置到第一页
  useEffect(() => {
    if (currentPage > 1 && currentPage > totalPages) {
      handlePageChange(1);
    }
  }, [filteredPrompts.length]);

  // Handlers
  const handleCategoryChange = (cat: Category) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', cat);
    router.push(`/prompts?${params.toString()}`);
  };

  const handleComplexityChange = (comp: Complexity | 'all') => {
    const params = new URLSearchParams(searchParams.toString());
    if (comp === 'all') params.delete('complexity');
    else params.set('complexity', comp);
    router.push(`/prompts?${params.toString()}`);
  };

  const handleSearch = (query: string) => {
    setLocalSearchQuery(query);
    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set('q', query);
    else params.delete('q');
    router.replace(`/prompts?${params.toString()}`);
  };

  const handleSortChange = (sort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    router.push(`/prompts?${params.toString()}`);
  };

  const handleCreate = () => {
    if (!canCreate) {
      showToast('请先登录后再创建提示词', 'error');
      return;
    }
    setEditingPrompt(null);
    setIsModalOpen(true);
  };

  const handleImport = () => {
    if (!canCreate) {
      showToast('请先登录后再导入提示词', 'error');
      return;
    }
    setIsImportModalOpen(true);
  };

  const handleEdit = (prompt: PromptItem) => {
    setEditingPrompt(prompt);
    setIsModalOpen(true);
  };

  const handleToggleManageMode = () => {
    if (isManageMode) {
      exitManageMode();
    } else {
      setIsManageMode(true);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    router.push(`/prompts?${params.toString()}`);
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-purple-500 mb-4"></i>
          <p className="text-gray-500">正在加载提示词库...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-gray-200 animate-fade-in pt-16">
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
          {config.promptsPage.title}
        </h1>
        <p className="text-base text-slate-900 dark:text-white leading-relaxed max-w-4xl">
          {config.promptsPage.description}
        </p>
      </div>

      {/* Search Section */}
      <SearchBar 
        defaultValue={localSearchQuery}
        onSearch={handleSearch}
      />

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row -mx-4 sm:-mx-6 lg:-mx-8">
        
          {/* Left Sidebar */}
          <FilterSidebar
            currentCategory={currentCategory}
            currentComplexity={currentComplexity}
            categoryStats={categoryStats}
            onCategoryChange={handleCategoryChange}
            onComplexityChange={handleComplexityChange}
          />

          {/* Main Content */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto bg-[#0a0a0a]">
          
            {/* Filter Bar: Count, Sort & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            
              {/* Left: Count & Sort */}
              <div className="flex items-center gap-4">
                <div className="text-zinc-400 text-sm">
                  共找到 <span className="text-white font-semibold">{totalCount}</span> 个提示词
                </div>
                
                {/* Sort Dropdown */}
                <SortDropdown value={urlSortBy} onChange={handleSortChange} />
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

                {/* 导入按钮 - 需要登录 */}
                <button 
                  onClick={handleImport}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                    canCreate
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                  title={!canCreate ? '请先登录' : '导入提示词'}
                >
                  <i className="fa-solid fa-file-import"></i>
                  导入
                </button>

                {/* 新建按钮 - 需要登录 */}
                <button 
                  onClick={handleCreate}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                    canCreate
                      ? 'bg-green-600 hover:bg-green-500 text-white'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                  title={!canCreate ? '请先登录' : '新建提示词'}
                >
                  <i className="fa-solid fa-plus"></i>
                  新建
                </button>
              </div>
            </div>

            {/* Batch Action Bar */}
            {isManageMode && (
              <BatchActionBar
                selectedCount={selectedIds.size}
                totalCount={totalCount}
                onDelete={batchDelete}
                onExport={() => batchExport(filteredPrompts)}
                onSelectAll={() => toggleSelectAll(filteredPrompts)}
                isAllSelected={selectedIds.size === filteredPrompts.length && filteredPrompts.length > 0}
              />
            )}

            {/* Prompt Grid */}
            <PromptGrid
              prompts={paginatedPrompts}
              isManageMode={isManageMode}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onEdit={handleEdit}
            />

            {/* 分页组件 - 位于提示词底部 */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </main>
        </div>
      </div>

      <CreatePromptModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editData={editingPrompt}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      {/* 固定在页尾的分页组件 */}
    </div>
  );
}

export default function PromptsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-purple-500 mb-4"></i>
          <p className="text-gray-500">正在加载...</p>
        </div>
      </div>
    }>
      <PromptsPageContent />
    </Suspense>
  );
}