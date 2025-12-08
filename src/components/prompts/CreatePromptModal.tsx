"use client";

import React, { useState, useEffect } from 'react';
import { usePrompts } from '@/context/PromptContext';
import { useToast } from '@/context/ToastContext';
import { Category, Complexity, PromptItem, PromptTag, TagColor } from '@/lib/types';

interface CreatePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: PromptItem | null; // 支持传入编辑数据
}

export default function CreatePromptModal({ isOpen, onClose, editData }: CreatePromptModalProps) {
  const { addPrompt, updatePrompt } = usePrompts();
  const { showToast } = useToast();
  
  const initialForm = {
    title: '',
    category: 'code' as Category,
    complexity: 'beginner' as Complexity, // 默认初级
    type: 'text' as 'text',
    desc: '',
    prompt: '',
    tags: [] as PromptTag[]
  };

  // 标签颜色配置
  const tagColors: { value: TagColor; label: string; bgClass: string; textClass: string; borderClass: string }[] = [
    { value: 'purple', label: '浅紫色', bgClass: 'bg-purple-900/30', textClass: 'text-purple-400', borderClass: 'border-purple-700' },
    { value: 'green', label: '绿色', bgClass: 'bg-green-900/30', textClass: 'text-green-400', borderClass: 'border-green-700' },
    { value: 'blue', label: '蓝色', bgClass: 'bg-blue-900/30', textClass: 'text-blue-400', borderClass: 'border-blue-700' },
    { value: 'yellow', label: '黄色', bgClass: 'bg-yellow-900/30', textClass: 'text-yellow-400', borderClass: 'border-yellow-700' }
  ];

  const [newTagText, setNewTagText] = useState('');
  const [newTagColor, setNewTagColor] = useState<TagColor>('purple');

  const [formData, setFormData] = useState(initialForm);

  // 当打开或 editData 变化时，重置/填充表单
  useEffect(() => {
      if (isOpen) {
          if (editData) {
              setFormData({
                  title: editData.title,
                  category: editData.category,
                  complexity: editData.complexity || 'beginner', // 兼容旧数据
                  type: 'text',
                  desc: editData.desc || '',
                  prompt: editData.prompt,
                  tags: editData.tags || []
              });
          } else {
              setFormData(initialForm);
          }
          setNewTagText('');
          setNewTagColor('purple');
      }
  }, [isOpen, editData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editData) {
        // 编辑模式
        updatePrompt(editData.id, formData);
        showToast('更新成功！', 'success');
    } else {
        // 新增模式
        addPrompt(formData);
        showToast('创建成功！', 'success');
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-dark-card text-left shadow-2xl transition-all w-[95%] mx-auto sm:w-full sm:max-w-lg border border-gray-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="px-4 pb-4 pt-5 sm:p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl font-bold leading-6 text-slate-900 dark:text-white">
                {editData ? '编辑提示词' : '创建新提示词'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">标题 *</label>
              <input 
                type="text" 
                required 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm text-gray-900 dark:text-white px-3 py-2" 
                placeholder="例如：SEO 优化助手"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">分类</label>
                    <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value as Category})}
                        className="mt-1 block w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm text-gray-900 dark:text-white px-3 py-2"
                    >
                        <option value="code">编程开发</option>
                        <option value="mj">AI绘画</option>
                        <option value="writing">写作助手</option>
                        <option value="roleplay">角色扮演</option>
                        <option value="business">商务办公</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">复杂度</label>
                    <select 
                        value={formData.complexity}
                        onChange={e => setFormData({...formData, complexity: e.target.value as Complexity})}
                        className="mt-1 block w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm text-gray-900 dark:text-white px-3 py-2"
                    >
                        <option value="beginner">初级</option>
                        <option value="intermediate">中级</option>
                        <option value="advanced">高级</option>
                    </select>
                </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">提示词内容</label>
              <textarea 
                required
                rows={4}
                value={formData.prompt}
                onChange={e => setFormData({...formData, prompt: e.target.value})}
                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm text-gray-900 dark:text-white px-3 py-2 font-mono text-xs" 
                placeholder="在这里输入完整的 Prompt..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">简介</label>
              <textarea 
                rows={2}
                value={formData.desc}
                onChange={e => setFormData({...formData, desc: e.target.value})}
                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm text-gray-900 dark:text-white px-3 py-2" 
                placeholder="简要描述..."
              />
            </div>

            {/* 标签编辑模块 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">自定义标签（最多4个）</label>
              
              {/* 标签墙 - 显示已添加的标签 */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  {formData.tags.map((tag, index) => {
                    const colorConfig = tagColors.find(c => c.value === tag.color);
                    return (
                      <span 
                        key={index}
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded border ${colorConfig?.bgClass} ${colorConfig?.textClass} ${colorConfig?.borderClass}`}
                      >
                        {tag.text}
                        <button
                          type="button"
                          onClick={() => {
                            const newTags = formData.tags.filter((_, i) => i !== index);
                            setFormData({...formData, tags: newTags});
                          }}
                          className="ml-1 hover:text-red-400 transition"
                        >
                          <i className="fa-solid fa-xmark text-[10px]"></i>
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              {/* 添加新标签 */}
              {formData.tags.length < 4 && (
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={newTagText}
                    onChange={e => setNewTagText(e.target.value)}
                    placeholder="输入标签名称"
                    className="flex-1 rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm text-gray-900 dark:text-white px-3 py-2"
                    maxLength={15}
                  />
                  
                  {/* 颜色选择 */}
                  <div className="flex gap-1">
                    {tagColors.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setNewTagColor(color.value)}
                        className={`w-6 h-6 rounded-full border-2 transition ${color.bgClass} ${
                          newTagColor === color.value ? 'ring-2 ring-offset-2 ring-offset-slate-800 ring-white' : ''
                        }`}
                        title={color.label}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (newTagText.trim() && formData.tags.length < 4) {
                        setFormData({
                          ...formData,
                          tags: [...formData.tags, { text: newTagText.trim(), color: newTagColor }]
                        });
                        setNewTagText('');
                      }
                    }}
                    disabled={!newTagText.trim()}
                    className="px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
        <div className="bg-gray-50 dark:bg-slate-800/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button onClick={handleSubmit} type="button" className="inline-flex w-full justify-center rounded-lg bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 sm:ml-3 sm:w-auto transition">
            保存
          </button>
          <button onClick={onClose} type="button" className="mt-3 inline-flex w-full justify-center rounded-lg bg-white dark:bg-slate-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-slate-600 sm:mt-0 sm:w-auto transition">
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
