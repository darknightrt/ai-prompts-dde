"use client";

import React, { useState, useEffect } from 'react';
import { useSiteConfig, SiteConfig } from '@/context/SiteConfigContext';
import { useToast } from '@/context/ToastContext';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
    <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <button 
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-slate-800/80 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <i className={`${icon} text-purple-600 dark:text-purple-400`}></i>
          <span className="font-medium text-slate-800 dark:text-white">{title}</span>
        </div>
        <i className={`fa-solid fa-chevron-down text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      {isOpen && (
        <div className="p-4 bg-white dark:bg-slate-900/50 space-y-4">
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
    <label className="flex items-center gap-2 cursor-pointer">
      {label && <span className="text-sm text-slate-600 dark:text-gray-400">{label}</span>}
      <div className="relative">
        <input 
          type="checkbox" 
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={`w-10 h-6 rounded-full transition-colors ${checked ? 'bg-purple-600' : 'bg-gray-300 dark:bg-slate-600'}`}>
          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-4' : ''}`}></div>
        </div>
      </div>
    </label>
  );
}

export default function AdminPanelModal({ isOpen, onClose }: AdminPanelModalProps) {
  const { config, updateConfig, resetConfig } = useSiteConfig();
  const { showToast } = useToast();
  
  // 折叠状态
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    siteConfig: false,
    userConfig: false,
    configFile: false
  });
  
  // Local state for editing
  const [formData, setFormData] = useState<SiteConfig>(config);

  // 同步config变化
  useEffect(() => {
    setFormData(config);
  }, [config]);

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSave = () => {
    updateConfig(formData);
    showToast('站点配置已更新', 'success');
    onClose();
  };

  const handleReset = () => {
    if(confirm('确定恢复默认设置吗？')) {
        resetConfig();
        setFormData(config);
        onClose();
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-gray-100 dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-slate-700 flex flex-col">
        {/* 头部 */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-800 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">管理员设置</h2>
            <span className="px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded">管理员</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* 内容区域 */}
        <div className="p-4 space-y-3 flex-1">
          {/* 配置文件 */}
          <CollapsibleSection 
            title="配置文件" 
            icon="fa-solid fa-file-code"
            isOpen={expandedSections.configFile}
            onToggle={() => toggleSection('configFile')}
          >
            {/* 首页设置 */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-gray-300 border-b border-gray-200 dark:border-slate-700 pb-2">首页 Hero 内容</h4>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-gray-400">主标题 (支持 HTML)</label>
                <input 
                  type="text" 
                  value={formData.homeTitle}
                  onChange={e => setFormData({...formData, homeTitle: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-gray-400">打字机文本 (逗号分隔)</label>
                <input 
                  type="text" 
                  value={formData.typewriterTexts.join(',')}
                  onChange={e => setFormData({...formData, typewriterTexts: e.target.value.split(',')})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="文本1,文本2,文本3"
                />
              </div>
            </div>

            {/* 提示词页面设置 */}
            <div className="space-y-3 pt-4">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-gray-300 border-b border-gray-200 dark:border-slate-700 pb-2">提示词页面设置</h4>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-gray-400">页面标题</label>
                <input 
                  type="text" 
                  value={formData.promptsPage.title}
                  onChange={e => setFormData({
                    ...formData, 
                    promptsPage: { ...formData.promptsPage, title: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-gray-400">宣传语/描述</label>
                <textarea 
                  rows={2}
                  value={formData.promptsPage.description}
                  onChange={e => setFormData({
                    ...formData, 
                    promptsPage: { ...formData.promptsPage, description: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            {/* 公告设置 */}
            <div className="space-y-3 pt-4">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-700 pb-2">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-gray-300">全站公告</h4>
                <ToggleSwitch 
                  checked={formData.announcement.enabled}
                  onChange={checked => setFormData({...formData, announcement: {...formData.announcement, enabled: checked}})}
                  label="启用"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-gray-400">公告标题</label>
                <input 
                  type="text" 
                  value={formData.announcement.title}
                  onChange={e => setFormData({...formData, announcement: {...formData.announcement, title: e.target.value}})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-gray-400">公告内容</label>
                <textarea 
                  rows={3}
                  value={formData.announcement.content}
                  onChange={e => setFormData({...formData, announcement: {...formData.announcement, content: e.target.value}})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* 站点配置 */}
          <CollapsibleSection 
            title="站点配置" 
            icon="fa-solid fa-globe"
            isOpen={expandedSections.siteConfig}
            onToggle={() => toggleSection('siteConfig')}
          >
            {/* 邀请码设置 */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-700 pb-2">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-gray-300">邀请码设置</h4>
                <ToggleSwitch 
                  checked={formData.inviteCode.enabled}
                  onChange={checked => setFormData({...formData, inviteCode: {...formData.inviteCode, enabled: checked}})}
                  label="启用"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-gray-400">邀请码</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={formData.inviteCode.code}
                    onChange={e => setFormData({...formData, inviteCode: {...formData.inviteCode, code: e.target.value}})}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="输入邀请码（字母数字）"
                  />
                  <button 
                    onClick={generateInviteCode}
                    className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
                  >
                    生成
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">启用后，用户注册时需要输入正确的邀请码</p>
              </div>
            </div>
          </CollapsibleSection>

          {/* 用户配置 */}
          <CollapsibleSection 
            title="用户配置" 
            icon="fa-solid fa-users"
            isOpen={expandedSections.userConfig}
            onToggle={() => toggleSection('userConfig')}
          >
            {/* 用户注册设置 */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-gray-300">允许用户注册</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-500">关闭后新用户将无法注册</p>
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
              <div className="flex justify-between items-center py-3 border-t border-gray-200 dark:border-slate-700">
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-gray-300">用户数量统计</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-500">当前注册用户总数</p>
                </div>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formData.userSettings.userCount}</span>
              </div>

              {/* 自动清理非活跃用户 */}
              <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-slate-700">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-gray-300">自动清理非活跃用户</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-500">注册后超过指定天数且从未登入的用户将被自动删除</p>
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
                    <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-gray-400">保留天数</label>
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
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">用户注册后超过此天数且从未登入将被自动删除</p>
                  </div>
                )}
              </div>
            </div>
          </CollapsibleSection>
        </div>

        {/* 底部操作栏 */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 flex justify-between sticky bottom-0">
          <button 
            onClick={handleReset}
            className="text-red-500 hover:text-red-600 text-sm font-medium px-4 py-2"
          >
            重置默认
          </button>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2 rounded-lg text-slate-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition">
              取消
            </button>
            <button onClick={handleSave} className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-lg shadow-purple-500/20 transition font-medium">
              保存更改
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}