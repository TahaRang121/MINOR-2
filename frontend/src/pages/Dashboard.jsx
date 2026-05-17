import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, TrendingUp, AlertCircle, Search as SearchIcon, MessageSquare } from 'lucide-react';
import { Button, Card, Badge, Skeleton } from '../components/ui/index';
import { EventCard } from '../components/cards/EventCard';
import { apiService } from '../api/client';
import { staggerContainerVariants, fadeUpVariants, formatDate } from '../utils/animations';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError('');
      const [eventsRes, predictionsRes] = await Promise.all([
        apiService.getEvents({ limit: 10 }),
        apiService.getPredictions({ limit: 20 }),
      ]);

      setEvents(eventsRes.data || []);
      setPredictions(predictionsRes.data || []);

      const allEvents = eventsRes.data || [];
      setStats({
        totalEvents: allEvents.length,
        criticalEvents: allEvents.filter(e => e.severity === 'High').length,
        totalPredictions: (predictionsRes.data || []).length,
        uptrends: (predictionsRes.data || []).filter(p => p.direction === 'rise').length,
      });
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await apiService.fetchEvents();
      await fetchData();
    } catch (err) {
      setError('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-primary-950/20 to-dark-950 pt-20 p-4">
        <div className="container-custom">
          <Skeleton className="h-12 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-shell pt-20 p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-10 -right-48 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -50, 0], x: [0, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-32 -left-48 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">Dashboard</h1>
            <p className="text-white/60">Global crisis intelligence in real-time</p>
          </div>
          <motion.button
            whileHover={{ rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-3 rounded-lg glass hover:shadow-glow disabled:opacity-50"
          >
            <RefreshCw size={24} className={refreshing ? 'animate-spin' : ''} />
          </motion.button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={staggerContainerVariants(0.05)}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {stats && [
            { icon: AlertCircle, label: 'Active Events', value: stats.totalEvents, color: 'from-primary-500 to-secondary-500' },
            { icon: AlertCircle, label: 'Critical', value: stats.criticalEvents, color: 'from-red-500 to-pink-500' },
            { icon: TrendingUp, label: 'Predictions', value: stats.totalPredictions, color: 'from-green-500 to-cyan-500' },
            { icon: TrendingUp, label: 'Uptrends', value: stats.uptrends, color: 'from-purple-500 to-pink-500' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={i} variants={fadeUpVariants} whileHover={{ y: -5 }}>
                <Card>
                  <div className="space-y-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center opacity-20`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <p className="text-current/70 text-sm font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-current mt-1">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </motion.div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Events */}
          <motion.div variants={fadeUpVariants} initial="hidden" animate="visible" className="lg:col-span-2">
            <Card className="!p-0 overflow-hidden">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Recent Events</h2>
                <Button variant="ghost" size="sm" onClick={() => window.location.href = '/search'}>View all</Button>
              </div>
              <div className="space-y-2 p-6">
                {events.slice(0, 5).map((event, i) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => window.location.href = `/events/${event.id}`}
                  />
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeUpVariants} initial="hidden" animate="visible">
            <Card className="space-y-3">
              <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
              <Button className="w-full flex items-center justify-center gap-2" onClick={() => window.location.href = '/search'}>
                <SearchIcon size={18} />
                Search Events
              </Button>
              <Button variant="secondary" className="w-full flex items-center justify-center gap-2" onClick={() => window.location.href = '/chat'}>
                <MessageSquare size={18} />
                Ask AI
              </Button>
              <Button variant="secondary" className="w-full" onClick={handleRefresh} disabled={refreshing}>
                {refreshing ? 'Fetching...' : 'Fetch New Data'}
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Top Predictions */}
        {predictions.length > 0 && (
          <motion.div variants={fadeUpVariants} initial="hidden" animate="visible" className="mt-6">
            <Card>
              <h2 className="text-xl font-bold text-white mb-4">Top Sector Trends</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {predictions.slice(0, 6).map((pred, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-3 rounded-lg border border-primary-500/20 bg-primary-500/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white text-sm">{pred.sector_name}</h3>
                      <Badge variant={pred.direction === 'rise' ? 'success' : 'danger'}>
                        {pred.confidence}%
                      </Badge>
                    </div>
                    <p className="text-xs text-white/70 line-clamp-2">{pred.reasoning}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

