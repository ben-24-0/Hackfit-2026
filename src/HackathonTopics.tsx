import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PanInfo } from "framer-motion";
import "./CarouselStyles.css";

interface TopicData {
  id: string;
  title: string;
  subtitle: string;
  badges: string[];
}

const topicsData: TopicData[] = [
  {
    id: "topic1",
    title: "Track 1 – Reveal Coming Soon",
    subtitle: "Problem statements and details will be announced shortly. Stay tuned!",
    badges: ["Coming Soon", "TBA", "Stay Tuned"],
  },
  {
    id: "topic2",
    title: "Track 2 – Reveal Coming Soon",
    subtitle: "Problem statements and details will be announced shortly. Stay tuned!",
    badges: ["Coming Soon", "TBA", "Stay Tuned"],
  },
];

const CombinedTopicCard: React.FC<{
  topic: TopicData;
  direction: number;
  onDragEnd?: (event: any, info: PanInfo) => void;
  onPointerDown?: () => void;
  onPointerUp?: () => void;
}> = ({ topic, direction, onDragEnd, onPointerDown, onPointerUp }) => {
  return (
    <motion.div
      key={topic.id}
      custom={direction}
      variants={{
        enter: (direction: number) => ({
          x: direction > 0 ? 600 : -600,
          opacity: 0,
          rotateY: direction > 0 ? 25 : -25,
          scale: 0.95,
        }),
        center: {
          zIndex: 1,
          x: 0,
          opacity: 1,
          rotateY: 0,
          scale: 1,
        },
        exit: (direction: number) => ({
          zIndex: 0,
          x: direction < 0 ? 600 : -600,
          opacity: 0,
          rotateY: direction < 0 ? 25 : -25,
          scale: 0.95,
        }),
      }}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 120, damping: 20 },
        opacity: { duration: 0.6 },
        rotateY: { duration: 0.6 },
        scale: { duration: 0.6 },
      }}
      className="absolute inset-0 overflow-hidden w-full h-full flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-10 p-4 sm:p-6 md:p-8 lg:p-12 circuit-bg-pattern bg-linear-to-br from-bgBlack via-bgBlack to-bgBlack/90"
      style={{ perspective: 1200 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.16}
      onDragEnd={onDragEnd}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <div className="absolute inset-0 opacity-10 glitch-overlay-anim" />

      <div className="flex-1 flex flex-col gap-4 md:gap-6 z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-geist font-semibold tracking-tight text-lime palette-glitch-text">
          {topic.title}
        </h2>

        <p className="text-sm md:text-base text-sage/85 max-w-xl font-roboto">
          {topic.subtitle}
        </p>

        <div className="flex flex-wrap gap-2 md:gap-3 mt-2 md:mt-4">
          {topic.badges.map((badge) => (
            <span
              key={badge}
              className="px-3 py-1 rounded-full text-[11px] md:text-xs font-roboto bg-bgBlack/80 border border-lime/40 text-lime/90 shadow-[0_0_12px_rgba(147,205,45,0.35)]"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center z-0">
        <div
          className="relative w-full max-w-50 sm:max-w-xs md:max-w-sm lg:max-w-md aspect-square bg-bgBlack/70 combined-card shadow-[0_0_40px_rgba(147,205,45,0.45)] overflow-hidden"
          style={{
            clipPath: "polygon(5% 0, 100% 0, 100% 95%, 95% 100%, 0 100%, 0 5%)",
          }}
        >
          <div className="absolute inset-0 pulse-glow-anim bg-[radial-gradient(circle_at_10%_20%,rgba(147,205,45,0.25)_0,transparent_60%),radial-gradient(circle_at_80%_80%,rgba(50,187,210,0.25)_0,transparent_60%)] mix-blend-screen" />
          <div className="absolute inset-0 glitch-overlay-anim opacity-20" />
          <div
            className="absolute inset-px bg-linear-to-br from-bgBlack via-bgBlack to-bgBlack/80"
            style={{
              clipPath:
                "polygon(5% 0, 100% 0, 100% 95%, 95% 100%, 0 100%, 0 5%)",
            }}
          />

          <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4 p-4">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40">
              {/* Animated Placeholder - CSS only */}
              <div className="absolute inset-0 rounded-full border-2 border-lime/40 animate-spin-slow"></div>
              <div className="absolute inset-2 rounded-full border border-cyan/30 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-r from-lime to-cyan rounded-full animate-pulse shadow-lg"></div>
              </div>
              <div className="absolute -inset-6 rounded-full bg-linear-to-tr from-lime/10 via-acid/10 to-cyan/10 blur-3xl" />
            </div>

            <div className="flex flex-wrap gap-1 sm:gap-2 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.25em] text-sage/60 font-roboto justify-center text-center">
              <span>Details TBA</span>
              <span className="opacity-40">•</span>
              <span>Reveal Soon</span>
              <span className="opacity-40">•</span>
              <span>Stay Tuned</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const HackathonTopicsCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [[, direction], setPage] = useState<[number, number]>([0, 1]);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<number | null>(null);

  const nextSlide = () => {
    const newIndex = (activeIndex + 1) % topicsData.length;
    setPage([newIndex, 1]);
    setActiveIndex(newIndex);
  };

  const prevSlide = () => {
    const newIndex = (activeIndex - 1 + topicsData.length) % topicsData.length;
    setPage([newIndex, -1]);
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    if (autoPlayRef.current) {
      window.clearInterval(autoPlayRef.current);
    }

    if (!isPaused) {
      autoPlayRef.current = window.setInterval(nextSlide, 6000);
    }

    return () => {
      if (autoPlayRef.current) {
        window.clearInterval(autoPlayRef.current);
      }
    };
  }, [activeIndex, isPaused]);

  const handlePointerDown = () => {
    setIsPaused(true);
    if (autoPlayRef.current) {
      window.clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };

  const handlePointerUp = () => {
    setIsPaused(false);
  };

  const currentTopic = topicsData[activeIndex];

  return (
    <section className="relative min-h-screen py-16 sm:py-20 md:py-24 px-2 sm:px-4 text-white z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8 md:gap-10 px-2 sm:px-0">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-xs md:text-sm tracking-[0.3em] uppercase text-sage/70 font-roboto mb-2">
              Hackathon Tracks
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-geist font-semibold tracking-tight">
              Choose your{" "}
              <span className="text-lime font-[impact]">Topic </span>.
            </h1>
            <p className="mt-3 text-xs sm:text-sm md:text-base text-sage/80 max-w-full sm:max-w-xl md:max-w-2xl font-roboto leading-relaxed sm:leading-relaxed">
              Exciting challenges are coming — get ready to innovate!
            </p>
          </div>

          <div className="inline-flex items-center gap-3 px-3 sm:px-4 py-2 rounded-full bg-bgBlack/80 border border-sage/40 backdrop-blur-md self-start">
            <span className="w-2 h-2 rounded-full bg-lime shadow-[0_0_10px_rgba(147,205,45,0.8)] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] md:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase text-sage/80 font-roboto">
              Reveal Soon – Stay Tuned
            </span>
          </div>
        </header>

        <div className="relative w-full neon-container-wrapper">
          <div
            className="relative w-full overflow-hidden bg-bgBlack/80 shadow-[0_0_40px_rgba(0,0,0,0.8)]"
            style={{
              clipPath:
                "polygon(2% 2%, 35% 2%, 40% 8%, 98% 8%, 98% 98%, 2% 98%)",
            }}
          >
            <div className="relative w-full h-full min-h-112.25 md:min-h-115 lg:min-h-120">
              <AnimatePresence initial={false} custom={direction}>
                <CombinedTopicCard
                  key={activeIndex}
                  topic={currentTopic}
                  direction={direction}
                  onDragEnd={(_, info) => {
                    const threshold = 100;
                    const velocityThreshold = 500;
                    if (
                      info.offset.x < -threshold ||
                      info.velocity.x < -velocityThreshold
                    ) {
                      nextSlide();
                    } else if (
                      info.offset.x > threshold ||
                      info.velocity.x > velocityThreshold
                    ) {
                      prevSlide();
                    }
                  }}
                  onPointerDown={handlePointerDown}
                  onPointerUp={handlePointerUp}
                />
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {/* Left gradient nav (optional) */}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={prevSlide}
                className="gradient-nav"
                aria-label="Previous topic"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M15 6L9 12L15 18" stroke="#001214" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="gradient-nav"
                aria-label="Next topic"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M9 6L15 12L9 18" stroke="#001214" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HackathonTopicsCarousel;