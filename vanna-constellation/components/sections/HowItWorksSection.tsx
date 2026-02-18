"use client";

import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "framer-motion";

/* ═══════════════════════════════════════════════════
   SHARED HELPERS
   ═══════════════════════════════════════════════════ */

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const spring = useSpring(0, { stiffness: 80, damping: 20 });
  const display = useTransform(
    spring,
    (v: number) => `${prefix}${Math.round(v).toLocaleString()}${suffix}`,
  );
  const [text, setText] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsubscribe = display.on("change", (v: string) => setText(v));
    return unsubscribe;
  }, [display]);

  return <span>{text}</span>;
}

const ease = [0.22, 1, 0.36, 1] as const;

/* ═══════════════════════════════════════════════════
   PHASE DATA
   ═══════════════════════════════════════════════════ */

const phases = [
  {
    phase: "01",
    title: "Deposit Collateral",
    description:
      "Start with what you have. Deposit ETH, BTC, or USDC into your Vanna margin account.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
      </svg>
    ),
    accent: "#703AE6",
  },
  {
    phase: "02",
    title: "Borrow 10x Credit",
    description:
      "Vanna multiplies your capital up to 10x through undercollateralized credit.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    accent: "#FC5457",
  },
  {
    phase: "03",
    title: "Deploy Anywhere",
    description:
      "Trade perps, provide liquidity, yield farm — all from one account.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
    accent: "#3B82F6",
  },
  {
    phase: "04",
    title: "Manage Everything",
    description:
      "One dashboard. Track positions, health factor, and optimize in real-time.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    accent: "#8D61EB",
  },
];

/* ═══════════════════════════════════════════════════
   TIMELINE PANEL (LEFT)
   ═══════════════════════════════════════════════════ */

function TimelinePanel({
  activePhase,
  onPhaseClick,
}: {
  activePhase: number;
  onPhaseClick?: (phase: number) => void;
}) {
  return (
    <div className="flex flex-col gap-0">
      {phases.map((step, i) => {
        const isActive = i === activePhase;
        const isCompleted = i < activePhase;
        const accent = step.accent;

        return (
          <div
            key={step.phase}
            className="flex gap-4 sm:gap-6 cursor-pointer"
            onClick={() => onPhaseClick?.(i)}
          >
            {/* Dot + line */}
            <div className="flex flex-col items-center">
              <motion.div
                className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shrink-0 z-10"
                style={{
                  backgroundColor: isActive
                    ? `${accent}15`
                    : isCompleted
                      ? `${accent}10`
                      : "var(--surface-alt)",
                  color: isActive
                    ? accent
                    : isCompleted
                      ? accent
                      : "var(--text-muted)",
                  border: `1px solid ${isActive ? accent + "40" : isCompleted ? accent + "20" : "var(--card-border)"}`,
                }}
                animate={{
                  scale: isActive ? 1 : 0.9,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {isCompleted ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      d="M5 12l5 5L20 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  step.icon
                )}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{ border: `1px solid ${accent}` }}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>

              {i < phases.length - 1 && (
                <div
                  className="w-px flex-1 min-h-[24px] lg:min-h-[32px] xl:min-h-[40px]"
                  style={{
                    backgroundColor:
                      i < activePhase ? accent + "40" : "var(--border-default)",
                  }}
                />
              )}
            </div>

            {/* Text */}
            <div
              className={`pb-4 lg:pb-6 xl:pb-8 ${i === phases.length - 1 ? "!pb-0" : ""}`}
            >
              <motion.span
                className="text-[11px] font-mono tracking-wider mb-1 block uppercase"
                animate={{
                  color: isActive ? accent : "var(--text-muted)",
                  opacity: isActive ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
              >
                Phase {step.phase}
              </motion.span>
              <motion.h3
                className="text-base lg:text-lg font-semibold mb-1"
                animate={{
                  color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                  opacity: isActive || isCompleted ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
              >
                {step.title}
              </motion.h3>
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.p
                    className="text-xs lg:text-sm max-w-xs"
                    style={{ color: "var(--text-secondary)" }}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PHASE 01 — DEPOSIT WIDGET
   ═══════════════════════════════════════════════════ */

const depositAssets = [
  { symbol: "ETH", icon: "⟠" },
  { symbol: "BTC", icon: "₿" },
  { symbol: "USDC", icon: "$" },
];

function DepositWidget({
  deposit,
  setDeposit,
  asset,
  setAsset,
}: {
  deposit: number;
  setDeposit: (v: number) => void;
  asset: number;
  setAsset: (v: number) => void;
}) {
  const [deposited, setDeposited] = useState(false);

  return (
    <motion.div
      key="deposit"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease }}
      className="h-full flex flex-col"
    >
      <div
        className="rounded-2xl p-4 lg:p-5 xl:p-6 flex-1"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--card-border)",
        }}
      >
        <h4
          className="text-base lg:text-lg font-semibold mb-3 lg:mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Deposit to Vanna
        </h4>

        {/* Asset Selector */}
        <div className="mb-3 lg:mb-4">
          <label
            className="text-sm font-medium block mb-1.5 lg:mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Select Asset
          </label>
          <div className="flex gap-2 lg:gap-3">
            {depositAssets.map((a, i) => (
              <button
                key={a.symbol}
                onClick={() => {
                  setAsset(i);
                  setDeposited(false);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 lg:py-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                  asset === i
                    ? "border-violet-500 bg-violet-500/10 text-violet-500"
                    : "hover:border-violet-500/30"
                }`}
                style={
                  asset !== i
                    ? {
                        borderColor: "var(--border-input)",
                        color: "var(--text-secondary)",
                      }
                    : undefined
                }
              >
                <span className="text-lg">{a.icon}</span>
                {a.symbol}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div className="mb-3 lg:mb-4">
          <label
            className="text-sm font-medium block mb-1.5 lg:mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Amount
          </label>
          <div
            className="flex items-center rounded-xl px-4 py-2.5 lg:py-3 border transition-colors focus-within:border-violet-500"
            style={{
              backgroundColor: "var(--input-bg)",
              borderColor: "var(--border-input)",
            }}
          >
            <span
              className="text-base mr-2"
              style={{ color: "var(--text-muted)" }}
            >
              $
            </span>
            <input
              type="number"
              value={deposit}
              onChange={(e) => {
                setDeposit(Math.max(0, Number(e.target.value)));
                setDeposited(false);
              }}
              className="flex-1 bg-transparent text-base font-mono outline-none"
              style={{ color: "var(--text-primary)" }}
              min={0}
            />
          </div>
        </div>

        {/* Deposit Button */}
        <button
          onClick={() => setDeposited(true)}
          className="w-full py-2.5 lg:py-3 rounded-xl text-white font-semibold text-sm bg-vanna-gradient hover:opacity-90 transition-opacity mb-3 lg:mb-4 cursor-pointer"
        >
          Deposit to Vanna
        </button>

        {/* Animated deposit flow */}
        <AnimatePresence>
          {deposited && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-xl p-4"
              style={{
                backgroundColor: "var(--surface-alt)",
                border: "1px solid var(--border-default)",
              }}
            >
              {/* Flow steps */}
              {[
                {
                  label: "Wallet connected",
                  delay: 0,
                },
                {
                  label: `$${deposit.toLocaleString()} worth of ${depositAssets[asset].symbol} deposited`,
                  delay: 0.3,
                },
                {
                  label: "Collateral secured",
                  delay: 0.6,
                },
                {
                  label: `Up to $${(deposit * 10).toLocaleString()} leverage ready`,
                  delay: 0.9,
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 py-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: step.delay, duration: 0.3 }}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "#703AE620", color: "#703AE6" }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: step.delay + 0.15, type: "spring" }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        d="M5 12l5 5L20 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {step.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   PHASE 02 — CALCULATOR WIDGET
   ═══════════════════════════════════════════════════ */

function BarChart({
  traditional,
  vanna,
  compact = false,
}: {
  traditional: number;
  vanna: number;
  compact?: boolean;
}) {
  const ref = useRef(null);
  const maxVal = Math.max(traditional, vanna, 1);
  const barMax = compact ? 80 : 120;

  return (
    <div
      ref={ref}
      className={
        compact
          ? "flex items-end justify-center gap-5 h-28"
          : "flex items-end justify-center gap-6 lg:gap-8 h-28 lg:h-36 xl:h-40"
      }
    >
      {/* Traditional */}
      <div className={`flex flex-col items-center flex-1 max-w-24 ${compact ? "gap-1" : "gap-2"}`}>
        <span
          className={`${compact ? "text-[10px]" : "text-xs"} font-medium text-center`}
          style={{ color: "var(--text-muted)" }}
        >
          Traditional
        </span>
        <div className="relative w-full flex justify-center">
          <motion.div
            className={`${compact ? "w-12" : "w-14 lg:w-16"} rounded-t-lg`}
            style={{ backgroundColor: "var(--gauge-track)" }}
            animate={{ height: `${Math.max(6, (traditional / maxVal) * barMax)}px` }}
            transition={{ duration: 0.8, ease }}
          />
        </div>
        <span
          className={`${compact ? "text-xs" : "text-sm"} font-mono`}
          style={{ color: "var(--text-secondary)" }}
        >
          <AnimatedNumber value={traditional} prefix="$" />
        </span>
      </div>

      {/* VS */}
      <div className={`flex flex-col items-center justify-end ${compact ? "pb-5" : "pb-8"}`}>
        <span
          className="text-[10px] font-bold tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          VS
        </span>
      </div>

      {/* Vanna */}
      <div className={`flex flex-col items-center flex-1 max-w-24 ${compact ? "gap-1" : "gap-2"}`}>
        <span className={`${compact ? "text-[10px]" : "text-xs"} font-medium text-center text-violet-500`}>
          With Vanna
        </span>
        <div className="relative w-full flex justify-center">
          <motion.div
            className={`${compact ? "w-12" : "w-14 lg:w-16"} rounded-t-lg bg-vanna-gradient relative overflow-hidden`}
            animate={{ height: `${Math.max(6, (vanna / maxVal) * barMax)}px` }}
            transition={{ duration: 1, ease }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent animate-pulse-glow" />
          </motion.div>
        </div>
        <span className={`${compact ? "text-xs" : "text-sm"} font-mono text-violet-500 font-bold`}>
          <AnimatedNumber value={vanna} prefix="$" />
        </span>
      </div>
    </div>
  );
}

function CalculatorWidget({
  deposit,
  asset,
}: {
  deposit: number;
  asset: number;
}) {
  const [leverage, setLeverage] = useState(5);

  const totalPower = deposit * leverage;
  const traditionalPower = deposit * 0.7;

  return (
    <motion.div
      key="calculator"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease }}
      className="h-full flex flex-col"
    >
      <div
        className="rounded-2xl p-3 sm:p-4 lg:p-5 xl:p-6 flex-1"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--card-border)",
        }}
      >
        <h4
          className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Capital Multiplier
        </h4>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4">
          {/* Left: Inputs & Results */}
          <div className="flex-1 min-w-0">
            {/* Deposit summary from Phase 01 */}
            <div
              className="rounded-xl p-2 sm:p-2.5 lg:p-3 mb-2 sm:mb-3 lg:mb-4 flex items-center gap-2 sm:gap-3"
              style={{
                backgroundColor: "var(--surface-alt)",
                border: "1px solid var(--border-default)",
              }}
            >
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-base sm:text-lg"
                style={{ backgroundColor: "#703AE620", color: "#703AE6" }}
              >
                {depositAssets[asset].icon}
              </div>
              <div className="flex-1">
                <span
                  className="text-[10px] sm:text-xs block"
                  style={{ color: "var(--text-muted)" }}
                >
                  Your Deposit
                </span>
                <span
                  className="text-sm sm:text-base font-mono font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  ${deposit.toLocaleString()} {depositAssets[asset].symbol}
                </span>
              </div>
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#703AE620", color: "#703AE6" }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    d="M5 12l5 5L20 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Leverage */}
            <div className="mb-2 sm:mb-3 lg:mb-4">
              <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                <label
                  className="text-xs sm:text-sm font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Leverage
                </label>
                <motion.span
                  className="text-base sm:text-lg text-gradient font-bold font-mono"
                  key={leverage}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {leverage}x
                </motion.span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={leverage}
                onChange={(e) => setLeverage(Number(e.target.value))}
                className="w-full"
                style={{
                  background: `linear-gradient(to right, #703AE6 0%, #703AE6 ${((leverage - 1) / 9) * 100}%, var(--gauge-track) ${((leverage - 1) / 9) * 100}%, var(--gauge-track) 100%)`,
                }}
              />
              <div className="flex justify-between mt-1">
                <span
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  1x
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  10x
                </span>
              </div>
            </div>

            {/* Results */}
            <div
              className="rounded-xl p-2.5 sm:p-3 space-y-1.5 sm:space-y-2"
              style={{ backgroundColor: "var(--surface-alt)" }}
            >
              <div className="flex justify-between items-center">
                <span
                  className="text-xs sm:text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Total Trading Power
                </span>
                <span className="text-base sm:text-lg text-gradient font-mono font-bold">
                  <AnimatedNumber value={totalPower} prefix="$" />
                </span>
              </div>
              <div
                className="border-t pt-2 sm:pt-3"
                style={{ borderColor: "var(--border-default)" }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span
                    className="text-xs sm:text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Capital Multiplied
                  </span>
                  <span className="text-xs sm:text-sm text-violet-500 font-mono font-semibold">
                    {leverage}x
                  </span>
                </div>
                {/* <div
                  className="flex justify-between items-center "
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Est. Annual Yield
                  </span>
                  <span className="text-sm text-electric-blue-500 font-mono font-semibold">
                    ${estimatedYield}
                  </span>
                  you have to only pay Borrowed APR
                </div> */}
              </div>
            </div>
          </div>

          {/* Bar Chart — compact on mobile, full on sm+ */}
          <div className="flex flex-col items-center justify-center sm:w-[240px] shrink-0">
            <div className="sm:hidden w-full">
              <BarChart traditional={traditionalPower} vanna={totalPower} compact />
            </div>
            <div className="hidden sm:block">
              <BarChart traditional={traditionalPower} vanna={totalPower} />
            </div>

            {/* Comparison badge */}
            <div className="text-center mt-1.5 sm:mt-3">
              <span
                className="inline-block text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 rounded-xl"
                style={{
                  backgroundColor: "var(--badge-bg)",
                  color: "var(--badge-text)",
                }}
              >
                {(totalPower / traditionalPower || 0).toFixed(1)}x more trading
                power
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   PHASE 03 — STRATEGY WIDGET
   ═══════════════════════════════════════════════════ */

/* SVG Icons */
function ArrowUpIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}
function ArrowDownIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  );
}
function TrendUpIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
function BankIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
    </svg>
  );
}
function DropletIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}
function SproutIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 20h10M10 20c5.5-2.5.8-6.4 3-10" />
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
      <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
    </svg>
  );
}
function CoinsIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="M16.71 13.88l.7.71-2.82 2.82" />
    </svg>
  );
}

interface StrategyBlock {
  id: string;
  label: string;
  category: "perps" | "spot" | "lending" | "pool" | "yield";
  icon: React.ReactNode;
  color: string;
  riskScore: number;
  capitalWeight: number;
  yieldPct: number;
  exposure: "long" | "short" | "neutral";
  capitalEfficiency: number;
}

const stratBlocks: StrategyBlock[] = [
  {
    id: "spot-long",
    label: "Spot Buy",
    category: "spot",
    icon: <TrendUpIcon />,
    color: "#3B82F6",
    riskScore: 25,
    capitalWeight: 50,
    yieldPct: 0,
    exposure: "long",
    capitalEfficiency: 1,
  },
  {
    id: "perp-long",
    label: "Perp Long",
    category: "perps",
    icon: <ArrowUpIcon />,
    color: "#703AE6",
    riskScore: 70,
    capitalWeight: 20,
    yieldPct: -6,
    exposure: "long",
    capitalEfficiency: 5,
  },
  {
    id: "perp-short",
    label: "Perp Short",
    category: "perps",
    icon: <ArrowDownIcon />,
    color: "#703AE6",
    riskScore: 65,
    capitalWeight: 20,
    yieldPct: 6,
    exposure: "short",
    capitalEfficiency: 5,
  },
  {
    id: "lend",
    label: "Lend USDC",
    category: "lending",
    icon: <BankIcon />,
    color: "#FC5457",
    riskScore: 10,
    capitalWeight: 40,
    yieldPct: 4,
    exposure: "neutral",
    capitalEfficiency: 1,
  },
  {
    id: "lp-pool",
    label: "LP Pool",
    category: "pool",
    icon: <DropletIcon />,
    color: "#FB7185",
    riskScore: 30,
    capitalWeight: 35,
    yieldPct: 10,
    exposure: "neutral",
    capitalEfficiency: 2,
  },
  {
    id: "yield-farm",
    label: "Yield Farm",
    category: "yield",
    icon: <SproutIcon />,
    color: "#E879F9",
    riskScore: 40,
    capitalWeight: 35,
    yieldPct: 15,
    exposure: "neutral",
    capitalEfficiency: 2,
  },
];

interface StrategyTemplate {
  id: string;
  name: string;
  blocks: string[];
}

const stratTemplates: StrategyTemplate[] = [
  { id: "basis", name: "Basis Trade", blocks: ["spot-long", "perp-short"] },
  {
    id: "protected-farm",
    name: "Protected Farm",
    blocks: ["yield-farm", "perp-short"],
  },
  { id: "yield-stack", name: "Yield Stack", blocks: ["lend", "lp-pool"] },
  {
    id: "funding-arb",
    name: "Funding Arb",
    blocks: ["perp-long", "perp-short"],
  },
];

const catColorMap: Record<string, string> = {
  perps: "#703AE6",
  spot: "#3B82F6",
  lending: "#FC5457",
  pool: "#FB7185",
  yield: "#E879F9",
};

function StrategyWidget() {
  const [activeBlocks, setActiveBlocks] = useState<string[]>([
    "spot-long",
    "perp-short",
  ]);
  const [activeTemplate, setActiveTemplate] = useState("basis");

  const selectedBlocks = activeBlocks
    .map((id) => stratBlocks.find((b) => b.id === id))
    .filter(Boolean) as StrategyBlock[];

  const maxEfficiency = selectedBlocks.reduce(
    (acc, b) => Math.max(acc, b.capitalEfficiency),
    0,
  );

  const hasSpotLong = activeBlocks.includes("spot-long");
  const hasPerpLong = activeBlocks.includes("perp-long");
  const hasPerpShort = activeBlocks.includes("perp-short");
  const longCount = selectedBlocks.filter((b) => b.exposure === "long").length;
  const shortCount = selectedBlocks.filter(
    (b) => b.exposure === "short",
  ).length;
  const neutralCount = selectedBlocks.filter(
    (b) => b.exposure === "neutral",
  ).length;
  const isHedged = longCount > 0 && shortCount > 0;
  const isAllNeutral =
    selectedBlocks.length > 0 && neutralCount === selectedBlocks.length;

  const baseYield = selectedBlocks.reduce((acc, b) => acc + b.yieldPct, 0);
  const hasLend = activeBlocks.includes("lend");
  const hasLpPool = activeBlocks.includes("lp-pool");
  const hasYieldFarm = activeBlocks.includes("yield-farm");
  let strategyBonus = 0;
  if (hasPerpLong && hasPerpShort) strategyBonus += 3;
  else if (hasSpotLong && hasPerpShort) strategyBonus += 4;
  if (hasLend && (hasLpPool || hasYieldFarm)) strategyBonus += 3;
  const totalYield = baseYield + strategyBonus;

  const exposureLabel =
    selectedBlocks.length === 0
      ? "—"
      : isHedged
        ? "Hedged"
        : longCount > 0
          ? "Long"
          : shortCount > 0
            ? "Short"
            : "Neutral";
  const exposureColor =
    exposureLabel === "Hedged" || exposureLabel === "Neutral"
      ? "#3B82F6"
      : exposureLabel === "Long"
        ? "#703AE6"
        : exposureLabel === "Short"
          ? "#FC5457"
          : "var(--text-muted)";

  const totalWeight = selectedBlocks.reduce((s, b) => s + b.capitalWeight, 0);
  const weightedRisk =
    totalWeight > 0
      ? selectedBlocks.reduce(
          (s, b) => s + b.riskScore * (b.capitalWeight / totalWeight),
          0,
        )
      : 0;
  const hedgeMultiplier = isHedged ? 0.4 : isAllNeutral ? 0.7 : 1;
  const riskPct = Math.min(100, Math.round(weightedRisk * hedgeMultiplier));
  const riskLabel = riskPct > 60 ? "High" : riskPct > 30 ? "Medium" : "Low";
  const riskColor =
    riskPct > 60 ? "#FC5457" : riskPct > 30 ? "#703AE6" : "#3B82F6";

  const selectTemplate = (t: StrategyTemplate) => {
    setActiveTemplate(t.id);
    setActiveBlocks(t.blocks);
  };
  const toggleBlock = (id: string) => {
    setActiveTemplate("");
    setActiveBlocks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <motion.div
      key="strategy"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease }}
    >
      {/* Template Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {stratTemplates.map((t) => (
          <button
            key={t.id}
            onClick={() => selectTemplate(t)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 border cursor-pointer ${
              activeTemplate === t.id
                ? "border-violet-500 bg-violet-500/10 text-violet-500"
                : ""
            }`}
            style={
              activeTemplate !== t.id
                ? {
                    borderColor: "var(--card-border)",
                    color: "var(--text-secondary)",
                    backgroundColor: "var(--card-bg)",
                  }
                : undefined
            }
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Left: Strategy Blocks Toolbox */}
        <div
          className="rounded-2xl p-4"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--card-border)",
          }}
        >
          <h3
            className="text-sm font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Strategy Blocks
          </h3>
          <div className="space-y-1.5 max-h-[45vh] overflow-y-auto scrollbar-hide">
            {stratBlocks.map((block) => {
              const isActive = activeBlocks.includes(block.id);
              return (
                <motion.button
                  key={block.id}
                  onClick={() => toggleBlock(block.id)}
                  className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all duration-200 border ${
                    isActive ? "border-opacity-50" : ""
                  }`}
                  style={{
                    borderColor: isActive ? block.color : "var(--card-border)",
                    backgroundColor: isActive
                      ? block.color + "10"
                      : "transparent",
                  }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className="w-1 h-8 rounded-full shrink-0"
                    style={{ backgroundColor: catColorMap[block.category] }}
                  />
                  <span style={{ color: block.color }}>{block.icon}</span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {block.label}
                  </span>
                  {isActive && (
                    <motion.span
                      className="ml-auto"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{ color: block.color }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M3 7l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Center: Active Strategy Canvas */}
        <div
          className="rounded-2xl p-4"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--card-border)",
          }}
        >
          <h3
            className="text-sm font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Active Strategy
          </h3>
          <AnimatePresence mode="wait">
            {selectedBlocks.length === 0 ? (
              <motion.div
                key="empty"
                className="flex items-center justify-center h-48 rounded-xl border-2 border-dashed"
                style={{ borderColor: "var(--card-border)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Select blocks or a template
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {selectedBlocks.map((block, i) => (
                  <motion.div
                    key={block.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="flex items-center gap-3 p-4 rounded-xl relative overflow-hidden"
                    style={{
                      backgroundColor: block.color + "08",
                      border: `1px solid ${block.color}25`,
                    }}
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1"
                      style={{ backgroundColor: block.color }}
                    />
                    <span className="ml-2" style={{ color: block.color }}>
                      {block.icon}
                    </span>
                    <div className="flex-1">
                      <span
                        className="text-sm font-semibold block"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {block.label}
                      </span>
                      <span
                        className="text-xs capitalize"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {block.category}
                      </span>
                    </div>
                    <span
                      className="text-xs font-mono"
                      style={{ color: block.color }}
                    >
                      {block.capitalEfficiency}x
                    </span>
                    {i < selectedBlocks.length - 1 && (
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10">
                        <svg width="16" height="12" viewBox="0 0 16 12">
                          <path
                            d="M8 0 L8 12"
                            stroke="var(--text-muted)"
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                            fill="none"
                          />
                        </svg>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Strategy Overview Metrics */}
        <div
          className="rounded-2xl p-4"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--card-border)",
          }}
        >
          <h3
            className="text-sm font-semibold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Strategy Overview
          </h3>

          {/* Yield */}
          <div className="text-center mb-4">
            <motion.span
              className="text-2xl font-mono font-bold block"
              style={{ color: totalYield >= 0 ? "#3B82F6" : "#FC5457" }}
              key={totalYield}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {totalYield >= 0 ? "+" : ""}
              {totalYield}%
            </motion.span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Estimated ROI
            </span>
          </div>

          {/* Metrics */}
          <div
            className="rounded-xl p-3 mb-3"
            style={{ backgroundColor: "var(--surface-alt)" }}
          >
            <span
              className="text-xs block mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              Strategy Metrics
            </span>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <span
                  className="text-[10px] block mb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Exposure
                </span>
                <span
                  className="text-xs font-mono font-semibold"
                  style={{ color: exposureColor }}
                >
                  {exposureLabel}
                </span>
              </div>
              <div>
                <span
                  className="text-[10px] block mb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Leverage
                </span>
                <span
                  className="text-xs font-mono font-semibold"
                  style={{ color: "#703AE6" }}
                >
                  {selectedBlocks.length === 0 ? "—" : `${maxEfficiency}x`}
                </span>
              </div>
              <div>
                <span
                  className="text-[10px] block mb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Protocols
                </span>
                <span
                  className="text-xs font-mono font-semibold"
                  style={{ color: "#E879F9" }}
                >
                  {selectedBlocks.length === 0
                    ? "0"
                    : new Set(selectedBlocks.map((b) => b.category)).size}
                </span>
              </div>
            </div>
          </div>

          {/* Capital Allocation */}
          {selectedBlocks.length > 0 && (
            <div className="mb-3">
              <span
                className="text-xs block mb-1.5"
                style={{ color: "var(--text-muted)" }}
              >
                Capital Allocation
              </span>
              <div className="space-y-1.5">
                {selectedBlocks.map((block) => {
                  const pct =
                    totalWeight > 0
                      ? Math.round((block.capitalWeight / totalWeight) * 100)
                      : 0;
                  return (
                    <div key={block.id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: "var(--text-secondary)" }}>
                          {block.label}
                        </span>
                        <span
                          className="font-mono"
                          style={{ color: block.color }}
                        >
                          {pct}%
                        </span>
                      </div>
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ backgroundColor: "var(--gauge-track)" }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: block.color }}
                          animate={{ width: `${pct}%` }}
                          transition={{ type: "spring", stiffness: 100 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Risk */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                Risk Level
              </span>
              <span
                className="text-sm font-mono font-semibold"
                style={{ color: riskColor }}
              >
                {riskLabel}
              </span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: "var(--gauge-track)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #3B82F6, #703AE6, #FC5457)",
                }}
                animate={{ width: `${riskPct}%` }}
                transition={{ type: "spring", stiffness: 100 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p
        className="text-center text-[10px] mt-4"
        style={{ color: "var(--text-muted)", opacity: 0.7 }}
      >
        Simulated yields are illustrative. Actual returns vary with market
        conditions. Not financial advice.
      </p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   PHASE 04 — DASHBOARD WIDGET
   ═══════════════════════════════════════════════════ */

const positions = [
  { name: "ETH Spot Long", pnl: "+12.4%", color: "#3B82F6" },
  { name: "ETH Perp Short", pnl: "+6.2%", color: "#703AE6" },
  { name: "USDC Lend", pnl: "+4.0%", color: "#FC5457" },
  { name: "LP Pool (ETH/USDC)", pnl: "+10.1%", color: "#FB7185" },
];

const protocols = ["Hyperliquid", "Derive", "Morpho", "Aerodrome"];

function DashboardWidget() {
  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease }}
      className="h-full flex flex-col"
    >
      <div
        className="rounded-2xl p-4 lg:p-5 xl:p-6 flex-1"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--card-border)",
        }}
      >
        <h4
          className="text-base lg:text-lg font-semibold mb-3 lg:mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Portfolio Dashboard
        </h4>

        {/* Portfolio Overview */}
        <div
          className="rounded-xl p-3 lg:p-4 mb-3 lg:mb-4"
          style={{ backgroundColor: "var(--surface-alt)" }}
        >
          <div className="grid grid-cols-3 gap-3 lg:gap-4 text-center">
            <div>
              <span
                className="text-xs block mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                Total Value
              </span>
              <span
                className="text-lg font-mono font-bold block"
                style={{ color: "var(--text-primary)" }}
              >
                <AnimatedNumber value={10450} prefix="$" />
              </span>
            </div>
            <div>
              <span
                className="text-xs block mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                P&L Today
              </span>
              <span className="text-lg font-mono font-bold block text-electric-blue-500">
                +$450
              </span>
            </div>
            <div>
              <span
                className="text-xs block mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                Net APY
              </span>
              <span className="text-lg font-mono font-bold block text-violet-500">
                +14.2%
              </span>
            </div>
          </div>
        </div>

        {/* Health Factor */}
        <div className="mb-3 lg:mb-4">
          <div className="flex justify-between items-center mb-2">
            <span
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Health Factor
            </span>
            <span className="text-sm font-mono font-bold text-electric-blue-500">
              1.82
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: "var(--gauge-track)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #FC5457, #703AE6, #3B82F6)",
              }}
              initial={{ width: 0 }}
              animate={{ width: "72%" }}
              transition={{ duration: 1, ease }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span
              className="text-[10px]"
              style={{ color: "var(--text-muted)" }}
            >
              Liquidation
            </span>
            <span
              className="text-[10px]"
              style={{ color: "var(--text-muted)" }}
            >
              Safe
            </span>
          </div>
        </div>

        {/* Active Positions */}
        <div className="mb-3 lg:mb-4">
          <span
            className="text-sm font-medium block mb-1.5 lg:mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Active Positions
          </span>
          <div className="space-y-1.5">
            {positions.map((pos, i) => (
              <motion.div
                key={pos.name}
                className="flex items-center justify-between p-2.5 rounded-lg"
                style={{
                  backgroundColor: pos.color + "08",
                  border: `1px solid ${pos.color}15`,
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-1 h-5 rounded-full"
                    style={{ backgroundColor: pos.color }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {pos.name}
                  </span>
                </div>
                <span
                  className="text-sm font-mono font-semibold"
                  style={{ color: "#3B82F6" }}
                >
                  {pos.pnl}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Connected Protocols */}
        {/* <div>
          <span
            className="text-sm font-medium block mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Protocols Connected
          </span>
          <div className="flex flex-wrap gap-2">
            {protocols.map((p) => (
              <span
                key={p}
                className="text-xs px-3 py-1.5 rounded-lg font-medium"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-default)",
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div> */}
      </div>

      {/* Disclaimer */}
      <p
        className="text-center text-[10px] mt-3"
        style={{ color: "var(--text-muted)", opacity: 0.7 }}
      >
        Dashboard data is simulated for demonstration purposes. Actual portfolio
        values, P&L, and health factors will vary based on real market
        conditions.
      </p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN SECTION
   ═══════════════════════════════════════════════════ */

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activePhase, setActivePhase] = useState(0);
  const [deposit, setDeposit] = useState(1000);
  const [asset, setAsset] = useState(0);
  const prevPhaseRef = useRef(0);
  const isClickScrolling = useRef(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Smooth opacity that fades content out at the very end of the section
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.92, 1],
    [0, 1, 1, 0],
  );
  const contentY = useTransform(scrollYProgress, [0.92, 1], [0, -30]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // Skip intermediate phases during click-initiated scrolls
    if (isClickScrolling.current) return;
    const clamped = Math.max(0, Math.min(1, v));
    const phase = Math.min(3, Math.floor(clamped * 3.99));
    // Only update state if phase actually changed — prevents scroll jank
    if (phase !== prevPhaseRef.current) {
      prevPhaseRef.current = phase;
      setActivePhase(phase);
    }
  });

  const scrollToPhase = (phase: number) => {
    if (!sectionRef.current) return;
    // Immediately set the phase so widget switches instantly
    prevPhaseRef.current = phase;
    setActivePhase(phase);
    // Lock scroll listener during smooth scroll
    isClickScrolling.current = true;
    const sectionTop = sectionRef.current.offsetTop;
    const sectionHeight = sectionRef.current.offsetHeight;
    // Each phase occupies ~25% of the 300vh section
    const targetScroll = sectionTop + (phase / 4) * sectionHeight;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
    // Unlock after scroll completes — longer on mobile due to taller section
    const scrollDistance = Math.abs(targetScroll - window.scrollY);
    const unlockDelay = Math.min(1500, Math.max(800, scrollDistance / 2));
    setTimeout(() => {
      isClickScrolling.current = false;
    }, unlockDelay);
  };

  const renderWidget = () => {
    switch (activePhase) {
      case 0:
        return (
          <DepositWidget
            key={0}
            deposit={deposit}
            setDeposit={setDeposit}
            asset={asset}
            setAsset={setAsset}
          />
        );
      case 1:
        return <CalculatorWidget key={1} deposit={deposit} asset={asset} />;
      case 2:
        return <StrategyWidget key={2} />;
      case 3:
        return <DashboardWidget key={3} />;
      default:
        return null;
    }
  };

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative h-[700vh] sm:h-[500vh] lg:h-[300vh]"
    >
      {/* Sticky container — offset top for navbar */}
      <div
        className="sticky top-0 h-screen overflow-x-visible overflow-y-clip"
        style={{
          backgroundColor: "var(--background-alt)",
          willChange: "transform",
        }}
      >
        {/* Background glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-[0.03] pointer-events-none"
          style={{ background: "linear-gradient(135deg, #FC5457, #703AE6)" }}
        />

        <motion.div
          className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 h-full flex flex-col"
          style={{ opacity: contentOpacity, y: contentY }}
        >
          {/* Section Header */}
          <div className="text-center pt-6 sm:pt-10 lg:pt-16 xl:pt-20 pb-2 sm:pb-3 lg:pb-6 shrink-0">
            <p className="text-violet-500 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-1 sm:mb-2">
              How It Works
            </p>
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-h3 text-heading mb-1 sm:mb-2">
              From deposit to deployment
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-subtext text-paragraph max-w-xl mx-auto hidden sm:block">
              Here&apos;s how your $1,000 becomes $10,000 of trading power
              across DeFi.
            </p>
          </div>

          {/* Desktop: 2 col sticky layout */}
          <div className="hidden lg:grid grid-cols-[240px_1fr] xl:grid-cols-[320px_1fr] gap-4 xl:gap-12 flex-1 min-h-0 pb-1 lg:pb-2 xl:pb-4">
            {/* Left: Timeline — vertically centered */}
            <div className="flex items-center overflow-y-auto overflow-x-visible scrollbar-hide pl-3">
              <TimelinePanel
                activePhase={activePhase}
                onPhaseClick={scrollToPhase}
              />
            </div>

            {/* Right: Widget — vertically centered, scrollable if needed */}
            <div className="flex items-center justify-center overflow-y-auto scrollbar-hide py-2">
              <div className="w-full my-auto">
                <AnimatePresence mode="wait">{renderWidget()}</AnimatePresence>
              </div>
            </div>
          </div>

          {/* Mobile: stacked */}
          <div className="lg:hidden flex-1 flex flex-col min-h-0">
            {/* Phase indicator — always visible */}
            <div className="shrink-0">
              <div className="flex justify-center gap-2 mb-2">
                {phases.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToPhase(i)}
                    className="w-2 h-2 rounded-full transition-all duration-300 cursor-pointer"
                    style={{
                      backgroundColor:
                        i === activePhase
                          ? phases[i].accent
                          : "var(--gauge-track)",
                      transform: i === activePhase ? "scale(1.3)" : "scale(1)",
                    }}
                  />
                ))}
              </div>

              {/* Phase title */}
              <div className="text-center mb-3">
                <span
                  className="text-xs font-mono tracking-wider uppercase"
                  style={{ color: phases[activePhase].accent }}
                >
                  Phase {phases[activePhase].phase}
                </span>
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {phases[activePhase].title}
                </h3>
              </div>
            </div>

            {/* Widget — scrollable area */}
            <div className="flex-1 overflow-y-auto scrollbar-hide pb-4">
              <AnimatePresence mode="wait">{renderWidget()}</AnimatePresence>
            </div>
          </div>

          {/* Scroll progress indicator */}
          {/* <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
            {phases.map((p, i) => (
              <button
                key={i}
                className="w-8 h-1 rounded-full transition-all duration-500"
                style={{
                  backgroundColor:
                    i === activePhase ? p.accent : "var(--gauge-track)",
                  transform: i === activePhase ? "scaleX(1.5)" : "scaleX(1)",
                }}
                aria-label={`Phase ${i + 1}`}
              />
            ))}
          </div> */}
        </motion.div>
      </div>
    </section>
  );
}
