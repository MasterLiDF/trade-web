import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export async function generateStaticParams() {
  return [{ locale: "zh" }, { locale: "en" }];
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
