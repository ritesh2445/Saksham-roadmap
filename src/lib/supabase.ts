import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Types ────────────────────────────────────────────────────────────────────

export type WeekState = {
  done: Record<string, boolean>;
  reflection: string;
  mood: string;
  completed: boolean;
};

export type AppProfile = {
  id: string; // = auth user id
  start_date: string;
  xp: number;
  streak: number;
  last_check_in: string | null;
  weeks: Record<number, WeekState>;
  habits: Record<string, string[]>; // habitId -> ISO date strings
  mood_entries: { id: string; date: string; mood: string; note: string }[];
  milestones: Record<string, boolean>;
  unlocked_letters: number[];
  projects: Record<string, { progress: number; notes: string; deployed: boolean }>;
  settings: {
    theme: "dream" | "sunset" | "night";
    mascot: "bunny" | "ghost" | "star";
    sparkles: boolean;
  };
  contacts?: {
    github: string;
    linkedin: string;
    email: string;
    resume: string;
  };
  updated_at?: string;
};

export const defaultProfile = (userId: string): AppProfile => ({
  id: userId,
  start_date: new Date().toISOString(),
  xp: 0,
  streak: 0,
  last_check_in: null,
  weeks: {},
  habits: {},
  mood_entries: [],
  milestones: {},
  unlocked_letters: [0],
  projects: {},
  settings: { theme: "dream", mascot: "bunny", sparkles: true },
  contacts: {
    github: "https://github.com/saksham",
    linkedin: "https://linkedin.com/in/saksham",
    email: "saksham@example.com",
    resume: "#"
  }
});

// ── Resilient DB helpers (Supports silent local fallback on network errors) ────────────────────────────────

export async function fetchProfile(userId: string): Promise<AppProfile> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error && data) {
      // Sync local backup too
      localStorage.setItem(`saksham_profile_${userId}`, JSON.stringify(data));
      return data as AppProfile;
    }
  } catch (e) {
    console.warn("Supabase fetch failed, trying local storage fallback:", e);
  }

  // Local Storage fallback on network failure or if row doesn't exist
  const localData = localStorage.getItem(`saksham_profile_${userId}`);
  if (localData) {
    try {
      return JSON.parse(localData) as AppProfile;
    } catch (e) {
      console.error("Local profile backup is corrupted:", e);
    }
  }

  // First time — create and save locally & remotely
  const profile = defaultProfile(userId);
  await upsertProfile(profile);
  return profile;
}

export async function upsertProfile(profile: AppProfile): Promise<void> {
  // Always update local cache immediately for speed and backup
  localStorage.setItem(`saksham_profile_${profile.id}`, JSON.stringify(profile));

  try {
    const { error } = await supabase
      .from("profiles")
      .upsert({ ...profile, updated_at: new Date().toISOString() });
    if (error) console.error("upsertProfile error:", error);
  } catch (e) {
    console.warn("Supabase save failed (running offline), progress saved locally:", e);
  }
}
