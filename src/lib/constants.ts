import { Category, Complexity } from './types';

// 分类配置
export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'all', label: '全部提示词', icon: 'fa-solid fa-border-all' },
  { id: 'code', label: '工程技术', icon: 'fa-solid fa-code' },
  { id: 'writing', label: '个人效率', icon: 'fa-solid fa-pen-nib' },
  { id: 'mj', label: 'AI智能绘画', icon: 'fa-solid fa-palette' },
  { id: 'business', label: '财务金融', icon: 'fa-solid fa-briefcase' },
  { id: 'roleplay', label: '社交媒体', icon: 'fa-solid fa-users' },
  { id: 'custom', label: '我的收藏', icon: 'fa-solid fa-heart' },
];

// 复杂度配置
export const COMPLEXITY_LEVELS: { id: Complexity; label: string; color: string }[] = [
  { id: 'beginner', label: '初级', color: 'bg-yellow-500 text-black' },
  { id: 'intermediate', label: '中级', color: 'bg-blue-500 text-white' },
  { id: 'advanced', label: '高级', color: 'bg-red-500 text-white' }
];

// 图标选项
export const ICON_OPTIONS = [
  'fa-solid fa-robot',
  'fa-solid fa-code',
  'fa-solid fa-pen-nib',
  'fa-solid fa-image',
  'fa-solid fa-briefcase',
  'fa-solid fa-bitcoin',
  'fa-solid fa-graduation-cap',
  'fa-solid fa-music',
  'fa-solid fa-gamepad',
  'fa-solid fa-palette',
  'fa-solid fa-camera',
  'fa-solid fa-heart',
  'fa-solid fa-copy',
  'fa-solid fa-star',
  'fa-solid fa-bolt',
  'fa-solid fa-fire',
  'fa-solid fa-rocket',
  'fa-solid fa-lightbulb'
];

// 排序选项
export const SORT_OPTIONS = [
  { value: 'latest', label: '最新', icon: 'fa-clock' },
  { value: 'oldest', label: '最早', icon: 'fa-clock-rotate-left' },
  { value: 'title-asc', label: '标题 A-Z', icon: 'fa-arrow-up-a-z' },
  { value: 'title-desc', label: '标题 Z-A', icon: 'fa-arrow-up-z-a' },
] as const;

// 本地存储键
export const STORAGE_KEYS = {
  PROMPTS: 'prompt_master_db_v1',
  USER_PREFERENCES: 'user_preferences_v1',
  THEME: 'theme_preference'
} as const;

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 48, 96]
} as const;
