"use client";

/**
 * Section 6: Strategy Architect - Interactive Strategy Builder
 * Users select pre-built strategy templates and see live P&L metrics
 * Based on: Perps, Spot, Lending, Pool & Yield Farm
 */

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* ── Inline SVG icons (no emojis) ── */

function ArrowUpIcon() {
  return (
    <svg
      width="18"
      height="18"
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
      width="18"
      height="18"
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
      width="18"
      height="18"
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
      width="18"
      height="18"
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
      width="18"
      height="18"
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
      width="18"
      height="18"
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
      width="18"
      height="18"
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

/* ── Data types ── */

interface StrategyBlock {
  id: string;
  label: string;
  category: "perps" | "spot" | "lending" | "pool" | "yield";
  icon: React.ReactNode;
  color: string;
  leveragePct: number; // How much leverage this uses (0-100)
  yieldPct: number; // APY contribution
  exposure: "long" | "short" | "neutral";
  capitalEfficiency: number; // multiplier e.g. 1x, 5x, 10x
}

const allBlocks: StrategyBlock[] = [
  {
    id: "spot-long",
    label: "Spot Buy",
    category: "spot",
    icon: <TrendUpIcon />,
    color: "#32EEE2",
    leveragePct: 10,
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
    leveragePct: 60,
    yieldPct: -2,
    exposure: "long",
    capitalEfficiency: 5,
  },
  {
    id: "perp-short",
    label: "Perp Short",
    category: "perps",
    icon: <ArrowDownIcon />,
    color: "#703AE6",
    leveragePct: 60,
    yieldPct: -2,
    exposure: "short",
    capitalEfficiency: 5,
  },
  {
    id: "lend",
    label: "Lend USDC",
    category: "lending",
    icon: <BankIcon />,
    color: "#FC5457",
    leveragePct: 5,
    yieldPct: 8,
    exposure: "neutral",
    capitalEfficiency: 1,
  },
  {
    id: "borrow",
    label: "Borrow",
    category: "lending",
    icon: <CoinsIcon />,
    color: "#FC5457",
    leveragePct: 40,
    yieldPct: -6,
    exposure: "neutral",
    capitalEfficiency: 3,
  },
  {
    id: "lp-pool",
    label: "LP Pool",
    category: "pool",
    icon: <DropletIcon />,
    color: "#FB7185",
    leveragePct: 15,
    yieldPct: 12,
    exposure: "neutral",
    capitalEfficiency: 2,
  },
  {
    id: "yield-farm",
    label: "Yield Farm",
    category: "yield",
    icon: <SproutIcon />,
    color: "#E879F9",
    leveragePct: 20,
    yieldPct: 18,
    exposure: "neutral",
    capitalEfficiency: 2,
  },
];

interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  blocks: string[];
}

const templates: StrategyTemplate[] = [
  {
    id: "basis",
    name: "Basis Trade",
    description: "Market neutral. Profit from funding rates while hedged.",
    blocks: ["spot-long", "perp-short"],
  },
  {
    id: "delta-neutral",
    name: "Delta Neutral Farm",
    description: "Leveraged yield with zero directional risk.",
    blocks: ["yield-farm", "perp-short"],
  },
  {
    id: "lend-earn",
    name: "Lend & Earn",
    description: "Passive income from lending and liquidity provision.",
    blocks: ["lend", "lp-pool"],
  },
  {
    id: "leveraged-long",
    name: "Leveraged Long",
    description: "Amplified upside via perps + borrowed capital.",
    blocks: ["perp-long", "borrow"],
  },
];

const categoryColorMap: Record<string, string> = {
  perps: "#703AE6",
  spot: "#32EEE2",
  lending: "#FC5457",
  pool: "#FB7185",
  yield: "#E879F9",
};

/* ── Mini metric component ── */

function MiniMetric({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="text-center">
      <span
        className="text-body-3 block mb-1"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </span>
      <span className="text-h9 font-mono block" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

export default function StrategySection() {
  const [activeBlocks, setActiveBlocks] = useState<string[]>([
    "spot-long",
    "perp-short",
  ]);
  const [activeTemplate, setActiveTemplate] = useState("basis");
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const selectedBlocks = activeBlocks
    .map((id) => allBlocks.find((b) => b.id === id))
    .filter(Boolean) as StrategyBlock[];

  /* Compute aggregate metrics */
  const totals = selectedBlocks.reduce(
    (acc, b) => ({
      yieldPct: acc.yieldPct + b.yieldPct,
      leveragePct: acc.leveragePct + b.leveragePct,
      maxEfficiency: Math.max(acc.maxEfficiency, b.capitalEfficiency),
    }),
    { yieldPct: 0, leveragePct: 0, maxEfficiency: 0 },
  );

  /* Determine exposure type */
  const longCount = selectedBlocks.filter((b) => b.exposure === "long").length;
  const shortCount = selectedBlocks.filter(
    (b) => b.exposure === "short",
  ).length;
  const exposureLabel =
    selectedBlocks.length === 0
      ? "—"
      : longCount > 0 && shortCount > 0
        ? "Hedged"
        : longCount > 0
          ? "Long"
          : shortCount > 0
            ? "Short"
            : "Neutral";

  const exposureColor =
    exposureLabel === "Hedged" || exposureLabel === "Neutral"
      ? "#32EEE2"
      : exposureLabel === "Long"
        ? "#703AE6"
        : exposureLabel === "Short"
          ? "#FC5457"
          : "var(--text-muted)";

  /* Risk level based on leverage */
  const riskPct = Math.min(100, totals.leveragePct);
  const riskLabel = riskPct > 70 ? "High" : riskPct > 35 ? "Medium" : "Low";
  const riskColor =
    riskPct > 70 ? "#FC5457" : riskPct > 35 ? "#703AE6" : "#32EEE2";

  const selectTemplate = (template: StrategyTemplate) => {
    setActiveTemplate(template.id);
    setActiveBlocks(template.blocks);
  };

  const toggleBlock = (blockId: string) => {
    setActiveTemplate("");
    setActiveBlocks((prev) =>
      prev.includes(blockId)
        ? prev.filter((id) => id !== blockId)
        : [...prev, blockId],
    );
  };

  return (
    <section
      id="strategy"
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-violet-500 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Strategy Architect
          </p>
          <h2 className="text-h3 text-heading mb-4">
            Build your strategy. See the result.
          </h2>
          <p className="text-subtext text-paragraph max-w-xl mx-auto">
            Compose multi-protocol strategies with composable leverage across
            perps, spot, lending, pools & yield farming.
          </p>
        </motion.div>

        {/* Template Selector */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => selectTemplate(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
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
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Toolbox */}
          <motion.div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--card-border)",
            }}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            <h3
              className="text-h10 mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Strategy Blocks
            </h3>
            <div className="space-y-2">
              {allBlocks.map((block) => {
                const isActive = activeBlocks.includes(block.id);
                return (
                  <motion.button
                    key={block.id}
                    onClick={() => toggleBlock(block.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 border ${
                      isActive ? "border-opacity-50" : ""
                    }`}
                    style={{
                      borderColor: isActive
                        ? block.color
                        : "var(--card-border)",
                      backgroundColor: isActive
                        ? block.color + "10"
                        : "transparent",
                    }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className="w-1 h-8 rounded-full shrink-0"
                      style={{
                        backgroundColor: categoryColorMap[block.category],
                      }}
                    />
                    <span style={{ color: block.color }}>{block.icon}</span>
                    <span
                      className="text-body-2 font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {block.label}
                    </span>
                    {isActive && (
                      <motion.span
                        className="ml-auto text-body-3 font-bold"
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
          </motion.div>

          {/* Center: Active Strategy Canvas */}
          <motion.div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--card-border)",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
          >
            <h3
              className="text-h10 mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Active Strategy
            </h3>

            <AnimatePresence mode="popLayout">
              {selectedBlocks.length === 0 ? (
                <motion.div
                  key="empty"
                  className="flex items-center justify-center h-48 rounded-xl border-2 border-dashed"
                  style={{ borderColor: "var(--card-border)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p
                    className="text-body-2"
                    style={{ color: "var(--text-muted)" }}
                  >
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
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      className="flex items-center gap-3 p-4 rounded-xl relative overflow-hidden"
                      style={{
                        backgroundColor: block.color + "08",
                        border: `1px solid ${block.color}25`,
                      }}
                    >
                      {/* Left stripe */}
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1"
                        style={{ backgroundColor: block.color }}
                      />

                      <span className="ml-2" style={{ color: block.color }}>
                        {block.icon}
                      </span>
                      <div className="flex-1">
                        <span
                          className="text-body-2 font-semibold block"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {block.label}
                        </span>
                        <span
                          className="text-body-3 capitalize"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {block.category}
                        </span>
                      </div>
                      <span
                        className="text-body-3 font-mono"
                        style={{ color: block.color }}
                      >
                        {block.capitalEfficiency}x
                      </span>

                      {/* Connection arrow to next */}
                      {i < selectedBlocks.length - 1 && (
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10">
                          <svg
                            width="16"
                            height="12"
                            viewBox="0 0 16 12"
                            className="animate-dash"
                          >
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

            {/* Strategy description */}
            {activeTemplate && (
              <motion.p
                className="text-body-3 mt-4 text-center"
                style={{ color: "var(--text-muted)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={activeTemplate}
              >
                {templates.find((t) => t.id === activeTemplate)?.description}
              </motion.p>
            )}
          </motion.div>

          {/* Right: Live Strategy Metrics */}
          <motion.div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--card-border)",
            }}
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5 }}
          >
            <h3
              className="text-h10 mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Strategy Overview
            </h3>

            {/* Yield display */}
            <div className="text-center mb-8">
              <motion.span
                className="text-h3 font-mono block"
                style={{ color: totals.yieldPct >= 0 ? "#32EEE2" : "#FC5457" }}
                key={totals.yieldPct}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {totals.yieldPct >= 0 ? "+" : ""}
                {totals.yieldPct}%
              </motion.span>
              <span
                className="text-body-3"
                style={{ color: "var(--text-muted)" }}
              >
                Estimated Annual Yield
              </span>
            </div>

            {/* Strategy metrics panel */}
            <div
              className="rounded-xl p-5 mb-6"
              style={{ backgroundColor: "var(--surface-alt)" }}
            >
              <span
                className="text-body-3 block mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                Strategy Metrics
              </span>
              <div className="grid grid-cols-3 gap-4">
                <MiniMetric
                  label="Exposure"
                  value={exposureLabel}
                  color={exposureColor}
                />
                <MiniMetric
                  label="Leverage"
                  value={
                    selectedBlocks.length === 0
                      ? "—"
                      : `${totals.maxEfficiency}x`
                  }
                  color="#703AE6"
                />
                <MiniMetric
                  label="Protocols"
                  value={
                    selectedBlocks.length === 0
                      ? "0"
                      : `${new Set(selectedBlocks.map((b) => b.category)).size}`
                  }
                  color="#E879F9"
                />
              </div>
            </div>

            {/* Capital allocation breakdown */}
            {selectedBlocks.length > 0 && (
              <div className="mb-6">
                <span
                  className="text-body-3 block mb-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  Capital Allocation
                </span>
                <div className="space-y-2">
                  {selectedBlocks.map((block) => {
                    const totalLeverage = selectedBlocks.reduce(
                      (s, b) => s + b.leveragePct,
                      0,
                    );
                    const pct =
                      totalLeverage > 0
                        ? Math.round((block.leveragePct / totalLeverage) * 100)
                        : 0;
                    return (
                      <div key={block.id}>
                        <div className="flex justify-between text-body-3 mb-1">
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

            {/* Risk level */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span
                  className="text-body-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  Risk Level
                </span>
                <span
                  className="text-h11 font-mono"
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
                      "linear-gradient(90deg, #32EEE2, #703AE6, #FC5457)",
                  }}
                  animate={{ width: `${riskPct}%` }}
                  transition={{ type: "spring", stiffness: 100 }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
