"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

// 存储类型判断
const STORAGE_TYPE = process.env.NEXT_PUBLIC_STORAGE_TYPE || 'localstorage';
const isD1Storage = STORAGE_TYPE === 'd1';

interface FavoritesContextType {
  favorites: Set<string | number>;
  isFavorite: (promptId: string | number) => boolean;
  toggleFavorite: (promptId: string | number) => void;
  getFavoriteCount: () => number;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const [favorites, setFavorites] = useState<Set<string | number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const STORAGE_KEY = 'user_favorites_v1';

  // 从 D1 加载收藏
  const loadFromD1 = useCallback(async (userId: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/favorites/prompts?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setFavorites(new Set(data.favorites || []));
      }
    } catch (error) {
      console.error('Failed to load favorites from D1:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 从 localStorage 加载收藏
  const loadFromLocalStorage = useCallback(() => {
    if (!user) return;
    const storedFavorites = localStorage.getItem(STORAGE_KEY);
    if (storedFavorites) {
      try {
        const allFavorites = JSON.parse(storedFavorites);
        const userFavorites = allFavorites[user.username] || [];
        setFavorites(new Set(userFavorites));
      } catch (e) {
        console.error('Failed to load favorites:', e);
        setFavorites(new Set());
      }
    }
  }, [user]);

  // 加载当前用户的收藏
  useEffect(() => {
    if (isLoggedIn && user) {
      if (isD1Storage && user.id) {
        loadFromD1(user.id);
      } else {
        loadFromLocalStorage();
      }
    } else {
      setFavorites(new Set());
    }
  }, [user, isLoggedIn, loadFromD1, loadFromLocalStorage]);

  // 保存收藏到 localStorage
  const saveToLocalStorage = useCallback((newFavorites: Set<string | number>) => {
    if (!user) return;
    try {
      const storedFavorites = localStorage.getItem(STORAGE_KEY);
      const allFavorites = storedFavorites ? JSON.parse(storedFavorites) : {};
      allFavorites[user.username] = Array.from(newFavorites);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allFavorites));
    } catch (e) {
      console.error('Failed to save favorites:', e);
    }
  }, [user]);

  // 添加收藏到 D1
  const addToD1 = useCallback(async (userId: number, promptId: string | number) => {
    try {
      await fetch('/api/favorites/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, promptId })
      });
    } catch (error) {
      console.error('Failed to add favorite to D1:', error);
    }
  }, []);

  // 从 D1 移除收藏
  const removeFromD1 = useCallback(async (userId: number, promptId: string | number) => {
    try {
      await fetch('/api/favorites/prompts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, promptId })
      });
    } catch (error) {
      console.error('Failed to remove favorite from D1:', error);
    }
  }, []);

  // 检查是否收藏
  const isFavorite = useCallback((promptId: string | number) => {
    return favorites.has(String(promptId));
  }, [favorites]);

  // 切换收藏状态
  const toggleFavorite = useCallback((promptId: string | number) => {
    const id = String(promptId);
    const isCurrentlyFavorite = favorites.has(id);

    setFavorites(prev => {
      const newFavorites = new Set(prev);
      
      if (isCurrentlyFavorite) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      
      // 根据存储类型保存
      if (isD1Storage && user?.id) {
        if (isCurrentlyFavorite) {
          removeFromD1(user.id, promptId);
        } else {
          addToD1(user.id, promptId);
        }
      } else {
        saveToLocalStorage(newFavorites);
      }
      
      return newFavorites;
    });
  }, [favorites, user, saveToLocalStorage, addToD1, removeFromD1]);

  // 获取收藏数量
  const getFavoriteCount = useCallback(() => {
    return favorites.size;
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{
      favorites,
      isFavorite,
      toggleFavorite,
      getFavoriteCount,
      isLoading
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within a FavoritesProvider');
  return context;
};
