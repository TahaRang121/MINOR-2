import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Badge, Skeleton, Card } from '../components/ui/index';
import { apiService } from '../api/client';
import { formatDate, staggerContainerVariants, fadeUpVariants, getDirectionColor } from '../utils/animations';

const HistoryPage = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ direction: '', sector: '' });

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setError('');
      const res = await apiService.getPredictions({ limit: 150 });
      setPredictions(res.data || []);
    } catch (err) {
      setError('Failed to load predictions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPredictions = predictions.filter((pred) => {
    if (filters.direction && pred.direction !== filters.direction) return false;
    if (filters.sector && !pred.sector_name.toLowerCase().includes(filters.sector.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen page-shell pt-20 p-4">
        <div className="container-custom">
          <Skeleton className="h-12 w-48 mb-8" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen page-shell pt-20 p-4 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <p className="text-white/70">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-shell pt-20 p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-10 -right-48 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">Prediction History</h1>
          <p className="text-current/70">Historical sector signals and AI predictions</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 flex gap-4 flex-wrap"
        >
          <select
            value={filters.direction}
            onChange={(e) => setFilters({ ...filters, direction: e.target.value })}
            className="input-field max-w-xs"
          >
            <option value="">All Directions</option>
            <option value="rise">Uptrend</option>
            <option value="fall">Downtrend</option>
            <option value="neutral">Neutral</option>
          </select>
          <input
            type="text"
            placeholder="Filter by sector..."
            value={filters.sector}
            onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
            className="input-field max-w-xs"
          />
        </motion.div>

        {/* Predictions Table */}
        <motion.div
          variants={staggerContainerVariants(0.05)}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {filteredPredictions.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-white/60">No predictions found</p>
            </Card>
          ) : (
            filteredPredictions.map((pred, i) => {
              const Icon = pred.direction === 'rise' ? TrendingUp : pred.direction === 'fall' ? TrendingDown : null;
              const directionColor = pred.direction === 'rise' ? 'text-green-400' : pred.direction === 'fall' ? 'text-red-400' : 'text-gray-400';
              return (
                <motion.div
                  key={i}
                  variants={fadeUpVariants}
                  whileHover={{ x: 4 }}
                >
                  <Card className="cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {Icon && <Icon size={18} className={directionColor} />}
                          <h3 className="text-lg font-semibold text-white">{pred.sector_name}</h3>
                          <Badge variant={pred.direction === 'rise' ? 'success' : 'danger'}>
                            {pred.confidence}%
                          </Badge>
                        </div>
                        <p className="text-white/70 text-sm mb-1">{pred.reasoning}</p>
                        <p className="text-xs text-white/50">{formatDate(pred.created_at)}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HistoryPage;


