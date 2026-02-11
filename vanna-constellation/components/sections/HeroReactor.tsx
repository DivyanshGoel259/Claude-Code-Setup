"use client";

import { useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const ThreeBackground = dynamic(() => import("./ThreeBackground"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-transparent" />,
});

/* ── Feature pill inline SVG icons ── */
function TargetIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#703AE6"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#703AE6"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

const featurePills = [
  { icon: <TargetIcon />, text: "Unified Margin" },
  { icon: <ZapIcon />, text: "Instant Leverage" },
];

/* ── Stagger container variant ── */
const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: 0.2,
    },
  },
};

export default function HeroReactor() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true); // autoplay starts playing
  const [hasEnded, setHasEnded] = useState(false);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleReplay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play();
    setHasEnded(false);
    setIsPlaying(true);
  }, []);

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Three.js Animated Background */}
      <div className="absolute inset-0 overflow-hidden opacity-30 dark:opacity-40">
        <ThreeBackground />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div
          className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full opacity-[0.12] dark:opacity-[0.18] blur-3xl animate-pulse-glow"
          style={{
            background:
              "radial-gradient(circle, var(--color-violet-500) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.10] dark:opacity-[0.15] blur-3xl animate-pulse-glow"
          style={{
            background:
              "radial-gradient(circle, var(--color-imperial-red-500) 0%, transparent 70%)",
            animationDelay: "1s",
          }}
        />

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(var(--text-muted) 1px, transparent 1px),
              linear-gradient(90deg, var(--text-muted) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating Geometric Shapes */}
        <div
          className="absolute top-1/4 right-1/4 w-32 h-32 border-2 rounded-sm opacity-[0.12] dark:opacity-[0.18] rotate-45 animate-pulse-glow"
          style={{ borderColor: "var(--color-violet-300)" }}
        />
        <div
          className="absolute bottom-1/3 left-1/3 w-24 h-24 border-2 rounded-sm opacity-[0.10] dark:opacity-[0.15] rotate-12 animate-pulse-glow"
          style={{
            borderColor: "var(--color-imperial-red-400)",
            animationDelay: "0.5s",
          }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-16 h-16 rounded-full border-2 opacity-[0.10] dark:opacity-[0.15] animate-pulse-glow"
          style={{
            borderColor: "var(--color-electric-blue-400)",
            animationDelay: "1s",
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:pt-24 lg:pb-10 xl:py-28 2xl:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 xl:gap-12 2xl:gap-16 items-center">
          {/* ── Left Column — Text Content ── */}
          <motion.div
            className="space-y-6 lg:space-y-3 xl:space-y-5 2xl:space-y-8"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {/* Eyebrow Text */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 lg:py-1.5 xl:py-2 rounded-full backdrop-blur-sm"
              style={{
                backgroundColor: "var(--badge-bg)",
                border: "1px solid var(--card-border)",
              }}
              variants={fadeUp}
            >
              <span className="w-2 h-2 rounded-full bg-vanna-gradient animate-pulse" />
              <span className="text-btn-sm" style={{ color: "#703AE6" }}>
                Composable Credit Infrastructure
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 variants={fadeUp}>
              <span
                className="block text-h2 xl:text-h1 leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                Leverage{" "}
                <span className="relative inline-block">
                  <span className="text-gradient">Anything</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="12"
                    viewBox="0 0 300 12"
                    fill="none"
                  >
                    <path
                      d="M2 10C50 5, 100 2, 150 5C200 8, 250 3, 298 8"
                      stroke="url(#hero-reactor-underline)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient
                        id="hero-reactor-underline"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="10%" stopColor="#FC5457" />
                        <stop offset="80%" stopColor="#703AE6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </span>
              <span
                className="block text-h2 xl:text-h1 leading-tight mt-1 xl:mt-2"
                style={{ color: "var(--text-primary)" }}
              >
                &amp; Anywhere
              </span>
              <span
                className="block text-h6 lg:text-h6 xl:text-h4 leading-tight mt-1 xl:mt-2"
                style={{ color: "var(--text-secondary)" }}
              >
                without getting liquidated
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-subtext max-w-xl"
              style={{ color: "var(--text-secondary)" }}
              variants={fadeUp}
            >
              Borrow{" "}
              <strong style={{ color: "#703AE6" }}>
                10× undercollateralized credit
              </strong>{" "}
              upfront. Deploy across perps, spot, lending, and yield farming—all
              from one unified margin account.
            </motion.p>

            {/* Stats Row */}
            <motion.div
              className="grid grid-cols-3 gap-4 lg:gap-4 xl:gap-6 py-3 lg:py-1 xl:py-4 2xl:py-6"
              variants={fadeUp}
            >
              {[
                { value: "10×", label: "Leverage" },
                { value: "8+", label: "Protocols" },
                { value: "5", label: "Chains" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-h5 lg:text-h5 xl:text-h4 text-gradient">
                    {stat.value}
                  </div>
                  <div
                    className="text-body-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 lg:gap-3 xl:gap-4"
              variants={fadeUp}
            >
              <motion.button
                className="bg-vanna-gradient text-white text-btn-md lg:text-btn-md xl:text-btn-lg px-6 py-3 xl:px-8 xl:py-4 rounded-xl shadow-lg transition-shadow duration-300"
                style={{ boxShadow: "0 8px 30px rgba(112, 58, 230, 0.25)" }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 12px 40px rgba(112, 58, 230, 0.35)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                Launch App
              </motion.button>
              <motion.button
                className="text-btn-md lg:text-btn-md xl:text-btn-lg px-6 py-3 xl:px-8 xl:py-4 rounded-xl transition-colors duration-200"
                style={{
                  color: "var(--text-primary)",
                  border: "2px solid var(--border-default)",
                  backgroundColor: "var(--card-bg)",
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                View Strategies
              </motion.button>
            </motion.div>

            {/* Feature Pills */}
            <motion.div
              className="flex flex-wrap gap-3 pt-2 lg:pt-0 xl:pt-2 2xl:pt-4"
              variants={fadeUp}
            >
              {featurePills.map((feature) => (
                <div
                  key={feature.text}
                  className="flex items-center gap-2 px-4 py-1.5 xl:py-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--card-border)",
                  }}
                >
                  {feature.icon}
                  <span
                    className="text-body-2 font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {feature.text}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right Column — Animated Explainer Video ── */}
          <motion.div
            className="relative"
            variants={fadeRight}
            initial="hidden"
            animate="visible"
          >
            {/* Video container with glassmorphism border */}
            <div
              className="relative rounded-3xl overflow-hidden shadow-vanna"
              style={{
                // border: "1px solid var(--card-border)",
                backgroundColor: "var(--surface)",
              }}
            >
              {/* Gradient border glow */}
              <div
                className="absolute -inset-px rounded-3xl opacity-30 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, #703AE6, transparent, #32EEE2)",
                }}
              />
              {/* Explainer video — autoplay loop with play/pause */}
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto rounded-3xl"
                style={{ display: "block" }}
                onPlay={() => {
                  setIsPlaying(true);
                  setHasEnded(false);
                }}
                onPause={() => setIsPlaying(false)}
                onEnded={() => {
                  setIsPlaying(false);
                  setHasEnded(true);
                }}
              >
                <source src="/vanna-animation-adaptive.mp4" type="video/mp4" />
              </video>
              {/* Play / Pause overlay — click anywhere on video */}
              <button
                onClick={hasEnded ? handleReplay : togglePlay}
                aria-label={hasEnded ? "Replay" : isPlaying ? "Pause" : "Play"}
                className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
                style={{ background: "transparent" }}
              >
                <AnimatePresence>
                  {/* Pause icon — only show briefly on hover while playing */}
                  {!isPlaying && !hasEnded && (
                    <motion.div
                      key="play"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md"
                      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
                    >
                      {/* Play triangle */}
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <polygon points="6 3 20 12 6 21" />
                      </svg>
                    </motion.div>
                  )}

                  {hasEnded && (
                    <motion.div
                      key="replay"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md"
                      style={{ backgroundColor: "rgba(112,58,230,0.7)" }}
                    >
                      {/* Replay arrow */}
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="1 4 1 10 7 10" />
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* Floating Mini Cards */}
            <motion.div
              className="absolute -top-4 -right-4 rounded-xl shadow-vanna px-3.5 py-2.5 z-30"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--card-border)",
              }}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <div
                className="text-[10px] mb-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                Borrow APR
              </div>
              <div className="text-sm font-bold" style={{ color: "#703AE6" }}>
                8.5%
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-4 rounded-xl shadow-vanna px-3.5 py-2.5 z-30"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--card-border)",
              }}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <div
                className="text-[10px] mb-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                Capital Available
              </div>
              <div className="text-sm font-bold" style={{ color: "#32EEE2" }}>
                $9,000
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to top, var(--background), transparent)",
        }}
      />
    </section>
  );
}
