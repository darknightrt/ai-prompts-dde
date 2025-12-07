"use client";

import { useState, useRef, useEffect } from 'react';
import { WorkflowItem, WorkflowCategory, WorkflowComplexity } from '@/lib/types';
import { useWorkflows } from '@/context/WorkflowContext';
import { useToast } from '@/context/ToastContext';

interface CreateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: WorkflowItem | null;
}

const CATEGORIES: { value: WorkflowCategory; label: string }[] = [
  { value: 'n8n', label: 'n8n' },
  { value: 'comfyui', label: 'ComfyUI' },
  { value: 'dify', label: 'Dify' },
  { value: 'other', label: '其他' },
];

const COMPLEXITIES: { value: WorkflowComplexity; label: string; color: string }[] = [
  { value: 'beginner', label: '初级', color: 'bg-green-600' },
  { value: 'intermediate', label: '中级', color: 'bg-yellow-500' },
  { value: 'advanced', label: '高级', color: 'bg-red-600' },
];

export default function CreateWorkflowModal({ 
  isOpen, 
  onClose,
  editData 
}: CreateWorkflowModalProps) {
  const { addWorkflow, updateWorkflow } = useWorkflows();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detail: '',
    category: 'n8n' as WorkflowCategory,
    complexity: 'beginner' as WorkflowComplexity,
    images: [''],
    workflowJson: '',
    downloadUrl: '',
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title,
        description: editData.description,
        detail: editData.detail || '',
        category: editData.category,
        complexity: editData.complexity || 'beginner',
        images: editData.images.length > 0 ? editData.images : [''],
        workflowJson: editData.workflowJson || '',
        downloadUrl: editData.downloadUrl || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        detail: '',
        category: 'n8n',
        complexity: 'beginner',
        images: [''],
        workflowJson: '',
        downloadUrl: '',
      });
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    if (formData.images.length < 4) {
      setFormData({ ...formData, images: [...formData.images, ''] });
    }
  };

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData({ ...formData, images: newImages });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setFormData({ ...formData, workflowJson: content });
        showToast('工作流文件已加载', 'success');
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证
    if (!formData.title.trim()) {
      showToast('请输入工作流标题', 'error');
      return;
    }
    if (!formData.description.trim()) {
      showToast('请输入工作流简介', 'error');
      return;
    }
    const validImages = formData.images.filter(img => img.trim());
    if (validImages.length === 0) {
      showToast('请至少添加一张预览图片', 'error');
      return;
    }

    const workflowData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      detail: formData.detail.trim(),
      category: formData.category,
      complexity: formData.complexity,
      images: validImages,
      workflowJson: formData.workflowJson,
      downloadUrl: formData.downloadUrl.trim(),
    };

    if (editData) {
      updateWorkflow(editData.id, workflowData);
      showToast('工作流已更新', 'success');
    } else {
      addWorkflow(workflowData);
      showToast('工作流已创建', 'success');
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white dark:bg-[#111] rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {editData ? '编辑工作流' : '创建工作流'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="输入工作流标题"
            />
          </div>

          {/* 分类 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              分类 <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.value })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    formData.category === cat.value
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 复杂度 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              复杂度 <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {COMPLEXITIES.map((comp) => (
                <button
                  key={comp.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, complexity: comp.value })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    formData.complexity === comp.value
                      ? `${comp.color} text-white`
                      : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {comp.label}
                </button>
              ))}
            </div>
          </div>

          {/* 简介 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              简介 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="简要描述工作流的功能"
            />
          </div>

          {/* 详细说明 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              详细说明
            </label>
            <textarea
              value={formData.detail}
              onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="详细的使用说明（可选）"
            />
          </div>

          {/* 图片链接 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              预览图片 <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2">(最多4张)</span>
            </label>
            <div className="space-y-2">
              {formData.images.map((img, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="输入图片链接"
                  />
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  )}
                </div>
              ))}
              {formData.images.length < 4 && (
                <button
                  type="button"
                  onClick={addImageField}
                  className="text-sm text-purple-500 hover:text-purple-400 flex items-center gap-1"
                >
                  <i className="fa-solid fa-plus"></i>
                  添加图片
                </button>
              )}
            </div>
          </div>

          {/* 工作流文件 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              工作流 JSON 文件
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition flex items-center gap-2"
              >
                <i className="fa-solid fa-upload"></i>
                上传文件
              </button>
              {formData.workflowJson && (
                <span className="flex items-center text-sm text-green-500">
                  <i className="fa-solid fa-check mr-1"></i>
                  已加载
                </span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* 下载链接 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              外部下载链接
            </label>
            <input
              type="url"
              value={formData.downloadUrl}
              onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="外部下载链接（可选）"
            />
          </div>

          {/* 提交按钮 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-700 transition"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition"
            >
              {editData ? '保存修改' : '创建工作流'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
