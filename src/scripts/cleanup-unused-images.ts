import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { DB_CONFIG } from '@/config';

// 配置
const { MONGODB_URI } = DB_CONFIG;
const UPLOADS_DIR = path.join(process.cwd(), 'public/uploads');

if (!MONGODB_URI) {
  console.error('错误: 请设置环境变量 MONGODB_URI');
  console.error('示例: set MONGODB_URI=mongodb://localhost:27017/trade_web && npx tsx src/scripts/cleanup-unused-images.ts');
  process.exit(1);
}

// 定义 Product Schema（简化版，仅用于查询图片字段）
const ProductSchema = new mongoose.Schema(
  {
    coverImage: String,
    detailImages: [String],
  },
  { collection: 'products' }
);

const Product = mongoose.model('Product', ProductSchema);

/**
 * 从图片URL中提取文件名
 * @param imagePath - 图片路径，如 "/uploads/xxx.jpg"
 * @returns 文件名
 */
function extractFilename(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;
  const parts = imagePath.split('/');
  return parts[parts.length - 1];
}

/**
 * 获取数据库中所有被使用的图片文件名集合
 */
async function getUsedImages(): Promise<Set<string>> {
  const products = await Product.find({}, { coverImage: 1, detailImages: 1 }).lean();

  const usedImages = new Set<string>();

  for (const product of products) {
    // 封面图
    const coverFilename = extractFilename(product.coverImage as string);
    if (coverFilename) {
      usedImages.add(coverFilename);
    }

    // 详情图
    if (Array.isArray(product.detailImages)) {
      for (const img of product.detailImages) {
        const filename = extractFilename(img as string);
        if (filename) {
          usedImages.add(filename);
        }
      }
    }
  }

  return usedImages;
}

/**
 * 获取 uploads 目录下的所有文件
 */
function getUploadFiles(): string[] {
  if (!fs.existsSync(UPLOADS_DIR)) {
    console.log(`目录不存在: ${UPLOADS_DIR}`);
    return [];
  }

  return fs.readdirSync(UPLOADS_DIR).filter((file) => {
    const filePath = path.join(UPLOADS_DIR, file);
    return fs.statSync(filePath).isFile();
  });
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('正在连接数据库...');
    await mongoose.connect(MONGODB_URI);
    console.log('数据库连接成功');

    console.log('\n正在获取产品使用的图片...');
    const usedImages = await getUsedImages();
    console.log(`数据库中共有 ${usedImages.size} 张被使用的图片`);

    console.log('\n正在扫描上传目录...');
    const uploadFiles = getUploadFiles();
    console.log(`uploads 目录共有 ${uploadFiles.length} 个文件`);

    console.log('\n正在比对...');
    const unusedFiles = uploadFiles.filter((file) => !usedImages.has(file));

    if (unusedFiles.length === 0) {
      console.log('✓ 没有发现未使用的图片文件');
    } else {
      console.log(`\n发现 ${unusedFiles.length} 个未使用的图片文件:`);
      unusedFiles.forEach((file) => {
        const filePath = path.join(UPLOADS_DIR, file);
        const stats = fs.statSync(filePath);
        console.log(`  - ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
      });

      // 计算可释放空间
      const totalSize = unusedFiles.reduce((sum, file) => {
        const filePath = path.join(UPLOADS_DIR, file);
        return sum + fs.statSync(filePath).size;
      }, 0);
      console.log(`\n可释放空间: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

      // 删除未使用的文件
      console.log('\n正在删除未使用的图片...');
      let deletedCount = 0;
      for (const file of unusedFiles) {
        const filePath = path.join(UPLOADS_DIR, file);
        try {
          fs.unlinkSync(filePath);
          console.log(`  ✓ 已删除: ${file}`);
          deletedCount++;
        } catch (err) {
          console.error(`  ✗ 删除失败: ${file}`, (err as Error).message);
        }
      }
      console.log(`\n✓ 清理完成，共删除 ${deletedCount} 个文件`);
    }

    await mongoose.disconnect();
    console.log('\n数据库连接已关闭');
  } catch (error) {
    console.error('执行出错:', (error as Error).message);
    process.exit(1);
  }
}

// 支持 --dry-run 参数预览而不删除
const isDryRun = process.argv.includes('--dry-run');

if (isDryRun) {
  console.log('【预览模式】不会实际删除文件\n');
  // 重写删除逻辑为仅显示
  const originalUnlinkSync = fs.unlinkSync;
  fs.unlinkSync = (filepath: string) => {
    console.log(`  [预览] 将删除: ${path.basename(filepath)}`);
  };
}

main();
