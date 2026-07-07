import { createFileRoute } from "@tanstack/react-router";
import { useAppState, signOut } from "@/lib/store";

export const Route = createFileRoute("/_app/settings")({
  component: Settings,
});

function Settings() {
  const [s, update] = useAppState();

  function reset() {
    if (!confirm("reset all progress? this can't be undone ♡")) return;
    update((st) => ({
      ...st,
      xp: 0,
      streak: 0,
      last_check_in: null,
      weeks: {},
      habits: {},
      mood_entries: [],
      milestones: {},
      unlocked_letters: [0],
      projects: {},
    }));
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <h1 className="font-display text-4xl">Settings ❀</h1>
        <p className="text-sm text-foreground/70 mt-1">make this little world feel exactly like yours.</p>
      </header>

      <section className="glass-strong rounded-3xl p-6 space-y-4">
        <h2 className="font-display text-xl">vibe</h2>
        <Field label="cursor sparkles">
          <button
            onClick={() => update((st) => ({ ...st, settings: { ...st.settings, sparkles: !st.settings.sparkles } }))}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              s.settings.sparkles ? "bg-gradient-to-r from-pink-300 to-violet-300 text-white" : "bg-white/70"
            }`}
          >
            {s.settings.sparkles ? "on ✨" : "off"}
          </button>
        </Field>

        <Field label="mascot">
          <div className="flex gap-2">
            {(["bunny", "ghost", "star"] as const).map((m) => (
              <button
                key={m}
                onClick={() => update((st) => ({ ...st, settings: { ...st.settings, mascot: m } }))}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  s.settings.mascot === m ? "bg-gradient-to-r from-pink-300 to-violet-300 text-white" : "bg-white/70 hover:bg-white"
                }`}
              >
                {m === "bunny" ? "🐰 bunny" : m === "ghost" ? "👻 ghost" : "⭐ star"}
              </button>
            ))}
          </div>
        </Field>

        <Field label="theme">
          <div className="flex gap-2">
            {(["dream", "sunset", "night"] as const).map((t) => (
              <button
                key={t}
                onClick={() => update((st) => ({ ...st, settings: { ...st.settings, theme: t } }))}
                className={`rounded-full px-3 py-1.5 text-sm transition capitalize ${
                  s.settings.theme === t ? "bg-gradient-to-r from-pink-300 to-violet-300 text-white" : "bg-white/70 hover:bg-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Field>
      </section>

      <section className="glass-strong rounded-3xl p-6">
        <h2 className="font-display text-xl">data & account</h2>
        <p className="text-sm text-foreground/70 mt-1">your progress is securely stored and synced to your Supabase database ♡</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify(s, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = "saksham-adventure-backup.json"; a.click();
              URL.revokeObjectURL(url);
            }}
            className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold hover:scale-105 transition"
          >
            export backup ♡
          </button>
          <button
            onClick={() => signOut()}
            className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700 hover:scale-105 transition"
          >
            sign out
          </button>
          <button onClick={reset} className="rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 hover:scale-105 transition">
            reset progress
          </button>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/60 p-3">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </div>
  );
}
