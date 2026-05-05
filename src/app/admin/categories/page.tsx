'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, FolderOpen, Edit, Trash2, X, AlertCircle } from 'lucide-react';
import { httpFetch } from '@/lib/fetch';

interface Category {
  id: string;
  nameZh: string;
  nameEn: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  status: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ nameZh: '', nameEn: '' });
  const [formErrors, setFormErrors] = useState<{ nameZh?: string; nameEn?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 获取分类列表
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: ApiResponse<Category[]> = await httpFetch('/api/category');
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('获取分类列表失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // 打开新增弹窗
  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ nameZh: '', nameEn: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // 打开编辑弹窗
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ nameZh: category.nameZh, nameEn: category.nameEn });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // 打开删除确认弹窗
  const handleDeleteClick = (category: Category) => {
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
  };

  // 验证表单
  const validateForm = (): boolean => {
    const errors: { nameZh?: string; nameEn?: string } = {};

    if (!formData.nameZh.trim()) {
      errors.nameZh = '中文名称不能为空';
    }

    if (!formData.nameEn.trim()) {
      errors.nameEn = '英文名称不能为空';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 提交表单（新增/编辑）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const url = '/api/category';
      const method = editingCategory ? 'PUT' : 'POST';
      const body = editingCategory
        ? { id: editingCategory.id, ...formData }
        : formData;

      const response: ApiResponse<Category> = await httpFetch(url, {
        method,
        body: JSON.stringify(body),
      });

      if (response.success) {
        setIsModalOpen(false);
        fetchCategories();
      } else {
        if (response.message.includes('中文')) {
          setFormErrors((prev) => ({ ...prev, nameZh: response.message }));
        } else if (response.message.includes('英文')) {
          setFormErrors((prev) => ({ ...prev, nameEn: response.message }));
        } else {
          alert(response.message);
        }
      }
    } catch (error) {
      console.error('保存分类失败:', error);
      alert('保存失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 确认删除
  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;

    try {
      const response: ApiResponse = await httpFetch(
        `/api/category?id=${deletingCategory.id}`,
        { method: 'DELETE' }
      );

      if (response.success) {
        setIsDeleteModalOpen(false);
        setDeletingCategory(null);
        fetchCategories();
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error('删除分类失败:', error);
      alert('删除失败，请稍后重试');
    }
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">分类管理</h1>
          <p className="mt-1 text-sm text-gray-500">管理产品分类信息</p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          新增分类
        </button>
      </div>

      {/* Category list */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-gray-500">加载中...</div>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FolderOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">暂无分类</h3>
            <p className="text-sm text-gray-500 mb-4 text-center">
              您还没有添加任何分类，点击上方按钮添加第一个分类
            </p>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              新增分类
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    中文名称
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    英文名称
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    创建时间
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {category.nameZh}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {category.nameEn}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          编辑
                        </button>
                        <button
                          onClick={() => handleDeleteClick(category)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCategory ? '编辑分类' : '新增分类'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  中文名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nameZh}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, nameZh: e.target.value }))
                  }
                  placeholder="请输入中文名称"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    formErrors.nameZh
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {formErrors.nameZh && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.nameZh}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  英文名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, nameEn: e.target.value }))
                  }
                  placeholder="请输入英文名称"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    formErrors.nameEn
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {formErrors.nameEn && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.nameEn}</p>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsDeleteModalOpen(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                确认删除
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                确定要删除分类「{deletingCategory?.nameZh}」吗？此操作不可恢复。
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
