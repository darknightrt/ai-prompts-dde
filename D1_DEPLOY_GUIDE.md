# Cloudflare D1 数据库部署指南

## 📋 概述

本项目支持两种存储方式：
- **localStorage** (默认) - 浏览器本地存储，适合单用户/开发环境
- **D1** - Cloudflare D1 数据库，适合生产环境，支持数据持久化和多端同步

## 🏗️ 架构说明

```
┌─────────────────────────────────────────────────────────────┐
│                     前端 (Next.js)                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ PromptContext│    │   API Routes │    │  Components │     │
│  └──────┬──────┘    └──────┬──────┘    └─────────────┘     │
│         │                  │                                │
│         ▼                  ▼                                │
│  ┌─────────────────────────────────────────┐               │
│  │           Storage Layer (db.ts)          │               │
│  │  ┌────────────┐    ┌────────────────┐   │               │
│  │  │localStorage│    │   D1Storage    │   │               │
│  │  │   (默认)   │    │  (Cloudflare)  │   │               │
│  │  └────────────┘    └────────────────┘   │               │
│  └─────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Cloudflare D1  │
                    │   (SQLite)      │
                    └─────────────────┘
```

## 🚀 Cloudflare D1 部署步骤

### 1. 创建 D1 数据库

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **存储和数据库** → **D1 SQL 数据库**
3. 点击 **创建数据库**
4. 输入数据库名称，例如：`ai-prompts-db`
5. 选择区域，点击创建

### 2. 初始化数据库表结构

1. 进入创建的 D1 数据库
2. 点击 **控制台** 或 **Explore Data**
3. 将 `d1-init.sql` 文件内容粘贴到查询窗口
4. 点击 **执行** 运行所有 SQL 语句

```sql
-- 核心表结构
- users (用户表)
- prompts (提示词表)
- favorites (收藏表)
- usage_records (使用记录表)
```

### 3. 创建 Cloudflare Pages 项目

1. 进入 **Workers 和 Pages**
2. 点击 **创建应用程序** → **Pages**
3. 连接 Git 仓库或直接上传
4. 配置构建设置：
   - **框架预设**: Next.js
   - **构建命令**: `pnpm run pages:build`
   - **构建输出目录**: `.vercel/output/static`

### 4. 绑定 D1 数据库

1. 进入 Pages 项目设置
2. 点击 **设置** → **绑定**
3. 添加 **D1 数据库** 绑定
4. **变量名称**: `DB` (必须大写)
5. **D1 数据库**: 选择步骤 1 创建的数据库

### 5. 配置环境变量

在 Pages 项目设置中添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NEXT_PUBLIC_STORAGE_TYPE` | `d1` | 启用 D1 存储模式 |
| `USERNAME` | 自定义用户名 | **可选** - 管理员账号用户名（推荐设置） |
| `PASSWORD` | 自定义密码 | **可选** - 管理员账号密码（推荐设置） |

**重要说明：**
- 如果设置了 `ADMIN_PASSWORD`/`PASSWORD`，系统会自动创建该管理员账号
- 如果未设置环境变量，将使用 `d1-init.sql` 中的默认账号（admin/admin123）
- **强烈建议**在生产环境中通过环境变量配置管理员账号，而不是使用SQL默认账号

### 6. 部署

保存配置后触发重新部署，或手动点击 **重新部署**。

## 📁 项目文件结构


```

## 🔧 本地开发

### 默认模式 (localStorage)

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

默认使用 localStorage，无需配置数据库。

### D1 模式 (需要 Wrangler)

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 创建本地 D1 数据库
wrangler d1 create ai-prompts-db --local

# 初始化表结构
wrangler d1 execute ai-prompts-db --local --file=d1-init.sql

# 使用 Wrangler Pages 开发
npm run pages:dev
```

## 📊 存储模式对比

| 特性 | localStorage | D1 |
|------|-------------|-----|
| 数据持久化 | ❌ 浏览器清除后丢失 | ✅ 永久存储 |
| 多端同步 | ❌ 仅当前浏览器 | ✅ 所有设备 |
| 服务器要求 | 无 | Cloudflare Pages |
| 适用场景 | 开发/演示 | 生产环境 |
| 查询能力 | 弱 | 强 (SQL) |

## 🔐 安全建议

1. **使用环境变量配置管理员**: 在 Cloudflare Pages 设置中配置 `ADMIN_USERNAME` 和 `ADMIN_PASSWORD` 环境变量
2. **避免使用默认账号**: 不要在生产环境使用 `d1-init.sql` 中的默认账号（admin/admin123）
3. **强密码策略**: 管理员密码应包含大小写字母、数字和特殊字符，长度至少12位
4. **启用 HTTPS**: Cloudflare 默认提供 HTTPS
5. **定期备份**: 在 D1 控制台定期导出数据
6. **监控日志**: 定期检查 Cloudflare Pages 的部署日志和运行日志

## 🔍 故障排查

### 常见问题

**1. 构建失败："D1 database is only available in Cloudflare Pages environment"**
- **原因**: 构建时尝试访问 D1 数据库（已修复）
- **解决方案**: 
  - 确保使用最新代码（已实现延迟初始化）
  - D1 数据库只在运行时（API 请求时）初始化，不在构建时访问
  - 检查 `src/lib/d1.storage.ts` 中的 `getDb()` 方法

**2. 包管理器不匹配警告**
- **原因**: 项目使用 pnpm，但 Cloudflare Pages 默认使用 npm
- **解决方案**: 
  - 在 Cloudflare Pages 设置中指定 `NODE_VERSION=22`
  - 确保 `package.json` 中有 `"packageManager": "pnpm@9.14.4"`
  - 构建命令使用 `pnpm run pages:build`

**2. API 返回 400 错误**
- 原因: `NEXT_PUBLIC_STORAGE_TYPE` 未设置为 `d1`
- 解决: 检查环境变量配置

**3. 数据库表不存在**
- 原因: 未执行初始化脚本
- 解决: 在 D1 控制台执行 `d1-init.sql`

**4. 绑定无效**
- 原因: 变量名称不是 `DB`
- 解决: 确保绑定变量名为大写 `DB`

## 📝 API 文档

### GET /api/prompts
获取所有提示词

**响应:**
```json
{
  "prompts": [...],
  "success": true
}
```

### POST /api/prompts
创建新提示词

**请求体:**
```json
{
  "title": "标题",
  "prompt": "提示词内容",
  "category": "code",
  "complexity": "beginner",
  "desc": "描述（可选）",
  "tags": [{"text": "标签名", "color": "purple"}]
}
```

### PUT /api/prompts/[id]
更新提示词

### DELETE /api/prompts/[id]
删除提示词

### POST /api/prompts/batch
批量导入

### DELETE /api/prompts/batch
批量删除

## 🎯 最佳实践

1. **开发阶段**: 使用 localStorage 模式快速迭代
2. **测试阶段**: 使用 Wrangler 本地 D1 测试
3. **生产部署**: 使用 Cloudflare Pages + D1

## 📚 参考资源

- [Cloudflare D1 文档](https://developers.cloudflare.com/d1/)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)

---

## 📦 数据格式说明

### 提示词数据结构

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | ✅ | 提示词标题 |
| `prompt` | string | ✅ | 提示词内容 |
| `category` | string | ✅ | 分类：code/mj/writing/roleplay/business |
| `complexity` | string | ❌ | 复杂度：beginner/intermediate/advanced |
| `desc` | string | ❌ | 简介描述 |
| `tags` | array | ❌ | 自定义标签数组（最多4个） |

### 标签格式
```json
{
  "text": "标签名称",
  "color": "purple"  // 可选: purple/green/blue/yellow
}
```

### 批量导入示例
```json
[
  {
    "title": "代码审查助手",
    "prompt": "你是一位资深代码审查专家...",
    "category": "code",
    "complexity": "intermediate",
    "desc": "帮助进行代码审查",
    "tags": [
      {"text": "代码", "color": "blue"},
      {"text": "审查", "color": "green"}
    ]
  }
]
```

---

**文档版本**: 1.1.0  
**最后更新**: 2024-12-07
