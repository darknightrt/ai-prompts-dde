"use client";

import { useState, useRef } from 'react';
import { PromptItem } from '@/lib/types';
import { usePrompts } from '@/context/PromptContext';
import { useToast } from '@/context/ToastContext';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const { addPrompt } = usePrompts();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importData, setImportData] = useState<PromptItem[]>([]);
  const [isPreview, setIsPreview] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // 验证数据格式
        if (Array.isArray(data)) {
          const validData = data.filter(item => 
            item.title && item.prompt && item.category
          );
          
          if (validData.length === 0) {
            showToast('文件格式不正确，未找到有效数据', 'error');
            return;
          }
          
          setImportData(validData);
          setIsPreview(true);
        } else {
          showToast('文件格式不正确，应为 JSON 数组', 'error');
        }
      } catch (error) {
        showToast('文件解析失败，请检查 JSON 格式', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      handleFileSelect(file);
    } else {
      showToast('请上传 JSON 文件', 'error');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleImport = () => {
    importData.forEach(item => {
      addPrompt({
        title: item.title,
        desc: item.desc,
        prompt: item.prompt,
        category: item.category,
        complexity: item.complexity || 'beginner',
        type: item.type || 'text',
      });
    });
    
    showToast(`成功导入 ${importData.length} 个提示词`, 'success');
    onClose();
    setImportData([]);
    setIsPreview(false);
  };

  const handleReset = () => {
    setImportData([]);
    setIsPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-700">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              批量导入提示词
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6">
          {!isPreview ? (
            <>
              {/* Upload Area */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition ${
                  isDragging 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10' 
                    : 'border-gray-300 dark:border-slate-600'
                }`}
              >
                <i className="fa-solid fa-cloud-arrow-up text-5xl text-gray-400 mb-4"></i>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  拖拽 JSON 文件到此处，或
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition"
                >
                  选择文件
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>

              {/* Format Info */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  <i className="fa-solid fa-circle-info mr-2"></i>
                  文件格式说明
                </h4>
                <pre className="text-xs text-blue-800 dark:text-blue-400 overflow-x-auto">
{`[
  {
    "title": "提示词标题",
    "prompt": "提示词内容",
    "category": "code",
    "complexity": "beginner",
    "desc": "描述（可选）",
    "type": "text",
  }
]`}
                </pre>
              </div>
            </>
          ) : (
            <>
              {/* Preview */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  预览导入数据（共 {importData.length} 条）
                </h4>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {importData.slice(0, 10).map((item, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                      <div className="flex items-start gap-3">
                        <i className="fa-solid fa-file-lines text-purple-500 mt-1"></i>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {item.title}
                          </h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {item.prompt}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-slate-700 rounded">
                              {item.category}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-slate-700 rounded">
                              {item.complexity || 'beginner'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {importData.length > 10 && (
                    <p className="text-center text-sm text-gray-500">
                      还有 {importData.length - 10} 条数据...
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition"
                >
                  重新选择
                </button>
                <button
                  onClick={handleImport}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition"
                >
                  确认导入
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
