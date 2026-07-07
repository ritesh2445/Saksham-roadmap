import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ROADMAP } from "@/lib/roadmap";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/_app/roadmap")({
  component: Roadmap,
});

const MONTH_GROUPS = [
  {
    id: "m1",
    name: "Month 1 — Linux, Networking, Git Basics",
    description: "Build robust command line and networking foundations.",
    weeks: [1, 2, 3, 4],
    gradient: "from-pink-200 to-rose-200",
  },
  {
    id: "m2",
    name: "Month 2 — AWS Security Basics & Deployed Project",
    description: "Launch servers, configure VPCs, and deploy a secured web application.",
    weeks: [5, 6, 7, 8],
    gradient: "from-rose-200 to-violet-200",
  },
  {
    id: "m3-4",
    name: "Months 3–4 — Hands-on Security Practice",
    description: "Hone practical penetration testing skills on TryHackMe and HackTheBox.",
    weeks: [9, 10, 11, 12, 13, 14, 15, 16],
    gradient: "from-violet-200 to-purple-200",
  },
  {
    id: "m5-6",
    name: "Months 5–6 — Python & Data Skills Crossover",
    description: "Use Python scripting and Pandas log analysis for threat monitoring.",
    weeks: [17, 18, 19, 20, 21, 22, 23, 24],
    gradient: "from-purple-200 to-sky-200",
  },
  {
    id: "m7-8",
    name: "Months 7–8 — Build Your Flagship Project",
    description: "Build, containerize, and deploy a live Security Log Analysis Dashboard.",
    weeks: [25, 26, 27, 28, 29, 30, 31, 32],
    gradient: "from-sky-200 to-cyan-200",
  },
  {
    id: "m9-10",
    name: "Months 9–10 — Resume, Applications, Outreach",
    description: "Refine profiles, connect with engineering groups, and launch applications.",
    weeks: [33, 34, 35, 36, 37, 38, 39, 40],
    gradient: "from-cyan-200 to-amber-200",
  },
  {
    id: "m11-12",
    name: "Months 11–12 — Interview Prep & Final Sprint",
    description: "Practice technical and behavioral mocks, navigate pipelines, and land offers.",
    weeks: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52],
    gradient: "from-amber-200 to-pink-200",
  },
];

function Roadmap() {
  const [s] = useAppState();
  const [openMonths, setOpenMonths] = useState<Record<string, boolean>>({
    m1: true, // Expand Month 1 by default
  });

  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  function toggleMonth(id: string) {
    setOpenMonths((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-4xl">Security roadmap ✦</h1>
        <p className="text-foreground/70 mt-1">Twelve months, fifty-two weeks, one brand new career path.</p>
      </header>

      <div className="space-y-6">
        {MONTH_GROUPS.map((m) => {
          const weeksInMonth = ROADMAP.filter((w) => m.weeks.includes(w.week));
          const completedWeeks = weeksInMonth.filter((w) => s.weeks[w.week]?.completed).length;
          const isOpen = !!openMonths[m.id];

          return (
            <section key={m.id} className="glass-strong rounded-3xl overflow-hidden transition-all duration-300">
              {/* Accordion Header */}
              <button
                onClick={() => toggleMonth(m.id)}
                className={`w-full text-left p-6 bg-gradient-to-r ${m.gradient} flex flex-wrap items-center justify-between gap-4 cursor-pointer focus:outline-none`}
              >
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wider text-foreground/60 font-semibold">Phase Module</div>
                  <h2 className="font-display text-2xl mt-0.5">{m.name}</h2>
                  <p className="text-sm opacity-80 mt-1 leading-relaxed">{m.description}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-display text-2xl">{completedWeeks}/{weeksInMonth.length}</div>
                    <div className="text-xs opacity-70">weeks done</div>
                  </div>
                  <span className="text-2xl transform transition-transform duration-300">
                    {isOpen ? "▲" : "▼"}
                  </span>
                </div>
              </button>

              {/* Accordion Content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-white/30 border-t border-black/5"
                  >
                    <div className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {weeksInMonth.map((w, i) => {
                        const ws = s.weeks[w.week];
                        const completed = ws?.completed;
                        const isWeekDetailOpen = expandedWeek === w.week;

                        return (
                          <motion.div
                            key={w.week}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: (i % 8) * 0.04 }}
                            className="relative flex flex-col h-full"
                          >
                            <div
                              className={`flex-1 rounded-2xl p-4 transition-all ${
                                completed
                                  ? "bg-gradient-to-br from-emerald-100/90 to-teal-100/90 ring-2 ring-emerald-200"
                                  : "glass hover:shadow-soft"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground/60">
                                  week {w.week}
                                </span>
                                {completed && <span className="text-xs font-semibold text-emerald-700">✓ done ♡</span>}
                              </div>
                              <div className="font-display text-lg leading-tight mt-1.5">{w.title}</div>
                              <div className="text-xs text-foreground/70 mt-1 font-medium">{w.topic}</div>

                              {/* Task details collapse */}
                              <div className="mt-3 pt-2 border-t border-black/5 space-y-1">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setExpandedWeek(isWeekDetailOpen ? null : w.week);
                                  }}
                                  className="text-[11px] font-semibold text-pink-500 hover:text-pink-600 focus:outline-none flex items-center gap-1 cursor-pointer"
                                >
                                  {isWeekDetailOpen ? "hide task preview ▲" : "view task preview ▼"}
                                </button>
                                
                                <AnimatePresence>
                                  {isWeekDetailOpen && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden pt-2 space-y-2 text-[11px] text-foreground/80"
                                    >
                                      <div>
                                        <span className="font-semibold text-foreground/50 uppercase text-[9px] block">Learn</span>
                                        <ul className="list-disc pl-3 mt-0.5 space-y-0.5">
                                          {w.learn.map((task, idx) => (
                                            <li key={idx}>{task}</li>
                                          ))}
                                        </ul>
                                      </div>
                                      {w.practice.length > 0 && (
                                        <div>
                                          <span className="font-semibold text-foreground/50 uppercase text-[9px] block">Practice</span>
                                          <ul className="list-disc pl-3 mt-0.5 space-y-0.5">
                                            {w.practice.map((task, idx) => (
                                              <li key={idx}>{task}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      {w.build.length > 0 && (
                                        <div>
                                          <span className="font-semibold text-foreground/50 uppercase text-[9px] block">Build</span>
                                          <ul className="list-disc pl-3 mt-0.5 space-y-0.5">
                                            {w.build.map((task, idx) => (
                                              <li key={idx}>{task}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              <Link
                                to="/planner"
                                search={{ week: w.week }}
                                className="mt-4 block text-center rounded-xl bg-white/70 hover:bg-white text-xs font-semibold py-1.5 shadow-soft transition"
                              >
                                open planner →
                              </Link>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          );
        })}
      </div>
    </div>
  );
}
