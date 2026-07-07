import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { HABITS } from "@/lib/roadmap";
import { useAppState, addXP } from "@/lib/store";

export const Route = createFileRoute("/_app/habits")({
  component: Habits,
});

function lastNDays(n: number) {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    out.push(new Date(Date.now() - i * 86400000).toDateString());
  }
  return out;
}

function Habits() {
  const [s, update] = useAppState();
  const today = new Date().toDateString();
  const days = lastNDays(14);

  function toggle(id: string, day: string) {
    update((st) => {
      const list = st.habits[id] ?? [];
      const has = list.includes(day);
      const next = has ? list.filter((d) => d !== day) : [...list, day];
      return { ...st, habits: { ...st.habits, [id]: next } };
    });
    addXP(1);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-4xl">Habits ♡</h1>
        <p className="text-sm text-foreground/70 mt-1">eight tiny things. nothing huge. just love.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {HABITS.map((h, i) => {
          const list = s.habits[h.id] ?? [];
          const todayDone = list.includes(today);
          const last7 = days.slice(-7).filter((d) => list.includes(d)).length;
          return (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass-strong rounded-3xl p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-pink-200 to-violet-200 text-2xl">
                    {h.emoji}
                  </div>
                  <div>
                    <div className="font-display text-lg">{h.label}</div>
                    <div className="text-xs text-foreground/60">{last7}/7 last week</div>
                  </div>
                </div>
                <button
                  onClick={() => toggle(h.id, today)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    todayDone
                      ? "bg-gradient-to-r from-emerald-200 to-teal-200"
                      : "bg-white/80 hover:bg-white"
                  }`}
                >
                  {todayDone ? "done ♡" : "tick today"}
                </button>
              </div>

              <div className="mt-4 flex gap-1">
                {days.map((d) => {
                  const done = list.includes(d);
                  return (
                    <button
                      key={d}
                      onClick={() => toggle(h.id, d)}
                      title={d}
                      className={`h-7 flex-1 rounded-md transition ${
                        done ? "bg-gradient-to-br from-pink-300 to-violet-300" : "bg-white/60 hover:bg-white/90"
                      }`}
                    />
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
