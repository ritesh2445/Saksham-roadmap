import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MOODS } from "@/lib/roadmap";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/_app/mood")({
  component: Mood,
});

function Mood() {
  const [s, update] = useAppState();
  const [mood, setMood] = useState(MOODS[1].id);
  const [note, setNote] = useState("");

  function save() {
    if (!note.trim()) return;
    update((st) => ({
      ...st,
      mood_entries: [
        { id: crypto.randomUUID(), date: new Date().toISOString(), mood, note: note.trim() },
        ...st.mood_entries,
      ],
      xp: st.xp + 3,
    }));
    setNote("");
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-4xl">Mood journal ☁</h1>
        <p className="text-sm text-foreground/70 mt-1">name the feeling. let it breathe. then we keep going.</p>
      </header>

      <div className="glass-strong rounded-3xl p-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-foreground/60">how are you, baby?</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMood(m.id)}
              className={`rounded-full px-3 py-1.5 text-sm transition ${
                mood === m.id
                  ? "bg-gradient-to-r from-pink-300 to-violet-300 text-white shadow-soft scale-105"
                  : "bg-white/70 hover:bg-white"
              }`}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="dear diary..."
          className="mt-4 w-full resize-none rounded-2xl bg-white/80 p-4 text-sm outline-none ring-pink-200 focus:ring-2 min-h-32"
        />
        <div className="mt-3 flex justify-end">
          <button
            onClick={save}
            className="rounded-full bg-gradient-to-r from-pink-300 to-violet-300 px-5 py-2 text-sm font-semibold text-white shadow-soft hover:scale-105 transition"
          >
            save entry ♡
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {s.mood_entries.map((e) => {
            const m = MOODS.find((x) => x.id === e.mood);
            return (
              <motion.div
                key={e.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass rounded-2xl p-4"
              >
                <div className="flex items-center justify-between text-xs text-foreground/60">
                  <span>{new Date(e.date).toLocaleString()}</span>
                  <span className="rounded-full bg-white/70 px-2 py-0.5">{m?.emoji} {m?.label}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm">{e.note}</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {s.mood_entries.length === 0 && (
          <p className="text-center text-sm text-foreground/60 italic">no entries yet · the page is patient ♡</p>
        )}
      </div>
    </div>
  );
}
