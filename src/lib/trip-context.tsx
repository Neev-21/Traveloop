import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Trip, Stop, Activity, PackingItem, Note, Expense } from './mock-data';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

type User = { name: string; email: string; avatar: string; language: string; saved: string[] };

type Ctx = {
  user: User;
  setUser: (u: Partial<User>) => void;
  isAuthed: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string) => Promise<{ error?: string }>;
  loginWithGoogle: () => Promise<{ error?: string }>;
  forgotPassword: (email: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  trips: Trip[];
  getTrip: (id: string) => Trip | undefined;
  addTrip: (t: Omit<Trip, 'id' | 'stops' | 'expenses' | 'packing' | 'notes'>) => string;
  updateTrip: (id: string, patch: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  addStop: (tripId: string, stop: Omit<Stop, 'id' | 'order_index' | 'activities'>) => void;
  reorderStops: (tripId: string, ids: string[]) => void;
  removeStop: (tripId: string, stopId: string) => void;
  addActivity: (tripId: string, stopId: string, a: Omit<Activity, 'id'>) => void;
  removeActivity: (tripId: string, stopId: string, activityId: string) => void;
  togglePack: (tripId: string, itemId: string) => void;
  addPack: (tripId: string, item: Omit<PackingItem, 'id'>) => void;
  removePack: (tripId: string, itemId: string) => void;
  addNote: (tripId: string, content: string, stopId?: string) => void;
  removeNote: (tripId: string, noteId: string) => void;
  setExpense: (tripId: string, e: Expense) => void;
};

const TripContext = createContext<Ctx | null>(null);
const uid = () => (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2);

const DEFAULT_USER: User = { name: 'Traveler', email: '', avatar: '', language: 'English', saved: [] };

async function loadAllTrips(userId: string): Promise<Trip[]> {
  const [tripsRes, stopsRes, actsRes, expRes, packRes, notesRes] = await Promise.all([
    supabase.from('trips').select('*').eq('user_id', userId).order('start_date'),
    supabase.from('stops').select('*').eq('user_id', userId).order('order_index'),
    supabase.from('activities').select('*').eq('user_id', userId),
    supabase.from('expenses').select('*').eq('user_id', userId),
    supabase.from('packing_items').select('*').eq('user_id', userId),
    supabase.from('notes').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
  ]);
  const stops = stopsRes.data ?? [];
  const acts = actsRes.data ?? [];
  const exp = expRes.data ?? [];
  const pack = packRes.data ?? [];
  const notes = notesRes.data ?? [];
  return (tripsRes.data ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    start_date: t.start_date,
    end_date: t.end_date,
    description: t.description ?? '',
    cover_photo: t.cover_photo ?? '',
    stops: stops.filter((s) => s.trip_id === t.id).map((s) => ({
      id: s.id, city_name: s.city_name, country: s.country,
      start_date: s.start_date, end_date: s.end_date, order_index: s.order_index,
      activities: acts.filter((a) => a.stop_id === s.id).map((a) => ({
        id: a.id, name: a.name, type: a.type, cost: Number(a.cost), duration: a.duration, time: a.time,
      })),
    })),
    expenses: exp.filter((e) => e.trip_id === t.id).map((e) => ({
      id: e.id, category: e.category as Expense['category'], amount: Number(e.amount), label: e.label,
    })),
    packing: pack.filter((p) => p.trip_id === t.id).map((p) => ({
      id: p.id, category: p.category, item_name: p.item_name, is_packed: p.is_packed,
    })),
    notes: notes.filter((n) => n.trip_id === t.id).map((n) => ({
      id: n.id, stop_id: n.stop_id ?? undefined, content: n.content, timestamp: n.created_at,
    })),
  }));
}

export function TripProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUserState] = useState<User>(DEFAULT_USER);
  const [loading, setLoading] = useState(true);

  // Auth bootstrap
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) { setTrips([]); setUserState(DEFAULT_USER); }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Load profile + trips when session changes
  useEffect(() => {
    if (!session?.user) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      const userId = session.user.id;
      const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle();
      if (cancelled) return;
      if (profile) {
        setUserState({
          name: profile.name ?? 'Traveler',
          email: profile.email ?? session.user.email ?? '',
          avatar: profile.avatar ?? '',
          language: profile.language ?? 'English',
          saved: profile.saved ?? [],
        });
      } else {
        setUserState({ ...DEFAULT_USER, email: session.user.email ?? '' });
      }
      const loaded = await loadAllTrips(userId);
      if (!cancelled) { setTrips(loaded); setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [session]);

  const userId = session?.user?.id;

  const setUser = (u: Partial<User>) => {
    setUserState((p) => {
      const next = { ...p, ...u };
      if (userId) {
        supabase.from('profiles').update({
          name: next.name, avatar: next.avatar, language: next.language, saved: next.saved,
        }).eq('user_id', userId).then(({ error }) => { if (error) console.error(error); });
      }
      return next;
    });
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  };
  const signup = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    return error ? { error: error.message } : {};
  };
  const loginWithGoogle = async () => {
    const { lovable } = await import('@/integrations/lovable/index');
    const result = await lovable.auth.signInWithOAuth('google', { redirect_uri: window.location.origin });
    if (result.error) return { error: result.error.message ?? 'Sign in failed' };
    return {};
  };
  const forgotPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return error ? { error: error.message } : {};
  };
  const logout = async () => { await supabase.auth.signOut(); };

  const getTrip = useCallback((id: string) => trips.find((t) => t.id === id), [trips]);

  const addTrip: Ctx['addTrip'] = (t) => {
    const id = uid();
    setTrips((p) => [...p, { ...t, id, stops: [], expenses: [], packing: [], notes: [] }]);
    if (userId) supabase.from('trips').insert({
      id, user_id: userId, name: t.name, start_date: t.start_date, end_date: t.end_date,
      description: t.description, cover_photo: t.cover_photo,
    }).then(({ error }) => { if (error) console.error(error); });
    return id;
  };

  const updateTrip: Ctx['updateTrip'] = (id, patch) => {
    setTrips((p) => p.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    if (userId) {
      const dbPatch: { name?: string; start_date?: string; end_date?: string; description?: string; cover_photo?: string } = {};
      if (patch.name !== undefined) dbPatch.name = patch.name;
      if (patch.start_date !== undefined) dbPatch.start_date = patch.start_date;
      if (patch.end_date !== undefined) dbPatch.end_date = patch.end_date;
      if (patch.description !== undefined) dbPatch.description = patch.description;
      if (patch.cover_photo !== undefined) dbPatch.cover_photo = patch.cover_photo;
      if (Object.keys(dbPatch).length) {
        supabase.from('trips').update(dbPatch).eq('id', id).then(({ error }) => { if (error) console.error(error); });
      }
    }
  };

  const deleteTrip = (id: string) => {
    setTrips((p) => p.filter((t) => t.id !== id));
    supabase.from('trips').delete().eq('id', id).then(({ error }) => { if (error) console.error(error); });
  };

  const addStop: Ctx['addStop'] = (tripId, s) => {
    const id = uid();
    let order = 0;
    setTrips((p) => p.map((t) => {
      if (t.id !== tripId) return t;
      order = t.stops.length;
      return { ...t, stops: [...t.stops, { ...s, id, order_index: order, activities: [] }] };
    }));
    if (userId) supabase.from('stops').insert({
      id, trip_id: tripId, user_id: userId, city_name: s.city_name, country: s.country,
      start_date: s.start_date, end_date: s.end_date, order_index: order,
    }).then(({ error }) => { if (error) console.error(error); });
  };

  const reorderStops: Ctx['reorderStops'] = (tripId, ids) => {
    setTrips((p) => p.map((t) => t.id === tripId
      ? { ...t, stops: ids.map((id, i) => ({ ...t.stops.find((s) => s.id === id)!, order_index: i })) }
      : t));
    ids.forEach((id, i) => {
      supabase.from('stops').update({ order_index: i }).eq('id', id).then(({ error }) => { if (error) console.error(error); });
    });
  };

  const removeStop: Ctx['removeStop'] = (tripId, stopId) => {
    setTrips((p) => p.map((t) => (t.id === tripId ? { ...t, stops: t.stops.filter((s) => s.id !== stopId) } : t)));
    supabase.from('stops').delete().eq('id', stopId).then(({ error }) => { if (error) console.error(error); });
  };

  const addActivity: Ctx['addActivity'] = (tripId, stopId, a) => {
    const id = uid();
    setTrips((p) => p.map((t) => t.id === tripId
      ? { ...t, stops: t.stops.map((s) => s.id === stopId ? { ...s, activities: [...s.activities, { ...a, id }] } : s) }
      : t));
    if (userId) supabase.from('activities').insert({
      id, stop_id: stopId, trip_id: tripId, user_id: userId,
      name: a.name, type: a.type, cost: a.cost, duration: a.duration, time: a.time,
    }).then(({ error }) => { if (error) console.error(error); });
  };

  const removeActivity: Ctx['removeActivity'] = (tripId, stopId, aid) => {
    setTrips((p) => p.map((t) => t.id === tripId
      ? { ...t, stops: t.stops.map((s) => s.id === stopId ? { ...s, activities: s.activities.filter((x) => x.id !== aid) } : s) }
      : t));
    supabase.from('activities').delete().eq('id', aid).then(({ error }) => { if (error) console.error(error); });
  };

  const togglePack: Ctx['togglePack'] = (tripId, itemId) => {
    let nextVal = false;
    setTrips((p) => p.map((t) => {
      if (t.id !== tripId) return t;
      return { ...t, packing: t.packing.map((i) => {
        if (i.id !== itemId) return i;
        nextVal = !i.is_packed;
        return { ...i, is_packed: nextVal };
      }) };
    }));
    supabase.from('packing_items').update({ is_packed: nextVal }).eq('id', itemId).then(({ error }) => { if (error) console.error(error); });
  };

  const addPack: Ctx['addPack'] = (tripId, item) => {
    const id = uid();
    setTrips((p) => p.map((t) => (t.id === tripId ? { ...t, packing: [...t.packing, { ...item, id }] } : t)));
    if (userId) supabase.from('packing_items').insert({
      id, trip_id: tripId, user_id: userId,
      category: item.category, item_name: item.item_name, is_packed: item.is_packed,
    }).then(({ error }) => { if (error) console.error(error); });
  };

  const removePack: Ctx['removePack'] = (tripId, itemId) => {
    setTrips((p) => p.map((t) => (t.id === tripId ? { ...t, packing: t.packing.filter((i) => i.id !== itemId) } : t)));
    supabase.from('packing_items').delete().eq('id', itemId).then(({ error }) => { if (error) console.error(error); });
  };

  const addNote: Ctx['addNote'] = (tripId, content, stopId) => {
    const id = uid();
    const ts = new Date().toISOString();
    setTrips((p) => p.map((t) => (t.id === tripId
      ? { ...t, notes: [{ id, content, stop_id: stopId, timestamp: ts }, ...t.notes] }
      : t)));
    if (userId) supabase.from('notes').insert({
      id, trip_id: tripId, user_id: userId, content, stop_id: stopId ?? null,
    }).then(({ error }) => { if (error) console.error(error); });
  };

  const removeNote: Ctx['removeNote'] = (tripId, noteId) => {
    setTrips((p) => p.map((t) => (t.id === tripId ? { ...t, notes: t.notes.filter((n) => n.id !== noteId) } : t)));
    supabase.from('notes').delete().eq('id', noteId).then(({ error }) => { if (error) console.error(error); });
  };

  const setExpense: Ctx['setExpense'] = (tripId, e) => {
    setTrips((p) => p.map((t) => {
      if (t.id !== tripId) return t;
      const exists = t.expenses.find((x) => x.category === e.category);
      return {
        ...t,
        expenses: exists ? t.expenses.map((x) => (x.category === e.category ? e : x)) : [...t.expenses, e],
      };
    }));
    if (userId) supabase.from('expenses').upsert({
      trip_id: tripId, user_id: userId, category: e.category, amount: e.amount, label: e.label,
    }, { onConflict: 'trip_id,category' }).then(({ error }) => { if (error) console.error(error); });
  };

  return (
    <TripContext.Provider
      value={{
        user, setUser, isAuthed: !!session, loading,
        login, signup, loginWithGoogle, forgotPassword, logout,
        trips, getTrip, addTrip, updateTrip, deleteTrip,
        addStop, reorderStops, removeStop,
        addActivity, removeActivity,
        togglePack, addPack, removePack,
        addNote, removeNote, setExpense,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const c = useContext(TripContext);
  if (!c) throw new Error('useTrips must be used inside TripProvider');
  return c;
}
