'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import AdminLayout from '@/components/admin/AdminSidebar';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AdminLayout>{children}</AdminLayout>
    </AuthGuard>
  );
}
