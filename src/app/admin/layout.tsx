import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "管理后台 - 皮革外贸",
  description: "皮革外贸网站管理后台",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
}
