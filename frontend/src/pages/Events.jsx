import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../api/client';
import { Card, Input, Select, Skeleton } from '../components/ui';
import { EventCard } from '../components/cards/EventCard';
import { fadeUpVariants, staggerContainerVariants } from '../utils/animations';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('recent');
  const navigate = useNavigate();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await apiService.getEvents({ limit: 100 });
      setEvents(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const categoryOptions = useMemo(() => [
    { label: 'All categories', value: '' },
    ...Array.from(new Set(events.map((event) => event.category))).map((category) => ({ label: category, value: category })),
  ], [events]);

  const filtered = useMemo(() => {
    return events
      .filter((event) => !category || event.category === category)
      .filter((event) => {
        const phrase = query.toLowerCase();
        return (
          event.title.toLowerCase().includes(phrase) ||
          event.summary.toLowerCase().includes(phrase) ||
          event.location.toLowerCase().includes(phrase)
        );
      })
      .sort((a, b) => {
        if (sort === 'recent') return new Date(b.published_at) - new Date(a.published_at);
        if (sort === 'severity') return a.severity.localeCompare(b.severity);
        return 0;
      });
  }, [events, query, category, sort]);

  const statusText = (severity) => {
    if (severity === 'High') return 'Escalating';
    if (severity === 'Medium') return 'Monitoring';
    return 'Stable';
  };

  return (
    <div className="min-h-screen page-shell pt-20 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ x: [0, 30, 0], y: [0, -30, 0] }} transition={{ duration: 18, repeat: Infinity }} className="absolute top-10 right-10 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      </div>
      <div className="container-custom relative z-10">
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-primary-400 mb-3">Market alerts</p>
          <h1 className="text-5xl font-bold text-white">Event Intelligence</h1>
          <p className="text-white/60 mt-3 max-w-2xl">Explore all crisis events in one place with predictive analysis, severity labels, and location details.</p>
        </motion.div>

        <motion.div variants={fadeUpVariants} initial="hidden" animate="visible" className="grid grid-cols-1 xl:grid-cols-[1.5fr_280px] gap-6 mb-8">
          <Card className="!p-6 surface-panel">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-primary-400 mb-3">Refine results</p>
                <h2 className="text-2xl font-semibold text-current">Search, sort and filter</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full surface-panel px-4 py-2 text-sm text-current/70">
                <SlidersHorizontal size={16} />
                Advanced controls
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
                <Input className="pl-12" placeholder="Search events" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <div className="relative">
                <Select className="pr-10" options={categoryOptions} value={category} onChange={(e) => setCategory(e.target.value)} />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/50">▾</span>
              </div>
              <div className="relative">
                <Select className="pr-10" options={[
                  { label: 'Sort by recent', value: 'recent' },
                  { label: 'Sort by severity', value: 'severity' },
                  { label: 'Sort by title', value: 'title' },
                ]} value={sort} onChange={(e) => setSort(e.target.value)} />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/50">▾</span>
              </div>
            </div>
          </Card>
          <Card className="!p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Explorer snapshot</h2>
              <p className="text-white/60 mt-2">{filtered.length} events found{query ? ` for "${query}"` : ''}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="rounded-3xl surface-panel p-4">
                <p className="text-sm text-current/70">Critical alerts</p>
                <p className="text-2xl font-semibold text-current mt-2">{events.filter((event) => event.severity === 'High').length}</p>
              </div>
              <div className="rounded-3xl surface-panel p-4">
                <p className="text-sm text-current/70">Predictions</p>
                <p className="text-2xl font-semibold text-current mt-2">{events.reduce((sum, event) => sum + (event.predictions?.length || 0), 0)}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-64 rounded-3xl" />
            ))}
          </div>
        ) : (
          <motion.div variants={staggerContainerVariants(0.05)} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((event) => (
              <EventCard
                key={event.id}
                event={{ ...event, status: statusText(event.severity) }}
                onClick={() => navigate(`/events/${event.id}`)}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
