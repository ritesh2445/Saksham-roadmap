import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { DIALOGUES } from "@/lib/roadmap";

export function Mascot({ size = 120 }: { size?: number }) {
  const [line, setLine] = useState(DIALOGUES[0]);
  const [showBubble, setShowBubble] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setShowBubble(false);
      setTimeout(() => {
        setLine(DIALOGUES[Math.floor(Math.random() * DIALOGUES.length)]);
        setShowBubble(true);
      }, 350);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative flex items-end gap-3">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="shrink-0"
        style={{ width: size, height: size }}
      >
        {/* Bunny SVG */}
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_8px_20px_rgba(255,150,200,0.4)]">
          <defs>
            <radialGradient id="bunnyBody" cx="50%" cy="40%">
              <stop offset="0%" stopColor="#FFF6FA" />
              <stop offset="100%" stopColor="#FFD6E7" />
            </radialGradient>
          </defs>
          {/* ears */}
          <ellipse cx="42" cy="25" rx="9" ry="22" fill="url(#bunnyBody)" />
          <ellipse cx="42" cy="25" rx="4" ry="14" fill="#FFB6D5" />
          <ellipse cx="78" cy="25" rx="9" ry="22" fill="url(#bunnyBody)" />
          <ellipse cx="78" cy="25" rx="4" ry="14" fill="#FFB6D5" />
          {/* head */}
          <circle cx="60" cy="68" r="34" fill="url(#bunnyBody)" />
          {/* blush */}
          <circle cx="42" cy="78" r="6" fill="#FFB6D5" opacity="0.7" />
          <circle cx="78" cy="78" r="6" fill="#FFB6D5" opacity="0.7" />
          {/* eyes */}
          <motion.g
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 3.5 }}
            style={{ transformOrigin: "60px 66px" }}
          >
            <ellipse cx="50" cy="66" rx="3" ry="4" fill="#3a2a4a" />
            <ellipse cx="70" cy="66" rx="3" ry="4" fill="#3a2a4a" />
            <circle cx="51" cy="64.5" r="1" fill="white" />
            <circle cx="71" cy="64.5" r="1" fill="white" />
          </motion.g>
          {/* mouth */}
          <path d="M56 78 Q60 82 64 78" stroke="#a06080" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </motion.div>

      <AnimatePresence mode="wait">
        {showBubble && (
          <motion.div
            key={line}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="glass-strong relative max-w-[260px] rounded-3xl rounded-bl-md px-4 py-3 text-sm font-medium"
          >
            {line}
            <span className="absolute -bottom-1 left-2 h-3 w-3 rotate-45 glass-strong rounded-sm" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
