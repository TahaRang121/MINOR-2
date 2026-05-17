import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, TrendingUp, TrendingDown, Clock3, MapPin, Shield } from 'lucide-react';
import { Button, Card, Badge, Skeleton } from '../components/ui/index';
import { PredictionCard } from '../components/cards/EventCard';
import { apiService } from '../api/client';
import { fadeUpVariants, formatDateTime } from '../utils/animations';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await apiService.getEvent(id);
        setEvent(res.data);
      } catch (err) {
        setError('Failed to load event details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (!event) return;
    const fetchRelated = async () => {
      try {
        const res = await apiService.getEvents({ category: event.category, limit: 4 });
        setRelated((res.data || []).filter((item) => item.id !== event.id).slice(0, 3));
      } catch (err) {
        console.warn('Failed to fetch related events', err);
      }
    };
    fetchRelated();
  }, [event]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-primary-950/20 to-dark-950 pt-20 p-4">
        <div className="container-custom">
          <Skeleton className="h-12 w-32 mb-8" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-primary-950/20 to-dark-950 pt-20 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/70 mb-4">{error || 'Event not found'}</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const predictions = event.predictions || [];
  const uptrends = predictions.filter((p) => p.direction === 'rise').length;
  const downtrends = predictions.filter((p) => p.direction === 'fall').length;
  const eventStatus = event.severity === 'High' ? 'Escalating' : event.severity === 'Medium' ? 'Under watch' : 'Contained';

  return (
    <div className="min-h-screen page-shell pt-20 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ x: [0, -30, 0], y: [0, 30, 0] }} transition={{ duration: 22, repeat: Infinity }} className="absolute top-8 left-8 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </motion.button>

        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <Card className="space-y-8 overflow-safe surface-panel">
            <div className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white break-words">{event.title}</h1>
                    <p className="text-white/60 mt-2 max-w-2xl break-words leading-relaxed">{event.summary}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Badge variant={event.severity === 'High' ? 'danger' : event.severity === 'Medium' ? 'warning' : 'success'}>{event.severity}</Badge>
                  <Badge variant="secondary">{event.category}</Badge>
                  <Badge variant="primary">{eventStatus}</Badge>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl surface-panel p-4">
                  <div className="text-current/70 text-xs uppercase tracking-[0.2em] mb-3">Location</div>
                  <div className="text-current font-semibold">{event.location}</div>
                </div>
                <div className="rounded-3xl surface-panel p-4">
                  <div className="text-current/70 text-xs uppercase tracking-[0.2em] mb-3">Published</div>
                  <div className="text-current font-semibold">{formatDateTime(event.published_at)}</div>
                </div>
                <div className="rounded-3xl surface-panel p-4">
                  <div className="text-current/70 text-xs uppercase tracking-[0.2em] mb-3">Created</div>
                  <div className="text-current font-semibold">{formatDateTime(event.created_at)}</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <section className="rounded-3xl surface-panel p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield size={20} className="text-primary-400" />
                  <h2 className="text-xl font-semibold text-current">Event Timeline</h2>
                </div>
                <div className="space-y-4 text-current/70">
                  <div className="rounded-2xl surface-panel p-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary-400 mb-2">Published</div>
                    <div>{formatDateTime(event.published_at)}</div>
                    <p className="mt-2 text-sm text-current/70">Initial report published and shared with analysts.</p>
                  </div>
                  <div className="rounded-2xl surface-panel p-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary-400 mb-2">Created</div>
                    <div>{formatDateTime(event.created_at)}</div>
                    <p className="mt-2 text-sm text-current/70">Event was logged and sector predictions were generated.</p>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl surface-panel p-6 overflow-safe text-break">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock3 size={20} className="text-secondary-400" />
                    <h2 className="text-xl font-semibold text-current">Related Reports</h2>
                  </div>
                  {event.source_url ? (
                    <a href={event.source_url} target="_blank" rel="noreferrer" className="block text-primary-400 hover:text-primary-300 text-sm break-all">{event.source_url}</a>
                  ) : (
                    <p className="text-current/70">No external source available.</p>
                  )}
                </div>
                <div className="rounded-3xl surface-panel p-6 overflow-safe text-break">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin size={20} className="text-green-400" />
                    <h2 className="text-xl font-semibold text-current">Scope & Priority</h2>
                  </div>
                  <p className="text-current/70">Event name: <span className="font-semibold text-current break-words">{event.event_name}</span></p>
                  <p className="text-current/70 mt-3">Severity-based priority and location monitoring are active for this event.</p>
                </div>
              </section>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="!p-6">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-xl font-semibold text-white">AI Intelligence</h2>
                  <p className="text-white/60">Prediction confidence and analysis for this event.</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full surface-panel px-3 py-1 border text-current/70 text-sm">
                  <TrendingUp size={16} className="text-green-400" />
                  {uptrends} rises
                </div>
              </div>
              <div className="grid gap-4">
                {predictions.length > 0 ? (
                  predictions.map((pred) => (
                    <PredictionCard key={pred.id} prediction={pred} />
                  ))
                ) : (
                  <p className="text-white/60">There are no AI predictions available for this event yet.</p>
                )}
              </div>
            </Card>

            <Card className="!p-6">
              <h2 className="text-xl font-semibold text-white mb-5">Similar Alerts</h2>
              <div className="space-y-4">
                {related.length > 0 ? related.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(`/events/${item.id}`)}
                    className="w-full text-left rounded-3xl surface-panel p-4 hover:border-primary-500/40 transition"
                  >
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-sm text-white/60 mt-1">{item.category} · {item.location}</p>
                  </button>
                )) : (
                  <p className="text-white/60">No similar alerts found for this category.</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;


