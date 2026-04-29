"use client";

import Link from "next/link";
import zhFooter from "@/messages/zh/footer.json";
import enFooter from "@/messages/en/footer.json";

const footerData: Record<string, typeof zhFooter> = {
  zh: zhFooter,
  en: enFooter,
};

interface FooterProps {
  lang?: "zh" | "en";
}

export default function Footer({ lang = "zh" }: FooterProps) {
  const t = footerData[lang] || footerData.zh;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2C1810] text-[#FAF8F5]">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-[#C9A961] rounded-sm flex items-center justify-center">
                <span className="text-[#2C1810] font-bold text-xl">L</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[#FAF8F5] font-semibold text-xl tracking-wide">
                  {t.company}
                </span>
                <span className="text-[#C9A961] text-xs tracking-widest">
                  {t.tagline}
                </span>
              </div>
            </div>
            <p className="text-[#B8B0A8] text-sm leading-relaxed max-w-md">
              {t.description}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-[#FAF8F5] font-semibold text-sm tracking-wider uppercase mb-6">
              {t.navigation}
            </h3>
            <ul className="space-y-4">
              {t.navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={`/${lang}${item.href === "/" ? "" : item.href}`}
                    className="text-[#B8B0A8] text-sm hover:text-[#C9A961] transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-[#FAF8F5] font-semibold text-sm tracking-wider uppercase mb-6">
              {t.contact}
            </h3>
            <ul className="space-y-4 text-[#B8B0A8] text-sm">
              <li className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-[#C9A961] mt-0.5 flex-shrink-0"
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
                <span className="leading-relaxed">{t.address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-[#C9A961] flex-shrink-0"
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
                <span>{t.phone}</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-[#C9A961] flex-shrink-0"
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
                <span>{t.email}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#3D2418]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-[#8A8A8A] text-xs text-center md:text-left">
              {t.copyright.replace("2024", currentYear.toString())}
            </p>
            {lang === "zh" && t.icp && (
              <p className="text-[#8A8A8A] text-xs">{t.icp}</p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
