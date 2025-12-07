import { PromptItem } from './types';

export const staticPrompts: PromptItem[] = [
  {
    id: 'static-python',
    title: 'Python 代码优化大师',
    desc: '作为一名高级 Python 开发人员，请审查以下代码。寻找代码异味(Code Smell)，建议改进以提高性能和可读性，并解释原因。',
    prompt: '作为一名高级 Python 开发人员，请审查以下代码。寻找代码异味(Code Smell)，建议改进以提高性能和可读性，并解释原因。',
    category: 'code',
    complexity: 'advanced', // 设置为高级
    type: 'icon',
    icon: 'fa-brands fa-python',
    isCustom: false
  },
  {
    id: 'static-art-3d',
    title: '3D 抽象流体壁纸',
    desc: 'Generate a 3D abstract fluid art background, vibrant neon colors...',
    prompt: 'Generate a 3D abstract fluid art background, vibrant neon colors, nano banana style rendering, 8k resolution, smooth gradients, highly detailed, octane render.',
    category: 'mj',
    complexity: 'intermediate', // 设置为中级
    type: 'image',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop',
    isCustom: false
  },
  {
    id: 'static-react-comp',
    title: 'React 组件生成器',
    desc: 'Act as a Senior React Developer. Create a responsive Navbar component...',
    prompt: 'Act as a Senior React Developer. Create a responsive Navbar component using Tailwind CSS, supporting dark mode toggle, including mobile menu logic, written in TypeScript.',
    category: 'code',
    complexity: 'advanced',
    type: 'image',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    isCustom: false
  },
  {
    id: 'static-writing-review',
    title: '爆款科技评论文案',
    desc: 'Write a tech review for a new AI gadget. Use a professional yet engaging tone...',
    prompt: 'Write a tech review for a new AI gadget. Use a professional yet engaging tone, structured with Pros/Cons, technical specs, and a final verdict. Target audience: Tech enthusiasts.',
    category: 'writing',
    complexity: 'beginner', // 设置为初级
    type: 'image',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop',
    isCustom: false
  }
];