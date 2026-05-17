import { create } from 'zustand';

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const getStorage = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  const value = window.localStorage.getItem(key);
  return safeParse(value, fallback);
};

const initialUser = getStorage('authUser', null);
const initialUsers = getStorage('authUsers', []);
const initialTheme = (typeof window !== 'undefined' ? window.localStorage.getItem('theme') : null) || 'dark';
const initialNotificationSettings = getStorage('notificationSettings', { email: true, push: true });
const initialPrivacySettings = getStorage('privacySettings', { shareData: false });

export const useAuthStore = create((set, get) => ({
  user: initialUser,
  users: initialUsers,
  token: typeof window !== 'undefined' ? window.localStorage.getItem('authToken') : null,
  theme: initialTheme,
  notificationSettings: initialNotificationSettings,
  privacySettings: initialPrivacySettings,
  isLoading: false,
  error: null,

  setUser: (user) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('authUser', JSON.stringify(user));
    }
    const users = get().users || [];
    const existingIndex = users.findIndex((item) => item.email === user.email);
    const updatedUsers = existingIndex >= 0 ? [...users.slice(0, existingIndex), user, ...users.slice(existingIndex + 1)] : [...users, user];
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('authUsers', JSON.stringify(updatedUsers));
    }
    set({ user, users: updatedUsers });
  },
  addUser: (user) => {
    const users = [...(get().users || []), user];
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('authUsers', JSON.stringify(users));
    }
    set({ users });
  },
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('authToken', token);
    }
    set({ token });
  },
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', theme);
    }
    set({ theme });
  },
  setNotificationSettings: (notificationSettings) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    }
    set({ notificationSettings });
  },
  setPrivacySettings: (privacySettings) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('privacySettings', JSON.stringify(privacySettings));
    }
    set({ privacySettings });
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  logout: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('authToken');
      window.localStorage.removeItem('authUser');
    }
    set({ user: null, token: null, error: null });
  },

  clearError: () => set({ error: null }),
}));

export const useDataStore = create((set) => ({
  events: [],
  predictions: [],
  searchResults: [],
  selectedEvent: null,
  isLoading: false,

  setEvents: (events) => set({ events }),
  setPredictions: (predictions) => set({ predictions }),
  setSearchResults: (searchResults) => set({ searchResults }),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  setIsLoading: (isLoading) => set({ isLoading }),

  clearSearch: () => set({ searchResults: [] }),
}));
