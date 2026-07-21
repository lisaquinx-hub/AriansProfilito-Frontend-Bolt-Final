'use client';

import AdminLayout from '@/components/admin/AdminSidebar';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
