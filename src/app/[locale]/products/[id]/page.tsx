import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import InquiryButton from "@/components/products/InquiryButton";
import { Product } from "@/types/product";
import { ApiResponse } from "@/types/api";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

// 品牌词
const BRAND_NAME = "皮革外贸";
const BRAND_NAME_EN = "Leather Trade";

// 获取产品详情数据
async function getProduct(id: string): Promise<Product | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/product?id=${id}`, {
      next: { revalidate: 60 }, // 60秒增量静态再生
    });

    if (!res.ok) {
      return null;
    }

    const json: ApiResponse<Product> = await res.json();
    return json.success ? json.data || null : null;
  } catch {
    return null;
  }
}

// 获取相关产品
async function getRelatedProducts(
  categoryId: string,
  excludeId: string
): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(
      `${baseUrl}/api/product?categoryId=${categoryId}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      return [];
    }

    const json: ApiResponse<Product[]> = await res.json();
    if (json.success && json.data) {
      return json.data
        .filter((p) => p.id !== excludeId)
        .slice(0, 4);
    }
    return [];
  } catch {
    return [];
  }
}

// 生成动态 SEO 元数据
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const isEn = locale === "en";
  const product = await getProduct(id);

  if (!product) {
    return {
      title: isEn ? "Product Not Found" : "产品未找到",
      description: isEn
        ? "The product you are looking for does not exist."
        : "您查找的产品不存在。",
    };
  }

  const title = isEn
    ? `${product.nameEn} - ${BRAND_NAME_EN}`
    : `${product.nameZh} - ${BRAND_NAME}`;

  const description = isEn
    ? product.descriptionEn.slice(0, 160)
    : product.descriptionZh.slice(0, 160);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      locale: isEn ? "en_US" : "zh_CN",
      images: [
        {
          url: product.coverImage,
          width: 1200,
          height: 630,
          alt: isEn ? product.nameEn : product.nameZh,
        },
      ],
      url: `${baseUrl}/${locale}/products/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.coverImage],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/products/${id}`,
      languages: {
        "zh-CN": `${baseUrl}/zh/products/${id}`,
        "en-US": `${baseUrl}/en/products/${id}`,
      },
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const isEn = locale === "en";

  // 产品展示数据
  const displayProduct = {
    id: product.id,
    name: isEn ? product.nameEn : product.nameZh,
    subName: isEn ? product.nameZh : product.nameEn,
    description: isEn ? product.descriptionEn : product.descriptionZh,
    coverImage: product.coverImage,
    images: [product.coverImage, ...product.detailImages],
    category: isEn ? product.categoryEn : product.categoryZh,
    categoryId: product.categoryId,
    specs: [
      {
        label: isEn ? "Category" : "产品分类",
        labelEn: "Category",
        value: isEn ? product.categoryEn : product.categoryZh,
      },
      {
        label: isEn ? "Model" : "产品型号",
        labelEn: "Model",
        value: product.id,
      },
    ],
  };

  // 获取相关产品
  const relatedProducts = await getRelatedProducts(
    product.categoryId,
    product.id
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Breadcrumb */}
      <div className="bg-[#F0EBE3] border-b border-[#E8E2D9]">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href={`/${locale}`}
              className="text-[#8A8A8A] hover:text-[#C9A87C] transition-colors"
            >
              {isEn ? "Home" : "首页"}
            </Link>
            <span className="text-[#C9A87C]">/</span>
            <Link
              href={`/${locale}/products`}
              className="text-[#8A8A8A] hover:text-[#C9A87C] transition-colors"
            >
              {isEn ? "Products" : "产品中心"}
            </Link>
            <span className="text-[#C9A87C]">/</span>
            <span className="text-[#2C1810]">{displayProduct.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16">
            {/* Product Image Gallery - 客户端组件 */}
            <ProductImageGallery
              images={displayProduct.images}
              productName={displayProduct.name}
            />

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <p className="text-[#C9A87C] text-sm tracking-[0.2em] uppercase mb-3">
                {displayProduct.category}
              </p>
              <h1 className="text-3xl md:text-4xl font-light text-[#2C1810] mb-2">
                {displayProduct.name}
              </h1>
              <p className="text-[#8A8A8A] text-sm mb-6">
                {displayProduct.subName}
              </p>

              <div className="w-16 h-[2px] bg-[#C9A87C] mb-6" />

              {/* Product Description */}
              <div
                className="text-[#5A5A5A] leading-[1.8] text-base md:text-lg font-light mb-8"
                dangerouslySetInnerHTML={{ __html: displayProduct.description }}
              />

              {/* Specs */}
              <div className="bg-[#F0EBE3]/50 rounded-sm p-6 mb-8">
                <h3 className="text-lg font-medium text-[#2C1810] mb-4">
                  {isEn ? "Product Information" : "产品信息"}
                </h3>
                <div className="space-y-3">
                  {displayProduct.specs.map((spec, index) => (
                    <div
                      key={index}
                      className="flex justify-between py-2 border-b border-[#E8E2D9] last:border-0"
                    >
                      <span className="text-[#7A7A7A]">{spec.label}</span>
                      <span className="text-[#2C1810] text-right max-w-[60%]">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <InquiryButton
                  productId={product.id}
                  productName={displayProduct.name}
                  isEn={isEn}
                />
                <Link
                  href={`/${locale}/products`}
                  className="px-10 py-4 border border-[#2C1810] text-[#2C1810] text-sm tracking-widest text-center hover:bg-[#2C1810] hover:text-[#FAF8F5] transition-colors duration-300"
                >
                  {isEn ? "Back to Products" : "返回产品列表"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 md:py-24 px-4 bg-[#F0EBE3]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[#C9A87C] text-sm tracking-[0.2em] uppercase mb-3">
                {isEn ? "You May Also Like" : "相关产品推荐"}
              </p>
              <h2 className="text-2xl md:text-3xl font-light text-[#2C1810]">
                {isEn ? "Related Products" : "相关产品"}
              </h2>
              <div className="w-16 h-[2px] bg-[#C9A87C] mx-auto mt-4" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/${locale}/products/${item.id}`}
                  className="group bg-[#FAF8F5] rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="relative h-48 bg-[#E8E2D9] overflow-hidden">
                    <Image
                      src={item.coverImage}
                      alt={isEn ? item.nameEn : item.nameZh}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-medium text-[#2C1810] mb-1 line-clamp-1">
                      {isEn ? item.nameEn : item.nameZh}
                    </h3>
                    <p className="text-[#C9A87C] text-xs tracking-wider line-clamp-1">
                      {isEn ? item.nameZh : item.nameEn}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// 生成静态参数
export function generateStaticParams() {
  // 这里返回一些常见的产品ID用于静态生成
  // 其他ID将在请求时动态生成
  return [
    { locale: "zh", id: "1" },
    { locale: "zh", id: "2" },
    { locale: "zh", id: "3" },
    { locale: "zh", id: "4" },
    { locale: "en", id: "1" },
    { locale: "en", id: "2" },
    { locale: "en", id: "3" },
    { locale: "en", id: "4" },
  ];
}
