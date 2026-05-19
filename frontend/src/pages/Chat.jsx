import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Loader,
  AlertCircle,
  MessageCircle,
  X,
  Trash2,
  Plus,
  ChevronRight,
  ChevronLeft,
  Search,
} from 'lucide-react';
import { Button, Card, Badge } from '../components/ui/index';
import { apiService } from '../api/client';
import { fadeUpVariants, staggerContainerVariants } from '../utils/animations';
import { useChatStore } from '../stores/chatStore';

const formatTime = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '';
  }
};

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
};

const renderMarkdown = (text) => {
  if (!text) return '';
  const escapeHtml = (value) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const escaped = escapeHtml(text);
  const codeBlocks = escaped.replace(/```([\s\S]*?)```/g, (match, content) => {
    return `<pre class="overflow-x-auto rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-4 text-sm text-[var(--text)]">${content}</pre>`;
  });
  const inlineCode = codeBlocks.replace(/`([^`]+)`/g, '<code class="rounded border border-[var(--surface-border)] bg-[var(--surface-soft)] px-1 py-0.5 text-[var(--text)]">$1</code>');
  const paragraphs = inlineCode.split(/\n{2,}/g).map((block) => block.replace(/\n/g, '<br/>'));
  return paragraphs.map((block) => `<p class="mb-3 last:mb-0 text-[0.95rem] leading-7">${block}</p>`).join('');
};

const Chat = () => {
  const {
    conversations,
    activeConversationId,
    sidebarOpen,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    setError,
    setLoading,
    toggleSidebar,
    setSidebarOpen,
    createNewConversation,
    setActiveConversationId,
    addMessage,
    updateConversationTitle,
    setDraft,
    deleteConversation,
  } = useChatStore();

  const messagesEndRef = useRef(null);

  const activeConversation = useMemo(
    () => conversations.find((conv) => conv.id === activeConversationId) || conversations[0] || null,
    [conversations, activeConversationId]
  );

  const filteredConversations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return conversations;
    return conversations.filter((conversation) => {
      const titleMatch = conversation.title.toLowerCase().includes(query);
      const messageMatch = conversation.messages.some((message) => message.text.toLowerCase().includes(query));
      return titleMatch || messageMatch;
    });
  }, [conversations, searchQuery]);

  const draft = activeConversation?.draft ?? '';
  const messages = activeConversation?.messages ?? [];
  const conversationTitle = activeConversation?.title ?? 'New Chat';

  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, [activeConversationId, conversations, setActiveConversationId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
    return () => clearTimeout(timer);
  }, [messages.length, activeConversationId, isLoading]);

  const handleNewChat = useCallback(() => {
    const conversation = createNewConversation();
    setSearchQuery('');
    setSidebarOpen(true);
    setError('');
    if (conversation?.id) {
      setActiveConversationId(conversation.id);
    }
  }, [createNewConversation, setActiveConversationId, setError, setSearchQuery, setSidebarOpen]);

  const handleSwitchConversation = useCallback(
    (conversationId) => {
      setActiveConversationId(conversationId);
      setSidebarOpen(false);
      setError('');
    },
    [setActiveConversationId, setError, setSidebarOpen]
  );

  const handleDeleteConversation = useCallback(
    (conversationId, event) => {
      event.stopPropagation();
      if (!window.confirm('Delete this conversation?')) return;
      deleteConversation(conversationId);
      setError('');
    },
    [deleteConversation, setError]
  );

  const handleDraftChange = useCallback(
    (value) => {
      if (!activeConversation) return;
      setDraft(activeConversation.id, value);
    },
    [activeConversation, setDraft]
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!activeConversation) return;
      const trimmed = draft.trim();
      if (!trimmed || isLoading) return;

      setError('');
      setLoading(true);

      const newUserMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        text: trimmed,
        timestamp: new Date().toISOString(),
        sources: [],
      };

      addMessage(activeConversation.id, newUserMessage);
      setDraft(activeConversation.id, '');

      if (activeConversation.messages.length === 0 && conversationTitle === 'New Chat') {
        const title = trimmed.length > 50 ? `${trimmed.slice(0, 50)}...` : trimmed;
        updateConversationTitle(activeConversation.id, title);
      }

      const historyPayload = [...activeConversation.messages, newUserMessage].map((message) => ({
        role: message.role,
        text: message.text,
      }));

      try {
        const response = await apiService.chatWithAI(trimmed, historyPayload);
        const answer = response?.data?.answer;
        if (!answer) {
          throw new Error('Empty response from server');
        }

        addMessage(activeConversation.id, {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: answer,
          timestamp: new Date().toISOString(),
          sources: response.data.sources || [],
        });
      } catch (err) {
        console.error('Chat error:', err);
        const errorMessage = err?.response?.data?.detail || err?.message || 'Failed to get a response.';
        setError(`Error: ${errorMessage}`);
        addMessage(activeConversation.id, {
          id: `error-${Date.now()}`,
          role: 'assistant',
          text: `Sorry, I encountered an error: ${errorMessage}`,
          timestamp: new Date().toISOString(),
          sources: [],
        });
      } finally {
        setLoading(false);
      }
    },
    [activeConversation, addMessage, conversationTitle, draft, isLoading, setDraft, setError, setLoading, updateConversationTitle]
  );

  return (
    <div className="h-screen overflow-hidden theme-bg text-[var(--text)]">
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden px-3 pb-0 pt-4 lg:px-6">
        <aside className={`fixed inset-y-[4rem] left-0 z-40 w-full max-w-sm transform border-r theme-border bg-[var(--surface)] shadow-lg transition-transform duration-300 ease-out md:relative md:translate-x-0 md:w-72 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex h-full min-h-0 flex-col">
            <div className="flex items-center justify-between border-b theme-border px-4 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">AI Chats</p>
                <h2 className="mt-1 text-lg font-semibold text-[var(--text)]">Conversations</h2>
              </div>
              <Button onClick={handleNewChat} className="hidden items-center gap-2 rounded-full bg-sky-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-400 md:inline-flex">
                <Plus size={14} /> New
              </Button>
            </div>

            <div className="border-b theme-border p-4">
              <div className="relative">
                <Search size={16} className="pointer-events-none absolute left-3 top-3 text-[var(--text-muted)]" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search chats"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-3 min-h-0">
              {filteredConversations.length === 0 ? (
                <div className="rounded-3xl border border-dashed theme-border bg-[var(--surface-soft)] p-6 text-center text-[var(--text-muted)]">
                  No chats found.
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredConversations.map((conversation) => {
                    const isActive = conversation.id === activeConversation?.id;
                    return (
                      <button
                        key={conversation.id}
                        type="button"
                        onClick={() => handleSwitchConversation(conversation.id)}
                        className={`group flex w-full flex-col gap-2 rounded-3xl border px-4 py-4 text-left transition ${isActive ? 'border-sky-500 bg-[rgba(96,132,255,0.12)] shadow-sm' : 'border-[var(--surface-border)] bg-[var(--surface-soft)] hover:border-[var(--surface-border)] hover:bg-[var(--surface)]'}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[var(--text)]">{conversation.title}</p>
                            <p className="mt-1 text-xs text-[var(--text-muted)] line-clamp-2">{conversation.messages.at(-1)?.text || 'Start a new conversation'}</p>
                          </div>
                          <button
                            type="button"
                            onClick={(event) => handleDeleteConversation(conversation.id, event)}
                            className="text-[var(--text-muted)] opacity-0 transition group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                          <span>{formatDate(conversation.updatedAt)}</span>
                          <span>•</span>
                          <span>{conversation.messages.length} messages</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </aside>

        <main className="ml-0 flex w-full flex-1 flex-col overflow-hidden md:ml-72 md:px-4 lg:px-6">
          <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border theme-border bg-[var(--surface)] shadow-xl">
            <div className="flex items-center justify-between border-b theme-border px-6 py-4">
              <div className="flex items-center gap-3">
                <Button
                  onClick={toggleSidebar}
                  variant="secondary"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border theme-border bg-[var(--surface-soft)] text-[var(--text-muted)] md:hidden"
                >
                  <ChevronRight size={18} className={`${sidebarOpen ? 'rotate-180' : ''} transition-transform`} />
                </Button>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">Active chat</p>
                  <h1 className="text-xl font-semibold text-[var(--text)]">{conversationTitle}</h1>
                </div>
              </div>
              <Button onClick={handleNewChat} className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-400">
                <Plus size={14} /> New Chat
              </Button>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden px-4 py-5 md:px-6">
              <motion.div
                ref={messagesEndRef}
                variants={staggerContainerVariants(0.05)}
                initial="hidden"
                animate="visible"
                className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto pr-1"
              >
                {messages.length === 0 ? (
                  <motion.div
                    variants={fadeUpVariants}
                    className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-dashed theme-border bg-[var(--surface-soft)] px-8 py-10 text-center"
                  >
                    <MessageCircle size={48} className="mb-4 text-sky-500/70" />
                    <h2 className="text-xl font-semibold text-[var(--text)]">Your assistant is ready</h2>
                    <p className="mt-2 max-w-lg text-sm text-[var(--text-muted)]">
                      Ask a question to start a new conversation. Your chat history and draft are saved automatically.
                    </p>
                  </motion.div>
                ) : (
                  messages.map((message) => {
                    const isUser = message.role === 'user';
                    return (
                      <motion.div key={message.id} variants={fadeUpVariants} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[90%] rounded-[28px] border px-5 py-4 shadow-sm ${isUser ? 'bg-sky-500/95 text-slate-950 border-sky-300' : 'bg-[var(--surface-soft)] text-[var(--text)] border theme-border'}`}>
                          {isUser ? (
                            <p className="whitespace-pre-wrap text-sm leading-7">{message.text}</p>
                          ) : (
                            <div className="max-w-none text-sm leading-7 text-[var(--text)]" dangerouslySetInnerHTML={{ __html: renderMarkdown(message.text) }} />
                          )}
                          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-muted)]">
                            <span>{formatTime(message.timestamp)}</span>
                            {message.sources?.length > 0 && (
                              <Badge variant="secondary" className="rounded-full px-2 py-1 text-[11px]">
                                {message.sources.length} source{message.sources.length > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}

                {isLoading && (
                  <motion.div variants={fadeUpVariants} className="flex justify-start">
                    <Card className="border theme-border bg-[var(--surface)] flex items-center gap-3 p-4 rounded-3xl shadow-sm">
                      <Loader size={18} className="animate-spin text-[var(--text-muted)]" />
                      <p className="text-sm text-[var(--text-muted)]">AI is composing your reply…</p>
                    </Card>
                  </motion.div>
                )}

                <div className="h-6" />
              </motion.div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -12, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -12, height: 0 }}
                  className="px-6"
                >
                  <div className="mb-3 rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle size={18} className="text-red-300" />
                        <span>{error}</span>
                      </div>
                      <button onClick={() => setError('')} className="text-red-300 hover:text-red-100">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="sticky bottom-0 z-20 border-t theme-border bg-[var(--surface)]/95 px-4 py-4 backdrop-blur-md md:px-6">
              <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
                <textarea
                  value={draft}
                  onChange={(event) => handleDraftChange(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      handleSubmit(event);
                    }
                  }}
                  placeholder="Ask a question... Shift + Enter for newline"
                  rows={3}
                  disabled={isLoading}
                  className="w-full min-h-[96px] resize-none rounded-[28px] border theme-border bg-[var(--surface-soft)] px-4 py-4 text-sm leading-6 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
                <div className="flex items-end justify-end">
                  <Button
                    type="submit"
                    disabled={isLoading || !draft.trim()}
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-sky-500 px-6 text-sm font-semibold text-white shadow-sm hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
                    {isLoading ? 'Sending' : 'Send'}
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-xs text-[var(--text-muted)]">Draft saved automatically across refreshes and route changes.</p>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;
