import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // 必须开启 class 模式以配合 next-themes
  safelist: [
    'flex', 'grid', 'hidden', 'block', 'inline-block', 'inline-flex',
    'flex-col', 'flex-row', 'flex-grow', 'flex-shrink',
    'items-center', 'items-start', 'items-end',
    'justify-center', 'justify-between', 'justify-start', 'justify-end',
    'gap-2', 'gap-3', 'gap-4', 'gap-6', 'gap-8',
    'space-x-4', 'space-x-8', 'space-y-1', 'space-y-4',
    'w-full', 'h-full', 'min-h-screen',
    'max-w-7xl', 'mx-auto', 'px-4', 'py-2', 'p-4', 'p-6', 'p-8',
    'text-center', 'text-left', 'text-right',
    'rounded-full', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl',
    'shadow-lg', 'shadow-xl', 'shadow-2xl',
    'border', 'border-b', 'border-t',
    'fixed', 'absolute', 'relative', 'sticky',
    'top-0', 'left-0', 'right-0', 'bottom-0', 'z-50', 'z-100',
    'overflow-hidden', 'overflow-y-auto',
    'transition', 'transition-all', 'duration-300',
    'hover:bg-purple-600', 'hover:text-white',
    'dark:bg-dark-bg', 'dark:bg-dark-card', 'dark:text-dark-text',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0f',
          card: '#111118',
          text: '#e5e7eb',
          border: '#1f1f2e',
          muted: '#9ca3af'
        }
      },
      animation: {
        'gradient': 'gradientMove 5s ease infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
      },
      keyframes: {
        gradientMove: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'fade-in-up': {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};
export default config;