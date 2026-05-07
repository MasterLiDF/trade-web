import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  nameZh: string;
  nameEn: string;
  categoryId: string;
  categoryZh: string;
  categoryEn: string;
  descriptionZh: string;
  descriptionEn: string;
  coverImage: string;
  detailImages: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    nameZh: {
      type: String,
      required: [true, '产品中文名称不能为空'],
      trim: true,
      maxlength: [100, '产品名称最多100个字符'],
    },
    nameEn: {
      type: String,
      required: [true, '产品英文名称不能为空'],
      trim: true,
      maxlength: [200, '英文产品名称最多200个字符'],
    },
    categoryId: {
      type: String,
      required: [true, '产品分类ID不能为空'],
      trim: true,
      index: true,
    },
    categoryZh: {
      type: String,
      required: [true, '产品中文分类不能为空'],
      trim: true,
      maxlength: [50, '分类名称最多50个字符'],
    },
    categoryEn: {
      type: String,
      required: [true, '产品英文分类不能为空'],
      trim: true,
      maxlength: [100, '英文分类名称最多100个字符'],
    },
    descriptionZh: {
      type: String,
      required: [true, '产品中文描述不能为空'],
      trim: true,
      maxlength: [2000, '产品描述最多2000个字符'],
    },
    descriptionEn: {
      type: String,
      required: [true, '产品英文描述不能为空'],
      trim: true,
      maxlength: [4000, '英文产品描述最多4000个字符'],
    },
    coverImage: {
      type: String,
      required: [true, '产品封面图不能为空'],
      trim: true,
    },
    detailImages: {
      type: [String],
      required: [true, '产品详情图不能为空'],
      validate: {
        validator: function (images: string[]) {
          return images.length > 0;
        },
        message: '至少需要上传1张详情图',
      },
    },
  },
  {
    timestamps: true,
    collection: 'products',
  }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
