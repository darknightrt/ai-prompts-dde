"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { PromptItem } from '../lib/types';
import { staticPrompts } from '../lib/static-data';
import { STORAGE_TYPE, isServerStorage } from '../lib/storage.types';

interface PromptContextType {
  prompts: PromptItem[];
  addPrompt: (prompt: Omit<PromptItem, 'id' | 'isCustom' | 'createdAt'>) => void;
  updatePrompt: (id: string | number, data: Partial<Omit<PromptItem, 'id' | 'createdAt'>>) => void;
  deletePrompts: (ids: (string | number)[]) => void;
  importPrompts: (prompts: Omit<PromptItem, 'id' | 'isCustom' | 'createdAt'>[]) => Promise<number>;
  refreshPrompts: () => Promise<void>;
  isLoaded: boolean;
  storageType: string;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export const PromptProvider = ({ children }: { children: React.ReactNode }) => {
  const [allPrompts, setAllPrompts] = useState<PromptItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const STORAGE_KEY = 'prompt_master_db_v1';

  // ==================== localStorage 模式 ====================
  
  const loadFromLocalStorage = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.length === 0) {
          setAllPrompts(staticPrompts);
        } else {
          setAllPrompts(parsed);
        }
      } catch (e) {
        console.error("Failed to parse prompts", e);
        setAllPrompts(staticPrompts);
      }
    } else {
      setAllPrompts(staticPrompts);
    }
  }, []);

  const saveToLocalStorage = useCallback((prompts: PromptItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
  }, []);

  // ==================== D1 API 模式 ====================

  const loadFromAPI = useCallback(async () => {
    try {
      const response = await fetch('/api/prompts');
      const data = await response.json();
      
      if (data.success && data.prompts) {
        // 如果数据库为空，初始化静态数据
        if (data.prompts.length === 0) {
          await initializeStaticData();
        } else {
          setAllPrompts(data.prompts);
        }
      } else {
        console.error('Failed to load prompts from API:', data.error);
        // 降级到静态数据
        setAllPrompts(staticPrompts);
      }
    } catch (error) {
      console.error('Failed to fetch prompts:', error);
      // API 错误时降级到静态数据
      setAllPrompts(staticPrompts);
    }
  }, []);

  const initializeStaticData = async () => {
    try {
      const response = await fetch('/api/prompts/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompts: staticPrompts }),
      });
      const data = await response.json();
      
      if (data.success) {
        // 重新加载数据
        const reloadResponse = await fetch('/api/prompts');
        const reloadData = await reloadResponse.json();
        if (reloadData.success) {
          setAllPrompts(reloadData.prompts);
        }
      }
    } catch (error) {
      console.error('Failed to initialize static data:', error);
      setAllPrompts(staticPrompts);
    }
  };

  // ==================== 初始化加载 ====================

  useEffect(() => {
    const initLoad = async () => {
      if (isServerStorage()) {
        await loadFromAPI();
      } else {
        loadFromLocalStorage();
      }
      setIsLoaded(true);
    };
    
    initLoad();
  }, [loadFromAPI, loadFromLocalStorage]);

  // localStorage 模式下监听变化并保存
  useEffect(() => {
    if (isLoaded && !isServerStorage()) {
      saveToLocalStorage(allPrompts);
    }
  }, [allPrompts, isLoaded, saveToLocalStorage]);

  // ==================== CRUD 操作 ====================

  // 新增提示词
  const addPrompt = useCallback(async (data: Omit<PromptItem, 'id' | 'isCustom' | 'createdAt'>) => {
    if (isServerStorage()) {
      try {
        const response = await fetch('/api/prompts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, isCustom: true }),
        });
        const result = await response.json();
        
        if (result.success && result.prompt) {
          setAllPrompts(prev => [result.prompt, ...prev]);
        }
      } catch (error) {
        console.error('Failed to add prompt:', error);
      }
    } else {
      const newPrompt: PromptItem = {
        ...data,
        id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        isCustom: true,
        createdAt: Date.now(),
      };
      setAllPrompts(prev => [newPrompt, ...prev]);
    }
  }, []);

  // 更新提示词
  const updatePrompt = useCallback(async (id: string | number, data: Partial<Omit<PromptItem, 'id' | 'createdAt'>>) => {
    if (isServerStorage()) {
      try {
        const response = await fetch(`/api/prompts/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        
        if (result.success && result.prompt) {
          setAllPrompts(prev => 
            prev.map(item => 
              String(item.id) === String(id) ? result.prompt : item
            )
          );
        }
      } catch (error) {
        console.error('Failed to update prompt:', error);
      }
    } else {
      setAllPrompts(prev => 
        prev.map(item => 
          String(item.id) === String(id) 
            ? { ...item, ...data } 
            : item
        )
      );
    }
  }, []);

  // 批量删除
  const deletePrompts = useCallback(async (ids: (string | number)[]) => {
    if (isServerStorage()) {
      try {
        const response = await fetch('/api/prompts/batch', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids }),
        });
        const result = await response.json();
        
        if (result.success) {
          setAllPrompts(prev => prev.filter(p => !ids.includes(p.id) && !ids.includes(String(p.id))));
        }
      } catch (error) {
        console.error('Failed to delete prompts:', error);
      }
    } else {
      setAllPrompts(prev => prev.filter(p => !ids.includes(p.id) && !ids.includes(String(p.id))));
    }
  }, []);

  // 批量导入
  const importPrompts = useCallback(async (prompts: Omit<PromptItem, 'id' | 'isCustom' | 'createdAt'>[]): Promise<number> => {
    if (isServerStorage()) {
      try {
        const response = await fetch('/api/prompts/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompts }),
        });
        const result = await response.json();
        
        if (result.success) {
          // 重新加载数据
          await loadFromAPI();
          return result.imported || 0;
        }
      } catch (error) {
        console.error('Failed to import prompts:', error);
      }
      return 0;
    } else {
      const newPrompts = prompts.map(data => ({
        ...data,
        id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        isCustom: true,
        createdAt: Date.now(),
      }));
      setAllPrompts(prev => [...newPrompts, ...prev]);
      return newPrompts.length;
    }
  }, [loadFromAPI]);

  // 刷新数据
  const refreshPrompts = useCallback(async () => {
    if (isServerStorage()) {
      await loadFromAPI();
    } else {
      loadFromLocalStorage();
    }
  }, [loadFromAPI, loadFromLocalStorage]);

  return (
    <PromptContext.Provider value={{ 
      prompts: allPrompts, 
      addPrompt, 
      updatePrompt, 
      deletePrompts, 
      importPrompts,
      refreshPrompts,
      isLoaded,
      storageType: STORAGE_TYPE
    }}>
      {children}
    </PromptContext.Provider>
  );
};

export const usePrompts = () => {
  const context = useContext(PromptContext);
  if (!context) throw new Error('usePrompts must be used within a PromptProvider');
  return context;
};
