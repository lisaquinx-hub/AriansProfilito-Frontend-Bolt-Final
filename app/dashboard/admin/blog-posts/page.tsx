'use client';

import { useEffect, useState } from 'react';
import { FileText, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, ConfirmDialog } from '@/components/admin/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { adminBlogPostsService } from '@/services/admin/BlogPostsService';
import { BlogPost } from '@/types/api';

export default function AdminBlogPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);
    const data = await adminBlogPostsService.getAll();
    setPosts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await adminBlogPostsService.delete(deleteId);
      setPosts(posts.filter(p => p.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
    setIsDeleting(false);
  };

  const columns = [
    { key: 'title', label: 'عنوان' },
    {
      key: 'categoryName',
      label: 'دسته‌بندی',
      render: (post: BlogPost) => post.categoryName || '-',
    },
    {
      key: 'isPublished',
      label: 'وضعیت',
      render: (post: BlogPost) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          post.isPublished ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
        }`}>
          {post.isPublished ? 'منتشر شده' : 'پیش‌نویس'}
        </span>
      ),
    },
    {
      key: 'views',
      label: 'بازدید',
      render: (post: BlogPost) => post.views || 0,
    },
    {
      key: 'createdAt',
      label: 'تاریخ',
      render: (post: BlogPost) => post.createdAt ? new Date(post.createdAt).toLocaleDateString('fa-IR') : '-',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" />
            مدیریت مقالات
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {posts.length} مقاله
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchPosts}>
            <RefreshCw className="w-4 h-4 ml-1" />
            بروزرسانی
          </Button>
        </div>
      </div>

      <Card className="glass">
        <CardContent className="p-6">
          <DataTable
            data={posts}
            columns={columns}
            loading={isLoading}
            onEdit={() => {}}
            onDelete={(post) => setDeleteId(post.id)}
            emptyMessage="مقاله‌ای یافت نشد"
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف مقاله"
        description="آیا از حذف این مقاله اطمینان دارید؟"
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </div>
  );
}
