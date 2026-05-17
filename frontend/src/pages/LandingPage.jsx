import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Zap, Brain, Shield, BarChart3, Users } from 'lucide-react';
import { Button } from '../components/ui/index';
import { staggerContainerVariants, fadeUpVariants, scaleInVariants } from '../utils/animations';

const LandingPage = () => {
  return (
    <div className="min-h-screen page-shell overflow-hidden relative">
      {/* Animated Background */}
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
        <motion.div
          animate={{
            y: [100, -100, 100],
            x: [-50, 50, -50],
          }}
          transition={{ duration: 30, repeat: Infinity }}
          className="absolute top-1/2 left-1/3 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen flex items-center justify-center relative z-10 pt-16"
      >
        <div className="container-custom">
          <motion.div
            variants={staggerContainerVariants(0.1)}
            initial="hidden"
            animate="visible"
            className="text-center space-y-8"
          >
            {/* Badge */}
            <motion.div variants={fadeUpVariants} className="flex justify-center">
              <div className="px-4 py-2 rounded-full glass border border-primary-500/30 inline-block">
                <p className="text-sm gradient-text font-semibold">🚀 AI-Powered Crisis Intelligence</p>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div variants={fadeUpVariants} className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="gradient-text">Global Crisis Intelligence</span>
                <br />
                <span className="text-white">In Real-Time</span>
              </h1>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Monitor worldwide crises, predict market impacts, and make data-driven decisions with AI-powered analysis and sector intelligence.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUpVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Link to="/signup">
                <Button className="flex items-center gap-2 text-lg px-8 py-4">
                  Get Started <ArrowRight size={20} />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" className="flex items-center gap-2 text-lg px-8 py-4">
                  Sign In
                </Button>
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              variants={fadeUpVariants}
              className="flex items-center justify-center gap-6 pt-8 text-white/60 text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span>500+ Events Tracked</span>
              </div>
              <div className="h-4 w-px bg-white/20" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Real-Time Updates</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-24 relative z-10"
      >
        <div className="container-custom">
          <motion.div
            variants={staggerContainerVariants(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-16"
          >
            {/* Section Header */}
            <motion.div variants={fadeUpVariants} className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold gradient-text">Premium Features</h2>
              <p className="text-white/70">Everything you need to stay ahead of global crises</p>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              variants={staggerContainerVariants(0.05)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[
                {
                  icon: Brain,
                  title: 'AI Analysis',
                  description: 'Advanced machine learning models analyze global events in real-time',
                },
                {
                  icon: TrendingUp,
                  title: 'Predictions',
                  description: 'Sector-level impact predictions with confidence scoring',
                },
                {
                  icon: BarChart3,
                  title: 'Analytics',
                  description: 'Comprehensive dashboards and historical trend analysis',
                },
                {
                  icon: Zap,
                  title: 'Real-Time Updates',
                  description: 'Live crisis feed with automatic categorization and scoring',
                },
                {
                  icon: Shield,
                  title: 'Secure Platform',
                  description: 'Enterprise-grade security with encrypted data storage',
                },
                {
                  icon: Users,
                  title: 'Team Collaboration',
                  description: 'Share insights and collaborate with your team members',
                },
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={i}
                    variants={fadeUpVariants}
                    whileHover={{ y: -5 }}
                    className="glass rounded-2xl p-6 border border-primary-500/20 hover:border-primary-500/50 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="text-white" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-white/70 text-sm">{feature.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-16 relative z-10"
      >
        <div className="container-custom">
          <div className="glass rounded-2xl p-12 border border-primary-500/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { number: '500+', label: 'Events Tracked' },
                { number: '50+', label: 'Sectors Monitored' },
                { number: '99.9%', label: 'Uptime' },
                { number: '24/7', label: 'Live Coverage' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center space-y-2"
                >
                  <p className="text-3xl md:text-4xl font-bold gradient-text">{stat.number}</p>
                  <p className="text-white/70">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-24 relative z-10"
      >
        <div className="container-custom text-center space-y-8">
          <motion.div
            variants={staggerContainerVariants(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            <motion.h2 variants={fadeUpVariants} className="text-4xl md:text-5xl font-bold gradient-text">
              Ready to Transform Your Crisis Management?
            </motion.h2>
            <motion.p variants={fadeUpVariants} className="text-white/70 max-w-2xl mx-auto">
              Join leading organizations using Crisis AI for intelligent crisis monitoring and decision-making.
            </motion.p>
            <motion.div variants={fadeUpVariants} className="pt-4">
              <Link to="/signup">
                <Button className="flex items-center gap-2 text-lg px-8 py-4">
                  Start Your Free Trial <ArrowRight size={20} />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;
