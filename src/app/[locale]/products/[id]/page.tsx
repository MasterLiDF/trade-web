import Link from "next/link";
import { notFound } from "next/navigation";
import { productsData } from "@/data/products";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const product = productsData[id];

  if (!product) {
    notFound();
  }

  const isEn = locale === "en";

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
            <span className="text-[#2C1810]">
              {isEn ? product.nameEn : product.nameZh}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-[4/5] bg-[#E8E2D9] rounded-sm overflow-hidden shadow-sm">
                {/* Placeholder for product image */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#3D2914]/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 border-2 border-[#C9A87C]/40 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-[#C9A87C] text-xs tracking-widest">
                        PREMIUM
                      </span>
                    </div>
                    <p className="text-[#8A8A8A] text-sm">
                      {isEn ? product.nameEn : product.nameZh}
                    </p>
                  </div>
                </div>
              </div>
              {/* Thumbnail indicators */}
              <div className="flex gap-2 mt-4 justify-center">
                <div className="w-12 h-12 bg-[#C9A87C] rounded-sm" />
                <div className="w-12 h-12 bg-[#D4C8B8] rounded-sm" />
                <div className="w-12 h-12 bg-[#E8E2D9] rounded-sm" />
                <div className="w-12 h-12 bg-[#F0EBE3] rounded-sm" />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <p className="text-[#C9A87C] text-sm tracking-[0.2em] uppercase mb-3">
                PREMIUM LEATHER
              </p>
              <h1 className="text-3xl md:text-4xl font-light text-[#2C1810] mb-2">
                {isEn ? product.nameEn : product.nameZh}
              </h1>
              <p className="text-[#8A8A8A] text-sm mb-6">
                {isEn ? product.nameZh : product.nameEn}
              </p>

              <div className="w-16 h-[2px] bg-[#C9A87C] mb-6" />

              <p className="text-[#5A5A5A] leading-[1.8] text-base md:text-lg font-light mb-8">
                {product.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-3 mb-8">
                {product.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-[#F0EBE3] text-[#2C1810] text-sm rounded-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Specs */}
              <div className="bg-[#F0EBE3]/50 rounded-sm p-6 mb-8">
                <h3 className="text-lg font-medium text-[#2C1810] mb-4">
                  {isEn ? "Specifications" : "产品参数"}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-[#E8E2D9]">
                    <span className="text-[#7A7A7A]">
                      {isEn ? "Material" : "材质"}
                    </span>
                    <span className="text-[#2C1810]">
                      {product.specs.material}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#E8E2D9]">
                    <span className="text-[#7A7A7A]">
                      {isEn ? "Thickness" : "厚度"}
                    </span>
                    <span className="text-[#2C1810]">
                      {product.specs.thickness}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-[#7A7A7A]">
                      {isEn ? "Recommended Usage" : "推荐用途"}
                    </span>
                    <span className="text-[#2C1810] text-right max-w-[60%]">
                      {product.specs.usage}
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-10 py-4 bg-[#C9A87C] text-[#2C1810] text-sm tracking-widest hover:bg-[#B8986C] transition-colors duration-300">
                  {isEn ? "Inquiry Now" : "立即询盘"}
                </button>
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
            {Object.values(productsData)
              .filter((p) => p.id !== id)
              .slice(0, 4)
              .map((item) => (
                <Link
                  key={item.id}
                  href={`/${locale}/products/${item.id}`}
                  className="group bg-[#FAF8F5] rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="relative h-48 bg-[#E8E2D9] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 border border-[#C9A87C]/40 rounded-full flex items-center justify-center">
                        <span className="text-[#8A8A8A] text-xs">
                          {item.nameEn.slice(0, 6)}...
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-medium text-[#2C1810] mb-1">
                      {isEn ? item.nameEn : item.nameZh}
                    </h3>
                    <p className="text-[#C9A87C] text-xs tracking-wider">
                      {isEn ? item.nameZh : item.nameEn}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// 生成静态参数
export function generateStaticParams() {
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
