# 提示词管理页面重构指南

## 📋 重构概述

本次重构对提示词管理页面进行了全面的架构优化和功能增强，遵循现代前端开发最佳实践。

## 🎯 重构目标

### 1. **架构优化**
- ✅ 组件拆分：将 296 行的单一组件拆分为多个职责单一的小组件
- ✅ 逻辑抽离：使用自定义 Hooks 抽离业务逻辑
- ✅ 代码复用：提取公共逻辑和配置

### 2. **性能优化**
- ✅ 搜索防抖：使用 `useDebounce` Hook 优化搜索性能
- ✅ 计算缓存：使用 `useMemo` 缓存过滤和统计结果
- ✅ 组件懒加载：Modal 组件按需渲染

### 3. **功能增强**
- ✅ 排序功能：支持多种排序方式（最新、最早、标题、热门）
- ✅ 批量导出：支持导出选中的提示词为 JSON
- ✅ 批量导入：支持从 JSON 文件批量导入提示词
- ✅ 全选功能：支持一键全选/取消全选

### 4. **用户体验**
- ✅ 加载状态：优化加载提示
- ✅ 即时反馈：搜索输入即时响应
- ✅ 操作确认：危险操作前确认

## 📁 新增文件结构

```
src/
├── hooks/                          # 自定义 Hooks
│   ├── usePromptFilters.ts        # 过滤和排序逻辑
│   ├── usePromptActions.ts        # 批量操作逻辑
│   └── useDebounce.ts             # 防抖 Hook
│
├── components/prompts/             # 提示词相关组件
│   ├── FilterSidebar.tsx          # 筛选侧边栏
│   ├── SearchBar.tsx              # 搜索栏
│   ├── BatchActionBar.tsx         # 批量操作栏
│   ├── SortDropdown.tsx           # 排序下拉菜单
│   ├── PromptGrid.tsx             # 提示词网格
│   ├── PromptCard.tsx             # 提示词卡片（已存在）
│   ├── CreatePromptModal.tsx      # 创建/编辑模态框（已存在）
│   └── ImportModal.tsx            # 导入模态框
│
├── lib/
│   ├── constants.ts               # 常量配置
│   └── types.tsx                  # 类型定义（已存在）
│
└── app/prompts/
    └── page.tsx                   # 主页面（重构后）
```

## 🔧 核心功能说明

### 1. 自定义 Hooks

#### `usePromptFilters`
负责提示词的过滤、排序和统计：
```typescript
const { filteredPrompts, categoryStats, totalCount } = usePromptFilters({
  prompts,
  category,
  complexity,
  searchQuery,
  sortBy
});
```

#### `usePromptActions`
负责批量操作逻辑：
```typescript
const {
  isManageMode,
  selectedIds,
  toggleSelect,
  toggleSelectAll,
  batchDelete,
  batchExport,
  exitManageMode
} = usePromptActions();
```

#### `useDebounce`
防抖处理，优化搜索性能：
```typescript
const debouncedSearchQuery = useDebounce(localSearchQuery, 300);
```

### 2. 组件拆分

#### `FilterSidebar`
- 分类筛选
- 复杂度筛选
- 显示统计数量

#### `SearchBar`
- 搜索输入
- 即时反馈
- 防抖处理

#### `BatchActionBar`
- 显示选中数量
- 全选/取消全选
- 批量导出
- 批量删除

#### `SortDropdown`
- 多种排序方式
- 下拉菜单交互
- 当前排序高亮

#### `ImportModal`
- 拖拽上传
- 文件选择
- 数据预览
- 格式验证

### 3. 排序功能

支持以下排序方式：
- **最新**：按创建时间降序
- **最早**：按创建时间升序
- **标题 A-Z**：按标题字母升序
- **标题 Z-A**：按标题字母降序
- **最热门**：按热度排序（可扩展）

### 4. 批量操作

#### 导出功能
```typescript
// 导出选中的提示词为 JSON 文件
batchExport(filteredPrompts);
```

#### 导入功能
- 支持 JSON 文件格式
- 拖拽上传或文件选择
- 数据预览
- 格式验证

导入文件格式示例：
```json
[
  {
    "title": "SEO 优化助手",
    "prompt": "你是一个专业的 SEO 优化专家...",
    "category": "writing",
    "complexity": "intermediate",
    "desc": "帮助优化网站 SEO",
    "type": "icon",
    "icon": "fa-solid fa-search"
  }
]
```

## 🚀 使用指南

### 基本操作

1. **搜索提示词**
   - 在搜索框输入关键词
   - 支持标题、内容、描述搜索
   - 300ms 防抖优化

2. **筛选提示词**
   - 左侧边栏选择分类
   - 选择复杂度级别
   - 实时显示统计数量

3. **排序提示词**
   - 点击排序下拉菜单
   - 选择排序方式
   - URL 参数保持状态

4. **批量管理**
   - 点击"管理"按钮进入管理模式
   - 选择要操作的提示词
   - 执行批量导出或删除

5. **导入提示词**
   - 点击"导入"按钮
   - 拖拽或选择 JSON 文件
   - 预览后确认导入

### URL 参数

页面支持以下 URL 参数：
- `category`: 分类筛选 (all, code, writing, mj, business, roleplay, custom)
- `complexity`: 复杂度筛选 (beginner, intermediate, advanced)
- `q`: 搜索关键词
- `sort`: 排序方式 (latest, oldest, title-asc, title-desc, popular)

示例：
```
/prompts?category=code&complexity=intermediate&q=react&sort=latest
```

## 🎨 设计模式

### 1. 关注点分离
- UI 组件只负责展示
- 业务逻辑在 Hooks 中
- 数据管理在 Context 中

### 2. 单一职责
- 每个组件只做一件事
- 每个 Hook 只处理一类逻辑
- 函数功能单一明确

### 3. 可复用性
- 组件可独立使用
- Hooks 可跨组件复用
- 配置统一管理

### 4. 类型安全
- 完整的 TypeScript 类型定义
- Props 接口明确
- 避免 any 类型

## 📊 性能优化

### 1. 计算优化
```typescript
// 使用 useMemo 缓存过滤结果
const filteredPrompts = useMemo(() => {
  // 过滤逻辑
}, [prompts, category, complexity, searchQuery, sortBy]);
```

### 2. 搜索优化
```typescript
// 使用防抖减少计算次数
const debouncedSearchQuery = useDebounce(localSearchQuery, 300);
```

### 3. 渲染优化
- 条件渲染减少 DOM 节点
- 列表使用 key 优化
- 避免不必要的重渲染

## 🔄 迁移指南

### 从旧版本迁移

1. **数据兼容**
   - 新版本完全兼容旧数据格式
   - localStorage 数据自动迁移
   - 无需手动处理

2. **API 变化**
   - Context API 保持不变
   - 新增 Hook 可选使用
   - 组件 Props 向后兼容

3. **功能增强**
   - 所有旧功能保留
   - 新增功能可选使用
   - 渐进式升级

## 🐛 常见问题

### Q: 搜索不生效？
A: 检查是否正确使用了 `useDebounce` Hook，确保防抖延迟合理。

### Q: 导入失败？
A: 检查 JSON 文件格式是否正确，必需字段：title, prompt, category。

### Q: 排序不准确？
A: 确保数据包含 `createdAt` 字段，旧数据可能缺失此字段。

### Q: 批量操作无响应？
A: 检查是否在管理模式下，确保已选择至少一项。

## 🔮 未来优化方向

### 短期优化
- [ ] 添加虚拟滚动支持大量数据
- [ ] 实现拖拽排序功能
- [ ] 添加标签管理功能
- [ ] 支持更多导入格式（CSV, Excel）

### 长期优化
- [ ] 服务端渲染优化 SEO
- [ ] 实现协作编辑功能
- [ ] 添加版本控制
- [ ] 云端同步功能

## 📝 代码规范

### 命名规范
- 组件：PascalCase (e.g., `FilterSidebar`)
- Hooks：camelCase with 'use' prefix (e.g., `usePromptFilters`)
- 常量：UPPER_SNAKE_CASE (e.g., `SORT_OPTIONS`)
- 函数：camelCase (e.g., `handleSearch`)

### 文件组织
- 一个文件一个组件
- 相关组件放在同一目录
- 类型定义集中管理
- 常量配置独立文件

### 注释规范
- 复杂逻辑添加注释
- 公共函数添加 JSDoc
- 类型定义添加说明
- TODO 标记待办事项

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程
1. Fork 项目
2. 创建特性分支
3. 提交代码
4. 编写测试
5. 提交 PR

### 代码审查
- 遵循代码规范
- 保持类型安全
- 添加必要注释
- 通过所有测试

## 📄 许可证

MIT License

---

**重构完成时间**: 2024
**重构负责人**: AI Assistant
**技术栈**: Next.js 14+, TypeScript, TailwindCSS
