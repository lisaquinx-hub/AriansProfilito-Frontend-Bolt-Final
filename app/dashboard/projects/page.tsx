'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, Calendar, AlertCircle, Loader2, MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { projectService } from '@/services/ProjectService';
import { Project } from '@/types/api';
import { getApiErrorMessage } from '@/services/api';

const PROJECT_STATUS: Record<number, { label: string; color: string }> = {
  1: { label: 'در انتظار', color: 'bg-yellow-500/20 text-yellow-500' },
  2: { label: 'در حال اجرا', color: 'bg-sky-500/20 text-sky-500 dark:bg-blue-500/20 dark:text-blue-400' },
  3: { label: 'تکمیل شده', color: 'bg-green-500/20 text-green-500' },
  4: { label: 'لغو شده', color: 'bg-red-500/20 text-red-500' },
};

function getStatusInfo(status: number) {
  return PROJECT_STATUS[status] || { label: String(status), color: 'bg-muted text-muted-foreground' };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentProject, setCommentProject] = useState<Project | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [commentSuccess, setCommentSuccess] = useState(false);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await projectService.getMyProjects();
      setProjects(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openCommentModal = (project: Project) => {
    setCommentProject(project);
    setCommentText(project.customerComment || '');
    setCommentError(null);
    setCommentSuccess(false);
  };

  const handleCommentSubmit = async () => {
    if (!commentProject || !commentText.trim()) return;
    setIsSubmittingComment(true);
    setCommentError(null);
    try {
      await projectService.updateCustomerComment(commentProject.id, { customerComment: commentText });
      setCommentSuccess(true);
      setProjects(prev => prev.map(p => p.id === commentProject.id ? { ...p, customerComment: commentText } : p));
      setTimeout(() => setCommentProject(null), 2000);
    } catch (err) {
      setCommentError(getApiErrorMessage(err));
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">پروژه‌ها</h1>
        <p className="text-muted-foreground mt-1">مشاهده وضعیت پروژه‌های شما</p>
      </div>

      {error && !isLoading && (
        <div className="glass rounded-xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <p className="text-muted-foreground">{error}</p>
          <Button variant="outline" className="mt-4 rounded-full" onClick={fetchProjects}>
            تلاش دوباره
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        </div>
      )}

      {!isLoading && !error && projects.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center">
          <FolderKanban className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">پروژه‌ای وجود ندارد</h3>
          <p className="text-muted-foreground text-sm">
            هنوز پروژه‌ای برای شما ثبت نشده است. برای سفارش پروژه با پشتیبانی تماس بگیرید.
          </p>
          <Button asChild className="btn-primary mt-6">
            <Link href="/#contact-form">تماس برای ثبت پروژه</Link>
          </Button>
        </div>
      )}

      {!isLoading && !error && projects.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => {
            const statusInfo = getStatusInfo(project.status);
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center">
                      <FolderKanban className="w-6 h-6 text-sky-500 dark:text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{project.title}</h3>
                      {project.projectCode && (
                        <span className="text-xs text-muted-foreground">#{project.projectCode}</span>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {project.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                )}

                {project.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">پیشرفت</span>
                      <span className="font-medium">{project.progress}٪</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-l from-sky-500 to-blue-600 dark:from-blue-500 dark:to-cyan-500 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {project.price != null && (
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-muted-foreground">مبلغ:</span>
                    <span className="font-medium">{project.price.toLocaleString()} تومان</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {project.estimatedDeliveryDate
                        ? new Date(project.estimatedDeliveryDate).toLocaleDateString('fa-IR')
                        : project.createdAt
                        ? new Date(project.createdAt).toLocaleDateString('fa-IR')
                        : '-'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-xs"
                    onClick={() => openCommentModal(project)}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    نظر
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Customer Comment Modal */}
      {commentProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setCommentProject(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative glass rounded-2xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">نظر مشتری — {commentProject.title}</h3>
              <button onClick={() => setCommentProject(null)} className="p-1 rounded-lg hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>
            {commentSuccess && (
              <div className="mb-3 p-3 rounded-lg bg-green-500/10 text-green-500 text-sm">
                نظر شما با موفقیت ثبت شد.
              </div>
            )}
            {commentError && (
              <div className="mb-3 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">{commentError}</div>
            )}
            <div className="space-y-3">
              <Label>نظر شما</Label>
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
                className="bg-muted/50 border-border resize-none"
                placeholder="نظر خود را درباره پروژه بنویسید..."
              />
            </div>
            <div className="flex gap-3 justify-end mt-4">
              <Button variant="outline" onClick={() => setCommentProject(null)}>انصراف</Button>
              <Button
                className="btn-primary"
                onClick={handleCommentSubmit}
                disabled={isSubmittingComment || !commentText.trim()}
              >
                {isSubmittingComment ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : null}
                ثبت نظر
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
