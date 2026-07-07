import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { bootstrapProfile, clearProfileCache } from "@/lib/store";

type AuthCtx = {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      if (u) await bootstrapProfile(u.id);
      setLoading(false);
    }).catch((err) => {
      console.error("Failed to check Supabase session:", err);
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

  async function loginWithPassword(password: string): Promise<{ success: boolean; error?: string }> {
    if (password === "I love to study") {
      try {
        const email = "sakshamjiddewar16@gmail.com";
        const dbPassword = "Sexyboii0405";
        
        let { data, error } = await supabase.auth.signInWithPassword({ email, password: dbPassword });
        
        // If login fails because user doesn't exist, attempt auto-signup
        if (error && (error.message.includes("Invalid login credentials") || error.message.includes("Email not confirmed") || error.message.includes("User not found"))) {
          console.log("Universal account not found, attempting auto signup...");
          const signupRes = await supabase.auth.signUp({ email, password: dbPassword });
          
          if (signupRes.error) {
            console.error("Supabase automatic sign up error:", signupRes.error);
            if (signupRes.error.message.includes("Signups not allowed") || signupRes.error.message.includes("prevent")) {
              return {
                success: false,
                error: "⚠️ User 'sakshamjiddewar16@gmail.com' does not exist in your Supabase project, and public signups are disabled. Please go to your Supabase Dashboard (Authentication > Users > Add User), create this email with password 'Sexyboii0405', check 'Auto-confirm user email', and try again."
              };
            }
            return { success: false, error: `Sign up failed: ${signupRes.error.message}` };
          }
          
          // Retry signing in after signup
          const retryRes = await supabase.auth.signInWithPassword({ email, password: dbPassword });
          data = retryRes.data;
          error = retryRes.error;
        }

        if (error || !data.session?.user) {
          console.error("Supabase authentication error:", error);
          if (error?.message?.includes("Invalid login credentials")) {
            return { success: false, error: "Incorrect passkey credentials in Supabase. Please verify user 'sakshamjiddewar16@gmail.com' has password 'Sexyboii0405'." };
          }
          return { success: false, error: error?.message || "Failed to create a valid Supabase session" };
        }

        return { success: true };
      } catch (err: any) {
        console.error("Universal login flow failed:", err);
        return { success: false, error: err.message || "An unexpected error occurred during auth flow" };
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
