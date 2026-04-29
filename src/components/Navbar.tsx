"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import zhNavbar from "@/messages/zh/navbar.json";
import enNavbar from "@/messages/en/navbar.json";

const navbarData: Record<string, typeof zhNavbar> = {
  zh: zhNavbar,
  en: enNavbar,
};

interface NavbarProps {
  lang?: "zh" | "en";
}

export default function Navbar({ lang = "zh" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = navbarData[lang] || navbarData.zh;

  const navItems = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.products, href: "/products" },
    { label: t.nav.contact, href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === `/${lang}` || pathname === `/${lang}/` || pathname === "/";
    }
    return pathname.startsWith(`/${lang}${href}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-[#E8E4DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href={`/${lang}`}
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 bg-[#2C1810] rounded-sm flex items-center justify-center">
              <span className="text-[#C9A961] font-bold text-lg">L</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[#2C1810] font-semibold text-lg tracking-wide group-hover:text-[#8B6914] transition-colors duration-300">
                {t.siteName}
              </span>
              <span className="text-[#8A8A8A] text-xs tracking-widest uppercase">
                {t.siteTagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${lang}${item.href === "/" ? "" : item.href}`}
                className={`text-sm font-medium tracking-wide transition-colors duration-300 ${
                  isActive(item.href)
                    ? "text-[#8B6914]"
                    : "text-[#4A4A4A] hover:text-[#8B6914]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Section: Language Switcher */}
          <div className="hidden md:flex items-center">
            <LanguageSwitcher currentLang={lang} />
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-[#4A4A4A] hover:text-[#2C1810] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 bg-current transition-transform duration-300 origin-center ${
                  mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-current transition-opacity duration-300 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-current transition-transform duration-300 origin-center ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden border-t border-[#E8E4DE] bg-[#FAF8F5] overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={`/${lang}${item.href === "/" ? "" : item.href}`}
              className={`block px-4 py-3 text-sm font-medium tracking-wide rounded-sm transition-colors duration-300 ${
                isActive(item.href)
                  ? "text-[#8B6914] bg-[#F5F2ED]"
                  : "text-[#4A4A4A] hover:text-[#8B6914] hover:bg-[#F5F2ED]"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t border-[#E8E4DE]">
            <LanguageSwitcher currentLang={lang} mobile />
          </div>
        </nav>
      </div>
    </header>
  );
}
