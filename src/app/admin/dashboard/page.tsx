'use client';

import { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit, Trash2, Eye, X } from 'lucide-react';
import Link from 'next/link';
import { httpFetch } from '@/lib/fetch';

interface Product {
  id: string;
  nameZh: string;
  nameEn: string;
  categoryZh: string;
  categoryEn: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // 获取产品列表
  const fetchProducts = async (searchKeyword?: string) => {
    try {
      setLoading(true);
      const url = searchKeyword
        ? `/api/product?keyword=${encodeURIComponent(searchKeyword)}`
        : '/api/product';
      const response = await httpFetch(url);
      if (response.success) {
        setProducts(response.data || []);
      }
    } catch (error) {
      console.error('获取产品列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchProducts();
  }, []);

  // 搜索
  const handleSearch = () => {
    fetchProducts(keyword);
  };

  // 回车搜索
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 删除产品
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此产品吗？此操作不可恢复。')) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await httpFetch(`/api/product?id=${id}`, {
        method: 'DELETE',
      });
      if (response.success) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert(response.message || '删除失败');
      }
    } catch (error) {
      console.error('删除产品失败:', error);
      alert('删除失败，请稍后重试');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">产品管理</h1>
          <p className="mt-1 text-sm text-gray-500">管理您的皮革产品信息</p>
        </div>
        <Link
          href="/admin/products/create"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          新增产品
        </Link>
      </div>

      {/* Search and filter bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索产品名称..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <button
            onClick={handleSearch}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
          >
            <Search className="w-4 h-4" />
            搜索
          </button>
        </div>
      </div>

      {/* Product list */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      ) : products.length === 0 ? (
        /* Empty state */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">暂无产品</h3>
            <p className="text-sm text-gray-500 mb-4 text-center">
              您还没有添加任何产品，点击上方按钮添加第一个产品
            </p>
            <Link
              href="/admin/products/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              新增产品
            </Link>
          </div>
        </div>
      ) : (
        /* Product table */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    产品信息
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    分类
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    更新时间
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.coverImage}
                          alt={product.nameZh}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {product.nameZh}
                          </p>
                          <p className="text-xs text-gray-500">{product.nameEn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.categoryZh}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(product.updatedAt).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setDetailProduct(product)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          详情
                        </button>
                        <Link
                          href={`/admin/products/edit/${product.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          编辑
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          {deletingId === product.id ? '删除中...' : '删除'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 详情弹窗 */}
      {detailProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">产品详情</h2>
              <button
                onClick={() => setDetailProduct(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
              <div className="flex flex-col md:flex-row gap-6">
                {/* 产品图片 */}
                <div className="flex-shrink-0">
                  <img
                    src={detailProduct.coverImage}
                    alt={detailProduct.nameZh}
                    className="w-full md:w-64 h-48 object-cover rounded-lg border border-gray-200"
                  />
                </div>

                {/* 产品信息 */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      中文名称
                    </label>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      {detailProduct.nameZh}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      英文名称
                    </label>
                    <p className="mt-1 text-base text-gray-700">
                      {detailProduct.nameEn}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      分类
                    </label>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {detailProduct.categoryZh}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {detailProduct.categoryEn}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        创建时间
                      </label>
                      <p className="mt-1 text-sm text-gray-700">
                        {new Date(detailProduct.createdAt).toLocaleString('zh-CN')}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        更新时间
                      </label>
                      <p className="mt-1 text-sm text-gray-700">
                        {new Date(detailProduct.updatedAt).toLocaleString('zh-CN')}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      产品ID
                    </label>
                    <p className="mt-1 text-sm text-gray-500 font-mono">
                      {detailProduct.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 弹窗底部 */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setDetailProduct(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                关闭
              </button>
              <Link
                href={`/admin/products/edit/${detailProduct.id}`}
                onClick={() => setDetailProduct(null)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                去编辑
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
