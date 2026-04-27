"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

interface LanguageSwitcherProps {
  currentLang: "zh" | "en";
  mobile?: boolean;
}

export default function LanguageSwitcher({
  currentLang,
  mobile = false,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  // 获取切换语言后的路径
  const getTargetPath = (targetLang: "zh" | "en") => {
    // 移除当前语言前缀（匹配 /zh, /en 等）
    const pathWithoutLang = pathname.replace(/^\/[^\/]+/, "");
    // 构建新路径
    return `/${targetLang}${pathWithoutLang || ""}`;
  };

  if (mobile) {
    return (
      <div className="flex items-center justify-center space-x-6 py-2">
        <Link
          href={getTargetPath("zh")}
          className={`text-sm font-medium transition-colors duration-300 ${
            currentLang === "zh"
              ? "text-[#8B6914]"
              : "text-[#8A8A8A] hover:text-[#4A4A4A]"
          }`}
        >
          中文
        </Link>
        <span className="text-[#E8E4DE]">|</span>
        <Link
          href={getTargetPath("en")}
          className={`text-sm font-medium transition-colors duration-300 ${
            currentLang === "en"
              ? "text-[#8B6914]"
              : "text-[#8A8A8A] hover:text-[#4A4A4A]"
          }`}
        >
          English
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1 bg-[#F5F2ED] rounded-full p-1">
      <Link
        href={getTargetPath("zh")}
        className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-300 ${
          currentLang === "zh"
            ? "bg-[#2C1810] text-[#C9A961]"
            : "text-[#8A8A8A] hover:text-[#4A4A4A]"
        }`}
      >
        中文
      </Link>
      <Link
        href={getTargetPath("en")}
        className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-300 ${
          currentLang === "en"
            ? "bg-[#2C1810] text-[#C9A961]"
            : "text-[#8A8A8A] hover:text-[#4A4A4A]"
        }`}
      >
        EN
      </Link>
    </div>
  );
}
