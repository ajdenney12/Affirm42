import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface SubscriptionContextType {
  isPremium: boolean;
  loading: boolean;
  refreshSubscription: () => Promise<void>;
  upgradeToPremium: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsPremium(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('is_premium')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const { error: insertError } = await supabase
          .from('user_subscriptions')
          .insert({ user_id: user.id, is_premium: false });

        if (insertError) throw insertError;
        setIsPremium(false);
      } else {
        setIsPremium(data.is_premium || false);
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = async () => {
    setLoading(true);
    await loadSubscription();
  };

  const upgradeToPremium = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          is_premium: true,
          purchase_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setIsPremium(true);
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadSubscription();

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        loadSubscription();
      } else if (event === 'SIGNED_OUT') {
        setIsPremium(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <SubscriptionContext.Provider value={{ isPremium, loading, refreshSubscription, upgradeToPremium }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
