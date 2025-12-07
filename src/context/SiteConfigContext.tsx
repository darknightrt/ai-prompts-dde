"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AnnouncementConfig {
  enabled: boolean;
  title: string;
  content: string;
}

interface PromptsPageConfig {
  title: string;
  description: string;
}

interface WorkflowsPageConfig {
  title: string;
  description: string;
}

interface AutoCleanupConfig {
  enabled: boolean;
  retentionDays: number;
}

interface UserSettingsConfig {
  allowRegistration: boolean;
  userCount: number;
  autoCleanup: AutoCleanupConfig;
}

interface InviteCodeConfig {
  enabled: boolean;
  code: string;
}

export interface SiteConfig {
  /*提示词管理页面有用户设置 站点设置 邀请码设置 */
  homeTitle: string;
  typewriterTexts: string[];
  announcement: AnnouncementConfig;
  promptsPage: PromptsPageConfig;
  workflowsPage: WorkflowsPageConfig;
  userSettings: UserSettingsConfig;
  inviteCode: InviteCodeConfig;
}

const DEFAULT_CONFIG: SiteConfig = {
  homeTitle: "掌握与AI对话的<br/>",
  typewriterTexts: ["终极艺术", "顶级技巧", "思维能力"],
  announcement: {
    enabled: true,
    title: "🎉 欢迎来到 PromptMaster",
    content: "这是一个全新的 AI 提示词管理平台。现在支持管理员在线编辑所有内容！"
  },
  promptsPage: {
    title: "提示词指南",
    description: "发现复制高质量的ai提示词,高效完成你的ai创意"
  },
  workflowsPage: {
    title: "工作流库",
    description: "探索精选的 AI 工作流模板，包括 n8n、ComfyUI、Dify 等平台的自动化流程，助你快速搭建智能工作流。"
  },
  userSettings: {
    allowRegistration: true,
    userCount: 0,
    autoCleanup: {
      enabled: false,
      retentionDays: 30
    }
  },
  inviteCode: {
    enabled: false,
    code: ""
  }
};

interface SiteConfigContextType {
  config: SiteConfig;
  updateConfig: (newConfig: Partial<SiteConfig>) => void;
  resetConfig: () => void;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('site_config');
    if (stored) {
      try {
        // Deep merge logic might be needed for production, but simplistic spread works for top level additions if we handle defaults carefully.
        // Here we ensure new fields exist even if old config is loaded
        const loadedConfig = JSON.parse(stored);
        setConfig({
          ...DEFAULT_CONFIG,
          ...loadedConfig,
          promptsPage: { ...DEFAULT_CONFIG.promptsPage, ...(loadedConfig.promptsPage || {}) },
          workflowsPage: { ...DEFAULT_CONFIG.workflowsPage, ...(loadedConfig.workflowsPage || {}) },
          userSettings: { ...DEFAULT_CONFIG.userSettings, ...(loadedConfig.userSettings || {}), autoCleanup: { ...DEFAULT_CONFIG.userSettings.autoCleanup, ...(loadedConfig.userSettings?.autoCleanup || {}) } },
          inviteCode: { ...DEFAULT_CONFIG.inviteCode, ...(loadedConfig.inviteCode || {}) }
        });
      } catch (e) {
        console.error("Failed to load site config", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('site_config', JSON.stringify(config));
    }
  }, [config, isLoaded]);

  const updateConfig = (newConfig: Partial<SiteConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
  };

  return (
    <SiteConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (!context) throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  return context;
};