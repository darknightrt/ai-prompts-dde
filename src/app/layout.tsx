import './globals.css';
import { Inter } from 'next/font/google';
// 核心修复：引入封装好的 Providers 组件，而不是直接引入 Context
import { Providers } from '@/components/Providers';
import Navbar from '@/components/layout/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AI Prompts Master - 释放AI潜能',
  description: '掌握与AI对话的',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${inter.className} bg-slate-50 text-slate-800 dark:bg-dark-bg dark:text-dark-text transition-colors duration-300 flex flex-col min-h-screen`}>
        {/* 使用 Providers 组件包裹整个应用 */}
        <Providers>
          <Navbar />
          <main className="flex-grow pt-16">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
