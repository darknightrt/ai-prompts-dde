"use client";

import { useMemo } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * 分页组件
 * - 1-10页时显示所有页码
 * - 超过10页时中间折叠显示省略号
 * - 始终显示第一页和最后一页
 * - 位于内容底部（非固定定位）
 */
export default function Pagination({ currentPage, totalPages, onPageChange}: PaginationProps) {
  // 计算要显示的页码数组
  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];
    
    if (totalPages <= 10) {
      // 10页以内，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 超过10页，需要折叠
      // 始终显示第1页
      pages.push(1);
      
      if (currentPage <= 5) {
        // 当前页靠近开头：显示 1 2 3 4 5 6 7 ... 最后页
        for (let i = 2; i <= 7; i++) {
          pages.push(i);
        }
        pages.push('ellipsis-end');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 4) {
        // 当前页靠近结尾：显示 1 ... 倒数7页
        pages.push('ellipsis-start');
        for (let i = totalPages - 6; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 当前页在中间：显示 1 ... 当前页-2 当前页-1 当前页 当前页+1 当前页+2 ... 最后页
        pages.push('ellipsis-start');
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
        pages.push('ellipsis-end');
        pages.push(totalPages);
      }
    }
    
    return pages;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 mb-8 py-6 border-t border-zinc-800">
      {/* 站点名称 */}
      
      {/* 分页控件 */}
      <div className="flex items-center justify-center gap-2">
        {/* 上一页按钮 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition ${
            currentPage === 1
              ? 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
          }`}
          aria-label="上一页"
        >
          <i className="fa-solid fa-chevron-left text-xs"></i>
        </button>

        {/* 页码按钮 */}
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <span
                key={page}
                className="w-9 h-9 flex items-center justify-center text-zinc-500 select-none"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition ${
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* 下一页按钮 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition ${
            currentPage === totalPages
              ? 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
          }`}
          aria-label="下一页"
        >
          <i className="fa-solid fa-chevron-right text-xs"></i>
        </button>
      </div>
    </div>
  );
}
