'use client';

import { motion } from 'framer-motion';
import { Plus, FolderKanban, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const projects = [
  {
    id: '1',
    name: 'پلتفرم ابری نوا',
    status: 'active',
    progress: 75,
    deadline: '۱۴۰۵/۰۶/۱۵',
    team: ['ع', 'م', 'س'],
  },
  {
    id: '2',
    name: 'کیف پول سپهر',
    status: 'pending',
    progress: 30,
    deadline: '۱۴۰۵/۰۷/۲۰',
    team: ['ر', 'س'],
  },
  {
    id: '3',
    name: 'دستیار هوشمند آوا',
    status: 'completed',
    progress: 100,
    deadline: '۱۴۰۵/۰۴/۱۰',
    team: ['ع', 'م', 'ر', 'س'],
  },
  {
    id: '4',
    name: 'اپلیکیشن فروشگاهی',
    status: 'active',
    progress: 45,
    deadline: '۱۴۰۵/۰۸/۳۰',
    team: ['م', 'س'],
  },
];

const statusLabels: { [key: string]: string } = {
  active: 'در حال توسعه',
  pending: 'در انتظار تأیید',
  completed: 'تکمیل شده',
};

const statusColors: { [key: string]: string } = {
  active: 'bg-blue-500/20 text-blue-400',
  pending: 'bg-yellow-500/20 text-yellow-400',
  completed: 'bg-green-500/20 text-green-400',
};

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">پروژه‌ها</h1>
          <p className="text-foreground/50 mt-1">مدیریت و مشاهده پروژه‌های شما</p>
        </div>
        <Button className="rounded-full bg-gradient-to-l from-blue-600 to-cyan-600 shadow-glow">
          <Plus className="w-4 h-4 ml-2" />
          ایجاد پروژه جدید
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-xl p-6 hover:bg-white/10 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                  <FolderKanban className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold">{project.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColors[project.status]}`}>
                    {statusLabels[project.status]}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-foreground/50">پیشرفت</span>
                <span className="font-medium">{project.progress}٪</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-l from-blue-500 to-cyan-500 rounded-full transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-4 text-sm text-foreground/50">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{project.deadline}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <div className="flex -space-x-2 space-x-reverse">
                    {project.team.map((member, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs text-white ring-2 ring-background"
                      >
                        {member}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Link
                href={`/dashboard/projects/${project.id}`}
                className="text-sm text-cyan-400 hover:text-cyan-300"
              >
                مشاهده جزئیات
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
