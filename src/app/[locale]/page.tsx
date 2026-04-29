import zhHome from "@/messages/zh/home.json";
import enHome from "@/messages/en/home.json";

const homeData: Record<string, typeof zhHome> = {
  zh: zhHome,
  en: enHome,
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const t = homeData[locale] || homeData.zh;

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Banner */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2C1810]/80 via-[#2C1810]/60 to-[#2C1810]/80" />
        <div className="absolute inset-0 bg-[#1A1A1A]">
          <div className="w-full h-full opacity-30 bg-[radial-gradient(circle_at_center,_#3D2914_0%,_#1A1A1A_70%)]" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-[#C9A87C] text-sm md:text-base tracking-[0.3em] mb-6 uppercase">
            {t.hero.tagline}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-[#F5F0E8] mb-6 tracking-wide">
            {t.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-[#C9A87C] font-light mb-8 tracking-wider">
            {t.hero.subtitle}
          </p>
          <p className="text-[#B8B0A8] text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
            {t.hero.description}
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-4 bg-[#C9A87C] text-[#2C1810] text-sm tracking-widest hover:bg-[#B8986C] transition-colors duration-300">
              {t.hero.ctaPrimary}
            </button>
            <button className="px-10 py-4 border border-[#C9A87C] text-[#C9A87C] text-sm tracking-widest hover:bg-[#C9A87C]/10 transition-colors duration-300">
              {t.hero.ctaSecondary}
            </button>
          </div>
        </div>
      </section>

      {/* 公司简介 */}
      <section className="py-20 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="space-y-6">
              <p className="text-[#C9A87C] text-sm tracking-[0.2em] uppercase">
                {t.about.tagline}
              </p>
              <h2 className="text-3xl md:text-4xl font-light text-[#2C1810]">
                {t.about.title}
              </h2>
              <div className="w-16 h-[2px] bg-[#C9A87C]" />
              <p className="text-[#5A5A5A] leading-[1.8] text-base md:text-lg font-light">
                {t.about.description1}
              </p>
              <p className="text-[#5A5A5A] leading-[1.8] text-base md:text-lg font-light">
                {t.about.description2}
              </p>
            </div>
            <div className="relative h-[400px] md:h-[500px] bg-[#E8E2D9] rounded-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3D2914]/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-2 border-[#C9A87C]/30 rounded-full flex items-center justify-center">
                  <span className="text-[#C9A87C] text-xs tracking-widest">
                    {t.about.since}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 产品展示 */}
      <section className="py-20 md:py-32 px-4 bg-[#F0EBE3]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#C9A87C] text-sm tracking-[0.2em] uppercase mb-4">
              {t.products.tagline}
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-[#2C1810] mb-6">
              {t.products.title}
            </h2>
            <div className="w-16 h-[2px] bg-[#C9A87C] mx-auto" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {t.products.items.map((product, index) => (
              <div
                key={index}
                className="group bg-[#FAF8F5] rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative h-64 bg-[#E8E2D9] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 border border-[#C9A87C]/40 rounded-full flex items-center justify-center">
                      <span className="text-[#8A8A8A] text-xs">
                        {product.nameEn.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-[#2C1810] mb-1">
                    {product.name}
                  </h3>
                  <p className="text-[#C9A87C] text-xs tracking-wider mb-3">
                    {product.nameEn}
                  </p>
                  <p className="text-[#7A7A7A] text-sm leading-relaxed font-light">
                    {product.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-10 py-4 border border-[#2C1810] text-[#2C1810] text-sm tracking-widest hover:bg-[#2C1810] hover:text-[#FAF8F5] transition-colors duration-300">
              {t.products.viewAll}
            </button>
          </div>
        </div>
      </section>

      {/* 公司优势 */}
      <section className="py-20 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#C9A87C] text-sm tracking-[0.2em] uppercase mb-4">
              {t.advantages.tagline}
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-[#2C1810] mb-6">
              {t.advantages.title}
            </h2>
            <div className="w-16 h-[2px] bg-[#C9A87C] mx-auto" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.advantages.items.map((item, index) => (
              <div
                key={index}
                className="text-center p-8 bg-[#F0EBE3]/50 rounded-sm hover:bg-[#F0EBE3] transition-colors duration-300"
              >
                <div className="text-4xl md:text-5xl font-light text-[#C9A87C] mb-2">
                  {item.number}
                </div>
                <p className="text-[#2C1810] font-medium mb-2">{item.title}</p>
                <p className="text-[#7A7A7A] text-sm font-light">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 px-4 bg-[#2C1810]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-light text-[#F5F0E8] mb-6">
            {t.cta.title}
          </h2>
          <p className="text-[#B8B0A8] text-base md:text-lg mb-10 font-light">
            {t.cta.description}
          </p>
          <button className="px-12 py-4 bg-[#C9A87C] text-[#2C1810] text-sm tracking-widest hover:bg-[#B8986C] transition-colors duration-300">
            {t.cta.button}
          </button>
        </div>
      </section>
    </div>
  );
}
