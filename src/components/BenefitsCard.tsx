import React, { useEffect, useRef, useState, useCallback } from "react";
import "../SectionStyles.css";

interface BenefitsCardProps {
  items?: string[];
}

const defaultItems = ["GenAI", "Transformation", "Hugging", "Data Science"];

/* ── Animated progress bar line (last item) ── */
const PROGRESS_BAR_CHAR = "█";
const TOTAL_BARS = 40;
const GLITCH_CHARS = "!@#$%^&*░▒▓█▀▄▌▐";

const AnimatedProgressLine: React.FC = () => {
  const [count, setCount] = useState(0);
  const [glitchText, setGlitchText] = useState("");
  const [isGlitching, setIsGlitching] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const hasAnimated = useRef(false);

  /* Intersection observer – start only when visible */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          runAnimation();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const runAnimation = useCallback(() => {
    let current = 0;
    const duration = 2200; // ms to reach 100
    const steps = 100;
    const interval = duration / steps;

    const timer = setInterval(() => {
      current += 1;

      /* Random glitch bursts at certain thresholds */
      if (
        current % 17 === 0 ||
        current === 33 ||
        current === 66 ||
        current === 99
      ) {
        setIsGlitching(true);
        const glitchLen = Math.floor(Math.random() * 6) + 2;
        setGlitchText(
          Array.from(
            { length: glitchLen },
            () => GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          ).join("")
        );
        setTimeout(() => {
          setIsGlitching(false);
          setGlitchText("");
        }, 80 + Math.random() * 60);
      }

      setCount(current);
      if (current >= 100) clearInterval(timer);
    }, interval);
  }, []);

  const filledBars = Math.round((count / 100) * TOTAL_BARS);
  const barStr =
    PROGRESS_BAR_CHAR.repeat(filledBars) + " ".repeat(TOTAL_BARS - filledBars);

  return (
    <li ref={ref} className="benefit-item progress-animated-line">
      <span className="benefit-hash">#</span>
      <span className="benefit-text">
        <span className="progress-bar-track" aria-hidden>
          {barStr}
        </span>{" "}
        <span
          className={`progress-pct ${isGlitching ? "progress-glitch" : ""}`}
        >
          {isGlitching ? glitchText : `${count}%`}
        </span>
      </span>
    </li>
  );
};

const BenefitsCard: React.FC<BenefitsCardProps> = ({
  items = defaultItems,
}) => {
  /* Separate static lines from the progress bar line */
  const staticItems = items.slice(0, -1);

  return (
    <aside className="benefits-card">
      <div className="benefits-card-inner">
        <div className="benefits-header" aria-hidden>
          <div className="benefits-title">Terminal</div>
          <div className="benefits-tab" />
        </div>

        <div className="benefits-divider" />

        <ul className="benefits-list">
          {staticItems.map((it) => (
            <li key={it} className="benefit-item">
              <span className="benefit-hash">#</span>
              <span className="benefit-text">{it}</span>
            </li>
          ))}
          <AnimatedProgressLine />
        </ul>
      </div>
    </aside>
  );
};

export default BenefitsCard;
