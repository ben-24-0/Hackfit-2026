import { Header } from "../Header";
import PrizePodium from "../PrizePodium";
import HackathonTopicsCarousel from "../HackathonTopics";
import Footer from "../components/Footer";
import ContactSection from "../components/ContactSection";
import CyberDivider from "../components/CyberDivider";
import { AnimatedSection } from "../components/AnimatedSection";
import { LazyComponent } from "../components/LazyComponent";
import WhatIsHackfit from "../components/WhatIsHackfit";
import TimelineSection from "../components/TimelineSection";
import VantaBackground from "../components/VantaBackground";
import MainNavbar from "../components/MainNavbar";
import FAQ from "../components/shadcn-studio/blocks/faq-component-01/faq-component-01";
import "../SectionStyles.css";

const faqItems = [
  {
    question: "Who can register for HackFit 2026?",
    answer:
      "HackFit is open exclusively to undergraduate and postgraduate students currently enrolled in recognized colleges or universities. Participants must carry a valid student ID. Mixed teams across different colleges are welcome, provided all members are eligible students and ready to build on-site.",
  },
  {
    question: "What tracks are in the 2026 edition?",
    answer:
      "Tracks will be revealed soon",
  },
  {
    question: "How large can each squad be?",
    answer:
      "Teams can have two to five members.",
  },
  {
    question: "What support is available on-site?",
    answer:
      "24/7 mentor pods, food and refreshments, sleep bays, and power buffers are available. ",
  },
  {
    question: "How are projects judged?",
    answer:
      "Panels score for fit to the original idea, impact, technical execution, resilience, and storytelling. Finals evaluation will done by industry professionals.",
  },
];

export default function HomePage() {
  return (
    <div className="text-white min-h-screen w-full">
      {/* Navbar - outside z-indexed containers so it stays on top */}
      <MainNavbar />

      {/* Vanta.js NET Background */}
      <VantaBackground />

      <div className="flex flex-col min-w-full min-h-[50vh] relative z-10">
        <Header />
      </div>

      <div className="relative z-10">
        <AnimatedSection animationType="fadeUp" threshold={0.15}>
          <CyberDivider />
          <WhatIsHackfit />
        </AnimatedSection>

        {/* Prize Section */}
        <AnimatedSection
          animationType="fadeUp"
          className="section-dither section-overlay-darker flex justify-center px-4 sm:px-6 py-12 sm:py-16 relative"
          threshold={0.2}
        >
          <div className="relative z-10 w-full">
            <CyberDivider />
            <LazyComponent threshold={0.1}>
              <PrizePodium />
            </LazyComponent>
          </div>
        </AnimatedSection>

        {/* Topics Section */}
        <div className="section-dither section-overlay-dark">
          <AnimatedSection animationType="slideInLeft" threshold={0.2}>
            <LazyComponent threshold={0.1}>
              <HackathonTopicsCarousel />
            </LazyComponent>
          </AnimatedSection>
        </div>
        <AnimatedSection animationType="fadeIn" delay={400}>
          <CyberDivider />
        </AnimatedSection>

        {/* Timeline */}
        <AnimatedSection
          animationType="fadeUp"
          threshold={0.2}
          className="section-dither px-4 sm:px-6"
        >
          <TimelineSection />
        </AnimatedSection>

        <AnimatedSection animationType="fadeIn" delay={300}>
          <CyberDivider />
        </AnimatedSection>

        {/* HackFit FAQ Section */}
        <AnimatedSection
          animationType="fadeUp"
          threshold={0.25}
          className="section-dither section-overlay-dark px-4 sm:px-6 py-12 sm:py-16"
        >
          <LazyComponent threshold={0.1}>
            <FAQ faqItems={faqItems} />
          </LazyComponent>
        </AnimatedSection>

        <AnimatedSection animationType="fadeIn" delay={250}>
          <CyberDivider />
        </AnimatedSection>

        {/* HackathonCards Section */}
        {/* <AnimatedSection
          animationType="fadeUp"
          className="section-dither relative flex justify-center px-4 sm:px-6 py-12 sm:py-16"
          threshold={0.2}
        >
          <div className="relative z-10 w-full max-w-7xl">
            <LazyComponent threshold={0.1}>
              <HackathonCards />
            </LazyComponent>
          </div>
        </AnimatedSection> */}

        {/* <AnimatedSection animationType="fadeIn" delay={400}>
          <CyberDivider />
        </AnimatedSection> */}

        {/* Contact Section */}
        <div>
          <AnimatedSection animationType="slideInRight" threshold={0.3}>
            <LazyComponent>
              <ContactSection />
            </LazyComponent>
          </AnimatedSection>
        </div>

        <AnimatedSection animationType="fadeUp" threshold={0.3}>
          <LazyComponent>
            <Footer />
          </LazyComponent>
        </AnimatedSection>
      </div>
    </div>
  );
}
