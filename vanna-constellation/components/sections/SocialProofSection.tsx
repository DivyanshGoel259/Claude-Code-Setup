"use client";

/**
 * Section 9: Social Proof Engine - Traction & Trust Section
 * Row 1: Animated metric counters
 * Row 2: Partner logo marquee (dual-row, opposite directions)
 * Row 3: Integration bento grid with hover effects
 */

import { useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ThreeBackground = dynamic(() => import("./ThreeBackground"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-transparent" />,
});

/* ── Animated Counter ───────────────────────────────────────────── */

function AnimatedCounter({
  target,
  prefix,
  suffix,
  isInView,
  delay,
}: {
  target: number;
  prefix: string;
  suffix: string;
  isInView: boolean;
  delay: number;
}) {
  const spring = useSpring(0, { stiffness: 40, damping: 20 });
  const display = useTransform(spring, (v) => Math.floor(v).toLocaleString());
  const [value, setValue] = useState("0");

  useEffect(() => {
    const unsubscribe = display.on("change", (v) => setValue(v));
    return unsubscribe;
  }, [display]);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => spring.set(target), delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, spring, target, delay]);

  return (
    <span className="text-h4 text-gradient font-mono block">
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

/* ── Metrics ────────────────────────────────────────────────────── */

const metrics = [
  { value: 350, prefix: "$", suffix: "K+", label: "Raised" },
  { value: 40, prefix: "", suffix: "K+", label: "Subscribers" },
  { value: 2, prefix: "", suffix: "M+", label: "Users" },
  { value: 15, prefix: "", suffix: "+", label: "Integrations" },
];

/* ── Partners ───────────────────────────────────────────────────── */

const partnersRow1 = [
  "Stellar Foundation",
  "Optimism",
  "Base",
  "Pivot Ventures",
  "Draper University",
  "Gitcoin",
  "Arbitrum",
  "Coinbase Ventures",
];

const partnersRow2 = [
  "Aave",
  "Uniswap",
  "Hyperliquid",
  "Pendle",
  "GMX",
  "Morpho",
  "dYdX",
  "Compound",
];

function PartnerLogo({ name }: { name: string }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-6 py-3 mx-3 rounded-xl shrink-0 transition-all duration-300 hover:scale-105 group"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--card-border)",
      }}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors duration-300"
        style={{
          backgroundColor: "var(--surface-alt)",
          color: "var(--text-muted)",
        }}
      >
        {name.charAt(0)}
      </div>
      <span
        className="text-body-2 font-medium whitespace-nowrap transition-colors duration-300"
        style={{ color: "var(--text-secondary)" }}
      >
        {name}
      </span>
    </div>
  );
}

/* ── Bento Grid Items ───────────────────────────────────────────── */

const bentoItems = [
  { name: "Hyperliquid", category: "Perps", color: "#9F7BEE" },
  { name: "Uniswap", category: "Spot", color: "#32EEE2" },
  { name: "Derive", category: "Options", color: "#FB7185" },
  { name: "Pendle", category: "Yield", color: "#E879F9" },
  { name: "Aave", category: "Lending", color: "#FC5457" },
  { name: "GMX", category: "Perps", color: "#9F7BEE" },
  { name: "dYdX", category: "Perps", color: "#9F7BEE" },
  { name: "Morpho", category: "Lending", color: "#FC5457" },
  { name: "Curve", category: "Spot", color: "#32EEE2" },
  { name: "Yearn", category: "Yield", color: "#E879F9" },
  { name: "Compound", category: "Lending", color: "#FC5457" },
  { name: "Lyra", category: "Options", color: "#FB7185" },
];

export default function SocialProofSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="social-proof"
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Three.js Animated Background */}
      <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-30 pointer-events-none">
        <ThreeBackground />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-violet-500 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Backed By The Best
          </p>
          <h2 className="text-h3 text-heading mb-4">
            Trusted by the ecosystem
          </h2>
          <p className="text-subtext text-paragraph max-w-xl mx-auto">
            Integrated with the leaders. Backed by top investors. Trusted by
            thousands.
          </p>
        </motion.div>

        {/* Row 1: Metrics */}
        {/* <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              className="text-center p-6 rounded-2xl"
              style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 200 }}
            >
              <AnimatedCounter
                target={metric.value}
                prefix={metric.prefix}
                suffix={metric.suffix}
                isInView={isInView}
                delay={0.3 + i * 0.1}
              />
              <span className="text-body-2 mt-2 block" style={{ color: 'var(--text-muted)' }}>
                {metric.label}
              </span>
            </motion.div>
          ))}
        </motion.div> */}

        {/* Row 2: Partner Marquee */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          <p
            className="text-body-3 font-semibold tracking-[0.15em] uppercase text-center mb-6"
            style={{ color: "var(--text-muted)" }}
          >
            Partners & Backers
          </p>

          {/* Marquee Row 1 - Left to Right */}
          <div className="relative overflow-hidden mb-3">
            {/* Fade edges */}
            <div
              className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, var(--background), transparent)",
              }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(270deg, var(--background), transparent)",
              }}
            />

            <div className="flex animate-marquee hover:[animation-play-state:paused]">
              {[...partnersRow1, ...partnersRow1].map((name, i) => (
                <PartnerLogo key={`r1-${i}`} name={name} />
              ))}
            </div>
          </div>

          {/* Marquee Row 2 - Right to Left */}
          <div className="relative overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, var(--background), transparent)",
              }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(270deg, var(--background), transparent)",
              }}
            />

            <div
              className="flex"
              style={{
                animation: "marquee 40s linear infinite reverse",
              }}
            >
              {[...partnersRow2, ...partnersRow2].map((name, i) => (
                <PartnerLogo key={`r2-${i}`} name={name} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Row 3: Integration Bento Grid */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
        >
          <p
            className="text-body-3 font-semibold tracking-[0.15em] uppercase text-center mb-6"
            style={{ color: "var(--text-muted)" }}
          >
            Integrated Protocols
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {bentoItems.map((item, i) => (
              <motion.div
                key={item.name}
                className="rounded-xl p-4 text-center cursor-default transition-all duration-200"
                style={{
                  backgroundColor: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                }}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 + i * 0.04 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: `0 0 20px ${item.color}15, 0 8px 25px rgba(0,0,0,0.06)`,
                  borderColor: `${item.color}40`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center text-sm font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${item.color}CC, ${item.color})`,
                  }}
                >
                  {item.name.charAt(0)}
                </div>
                <span
                  className="text-body-2 font-medium block"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.name}
                </span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block"
                  style={{
                    backgroundColor: `${item.color}10`,
                    color: item.color,
                  }}
                >
                  {item.category}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div> */}
      </div>
    </section>
  );
}
