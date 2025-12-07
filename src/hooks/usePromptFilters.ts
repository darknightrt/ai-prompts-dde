import { useMemo } from 'react';
import { PromptItem, Category, Complexity } from '@/lib/types';

export type SortOption = 'latest' | 'oldest' | 'title-asc' | 'title-desc' | 'popular';

interface UsePromptFiltersProps {
  prompts: PromptItem[];
  category: Category;
  complexity: Complexity | 'all';
  searchQuery: string;
  sortBy: SortOption;
  favorites?: Set<string | number>;
}

export function usePromptFilters({
  prompts,
  category,
  complexity,
  searchQuery,
  sortBy,
  favorites
}: UsePromptFiltersProps) {
  
  // 过滤逻辑
  const filteredPrompts = useMemo(() => {
    let result = prompts.filter(p => {
      // 如果是 'custom' 分类，只显示收藏的提示词
      if (category === 'custom') {
        if (!favorites || favorites.size === 0) return false;
        return favorites.has(String(p.id));
      }
      
      const matchCategory = category === 'all' || p.category === category;
      const matchComplexity = complexity === 'all' || (p.complexity || 'beginner') === complexity;
      const matchSearch = !searchQuery || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.desc?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      
      return matchCategory && matchComplexity && matchSearch;
    });

    // 排序逻辑
    switch (sortBy) {
      case 'latest':
        result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        break;
      case 'oldest':
        result.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        break;
      case 'title-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'popular':
        // 可以根据浏览量、下载量等排序，这里暂时按创建时间
        result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        break;
    }

    return result;
  }, [prompts, category, complexity, searchQuery, sortBy, favorites]);

  // 分类统计
  const categoryStats = useMemo(() => {
    const stats: Record<Category, number> = {
      all: prompts.length,
      code: 0,
      writing: 0,
      mj: 0,
      business: 0,
      roleplay: 0,
      custom: 0
    };

    prompts.forEach(p => {
      if (p.category !== 'all') {
        stats[p.category]++;
      }
    });

    // 计算收藏数量
    if (favorites) {
      stats.custom = favorites.size;
    }

    return stats;
  }, [prompts, favorites]);

  return {
    filteredPrompts,
    categoryStats,
    totalCount: filteredPrompts.length
  };
}
