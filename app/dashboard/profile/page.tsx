'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Mail, Phone, Building, Edit2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'علی محمدی',
    email: 'ali@example.com',
    phone: '۰۹۱۲۱۲۳۴۵۶۷',
    company: 'فناوران نوین',
    bio: 'توسعه‌دهنده و علاقه‌مند به تکنولوژی',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">پروفایل</h1>
          <p className="text-foreground/50 mt-1">مدیریت اطلاعات شخصی</p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? 'default' : 'outline'}
          className="rounded-full"
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 ml-2" />
              ذخیره
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4 ml-2" />
              ویرایش
            </>
          )}
        </Button>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8"
      >
        {/* Avatar Section */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/5">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-4xl font-bold text-white">
              {profile.name[0]}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 left-0 w-8 h-8 rounded-full bg-card flex items-center justify-center ring-2 ring-background">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-foreground/50">{profile.email}</p>
          </div>
        </div>

        {/* Form */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">نام و نام خانوادگی</Label>
            <div className="relative">
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                disabled={!isEditing}
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">ایمیل</Label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                disabled={!isEditing}
                className="pr-10 bg-white/5 border-white/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">شماره تماس</Label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                disabled={!isEditing}
                className="pr-10 bg-white/5 border-white/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">شرکت</Label>
            <div className="relative">
              <Building className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
              <Input
                id="company"
                value={profile.company}
                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                disabled={!isEditing}
                className="pr-10 bg-white/5 border-white/10"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bio">درباره من</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              disabled={!isEditing}
              className="bg-white/5 border-white/10 resize-none"
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
        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
          <div>
            <h3 className="font-medium">تغییر رمز عبور</h3>
            <p className="text-sm text-foreground/50">رمز عبور خود را به‌روز کنید</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-full">
            تغییر رمز
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
