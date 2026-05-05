'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';
import { httpFetch } from '@/lib/fetch';

interface FormData {
  nameZh: string;
  nameEn: string;
  categoryZh: string;
  categoryEn: string;
  descriptionZh: string;
  descriptionEn: string;
  coverImage: string;
  detailImages: string[];
}

interface FormErrors {
  nameZh?: string;
  nameEn?: string;
  category?: string;
  descriptionZh?: string;
  descriptionEn?: string;
  coverImage?: string;
  detailImages?: string;
}

interface Category {
  id: string;
  nameZh: string;
  nameEn: string;
}

const initialFormData: FormData = {
  nameZh: '',
  nameEn: '',
  categoryZh: '',
  categoryEn: '',
  descriptionZh: '',
  descriptionEn: '',
  coverImage: '',
  detailImages: [],
};

const token = localStorage.getItem('token');

export default function CreateProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  const [detailImagePreviews, setDetailImagePreviews] = useState<string[]>([]);
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');
  const [detailImageUrls, setDetailImageUrls] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const detailImagesInputRef = useRef<HTMLInputElement>(null);

  // 获取分类列表
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await httpFetch('/api/category');
        if (result.success) {
          setCategories(result.data);
        } else {
          console.error('获取分类列表失败:', result.message);
        }
      } catch (error) {
        console.error('获取分类列表错误:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nameZh.trim()) {
      newErrors.nameZh = '请输入产品中文名称';
    }

    if (!formData.nameEn.trim()) {
      newErrors.nameEn = '请输入产品英文名称';
    }

    if (!formData.categoryZh.trim() || !formData.categoryEn.trim()) {
      newErrors.category = '请选择产品分类';
    }

    if (!formData.descriptionZh.trim()) {
      newErrors.descriptionZh = '请输入中文描述';
    }

    if (!formData.descriptionEn.trim()) {
      newErrors.descriptionEn = '请输入英文描述';
    }

    if (!coverImageUrl) {
      newErrors.coverImage = '请上传封面图';
    }

    if (detailImageUrls.length === 0) {
      newErrors.detailImages = '请至少上传1张详情图';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();

    formData.append('image', file);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: token?`Bearer ${token}`:''
      },
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || '上传失败');
    }

    return result.data.urls[0];
  };

  const deleteImages = async (urls: string[]): Promise<void> => {
    if (urls.length === 0) return;

    const response = await fetch('/api/upload', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({ urls }),
    });

    const result = await response.json();

    if (!result.success) {
      console.error('删除图片失败:', result.message);
    }
  };

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // 将旧图片加入待删除列表（如果存在）
        if (coverImageUrl) {
          setImagesToDelete((prev) => [...prev, coverImageUrl]);
        }
        const url = await uploadImage(file);
        setCoverImagePreview(URL.createObjectURL(file));
        setCoverImageUrl(url);
        setErrors((prev) => ({ ...prev, coverImage: undefined }));
      } catch (error) {
        alert('封面图上传失败: ' + (error instanceof Error ? error.message : '未知错误'));
      }
    }
  };

  const handleDetailImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      try {
        const urls: string[] = [];
        for (const file of files) {
          const url = await uploadImage(file);
          urls.push(url);
        }
        setDetailImagePreviews((prev) => [
          ...prev,
          ...files.map((file) => URL.createObjectURL(file)),
        ]);
        setDetailImageUrls((prev) => [...prev, ...urls]);
        setErrors((prev) => ({ ...prev, detailImages: undefined }));
      } catch (error) {
        alert('详情图上传失败: ' + (error instanceof Error ? error.message : '未知错误'));
      }
    }
    // 重置 input 值，允许重复上传相同文件
    if (detailImagesInputRef.current) {
      detailImagesInputRef.current.value = '';
    }
  };

  const removeCoverImage = () => {
    // 将已上传的图片加入待删除列表
    if (coverImageUrl) {
      setImagesToDelete((prev) => [...prev, coverImageUrl]);
    }
    setCoverImagePreview('');
    setCoverImageUrl('');
  };

  const removeDetailImage = (index: number) => {
    const urlToDelete = detailImageUrls[index];
    // 将已上传的图片加入待删除列表
    if (urlToDelete) {
      setImagesToDelete((prev) => [...prev, urlToDelete]);
    }
    setDetailImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setDetailImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    if (categoryId) {
      const selectedCategory = categories.find((cat) => cat.id === categoryId);
      if (selectedCategory) {
        setFormData((prev) => ({
          ...prev,
          categoryZh: selectedCategory.nameZh,
          categoryEn: selectedCategory.nameEn,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        categoryZh: '',
        categoryEn: '',
      }));
    }
    setErrors((prev) => ({ ...prev, category: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create product (images already uploaded)
      const result = await httpFetch('/api/product', {
        method: 'POST',
        body: JSON.stringify({
          nameZh: formData.nameZh,
          nameEn: formData.nameEn,
          categoryZh: formData.categoryZh,
          categoryEn: formData.categoryEn,
          descriptionZh: formData.descriptionZh,
          descriptionEn: formData.descriptionEn,
          coverImage: coverImageUrl,
          detailImages: detailImageUrls,
        }),
      });

      if (result.success) {
        // 保存成功后删除标记的图片
        if (imagesToDelete.length > 0) {
          await deleteImages(imagesToDelete);
        }
        alert('产品创建成功');
        router.push('/admin/dashboard');
      } else {
        alert(result.message || '创建失败');
      }
    } catch (error) {
      console.error('创建产品错误:', error);
      alert('创建产品失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">新增产品</h1>
            <p className="mt-1 text-sm text-gray-500">添加新的皮革产品信息</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name (Chinese) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                产品中文名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nameZh"
                value={formData.nameZh}
                onChange={handleInputChange}
                placeholder="请输入产品中文名称"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                  errors.nameZh
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {errors.nameZh && (
                <p className="mt-1 text-sm text-red-500">{errors.nameZh}</p>
              )}
            </div>

            {/* Product Name (English) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                产品英文名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleInputChange}
                placeholder="请输入产品英文名称"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                  errors.nameEn
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {errors.nameEn && (
                <p className="mt-1 text-sm text-red-500">{errors.nameEn}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                产品分类 <span className="text-red-500">*</span>
              </label>
              <select
                value={
                  categories.find(
                    (cat) =>
                      cat.nameZh === formData.categoryZh &&
                      cat.nameEn === formData.categoryEn
                  )?.id || ''
                }
                onChange={handleCategoryChange}
                disabled={categoriesLoading}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white ${
                  errors.category
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300'
                } ${categoriesLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              >
                <option value="">
                  {categoriesLoading ? '加载中...' : '请选择产品分类'}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nameZh}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">{errors.category}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">产品描述</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Description (Chinese) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                中文描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="descriptionZh"
                value={formData.descriptionZh}
                onChange={handleInputChange}
                placeholder="请输入中文描述"
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none ${
                  errors.descriptionZh
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {errors.descriptionZh && (
                <p className="mt-1 text-sm text-red-500">{errors.descriptionZh}</p>
              )}
            </div>

            {/* Description (English) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                英文描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="descriptionEn"
                value={formData.descriptionEn}
                onChange={handleInputChange}
                placeholder="请输入英文描述"
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none ${
                  errors.descriptionEn
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {errors.descriptionEn && (
                <p className="mt-1 text-sm text-red-500">{errors.descriptionEn}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">产品图片</h2>
          <div className="space-y-6">
            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                封面图 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                {coverImagePreview ? (
                  <div className="relative w-32 h-32">
                    <img
                      src={coverImagePreview}
                      alt="封面图预览"
                      className="w-full h-full object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeCoverImage}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">点击上传</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              {errors.coverImage && (
                <p className="mt-1 text-sm text-red-500">{errors.coverImage}</p>
              )}
            </div>

            {/* Detail Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                详情图 <span className="text-red-500">*</span>
                <span className="text-gray-400 font-normal ml-1">(至少1张)</span>
              </label>
              <div className="flex flex-wrap gap-4">
                {detailImagePreviews.map((preview, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <img
                      src={preview}
                      alt={`详情图${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeDetailImage(index)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <Plus className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">添加图片</span>
                  <input
                    ref={detailImagesInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleDetailImagesChange}
                    className="hidden"
                  />
                </label>
              </div>
              {errors.detailImages && (
                <p className="mt-1 text-sm text-red-500">{errors.detailImages}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '保存中...' : '保存'}
          </button>
          <Link
            href="/admin/dashboard"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            取消
          </Link>
        </div>
      </form>
    </div>
  );
}
