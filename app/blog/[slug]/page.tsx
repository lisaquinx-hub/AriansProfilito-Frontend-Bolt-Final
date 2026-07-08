'use client';

import { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts as mockBlogPosts, getRelatedBlogPosts, getPopularBlogPosts } from '@/lib/mock-data';
import { PageHeader } from '@/components/shared';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, ArrowLeft, Clock, User, Eye, Heart, Tag, TrendingUp, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { blogPostService } from '@/services/BlogPostService';
import { commentsService } from '@/services/CommentsService';
import { BlogPost, Comment as CommentType } from '@/types/api';
import { resolveAssetUrl } from '@/lib/api-utils';
import { cn } from '@/lib/utils';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: Props) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  const [commentForm, setCommentForm] = useState({
    fullName: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const postData = await blogPostService.getBySlug(slug);

      if (postData) {
        setPost(postData);
        const commentsData = await commentsService.getApprovedByBlogPostId(postData.id);
        setComments(commentsData);
      } else {
        // Fallback to mock data
        const mockPost = mockBlogPosts.find(p => p.slug === slug);
        if (mockPost) {
          setPost({
            id: mockPost.id,
            title: mockPost.title,
            slug: mockPost.slug,
            excerpt: mockPost.excerpt,
            content: mockPost.content,
            coverImage: mockPost.image,
            readTime: parseInt(mockPost.readTime) || 5,
            isPublished: true,
            publishedAt: mockPost.date,
            author: mockPost.author,
            authorAvatar: mockPost.authorAvatar,
            views: mockPost.views,
            likes: mockPost.likes,
            tags: mockPost.tags,
            categoryName: mockPost.category,
            createdAt: mockPost.date,
            updatedAt: mockPost.date,
          });
        }
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

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedBlogPosts(post.id);
  const popularPosts = getPopularBlogPosts().filter((p) => p.id !== post.id).slice(0, 4);

  return (
    <main className="min-h-screen pt-24 pb-16 relative overflow-x-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-sky-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        <PageHeader
          title={post.title}
          subtitle={post.excerpt || ''}
          breadcrumbs={[
            { label: 'خانه', href: '/' },
            { label: 'وبلاگ', href: '/blog' },
            { label: post.title },
          ]}
        />

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-3">
            {/* Meta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-blue-500/20 dark:to-cyan-500/20 flex items-center justify-center font-bold">
                  {post.authorAvatar || post.author?.[0] || 'ن'}
                </div>
                <span className="font-medium text-foreground">{post.author || 'نویسنده'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime || 5} دقیقه</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{post.views || 0} بازدید</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>{post.likes || 0} لایک</span>
              </div>
            </motion.div>

            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video rounded-2xl overflow-hidden glass p-2 mb-12"
            >
              <div className="relative aspect-video rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-blue-500/20 dark:to-cyan-500/20 flex items-center justify-center">
                <span className="text-8xl md:text-[120px] font-bold text-foreground/5">
                  {post.title[0]}
                </span>
              </div>
              {post.categoryName && (
                <div className="absolute top-6 right-6">
                  <span className="px-4 py-2 rounded-full text-sm font-medium glass">
                    {post.categoryName}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-8 md:p-12 mb-8"
            >
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {post.content || post.excerpt || ''}
                </p>

                <h2 className="text-2xl font-bold mt-10 mb-4">نکات کلیدی</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  این مقاله شامل نکات و تکنیک‌های مهمی است که می‌تواند در توسعه و طراحی کمک‌کننده باشد.
                  مطالعه عمیق این محتوا و پیاده‌سازی آن در پروژه‌های واقعی توصیه می‌شود.
                </p>

                <div className="my-12 p-6 rounded-xl bg-gradient-to-r from-sky-500/10 to-blue-500/10 dark:from-blue-500/10 dark:to-cyan-500/10 border-r-4 border-r-sky-500 dark:border-r-cyan-500">
                  <p className="text-lg italic">
                    "موفقیت در تکنولوژی به یادگیری مستمر و تمرین مداوم بستگی دارد."
                  </p>
                </div>

                <h2 className="text-2xl font-bold mt-10 mb-4">جمع‌بندی</h2>
                <p className="text-muted-foreground leading-relaxed">
                  با رعایت اصولی که در این مقاله بیان شد، می‌توانید کیفیت کار خود را
                  به سطح جدیدی ببرید. اگر سوالی دارید، در بخش نظرات بنویسید.
                </p>
              </div>
            </motion.div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 mb-8"
              >
                <Tag className="w-5 h-5 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm glass text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Share Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between flex-wrap gap-4 py-6 border-t border-b border-border mb-8"
            >
              <span className="text-muted-foreground">اشتراک‌گذاری:</span>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="rounded-full">
                  تلگرام
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  لینکدین
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  کپی لینک
                </Button>
              </div>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-2xl p-8 mb-8"
            >
              <h2 className="text-xl font-bold mb-6">نظرات ({comments.length})</h2>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="space-y-4 mb-8">
                {commentSuccess && (
                  <div className="bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
                    نظر شما با موفقیت ثبت شد و در انتظار تأیید است.
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
                  />
                </div>
                <Button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? (
                    <span className="animate-pulse">در حال ثبت...</span>
                  ) : (
                    <>
                      ثبت نظر
                      <Send className="mr-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Comments List */}
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
                          <div className="text-xs text-muted-foreground">{comment.createdAt}</div>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm pr-11">{comment.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">هنوز نظری ثبت نشده است.</p>
              )}
            </motion.div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-xl font-bold mb-6">مقالات مرتبط</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="group glass rounded-xl overflow-hidden"
                    >
                      <div className="relative h-32 bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-blue-500/20 dark:to-cyan-500/20 flex items-center justify-center">
                        <span className="text-4xl font-bold text-foreground/10">
                          {relatedPost.title[0]}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-sm group-hover:text-gradient transition-all line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-2">{relatedPost.readTime}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </article>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="glass rounded-2xl p-6 sticky top-28">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-sky-500" />
                <h3 className="text-lg font-semibold">محبوب‌ترین‌ها</h3>
              </div>
              <div className="space-y-4">
                {popularPosts.map((popularPost, index) => (
                  <Link
                    key={popularPost.id}
                    href={`/blog/${popularPost.slug}`}
                    className="flex gap-4 group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-500/20 dark:from-blue-500/20 dark:to-cyan-500/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-muted-foreground">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 group-hover:text-gradient transition-all">
                        {popularPost.title}
                      </h4>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Eye className="w-3 h-3" />
                        <span>{popularPost.views || 0}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </main>
  );
}
