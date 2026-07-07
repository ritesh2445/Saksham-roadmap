import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Mascot } from "@/components/Mascot";
import { useAppState, daysSince, levelFromXP, checkInToday } from "@/lib/store";
import { ROADMAP, HABITS } from "@/lib/roadmap";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

function StatCard({ label, value, hint, gradient }: { label: string; value: string | number; hint?: string; gradient: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative overflow-hidden rounded-3xl p-5 shadow-soft ${gradient}`}
    >
      <div className="relative z-10">
        <div className="text-xs font-medium text-foreground/70">{label}</div>
        <div className="mt-1 font-display text-4xl">{value}</div>
        {hint && <div className="mt-1 text-xs text-foreground/60">{hint}</div>}
      </div>
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/40 blur-2xl" />
    </motion.div>
  );
}

function Dashboard() {
  const [s, update] = useAppState();
  useEffect(() => { checkInToday(); }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [github, setGithub] = useState(s.contacts?.github ?? "https://github.com/saksham");
  const [linkedin, setLinkedin] = useState(s.contacts?.linkedin ?? "https://linkedin.com/in/saksham");
  const [email, setEmail] = useState(s.contacts?.email ?? "saksham@example.com");
  const [resume, setResume] = useState(s.contacts?.resume ?? "#");

  function handleSaveContacts(e: React.FormEvent) {
    e.preventDefault();
    update((prev) => ({
      ...prev,
      contacts: { github, linkedin, email, resume }
    }));
    setIsEditing(false);
  }

  const days = daysSince(s.start_date);
  const level = levelFromXP(s.xp);
  const xpForNext = (level) ** 2 * 25;
  const xpFromPrev = (level - 1) ** 2 * 25;
  const xpPct = Math.round(((s.xp - xpFromPrev) / Math.max(1, xpForNext - xpFromPrev)) * 100);

  const completedWeeks = Object.values(s.weeks).filter((w) => w.completed).length;
  const weeklyPct = Math.round((completedWeeks / 52) * 100);

  const today = new Date().toDateString();
  const todaysHabits = HABITS.filter((h) => s.habits[h.id]?.includes(today)).length;

  const currentWeek = Math.min(52, Math.max(1, Math.floor(days / 7) + 1));
  const next = ROADMAP[currentWeek - 1];

  const isOffline = typeof window !== "undefined" && localStorage.getItem("saksham_local_fallback") === "true";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">welcome back, Saksham ✦</h1>
          <p className="text-sm text-foreground/70 mt-1">day {days + 1} of your beautiful, dramatic, doable little adventure.</p>
        </div>
        <Link to="/planner" className="rounded-full bg-gradient-to-r from-pink-300 to-violet-300 px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:scale-105 transition">
          open today's week →
        </Link>
      </div>

      {isOffline && (
        <div className="rounded-2xl bg-amber-100/90 border border-amber-300 p-4 text-xs font-semibold text-amber-800 shadow-soft animate-pop no-print">
          ⚠️ Running in Offline Mode: Your Supabase database is currently unreachable (it may be paused or offline). Progress is being saved locally in your browser.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Streak" value={`${s.streak} 🔥`} hint="keep showing up" gradient="bg-gradient-to-br from-pink-200/80 to-rose-200/80" />
        <StatCard label="Days coding" value={days + 1} hint="since day one ♡" gradient="bg-gradient-to-br from-violet-200/80 to-purple-200/80" />
        <StatCard label="XP" value={s.xp} hint={`lvl ${level} · ${Math.max(0, xpPct)}% to next`} gradient="bg-gradient-to-br from-sky-200/80 to-cyan-200/80" />
        <StatCard label="Weeks done" value={`${completedWeeks}/52`} hint={`${weeklyPct}% of the journey`} gradient="bg-gradient-to-br from-amber-200/80 to-pink-200/80" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass-strong rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-foreground/60">this week</div>
              <h2 className="font-display text-2xl mt-1">Week {next.week} · {next.title}</h2>
              <p className="text-sm text-foreground/70 mt-1">{next.phaseName} · {next.topic}</p>
            </div>
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-pink-200 to-violet-200 font-display text-2xl">
              {next.week}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {(["learn", "practice", "build"] as const).map((k) => (
              <div key={k} className="rounded-2xl bg-white/60 p-3">
                <div className="text-xs font-semibold uppercase text-foreground/60">{k}</div>
                <ul className="mt-1.5 space-y-1 text-sm">
                  {next[k].map((t) => <li key={t}>· {t}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs font-medium text-foreground/70">
              <span>journey progress</span>
              <span>{weeklyPct}%</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/60">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(2, weeklyPct)}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-pink-400 via-violet-400 to-sky-400"
              />
            </div>
          </div>
        </div>

        <div className="glass-strong rounded-3xl p-6">
          <Mascot />
          <div className="mt-5 rounded-2xl bg-gradient-to-br from-pink-100/80 to-violet-100/80 p-4">
            <div className="text-xs uppercase tracking-wider text-foreground/60">habits today</div>
            <div className="mt-2 font-display text-3xl">{todaysHabits}/{HABITS.length}</div>
            <Link to="/habits" className="mt-2 inline-block text-xs font-semibold underline-offset-4 hover:underline">
              tap to tick today →
            </Link>
          </div>
        </div>
      </div>

      <div className="liquid-glass rounded-3xl p-6 neon-glow-pink">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl text-gradient">Profile & Target Career ✦</h2>
          <button
            onClick={() => {
              setGithub(s.contacts?.github ?? "https://github.com/saksham");
              setLinkedin(s.contacts?.linkedin ?? "https://linkedin.com/in/saksham");
              setEmail(s.contacts?.email ?? "saksham@example.com");
              setResume(s.contacts?.resume ?? "#");
              setIsEditing(true);
            }}
            className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold hover:bg-white hover:scale-105 transition cursor-pointer"
          >
            edit contacts ✎
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-2xl bg-white/70 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-foreground/60">background</div>
              <p className="mt-1 text-sm font-medium">BTech 2nd year, Computer Science (Data Science specialization)</p>
              <p className="text-xs text-foreground/70 mt-0.5">VIT Pune</p>
            </div>
            
            <div className="rounded-2xl bg-white/70 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-foreground/60">skills</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["Linux", "Networking", "Git/GitHub", "AWS (EC2, S3, IAM, VPC)", "Python", "OWASP Top 10", "Security Monitoring / SIEM basics"].map((sk) => (
                  <span key={sk} className="rounded-full bg-pink-100/80 px-2.5 py-0.5 text-xs font-medium text-foreground/80">{sk}</span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white/70 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-foreground/60">target roles & goals</div>
              <p className="mt-1 text-sm font-medium">Security Engineer · Cloud Security Engineer · DevOps/SRE</p>
              <p className="text-xs text-foreground/70 mt-1">Open to relocation · Established companies preferred · Open to startup experience</p>
              <p className="text-xs text-pink-500 font-medium mt-1">Timeline: Ready by end of this year to work on real projects, apply for jobs or internships abroad</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-white/70 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-foreground/60">contact & links</div>
              <div className="mt-2 grid gap-2">
                {[
                  { label: "GitHub", url: s.contacts?.github ?? "https://github.com/saksham", icon: "🐙" },
                  { label: "LinkedIn", url: s.contacts?.linkedin ?? "https://linkedin.com/in/saksham", icon: "🔗" },
                  { label: "Email", url: `mailto:${s.contacts?.email ?? "saksham@example.com"}`, icon: "✉" },
                  { label: "Resume", url: s.contacts?.resume ?? "#", icon: "📄", note: (s.contacts?.resume && s.contacts.resume !== "#") ? "saksham_resume.pdf" : "none" }
                ].map((l) => (
                  <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl bg-white/60 px-3 py-2 text-sm hover:bg-white hover:shadow-soft transition">
                    <span className="flex items-center gap-2"><span>{l.icon}</span> <span className="font-medium">{l.label}</span></span>
                    <span className="text-xs text-foreground/50">{l.note || "open →"}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white/70 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-foreground/60">free learning resources</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["Linux Journey", "OverTheWire Bandit", "Professor Messer", "AWS Skill Builder", "TryHackMe", "HackTheBox", "OWASP Juice Shop"].map((res) => (
                  <span key={res} className="rounded-full bg-violet-100/80 px-2.5 py-0.5 text-xs font-medium text-foreground/80">{res}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm no-print"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-strong relative w-full max-w-md rounded-3xl p-8 shadow-soft border border-white/60"
            >
              <button
                onClick={() => setIsEditing(false)}
                className="absolute right-4 top-4 text-foreground/60 hover:text-foreground cursor-pointer text-sm"
              >
                ✕
              </button>
              <h3 className="font-display text-2xl mb-4 text-gradient">Edit Contacts ✎</h3>
              <form onSubmit={handleSaveContacts} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    required
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full rounded-xl bg-white/80 px-3 py-2 text-sm outline-none ring-pink-200 focus:ring-2 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    required
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full rounded-xl bg-white/80 px-3 py-2 text-sm outline-none ring-pink-200 focus:ring-2 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl bg-white/80 px-3 py-2 text-sm outline-none ring-pink-200 focus:ring-2 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-1">
                    Resume Link
                  </label>
                  <input
                    type="text"
                    required
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                    className="w-full rounded-xl bg-white/80 px-3 py-2 text-sm outline-none ring-pink-200 focus:ring-2 transition"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-full bg-white/60 px-4 py-2 text-xs font-semibold hover:bg-white transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-gradient-to-r from-pink-300 to-violet-300 px-5 py-2 text-xs font-semibold text-white shadow-soft hover:scale-105 transition cursor-pointer"
                  >
                    Save Changes ♡
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { to: "/roadmap", t: "Roadmap", e: "✦" },
          { to: "/mood", t: "Mood journal", e: "☁" },
          { to: "/projects", t: "Projects", e: "✧" },
          { to: "/letters", t: "Love letters", e: "✉" },
        ].map((q) => (
          <Link key={q.to} to={q.to} className="glass rounded-3xl p-5 hover:-translate-y-1 transition-transform">
            <div className="text-3xl">{q.e}</div>
            <div className="font-display text-lg mt-2">{q.t}</div>
            <div className="text-xs text-foreground/70 mt-1">open →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
