"use client";

import { useState, useEffect } from 'react';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { useAuth } from '@/context/AuthContext';

export default function AnnouncementPopup() {
  const { config } = useSiteConfig();
  const { user } = useAuth(); // 依赖 user 变化来触发检查
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 只有在配置开启，且用户已登录，且未看过公告时才显示
    // 或者你可以逻辑改为：只要没看过就显示，不一定要登录
    if (config.announcement.enabled) {
        const hasSeen = localStorage.getItem('announcement_seen');
        if (!hasSeen) {
            // 稍微延迟一点显示，增加仪式感
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }
  }, [config.announcement.enabled, user]); 

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('announcement_seen', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={handleClose}></div>
      <div className="relative bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in-up border border-purple-100 dark:border-purple-900 overflow-hidden">
        
        {/* 装饰背景 */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center flex-shrink-0 text-purple-600 dark:text-purple-400">
                <i className="fa-solid fa-bullhorn text-xl animate-pulse"></i>
            </div>
            <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {config.announcement.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                    {config.announcement.content}
                </p>
            </div>
        </div>

        <div className="mt-8 flex justify-end">
            <button 
                onClick={handleClose}
                className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:shadow-lg transition transform hover:-translate-y-0.5 text-sm"
            >
                我知道了
            </button>
        </div>
      </div>
    </div>
  );
}
