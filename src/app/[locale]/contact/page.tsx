import Link from "next/link";
import zhContact from "@/messages/zh/contact.json";
import enContact from "@/messages/en/contact.json";

const contactData: Record<string, typeof zhContact> = {
  zh: zhContact,
  en: enContact,
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  const t = contactData[locale] || contactData.zh;

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Page Header */}
      <div className="bg-[#F0EBE3] border-b border-[#E8E2D9]">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href={`/${locale}`}
              className="text-[#8A8A8A] hover:text-[#C9A87C] transition-colors"
            >
              {t.breadcrumb.home}
            </Link>
            <span className="text-[#C9A87C]">/</span>
            <span className="text-[#2C1810]">{t.breadcrumb.current}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 bg-[#2C1810]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#C9A87C] text-sm tracking-[0.2em] uppercase mb-4">
            {t.hero.subtitle}
          </p>
          <h1 className="text-3xl md:text-5xl font-light text-[#F5F0E8] mb-6 tracking-wide">
            {t.hero.title}
          </h1>
          <div className="w-16 h-[2px] bg-[#C9A87C] mx-auto" />
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 md:py-24 px-4 -mt-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Address Card */}
            <div className="bg-[#FAF8F5] rounded-sm p-8 shadow-sm border border-[#E8E2D9] hover:shadow-md transition-shadow duration-300">
              <div className="w-14 h-14 bg-[#F0EBE3] rounded-sm flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-[#C9A87C]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#2C1810] mb-3">
                {t.contactInfo.address.title}
              </h3>
              <p className="text-[#5A5A5A] leading-relaxed text-sm">
                {t.contactInfo.address.content}
              </p>
            </div>

            {/* Phone Card */}
            <div className="bg-[#FAF8F5] rounded-sm p-8 shadow-sm border border-[#E8E2D9] hover:shadow-md transition-shadow duration-300">
              <div className="w-14 h-14 bg-[#F0EBE3] rounded-sm flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-[#C9A87C]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#2C1810] mb-3">
                {t.contactInfo.phone.title}
              </h3>
              <p className="text-[#2C1810] font-medium text-base mb-1">
                {t.contactInfo.phone.content}
              </p>
              <p className="text-[#8A8A8A] text-sm">{t.contactInfo.phone.subContent}</p>
            </div>

            {/* Email Card */}
            <div className="bg-[#FAF8F5] rounded-sm p-8 shadow-sm border border-[#E8E2D9] hover:shadow-md transition-shadow duration-300">
              <div className="w-14 h-14 bg-[#F0EBE3] rounded-sm flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-[#C9A87C]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#2C1810] mb-3">
                {t.contactInfo.email.title}
              </h3>
              <p className="text-[#2C1810] font-medium text-base mb-1">
                {t.contactInfo.email.content}
              </p>
              <p className="text-[#8A8A8A] text-sm">{t.contactInfo.email.subContent}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-16 md:py-24 px-4 bg-[#F0EBE3]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Left: Text Content */}
            <div className="order-2 md:order-1">
              <p className="text-[#C9A87C] text-sm tracking-[0.2em] uppercase mb-4">
                {t.about.subtitle}
              </p>
              <h2 className="text-2xl md:text-3xl font-light text-[#2C1810] mb-6">
                {t.about.title}
              </h2>
              <div className="w-16 h-[2px] bg-[#C9A87C] mb-6" />
              <p className="text-[#5A5A5A] leading-[1.8] text-base font-light mb-6">
                {t.about.description}
              </p>
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-light text-[#C9A87C] mb-1">{t.about.stats.experience.value}</div>
                  <div className="text-[#7A7A7A] text-sm">
                    {t.about.stats.experience.label}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-[#C9A87C] mb-1">{t.about.stats.countries.value}</div>
                  <div className="text-[#7A7A7A] text-sm">
                    {t.about.stats.countries.label}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-[#C9A87C] mb-1">{t.about.stats.clients.value}</div>
                  <div className="text-[#7A7A7A] text-sm">
                    {t.about.stats.clients.label}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Visual Placeholder */}
            <div className="order-1 md:order-2">
              <div className="relative h-[350px] md:h-[450px] bg-[#E8E2D9] rounded-sm overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3D2914]/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-36 h-36 border-2 border-[#C9A87C]/40 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-[#C9A87C] text-xs tracking-widest">
                        {t.about.visual.logo}
                      </span>
                    </div>
                    <p className="text-[#8A8A8A] text-sm">
                      {t.about.visual.since}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#C9A87C] text-sm tracking-[0.2em] uppercase mb-3">
              {t.businessHours.subtitle}
            </p>
            <h2 className="text-2xl md:text-3xl font-light text-[#2C1810]">
              {t.businessHours.title}
            </h2>
            <div className="w-16 h-[2px] bg-[#C9A87C] mx-auto mt-4" />
          </div>

          <div className="bg-[#FAF8F5] rounded-sm p-8 md:p-12 shadow-sm border border-[#E8E2D9]">
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="text-center sm:text-left">
                <h3 className="text-[#2C1810] font-medium mb-4">
                  {t.businessHours.officeHours.title}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between sm:justify-start sm:gap-8">
                    <span className="text-[#7A7A7A]">{t.businessHours.officeHours.weekdays.day}</span>
                    <span className="text-[#2C1810]">{t.businessHours.officeHours.weekdays.time}</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-8">
                    <span className="text-[#7A7A7A]">{t.businessHours.officeHours.saturday.day}</span>
                    <span className="text-[#2C1810]">{t.businessHours.officeHours.saturday.time}</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-8">
                    <span className="text-[#7A7A7A]">{t.businessHours.officeHours.sunday.day}</span>
                    <span className="text-[#8A8A8A]">{t.businessHours.officeHours.sunday.time}</span>
                  </div>
                </div>
              </div>
              <div className="text-center sm:text-left sm:border-l sm:border-[#E8E2D9] sm:pl-8">
                <h3 className="text-[#2C1810] font-medium mb-4">
                  {t.businessHours.responseTime.title}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between sm:justify-start sm:gap-8">
                    <span className="text-[#7A7A7A]">{t.businessHours.responseTime.inquiry.type}</span>
                    <span className="text-[#2C1810]">{t.businessHours.responseTime.inquiry.time}</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-8">
                    <span className="text-[#7A7A7A]">{t.businessHours.responseTime.sample.type}</span>
                    <span className="text-[#2C1810]">{t.businessHours.responseTime.sample.time}</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-8">
                    <span className="text-[#7A7A7A]">{t.businessHours.responseTime.emergency.type}</span>
                    <span className="text-[#2C1810]">{t.businessHours.responseTime.emergency.time}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 bg-[#2C1810]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-light text-[#F5F0E8] mb-4">
            {t.cta.title}
          </h2>
          <p className="text-[#B8B0A8] text-base mb-8 font-light">
            {t.cta.description}
          </p>
          <a
            href="mailto:sales@leather-trade.com"
            className="inline-block px-12 py-4 bg-[#C9A87C] text-[#2C1810] text-sm tracking-widest hover:bg-[#B8986C] transition-colors duration-300"
          >
            {t.cta.button}
          </a>
        </div>
      </section>
    </div>
  );
}
