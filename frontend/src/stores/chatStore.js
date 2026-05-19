import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const buildId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `chat-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const nowISO = () => new Date().toISOString();

const createConversation = (title = 'New Chat') => ({
  id: buildId(),
  title,
  createdAt: nowISO(),
  updatedAt: nowISO(),
  messages: [],
  draft: '',
});

export const useChatStore = create(
  persist(
    (set, get) => ({
      conversations: [createConversation()],
      activeConversationId: null,
      sidebarOpen: true,
      isLoading: false,
      error: '',
      searchQuery: '',

      get activeConversation() {
        const { conversations, activeConversationId } = get();
        return conversations.find((conv) => conv.id === activeConversationId) || conversations[0];
      },

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      createNewConversation: (title = 'New Chat') => {
        const conversation = createConversation(title);
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          activeConversationId: conversation.id,
        }));
        return conversation;
      },

      setActiveConversationId: (conversationId) =>
        set((state) => ({
          activeConversationId: conversationId || state.conversations[0]?.id,
        })),

      addMessage: (conversationId, message) =>
        set((state) => ({
          conversations: state.conversations.map((conversation) => {
            if (conversation.id !== conversationId) return conversation;
            return {
              ...conversation,
              messages: [...conversation.messages, message],
              updatedAt: nowISO(),
            };
          }),
        })),

      updateConversationTitle: (conversationId, title) =>
        set((state) => ({
          conversations: state.conversations.map((conversation) =>
            conversation.id === conversationId ? { ...conversation, title, updatedAt: nowISO() } : conversation
          ),
        })),

      setDraft: (conversationId, draft) =>
        set((state) => ({
          conversations: state.conversations.map((conversation) =>
            conversation.id === conversationId ? { ...conversation, draft, updatedAt: nowISO() } : conversation
          ),
        })),

      deleteConversation: (conversationId) =>
        set((state) => {
          const conversations = state.conversations.filter((conversation) => conversation.id !== conversationId);
          const activeConversationId =
            state.activeConversationId === conversationId
              ? conversations[0]?.id ?? null
              : state.activeConversationId;
          return {
            conversations: conversations.length > 0 ? conversations : [createConversation()],
            activeConversationId: activeConversationId || conversations[0]?.id || null,
          };
        }),
    }),
    {
      name: 'chat-store',
      storage: createJSONStorage(() =>
        typeof window === 'undefined' ? undefined : window.localStorage
      ),
    }
  )
);
