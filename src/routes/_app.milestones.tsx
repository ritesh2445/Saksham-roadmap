import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MILESTONES } from "@/lib/roadmap";
import { useAppState, addXP } from "@/lib/store";

export const Route = createFileRoute("/_app/milestones")({
  component: Milestones,
});

function Milestones() {
  const [s, update] = useAppState();

  function toggle(id: string) {
    update((st) => ({ ...st, milestones: { ...st.milestones, [id]: !st.milestones[id] } }));
    if (!s.milestones[id]) addXP(15);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-4xl">Milestone wall ★</h1>
        <p className="text-sm text-foreground/70 mt-1">every one of these is worth celebrating loud.</p>
      </header>

      <div className="relative pl-6">
        <div className="absolute left-2 top-2 bottom-2 w-1 rounded-full bg-gradient-to-b from-pink-300 via-violet-300 to-sky-300" />
        <div className="space-y-4">
          {MILESTONES.map((m, i) => {
            const done = !!s.milestones[m.id];
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative"
              >
                <div className={`absolute -left-[18px] top-3 h-4 w-4 rounded-full ring-4 ring-white/80 ${done ? "bg-gradient-to-br from-pink-400 to-violet-400" : "bg-white"}`} />
                <button
                  onClick={() => toggle(m.id)}
                  className={`w-full text-left rounded-2xl p-4 transition ${
                    done ? "bg-gradient-to-r from-pink-100 to-violet-100 shadow-soft" : "glass hover:shadow-soft"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className={`font-medium ${done ? "" : "text-foreground/80"}`}>{m.label}</span>
                    {done && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-sm font-semibold">✓ unlocked ♡</motion.span>}
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
