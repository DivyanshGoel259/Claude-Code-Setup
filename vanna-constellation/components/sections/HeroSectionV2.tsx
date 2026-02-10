"use client";

/**
 * Hero Section V2 — Image-inspired layout
 * Large heading + subtitle + CTA + Dashboard mockup preview
 * Theme-aware (light + dark), Framer Motion animations
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ── Dashboard mockup data ── */
const sidebarItems = [
  { name: "Portfolio Overview", active: true },
  { name: "Trading Terminal", active: false },
  { name: "Strategy Builder", active: false },
  { name: "Greeks Dashboard", active: false },
  { name: "Risk Monitor", active: false },
  { name: "Yield Farming", active: false },
  { name: "Lending Markets", active: false },
];

const topPositions = [
  { name: "ETH-PERP Long", protocol: "Hyperliquid" },
  { name: "BTC Call Option", protocol: "Derive" },
  { name: "ETH/USDC Spot", protocol: "Uniswap" },
  { name: "PT-sUSDe Yield", protocol: "Pendle" },
  { name: "USDC Lending", protocol: "Aave" },
  { name: "SOL-PERP Short", protocol: "GMX" },
  { name: "ARB Spot Long", protocol: "Sushi" },
];

/* ── Inline SVG Icon helpers ── */
const iconProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function SidebarIcon({ index, active }: { index: number; active: boolean }) {
  const color = active ? "#703AE6" : "var(--text-muted)";
  const p = { ...iconProps, stroke: color };

  switch (index) {
    case 0: // Grid — Portfolio
      return (
        <svg {...p}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case 1: // Zap — Trading
      return (
        <svg {...p}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 2: // Layers — Strategy
      return (
        <svg {...p}>
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case 3: // Triangle — Greeks (delta)
      return (
        <svg {...p}>
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      );
    case 4: // Shield — Risk
      return (
        <svg {...p}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 5: // TrendingUp — Yield
      return (
        <svg {...p}>
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      );
    case 6: // Building — Lending
      return (
        <svg {...p}>
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="9" y1="2" x2="9" y2="22" />
          <line x1="15" y1="2" x2="15" y2="22" />
        </svg>
      );
    default:
      return null;
  }
}

/* ── Small inline icons ── */
function CalendarIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--text-muted)"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   Dashboard Mockup — Embedded preview
   ═══════════════════════════════════════════════ */
function DashboardMockup() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: "1px solid var(--card-border)",
        backgroundColor: "var(--surface)",
        boxShadow:
          "0 25px 80px -12px rgba(112, 58, 230, 0.15), 0 12px 36px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* ─ Window chrome ─ */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: "1px solid var(--card-border)" }}
      >
        <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
        <span className="w-3 h-3 rounded-full bg-[#28C840]" />
      </div>

      {/* ─ Body ─ */}
      <div className="flex" style={{ minHeight: 400 }}>
        {/* Sidebar */}
        <div
          className="w-52 py-4 px-3 shrink-0 hidden md:block"
          style={{ borderRight: "1px solid var(--card-border)" }}
        >
          {sidebarItems.map((item, i) => (
            <div
              key={item.name}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-0.5 text-body-2"
              style={{
                backgroundColor: item.active
                  ? "var(--badge-bg)"
                  : "transparent",
                color: item.active ? "#703AE6" : "var(--text-secondary)",
                fontWeight: item.active ? 600 : 400,
              }}
            >
              <SidebarIcon index={i} active={item.active} />
              <span className="truncate">{item.name}</span>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 sm:p-5 min-w-0">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-h9" style={{ color: "var(--text-primary)" }}>
                Portfolio Overview
              </h3>
              <span
                className="text-body-3"
                style={{ color: "var(--text-muted)" }}
              >
                app.vanna.fi ↗
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Search */}
              <div
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body-3"
                style={{
                  border: "1px solid var(--card-border)",
                  color: "var(--text-muted)",
                  minWidth: 90,
                }}
              >
                <SearchIcon />
                <span>Search</span>
              </div>
              {/* Vanna icon button */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, #FC5457 10%, #703AE6 80%)",
                }}
              >
                <span className="text-[10px] font-bold text-white">V</span>
              </div>
            </div>
          </div>

          {/* Date range + settings row */}
          <div className="flex items-center justify-between mb-4">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body-3"
              style={{
                border: "1px solid var(--card-border)",
                color: "var(--text-secondary)",
              }}
            >
              <CalendarIcon />
              <span>Jun 24</span>
              <span style={{ color: "var(--text-muted)" }}>→</span>
              <span>Today</span>
            </div>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{
                border: "1px solid var(--card-border)",
                color: "var(--text-muted)",
              }}
            >
              <SlidersIcon />
            </div>
          </div>

          {/* ─ Metrics grid ─ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left card — Credit Deployed */}
            <div
              className="rounded-xl p-4"
              style={{ border: "1px solid var(--card-border)" }}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-body-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  Credit Deployed
                </span>
                <InfoIcon />
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span
                  className="text-h4 font-mono"
                  style={{ color: "var(--text-primary)" }}
                >
                  $85.2K
                </span>
                <span
                  className="text-body-3 font-semibold"
                  style={{ color: "#32EEE2" }}
                >
                  +5.6%
                </span>
              </div>

              {/* SVG line chart */}
              <div className="relative h-28 mt-2">
                <svg
                  viewBox="0 0 320 100"
                  className="w-full h-full"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="heroV2ChartFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#703AE6" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#703AE6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Area fill */}
                  <path
                    d="M0 78 Q30 72 60 68 T120 55 Q150 48 180 42 T240 38 Q270 42 300 32 L320 25 V100 H0 Z"
                    fill="url(#heroV2ChartFill)"
                  />
                  {/* Line */}
                  <path
                    d="M0 78 Q30 72 60 68 T120 55 Q150 48 180 42 T240 38 Q270 42 300 32 L320 25"
                    fill="none"
                    stroke="#703AE6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Tooltip */}
                <div
                  className="absolute rounded-lg px-2.5 py-1.5"
                  style={{
                    top: "18%",
                    left: "50%",
                    backgroundColor: "var(--surface-elevated)",
                    border: "1px solid var(--card-border)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                >
                  <div
                    className="text-[10px] mb-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Jun 18
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "#703AE6" }}
                    />
                    <span
                      className="font-mono text-[11px]"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Credit&nbsp;&nbsp;$78.4K
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right card — Active Positions */}
            <div
              className="rounded-xl p-4"
              style={{ border: "1px solid var(--card-border)" }}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-body-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  Active Positions
                </span>
                <InfoIcon />
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span
                  className="text-h4 font-mono"
                  style={{ color: "var(--text-primary)" }}
                >
                  12
                </span>
                <span
                  className="text-body-3 font-semibold"
                  style={{ color: "#FC5457" }}
                >
                  -2.5%
                </span>
              </div>

              {/* Top Positions label */}
              <div
                className="text-body-3 font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Top Positions
              </div>

              {/* Position list */}
              <div className="space-y-0">
                {topPositions.map((pos) => (
                  <div
                    key={pos.name}
                    className="flex items-center justify-between py-1.5"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: "#703AE6" }}
                      />
                      <span
                        className="text-body-3"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {pos.name}
                      </span>
                    </div>
                    <span
                      className="text-body-3"
                      style={{ color: "var(--text-muted)" }}
                    >
                      ⋯
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Hero Section V2 — Main component
   ═══════════════════════════════════════════════ */
export default function HeroSectionV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.35], [0, -60]);
  const mockupY = useTransform(scrollYProgress, [0, 0.5], [0, 80]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full overflow-hidden pb-16 md:pb-24"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* ── Ambient glow effects ── */}

      {/* Top accent line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-[400px] sm:w-[600px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, #703AE6, transparent)",
        }}
      />

      {/* Primary violet glow */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none opacity-[0.10] dark:opacity-[0.20] transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, #703AE6, transparent 70%)",
        }}
      />

      {/* Secondary red accent glow */}
      <div
        className="absolute -top-12 left-[28%] w-[400px] h-[300px] pointer-events-none opacity-[0.04] dark:opacity-[0.08] transition-opacity duration-500"
        style={{
          background: "radial-gradient(ellipse, #FC5457, transparent 70%)",
        }}
      />

      {/* ── Hero content ── */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 pt-36 sm:pt-44 text-center"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Headline */}
        <motion.h1
          className="text-h1 mb-6"
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span style={{ color: "var(--text-primary)" }}>
            Composable Credit
          </span>
          <br />
          <span className="text-gradient">Infrastructure for DeFi</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-subtext max-w-2xl mx-auto mb-10"
          style={{ color: "var(--text-secondary)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.25,
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          Borrow up to 10× your capital and deploy composable leverage across
          perps, options, spot, and yield — all from one account.
        </motion.p>

        {/* CTA button */}
        <motion.div
          className="flex justify-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.45,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.a
            href="#"
            className="inline-flex items-center px-8 py-3.5 text-btn-md rounded-full cursor-pointer select-none"
            style={{
              color: "var(--text-primary)",
              border: "1.5px solid var(--border-default)",
              backgroundColor: "transparent",
            }}
            whileHover={{
              scale: 1.04,
              borderColor: "#703AE6",
              boxShadow: "0 0 30px rgba(112, 58, 230, 0.12)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            Getting Started
          </motion.a>
        </motion.div>
      </motion.div>

      {/* ── Dashboard mockup ── */}
      <motion.div
        className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6"
        style={{ y: mockupY }}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.65,
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <DashboardMockup />
      </motion.div>

      {/* Bottom fade to background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-20"
        style={{
          background: "linear-gradient(to top, var(--background), transparent)",
        }}
      />

      {/* SR description */}
      <div className="sr-only">
        Vanna Finance — Composable credit infrastructure for DeFi. Borrow up to
        10× your capital and deploy across 15+ protocols. Professional Greeks
        dashboard and unified margin account.
      </div>
    </section>
  );
}
