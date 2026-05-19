import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui';
import ProfileMenu from '../profile/ProfileMenu';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, theme, setTheme } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Events', path: '/events' },
    { label: 'Chat', path: '/chat' },
    { label: 'Search', path: '/search' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 w-full z-50 surface-panel"
      >
        <div className="container-custom flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center font-bold text-white"
            >
              ◆
            </motion.div>
            <span className="text-xl font-bold gradient-text hidden sm:inline">Crisis AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`btn-ghost relative ${isActive(item.path) ? 'text-primary-400' : ''}`}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500"
                    />
                  )}
                </Link>
              ))
            ) : null}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Toggle theme"
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    className="p-2 rounded-lg hover:bg-primary-500/12 transition-colors"
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                  >
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg hover:bg-primary-500/20 transition-colors"
                    onClick={() => navigate('/settings')}
                  >
                    <Settings size={20} />
                  </motion.button>
                </div>
                <ProfileMenu />
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-primary-500/20"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass border-t border-primary-500/20"
            >
              <div className="container-custom py-4 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`btn-ghost text-left ${isActive(item.path) ? 'text-primary-400' : ''}`}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="btn-ghost text-left flex items-center gap-2 text-red-400"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                      <Button className="w-full justify-start">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
};
