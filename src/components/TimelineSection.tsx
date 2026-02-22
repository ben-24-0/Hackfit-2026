import React from "react";
import { AnimatedSection } from "./AnimatedSection";
import "../SectionStyles.css";

interface TimelineItem {
  phase: string;
  title: string;
  body: string;
  accent?: "lime" | "cyan";
  isActive?: boolean; // New optional flag for current phase
}

const items: TimelineItem[] = [
  {
    phase: "Phase 1",
    title: "Early Bird Registration",
    body: "Lock in your team at the best rates and secure your spot before the rush. Limited slots — register fast!",
    accent: "lime",
    isActive: true, // ← Mark as current phase
  },
  {
    phase: "Phase 2",
    title: "Normal Registration",
    body: "Open to all teams. Form your crew, pick a track, and get your repo ready before the final countdown.",
    accent: "cyan",
  },
  {
    phase: "Phase 3",
    title: "Hackfit Weekend",
    body: "March 6, 6:00 PM – March 8, 6:00 AM. 36 hours of non-stop building, shipping, and demoing to the jury.",
    accent: "lime",
  },
];

const TimelineSection: React.FC = () => {
  return (
    <section className="timeline-section section-dither py-16 sm:py-20 px-4 sm:px-6 md:px-10 relative">
      <div className="timeline-line" aria-hidden />
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 sm:mb-14 text-center">
          <p className="text-xs md:text-sm tracking-[0.3em] uppercase text-sage/70 font-[progress] mb-3">
            Execution Plan
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-[progress]">
            How Hackfit unfolds
          </h2>
        </div>

        <div className="timeline-items">
          {items.map((item, idx) => (
            <div
              key={item.title}
              className={`timeline-item timeline-item-${idx % 2 === 0 ? "left" : "right"}`}
            >
              <span className="timeline-node" aria-hidden />
              <AnimatedSection
                animationType={idx % 2 === 0 ? "slideInLeft" : "slideInRight"}
                threshold={0.15}
              >
                <div className="timeline-card relative">
                  {/* LIVE NOW badge for active phase */}
                  {item.isActive && (
                    <div className="absolute -top-4 -right-4 sm:-top-5 sm:-right-5 z-20">
                      <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-lime/20 border border-lime/50 text-lime font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_15px_rgba(132,204,22,0.6)] animate-pulse">
                        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-lime mr-1.5 sm:mr-2 shadow-[0_0_10px_rgba(132,204,22,0.8)]"></span>
                        LIVE NOW
                      </span>
                    </div>
                  )}

                  <div className="timeline-meta">{item.phase}</div>
                  <h3 className="timeline-title">
                    <span
                      className={
                        item.accent === "cyan"
                          ? "text-cyan-200"
                          : "text-lime-200"
                      }
                    >
                      {item.title}
                    </span>
                  </h3>
                  <p className="timeline-body">{item.body}</p>
                </div>
              </AnimatedSection>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;