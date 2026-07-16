'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Mail, Phone, Edit2, Save, AlertCircle, KeyRound, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { userService, UserProfile, UpdateProfileRequest } from '@/services/UserService';
import { emitAuthChanged } from '@/hooks/useAuth';
import { getApiErrorMessage, resetCsrfToken } from '@/services/api';
import { clearAuthSession } from '@/lib/auth';
import { toast } from 'sonner';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    fullName: '',
    email: '',
    userName: '',
    phoneNumber: '',
    avatar: '',
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await userService.getProfile();
        setProfile(data);
        setFormData({
          fullName: data.fullName || '',
          email: data.email || '',
          userName: data.userName || '',
          phoneNumber: data.phoneNumber || '',
          avatar: data.avatar || '',
        });
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!formData.fullName.trim() || !formData.email.trim()) {
      setError('نام و ایمیل الزامی است');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const updated = await userService.updateProfile({
        fullName: formData.fullName,
        email: formData.email,
        userName: formData.userName || undefined,
        phoneNumber: formData.phoneNumber || undefined,
        avatar: formData.avatar || undefined,
      });
      setProfile(updated);
      clearAuthSession();
      resetCsrfToken();
      emitAuthChanged();
      setIsEditing(false);
      toast.success('پروفایل به‌روزرسانی شد؛ لطفاً دوباره وارد شوید');
      router.replace('/login');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordError('همه فیلدها الزامی است');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('رمز عبور جدید و تکرار آن مطابقت ندارند');
      return;
    }
    if (passwordData.newPassword.length < 12) {
      setPasswordError('رمز عبور جدید باید حداقل ۱۲ کاراکتر باشد');
      return;
    }
    if (!/[A-Z]/.test(passwordData.newPassword) || !/[a-z]/.test(passwordData.newPassword) || !/[0-9]/.test(passwordData.newPassword)) {
      setPasswordError('رمز عبور جدید باید شامل حرف بزرگ، حرف کوچک و عدد باشد');
      return;
    }
    setIsChangingPassword(true);
    try {
      await userService.changePassword({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
      setIsPasswordModalOpen(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      clearAuthSession();
      resetCsrfToken();
      emitAuthChanged();
      toast.success('رمز عبور تغییر کرد؛ لطفاً دوباره وارد شوید');
      router.replace('/login');
    } catch (err) {
      setPasswordError(getApiErrorMessage(err));
    } finally {
      setIsChangingPassword(false);
    }
  };

  const roleLabel = (() => {
    const r = profile?.role;
    if (r === 3) return 'مدیر';
    if (r === 2) return 'کارمند';
    return 'مشتری';
  })();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">پروفایل من</h1>
        {!isEditing && (
          <Button variant="outline" className="rounded-full gap-2" onClick={() => setIsEditing(true)}>
            <Edit2 className="w-4 h-4" />ویرایش
          </Button>
        )}
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />{error}
        </motion.div>
      )}

      <div className="glass rounded-2xl p-6 flex items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-sky-500/20 flex items-center justify-center text-3xl font-bold text-sky-500 dark:text-cyan-400">
            {profile?.fullName?.[0]?.toUpperCase() || '?'}
          </div>
          <button className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white hover:bg-sky-600 transition-colors">
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
        <div>
          <h2 className="text-xl font-bold">{profile?.fullName || '-'}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-500 dark:text-cyan-400 border border-sky-500/20">{roleLabel}</span>
            {profile?.isActive && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">فعال</span>
            )}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label>نام و نام خانوادگی</Label>
            {isEditing ? (
              <Input value={formData.fullName} onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))} className="bg-muted/50 border-border" />
            ) : (
              <div className="flex items-center gap-2 h-10 px-3 rounded-md bg-muted/30 text-sm">{profile?.fullName || '-'}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label>ایمیل</Label>
            {isEditing ? (
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="bg-muted/50 border-border pr-9" />
              </div>
            ) : (
              <div className="flex items-center gap-2 h-10 px-3 rounded-md bg-muted/30 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />{profile?.email || '-'}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>نام کاربری</Label>
            {isEditing ? (
              <Input value={formData.userName || ''} onChange={e => setFormData(p => ({ ...p, userName: e.target.value }))} className="bg-muted/50 border-border" />
            ) : (
              <div className="flex items-center gap-2 h-10 px-3 rounded-md bg-muted/30 text-sm">{profile?.userName || '-'}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label>شماره تلفن</Label>
            {isEditing ? (
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="tel" value={formData.phoneNumber || ''} onChange={e => setFormData(p => ({ ...p, phoneNumber: e.target.value }))} className="bg-muted/50 border-border pr-9" />
              </div>
            ) : (
              <div className="flex items-center gap-2 h-10 px-3 rounded-md bg-muted/30 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />{profile?.phoneNumber || '-'}
              </div>
            )}
          </div>
        </div>
        {isEditing && (
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} className="btn-primary shadow-glow" disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Save className="w-4 h-4 ml-2" />}
              ذخیره
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => { setIsEditing(false); setError(null); }}>انصراف</Button>
          </div>
        )}
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold mb-4">امنیت</h3>
        <Button variant="outline" className="rounded-full gap-2" onClick={() => setIsPasswordModalOpen(true)}>
          <KeyRound className="w-4 h-4" />تغییر رمز عبور
        </Button>
      </div>

      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50" onClick={() => setIsPasswordModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative glass rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold">تغییر رمز عبور</h3>
                <button onClick={() => setIsPasswordModalOpen(false)} className="p-2 rounded-lg hover:bg-muted transition-colors"><X className="w-4 h-4" /></button>
              </div>
              {passwordError && <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">{passwordError}</div>}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>رمز عبور فعلی</Label>
                  <Input type="password" value={passwordData.currentPassword} onChange={e => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))} autoComplete="current-password" maxLength={128} className="bg-muted/50 border-border" />
                </div>
                <div className="space-y-2">
                  <Label>رمز عبور جدید</Label>
                  <Input type="password" value={passwordData.newPassword} onChange={e => setPasswordData(p => ({ ...p, newPassword: e.target.value }))} autoComplete="new-password" minLength={12} maxLength={128} placeholder="حداقل ۱۲ کاراکتر، شامل حروف بزرگ و کوچک و عدد" className="bg-muted/50 border-border" />
                </div>
                <div className="space-y-2">
                  <Label>تکرار رمز عبور جدید</Label>
                  <Input type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))} autoComplete="new-password" minLength={12} maxLength={128} className="bg-muted/50 border-border" />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <Button onClick={handleChangePassword} className="btn-primary shadow-glow flex-1" disabled={isChangingPassword}>
                  {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : null}تغییر رمز
                </Button>
                <Button variant="outline" className="rounded-full" onClick={() => setIsPasswordModalOpen(false)}>انصراف</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
