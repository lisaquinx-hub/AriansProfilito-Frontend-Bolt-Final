'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/shared';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Clock, Tag, TrendingUp, Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { blogPostService } from '@/services/BlogPostService';
import { commentsService } from '@/services/CommentsService';
import { BlogPost, Comment as CommentType } from '@/types/api';

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const slug = (Array.isArray(params?.slug) ? params.slug[0] : params?.slug) as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [commentForm, setCommentForm] = useState({ fullName: '', email: '', message: '' });

  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      setIsLoading(true);
      const postData = await blogPostService.getBySlug(slug);
      if (postData) {
        setPost(postData);
        const commentsData = await commentsService.getApprovedByBlogPostId(postData.id);
        setComments(commentsData);
      } else {
        setNotFoundState(true);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [slug]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    setIsSubmitting(true);
    setCommentError(null);
    setCommentSuccess(false);
    try {
      await commentsService.create({
        blogPostId: post.id,
        fullName: commentForm.fullName,
        email: commentForm.email,
        message: commentForm.message,
      });
      setCommentForm({ fullName: '', email: '', message: '' });
      setCommentSuccess(true);
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : 'خطا در ثبت نظر');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen pt-24 pb-16 relative overflow-x-hidden">
        <Navbar />
        <div className="container mx-auto px-6 relative">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/2 mb-4" />
            <div className="h-4 bg-muted rounded w-1/3 mb-8" />
            <div className="aspect-video bg-muted rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  if (notFoundState || !post) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-24 pb-16 relative overflow-x-hidden">
      <Navbar />
      <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-sky-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        <PageHeader
          title={post!.title}
          subtitle={post!.excerpt || ''}
          breadcrumbs={[
            { label: 'خانه', href: '/' },
            { label: 'وبلاگ', href: '/blog' },
            { label: post!.title },
          ]}
        />

        <div className="grid lg:grid-cols-4 gap-8">
          <article className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8"
            >
              {post!.authorName && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-500/20 flex items-center justify-center font-bold">
                    {post!.authorName[0] || 'ن'}
                  </div>
                  <span className="font-medium text-foreground">{post!.authorName}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post!.readTime || 5} دقیقه</span>
              </div>
              {post!.publishedAt && (
                <div className="text-sm">
                  {new Date(post!.publishedAt).toLocaleDateString('fa-IR')}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video rounded-2xl overflow-hidden glass p-2 mb-12"
            >
              <div className="relative aspect-video rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-blue-500/20 dark:to-cyan-500/20 flex items-center justify-center">
                <span className="text-8xl md:text-[120px] font-bold text-foreground/5">
                  {post!.title[0]}
                </span>
              </div>
              {post!.categoryName && (
                <div className="absolute top-6 right-6">
                  <span className="px-4 py-2 rounded-full text-sm font-medium glass">
                    {post!.categoryName}
                  </span>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-8 md:p-12 mb-8"
            >
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {post!.content || post!.excerpt || ''}
                </div>
              </div>
            </motion.div>

            {post!.keywords && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 mb-8 flex-wrap"
              >
                <Tag className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                {post!.keywords.split(',').map((tag, index) => (
                  <span key={index} className="px-3 py-1 rounded-full text-sm glass text-muted-foreground">
                    {tag.trim()}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Comments section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-2xl p-8 mb-8"
            >
              <h2 className="text-xl font-bold mb-6">نظرات ({comments.length})</h2>

              {/* Comment form */}
              <form onSubmit={handleCommentSubmit} className="space-y-4 mb-8">
                {commentSuccess && (
                  <div className="bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
                    نظر شما ثبت شد و پس از تأیید نمایش داده می‌شود.
                  </div>
                )}
                {commentError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                    {commentError}
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">نام و نام خانوادگی</Label>
                    <Input
                      id="fullName"
                      value={commentForm.fullName}
                      onChange={(e) => setCommentForm({ ...commentForm, fullName: e.target.value })}
                      required
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">ایمیل</Label>
                    <Input
                      id="email"
                      type="email"
                      value={commentForm.email}
                      onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                      required
                      className="bg-muted/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">پیام</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    value={commentForm.message}
                    onChange={(e) => setCommentForm({ ...commentForm, message: e.target.value })}
                    required
                    className="bg-muted/50"
                  />
                </div>
                <Button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? (
                    <span className="animate-pulse">در حال ثبت...</span>
                  ) : (
                    <>ثبت نظر<Send className="mr-2 h-4 w-4" /></>
                  )}
                </Button>
              </form>

              {/* Comments list */}
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-4 rounded-xl bg-muted/30">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-500/20 flex items-center justify-center text-sm font-bold">
                          {comment.fullName[0]}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{comment.fullName}</div>
                          <div className="text-xs text-muted-foreground">
                            {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('fa-IR') : '-'}
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm pr-11">{comment.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  نظری وجود ندارد. اولین ثبت‌کننده نظر باشید.
                </p>
              )}
            </motion.div>

            <div className="mt-8">
              <Button asChild variant="outline" className="rounded-full gap-2">
                <Link href="/blog">
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                  بازگشت به وبلاگ
                </Link>
              </Button>
            </div>
          </article>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="glass rounded-2xl p-6 sticky top-28">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-sky-500" />
                <h3 className="text-lg font-semibold">اطلاعات مقاله</h3>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                {post!.categoryName && (
                  <div className="flex justify-between">
                    <span>دسته‌بندی:</span>
                    <span>{post!.categoryName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>زمان مطالعه:</span>
                  <span>{post!.readTime || 5} دقیقه</span>
                </div>
                {post!.publishedAt && (
                  <div className="flex justify-between">
                    <span>تاریخ انتشار:</span>
                    <span>{new Date(post!.publishedAt).toLocaleDateString('fa-IR')}</span>
                  </div>
                )}
                {post!.authorName && (
                  <div className="flex justify-between">
                    <span>نویسنده:</span>
                    <span>{post!.authorName}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
      <Footer />
    </main>
  );
}
