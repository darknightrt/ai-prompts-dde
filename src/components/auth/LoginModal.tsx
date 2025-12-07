"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useSiteConfig } from '@/context/SiteConfigContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const { login } = useAuth();
  const { showToast } = useToast();
  const { config } = useSiteConfig();

  if (!isOpen) return null;

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setEmail('');
    setInviteCode('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      showToast('请输入用户名和密码', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      // 调用登录 API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (data.success && data.user) {
        login(data.user.username, data.user.role, data.user.id);
        onClose();
        resetForm();
      } else {
        showToast(data.error || '用户名或密码错误', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast('登录失败，请稍后重试', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 检查是否允许注册
    if (!config.userSettings.allowRegistration) {
      showToast('当前不允许注册新用户', 'error');
      return;
    }
    
    // 验证表单
    if (!username || !password || !confirmPassword || !email) {
      showToast('请填写所有必填字段', 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      showToast('两次输入的密码不一致', 'error');
      return;
    }
    
    if (password.length < 6) {
      showToast('密码长度至少6位', 'error');
      return;
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('请输入有效的邮箱地址', 'error');
      return;
    }
    
    // 验证邀请码（如果启用）
    if (config.inviteCode.enabled) {
      if (!inviteCode) {
        showToast('请输入邀请码', 'error');
        return;
      }
      if (inviteCode !== config.inviteCode.code) {
        showToast('邀请码无效', 'error');
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      // 调用注册 API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, inviteCode })
      });
      
      const data = await response.json();
      
      if (data.success) {
        showToast('注册成功，请登录', 'success');
        setIsRegisterMode(false);
        resetForm();
      } else {
        showToast(data.error || '注册失败', 'error');
      }
    } catch (error) {
      console.error('Register error:', error);
      showToast('注册失败，请稍后重试', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-8 w-full max-w-sm animate-fade-in-up border border-gray-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">
          {isRegisterMode ? '注册账号' : '欢迎登录'}
        </h2>
        
        {isRegisterMode ? (
          // 注册表单
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">用户名</label>
              <input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="请输入用户名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">邮箱</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="请输入邮箱"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">密码</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="请输入密码（至少6位）"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">确认密码</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="请再次输入密码"
              />
            </div>
            {config.inviteCode.enabled && (
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">邀请码</label>
                <input 
                  type="text" 
                  value={inviteCode} 
                  onChange={e => setInviteCode(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="请输入邀请码"
                />
              </div>
            )}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '注册中...' : '立即注册'}
            </button>
          </form>
        ) : (
          // 登录表单
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">用户名</label>
              <input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="请输入用户名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">密码</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-slate-800 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="请输入密码"
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '登录中...' : '立即登录'}
            </button>
          </form>
        )}
        
        {/* 切换登录/注册 */}
        {config.userSettings.allowRegistration && (
          <div className="mt-4 text-center">
            <button 
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                resetForm();
              }}
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              {isRegisterMode ? '已有账号？立即登录' : '没有账号？立即注册'}
            </button>
          </div>
        )}
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>
    </div>
  );
}
