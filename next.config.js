/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 图像优化配置：允许加载 Unsplash 的图片资源
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '**',
      }
    ],
    // Cloudflare Pages 不支持 Next.js 图像优化
    unoptimized: process.env.NEXT_PUBLIC_STORAGE_TYPE === 'd1',
  },
  
  // Cloudflare Pages 部署配置
  ...(process.env.NEXT_PUBLIC_STORAGE_TYPE === 'd1' && {
    // 跳过构建时的静态页面生成错误
    typescript: {
      ignoreBuildErrors: false,
    },
    eslint: {
      ignoreDuringBuilds: false,
    },
  }),
};

module.exports = nextConfig;