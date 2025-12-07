
#### 角色定义
- **admin (管理员)**：最高权限，通过环境变量 `USERNAME` 定义，拥有所有管理权
- **user (普通用户)**：默认角色，只能管理自己的数据
#### 数据库表结构 (D1/SQL)
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,        -- 用户名（唯一标识）
  password TEXT NOT NULL,               -- 密码
  role TEXT DEFAULT 'user',             -- 角色：'user'|'admin'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### TypeScript 类型定义
```typescript
// 管理员配置中的用户定义
interface UserConfig {
  username: string;
  role: 'user' | 'admin';
  banned?: boolean;
  group?: string;  // 用户分组（可选）
}

// 认证信息
interface AuthInfo {
  username?: string;
  signature?: string;
  timestamp?: number;
  role?: 'admin' | 'user';
}
```
### 1.3 用户权限管理

#### 权限分配原则
1. **管理员权限**：通过环境变量 `USERNAME` 自动获得 `owner` 角色
2. **普通用户**：注册时默认分配 `user` 角色
3. **权限继承**：高级角色拥有低级角色的所有权限
# 二、存储方式架构

### 2.1 存储类型支持矩阵

| 存储类型 | 环境变量值 | 适用场景 | 数据持久化 | 多端同步 | 部署要求 |
|---------|-----------|----------|-----------|----------|----------|
| LocalStorage | `localstorage` | 单用户本地使用 | ❌ | ❌ | 无 |
| Redis | `redis` | Docker 自建 | ✅ | ✅ | Redis 服务器 |
| Upstash | `upstash` | 无服务器部署 | ✅ | ✅ | Upstash 账号 |
| Cloudflare D1 | `d1` | Cloudflare Pages | ✅ | ✅ | D1 数据库 |
### 2.2 存储接口抽象

#### IStorage 接口设计

  // 数据清理
  clearAllData(): Promise<void>;

```

### 2.3 存储实现策略

#### 工厂模式创建存储实例
```typescript
function createStorage(): IStorage {
  const STORAGE_TYPE = process.env.NEXT_PUBLIC_STORAGE_TYPE || 'localstorage';
  
  switch (STORAGE_TYPE) {
    case 'd1':
      return new D1Storage();
    case 'localstorage':
    default:
      return null; // 浏览器端处理
  }
}
```
#### 单例模式管理
- 全局唯一存储实例
- 延迟初始化
- 统一的 DbManager 封装


#### 单例模式管理
- 全局唯一存储实例
- 延迟初始化
- 统一的 DbManager 封装

---

## 三、用户数据关联设计

### 3.1 数据关联结构

#### 用户中心化设计
所有用户数据都通过 `user_id` 或 `username` 进行关联
### 4.2 用户数据管理

#### 数据完整性保证
1. **创建时**：自动初始化用户数据结构
2. **更新时**：使用 UPSERT 操作确保数据一致性
3. **删除时**：级联删除所有关联数据
## 五、配置与环境变量

### 5.1 核心环境变量

| 变量名 | 说明 | 可选值 | 默认值 |
|-------|------|--------|--------|
| `NEXT_PUBLIC_STORAGE_TYPE` | 存储类型 |`d1` | `localstorage` |
| `USERNAME` | 管理员用户名 | 任意字符串 | 无 |
| `PASSWORD` | 管理员密码 | 任意字符串 | 无 |
# 六、安全与权限控制

### 6.1 认证机制

#### 密码存储
- **LocalStorage**：明文存储在浏览器
- **Redis/Upstash**：明文存储（建议生产环境加密）
- **D1**：明文存储（建议生产环境加密）

#### 签名验证
```typescript
// 基于用户名、密码和时间戳的签名机制
function generateSignature(username: string, password: string): string {
  const timestamp = Date.now();
  const data = `${username}:${password}:${timestamp}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}
```

