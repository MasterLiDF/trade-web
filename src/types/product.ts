// 产品数据模型类型（来自数据库）
export interface Product {
  id: string;
  nameZh: string;
  nameEn: string;
  categoryId: string;
  categoryZh: string;
  categoryEn: string;
  descriptionZh: string;
  descriptionEn: string;
  coverImage: string;
  detailImages: string[];
  createdAt: string;
  updatedAt: string;
}

// 产品规格类型
export interface ProductSpec {
  label: string;
  labelEn: string;
  value: string;
}

// 用于页面展示的产品数据
export interface ProductDisplay {
  id: string;
  name: string;
  subName: string;
  description: string;
  coverImage: string;
  images: string[];
  specs: ProductSpec[];
  category: string;
}
