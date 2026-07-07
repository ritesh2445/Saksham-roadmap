import { useEffect, useRef } from "react";

export function Sparkles() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let last = 0;
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - last < 60) return;
      last = now;
      const s = document.createElement("span");
      s.textContent = ["✦", "✿", "♡", "✧", "·"][Math.floor(Math.random() * 5)];
      s.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;pointer-events:none;font-size:${10 + Math.random() * 10}px;color:hsl(${320 + Math.random() * 40},80%,75%);z-index:9999;transition:all .8s ease-out;transform:translate(-50%,-50%)`;
      el.appendChild(s);
      requestAnimationFrame(() => {
        s.style.transform = `translate(-50%, -${30 + Math.random() * 30}px) scale(0)`;
        s.style.opacity = "0";
      });
      setTimeout(() => s.remove(), 900);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[9998]" />;
}

export function FloatingDoodles() {
  const items = ["♡", "✿", "✦", "☁", "★", "✧", "❀"];
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      {items.map((c, i) => (
        <span
          key={i}
          className="absolute animate-floaty select-none opacity-60"
          style={{
            left: `${(i * 13 + 7) % 95}%`,
            top: `${(i * 17 + 11) % 90}%`,
            fontSize: `${18 + (i % 4) * 8}px`,
            color: ["#FFB6D5", "#C9B0FF", "#FFC9A8", "#B6D8FF"][i % 4],
            animationDelay: `${i * 0.6}s`,
            animationDuration: `${5 + (i % 3)}s`,
          }}
        >
          {c}
        </span>
      ))}
    </div>
  );
}
