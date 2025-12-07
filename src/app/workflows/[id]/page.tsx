"use client";

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkflows } from '@/context/WorkflowContext';
import { useToast } from '@/context/ToastContext';
import { WorkflowItem, WorkflowCategory, WorkflowComplexity } from '@/lib/types';
import ImageViewer from '@/components/workflows/ImageViewer';

// 复杂度配置 - 初级绿色、中级黄色、高级红色
const COMPLEXITY_CONFIG: Record<WorkflowComplexity, { label: string; color: string; bgColor: string; borderColor: string; description: string }> = {
  beginner: { 
    label: '初级', 
    color: 'text-green-600', 
    bgColor: 'bg-green-100 dark:bg-green-900/30', 
    borderColor: 'border-green-200 dark:border-green-800',
    description: '适合新手,易于理解' 
  },
  intermediate: { 
    label: '中级', 
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', 
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    description: '需要一定工作流基础知识和技术经验' 
  },
  advanced: { 
    label: '高级', 
    color: 'text-red-600', 
    bgColor: 'bg-red-100 dark:bg-red-900/30', 
    borderColor: 'border-red-800',
    description: '需要高超的工作流和相关技术经验' 
  },
};

const CATEGORY_LABELS: Record<WorkflowCategory, string> = {
  all: '全部',
  n8n: 'n8n',
  comfyui: 'ComfyUI',
  dify: 'Dify',
  other: '其他',
  favorites: '我的 ',
};

export default function WorkflowDetailPage({ params }: { params: { id: string } }) {
  const { workflows, isLoaded, incrementViews, incrementDownloads } = useWorkflows();
  const { showToast } = useToast();
  const router = useRouter();
  
  const [workflow, setWorkflow] = useState<WorkflowItem | null>(null);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      const found = workflows.find(w => String(w.id) === params.id);
      if (found) setWorkflow(found);
    }
  }, [isLoaded, params.id, workflows]);

  // 进入页面时增加浏览量（仅一次）
  useEffect(() => {
    if (isLoaded && workflow && !hasTrackedView) {
      setHasTrackedView(true);
      incrementViews(workflow.id).then(newViews => {
        // 更新本地显示的浏览量
        setWorkflow(prev => prev ? { ...prev, views: newViews } : prev);
      });
    }
  }, [isLoaded, workflow, hasTrackedView, incrementViews]);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setImageViewerOpen(true);
  };

  const handleDownloadJson = async () => {
    if (!workflow) return;
    
    // 增加下载量
    const newDownloads = await incrementDownloads(workflow.id);
    setWorkflow(prev => prev ? { ...prev, downloads: newDownloads } : prev);
    
    if (workflow.workflowJson) {
      const blob = new Blob([workflow.workflowJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${workflow.title}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('下载成功', 'success');
    } else if (workflow.downloadUrl) {
      window.open(workflow.downloadUrl, '_blank');
    }
  };

  const handleCopyJson = async () => {
    if (!workflow) return;
    
    if (workflow.workflowJson) {
      try {
        await navigator.clipboard.writeText(workflow.workflowJson);
        showToast('JSON 内容已复制到剪贴板', 'success');
      } catch (err) {
        showToast('复制失败，请重试', 'error');
      }
    } else {
      showToast('该工作流没有 JSON 内容', 'error');
    }
  };

  // 加载中状态
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-purple-500 mb-4"></i>
          <p className="text-gray-500">正在加载...</p>
        </div>
      </div>
    );
  }

  // 未找到工作流
  if (isLoaded && !workflow) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <div className="max-w-md mx-auto">
          <i className="fa-solid fa-circle-exclamation text-6xl text-gray-400 mb-6"></i>
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">未找到工作流</h2>
          <p className="text-gray-500 mb-6">该工作流可能已被删除或不存在</p>
          <button 
            onClick={() => router.push('/workflows')} 
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition font-medium"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            返回工作流列表
          </button>
        </div>
      </div>
    );
  }

  if (!workflow) return null;

  return (
    <>
      <div className="min-h-screen bg-transparent pt-16 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* 返回按钮 & 面包屑 */}
          <div className="mb-8">
            <button 
              onClick={() => router.push('/workflows')} 
              className="mb-4 flex items-center gap-2 text-gray-500 hover:text-purple-600 transition font-medium"
            >
              <i className="fa-solid fa-arrow-left"></i> 返回工作流列表
            </button>
            
            {/* 面包屑导航 */}
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span 
                className="hover:text-purple-500 cursor-pointer transition"
                onClick={() => router.push('/workflows')}
              >
                工作流
              </span>
              <i className="fa-solid fa-chevron-right text-xs"></i>
              <span 
                className="hover:text-purple-500 cursor-pointer transition"
                onClick={() => router.push(`/workflows?category=${workflow.category}`)}
              >
                {CATEGORY_LABELS[workflow.category]}
              </span>
              <i className="fa-solid fa-chevron-right text-xs"></i>
              <span className="text-zinc-300">{workflow.title}</span>
            </div>
          </div>

          {/* 主内容区域 */}
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* 左侧：详情信息 */}
            <div className="flex-1">
              {/* 标题 */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
                {workflow.title}
              </h1>

              {/* 简介 */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden mb-6">
                <div className="px-4 py-3 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <i className="fa-solid fa-info text-purple-600 dark:text-purple-400 text-xs"></i>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">简介</span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-base text-gray-600 dark:text-zinc-300 leading-relaxed">
                    {workflow.description}
                  </p>
                </div>
              </div>

              {/* 详细说明 */}
              {workflow.detail && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden mb-6">
                  <div className="px-4 py-3 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <i className="fa-solid fa-book text-blue-600 dark:text-blue-400 text-xs"></i>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">详细说明</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed">
                      {workflow.detail}
                    </div>
                  </div>
                </div>
              )}
            {/* 标签信息 */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1.5 bg-purple-600/20 text-purple-400 rounded-full text-sm font-medium">
                  <i className="fa-solid fa-tag mr-1.5"></i>
                  {CATEGORY_LABELS[workflow.category]}
                </span>
                <span className="px-3 py-1.5 bg-zinc-800 text-zinc-400 rounded-full text-sm flex items-center gap-1.5">
                  <i className="fa-solid fa-eye"></i>
                  {workflow.views || 0} 浏览
                </span>
                <span className="px-3 py-1.5 bg-zinc-800 text-zinc-400 rounded-full text-sm flex items-center gap-1.5">
                  <i className="fa-solid fa-download"></i>
                  {workflow.downloads || 0} 下载
                </span>
                {workflow.createdAt && (
                  <span className="px-3 py-1.5 bg-zinc-800 text-zinc-400 rounded-full text-sm flex items-center gap-1.5">
                    <i className="fa-regular fa-clock"></i>
                    {new Date(workflow.createdAt).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                )}
              </div>
              {/* 操作按钮 */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200 dark:border-zinc-800">
                {(workflow.workflowJson || workflow.downloadUrl) && (
                  <button 
                    onClick={handleDownloadJson}
                    className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition font-medium shadow-lg shadow-purple-600/20"
                  >
                    <i className="fa-solid fa-download"></i>
                    下载 JSON 文件
                  </button>
                )}
                <button 
                  onClick={handleCopyJson}
                  className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition font-medium"
                  disabled={!workflow.workflowJson}
                  title={workflow.workflowJson ? '复制工作流 JSON 内容' : '该工作流没有 JSON 内容'}
                >
                  <i className="fa-solid fa-copy"></i>
                  复制 JSON
                </button>
              </div>

              {/* 底部提示 */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  💡 提示：下载 JSON 文件后，可直接导入到n8n或者comfyui平台使用。
                </p>
              </div>
            </div>

            {/* 右侧：图片预览 */}
            <div className="w-full lg:w-[420px] flex-shrink-0">
              <div className="sticky top-24">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">
                  <i className="fa-solid fa-images mr-2"></i>
                  预览图片
                </h3>
                
                {workflow.images.length > 0 ? (
                  <div className="space-y-3">
                    {/* 主图 */}
                    <div 
                      className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group shadow-xl border-4 border-white dark:border-slate-700"
                      onClick={() => handleImageClick(0)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={workflow.images[0]} 
                        alt={workflow.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 bg-black/60 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-medium transition transform translate-y-4 group-hover:translate-y-0">
                          <i className="fa-solid fa-expand mr-2"></i>查看大图
                        </span>
                      </div>
                    </div>

                    {/* 缩略图列表 */}
                    {workflow.images.length > 1 && (
                      <div className="grid grid-cols-3 gap-3">
                        {workflow.images.slice(1, 4).map((img, idx) => (
                          <div 
                            key={idx}
                            className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group border-2 border-white dark:border-slate-700 shadow-md"
                            onClick={() => handleImageClick(idx + 1)}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={img} 
                              alt={`Preview ${idx + 2}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition"></div>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-zinc-500 text-center pt-2">
                      <i className="fa-solid fa-hand-pointer mr-1"></i>
                      点击图片可放大查看
                    </p>
                  </div>
                ) : (
                  <div className="aspect-video bg-zinc-800 rounded-2xl flex items-center justify-center border-4 border-white dark:border-slate-700">
                    <div className="text-center text-zinc-500">
                      <i className="fa-solid fa-image text-4xl mb-3"></i>
                      <p className="text-sm">暂无预览图</p>
                    </div>
                  </div>
                )}

                {/* 装饰性小点 */}
                <div className="mt-4 flex justify-center gap-2">
                  {workflow.images.slice(0, 4).map((_, idx) => (
                    <div 
                      key={idx}
                      className={`w-2 h-2 rounded-full transition cursor-pointer ${
                        idx === 0 ? 'bg-purple-600' : 'bg-gray-300 dark:bg-slate-600 hover:bg-purple-400'
                      }`}
                      onClick={() => handleImageClick(idx)}
                    ></div>
                  ))}
                  {workflow.images.length === 0 && (
                    <>
                      <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-slate-600"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-slate-600"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-slate-600"></div>
                    </>
                  )}
                </div>

                {/* 工作流信息卡片 */}
                <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      工作流信息
                    </h3>
                  </div>
                  
                  <div className="p-5 space-y-5">
                    {/* 复杂度 */}
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                        复杂度
                      </div>
                      {workflow.complexity ? (
                        <>
                          <span className={`inline-block px-3 py-1 rounded text-sm font-medium border ${
                            COMPLEXITY_CONFIG[workflow.complexity].bgColor
                          } ${
                            COMPLEXITY_CONFIG[workflow.complexity].color
                          } ${
                            COMPLEXITY_CONFIG[workflow.complexity].borderColor
                          }`}>
                            {COMPLEXITY_CONFIG[workflow.complexity].label}
                          </span>
                          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            {COMPLEXITY_CONFIG[workflow.complexity].description}
                          </p>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">未设置</span>
                      )}
                    </div>

                    {/* 更新时间 */}
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                        更新时间
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <i className="fa-regular fa-calendar text-gray-400"></i>
                        <span className="text-sm">
                          {workflow.updatedAt 
                            ? new Date(workflow.updatedAt).toLocaleDateString('zh-CN', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric'
                              })
                            : workflow.createdAt
                              ? new Date(workflow.createdAt).toLocaleDateString('zh-CN', {
                                  year: 'numeric',
                                  month: 'numeric',
                                  day: 'numeric'
                                })
                              : '未知'
                          }
                        </span>
                      </div>
                    </div>

                    {/* 翻译者/作者 */}
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                        作者
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <i className={`fa-solid fa-user text-gray-400`}></i>
                        <span className="text-sm">
                          {workflow.author?.name || '未知'}
                        </span>
                        {workflow.author?.isAdmin && (
                          <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded font-medium">
                            管理员
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 图片查看器 */}
      <ImageViewer 
        images={workflow.images}
        isOpen={imageViewerOpen}
        initialIndex={selectedImageIndex}
        onClose={() => setImageViewerOpen(false)}
      />
    </>
  );
}
