import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PROJECTS } from "@/lib/roadmap";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/_app/projects")({
  component: Projects,
});

function Projects() {
  const [s, update] = useAppState();

  function setField(id: string, patch: Partial<{ progress: number; notes: string; deployed: boolean }>) {
    update((st) => {
      const prev = st.projects[id] ?? { progress: 0, notes: "", deployed: false };
      return { ...st, projects: { ...st.projects, [id]: { ...prev, ...patch } } };
    });
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-4xl">Portfolio projects ✧</h1>
        <p className="text-sm text-foreground/70 mt-1">three projects that make recruiters stop scrolling.</p>
      </header>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {PROJECTS.map((p, i) => {
          const ps = s.projects[p.id] ?? { progress: 0, notes: "", deployed: false };
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`glass-strong overflow-hidden rounded-3xl p-5 bg-gradient-to-br ${p.gradient}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest opacity-70">project 0{i + 1}</div>
                  <h2 className="font-display text-xl mt-1">{p.title}</h2>
                </div>
                {ps.deployed && (
                  <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold">✓ deployed</span>
                )}
              </div>
              <p className="mt-2 text-sm opacity-80 italic">{p.blurb}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.stack.map((t) => (
                  <span key={t} className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-medium">{t}</span>
                ))}
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span>progress</span>
                  <span>{ps.progress}%</span>
                </div>
                <input
                  type="range" min={0} max={100} value={ps.progress}
                  onChange={(e) => setField(p.id, { progress: Number(e.target.value) })}
                  className="mt-1 w-full accent-pink-400"
                />
              </div>

              <textarea
                value={ps.notes}
                onChange={(e) => setField(p.id, { notes: e.target.value })}
                placeholder="notes, ideas, links to the repo..."
                className="mt-3 w-full resize-none rounded-xl bg-white/80 p-2.5 text-sm outline-none ring-pink-200 focus:ring-2 min-h-20"
              />

              <div className="mt-3 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={ps.deployed}
                    onChange={(e) => setField(p.id, { deployed: e.target.checked })}
                    className="h-4 w-4 accent-pink-400"
                  />
                  deployed
                </label>
                <span className="text-xs opacity-70">{ps.progress === 100 ? "✦ achievement unlocked ♡" : "keep going ♡"}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
