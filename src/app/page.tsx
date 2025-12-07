
"use client";

import Link from 'next/link';
import Typewriter from '@/components/ui/Typewriter';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useSiteConfig } from '@/context/SiteConfigContext';
import AnnouncementPopup from '@/components/ui/AnnouncementPopup';
import CountUp from '@/components/ui/CountUp';
import Accordion from '@/components/ui/Accordion';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  const { config } = useSiteConfig();

  return (
    <div className="overflow-hidden">
      {/* 首次访问/登录公告 */}
      <AnnouncementPopup />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 text-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-purple-600 uppercase bg-purple-100 rounded-full animate-fade-in">
            New: claude-4.5 Prompts
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight animate-fade-in-up">
            {/* 允许 HTML 注入以支持 <br> 换行 */}
            <span dangerouslySetInnerHTML={{ __html: config.homeTitle }}></span>
          </h1>
          <div className="mb-6 -mt-2">
            <Typewriter 
              texts={config.typewriterTexts} 
              className="inline-block text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 dark:from-purple-400 dark:via-pink-400 dark:to-purple-400 animate-gradient bg-[length:200%_auto]"
              cursorClassName="bg-purple-600 dark:bg-purple-400"
            />
          </div>
          <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            解锁 ChatGPT、Midjourney 和 Stable Diffusion 的无限潜能。
          </p>
          <div className="flex justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link 
              href="/prompts" 
              className="px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition transform hover:-translate-y-1 shadow-lg flex items-center"
            >
              浏览提示词库 <i className="fa-solid fa-arrow-right ml-2"></i>
            </Link>
          </div>
        </div>
        
        {/* Decorative Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-10 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 dark:opacity-10 animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 dark:opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="py-20 relative overflow-hidden">
         {/* Background decoration */}
         <div className="absolute inset-0 bg-gradient-to-b from-transparent text-while dark:to-slate-900/50 -z-10"></div>
         
         <div className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-7">
            <ScrollReveal className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Stat 1 */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-white/30 dark:bg-transparent/30 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-8 text-center hover:transform hover:-translate-y-1 transition duration-300">
                        <div className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-2">
                            <CountUp end={200} suffix="个" />
                        </div>
                        <div className="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">提示词总数</div>
                    </div>
                </div>
                {/* Stat 3 */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-white/30 dark:bg-transparent/30 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-8 text-center hover:transform hover:-translate-y-1 transition duration-300">
                        <div className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-2">
                            <CountUp end={5000} suffix="人" />
                        </div>
                        <div className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">活跃用户数</div>
                    </div>
                </div>
                {/* Stat 5 */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-white/30 dark:bg-transparent/30 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-8 text-center hover:transform hover:-translate-y-1 transition duration-300">
                        <div className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-2">
                            <CountUp end={10000} suffix="次" />
                        </div>
                        <div className="text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">总使用次数</div>
                    </div>
                </div>
                {/* Stat 2 */}
            <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 from-40% to-teal-500 to-60%  rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-white/30 dark:bg-transparent/30 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-8 text-center hover:transform hover:-translate-y-1 transition duration-300">
                        <div className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-2">
                            <CountUp end={50} suffix="个" />
                        </div>
                        <div className="text-sm font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">工作流总数</div>
                    </div>
                </div>
                {/* Stat 4 */}
               <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-pink-500 rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-white/30 dark:bg-transparent/30 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-8 text-center hover:transform hover:-translate-y-1 transition duration-300">
                        <div className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-2">
                            <CountUp end={20} suffix="个" />
                        </div>
                        <div className="text-sm font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400"> 本周提示词更新总数</div>
                    </div>
                    </div>
                {/* Stat 4 */}
               <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-white/30 dark:bg-transparent/30 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-8 text-center hover:transform hover:-translate-y-1 transition duration-300">
                        <div className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-2">
                            <CountUp end={10} suffix="个" />
                        </div>
                        <div className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400"> 本周工作流更新总数</div>
                    </div>
                    </div>
            </ScrollReveal>
         </div>
      </section>

      {/* Tutorial Section */}
      <section id="tutorial" className="py-24 bg-white dark:bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">如何编写完美提示词？</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">遵循 "R.C.O" 法则，让 AI 精准理解你的意图。</p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <ScrollReveal delay={100} className="bg-slate-50 dark:bg-transparent p-8 rounded-2xl border border-slate-100 dark:border-transparent hover:border-purple-200 dark:hover:border-purple-500/30 transition duration-300">
                    <div className="w-12 h-12 bg-purple-600 text-white rounded-lg flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-purple-500/30">
                        1
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Role (角色设定)</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">赋予 AI 一个特定的身份。</p>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded border border-gray-200 dark:border-slate-700 text-sm text-gray-500 dark:text-gray-400 italic">
                        "你是一位拥有10年经验的资深文案策划..."
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={200} className="bg-slate-50 dark:bg-transparent p-8 rounded-2xl border border-slate-100 dark:border-transparent hover:border-purple-200 dark:hover:border-purple-500/30 transition duration-300">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-blue-500/30">
                        2
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Context (背景任务)</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">清晰描述任务背景和具体要求。</p>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded border border-gray-200 dark:border-slate-700 text-sm text-gray-500 dark:text-gray-400 italic">
                        "请为一款新出的运动饮料撰写小红书种草文案..."
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={300} className="bg-slate-50 dark:bg-transparent p-8 rounded-2xl border border-slate-100 dark:border-transparent hover:border-purple-200 dark:hover:border-purple-500/30 transition duration-300">
                    <div className="w-12 h-12 bg-pink-600 text-white rounded-lg flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-pink-500/30">
                        3
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Output (输出限制)</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">规定输出的格式、语气或长度。</p>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded border border-gray-200 dark:border-slate-700 text-sm text-gray-500 dark:text-gray-400 italic">
                        "语气要活泼，包含Emoji，字数在300字以内..."
                    </div>
                </ScrollReveal>
            </div>
        </div>
      </section>

      {/* Section 3: Feature Cards */}
      <section className="py-24 text-white dark:text-slate-900 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="text-center mb-16">
                <h2 className="text-slate-900 text-3xl md:text-4xl font-extrabold mb-4d dark:text-white">重塑创作体验</h2>
                <p className="text-slate-900 max-w-2xl mx-auto dark:text-white">AI 不仅仅是工具，更是你的思维外骨骼。</p>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ScrollReveal className="p-8 rounded-2xl bg-slate-800 dark:text-white border border-slate-700 dark:border-[#1f1f2e]">
                    <i className="fa-solid fa-bolt text-xl text-purple-400 mb-4 block"></i>
                    <h3 className="font-bold mb-2">极速构建</h3>
                    <p className="text-sm text-gray-400">将提示词编写时间缩短 70%。</p>
                </ScrollReveal>
                <ScrollReveal delay={100} className="p-8 rounded-2xl bg-slate-800 dark:text-white border border-slate-700 dark:border-[#1f1f2e]">
                    <i className="fa-solid fa-brain text-xl text-blue-400 mb-4 block"></i>
                    <h3 className="font-bold mb-2">思维链增强</h3>
                    <p className="text-sm text-gray-400">引导 AI 进行深度推理。</p>
                </ScrollReveal>
                <ScrollReveal delay={200} className="p-8 rounded-2xl bg-slate-800 dark:text-white border border-slate-700 dark:border-[#1f1f2e]">
                    <i className="fa-solid fa-palette text-xl text-pink-400 mb-4 block"></i>
                    <h3 className="font-bold mb-2">风格一致性</h3>
                    <p className="text-sm text-gray-400">确保系列作品的视觉统一。</p>
                </ScrollReveal>
                <ScrollReveal className="p-8 rounded-2xl bg-slate-800 dark:text-white border border-slate-700 dark:border-[#1f1f2e]">
                    <i className="fa-solid fa-code text-xl text-green-400 mb-4 block"></i>
                    <h3 className="font-bold mb-2">多模型兼容</h3>
                    <p className="text-sm text-gray-400">通用于 GPT-4, Claude 3, MJ。</p>
                </ScrollReveal>
                <ScrollReveal delay={100} className="p-8 rounded-2xl bg-slate-800 dark:text-white border border-slate-700 dark:border-[#1f1f2e]">
                    <i className="fa-solid fa-graduation-cap text-xl text-yellow-400 mb-4 block"></i>
                    <h3 className="font-bold mb-2">零基础上手</h3>
                    <p className="text-sm text-gray-400">可视化的提示词构建向导。</p>
                </ScrollReveal>
                <ScrollReveal delay={200} className="p-8 rounded-2xl bg-slate-800 dark:text-white border border-slate-700 dark:border-[#1f1f2e]">
                    <i className="fa-solid fa-chart-line text-xl text-red-400 mb-4 block"></i>
                    <h3 className="font-bold mb-2">效果可量化</h3>
                    <p className="text-sm text-gray-400">数据驱动优化。</p>
                </ScrollReveal>
            </div>
        </div>
      </section>

      {/* Section 4: Template Library Preview */}
      <section className="py-24 bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                <ScrollReveal>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">专业模板库</h2>
                    <p className="text-gray-600 dark:text-gray-400">精选 Nano Banana 风格的高质量提示词。</p>
                </ScrollReveal>
                <div className="flex gap-2 mt-4 md:mt-0">
                    <Link href="/prompts" className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-medium shadow-md transition">全部</Link>
                    <Link href="/prompts?category=code" className="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-full text-sm font-medium hover:border-purple-500 transition dark:bg-[#111118] dark:text-gray-300 dark:border-[#1f1f2e]">编程开发</Link>
                    <Link href="/prompts?category=writing" className="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-full text-sm font-medium hover:border-purple-500 transition dark:bg-[#111118] dark:text-gray-300 dark:border-[#1f1f2e]">写作助手</Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Preview Card 1 */}
                <ScrollReveal className="bg-white dark:bg-[#111118] rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-[#1f1f2e] hover:shadow-xl hover:-translate-y-2 transition duration-300 group">
                    <div className="h-48 overflow-hidden relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop" alt="Abstract Art" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                        <span className="absolute top-4 right-4 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded">Art</span>
                    </div>
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3D 抽象流体壁纸</h3>
                        <div className="bg-gray-50 dark:bg-[#0a0a0f] p-3 rounded-lg border border-gray-200 dark:border-[#1f1f2e] mb-4">
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono line-clamp-3">Generate a 3D abstract fluid art background...</p>
                        </div>
                        <Link href="/prompts/static-art-3d" className="block w-full py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition font-medium text-sm text-center">
                            查看详情
                        </Link>
                    </div>
                </ScrollReveal>

                {/* Preview Card 2 */}
                <ScrollReveal delay={100} className="bg-white dark:bg-[#111118] rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-[#1f1f2e] hover:shadow-xl hover:-translate-y-2 transition duration-300 group">
                    <div className="h-48 overflow-hidden relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop" alt="Coding" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                        <span className="absolute top-4 right-4 bg-blue-600/90 text-white text-xs px-2 py-1 rounded">Dev Code</span>
                    </div>
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">React 组件生成器</h3>
                        <div className="bg-gray-50 dark:bg-[#0a0a0f] p-3 rounded-lg border border-gray-200 dark:border-[#1f1f2e] mb-4">
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono line-clamp-3">Act as a Senior React Developer...</p>
                        </div>
                        <Link href="/prompts/static-react-comp" className="block w-full py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition font-medium text-sm text-center">
                            查看详情
                        </Link>
                    </div>
                </ScrollReveal>

                {/* Preview Card 3 */}
                <ScrollReveal delay={200} className="bg-white dark:bg-[#111118] rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-[#1f1f2e] hover:shadow-xl hover:-translate-y-2 transition duration-300 group">
                    <div className="h-48 overflow-hidden relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop" alt="Writing" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                        <span className="absolute top-4 right-4 bg-pink-500/90 text-white text-xs px-2 py-1 rounded">Writing</span>
                    </div>
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">爆款科技评论文案</h3>
                        <div className="bg-gray-50 dark:bg-[#0a0a0f] p-3 rounded-lg border border-gray-200 dark:border-[#1f1f2e] mb-4">
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono line-clamp-3">Write a tech review for a new AI gadget...</p>
                        </div>
                        <Link href="/prompts/static-writing-review" className="block w-full py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition font-medium text-sm text-center">
                            查看详情
                        </Link>
                    </div>
                </ScrollReveal>
            </div>
            
            <div className="text-center mt-12">
                <Link href="/prompts" className="inline-block px-8 py-3 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition shadow-lg hover:shadow-xl">
                    浏览完整库 <i className="fa-solid fa-layer-group ml-2"></i>
                </Link>
            </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">常见问题</h2>
                <p className="text-gray-600 dark:text-gray-400">了解更多关于ai管理平台的信息</p>
            </ScrollReveal>
            
            <ScrollReveal className="space-y-4">
                <Accordion title="ai管理平台是免费的吗？">
                ai管理平台,满足基本ai提示词与工作流制作需求，开源版本的功能会后续更新，未来添加更多新的模块与功能。
                </Accordion>
                <Accordion title="支持使用哪些 AI 模型？">
                    我们的提示词经过优化，完美支持 ChatGPT (GPT-4/5), Nano Banana-pro, Midjourney V6, Stable Diffusion XL 等主流模型。
                </Accordion>
                <Accordion title="我可以商用生成的提示词吗？">
                    是的，您在ai管理平台上生成或获取的提示词完全归您所有，您可以将其用于任何商业项目。
                </Accordion>
                <Accordion title="如何贡献我的提示词？">
                    我们欢迎社区贡献！您可以在“我的”页面点击“新建提示词”，审核通过后即可上架到公共库。
                </Accordion>
            </ScrollReveal>
        </div>
      </section>

      {/* Footer - 仅在主页显示 */}
      <Footer />
    </div>
  );
}
