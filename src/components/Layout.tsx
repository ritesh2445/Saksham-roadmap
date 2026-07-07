import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAppState, daysSince, levelFromXP } from "@/lib/store";
import { useAuthContext } from "@/lib/auth-context";
import { FloatingDoodles, Sparkles } from "./Sparkles";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: "✿" },
  { to: "/planner", label: "Weekly Planner", icon: "✎" },
  { to: "/roadmap", label: "Roadmap", icon: "✦" },
  { to: "/habits", label: "Habits", icon: "♡" },
  { to: "/mood", label: "Mood Journal", icon: "☁" },
  { to: "/projects", label: "Projects", icon: "✧" },
  { to: "/countries", label: "Dream Countries", icon: "✈" },
  { to: "/milestones", label: "Milestones", icon: "★" },
  { to: "/letters", label: "Letters", icon: "✉" },
  { to: "/settings", label: "Settings", icon: "❀" },
] as const;

export function Layout() {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();
  const [s] = useAppState();
  const loc = useLocation();
  const days = daysSince(s.start_date);
  const level = levelFromXP(s.xp);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/" });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-300 border-t-violet-400" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="relative min-h-screen">
      <FloatingDoodles />
      {s.settings.sparkles && <Sparkles />}

      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-6 md:flex-row md:px-6 md:py-8">
        {/* Sidebar */}
        <aside className="md:sticky md:top-6 md:h-[calc(100vh-3rem)] md:w-64 md:shrink-0">
          <div className="glass-strong flex h-full flex-col gap-4 rounded-3xl p-5">
            <Link to="/" className="block">
              <h1 className="font-display text-2xl leading-tight text-gradient">Saksham's Security Adventure ✦</h1>
              <p className="text-xs text-muted-foreground mt-1">cozy roadmap to a brand new life</p>
            </Link>

            <div className="rounded-2xl bg-gradient-to-br from-pink-100/80 to-violet-100/80 p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="opacity-70">Level</span>
                <span className="font-display text-lg">{level}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="opacity-70">XP</span>
                <span className="font-semibold">{s.xp}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="opacity-70">Streak 🔥</span>
                <span className="font-semibold">{s.streak}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="opacity-70">Day</span>
                <span className="font-semibold">{days + 1}</span>
              </div>
            </div>

            <nav className="flex flex-1 flex-col gap-1 overflow-auto">
              {NAV.map((n) => {
                const active = loc.pathname.startsWith(n.to);
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all ${
                      active
                        ? "bg-white/90 shadow-soft text-foreground"
                        : "text-foreground/70 hover:bg-white/60 hover:text-foreground"
                    }`}
                  >
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-xl text-base transition-transform group-hover:scale-110 ${
                        active ? "bg-gradient-to-br from-pink-200 to-violet-200" : "bg-white/70"
                      }`}
                    >
                      {n.icon}
                    </span>
                    {n.label}
                  </Link>
                );
              })}
            </nav>

            <p className="text-[11px] leading-snug text-muted-foreground">
              you don't have to do it all today, baby. just one tiny thing ♡
            </p>
          </div>
        </aside>

        {/* Page */}
        <motion.main
          key={loc.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="min-w-0 flex-1"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
