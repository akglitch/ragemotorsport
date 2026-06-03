'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import SubscribeModal from '@/components/vault/SubscribeModal';

interface UserContextValue {
  /** Whether the demo user currently has an active Premium Vault membership. */
  isPremium: boolean;
  /** True once localStorage has been read — guards against hydration mismatch. */
  hydrated: boolean;
  setPremium: (value: boolean) => void;
  /** Flip between Free and Premium — used by the header demo toggle. */
  toggle: () => void;
  /** Open the global Subscribe modal from anywhere in the app. */
  openSubscribe: () => void;
  closeSubscribe: () => void;
}

const STORAGE_KEY = 'rage-membership';

const UserContext = createContext<UserContextValue | null>(null);

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);

  useEffect(() => {
    try {
      setIsPremium(localStorage.getItem(STORAGE_KEY) === 'premium');
    } catch {}
    setHydrated(true);
  }, []);

  const setPremium = useCallback((value: boolean) => {
    setIsPremium(value);
    try {
      localStorage.setItem(STORAGE_KEY, value ? 'premium' : 'free');
    } catch {}
  }, []);

  const toggle = useCallback(() => setPremium(!isPremium), [isPremium, setPremium]);
  const openSubscribe = useCallback(() => setSubscribeOpen(true), []);
  const closeSubscribe = useCallback(() => setSubscribeOpen(false), []);

  return (
    <UserContext.Provider value={{ isPremium, hydrated, setPremium, toggle, openSubscribe, closeSubscribe }}>
      {children}
      <SubscribeModal
        open={subscribeOpen}
        onClose={closeSubscribe}
        onSubscribed={() => { setPremium(true); setSubscribeOpen(false); }}
      />
    </UserContext.Provider>
  );
}
