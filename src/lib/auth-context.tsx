import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { bootstrapProfile, clearProfileCache } from "@/lib/store";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  loginWithPassword: (password: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthCtx>({
  user: null,
  loading: true,
  loginWithPassword: async () => false,
});

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      if (u) await bootstrapProfile(u.id);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      if (!u) {
        clearProfileCache();
      } else {
        await bootstrapProfile(u.id);
      }
      setUser(u);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function loginWithPassword(password: string): Promise<boolean> {
    if (password === "I love to study") {
      try {
        const email = "saksham@example.com";
        const dbPassword = "saksham_universal_passkey_123!";
        
        let { data, error } = await supabase.auth.signInWithPassword({ email, password: dbPassword });
        
        // If login fails (user does not exist yet), attempt to sign up
        if (error && (error.message.includes("Invalid login credentials") || error.message.includes("Email not confirmed"))) {
          const signupRes = await supabase.auth.signUp({ email, password: dbPassword });
          
          if (signupRes.error) {
            console.error("Supabase automatic sign up error:", signupRes.error);
            return false;
          }
          
          // Retry signing in after signup
          const retryRes = await supabase.auth.signInWithPassword({ email, password: dbPassword });
          data = retryRes.data;
          error = retryRes.error;
        }

        if (error || !data.session?.user) {
          console.error("Supabase authentication error:", error);
          return false;
        }

        return true;
      } catch (err) {
        console.error("Universal login flow failed:", err);
        return false;
      }
    }
    return false;
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginWithPassword }}>
      {children}
    </AuthContext.Provider>
  );
}
