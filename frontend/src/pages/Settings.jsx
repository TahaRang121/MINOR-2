import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Card, Button, Input, Select, Skeleton } from '../components/ui';

const Settings = () => {
  const {
    user,
    setUser,
    theme,
    setTheme,
    notificationSettings,
    setNotificationSettings,
    privacySettings,
    setPrivacySettings,
  } = useAuth();

  const [form, setForm] = useState({ username: '', email: '', role: '' });
  const [avatar, setAvatar] = useState('');
  const [password, setPassword] = useState({ current: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({ username: user.username || '', email: user.email || '', role: user.role || 'Member' });
      setAvatar(user.avatar || '');
    }
  }, [user]);

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result.toString());
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.username.trim() || !form.email.trim()) {
      showToast('Please enter your name and email.', 'error');
      return;
    }

    if (password.newPassword || password.confirmPassword) {
      if (password.newPassword !== password.confirmPassword) {
        showToast('New passwords do not match.', 'error');
        return;
      }

      if (password.newPassword.length > 0 && password.newPassword.length < 8) {
        showToast('Password must be at least 8 characters.', 'error');
        return;
      }

      if (user?.password && btoa(password.current) !== user.password) {
        showToast('Current password is incorrect.', 'error');
        return;
      }
    }

    setSaving(true);
    setTimeout(() => {
      const updatedUser = {
        ...user,
        username: form.username,
        email: form.email,
        role: form.role,
        avatar,
        ...(password.newPassword ? { password: btoa(password.newPassword) } : {}),
      };
      setUser(updatedUser);
      setTheme(theme);
      setNotificationSettings(notificationSettings);
      setPrivacySettings(privacySettings);
      setPassword({ current: '', newPassword: '', confirmPassword: '' });
      setSaving(false);
      showToast('Settings saved successfully.');
    }, 700);
  };

  const handleThemeChange = (value) => {
    setTheme(value);
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-20 p-4">
        <div className="container-custom">
          <Skeleton className="h-12 w-48 mb-6" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-shell pt-20 p-4 relative overflow-hidden">
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className={`fixed top-24 right-4 z-50 rounded-2xl px-5 py-4 shadow-glow ${toast.type === 'error' ? 'bg-red-500/90 text-white' : 'bg-green-500/90 text-white'}`}
        >
          {toast.message}
        </motion.div>
      )}
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-primary-400 mb-3">Account Settings</p>
          <h1 className="text-5xl font-bold text-white">Profile & Preferences</h1>
          <p className="text-white/60 max-w-2xl mt-3">Update your account details, secure your profile, and customize the experience with notifications, privacy, and theme controls.</p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
          <Card className="!p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Profile Snapshot</h2>
              <p className="text-white/60 mt-2">Your logged-in user details and avatar.</p>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-primary-500/10 border border-white/10 overflow-hidden flex items-center justify-center text-4xl text-white font-bold">
                  {avatar ? <img src={avatar} alt="Profile avatar" className="w-full h-full object-cover" /> : (user.username?.charAt(0).toUpperCase() || 'U')}
                </div>
                <label className="absolute -bottom-2 right-0 bg-primary-500 text-white rounded-full p-2 cursor-pointer shadow-glow">
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  ✎
                </label>
              </div>
              <div>
                <div className="text-2xl font-semibold text-white">{user.username}</div>
                <div className="text-sm text-white/60">{user.email}</div>
                <div className="text-sm text-primary-300 mt-2">{user.role || 'Member'}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-2xl surface-panel p-4">
                <p className="text-sm text-current/60">Account status</p>
                <p className="mt-2 font-semibold text-current">Secure</p>
              </div>
              <div className="rounded-2xl surface-panel p-4">
                <p className="text-sm text-current/60">Notifications</p>
                <p className="mt-2 text-current">{notificationSettings.email ? 'Email enabled' : 'Email disabled'}, {notificationSettings.push ? 'Push enabled' : 'Push disabled'}</p>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="!p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
                  <p className="text-white/60">Edit your username, email, and role.</p>
                </div>
                <span className="text-sm text-white/60">Ready to save</span>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Full name" />
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email address" />
                <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} options={[{ label: 'Member', value: 'Member' }, { label: 'Admin', value: 'Admin' }]} />
              </div>
            </Card>

            <Card className="!p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">Security</h2>
                  <p className="text-white/60">Update your password and keep your account safe.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <Input type="password" value={password.current} onChange={(e) => setPassword({ ...password, current: e.target.value })} placeholder="Current password" />
                <Input type="password" value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} placeholder="New password" />
                <Input type="password" value={password.confirmPassword} onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })} placeholder="Confirm password" />
              </div>
            </Card>

            <Card className="!p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">Preferences</h2>
                  <p className="text-white/60">Choose your default theme and notification settings.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="space-y-4 p-4 rounded-3xl surface-panel">
                  <p className="text-current/70">Theme mode</p>
                  <div className="flex items-center gap-3">
                    <Button variant={theme === 'dark' ? 'secondary' : 'ghost'} onClick={() => handleThemeChange('dark')}>Dark</Button>
                    <Button variant={theme === 'light' ? 'secondary' : 'ghost'} onClick={() => handleThemeChange('light')}>Light</Button>
                  </div>
                </div>
                <div className="space-y-4 p-4 rounded-3xl surface-panel">
                  <p className="text-current/70">Notifications</p>
                  <label className="flex items-center justify-between gap-3">
                    <span className="text-sm text-white">Email alerts</span>
                    <input type="checkbox" checked={notificationSettings.email} onChange={(e) => setNotificationSettings({ ...notificationSettings, email: e.target.checked })} />
                  </label>
                  <label className="flex items-center justify-between gap-3">
                    <span className="text-sm text-white">Push alerts</span>
                    <input type="checkbox" checked={notificationSettings.push} onChange={(e) => setNotificationSettings({ ...notificationSettings, push: e.target.checked })} />
                  </label>
                </div>
              </div>
            </Card>

            <Card className="!p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">Privacy</h2>
                  <p className="text-white/60">Manage how your data is handled in the product.</p>
                </div>
              </div>
              <label className="flex items-center justify-between gap-3 p-4 rounded-3xl surface-panel">
                <div>
                  <p className="text-current">Share anonymized usage data</p>
                  <p className="text-sm text-current/70">Improve predictions while staying private.</p>
                </div>
                <input type="checkbox" checked={privacySettings.shareData} onChange={(e) => setPrivacySettings({ ...privacySettings, shareData: e.target.checked })} />
              </label>
            </Card>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-white/60">Make sure your profile is up to date and secure.</div>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving settings...' : 'Save Changes'}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
