import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import zhMessages from "@/messages/zh/common.json";
import enMessages from "@/messages/en/common.json";

const messages = {
  zh: zhMessages,
  en: enMessages,
};

export async function generateStaticParams() {
  return [{ locale: "zh" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "zh" | "en" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = messages[locale];

  return {
    title: t.metadata.title,
    description: t.metadata.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: "zh" | "en" }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Navbar lang={locale} />
      <main className="flex-1">{children}</main>
      <Footer lang={locale} />
    </>
  );
}
