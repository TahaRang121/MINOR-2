import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader, AlertCircle, MessageCircle } from 'lucide-react';
import { Button, Input, Card, Badge } from '../components/ui/index';
import { apiService } from '../api/client';
import { fadeUpVariants, staggerContainerVariants } from '../utils/animations';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [thread, setThread] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || loading) return;

    setError('');
    const newUserMessage = { role: 'user', text: trimmed, timestamp: new Date() };
    setThread((items) => [...items, newUserMessage]);
    setMessage('');
    setLoading(true);

    try {
      const response = await apiService.chatWithAI(trimmed);
      const newAssistantMessage = {
        role: 'assistant',
        text: response.data.answer,
        sources: response.data.sources,
        timestamp: new Date(),
      };
      setThread((items) => [...items, newAssistantMessage]);
    } catch (err) {
      setError('Failed to get response. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen page-shell pt-20 p-4 flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-10 -right-48 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container-custom relative z-10 flex flex-col flex-1 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">AI Chat Assistant</h1>
          <p className="text-current/70">Ask questions about global crises and sector impacts</p>
        </motion.div>

        {/* Chat Window */}
        <motion.div
          variants={staggerContainerVariants(0.05)}
          initial="hidden"
          animate="visible"
          className="flex-1 space-y-4 mb-8 overflow-y-auto"
        >
          {thread.length === 0 && (
            <motion.div variants={fadeUpVariants} className="h-full flex items-center justify-center text-center">
              <div>
                <MessageCircle size={48} className="mx-auto text-primary-400 mb-4 opacity-50" />
                <p className="text-white/60 text-lg">Ask about sectors, events, or recent crisis signals...</p>
              </div>
            </motion.div>
          )}

          {thread.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card className={`max-w-md lg:max-w-lg ${item.role === 'user' ? 'bg-primary-500/30' : 'bg-secondary-500/20'}`}>
                <p className="text-white">{item.text}</p>
                {item.sources && item.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-2">
                    {item.sources.slice(0, 3).map((source) => (
                      <Badge key={source} variant="primary" className="text-xs">
                        Related
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <Card className="bg-secondary-500/20 flex items-center gap-2">
                <Loader size={16} className="animate-spin text-secondary-400" />
                <p className="text-white/80">AI is analyzing...</p>
              </Card>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 flex items-center gap-2 text-sm"
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}

        {/* Input Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="flex gap-2"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about sectors, events, or crisis impact..."
            className="input-field flex-1"
          />
          <Button
            type="submit"
            disabled={loading || !message.trim()}
            className="flex items-center gap-2"
          >
            <Send size={18} />
          </Button>
        </motion.form>
      </div>
    </div>
  );
};

export default Chat;

