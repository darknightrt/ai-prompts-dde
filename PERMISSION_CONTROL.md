# 权限控制系统文档

## 📋 概述

本系统实现了基于角色的访问控制（RBAC），确保不同用户角色拥有相应的操作权限。

## 👥 用户角色

### 1. **未登录用户 (Guest)**
- ❌ 不能新建提示词
- ❌ 不能导入提示词
- ❌ 不能编辑提示词
- ❌ 不能使用管理功能
- ✅ 可以浏览提示词
- ✅ 可以搜索和筛选
- ✅ 可以复制提示词内容

### 2. **普通用户 (User)**
- ✅ 可以新建提示词
- ✅ 可以导入提示词
- ✅ 可以编辑自己创建的提示词
- ❌ 不能编辑系统预置的提示词
- ❌ 不能使用管理功能（批量管理）
- ✅ 可以浏览、搜索、筛选
- ✅ 可以复制提示词内容

### 3. **管理员 (Admin)**
- ✅ 可以新建提示词
- ✅ 可以导入提示词
- ✅ 可以编辑所有提示词（包括系统预置）
- ✅ 可以使用管理功能（批量管理）
- ✅ 可以批量删除
- ✅ 可以批量导出
- ✅ 完全访问权限

## 🔐 权限实现

### AuthContext 权限方法

```typescript
interface AuthContextType {
  user: User | null;
  login: (username: string, role: UserRole) => void;
  logout: () => void;
  
  // 权限检查方法
  isAdmin: boolean;           // 是否是管理员
  isLoggedIn: boolean;        // 是否已登录
  isUser: boolean;            // 是否是普通用户
  canManage: boolean;         // 是否可以使用管理功能
  canCreate: boolean;         // 是否可以创建提示词
  canEdit: (isCustom?: boolean) => boolean; // 是否可以编辑
}
```

### 权限检查逻辑

```typescript
// 登录状态
const isLoggedIn = user !== null;

// 角色判断
const isAdmin = user?.role === 'admin';
const isUser = user?.role === 'user';

// 管理权限：只有管理员可以使用
const canManage = isAdmin;

// 创建权限：登录用户都可以
const canCreate = isLoggedIn;

// 编辑权限：
const canEdit = (isCustom?: boolean) => {
  if (isAdmin) return true;              // 管理员可以编辑所有
  if (isUser && isCustom) return true;   // 普通用户只能编辑自己创建的
  return false;
};
```

## 🎯 UI 权限控制

### 1. 主页面按钮控制

#### 管理按钮
```tsx
{/* 仅管理员可见 */}
{canManage && (
  <button onClick={handleToggleManageMode}>
    管理
  </button>
)}
```

#### 导入/新建按钮
```tsx
{/* 需要登录，未登录显示禁用状态 */}
<button 
  onClick={handleImport}
  className={canCreate 
    ? 'bg-blue-600 hover:bg-blue-500' 
    : 'bg-gray-700 cursor-not-allowed'
  }
  title={!canCreate ? '请先登录' : '导入提示词'}
>
  导入
</button>

<button 
  onClick={handleCreate}
  className={canCreate 
    ? 'bg-green-600 hover:bg-green-500' 
    : 'bg-gray-700 cursor-not-allowed'
  }
  title={!canCreate ? '请先登录' : '新建提示词'}
>
  新建
</button>
```

### 2. 提示词卡片编辑按钮

```tsx
{/* 根据权限显示编辑按钮 */}
{canEdit(data.isCustom) && !isManageMode && (
  <button onClick={handleEditClick} title="编辑">
    <i className="fa-solid fa-pen-to-square"></i>
  </button>
)}
```

**显示规则**：
- 管理员：所有卡片都显示编辑按钮
- 普通用户：仅自己创建的卡片显示编辑按钮
- 未登录：不显示编辑按钮

### 3. 操作拦截

```typescript
// 创建提示词前检查
const handleCreate = () => {
  if (!canCreate) {
    showToast('请先登录后再创建提示词', 'error');
    return;
  }
  setIsModalOpen(true);
};

// 导入提示词前检查
const handleImport = () => {
  if (!canCreate) {
    showToast('请先登录后再导入提示词', 'error');
    return;
  }
  setIsImportModalOpen(true);
};
```

## 📊 权限矩阵

| 功能 | 未登录 | 普通用户 | 管理员 |
|------|--------|----------|--------|
| 浏览提示词 | ✅ | ✅ | ✅ |
| 搜索筛选 | ✅ | ✅ | ✅ |
| 复制内容 | ✅ | ✅ | ✅ |
| 新建提示词 | ❌ | ✅ | ✅ |
| 导入提示词 | ❌ | ✅ | ✅ |
| 编辑自己的 | ❌ | ✅ | ✅ |
| 编辑系统的 | ❌ | ❌ | ✅ |
| 管理模式 | ❌ | ❌ | ✅ |
| 批量删除 | ❌ | ❌ | ✅ |
| 批量导出 | ❌ | ❌ | ✅ |

## 🔄 使用示例

### 在组件中使用权限

```tsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { 
    isLoggedIn, 
    isAdmin, 
    canManage, 
    canCreate, 
    canEdit 
  } = useAuth();

  return (
    <div>
      {/* 根据登录状态显示 */}
      {isLoggedIn && <p>欢迎回来！</p>}
      
      {/* 根据管理权限显示 */}
      {canManage && <button>管理面板</button>}
      
      {/* 根据创建权限显示 */}
      {canCreate ? (
        <button>新建</button>
      ) : (
        <button disabled>请先登录</button>
      )}
      
      {/* 根据编辑权限显示 */}
      {canEdit(item.isCustom) && (
        <button>编辑</button>
      )}
    </div>
  );
}
```

## 🎨 UI 状态说明

### 按钮状态

#### 可用状态
```tsx
className="bg-green-600 hover:bg-green-500 text-white"
```

#### 禁用状态
```tsx
className="bg-gray-700 text-gray-400 cursor-not-allowed"
title="请先登录"
```

### 提示信息

- **未登录创建**：`请先登录后再创建提示词`
- **未登录导入**：`请先登录后再导入提示词`
- **无权限编辑**：编辑按钮不显示

## 🔧 测试场景

### 1. 未登录用户测试
```
✅ 可以浏览提示词列表
✅ 可以搜索和筛选
✅ 可以复制提示词内容
✅ 点击"新建"显示提示：请先登录
✅ 点击"导入"显示提示：请先登录
✅ 不显示"管理"按钮
✅ 卡片上不显示编辑按钮
```

### 2. 普通用户测试
```
✅ 可以新建提示词
✅ 可以导入提示词
✅ 自己创建的卡片显示编辑按钮
✅ 系统预置的卡片不显示编辑按钮
✅ 不显示"管理"按钮
✅ 不能进入管理模式
```

### 3. 管理员测试
```
✅ 可以新建提示词
✅ 可以导入提示词
✅ 所有卡片都显示编辑按钮
✅ 显示"管理"按钮
✅ 可以进入管理模式
✅ 可以批量选择
✅ 可以批量删除
✅ 可以批量导出
```

## 🚀 扩展建议

### 短期优化
- [ ] 添加权限不足的友好提示页面
- [ ] 实现登录弹窗（点击禁用按钮时）
- [ ] 添加权限变更的实时响应

### 中期优化
- [ ] 实现更细粒度的权限控制
- [ ] 添加权限日志记录
- [ ] 实现权限缓存机制

### 长期优化
- [ ] 支持自定义角色
- [ ] 实现权限组管理
- [ ] 添加权限审计功能

## 📝 注意事项

1. **前端权限仅用于 UI 控制**
   - 不能作为安全防护的唯一手段
   - 需要配合后端权限验证

2. **权限检查时机**
   - 组件渲染时检查（显示/隐藏）
   - 操作执行前检查（拦截）
   - 路由跳转时检查（导航守卫）

3. **用户体验**
   - 禁用状态要有明确提示
   - 权限不足要有友好反馈
   - 避免突然的权限变化

4. **测试覆盖**
   - 每个角色都要测试
   - 边界情况要覆盖
   - 权限切换要验证

## 🔗 相关文件

- `src/context/AuthContext.tsx` - 权限上下文
- `src/app/prompts/page.tsx` - 主页面权限控制
- `src/components/prompts/PromptCard.tsx` - 卡片权限控制
- `src/hooks/usePromptActions.ts` - 批量操作权限

---

**文档版本**: 1.0.0  
**最后更新**: 2024-11-30  
**维护者**: Development Team
