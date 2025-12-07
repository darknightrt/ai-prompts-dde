"use client";

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/components/auth/LoginModal';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <nav className="fixed w-full z-50 top-0 backdrop-blur-md bg-white/70 dark:bg-[#0a0a0f]/90 border-b border-gray-200 dark:border-[#1f1f2e] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2 group">
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                  ai  <span className="text-cyan-400">Platfrom</span>
                </span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link href="/" className="text-slate-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-white transition font-medium">
                主页
              </Link>
              <Link href="/#tutorial" className="text-slate-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-white transition font-medium">
                教程
              </Link>
              <Link href="/prompts" className="text-slate-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-white transition font-medium">
                提示词库
              </Link>
              <Link href="/workflows" className="text-slate-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-white transition font-medium">
                工作流
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#1f1f2e] flex items-center justify-center text-slate-700 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-[#2a2a3e] transition focus:outline-none shadow-sm"
              >
                {mounted && (theme === 'dark' ? <i className="fa-solid fa-sun text-sm"></i> : <i className="fa-solid fa-moon text-sm"></i>)}
              </button>

              {/* User / Login Section */}
              {user ? (
                <div className="relative">
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#1f1f2e] transition border border-transparent hover:border-gray-200 dark:hover:border-[#2a2a3e]"
                    >
                        <span className="text-sm font-medium text-slate-700 dark:text-gray-200 hidden sm:block">
                            {user.username}
                        </span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-200 dark:border-slate-600" />
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111118] rounded-xl shadow-xl border border-gray-200 dark:border-[#1f1f2e] py-1 animate-fade-in z-50">
                            <div className="px-4 py-2 border-b border-gray-100 dark:border-[#1f1f2e]">
                                <p className="text-xs text-gray-500">已登录为</p>
                                <p className="text-sm font-bold text-purple-600 capitalize">{user.role}</p>
                            </div>
                            
                            {isAdmin && (
                                <button 
                                    onClick={() => { router.push('/admin'); setIsProfileOpen(false); }}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1f1f2e] flex items-center gap-2"
                                >
                                    <i className="fa-solid fa-sliders text-purple-500"></i> 全局设置
                                </button>
                            )}
                            
                            <button 
                                onClick={() => { logout(); setIsProfileOpen(false); }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                            >
                                <i className="fa-solid fa-arrow-right-from-bracket"></i> 退出登录
                            </button>
                        </div>
                    )}
                </div>
              ) : (
                <button 
                    onClick={() => setIsLoginOpen(true)}
                    className="hidden md:inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 transition shadow-lg"
                >
                    <i className="fa-regular fa-user"></i> 登录
                </button>
              )}

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden text-slate-700 dark:text-white text-xl p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-[#111118] border-t border-gray-200 dark:border-[#1f1f2e] animate-fade-in shadow-xl">
            <div className="px-4 pt-2 pb-4 space-y-1">
              <Link href="/" className="block px-3 py-2 rounded-md text-slate-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1f1f2e]" onClick={() => setIsMobileMenuOpen(false)}>主页</Link>
              <Link href="/prompts" className="block px-3 py-2 rounded-md text-slate-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1f1f2e]" onClick={() => setIsMobileMenuOpen(false)}>提示词库</Link>
              <Link href="/workflows" className="block px-3 py-2 rounded-md text-slate-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1f1f2e]" onClick={() => setIsMobileMenuOpen(false)}>工作流</Link>
              {!user && (
                  <button onClick={() => { setIsLoginOpen(true); setIsMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-purple-600 font-bold">登录</button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Modals */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
