This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 环境变量配置

在项目根目录创建 `.env.local` 文件，配置管理员账号：

```bash
# 管理员账号配置（localStorage 模式必须设置）
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password

# 存储模式（可选）
# localstorage - 浏览器本地存储（默认）
# d1 - Cloudflare D1 数据库
NEXT_PUBLIC_STORAGE_TYPE=localstorage
```

### 存储模式说明

| 模式 | 用户验证方式 | 适用场景 |
|------|-------------|---------|
| `localstorage` | 环境变量配置管理员 | 开发/演示环境 |
| `d1` | D1 数据库 users 表 | 生产环境 |

> D1 模式详细部署请参考 [D1_DEPLOY_GUIDE.md](./D1_DEPLOY_GUIDE.md)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
