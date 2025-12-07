document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. 深色模式初始化 ---
    (function initTheme() {
        const isDark = localStorage.theme === 'dark' || 
                      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (isDark) document.documentElement.classList.add('dark');
    })(); 

    const themeToggleBtn = document.getElementById('theme-toggle');
    if(themeToggleBtn){
        themeToggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        });
    }

    // --- 2. 本地存储卡片管理器 (核心新增) ---
    const STORAGE_KEY = 'custom_prompts_v1';
    const promptsContainer = document.getElementById('prompts-container');

    // 加载并渲染本地存储的卡片
    function loadCustomPrompts() {
        if (!promptsContainer) return;

        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            try {
                const prompts = JSON.parse(storedData);
                prompts.forEach(promptData => {
                    const cardHTML = generateCardHTML(promptData);
                    promptsContainer.insertAdjacentHTML('beforeend', cardHTML);
                });
            } catch (e) {
                console.error('读取本地存储出错:', e);
            }
        }
    }

    // 保存新卡片
    function savePrompt(data) {
        const storedData = localStorage.getItem(STORAGE_KEY);
        let prompts = storedData ? JSON.parse(storedData) : [];
        prompts.push(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
    }

    // 生成卡片 HTML 字符串
    function generateCardHTML(data) {
        const cardId = data.id || Date.now(); 
        const isDark = document.documentElement.classList.contains('dark');
        
        const categoryColors = {
            code: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
            mj: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
            writing: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400' },
            roleplay: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
            business: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400' },
            custom: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400' }
        };
    
        const colors = categoryColors[data.category] || categoryColors['custom'];
        const safePrompt = data.prompt ? data.prompt.replace(/"/g, '&quot;') : '';
        const safeTitle = data.title ? data.title.replace(/"/g, '&quot;') : '';
        const safeDesc = data.desc ? data.desc.replace(/"/g, '&quot;') : ''; 

        // 管理层 HTML
        const manageControls = `
            <div class="manage-layer hidden absolute inset-0 z-20 pointer-events-none">
                <div class="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-[1px]"></div>
                <div class="absolute top-3 left-3 pointer-events-auto">
                    <input type="checkbox" value="${cardId}" class="card-checkbox w-6 h-6 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer shadow-sm transition transform hover:scale-110">
                </div>
            </div>
        `;
// 1. 图标模式
if (data.type === 'icon') {
    // 修复点：添加 data-title 和 data-desc 属性
    return `
    <div id="card-${cardId}" 
         class="filter-card bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative group overflow-hidden" 
         data-category="${data.category}"
         data-title="${safeTitle}"
         data-desc="${safeDesc}">
        ${manageControls}
        <div class="flex-grow p-6 cursor-pointer block">
            <div class="flex justify-between items-start mb-4">
                <div class="w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center ${colors.text}"><i class="${data.icon} text-xl"></i></div>
                <span class="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded uppercase">${data.category}</span>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 transition-colors">${data.title}</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed">${data.desc || data.prompt}</p>
        </div>
        <div class="px-6 pb-6 pt-2 mt-auto flex justify-between items-center border-t border-gray-50 dark:border-slate-800">
            <span class="text-xs text-gray-400 dark:text-gray-500"><i class="fa-solid fa-user text-gray-400 mr-1"></i> Custom</span>
            <button class="copy-btn flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 transition text-xs font-medium" data-prompt="${safePrompt}"><i class="fa-regular fa-copy"></i> 复制</button>
        </div>
    </div>`;
} 

// 2. 图片模式
else {
    const imgUrl = data.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop';
    return `
    <div id="card-${cardId}" 
         class="filter-card bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative group overflow-hidden" 
         data-category="${data.category}"
         data-title="${safeTitle}"
         data-desc="${safeDesc}">
        ${manageControls}
        
        <div class="flex-grow block relative">
            <!-- 图片区域：添加 group/image 以便控制 hover -->
            <div class="h-48 bg-gray-200 dark:bg-slate-800 w-full relative overflow-hidden group/image cursor-zoom-in img-zoom-trigger">
                <img src="${imgUrl}" alt="${data.title}" class="w-full h-full object-cover transition duration-700 group-hover/image:scale-110">
                <span class="absolute top-3 right-3 px-2 py-1 bg-black/50 text-white text-xs font-bold rounded backdrop-blur-md border border-white/20 z-10">IMG</span>
                
                <!-- 悬停遮罩层：显示放大图标 -->
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                     <i class="fa-solid fa-magnifying-glass-plus text-white text-3xl drop-shadow-md transform scale-90 group-hover/image:scale-100 transition-transform"></i>
                </div>
            </div>

            <!-- 文字区域：独立点击进入详情 -->
            <div class="p-6 cursor-pointer card-clickable-area">
                <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 transition-colors">${data.title}</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">${data.desc || data.prompt}</p>
            </div>
        </div>

        <div class="px-6 pb-6 pt-0 mt-auto flex justify-between items-center">
            <span class="text-xs text-gray-400 dark:text-gray-500"><i class="fa-solid fa-user mr-1"></i> Custom</span>
            <button class="copy-btn flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 transition text-xs font-medium" data-prompt="${safePrompt}"><i class="fa-regular fa-copy"></i> 复制</button>
        </div>
    </div>`;
}
}


    // 初始化加载
    if (promptsContainer) {
        loadCustomPrompts();
    }


    // --- 3. 模态框 (Modal) 交互 ---
    const modal = document.getElementById('create-modal');
    const openBtn = document.getElementById('open-modal-btn');
    const closeBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-modal-btn');
    const backdrop = document.getElementById('modal-backdrop');
    const panel = document.getElementById('modal-panel');
    const saveBtn = document.getElementById('save-card-btn');
    
    // 切换模式 (图标 vs 图片)
    const radioInputs = document.querySelectorAll('input[name="card-type"]');
    const iconArea = document.getElementById('icon-selector-area');
    const imageArea = document.getElementById('image-url-area');

    if (radioInputs.length > 0) {
        radioInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                if (e.target.value === 'image') {
                    iconArea.classList.add('hidden');
                    imageArea.classList.remove('hidden');
                } else {
                    iconArea.classList.remove('hidden');
                    imageArea.classList.add('hidden');
                }
            });
        });
    }

    function toggleModal(show) {
        if (!modal) return;
        if (show) {
            modal.classList.remove('hidden');
            // 简单的动画延时
            setTimeout(() => {
                backdrop.classList.remove('opacity-0');
                panel.classList.remove('opacity-0', 'scale-95');
                panel.classList.add('opacity-100', 'scale-100');
            }, 10);
        } else {
            backdrop.classList.add('opacity-0');
            panel.classList.remove('opacity-100', 'scale-100');
            panel.classList.add('opacity-0', 'scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }
    }

    if(openBtn) openBtn.addEventListener('click', () => toggleModal(true));
    if(closeBtn) closeBtn.addEventListener('click', () => toggleModal(false));
    if(cancelBtn) cancelBtn.addEventListener('click', () => toggleModal(false));
    
    // 表单提交
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const title = document.getElementById('card-title').value;
            const prompt = document.getElementById('card-prompt').value;
            const category = document.getElementById('card-category').value;
            const desc = document.getElementById('card-desc').value;
            const type = document.querySelector('input[name="card-type"]:checked').value;
            
            if (!title || !prompt) {
                alert('请填写标题和提示词内容！');
                return;
            }

            const newCardData = {
                id: Date.now(),
                title,
                prompt,
                category,
                desc,
                type,
                icon: document.getElementById('selected-icon').value,
                image: document.getElementById('card-image').value
            };

            // 1. 保存到 LocalStorage
            savePrompt(newCardData);

            // 2. 动态添加到 DOM
            const cardHTML = generateCardHTML(newCardData);
            promptsContainer.insertAdjacentHTML('afterbegin', cardHTML); // 插入到最前面

            // 3. 关闭并重置
            toggleModal(false);
            document.getElementById('create-form').reset();
            // 重置默认图标显示
            document.querySelector('.icon-option').click(); 

            // 4. 触发一次过滤点击，确保如果当前在其他分类，新卡片显示/隐藏状态正确
            const activeFilter = document.querySelector('.filter-btn.bg-purple-600');
            if (activeFilter) activeFilter.click();
        });
    }


    // --- 4. 统一复制功能 ---
    document.body.addEventListener('click', async (e) => {
        const btn = e.target.closest('.copy-btn');
        if (btn) {
            e.preventDefault(); e.stopPropagation();
            const textToCopy = btn.getAttribute('data-prompt');
            if (!textToCopy) return;

            try {
                await navigator.clipboard.writeText(textToCopy);
                showToast();
            } catch (err) {
                fallbackCopyTextToClipboard(textToCopy);
            }
        }
    });

    function showToast() {
        const toast = document.getElementById('toast');
        if(!toast) return;
        toast.className = "toast show";
        setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
    }

    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try { document.execCommand('copy'); showToast(); } catch (err) { console.error('Error', err); }
        document.body.removeChild(textArea);
    }


    // --- 5. 分类过滤系统 (核心修复：支持动态元素) ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    if (filterBtns.length > 0 && promptsContainer) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 1. 样式切换
                filterBtns.forEach(b => {
                    b.classList.remove('bg-purple-600', 'text-white', 'shadow-md', 'shadow-purple-500/20');
                    b.classList.add('bg-white', 'text-gray-600', 'border', 'border-gray-200', 'hover:border-purple-500', 'dark:bg-dark-card', 'dark:text-gray-300', 'dark:border-dark-border');
                });
                btn.classList.remove('bg-white', 'text-gray-600', 'border', 'border-gray-200', 'hover:border-purple-500', 'dark:bg-dark-card', 'dark:text-gray-300', 'dark:border-dark-border');
                btn.classList.add('bg-purple-600', 'text-white', 'shadow-md', 'shadow-purple-500/20');

                const category = btn.getAttribute('data-category');
                
                // 2. 每次点击时重新获取所有卡片 (包括新生成的)
                const currentCards = promptsContainer.querySelectorAll('.filter-card');
                
                currentCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (category === 'all' || cardCategory === category) {
                        card.classList.remove('hidden');
                        card.style.opacity = '0';
                        // 使用 requestAnimationFrame 确保动画流畅
                        requestAnimationFrame(() => {
                            card.style.opacity = '1';
                        });
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }


    // --- 6. 搜索功能 (核心修复：支持动态元素) ---
    const searchInput = document.getElementById('search-input');
    
    if (searchInput && promptsContainer) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            // 每次输入时重新获取所有卡片
            const currentCards = promptsContainer.querySelectorAll('.filter-card');

            currentCards.forEach(card => {
                const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
                const promptAttr = card.querySelector('.copy-btn')?.getAttribute('data-prompt')?.toLowerCase() || '';
                
                // 简单的包含匹配
                if (title.includes(searchTerm) || desc.includes(searchTerm) || promptAttr.includes(searchTerm)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    }

    // --- 7. 其他原有逻辑 (滚动动画等) ---
    // 仅当页面有 .reveal 元素时执行
    const revealElements = document.querySelectorAll('.reveal');
    if(revealElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('active');
            });
        }, { threshold: 0.15 });
        revealElements.forEach(el => observer.observe(el));
    }
    
    // 打字机
    const typeWriterElement = document.getElementById('typewriter-text');
    if (typeWriterElement) {
        const texts = ["终极艺术", "顶级技巧", "思维能力"];
        let textIndex = 0, charIndex = 0, isDeleting = false, typeSpeed = 150;
        function type() {
            const currentText = texts[textIndex];
            if (isDeleting) {
                typeWriterElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--; typeSpeed = 100;
            } else {
                typeWriterElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++; typeSpeed = 200;
            }
            if (!isDeleting && charIndex === currentText.length) { isDeleting = true; typeSpeed = 2000; }
            else if (isDeleting && charIndex === 0) { isDeleting = false; textIndex = (textIndex + 1) % texts.length; typeSpeed = 500; }
            setTimeout(type, typeSpeed);
        }
        type();
    }
    // 新增：详情页逻辑 (Detail View Logic)

    const detailView = document.getElementById('detail-view');
    const backBtn = document.getElementById('back-to-list-btn');
    const mainContent = document.querySelector('main'); // 主列表区域
    const headerContent = document.querySelector('header'); // 头部搜索区
    
    // 详情页元素
    const detailTitle = document.getElementById('detail-title');
    const detailDesc = document.getElementById('detail-desc');
    const detailPromptText = document.getElementById('detail-prompt-text');
    const detailCopyBtn = document.getElementById('detail-copy-btn');
    const detailCategoryTag = document.getElementById('detail-category-tag');
    const detailImage = document.getElementById('detail-image');
    const detailIconPlaceholder = document.getElementById('detail-icon-placeholder');
    const detailIconLarge = document.getElementById('detail-icon-large');
    const detailImageContainer = document.getElementById('detail-image-container');
    const detailThemeToggle = document.getElementById('detail-theme-toggle');

    // 1. 打开详情页函数
    function openDetail(card) {
        const title = card.dataset.title || card.querySelector('h3').textContent;
        let desc = card.dataset.desc; 
        
        // 智能判断简介逻辑 (保持不变)
        if (desc === undefined) {
            const pText = card.querySelector('p').textContent.trim();
            const copyBtn = card.querySelector('.copy-btn');
            const promptText = copyBtn ? copyBtn.getAttribute('data-prompt').trim() : '';
            if (promptText.startsWith(pText.substring(0, 50))) {
                desc = ""; 
            } else {
                desc = pText;
            }
        }
    
        const copyBtn = card.querySelector('.copy-btn');
        const prompt = copyBtn ? copyBtn.getAttribute('data-prompt') : '';
        const category = card.getAttribute('data-category') || 'All';
        
        // 获取图片或图标
        const imgEl = card.querySelector('img');
        const iconContainer = card.querySelector('.w-10'); 
        const iconEl = iconContainer ? iconContainer.querySelector('i') : null;
    
        // 填充数据
        const detailTitle = document.getElementById('detail-title');
        const detailDesc = document.getElementById('detail-desc');
        const detailPromptText = document.getElementById('detail-prompt-text');
        const detailCategoryTag = document.getElementById('detail-category-tag');
        const detailImage = document.getElementById('detail-image');
        const detailIconPlaceholder = document.getElementById('detail-icon-placeholder');
        const detailIconLarge = document.getElementById('detail-icon-large');
        const detailImageContainer = document.getElementById('detail-image-container');
        const detailView = document.getElementById('detail-view');
    
        detailTitle.textContent = title;
        
        if (desc && desc.trim() !== "") {
            detailDesc.textContent = desc;
            detailDesc.style.display = 'block';
        } else {
            detailDesc.style.display = 'none';
        }
    
        detailPromptText.value = prompt;
        detailCategoryTag.textContent = category;
        
        // 设置分类颜色
        const colors = {
            'code': 'text-blue-600 bg-blue-100',
            'mj': 'text-purple-600 bg-purple-100',
            'writing': 'text-pink-600 bg-pink-100',
            'business': 'text-indigo-600 bg-indigo-100', 
            'roleplay': 'text-green-600 bg-green-100',
            'custom': 'text-yellow-600 bg-yellow-100'
        };
        detailCategoryTag.className = `px-3 py-1 text-xs font-bold rounded uppercase ${colors[category] || 'text-gray-600 bg-gray-100'}`;
    
        // --- 核心修复：移除 !card.querySelector('.fa-user') 的限制 ---
        // 只要有图片，就显示图片区域
        if (imgEl) { 
            detailImage.src = imgEl.src;
            detailImage.classList.remove('hidden');
            detailIconPlaceholder.classList.add('hidden');
            // 点击详情页的大图也可以看 Lightbox
            detailImageContainer.onclick = () => openLightbox(imgEl.src);
            detailImageContainer.classList.add('cursor-zoom-in');
        } else if (iconEl) {
            detailIconLarge.className = iconEl.className + " text-9xl text-slate-300 dark:text-slate-600 mb-4";
            detailImage.classList.add('hidden');
            detailIconPlaceholder.classList.remove('hidden');
            detailImageContainer.onclick = null;
            detailImageContainer.classList.remove('cursor-zoom-in');
        }
    
        document.body.style.overflow = 'hidden'; 
        detailView.classList.remove('hidden');
        requestAnimationFrame(() => {
            detailView.classList.remove('opacity-0');
        });
    }

    // 2. 关闭详情页函数
    function closeDetail() {
        detailView.classList.add('opacity-0');
        setTimeout(() => {
            detailView.classList.add('hidden');
            document.body.style.overflow = ''; // 恢复滚动
        }, 300);
    }

    // 3. 事件委托：监听卡片点击
    // 我们绑定在 prompts-container 上，这样不管是静态还是 JS 生成的卡片都有效
    if (promptsContainer) {
        promptsContainer.addEventListener('click', (e) => {
            if (typeof isManageMode !== 'undefined' && isManageMode) return;
            
            // 排除复选框和复制按钮
            if (e.target.closest('.copy-btn') || e.target.closest('.card-checkbox') || e.target.closest('.manage-layer')) return;

            // 1. 检查是否点击了图片区域 (触发 Lightbox)
            const imgTrigger = e.target.closest('.img-zoom-trigger');
            if (imgTrigger) {
                const img = imgTrigger.querySelector('img');
                if (img) {
                    openLightbox(img.src);
                    return; // 阻止后续逻辑，不打开详情页
                }
            }

            // 2. 检查是否点击了卡片主体 (触发详情页)
            // 我们在 HTML 中给文字区域添加了 'card-clickable-area' 类，或者如果没有点到图片，通常就是点到了卡片
            const card = e.target.closest('.filter-card');
            if (card) {
                openDetail(card);
            }
        });
    }

    // 4. 返回按钮逻辑
    if (backBtn) {
        backBtn.addEventListener('click', closeDetail);
    }
    // ESC 键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDetail();
            closeLightbox();
        }
    });

    // 5. 详情页内的复制功能
    if (detailCopyBtn) {
        detailCopyBtn.addEventListener('click', async () => {
            const text = detailPromptText.value;
            if (!text) return;
            try {
                await navigator.clipboard.writeText(text);
                // 改变按钮状态反馈
                const originalHtml = detailCopyBtn.innerHTML;
                detailCopyBtn.innerHTML = '<i class="fa-solid fa-check"></i> 已复制';
                detailCopyBtn.classList.add('text-green-600');
                showToast('提示词已复制！');
                
                setTimeout(() => {
                    detailCopyBtn.innerHTML = originalHtml;
                    detailCopyBtn.classList.remove('text-green-600');
                }, 2000);
            } catch (err) {
                console.error('Copy failed', err);
            }
        });
    }

    // 6. 详情页内深色模式同步
    if (detailThemeToggle) {
        detailThemeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        });
    }

    // ==========================================
    // 新增：图片灯箱逻辑 (Lightbox)
    // ==========================================
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.remove('hidden');
        requestAnimationFrame(() => {
            lightbox.classList.remove('opacity-0');
            lightboxImg.classList.remove('scale-95');
            lightboxImg.classList.add('scale-100');
        });
    }

    function closeLightbox() {
        lightbox.classList.add('opacity-0');
        lightboxImg.classList.add('scale-95');
        lightboxImg.classList.remove('scale-100');
        setTimeout(() => {
            lightbox.classList.add('hidden');
        }, 300);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) closeLightbox();
        });
    }
    // --- 8. 删除管理功能 (高级优化版) ---
    const toggleManageBtn = document.getElementById('toggle-manage-btn');
    const batchDeleteBtn = document.getElementById('batch-delete-btn');
    const selectedCountSpan = document.getElementById('selected-count');
    const confirmModal = document.getElementById('delete-confirm-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    
    // 状态管理
    let isManageMode = false;
    let deleteTargetIds = []; // 核心：存储待删除的 ID 数组

    // 8.1 切换管理模式 (逻辑优化：退出时彻底重置)
    if (toggleManageBtn) {
        toggleManageBtn.addEventListener('click', () => {
            isManageMode = !isManageMode;
            
            if (isManageMode) {
                // 进入管理模式
                toggleManageBtn.classList.add('bg-purple-100', 'text-purple-700', 'border-purple-300', 'dark:bg-purple-900/50');
                const textSpan = document.getElementById('manage-btn-text');
                if(textSpan) textSpan.textContent = '完成';
                
                batchDeleteBtn.classList.remove('hidden');
                batchDeleteBtn.classList.add('flex');
            } else {
                // 退出管理模式：执行彻底清理
                toggleManageBtn.classList.remove('bg-purple-100', 'text-purple-700', 'border-purple-300', 'dark:bg-purple-900/50');
                const textSpan = document.getElementById('manage-btn-text');
                if(textSpan) textSpan.textContent = '管理';
                
                batchDeleteBtn.classList.add('hidden');
                batchDeleteBtn.classList.remove('flex');
                
                // 核心：清空所有选中状态
                document.querySelectorAll('.card-checkbox').forEach(cb => cb.checked = false);
                deleteTargetIds = []; 
                updateSelectedCount(); // 重置按钮状态
            }

            // 切换卡片图层显示
            document.querySelectorAll('.manage-layer').forEach(layer => {
                if(isManageMode) layer.classList.remove('hidden');
                else layer.classList.add('hidden');
            });
        });
    }

    // 8.2 更新选中计数与按钮状态 (UI驱动核心)
    function updateSelectedCount() {
        const checkedBoxes = document.querySelectorAll('.card-checkbox:checked');
        const count = checkedBoxes.length;
        
        if(selectedCountSpan) selectedCountSpan.textContent = count;
        
        if (!batchDeleteBtn) return;

        // 核心优化：根据数量控制按钮的可用性 (Disabled State)
        if (count > 0) {
            batchDeleteBtn.removeAttribute('disabled');
            batchDeleteBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            batchDeleteBtn.classList.add('cursor-pointer', 'shadow-sm', 'bg-red-100'); // 激活样式
        } else {
            batchDeleteBtn.setAttribute('disabled', 'true');
            batchDeleteBtn.classList.add('opacity-50', 'cursor-not-allowed');
            batchDeleteBtn.classList.remove('cursor-pointer', 'shadow-sm', 'bg-red-100'); // 禁用样式
        }
    }

    // 事件委托：监听复选框变化
    if (promptsContainer) {
        promptsContainer.addEventListener('change', (e) => {
            if (e.target.classList.contains('card-checkbox')) {
                updateSelectedCount();
            }
        });
    }

    // 8.4 点击批量删除按钮
    if (batchDeleteBtn) {
        batchDeleteBtn.addEventListener('click', () => {
            // 双重保险：虽然UI禁用了，逻辑上再查一次
            if (batchDeleteBtn.disabled) return;

            const checkedBoxes = document.querySelectorAll('.card-checkbox:checked');
            if (checkedBoxes.length === 0) {
                showToast('请先选择要删除的卡片', 'warning');
                return;
            }
            
            // 收集所有被选中的ID
            deleteTargetIds = Array.from(checkedBoxes).map(cb => parseInt(cb.value));
            showDeleteConfirm();
        });
    }

    // 8.5 确认删除弹窗逻辑
    function showDeleteConfirm() {
        if(confirmModal) {
            confirmModal.classList.remove('hidden');
            // 简单动画
            setTimeout(() => {
                const backdrop = document.getElementById('delete-backdrop');
                if(backdrop) backdrop.classList.remove('opacity-0');
            }, 10);
        }
    }

    function hideDeleteConfirm() {
        if(confirmModal) confirmModal.classList.add('hidden');
        // 核心：弹窗关闭后，务必清空待删除列表，防止下次误删
        // 注意：如果是“取消”操作，才需要清空；如果是“确认删除”后调用，逻辑不同。
        // 这里我们在 cancel 按钮绑定专门的清空逻辑。
    }

    if(cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            hideDeleteConfirm();
            deleteTargetIds = []; // 只有取消时才清空 ID，确保安全
        });
    }

// 8.6 执行删除 (核心事务)
if(confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
        if (deleteTargetIds.length === 0) {
            hideDeleteConfirm();
            return;
        }

        // 1. 从 LocalStorage 删除数据 (只处理数字类型的ID)
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            let prompts = JSON.parse(storedData);
            const originalLength = prompts.length;
            
            // 过滤保留的数据 (注意类型转换，deleteTargetIds 可能是字符串或数字)
            prompts = prompts.filter(p => !deleteTargetIds.includes(p.id) && !deleteTargetIds.includes(String(p.id)));
            
            if (prompts.length < originalLength) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
            }
        }

        // 2. 从 DOM 移除元素 (添加离场动画)
        deleteTargetIds.forEach(id => {
            // 确保 ID 匹配 HTML 中的 id="card-xxx"
            const card = document.getElementById(`card-${id}`);
            if (card) {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                setTimeout(() => card.remove(), 300);
            } else {
                console.warn(`未找到 ID 为 card-${id} 的 DOM 元素`);
            }
        });

        // 3. 收尾工作
        hideDeleteConfirm();
        deleteTargetIds = []; // 清空目标
        updateSelectedCount(); // 更新计数
        
        // 重置所有复选框状态
        document.querySelectorAll('.card-checkbox').forEach(cb => cb.checked = false);

        showToast('删除成功', 'delete'); 
    });
}

    // 8.7 优化的 Toast 提示工具
    function showToast(message = '操作成功', type = 'success') {
        const toast = document.getElementById('toast');
        if(!toast) return;
        
        // 根据类型设置图标和颜色
        let icon = '<i class="fa-solid fa-check-circle mr-2"></i>';
        let bgClass = 'bg-[#10b981]'; // 默认绿色

        if (type === 'error' || type === 'delete') {
            icon = '<i class="fa-solid fa-trash-can mr-2"></i>';
            bgClass = 'bg-red-500';
        } else if (type === 'warning') {
            icon = '<i class="fa-solid fa-circle-exclamation mr-2"></i>';
            bgClass = 'bg-orange-500';
        }

        // 重置样式
        toast.className = `toast fixed z-[120] min-w-[250px] text-white text-center rounded-lg p-4 left-1/2 bottom-[30px] -translate-x-1/2 opacity-0 transition-all duration-300 ${bgClass}`;
        toast.innerHTML = `${icon} ${message}`;
        
        // 显示
        requestAnimationFrame(() => {
            toast.classList.add('show', 'opacity-100', 'bottom-[50px]');
        });

        // 3秒后隐藏
        setTimeout(() => { 
            toast.classList.remove('show', 'opacity-100', 'bottom-[50px]');
            toast.classList.add('opacity-0', 'bottom-[30px]');
        }, 3000);
    }
});