import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader } from 'lucide-react';
import { Button, Input } from '../components/ui/index';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../api/client';
import { staggerContainerVariants, fadeUpVariants } from '../utils/animations';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { setToken, setUser, addUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      // Try backend login endpoint first
      try {
        const res = await apiClient.post('/auth/login', { email, password });
        const token = res?.data?.access_token || res?.data?.token;
        const user = res?.data?.user || { email, username: email.split('@')[0] };
        if (token) {
          setToken(token);
          setUser(user);
          navigate('/dashboard');
          return;
        }
      } catch (err) {
        console.warn('Backend login failed (fallback to local auth):', err?.message || err);
      }

      const storedUsers = JSON.parse(localStorage.getItem('authUsers') || '[]');
      const matchedUser = storedUsers.find((user) => user.email === email && user.password === btoa(password));
      if (matchedUser) {
        const mockToken = 'mock_token_' + Date.now();
        setToken(mockToken);
        setUser(matchedUser);
        navigate('/dashboard');
        return;
      }

      // Fallback: simulate API call and set token in store
      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockToken = 'mock_token_' + Date.now();
      const user = {
        email,
        username: email.split('@')[0],
        role: 'Member',
        avatar: '',
        password: btoa(password),
      };
      setToken(mockToken);
      setUser(user);
      addUser(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen page-shell flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, 100, 0],
            x: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, -100, 0],
            x: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <motion.div
        variants={staggerContainerVariants(0.1)}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <motion.div
          variants={fadeUpVariants}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-2xl font-bold text-white"
            >
              ◆
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold mb-2 gradient-text">Welcome Back</h1>
          <p className="text-white/60">Global crisis intelligence at your fingertips</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          variants={fadeUpVariants}
          className="glass rounded-2xl p-8 space-y-6 border border-primary-500/20"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-primary-400" size={20} />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-primary-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-primary-400 hover:text-primary-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-primary-500 bg-dark-800"
                />
                <span className="text-white/70 hover:text-white">Remember me</span>
              </label>
              <Link to="/" className="text-primary-400 hover:text-primary-300">
                Forgot password?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-900 text-white/50">New to Crisis AI?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link to="/signup">
            <Button variant="secondary" className="w-full">
              Create an account
            </Button>
          </Link>
        </motion.div>

        {/* Footer */}
        <motion.p
          variants={fadeUpVariants}
          className="text-center text-white/50 text-sm mt-6"
        >
          By signing in, you agree to our{' '}
          <a href="#" className="text-primary-400 hover:text-primary-300">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary-400 hover:text-primary-300">
            Privacy Policy
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
