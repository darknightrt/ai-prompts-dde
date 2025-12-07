"use client";

export const runtime = 'edge';

import { usePrompts } from '@/context/PromptContext';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PromptItem } from '@/lib/types';

export default function PromptDetailPage({ params }: { params: { id: string } }) {
  const { prompts, isLoaded } = usePrompts();
  const { showToast } = useToast();
  const router = useRouter();
  const [prompt, setPrompt] = useState<PromptItem | null>(null);

  useEffect(() => {
    if (isLoaded) {
      const found = prompts.find(p => String(p.id) === params.id);
      if (found) setPrompt(found);
    }
  }, [isLoaded, params.id, prompts]);

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt.prompt);
      showToast('已复制到剪贴板！');
    }
  };

  if (!isLoaded) return null;
  
  if (isLoaded && !prompt) {
      return (
        <div className="pt-32 text-center">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">未找到提示词</h2>
            <button onClick={() => router.back()} className="text-purple-600 hover:underline">返回列表</button>
        </div>
      )
  }

  if (!prompt) return null;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-purple-600 transition font-medium">
          <i className="fa-solid fa-arrow-left"></i> 返回列表
        </button>

        <div className="flex flex-col gap-10 max-w-4xl">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 text-xs font-bold rounded uppercase ${
                prompt.category === 'code' ? 'bg-blue-100 text-blue-600' :
                prompt.category === 'mj' ? 'bg-purple-100 text-purple-600' :
                prompt.category === 'writing' ? 'bg-pink-100 text-pink-600' :
                prompt.category === 'roleplay' ? 'bg-green-100 text-green-600' :
                prompt.category === 'business' ? 'bg-indigo-100 text-indigo-600' :
                'bg-yellow-100 text-yellow-600'
              }`}>
                  {prompt.category}
              </span>
               <span className="text-xs text-gray-400"><i className="fa-regular fa-clock mr-1"></i> {prompt.createdAt ? new Date(prompt.createdAt).toLocaleDateString() : 'Just Now'}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
              {prompt.title}
            </h1>
            
            {/* 简介区域 */}
            {prompt.desc && (
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
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{prompt.desc}</p>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden mb-8">
               <div className="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200"><i className="fa-solid fa-terminal mr-2 text-purple-500"></i>Prompt</span>
                  <button 
                    onClick={handleCopy}
                    className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium transition"
                  >
                    <i className="fa-regular fa-copy"></i> 复制内容
                  </button>
               </div>
               <div className="p-4 bg-slate-50 dark:bg-slate-900/50">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 dark:text-slate-300 custom-scrollbar max-h-[500px] overflow-y-auto">
                  {prompt.prompt}
                  </pre>
               </div>
            </div>
            
            {/* 底部提示 */}
            <div className="mt-auto pt-6 border-t border-gray-200 dark:border-slate-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">💡 提示：复制后可直接在 ChatGPT、Midjourney 或 Claude 中使用。</p>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
