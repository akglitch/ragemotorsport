'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import SubscribeModal from '@/components/vault/SubscribeModal';
import AuthModal from '@/components/auth/AuthModal';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface UserContextValue {
  user: User | null;
  isPremium: boolean;
  hydrated: boolean;
  openSubscribe: () => void;
  closeSubscribe: () => void;
  openAuth: () => void;
  closeAuth: () => void;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const supabase = createClient();

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', userId)
      .single();
    setIsPremium(!!data?.is_premium);
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setHydrated(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsPremium(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, fetchProfile]);

  const signOut = async () => { await supabase.auth.signOut(); };
  const openSubscribe = useCallback(() => setSubscribeOpen(true), []);
  const closeSubscribe = useCallback(() => setSubscribeOpen(false), []);
  const openAuth = useCallback(() => setAuthOpen(true), []);
  const closeAuth = useCallback(() => setAuthOpen(false), []);

  return (
    <UserContext.Provider value={{ user, isPremium, hydrated, openSubscribe, closeSubscribe, openAuth, closeAuth, signOut }}>
      {children}
      <AuthModal
        open={authOpen}
        onClose={closeAuth}
        onSuccess={() => setAuthOpen(false)}
      />
      <SubscribeModal
        open={subscribeOpen}
        onClose={closeSubscribe}
        onSubscribed={() => { setIsPremium(true); setSubscribeOpen(false); }}
      />
    </UserContext.Provider>
  );
}
