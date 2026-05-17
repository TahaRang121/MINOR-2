import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Card, Button } from '../components/ui';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen page-shell pt-20 p-4">
        <div className="container-custom text-center text-current/70">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-shell pt-20 p-4">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-primary-400 mb-3">My Profile</p>
          <h1 className="text-5xl font-bold text-current">Welcome back, {user.username}</h1>
          <p className="text-current/70 mt-3">View and manage your account details, activity, and preferences in one place.</p>
        </motion.div>

        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <Card className="!p-6 space-y-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary-500/15 flex items-center justify-center text-3xl font-bold text-white">
                  {user.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-3xl font-semibold text-white">{user.username}</p>
                  <p className="text-white/60">{user.role || 'Member'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="secondary" onClick={() => navigate('/settings')}>
                  <Settings size={18} />
                  Edit Profile
                </Button>
                <Button variant="ghost" onClick={() => { logout(); navigate('/login'); }}>
                  Logout
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl surface-panel p-5">
                <div className="flex items-center gap-3 text-current/70 mb-3"><Mail size={18} /> Email</div>
                <p className="text-current font-medium">{user.email}</p>
              </div>
              <div className="rounded-3xl surface-panel p-5">
                <div className="flex items-center gap-3 text-current/70 mb-3"><Shield size={18} /> Role</div>
                <p className="text-current font-medium">{user.role || 'Member'}</p>
              </div>
            </div>
          </Card>

          <Card className="!p-6 space-y-6">
            <div>
              <p className="text-sm text-primary-400 uppercase tracking-[0.2em] mb-3">Activity</p>
              <h2 className="text-2xl font-semibold text-white">Account summary</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-3xl surface-panel p-4">
                <p className="text-current/70">Saved alerts</p>
                <p className="mt-3 text-3xl font-semibold text-current">12</p>
              </div>
              <div className="rounded-3xl surface-panel p-4">
                <p className="text-current/70">Active notifications</p>
                <p className="mt-3 text-3xl font-semibold text-current">{user.notifications?.email ? 'Email & Push' : 'Email only'}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
