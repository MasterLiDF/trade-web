"use client";

import Link from "next/link";

interface Category {
  id: string;
  nameZh: string;
  nameEn: string;
}

interface FilterButtonsProps {
  locale: string;
  categories: Category[];
  selectedCategory: string;
  allText: string;
}

export default function FilterButtons({
  locale,
  categories,
  selectedCategory,
  allText,
}: FilterButtonsProps) {
  const buildUrl = (categoryId: string) => {
    if (categoryId === "all") {
      return `/${locale}/products`;
    }
    return `/${locale}/products?categoryId=${categoryId}`;
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-4">
      <Link
        href={buildUrl("all")}
        className={`px-6 py-2.5 text-sm tracking-wider transition-all duration-300 ${
          selectedCategory === "all" || !selectedCategory
            ? "bg-[#2C1810] text-[#F5F0E8]"
            : "bg-transparent text-[#5A5A5A] hover:text-[#2C1810] border border-[#C9A87C]/30 hover:border-[#C9A87C]"
        }`}
      >
        {allText}
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={buildUrl(category.id)}
          className={`px-6 py-2.5 text-sm tracking-wider transition-all duration-300 ${
            selectedCategory === category.id
              ? "bg-[#2C1810] text-[#F5F0E8]"
              : "bg-transparent text-[#5A5A5A] hover:text-[#2C1810] border border-[#C9A87C]/30 hover:border-[#C9A87C]"
          }`}
        >
          {locale === "en" ? category.nameEn : category.nameZh}
        </Link>
      ))}
    </div>
  );
}
