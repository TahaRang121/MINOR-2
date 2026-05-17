import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader, User } from 'lucide-react';
import { Button, Input } from '../components/ui/index';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../api/client';
import { staggerContainerVariants, fadeUpVariants } from '../utils/animations';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const { setToken, setUser, addUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        throw new Error('Please fill in all fields');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (formData.password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      if (!agreeToTerms) {
        throw new Error('Please agree to terms and conditions');
      }

      const userPayload = {
        username: formData.name,
        email: formData.email,
        role: 'Member',
        avatar: '',
        password: btoa(formData.password),
      };

      // Try backend signup endpoint first
      try {
        const res = await apiClient.post('/auth/signup', formData);
        const token = res?.data?.access_token || res?.data?.token;
        const user = res?.data?.user || userPayload;
        if (token) {
          setToken(token);
          setUser(user);
          if (!res?.data?.user) addUser(userPayload);
          navigate('/dashboard');
          return;
        }
      } catch (err) {
        console.warn('Backend signup failed (fallback to mock):', err?.message || err);
      }

      // Fallback: simulate API call and set token in store
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockToken = 'mock_token_' + Date.now();
      setToken(mockToken);
      setUser(userPayload);
      addUser(userPayload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen page-shell flex items-center justify-center p-4 relative overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, 100, 0], x: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -100, 0], x: [0, -50, 0] }}
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
        <motion.div variants={fadeUpVariants} className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-2xl font-bold text-white"
            >
              ◆
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold mb-2 gradient-text">Create Account</h1>
          <p className="text-white/60">Join Crisis AI today</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          variants={fadeUpVariants}
          className="glass rounded-2xl p-8 space-y-6 border border-primary-500/20"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-primary-400" size={20} />
                <Input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-primary-400" size={20} />
                <Input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-primary-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-primary-400" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-primary-400 hover:text-primary-300"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 rounded border-primary-500 bg-dark-800"
              />
              <span className="text-white/70 hover:text-white text-sm">
                I agree to the{' '}
                <a href="#" className="text-primary-400 hover:text-primary-300">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-400 hover:text-primary-300">
                  Privacy Policy
                </a>
              </span>
            </label>

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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-900 text-white/50">Already have an account?</span>
            </div>
          </div>

          {/* Sign In Link */}
          <Link to="/login">
            <Button variant="secondary" className="w-full">
              Sign In
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;
