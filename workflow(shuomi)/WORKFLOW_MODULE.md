# 工作流模块说明文档

## 概述

工作流模块是 PromptMaster 的扩展功能，用于管理和分享 AI 自动化工作流模板。支持 n8n、ComfyUI、Dify 等主流平台的工作流导入、展示和下载。

## 核心功能

### 1. 工作流卡片展示
- **纯图片模式**：以封面图片为主的卡片设计
- **多图支持**：每个工作流最多支持 4 张预览图片
- **图片放大**：点击图片可全屏查看，支持左右切换
- **分类标签**：显示工作流所属平台（n8n/ComfyUI/Dify/其他）

### 2. 工作流详情页
- **简介展示**：工作流的简要描述
- **详细说明**：支持 Markdown 格式的详细使用说明
- **图片浏览**：右侧图片预览区，点击可放大查看
- **下载功能**：支持下载工作流 JSON 文件

### 3. 创建工作流
- **基本信息**：标题、分类、简介
- **详细说明**：支持多行文本输入
- **图片链接**：添加最多 4 张预览图片 URL
- **工作流文件**：上传 JSON 格式的工作流文件
- **下载链接**：可选的外部下载链接

### 4. 批量导入
- **JSON 格式**：支持批量导入工作流数据
- **拖拽上传**：支持拖拽文件到上传区域
- **预览确认**：导入前预览数据内容

### 5. 搜索与筛选
- **关键词搜索**：按标题和描述搜索
- **分类筛选**：按平台类型筛选
- **排序选项**：最新发布、最多浏览、最多下载、名称排序

### 6. 管理功能
- **批量选择**：管理模式下可多选工作流
- **批量删除**：删除选中的工作流
- **批量导出**：导出选中的工作流为 JSON

## 文件结构

```
src/
├── app/
│   └── workflows/
│       └── page.tsx              # 工作流列表页面
├── components/
│   └── workflows/
│       ├── index.ts              # 组件导出索引
│       ├── WorkflowCard.tsx      # 工作流卡片组件
│       ├── WorkflowGrid.tsx      # 工作流网格布局
│       ├── WorkflowSearchBar.tsx # 搜索栏组件
│       ├── WorkflowFilterSidebar.tsx # 筛选侧边栏
│       ├── WorkflowSortDropdown.tsx  # 排序下拉菜单
│       ├── WorkflowDetailModal.tsx   # 详情弹窗
│       ├── CreateWorkflowModal.tsx   # 创建/编辑弹窗
│       ├── WorkflowImportModal.tsx   # 批量导入弹窗
│       ├── WorkflowBatchActionBar.tsx # 批量操作栏
│       └── ImageViewer.tsx       # 图片查看器
├── context/
│   └── WorkflowContext.tsx       # 工作流状态管理
└── lib/
    └── types.tsx                 # 类型定义（WorkflowItem）
```

## 数据结构

### WorkflowItem 类型定义

```typescript
interface WorkflowItem {
  id: number | string;
  title: string;           // 工作流标题
  description: string;     // 简介
  detail?: string;         // 详细说明（支持 Markdown）
  category: WorkflowCategory; // 分类：n8n | comfyui | dify | other
  images: string[];        // 图片链接数组（最多4张）
  workflowJson?: string;   // 工作流 JSON 内容
  downloadUrl?: string;    // 外部下载链接
  isCustom?: boolean;      // 是否用户创建
  createdAt?: number;      // 创建时间戳
  views?: number;          // 浏览次数
  downloads?: number;      // 下载次数
}
```

### 导入数据格式

```json
[
  {
    "title": "工作流标题",
    "description": "工作流简介",
    "detail": "详细说明（可选）",
    "category": "n8n",
    "images": ["图片链接1", "图片链接2"],
    "downloadUrl": "下载链接（可选）"
  }
]
```

## 使用指南

### 访问工作流页面
导航栏点击「工作流」进入工作流列表页面。

### 创建新工作流
1. 点击「新建」按钮
2. 填写标题、选择分类
3. 输入简介和详细说明
4. 添加预览图片链接（至少1张，最多4张）
5. 上传工作流 JSON 文件或填写下载链接
6. 点击「创建工作流」

### 批量导入
1. 点击「导入」按钮
2. 拖拽或选择 JSON 文件
3. 预览导入数据
4. 确认导入

### 管理工作流
1. 点击「管理」进入管理模式
2. 点击卡片选择/取消选择
3. 使用批量操作栏进行删除或导出
4. 点击「完成管理」退出管理模式

## 技术特点

- **响应式设计**：适配桌面端和移动端
- **暗色主题**：与整体设计风格一致
- **本地存储**：数据保存在 localStorage
- **图片懒加载**：优化加载性能
- **键盘导航**：图片查看器支持方向键切换

## 与提示词模块的区别

| 特性 | 提示词模块 | 工作流模块 |
|------|-----------|-----------|
| 卡片类型 | 图标/图片 | 纯图片 |
| 核心内容 | 提示词文本 | JSON 工作流文件 |
| 图片数量 | 单张 | 最多4张 |
| 复杂度标签 | 有 | 无 |
| 收藏功能 | 有 | 无 |
| 下载功能 | 无 | 有 |
