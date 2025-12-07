export type Category = 'code' | 'mj' | 'writing' | 'roleplay' | 'business' | 'custom' | 'all';

export type Complexity = 'beginner' | 'intermediate' | 'advanced';

// 标签颜色类型
export type TagColor = 'purple' | 'green' | 'blue' | 'yellow';

export interface PromptTag {
  text: string;
  color: TagColor;
}

export interface PromptItem {
  id: number | string;
  title: string;
  desc?: string;
  prompt: string;
  category: Category;
  complexity?: Complexity; // 新增复杂度字段
  type: 'icon' | 'image' | 'text';
  icon?: string; // FontAwesome class, e.g., "fa-solid fa-robot"
  image?: string;
  isCustom?: boolean; // 区分是系统预置还是用户创建
  createdAt?: number;
  isFavorite?: boolean; // 收藏状态
  tags?: PromptTag[]; // 自定义标签
}

// ==================== 工作流类型定义 ====================

export type WorkflowCategory = 'n8n' | 'comfyui' | 'dify' | 'other' | 'all' | 'favorites';

export type WorkflowComplexity = 'beginner' | 'intermediate' | 'advanced';

export interface WorkflowAuthor {
  name: string;
  isAdmin?: boolean; // 是否管理员
}

export interface WorkflowItem {
  id: number | string;
  title: string;
  description: string; // 简介
  detail?: string; // 详细说明
  category: WorkflowCategory;
  complexity?: WorkflowComplexity; // 复杂度
  images: string[]; // 图片链接数组，最多4张
  workflowJson?: string; // 工作流JSON文件内容
  downloadUrl?: string; // 工作流下载链接
  isCustom?: boolean;
  createdAt?: number;
  updatedAt?: number; // 更新时间
  author?: WorkflowAuthor; // 作者信息
  views?: number; // 浏览次数
  downloads?: number; // 下载次数
}