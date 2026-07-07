import { useEffect, useState, useCallback, useRef } from "react";
import { supabase, AppProfile, fetchProfile, upsertProfile, defaultProfile } from "./supabase";
import type { User } from "@supabase/supabase-js";

// Re-export types for compatibility
export type { WeekState, AppProfile as AppState } from "./supabase";

// ── Auth helpers ──────────────────────────────────────────────────────────────

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return { user, loading };
}

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

export async function signOut() {
  await supabase.auth.signOut();
  window.location.href = "/";
}

// ── Global in-memory store (synced with Supabase) ─────────────────────────────

let listeners: Array<(s: AppProfile) => void> = [];
let current: AppProfile | null = null;
let saveTimeout: ReturnType<typeof setTimeout> | null = null;

function getState(): AppProfile {
  return current ?? defaultProfile("anon");
}

function notifyListeners(s: AppProfile) {
  listeners.forEach((l) => l(s));
}

function scheduleSave(profile: AppProfile) {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    upsertProfile(profile);
  }, 800); // debounce saves by 800ms
}

function setState(updater: (s: AppProfile) => AppProfile) {
  const next = updater(getState());
  current = next;
  notifyListeners(next);
  scheduleSave(next);
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAppState() {
  const [s, setS] = useState<AppProfile>(() => getState());
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const l = (n: AppProfile) => { if (mounted.current) setS(n); };
    listeners.push(l);
    setS(getState());
    return () => {
      mounted.current = false;
      listeners = listeners.filter((x) => x !== l);
    };
  }, []);

  const update = useCallback((u: (s: AppProfile) => AppProfile) => setState(u), []);
  return [s, update] as const;
}

// ── Bootstrap — loads profile from Supabase once user is known ─────────────────

export async function bootstrapProfile(userId: string) {
  const profile = await fetchProfile(userId);
  current = profile;
  notifyListeners(profile);
  return profile;
}

export function clearProfileCache() {
  current = null;
}

// ── Utilities ─────────────────────────────────────────────────────────────────

export function addXP(amount: number) {
  setState((s) => ({ ...s, xp: s.xp + amount }));
}

export function levelFromXP(xp: number) {
  return Math.floor(Math.sqrt(xp / 25)) + 1;
}

export function daysSince(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / 86400000));
}

export function checkInToday() {
  setState((s) => {
    const today = new Date().toDateString();
    if (s.last_check_in === today) return s;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const streak = s.last_check_in === yesterday ? s.streak + 1 : 1;
    return { ...s, last_check_in: today, streak, xp: s.xp + 5 };
  });
}
