import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { COUNTRIES } from "@/lib/roadmap";

export const Route = createFileRoute("/_app/countries")({
  component: Countries,
});

function Countries() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-4xl">Dream countries ✈</h1>
        <p className="text-sm text-foreground/70 mt-1">five futures. all real. all kind. all yours to choose.</p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {COUNTRIES.map((c, i) => (
          <motion.article
            key={c.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="glass-strong rounded-3xl p-6 hover:-translate-y-1 transition-transform"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/80 text-3xl shadow-soft">
                  {c.flag}
                </div>
                <div>
                  <h2 className="font-display text-2xl">{c.name}</h2>
                  <div className="text-xs text-foreground/60">{c.hubs.join(" · ")}</div>
                </div>
              </div>
              {c.pick && <span className="rounded-full bg-gradient-to-r from-pink-300 to-violet-300 px-2.5 py-0.5 text-xs font-semibold text-white">top pick ♡</span>}
            </div>

            <div className="mt-4 grid gap-2 text-sm">
              <Row k="salary" v={c.salary} />
              <Row k="visa" v={c.visa} />
              <Row k="marriage equality" v={c.ssm} />
            </div>

            <div className="mt-4 rounded-2xl bg-gradient-to-br from-pink-100/70 to-violet-100/70 p-4 text-sm italic">
              ♡ {c.vibe}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 rounded-xl bg-white/60 px-3 py-1.5">
      <span className="text-xs uppercase tracking-wider text-foreground/60">{k}</span>
      <span className="text-right text-sm font-medium">{v}</span>
    </div>
  );
}
