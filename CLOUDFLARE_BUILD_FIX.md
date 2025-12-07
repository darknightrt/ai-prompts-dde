# Cloudflare Pages 构建错误修复说明

## 问题描述

在 Cloudflare Pages 部署时，构建阶段出现以下错误：

```
Error: D1 database is only available in Cloudflare Pages environment. 
Please ensure the D1 binding is configured correctly.
```

### 根本原因

Next.js 在构建时（build time）会收集页面数据，此时会加载 API 路由模块。原代码在 `D1Storage` 类的构造函数中直接访问 `process.env.DB`，但 D1 绑定只在运行时（runtime）可用，构建时不存在，导致构建失败。

## 修复方案

### 1. 延迟初始化 D1 数据库 ✅

**文件**: `src/lib/d1.storage.ts`

**修改内容**:
- 将 `db` 属性改为可空类型：`private db: D1Database | null = null`
- 移除构造函数中的 DB 访问逻辑
- 新增 `getDb()` 私有方法实现懒加载
- 所有数据库操作从 `this.db` 改为 `this.getDb()`

**关键代码**:
```typescript
export class D1Storage implements IStorage {
  private db: D1Database | null = null;

  constructor() {
    // 延迟初始化：不在构造函数中访问 DB
    // DB 绑定只在运行时可用，构建时不存在
  }

  /**
   * 获取 D1 数据库实例（懒加载）
   */
  private getDb(): D1Database {
    if (!this.db) {
      const db = (process.env as unknown as { DB: D1Database }).DB;
      
      if (!db) {
        throw new Error(
          'D1 database is only available in Cloudflare Pages environment. ' +
          'Please ensure the D1 binding is configured correctly.'
        );
      }
      
      this.db = db;
    }
    
    return this.db;
  }
}
```

### 2. 更新数据库管理器 ✅

**文件**: `src/lib/db.ts`

**修改内容**:
- 添加注释说明懒加载机制
- 确保 D1Storage 实例化不会在构建时触发 DB 访问

### 3. 优化 Next.js 配置 ✅

**文件**: `next.config.js`

**修改内容**:
- 添加图像优化禁用配置（Cloudflare Pages 不支持）
- 添加 Cloudflare Pages 部署相关配置

```javascript
images: {
  // Cloudflare Pages 不支持 Next.js 图像优化
  unoptimized: process.env.NEXT_PUBLIC_STORAGE_TYPE === 'd1',
}
```

### 4. 添加 .npmrc 配置 ✅

**文件**: `.npmrc`

**作用**: 优化 pnpm 包管理器配置，避免构建时的依赖问题

## 技术原理

### 构建时 vs 运行时

| 阶段 | 时机 | 环境变量 | D1 绑定 |
|------|------|---------|---------|
| **构建时** | `next build` | ✅ NEXT_PUBLIC_* | ❌ 不可用 |
| **运行时** | API 请求处理 | ✅ 所有变量 | ✅ 可用 |

### 懒加载模式

```
构建阶段:
  ├─ 加载模块 (import)
  ├─ 实例化 D1Storage ✅ (构造函数为空)
  └─ 不访问 DB ✅

运行阶段:
  ├─ 接收 API 请求
  ├─ 调用 db.getAllPrompts()
  ├─ 首次调用 getDb() 
  ├─ 访问 process.env.DB ✅
  └─ 返回数据
```

## 部署步骤

### 1. 确认环境变量

在 Cloudflare Pages 项目设置中添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NEXT_PUBLIC_STORAGE_TYPE` | `d1` | 启用 D1 存储模式 |

### 2. 确认 D1 绑定

- **绑定名称**: `DB` (必须大写)
- **D1 数据库**: 选择已创建的数据库

### 3. 构建配置

- **框架预设**: Next.js
- **构建命令**: `pnpm run pages:build`
- **构建输出目录**: `.vercel/output/static`
- **Node 版本**: 22 或更高

### 4. 重新部署

保存配置后触发重新部署，构建应该成功。

## 验证方法

### 本地验证

```bash
# 安装依赖
pnpm install

# 本地构建测试
pnpm run pages:build
```

如果构建成功，说明修复有效。

### 线上验证

1. 推送代码到 Git 仓库
2. 在 Cloudflare Pages 触发重新部署
3. 查看构建日志，确认无错误
4. 部署成功后访问网站，测试 API 功能

## 常见问题

### Q1: 为什么不能在构造函数中访问 DB？

**A**: Next.js 构建时会加载所有模块以进行静态分析和优化。如果在模块加载时（构造函数）访问 DB，会在构建阶段就报错，因为 D1 绑定只在 Cloudflare Workers 运行时环境中可用。

### Q2: 懒加载会影响性能吗？

**A**: 不会。`getDb()` 只在第一次调用时初始化，之后会缓存实例。对于 API 请求来说，这个初始化开销可以忽略不计。

### Q3: 如何确认修复成功？

**A**: 
1. 本地运行 `pnpm run pages:build` 无错误
2. Cloudflare Pages 构建日志显示 "Build succeeded"
3. 部署后 API 能正常返回数据

## 相关文件

- ✅ `src/lib/d1.storage.ts` - D1 存储实现（核心修复）
- ✅ `src/lib/db.ts` - 数据库管理器
- ✅ `next.config.js` - Next.js 配置
- ✅ `.npmrc` - pnpm 配置
- ✅ `D1_DEPLOY_GUIDE.md` - 部署指南（已更新故障排查）

## 总结

通过实现**延迟初始化（Lazy Initialization）**模式，将 D1 数据库的访问从**构建时**推迟到**运行时**，成功解决了 Cloudflare Pages 构建失败的问题。这是一个典型的**构建时 vs 运行时环境差异**问题的解决方案。

---

**修复日期**: 2024-12-02  
**修复版本**: v1.1.0
