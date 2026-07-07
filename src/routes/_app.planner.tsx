import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { ROADMAP } from "@/lib/roadmap";
import { useAppState, addXP } from "@/lib/store";
import { MOODS } from "@/lib/roadmap";

type Search = { week?: number };

export const Route = createFileRoute("/_app/planner")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    week: s.week ? Math.max(1, Math.min(52, Number(s.week))) : undefined,
  }),
  component: Planner,
});

function celebrate() {
  const colors = ["#FFB6D5", "#C9B0FF", "#FFC9A8", "#B6D8FF"];
  confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors, shapes: ["circle"], scalar: 1.1 });
  setTimeout(() => confetti({ particleCount: 60, spread: 100, origin: { y: 0.55 }, colors, scalar: 0.9 }), 200);
}

function Pomodoro() {
  const [secs, setSecs] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    if (running) {
      ref.current = window.setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return (
    <div className="rounded-2xl bg-gradient-to-br from-pink-100/80 to-violet-100/80 p-4">
      <div className="text-xs uppercase tracking-wider text-foreground/60">pomodoro ♡</div>
      <div className="font-display text-4xl mt-1 tabular-nums">{mm}:{ss}</div>
      <div className="mt-2 flex gap-2">
        <button onClick={() => setRunning((r) => !r)} className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold hover:scale-105 transition">
          {running ? "pause" : "start"}
        </button>
        <button onClick={() => { setRunning(false); setSecs(25 * 60); }} className="rounded-full bg-white/60 px-3 py-1 text-xs font-semibold hover:scale-105 transition">
          reset
        </button>
      </div>
    </div>
  );
}

function ProgressRing({ pct }: { pct: number }) {
  const r = 32;
  const c = 2 * Math.PI * r;
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} stroke="rgba(255,255,255,0.7)" strokeWidth="8" fill="none" />
      <motion.circle
        cx="40" cy="40" r={r} stroke="url(#g1)" strokeWidth="8" fill="none" strokeLinecap="round"
        strokeDasharray={c}
        animate={{ strokeDashoffset: c - (c * pct) / 100 }}
        transition={{ duration: 0.7 }}
        transform="rotate(-90 40 40)"
      />
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFB6D5" />
          <stop offset="100%" stopColor="#C9B0FF" />
        </linearGradient>
      </defs>
      <text x="40" y="46" textAnchor="middle" className="font-display fill-current" fontSize="18">{pct}%</text>
    </svg>
  );
}

function Planner() {
  const search = Route.useSearch();
  const nav = Route.useNavigate();
  const [s, update] = useAppState();
  const [selected, setSelected] = useState<number>(search.week ?? 1);

  useEffect(() => { if (search.week) setSelected(search.week); }, [search.week]);

  const week = ROADMAP[selected - 1];
  const ws = s.weeks[selected] ?? { done: {}, reflection: "", mood: "", completed: false };

  const allTasks = useMemo(() => [
    ...week.learn.map((t, i) => ({ id: `learn-${i}`, label: t, group: "learn" })),
    ...week.practice.map((t, i) => ({ id: `practice-${i}`, label: t, group: "practice" })),
    ...week.build.map((t, i) => ({ id: `build-${i}`, label: t, group: "build" })),
  ], [week]);

  const doneCount = allTasks.filter((t) => ws.done[t.id]).length;
  const pct = Math.round((doneCount / allTasks.length) * 100);

  function toggle(id: string) {
    update((st) => {
      const prev = st.weeks[selected] ?? { done: {}, reflection: "", mood: "", completed: false };
      const next = { ...prev, done: { ...prev.done, [id]: !prev.done[id] } };
      return { ...st, weeks: { ...st.weeks, [selected]: next } };
    });
    addXP(2);
  }

  function setField<K extends keyof typeof ws>(k: K, v: (typeof ws)[K]) {
    update((st) => {
      const prev = st.weeks[selected] ?? { done: {}, reflection: "", mood: "", completed: false };
      return { ...st, weeks: { ...st.weeks, [selected]: { ...prev, [k]: v } } };
    });
  }

  function completeWeek() {
    update((st) => {
      const prev = st.weeks[selected] ?? { done: {}, reflection: "", mood: "", completed: false };
      const unlocked = st.unlocked_letters.includes(selected) ? st.unlocked_letters : [...st.unlocked_letters, selected];
      return {
        ...st,
        xp: st.xp + 30,
        weeks: { ...st.weeks, [selected]: { ...prev, completed: true } },
        unlocked_letters: unlocked,
      };
    });
    celebrate();
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3 no-print">
        <div>
          <h1 className="font-display text-4xl">Weekly planner ✎</h1>
          <p className="text-sm text-foreground/70 mt-1">printable. cosy. one week at a time.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { const w = Math.max(1, selected - 1); setSelected(w); nav({ search: { week: w } }); }}
            className="rounded-full glass px-3 py-2 text-sm hover:scale-105 transition"
          >← prev</button>
          <select
            value={selected}
            onChange={(e) => { const w = Number(e.target.value); setSelected(w); nav({ search: { week: w } }); }}
            className="rounded-full glass px-4 py-2 text-sm font-semibold"
          >
            {ROADMAP.map((w) => <option key={w.week} value={w.week}>Week {w.week} · {w.title}</option>)}
          </select>
          <button
            onClick={() => { const w = Math.min(52, selected + 1); setSelected(w); nav({ search: { week: w } }); }}
            className="rounded-full glass px-3 py-2 text-sm hover:scale-105 transition"
          >next →</button>
          <button onClick={() => window.print()} className="rounded-full glass px-3 py-2 text-sm hover:scale-105 transition">print A4</button>
        </div>
      </header>

      <div className="liquid-glass rounded-3xl p-6 neon-glow-violet print:bg-white print:shadow-none">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-foreground/60">{week.phaseName} · week {week.week}</div>
            <h2 className="font-display text-3xl mt-1">{week.title}</h2>
            <p className="text-foreground/70 mt-1">topic: {week.topic}</p>
          </div>
          <ProgressRing pct={pct} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {(["learn", "practice", "build"] as const).map((g) => (
            <div key={g} className="rounded-2xl bg-white/70 p-4 shadow-soft border border-white/40">
              <div className="text-xs font-semibold uppercase tracking-wider text-foreground/60">{g}</div>
              <ul className="mt-2 space-y-2">
                {allTasks.filter((t) => t.group === g).map((t) => (
                  <li key={t.id}>
                    <label className="flex cursor-pointer items-start gap-3 group py-0.5">
                      <div className="relative mt-0.5 shrink-0">
                        <input
                          type="checkbox"
                          checked={!!ws.done[t.id]}
                          onChange={() => toggle(t.id)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center ${
                          ws.done[t.id]
                            ? "bg-gradient-to-r from-pink-300 to-violet-300 border-transparent shadow-glow text-white scale-105"
                            : "border-foreground/30 group-hover:border-pink-300 bg-white/50"
                        }`}>
                          {ws.done[t.id] && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-[10px] font-bold"
                            >
                              ✓
                            </motion.span>
                          )}
                        </div>
                      </div>
                      <span className={`text-sm select-none transition-all leading-snug ${
                        ws.done[t.id]
                          ? "line-through text-foreground/40 font-medium"
                          : "text-foreground group-hover:text-pink-500"
                      }`}>
                        {t.label}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl bg-white/70 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground/60">reflection ♡</div>
            <textarea
              value={ws.reflection}
              onChange={(e) => setField("reflection", e.target.value)}
              placeholder="how did this week feel? what did you learn? what made you proud?"
              className="mt-2 w-full resize-none rounded-xl bg-white/80 p-3 text-sm outline-none ring-pink-200 focus:ring-2 min-h-32"
            />
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl bg-white/70 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-foreground/60">mood this week</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {MOODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setField("mood", m.id)}
                    className={`rounded-full px-2.5 py-1 text-xs transition ${
                      ws.mood === m.id ? "bg-gradient-to-r from-pink-300 to-violet-300 text-white shadow-soft" : "bg-white/70 hover:bg-white"
                    }`}
                  >
                    {m.emoji} {m.label}
                  </button>
                ))}
              </div>
            </div>
            <Pomodoro />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 no-print">
          <p className="text-sm text-foreground/70 italic">"tiny progress is still progress, sweetheart."</p>
          <AnimatePresence mode="wait">
            {ws.completed ? (
              <motion.div key="done" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-full bg-gradient-to-r from-emerald-200 to-teal-200 px-5 py-2.5 text-sm font-semibold">
                ✓ week complete ♡
              </motion.div>
            ) : (
              <motion.button
                key="cta"
                initial={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onClick={completeWeek}
                className="rounded-full bg-gradient-to-r from-pink-300 via-rose-300 to-violet-300 px-6 py-2.5 text-sm font-semibold text-white shadow-soft"
              >
                mark week complete ✨
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
