import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { bootstrapProfile, clearProfileCache } from "@/lib/store";

type AuthCtx = {
  user: any | null;
  loading: boolean;
  loginWithPassword: (password: string) => Promise<{ success: boolean; error?: string }>;
};

const AuthContext = createContext<AuthCtx>({
  user: null,
  loading: true,
  loginWithPassword: async () => ({ success: false }),
});

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localAuth = localStorage.getItem("saksham_authenticated") === "true";
    const localFallback = localStorage.getItem("saksham_local_fallback") === "true";

    // If previously fell back to offline local mode
    if (localAuth && localFallback) {
      const u = { id: "saksham_local", email: "local@example.com" };
      setUser(u);
      bootstrapProfile("saksham_local").then(() => setLoading(false));
      return;
    }

    // Try Supabase session first
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      if (u) await bootstrapProfile(u.id);
      setLoading(false);
    }).catch(async (err) => {
      console.warn("Failed to check Supabase session (offline), checking local cache:", err);
      if (localAuth) {
        const u = { id: "saksham_local", email: "local@example.com" };
        setUser(u);
        await bootstrapProfile("saksham_local");
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      if (!u) {
        // If logged out from Supabase but local session is still active, don't clear cache
        if (localStorage.getItem("saksham_authenticated") !== "true") {
          clearProfileCache();
          setUser(null);
        }
      } else {
        localStorage.removeItem("saksham_local_fallback");
        await bootstrapProfile(u.id);
        setUser(u);
      }
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function loginWithPassword(password: string): Promise<{ success: boolean; error?: string }> {
    if (password === "I love to study") {
      try {
        const email = "saksham@example.com";
        const dbPassword = "saksham_universal_passkey_123!";
        
        let data, error;
        try {
          const authRes = await supabase.auth.signInWithPassword({ email, password: dbPassword });
          data = authRes.data;
          error = authRes.error;
        } catch (fetchErr: any) {
          // If network fetch fails, trigger local offline fallback immediately
          console.warn("Supabase auth network fetch failed, using local offline fallback:", fetchErr);
          localStorage.setItem("saksham_authenticated", "true");
          localStorage.setItem("saksham_local_fallback", "true");
          const u = { id: "saksham_local", email: "local@example.com" };
          setUser(u);
          setLoading(true);
          await bootstrapProfile("saksham_local");
          setLoading(false);
          return { success: true };
        }
        
        // If login fails because user doesn't exist, attempt auto-signup
        if (error && (error.message.includes("Invalid login credentials") || error.message.includes("Email not confirmed") || error.message.includes("User not found"))) {
          console.log("Universal account not found, attempting auto signup...");
          try {
            const signupRes = await supabase.auth.signUp({ email, password: dbPassword });
            
            if (signupRes.error) {
              console.error("Supabase automatic sign up error:", signupRes.error);
              return { success: false, error: `Sign up failed: ${signupRes.error.message}` };
            }
            
            // Retry signing in after signup
            const retryRes = await supabase.auth.signInWithPassword({ email, password: dbPassword });
            data = retryRes.data;
            error = retryRes.error;
          } catch (signupFetchErr) {
            console.warn("Supabase signup fetch failed, using local offline fallback:", signupFetchErr);
            localStorage.setItem("saksham_authenticated", "true");
            localStorage.setItem("saksham_local_fallback", "true");
            const u = { id: "saksham_local", email: "local@example.com" };
            setUser(u);
            setLoading(true);
            await bootstrapProfile("saksham_local");
            setLoading(false);
            return { success: true };
          }
        }

        // If other connection/CORS errors occur
        if (error || !data?.session?.user) {
          const isFetchError = error?.message?.includes("fetch") || error?.message?.includes("NetworkError") || error?.status === 0;
          if (isFetchError) {
            console.warn("Supabase is offline, using local offline fallback...");
            localStorage.setItem("saksham_authenticated", "true");
            localStorage.setItem("saksham_local_fallback", "true");
            const u = { id: "saksham_local", email: "local@example.com" };
            setUser(u);
            setLoading(true);
            await bootstrapProfile("saksham_local");
            setLoading(false);
            return { success: true };
          }
          console.error("Supabase authentication error:", error);
          return { success: false, error: error?.message || "Failed to create a valid Supabase session" };
        }

        localStorage.setItem("saksham_authenticated", "true");
        localStorage.removeItem("saksham_local_fallback");
        const u = data.session.user;
        setUser(u);
        setLoading(true);
        await bootstrapProfile(u.id);
        setLoading(false);
        return { success: true };
      } catch (err: any) {
        console.warn("Universal login flow failed, falling back to local storage...", err);
        localStorage.setItem("saksham_authenticated", "true");
        localStorage.setItem("saksham_local_fallback", "true");
        const u = { id: "saksham_local", email: "local@example.com" };
        setUser(u);
        setLoading(true);
        await bootstrapProfile("saksham_local");
        setLoading(false);
        return { success: true };
      }
    }
    return { success: false, error: "Incorrect passkey" };
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginWithPassword }}>
      {children}
    </AuthContext.Provider>
  );
}
