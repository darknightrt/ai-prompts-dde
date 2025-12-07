"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

export type UserRole = 'guest' | 'user' | 'admin';

interface User {
  id?: number;
  username: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, role: UserRole, id?: number) => void;
  logout: () => void;
  isAdmin: boolean;
  isLoggedIn: boolean;
  isUser: boolean;
  canManage: boolean;
  canCreate: boolean;
  canEdit: (isCustom?: boolean) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { showToast } = useToast();

  // 初始化检查本地存储
  useEffect(() => {
    const storedUser = localStorage.getItem('current_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) { console.error(e); }
    }
  }, []);

  const login = (username: string, role: UserRole, id?: number) => {
    const newUser: User = { 
      id,
      username, 
      role,
      avatar: role === 'admin' 
        ? 'https://ui-avatars.com/api/?name=Admin&background=9333ea&color=fff' 
        : 'https://ui-avatars.com/api/?name=User&background=random' 
    };
    setUser(newUser);
    localStorage.setItem('current_user', JSON.stringify(newUser));
    
    // 重置公告查看状态，以便新用户能看到公告
    localStorage.removeItem('announcement_seen');
    
    showToast(`欢迎回来，${role === 'admin' ? '管理员' : '用户'} ${username}`, 'success');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('current_user');
    showToast('已安全退出', 'success');
  };

  // 权限检查
  const isLoggedIn = user !== null;
  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';
  const canManage = isAdmin; // 只有管理员可以使用管理功能
  const canCreate = isLoggedIn; // 登录用户都可以创建
  const canEdit = (isCustom?: boolean) => {
    if (isAdmin) return true; // 管理员可以编辑所有
    if (isUser && isCustom) return true; // 普通用户只能编辑自己创建的
    return false;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAdmin,
      isLoggedIn,
      isUser,
      canManage,
      canCreate,
      canEdit
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
