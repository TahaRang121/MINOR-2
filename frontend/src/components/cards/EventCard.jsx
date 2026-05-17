import React from 'react';
import { motion } from 'framer-motion';
import { Badge, Card } from '../ui';
import { formatDate, getSeverityColor, getSeverityBgColor, getCategoryColor, fadeUpVariants } from '../../utils/animations';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const EventCard = ({ event, onClick }) => {
  const predictions = event.predictions || [];
  const uptrends = predictions.filter(p => p.direction === 'rise').length;
  const downtrends = predictions.filter(p => p.direction === 'fall').length;

  const eventStatus = event.status || (event.severity === 'High' ? 'Escalating' : event.severity === 'Medium' ? 'Monitoring' : 'Stable');
  const topPrediction = predictions?.[0];

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card hoverable className="overflow-safe">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-current line-clamp-2 hover:text-primary-400 transition-colors break-words">
                {event.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-sm font-medium">
                <span className={`${getCategoryColor(event.category)} uppercase tracking-[0.12em]`}>{event.category}</span>
                <span className="text-current/50">•</span>
                <span className="text-current/60">{eventStatus}</span>
              </div>
            </div>
            <Badge
              variant={event.severity === 'High' ? 'danger' : event.severity === 'Medium' ? 'warning' : 'success'}
            >
              {event.severity}
            </Badge>
          </div>

          {/* Summary */}
          <p className="text-current/70 text-sm leading-6 line-clamp-3 break-words">
            {event.summary}
          </p>

          {/* Location & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-current/50">
            <p>📍 {event.location}</p>
            <p>📅 {formatDate(event.published_at)}</p>
          </div>

          {topPrediction && (
            <div className="rounded-2xl surface-panel p-3 text-sm text-current/70 overflow-safe text-break">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="font-semibold text-current">AI Prediction</span>
                <Badge variant={topPrediction.direction === 'rise' ? 'success' : topPrediction.direction === 'fall' ? 'danger' : 'secondary'}>
                  {topPrediction.confidence}%
                </Badge>
              </div>
              <p className="line-clamp-2 break-words">{topPrediction.reasoning}</p>
            </div>
          )}

          {predictions.length > 0 && (
            <div className="flex items-center gap-3 text-xs text-current/60 border-t border-white/10 pt-3">
              <div className="flex items-center gap-1">
                <TrendingUp size={14} className="text-green-400" />
                <span>{uptrends} rise</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown size={14} className="text-red-400" />
                <span>{downtrends} fall</span>
              </div>
              <span className="ml-auto">{predictions.length} predictions</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export const PredictionCard = ({ prediction }) => {
  const directionColor = prediction.direction === 'rise' ? 'text-green-400' : prediction.direction === 'fall' ? 'text-red-400' : 'text-gray-400';
  const Icon = prediction.direction === 'rise' ? TrendingUp : prediction.direction === 'fall' ? TrendingDown : null;

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
    >
      <Card>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">{prediction.sector_name}</h3>
            <Badge variant={prediction.direction === 'rise' ? 'success' : 'danger'}>
              {prediction.confidence}%
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {Icon && <Icon size={16} className={directionColor} />}
            <span className={`text-sm font-semibold ${directionColor}`}>
              {prediction.direction.toUpperCase()}
            </span>
          </div>

          <p className="text-sm text-white/70">
            {prediction.reasoning}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export const EventDetailModal = ({ event, onClose }) => {
  if (!event) return null;

  const predictions = event.predictions || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass rounded-2xl max-w-2xl w-full p-8"
      >
        {/* Header */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {event.title}
              </h1>
              <p className="text-white/70">
                {event.summary}
              </p>
            </div>
            <motion.button
              whileHover={{ rotate: 90 }}
              onClick={onClose}
              className="text-white/60 hover:text-white text-2xl"
            >
              ✕
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-white/50 uppercase tracking-wider">Category</p>
              <p className="font-semibold text-white">{event.category}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-white/50 uppercase tracking-wider">Severity</p>
              <Badge variant={event.severity === 'High' ? 'danger' : 'warning'}>
                {event.severity}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-white/50 uppercase tracking-wider">Location</p>
              <p className="font-semibold text-white">{event.location}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-white/50 uppercase tracking-wider">Date</p>
              <p className="font-semibold text-white">{formatDate(event.published_at)}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />

          {/* Predictions */}
          {predictions.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Sector Predictions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predictions.map((pred) => (
                  <PredictionCard key={pred.id} prediction={pred} />
                ))}
              </div>
            </div>
          )}

          {/* Source */}
          {event.source_url && (
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Source</p>
              <a
                href={event.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 break-all text-sm"
              >
                {event.source_url}
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
