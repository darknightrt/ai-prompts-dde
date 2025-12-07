"use client";

import React, { useState, useEffect } from 'react';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// 可折叠面板组件
function CollapsibleSection({ 
  title, 
  icon, 
  isOpen, 
  onToggle, 
  children 
}: { 
  title: string; 
  icon: string; 
  isOpen: boolean; 
  onToggle: () => void; 
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800/50">
      <button 
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-slate-800/80 hover:bg-gray-100 dark:hover:bg-slate-700/80 transition-colors"
      >
        <div className="flex items-center gap-3">
          <i className={`${icon} text-purple-600 dark:text-purple-400 text-lg`}></i>
          <span className="font-semibold text-slate-900 dark:text-white text-lg">{title}</span>
        </div>
        <i className={`fa-solid fa-chevron-down text-slate-400 dark:text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      {isOpen && (
        <div className="p-6 bg-white dark:bg-slate-900/50 space-y-5 border-t border-gray-100 dark:border-slate-700">
          {children}
        </div>
      )}
    </div>
  );
}

// 开关组件
function ToggleSwitch({ 
  checked, 
  onChange, 
  label 
}: { 
  checked: boolean; 
  onChange: (checked: boolean) => void; 
  label?: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      {label && <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>}
      <div className="relative">
        <input 
          type="checkbox" 
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={`w-11 h-6 rounded-full transition-colors ${checked ? 'bg-purple-600' : 'bg-gray-300 dark:bg-slate-600'}`}>
          <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : ''}`}></div>
        </div>
      </div>
    </label>
  );
}

export default function AdminPage() {
  const { config, updateConfig, resetConfig } = useSiteConfig();
  const { showToast } = useToast();
  const { isAdmin, user } = useAuth();
  const router = useRouter();
  
  // 折叠状态 - 默认全部折叠
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    siteSettings: false,
    userSettings: false,
    inviteCode: false
  });
  
  // Local state for editing
  const [formData, setFormData] = useState(config);
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 权限检查
  useEffect(() => {
    if (!user) {
      router.push('/');
      showToast('请先登录', 'error');
      return;
    }
    if (!isAdmin) {
      router.push('/');
      showToast('无权限访问', 'error');
      return;
    }
    setIsLoading(false);
  }, [user, isAdmin, router, showToast]);

  // 获取用户数量
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch('/api/admin/user-count');
        if (response.ok) {
          const data = await response.json();
          setUserCount(data.count);
          setFormData(prev => ({
            ...prev,
            userSettings: {
              ...prev.userSettings,
              userCount: data.count
            }
          }));
        }
      } catch (error) {
        console.error('Failed to fetch user count:', error);
      }
    };
    
    if (isAdmin) {
      fetchUserCount();
    }
  }, [isAdmin]);

  // 同步config变化
  useEffect(() => {
    setFormData(config);
  }, [config]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSave = () => {
    updateConfig(formData);
    showToast('站点配置已更新', 'success');
  };

  const handleReset = () => {
    if(confirm('确定恢复默认设置吗？此操作不可撤销。')) {
      resetConfig();
      setFormData(config);
      showToast('已恢复默认设置', 'success');
    }
  };

  // 生成随机邀请码
  const generateInviteCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({
      ...formData,
      inviteCode: { ...formData.inviteCode, code }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-purple-600 dark:text-purple-400"></i>
          <p className="mt-4 text-slate-600 dark:text-slate-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-shield-halved text-3xl text-purple-600 dark:text-purple-400"></i>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">管理员设置</h1>
            </div>
            <button 
              onClick={handleReset}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium shadow-lg flex items-center gap-2"
            >
              重置默认设置
            </button>
          </div>
          <p className="text-slate-600 dark:text-slate-400">管理站点配置、用户设置和邀请码</p>
        </div>

        {/* 设置面板 */}
        <div className="space-y-4">
          {/* 站点设置 */}
          <CollapsibleSection 
            title="站点设置" 
            icon="fa-solid fa-globe"
            isOpen={expandedSections.siteSettings}
            onToggle={() => toggleSection('siteSettings')}
          >
            {/* 首页 Hero 内容 */}
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200 border-b border-gray-200 dark:border-slate-700 pb-2">首页 Hero 内容</h4>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">主标题 (支持 HTML)</label>
                <input 
                  type="text" 
                  value={formData.homeTitle}
                  onChange={e => setFormData({...formData, homeTitle: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="输入主标题"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">打字机文本 (逗号分隔)</label>
                <input 
                  type="text" 
                  value={formData.typewriterTexts.join(',')}
                  onChange={e => setFormData({...formData, typewriterTexts: e.target.value.split(',')})}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="文本1,文本2,文本3"
                />
              </div>
            </div>

            {/* 提示词页面设置 */}
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-slate-700">
              <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200 border-b border-gray-200 dark:border-slate-700 pb-2">提示词页面设置</h4>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">页面标题</label>
                <input 
                  type="text" 
                  value={formData.promptsPage.title}
                  onChange={e => setFormData({
                    ...formData, 
                    promptsPage: { ...formData.promptsPage, title: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="输入页面标题"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">宣传语/描述</label>
                <textarea 
                  rows={2}
                  value={formData.promptsPage.description}
                  onChange={e => setFormData({
                    ...formData, 
                    promptsPage: { ...formData.promptsPage, description: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
                  placeholder="输入描述"
                />
              </div>
            </div>

            {/* 工作流页面设置 */}
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-slate-700">
              <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200 border-b border-gray-200 dark:border-slate-700 pb-2">工作流页面设置</h4>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">页面标题</label>
                <input 
                  type="text" 
                  value={formData.workflowsPage?.title || '工作流库'}
                  onChange={e => setFormData({
                    ...formData, 
                    workflowsPage: { ...formData.workflowsPage, title: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="输入工作流页面标题"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">宣传语/描述</label>
                <textarea 
                  rows={2}
                  value={formData.workflowsPage?.description || ''}
                  onChange={e => setFormData({
                    ...formData, 
                    workflowsPage: { ...formData.workflowsPage, description: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
                  placeholder="输入工作流页面描述"
                />
              </div>
            </div>

            {/* 全站公告 */}
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-slate-700">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-700 pb-2">
                <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">全站公告</h4>
                <ToggleSwitch 
                  checked={formData.announcement.enabled}
                  onChange={checked => setFormData({...formData, announcement: {...formData.announcement, enabled: checked}})}
                  label="启用"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">公告标题</label>
                <input 
                  type="text" 
                  value={formData.announcement.title}
                  onChange={e => setFormData({...formData, announcement: {...formData.announcement, title: e.target.value}})}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="输入公告标题"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">公告内容</label>
                <textarea 
                  rows={3}
                  value={formData.announcement.content}
                  onChange={e => setFormData({...formData, announcement: {...formData.announcement, content: e.target.value}})}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
                  placeholder="输入公告内容"
                />
              </div>
            </div>

            {/* 保存按钮 */}
            <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
              <button 
                onClick={handleSave}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-lg shadow-purple-500/30 transition font-medium flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-check"></i>
                保存站点设置
              </button>
            </div>
          </CollapsibleSection>

          {/* 用户设置 */}
          <CollapsibleSection 
            title="用户设置" 
            icon="fa-solid fa-users"
            isOpen={expandedSections.userSettings}
            onToggle={() => toggleSection('userSettings')}
          >
            {/* 允许用户注册 */}
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
              <div>
                <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">允许用户注册</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">关闭后新用户将无法注册</p>
              </div>
              <ToggleSwitch 
                checked={formData.userSettings.allowRegistration}
                onChange={checked => setFormData({
                  ...formData, 
                  userSettings: {...formData.userSettings, allowRegistration: checked}
                })}
              />
            </div>

            {/* 用户数量统计 */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
              <div>
                <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">用户数量统计</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">当前注册用户总数</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{userCount}</div>
                <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">位用户</div>
              </div>
            </div>

            {/* 自动清理非活跃用户 */}
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">自动清理非活跃用户</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">注册后超过指定天数且从未登入的用户将被自动删除</p>
                </div>
                <ToggleSwitch 
                  checked={formData.userSettings.autoCleanup.enabled}
                  onChange={checked => setFormData({
                    ...formData, 
                    userSettings: {
                      ...formData.userSettings, 
                      autoCleanup: {...formData.userSettings.autoCleanup, enabled: checked}
                    }
                  })}
                />
              </div>
              {formData.userSettings.autoCleanup.enabled && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">保留天数</label>
                  <input 
                    type="number" 
                    min="1"
                    value={formData.userSettings.autoCleanup.retentionDays}
                    onChange={e => setFormData({
                      ...formData, 
                      userSettings: {
                        ...formData.userSettings, 
                        autoCleanup: {...formData.userSettings.autoCleanup, retentionDays: parseInt(e.target.value) || 30}
                      }
                    })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">用户注册后超过此天数且从未登入将被自动删除</p>
                </div>
              )}
            </div>

            {/* 保存按钮 */}
            <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
              <button 
                onClick={handleSave}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-lg shadow-purple-500/30 transition font-medium flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-check"></i>
                保存用户设置
              </button>
            </div>
          </CollapsibleSection>

          {/* 邀请码设置 */}
          <CollapsibleSection 
            title="邀请码设置" 
            icon="fa-solid fa-ticket"
            isOpen={expandedSections.inviteCode}
            onToggle={() => toggleSection('inviteCode')}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                <div>
                  <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">启用邀请码</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">启用后用户注册时需要输入正确的邀请码</p>
                </div>
                <ToggleSwitch 
                  checked={formData.inviteCode.enabled}
                  onChange={checked => setFormData({...formData, inviteCode: {...formData.inviteCode, enabled: checked}})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">邀请码</label>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    value={formData.inviteCode.code}
                    onChange={e => setFormData({...formData, inviteCode: {...formData.inviteCode, code: e.target.value}})}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    placeholder="输入邀请码（字母数字）"
                  />
                  <button 
                    onClick={generateInviteCode}
                    className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium shadow-lg shadow-purple-500/20"
                  >
                    <i className="fa-solid fa-rotate mr-2"></i>
                    生成
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">邀请码用于限制用户注册，只有拥有正确邀请码的用户才能注册</p>
              </div>
            </div>

            {/* 保存按钮 */}
            <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
              <button 
                onClick={handleSave}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-lg shadow-purple-500/30 transition font-medium flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-check"></i>
                保存邀请码设置
              </button>
            </div>
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
}
