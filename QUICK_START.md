# 权限控制快速参考

## 🚀 快速开始

### 权限角色说明

| 角色 | 浏览 | 新建 | 编辑自己的 | 编辑所有 | 管理功能 |
|------|------|------|-----------|---------|---------|
| 未登录 | ✅ | ❌ | ❌ | ❌ | ❌ |
| 普通用户 | ✅ | ✅ | ✅ | ❌ | ❌ |
| 管理员 | ✅ | ✅ | ✅ | ✅ | ✅ |

## 📝 使用权限检查

### 在组件中使用

```tsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { 
    isLoggedIn,    // 是否已登录
    isAdmin,       // 是否是管理员
    isUser,        // 是否是普通用户
    canManage,     // 是否可以管理
    canCreate,     // 是否可以创建
    canEdit        // 是否可以编辑（函数）
  } = useAuth();

  return (
    <div>
      {/* 管理员专属功能 */}
      {canManage && <AdminPanel />}
      
      {/* 登录用户功能 */}
      {canCreate && <CreateButton />}
      
      {/* 根据编辑权限显示 */}
      {canEdit(item.isCustom) && <EditButton />}
    </div>
  );
}
```

## 🎯 常见场景

### 1. 显示/隐藏按钮

```tsx
{/* 仅管理员可见 */}
{canManage && (
  <button>管理</button>
)}

{/* 登录用户可见 */}
{canCreate && (
  <button>新建</button>
)}
```

### 2. 禁用按钮

```tsx
<button 
  onClick={handleCreate}
  disabled={!canCreate}
  className={canCreate ? 'enabled' : 'disabled'}
  title={!canCreate ? '请先登录' : '新建提示词'}
>
  新建
</button>
```

### 3. 操作前检查

```tsx
const handleCreate = () => {
  if (!canCreate) {
    showToast('请先登录后再创建提示词', 'error');
    return;
  }
  // 执行创建逻辑
  setIsModalOpen(true);
};
```

### 4. 编辑权限检查

```tsx
// 管理员可以编辑所有，普通用户只能编辑自己创建的
const canEditThis = canEdit(data.isCustom);

{canEditThis && (
  <button onClick={handleEdit}>编辑</button>
)}
```

## 🔒 权限方法详解

### `isLoggedIn: boolean`
检查用户是否已登录

```tsx
{isLoggedIn ? <UserMenu /> : <LoginButton />}
```

### `isAdmin: boolean`
检查是否是管理员

```tsx
{isAdmin && <AdminDashboard />}
```

### `isUser: boolean`
检查是否是普通用户

```tsx
{isUser && <UserProfile />}
```

### `canManage: boolean`
检查是否可以使用管理功能（仅管理员）

```tsx
{canManage && <ManageButton />}
```

### `canCreate: boolean`
检查是否可以创建（所有登录用户）

```tsx
{canCreate && <CreateButton />}
```

### `canEdit(isCustom?: boolean): boolean`
检查是否可以编辑
- 管理员：可以编辑所有
- 普通用户：只能编辑 `isCustom=true` 的

```tsx
{canEdit(prompt.isCustom) && <EditButton />}
```

## 💡 最佳实践

### 1. 始终提供反馈

```tsx
// ❌ 不好：没有提示
<button disabled={!canCreate}>新建</button>

// ✅ 好：有明确提示
<button 
  disabled={!canCreate}
  title={!canCreate ? '请先登录' : '新建提示词'}
>
  新建
</button>
```

### 2. 操作前验证

```tsx
// ❌ 不好：直接执行
const handleCreate = () => {
  setIsModalOpen(true);
};

// ✅ 好：先检查权限
const handleCreate = () => {
  if (!canCreate) {
    showToast('请先登录', 'error');
    return;
  }
  setIsModalOpen(true);
};
```

### 3. 视觉状态区分

```tsx
// ✅ 好：明确的视觉状态
<button 
  className={canCreate 
    ? 'bg-green-600 hover:bg-green-500' 
    : 'bg-gray-700 cursor-not-allowed'
  }
>
  新建
</button>
```

## 🧪 测试清单

### 未登录用户
- [ ] 可以浏览提示词列表
- [ ] 可以搜索和筛选
- [ ] 点击"新建"显示提示
- [ ] 点击"导入"显示提示
- [ ] 不显示"管理"按钮
- [ ] 卡片不显示编辑按钮

### 普通用户
- [ ] 可以新建提示词
- [ ] 可以导入提示词
- [ ] 自己创建的卡片显示编辑按钮
- [ ] 系统预置的卡片不显示编辑按钮
- [ ] 不显示"管理"按钮

### 管理员
- [ ] 可以新建提示词
- [ ] 可以导入提示词
- [ ] 所有卡片都显示编辑按钮
- [ ] 显示"管理"按钮
- [ ] 可以进入管理模式
- [ ] 可以批量操作

## 📚 相关文档

- [PERMISSION_CONTROL.md](./PERMISSION_CONTROL.md) - 完整权限控制文档
- [REFACTOR_SUMMARY.md](./REFACTOR_SUMMARY.md) - 重构总结
- [REFACTOR_GUIDE.md](./REFACTOR_GUIDE.md) - 重构指南

---

**快速参考版本**: 1.0.0  
**最后更新**: 2024-11-30
