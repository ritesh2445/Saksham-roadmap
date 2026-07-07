import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { LETTERS } from "@/lib/roadmap";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/_app/letters")({
  component: Letters,
});

function Letters() {
  const [s] = useAppState();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-4xl">Letters for Saksham ✉</h1>
        <p className="text-sm text-foreground/70 mt-1">open one whenever you forget how loved you are.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LETTERS.map((l, i) => {
          const unlocked = s.unlocked_letters.includes(i) || i === 0;
          return (
            <motion.button
              key={l.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={unlocked ? { y: -6, rotate: -1 } : {}}
              onClick={() => unlocked && setOpen(i)}
              disabled={!unlocked}
              className={`relative overflow-hidden rounded-3xl p-5 text-left transition ${
                unlocked
                  ? "glass-strong cursor-pointer"
                  : "bg-white/40 cursor-not-allowed opacity-60"
              }`}
            >
              <div className="text-3xl">{unlocked ? "✉" : "🔒"}</div>
              <div className="font-display text-lg mt-2">{l.title}</div>
              <div className="text-xs text-foreground/60 mt-1">
                {unlocked ? "tap to open ♡" : `unlocks at week ${i}`}
              </div>
              <div className="absolute right-3 top-3 text-pink-300 animate-twinkle">✦</div>
            </motion.button>
          );
        })}
      </div>

      {open !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong relative w-full max-w-lg rounded-3xl p-8"
          >
            <button onClick={() => setOpen(null)} className="absolute right-4 top-4 text-foreground/60 hover:text-foreground">✕</button>
            <div className="text-xs uppercase tracking-widest text-foreground/60">a letter for you</div>
            <h3 className="font-display text-3xl mt-2">{LETTERS[open].title}</h3>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-foreground/85">{LETTERS[open].body}</p>
            <p className="mt-6 text-right italic text-pink-500">— with so much love ♡</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
