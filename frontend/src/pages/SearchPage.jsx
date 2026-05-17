import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Loader, AlertCircle } from 'lucide-react';
import { Button, Input, Card, Skeleton } from '../components/ui/index';
import { EventCard } from '../components/cards/EventCard';
import { apiService } from '../api/client';
import { fadeUpVariants, staggerContainerVariants } from '../utils/animations';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const res = await apiService.searchEvents(query);
      setResults(res.data || []);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

      <div className="container-custom relative z-10 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">Search Events</h1>
          <p className="text-white/60">Find crisis events by keyword or topic</p>
        </motion.div>

        {/* Search Form */}
        <motion.form
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSearch}
          className="mb-12"
        >
          <Card>
            <div className="flex items-center gap-2">
              <Search className="text-primary-400" size={24} />
              <input
                type="text"
                placeholder="Search for crisis events, locations, keywords..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-current placeholder-current/50 outline-none text-lg"
              />
              <Button type="submit" disabled={loading} className="flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Searching
                  </>
                ) : (
                  'Search'
                )}
              </Button>
            </div>
          </Card>
        </motion.form>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 flex items-center gap-2"
          >
            <AlertCircle size={20} />
            {error}
          </motion.div>
        )}

        {/* Results */}
        {loading && (
          <motion.div
            variants={staggerContainerVariants(0.1)}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </motion.div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">No events found for "{query}"</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <motion.div
            variants={staggerContainerVariants(0.05)}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {results.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => navigate(`/events/${event.id}`)}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;


