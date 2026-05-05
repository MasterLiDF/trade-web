import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  nameZh: string;
  nameEn: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    nameZh: {
      type: String,
      required: [true, '中文分类名称不能为空'],
      unique: true,
      trim: true,
      maxlength: [50, '分类名称最多50个字符'],
    },
    nameEn: {
      type: String,
      required: [true, '英文分类名称不能为空'],
      unique: true,
      trim: true,
      maxlength: [100, '英文分类名称最多100个字符'],
    },
  },
  {
    timestamps: true,
    collection: 'categories',
  }
);

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
