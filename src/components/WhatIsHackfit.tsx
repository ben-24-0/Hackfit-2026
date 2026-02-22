import React from "react";
import { AnimatedSection } from "./AnimatedSection";
import "../SectionStyles.css";
import BenefitsCard from "./BenefitsCard";

const statusLines = [
  "Booting Hackfit core modules... [OK]",
  "Syncing mentors... [OK]",
  "Priming challenges + datasets...[DONE%]",
  "Standing by for innovators...",
  "||||||||||||||||||||||||||||||||||||||||||| 100%",
];

const WhatIsHackfit: React.FC = () => {
  return (
    <section className="hackfit-intro py-14 sm:py-16 md:py-20 px-3 sm:px-6 md:px-10 relative overflow-hidden max-w-[100vw]">
      <div className="code-rain-overlay" aria-hidden />
      <div className="relative z-10 max-w-6xl mx-auto grid gap-10 md:grid-cols-[1.05fr_0.95fr] items-center bg-black/45">
        <AnimatedSection animationType="fadeUp" threshold={0.15}>
          <div className="space-y-4 md:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lime-400/50 bg-black/60 backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(147,205,45,0.9)]" />
              <span className="text-[11px] tracking-[0.28em] uppercase text-lime-200 font-[progress]">
                What is Hackfit?
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold font-[progress] leading-tight">
              Build bold. Sleep later.
            </h2>
            <p className="font-[progress] text-slate-200/90 tracking-widest text-sm sm:text-base md:text-lg max-w-2xl">
              HackFit is a national-level hackathon organized by the Department of Computer Science and Engineering, FISAT, in collaboration with FISAT Horizon Club, ACM Student Chapter FISAT, and FISAT Free Software Cell.


            <br></br>
            <br></br>

Bringing together innovators, developers, and problem-solvers from across the country, HackFit is a platform to build impactful solutions, collaborate with like-minded peers, and push the boundaries of creativity and technology.
            </p>
            <div className="hackfit-pill-row">
              <div className="hackfit-pill">
                <span className="dot" />
                36h Sprint
              </div>
              <div className="hackfit-pill accent">
                <span className="dot" />
                On-campus
              </div>
              <div className="hackfit-pill">
                <span className="dot" />
                Team Size: 2-5
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animationType="slideInRight" threshold={0.2}>
          {/* Replaced system status with a Benefits HUD card using statusLines */}
          <div>
            <BenefitsCard items={statusLines} />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default WhatIsHackfit;
