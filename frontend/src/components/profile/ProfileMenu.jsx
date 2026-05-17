import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const ProfileMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-primary-500/10"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
          {user?.username ? user.username.charAt(0).toUpperCase() : <User size={16} />}
        </div>
        <span className="hidden sm:inline text-sm font-semibold text-white">{user?.username || 'User'}</span>
        <ChevronDown size={14} className={`text-white/80 ${open ? 'rotate-180' : ''} transition-transform`} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            className="absolute right-0 mt-2 w-64 surface-panel p-3 z-50 shadow-lg"
          >
            <div className="flex items-center gap-3 p-2">
              <div className="w-12 h-12 rounded-full bg-primary-600/20 flex items-center justify-center text-current font-bold">
                {user?.username ? user.username.charAt(0).toUpperCase() : <User size={18} />}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-current">{user?.username || 'Unknown'}</div>
                <div className="text-xs text-current/70 truncate">{user?.email || 'No email'}</div>
                <div className="text-xs text-current/60 mt-1">{user?.role || 'Member'}</div>
              </div>
            </div>

            <div className="mt-2 border-t border-white/6 pt-3 flex flex-col gap-2">
              <button
                onClick={() => { navigate('/profile'); setOpen(false); }}
                className="w-full text-left btn-ghost py-2 flex items-center gap-2 text-current"
              >
                <User size={16} /> Profile
              </button>
              <button
                onClick={() => { navigate('/settings'); setOpen(false); }}
                className="w-full text-left btn-ghost py-2 flex items-center gap-2 text-current"
              >
                <Settings size={16} /> Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-400 btn-ghost py-2 flex items-center gap-2"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileMenu;
