import { createClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || 'https://uksandvhgxacieurpuzc.supabase.co';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || 'sb_publishable_bVvi1ibi5sFySZtT1i4s0Q_clFcbKIA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export function subscribeToRealtime(onUpdate: () => void) {
  if (!isSupabaseConfigured) return () => {};

  const channel = supabase
    .channel('realtime-dashboard-changes')
    .on('postgres_changes', { event: '*', schema: 'public' }, () => {
      onUpdate();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
