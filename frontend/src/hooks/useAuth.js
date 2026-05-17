import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/store';

export const useAuth = () => {
  const {
    user,
    token,
    theme,
    notificationSettings,
    privacySettings,
    isLoading,
    error,
    setUser,
    setToken,
    setTheme,
    setNotificationSettings,
    setPrivacySettings,
    addUser,
    logout,
  } = useAuthStore();

  return {
    user,
    token,
    theme,
    notificationSettings,
    privacySettings,
    isLoading,
    error,
    setUser,
    setToken,
    setTheme,
    setNotificationSettings,
    setPrivacySettings,
    addUser,
    logout,
    isAuthenticated: !!token,
  };
};

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
};
