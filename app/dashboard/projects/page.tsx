'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FolderKanban, Calendar, AlertCircle, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { projectService, UserProject, CreateProjectRequest } from '@/services/ProjectService';
import { getApiErrorMessage } from '@/services/api';

const statusLabels: { [key: string]: string } = {
  active: 'در حال توسعه',
  pending: 'در انتظار تأیید',
  completed: 'تکمیل شده',
  in_progress: 'در حال اجرا',
  on_hold: 'متوقف شده',
};

const statusColors: { [key: string]: string } = {
  active: 'bg-sky-500/20 text-sky-500 dark:bg-blue-500/20 dark:text-blue-400',
  pending: 'bg-yellow-500/20 text-yellow-500',
  completed: 'bg-green-500/20 text-green-500',
  in_progress: 'bg-sky-500/20 text-sky-500 dark:bg-blue-500/20 dark:text-blue-400',
  on_hold: 'bg-orange-500/20 text-orange-500',
};

function getStatusInfo(status: string) {
  const key = status.toLowerCase();
  return {
    label: statusLabels[key] || status,
    color: statusColors[key] || 'bg-muted text-muted-foreground',
  };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateProjectRequest>({
    title: '',
    description: '',
    timeline: '',
    budget: '',
  });

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async () => {
    if (!formData.title || !formData.description) {
      setSubmitError('عنوان و توضیحات الزامی است');
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await projectService.createProject(formData);
      setSuccessMsg('پروژه با موفقیت ایجاد شد');
      setIsModalOpen(false);
      setFormData({ title: '', description: '', timeline: '', budget: '' });
      fetchProjects();
    } catch (err) {
      setSubmitError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">پروژه‌ها</h1>
          <p className="text-muted-foreground mt-1">مدیریت و مشاهده پروژه‌های شما</p>
        </div>
        <Button className="btn-primary shadow-glow" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 ml-2" />
          ایجاد پروژه جدید
        </Button>
      </div>

      {/* Success Message */}
      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4 text-green-500 text-sm"
        >
          {successMsg}
        </motion.div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="glass rounded-xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <p className="text-muted-foreground">{error}</p>
          <Button variant="outline" className="mt-4 rounded-full" onClick={fetchProjects}>
            تلاش مجدد
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass rounded-xl p-6 animate-pulse">
              <div className="flex gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-32" />
                  <div className="h-3 bg-muted rounded w-20" />
                </div>
              </div>
              <div className="h-2 bg-muted rounded mb-2" />
              <div className="h-2 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && projects.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center">
          <FolderKanban className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">پروژه‌ای وجود ندارد</h3>
          <p className="text-muted-foreground text-sm mb-6">
            هنوز پروژه‌ای ثبت نشده است.
          </p>
          <Button className="btn-primary shadow-glow" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 ml-2" />
            ایجاد پروژه جدید
          </Button>
        </div>
      )}

      {/* Projects Grid */}
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
                className="glass rounded-xl p-6 glass-hover transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center">
                      <FolderKanban className="w-6 h-6 text-sky-500 dark:text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{project.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {project.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}

                {/* Progress */}
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

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {project.deadline ? new Date(project.deadline).toLocaleDateString('fa-IR') : '-'}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative glass rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">ایجاد پروژه جدید</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {submitError && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
                  {submitError}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">عنوان پروژه *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-muted/50 border-border"
                    placeholder="عنوان پروژه را وارد کنید"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">توضیحات *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-muted/50 border-border resize-none"
                    rows={3}
                    placeholder="توضیحات پروژه را وارد کنید"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeline">زمان‌بندی</Label>
                    <Input
                      id="timeline"
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="bg-muted/50 border-border"
                      placeholder="مثلاً ۳ ماه"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">بودجه</Label>
                    <Input
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="bg-muted/50 border-border"
                      placeholder="مثلاً ۵۰ میلیون تومان"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  انصراف
                </Button>
                <Button
                  className="btn-primary shadow-glow"
                  onClick={handleCreate}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      در حال ایجاد...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 ml-2" />
                      ایجاد پروژه
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
