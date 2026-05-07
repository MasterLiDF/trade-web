import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import FilterButtons from "./FilterButtons";

interface CategoryData {
  id: string;
  nameZh: string;
  nameEn: string;
}

interface ProductData {
  id: string;
  nameZh: string;
  nameEn: string;
  categoryId: string;
  categoryZh: string;
  categoryEn: string;
  descriptionZh: string;
  descriptionEn: string;
  coverImage: string;
  createdAt: Date;
}

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getCategories(): Promise<CategoryData[]> {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ createdAt: -1 }).lean();
    return categories.map((cat: { _id: { toString: () => string }; nameZh: string; nameEn: string }) => ({
      id: cat._id.toString(),
      nameZh: cat.nameZh,
      nameEn: cat.nameEn,
    }));
  } catch (error) {
    console.error("获取分类失败:", error);
    return [];
  }
}

async function getProducts(categoryId?: string): Promise<ProductData[]> {
  try {
    await connectDB();
    const query: Record<string, unknown> = {};
    if (categoryId && categoryId !== "all") {
      query.categoryId = categoryId;
    }
    const products = await Product.find(query).sort({ createdAt: -1 }).lean();
    return products.map((prod: { _id: { toString: () => string }; nameZh: string; nameEn: string; categoryId: string; categoryZh: string; categoryEn: string; descriptionZh: string; descriptionEn: string; coverImage: string; createdAt: Date }) => ({
      id: prod._id.toString(),
      nameZh: prod.nameZh,
      nameEn: prod.nameEn,
      categoryId: prod.categoryId,
      categoryZh: prod.categoryZh,
      categoryEn: prod.categoryEn,
      descriptionZh: prod.descriptionZh,
      descriptionEn: prod.descriptionEn,
      coverImage: prod.coverImage,
      createdAt: prod.createdAt,
    }));
  } catch (error) {
    console.error("获取产品失败:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const search = await searchParams;
  const categoryId = typeof search.categoryId === "string" ? search.categoryId : undefined;

  if (locale !== "zh" && locale !== "en") {
    notFound();
  }

  const isEn = locale === "en";

  let title: string;
  let description: string;
  let categoryName = "";

  if (categoryId && categoryId !== "all") {
    try {
      await connectDB();
      const category = await Category.findById(categoryId).lean();
      if (category) {
        categoryName = isEn ? (category as { nameEn: string }).nameEn : (category as { nameZh: string }).nameZh;
      }
    } catch {
      // 忽略错误，使用默认标题
    }
  }

  if (isEn) {
    if (categoryName) {
      title = `${categoryName} | Products | Leather Trade`;
      description = `Browse our premium ${categoryName.toLowerCase()} leather products. High-quality leather materials and customized solutions for global customers.`;
    } else {
      title = "Products | Leather Trade - Premium Leather Products Supplier";
      description = "Explore our complete collection of premium leather products. High-quality leather materials and customized solutions for global customers.";
    }
  } else {
    if (categoryName) {
      title = `${categoryName} | 产品中心 | 皮革外贸`;
      description = `浏览我们的精品${categoryName}皮革产品。为全球客户提供优质的皮革原料及成品定制服务。`;
    } else {
      title = "产品中心 | 皮革外贸 - 高端皮革制品供应商";
      description = "探索我们的全系列精品皮革产品。为全球客户提供优质的皮革原料及成品定制服务。";
    }
  }

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/products${categoryId && categoryId !== "all" ? `?categoryId=${categoryId}` : ""}`,
      languages: {
        "zh": "/zh/products",
        "en": "/en/products",
      },
    },
    openGraph: {
      title,
      description,
      locale: isEn ? "en_US" : "zh_CN",
    },
  };
}

export default async function ProductsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const search = await searchParams;
  const categoryId = typeof search.categoryId === "string" ? search.categoryId : "all";

  if (locale !== "zh" && locale !== "en") {
    notFound();
  }

  const isEn = locale === "en";

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(categoryId),
  ]);

  const pageTitle = isEn ? "Products" : "产品中心";
  const pageSubtitle = isEn ? "Premium Leather Collection" : "精品皮革系列";
  const allText = isEn ? "All" : "全部";
  const noProductsText = isEn ? "No products found" : "暂无产品";
  const ctaTitle = isEn ? "Need Custom Leather Products?" : "需要定制皮革产品？";
  const ctaSubtitle = isEn
    ? "Contact us for bulk orders and customized solutions"
    : "联系我们获取批量采购和定制方案";
  const ctaButton = isEn ? "Contact Us" : "联系我们";

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header Banner */}
      <section className="relative py-20 md:py-28 px-4 bg-[#2C1810]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[#C9A87C] text-sm tracking-[0.3em] uppercase mb-4">
            {isEn ? "Our Products" : "我们的产品"}
          </p>
          <h1 className="text-3xl md:text-5xl font-light text-[#F5F0E8] mb-4 tracking-wide">
            {pageTitle}
          </h1>
          <p className="text-[#B8B0A8] text-base md:text-lg font-light tracking-wider">
            {pageSubtitle}
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 md:py-12 px-4 bg-[#F0EBE3] border-b border-[#E8E2D9]">
        <div className="max-w-6xl mx-auto">
          <FilterButtons
            locale={locale}
            categories={categories}
            selectedCategory={categoryId}
            allText={allText}
          />
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#8A8A8A] text-sm tracking-wider">
                {noProductsText}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/${locale}/products/${product.id}`}
                  className="group bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {/* Cover Image */}
                  <div className="relative h-56 md:h-64 bg-[#E8E2D9] overflow-hidden">
                    {product.coverImage ? (
                      <Image
                        src={product.coverImage}
                        alt={isEn ? product.nameEn : product.nameZh}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 border border-[#C9A87C]/40 rounded-full flex items-center justify-center">
                          <span className="text-[#8A8A8A] text-xs">
                            {(isEn ? product.nameEn : product.nameZh).slice(0, 8)}
                            ...
                          </span>
                        </div>
                      </div>
                    )}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Product Info */}
                  <div className="p-5 md:p-6">
                    <p className="text-[#C9A87C] text-xs tracking-wider mb-2">
                      {isEn ? product.categoryEn : product.categoryZh}
                    </p>
                    <h3 className="text-base md:text-lg font-medium text-[#2C1810] mb-2 line-clamp-1">
                      {isEn ? product.nameEn : product.nameZh}
                    </h3>
                    <p className="text-[#7A7A7A] text-sm leading-relaxed font-light line-clamp-2">
                      {(isEn
                        ? product.descriptionEn
                        : product.descriptionZh
                      ).slice(0, 60)}
                      ...
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-24 px-4 bg-[#2C1810]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-light text-[#F5F0E8] mb-4">
            {ctaTitle}
          </h2>
          <p className="text-[#B8B0A8] text-sm md:text-base mb-8 font-light">
            {ctaSubtitle}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-block px-10 py-3.5 bg-[#C9A87C] text-[#2C1810] text-sm tracking-widest hover:bg-[#B8986C] transition-colors duration-300"
          >
            {ctaButton}
          </Link>
        </div>
      </section>
    </div>
  );
}
