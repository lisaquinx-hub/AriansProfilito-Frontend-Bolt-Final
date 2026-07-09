'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Mail, Phone, Building, Edit2, Save, AlertCircle, KeyRound, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { userService, UserProfile } from '@/services/UserService';
import { authService } from '@/services/AuthService';
import { useAuth, emitAuthChanged } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/services/api';
import { setStoredUser } from '@/lib/auth';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    bio: '',
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
        let data: UserProfile | null = null;

        try {
          data = await userService.getProfile();
        } catch {
          // Fallback to /Auth/me if /users/profile is not available
        }

        if (!data) {
          const currentUser = await authService.getCurrentUser();
          data = {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            phone: currentUser.phone,
            company: currentUser.company,
            bio: currentUser.bio,
            role: currentUser.role,
            roles: currentUser.roles,
          };
        }

        setProfile(data);
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          company: data.company || '',
          bio: data.bio || '',
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
    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const updated = await userService.updateProfile({
        name: formData.name,
        phone: formData.phone,
        company: formData.company,
        bio: formData.bio,
      });
      setProfile(updated);
      if (user) {
        setStoredUser({ ...user, name: updated.name });
        emitAuthChanged();
      }
      setSuccessMsg('پروفایل با موفقیت ذخیره شد');
      setIsEditing(false);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('رمز عبور جدید و تکرار آن مطابقت ندارند');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordError('رمز عبور باید حداقل ۸ کاراکتر باشد');
      return;
    }
    setIsChangingPassword(true);
    try {
      await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setIsPasswordModalOpen(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccessMsg('رمز عبور با موفقیت تغییر کرد');
    } catch (err) {
      setPasswordError(getApiErrorMessage(err));
    } finally {
      setIsChangingPassword(false);
    }
  };

  const displayName = profile?.name || user?.name || '-';
  const displayEmail = profile?.email || user?.email || '-';
  const displayPhone = profile?.phone || '-';
  const displayCompany = profile?.company || '-';
  const displayBio = profile?.bio || '-';

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <div className="h-8 bg-muted animate-pulse rounded w-32 mb-2" />
          <div className="h-4 bg-muted animate-pulse rounded w-48" />
        </div>
        <div className="glass rounded-2xl p-8 animate-pulse">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
            <div className="w-24 h-24 rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="h-6 bg-muted rounded w-40" />
              <div className="h-4 bg-muted rounded w-52" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">پروفایل</h1>
          <p className="text-muted-foreground mt-1">مدیریت اطلاعات شخصی</p>
        </div>
        <Button
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          variant={isEditing ? 'default' : 'outline'}
          className="rounded-full"
          disabled={isSaving}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 ml-2" />
              {isSaving ? 'در حال ذخیره...' : 'ذخیره'}
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4 ml-2" />
              ویرایش
            </>
          )}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="glass rounded-xl p-4 flex items-center gap-3 text-red-500">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Success */}
      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4 flex items-center gap-3 text-green-500"
        >
          <span className="text-sm">{successMsg}</span>
        </motion.div>
      )}

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8"
      >
        {/* Avatar Section */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 dark:from-blue-500 dark:to-cyan-500 flex items-center justify-center text-4xl font-bold text-white">
              {displayName !== '-' ? displayName[0] : '?'}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 left-0 w-8 h-8 rounded-full bg-card flex items-center justify-center ring-2 ring-background">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{displayName}</h2>
            <p className="text-muted-foreground">{displayEmail}</p>
          </div>
        </div>

        {/* Form */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">نام و نام خانوادگی</Label>
            <Input
              id="name"
              value={isEditing ? formData.name : displayName}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing}
              className="bg-muted/50 border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">ایمیل</Label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={displayEmail}
                disabled
                className="pr-10 bg-muted/50 border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">شماره تماس</Label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="phone"
                value={isEditing ? formData.phone : displayPhone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                className="pr-10 bg-muted/50 border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">شرکت</Label>
            <div className="relative">
              <Building className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="company"
                value={isEditing ? formData.company : displayCompany}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                disabled={!isEditing}
                className="pr-10 bg-muted/50 border-border"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bio">درباره من</Label>
            <Textarea
              id="bio"
              value={isEditing ? formData.bio : displayBio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!isEditing}
              className="bg-muted/50 border-border resize-none"
              rows={3}
            />
          </div>
        </div>
      </motion.div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-8"
      >
        <h2 className="text-xl font-semibold mb-6">امنیت</h2>
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
          <div>
            <h3 className="font-medium">تغییر رمز عبور</h3>
            <p className="text-sm text-muted-foreground">رمز عبور خود را به‌روز کنید</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            تغییر رمز
          </Button>
        </div>
      </motion.div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50"
              onClick={() => setIsPasswordModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative glass rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <KeyRound className="w-5 h-5" />
                  تغییر رمز عبور
                </h3>
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {passwordError && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
                  {passwordError}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">رمز عبور فعلی</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="bg-muted/50 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">رمز عبور جدید</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="bg-muted/50 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">تکرار رمز عبور جدید</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="bg-muted/50 border-border"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <Button variant="outline" onClick={() => setIsPasswordModalOpen(false)}>
                  انصراف
                </Button>
                <Button
                  className="btn-primary shadow-glow"
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? 'در حال تغییر...' : 'تغییر رمز'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
