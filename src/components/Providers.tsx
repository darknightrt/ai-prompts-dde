"use client";

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { PromptProvider } from '../context/PromptContext';
import { WorkflowProvider } from '../context/WorkflowContext';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';
import { SiteConfigProvider } from '../context/SiteConfigContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { WorkflowFavoritesProvider } from '../context/WorkflowFavoritesContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ToastProvider>
        <SiteConfigProvider>
          <AuthProvider>
            <FavoritesProvider>
              <PromptProvider>
                <WorkflowProvider>
                  <WorkflowFavoritesProvider>
                    {children}
                  </WorkflowFavoritesProvider>
                </WorkflowProvider>
              </PromptProvider>
            </FavoritesProvider>
          </AuthProvider>
        </SiteConfigProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
