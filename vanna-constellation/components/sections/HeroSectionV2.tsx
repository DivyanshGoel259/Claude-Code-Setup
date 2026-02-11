"use client";

/**
 * Hero Section V2 — Image-inspired layout
 * Large heading + subtitle + CTA + Vanna App Dashboard mockup
 * Theme-aware (light + dark), Framer Motion animations
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ═══════════════════════════════════════════════════
   Mockup SVG Icons
   ═══════════════════════════════════════════════════ */

function VannaLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="url(#mockup-vl)" />
      <path
        d="M16 8l-6 8 6 8 6-8-6-8z"
        fill="white"
        fillOpacity="0.9"
      />
      <defs>
        <linearGradient id="mockup-vl" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#FC5457" />
          <stop offset="1" stopColor="#703AE6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--text-muted)"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

function ShieldIcon({ color = "#703AE6" }: { color?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function CubeIcon({ color = "#3B82F6" }: { color?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function DollarIcon({ color = "#10B981" }: { color?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M16 8h-5a3 3 0 000 6h2a3 3 0 010 6H7" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
    </svg>
  );
}

function WalletIcon({ color = "#703AE6" }: { color?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="5" width="22" height="16" rx="2" />
      <path d="M1 10h22" />
      <circle cx="17" cy="15" r="1" />
    </svg>
  );
}

function TrendDownIcon({ color = "#703AE6" }: { color?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );
}

function ChevronDown() {
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
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ChevronRight() {
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
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function MarginInfoSvg() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="10" fill="rgba(112,58,230,0.10)" />
      <path
        d="M18 10l-5 6h3.5v4h3v-4H23l-5-6z"
        fill="#703AE6"
      />
      <path
        d="M12 24h12"
        stroke="#703AE6"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   Stat Card
   ═══════════════════════════════════════════════════ */
function StatCard({
  icon,
  iconBg,
  label,
  value,
  valueColor,
  suffix,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  valueColor?: string;
  suffix?: string;
}) {
  return (
    <div
      className="rounded-xl p-3"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--card-border)",
      }}
    >
      <div className="flex items-start gap-2.5">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <div
            className="text-[11px] leading-tight mb-0.5"
            style={{ color: "var(--text-muted)" }}
          >
            {label}
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className="text-h8 font-mono"
              style={{ color: valueColor || "var(--text-primary)" }}
            >
              {value}
            </span>
            {suffix && (
              <span
                className="text-[10px]"
                style={{ color: valueColor || "var(--text-muted)" }}
              >
                {suffix}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Dashboard Mockup — Vanna App Preview
   ═══════════════════════════════════════════════════ */
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
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ borderBottom: "1px solid var(--card-border)" }}
      >
        <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
        <span className="w-3 h-3 rounded-full bg-[#28C840]" />
      </div>

      {/* ─ App content — overflow hidden with bottom fade ─ */}
      <div className="relative" style={{ maxHeight: 660, overflow: "hidden" }}>
        {/* ── App Navbar ── */}
        <div
          className="flex items-center justify-between px-5 py-2.5"
          style={{ borderBottom: "1px solid var(--card-border)" }}
        >
          <div className="flex items-center gap-2">
            <VannaLogo />
            <span
              className="text-h9 font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              vanna
            </span>
          </div>

          <div className="hidden md:flex items-center gap-5 text-body-2">
            <span style={{ color: "var(--text-secondary)" }}>Portfolio</span>
            <span style={{ color: "var(--text-secondary)" }}>Earn</span>
            <span
              className="font-semibold flex items-center gap-1"
              style={{ color: "#FC5457" }}
            >
              ⚡ Margin
            </span>
            <span style={{ color: "var(--text-secondary)" }}>Trade</span>
            <span style={{ color: "var(--text-secondary)" }}>Analytics</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div
              className="px-3.5 py-1.5 rounded-full text-body-3 font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #FC5457, #e04347)",
              }}
            >
              Deposit
            </div>
            <MoonIcon />
            <div
              className="px-3 py-1 rounded-full text-body-3 font-mono"
              style={{
                border: "1px solid var(--card-border)",
                color: "var(--text-secondary)",
              }}
            >
              0x01f7...b84f
            </div>
          </div>
        </div>

        {/* ── Purple Banner ── */}
        <div
          className="mx-5 mt-4 rounded-xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #703AE6 0%, #8D61EB 50%, #BDA4F4 100%)",
          }}
        >
          <div className="p-4 flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white" fillOpacity="0.9">
                <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" />
              </svg>
            </div>
            <div>
              <div className="text-body-1 font-bold text-white">
                Multicollateral Loans
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/30 mx-1" />
            <div className="hidden sm:block text-body-3 text-white/80 max-w-xs">
              Don&apos;t want to sell your ETH, LSTs, LRTs, and other bags?
              Borrow against them!
            </div>
          </div>
        </div>

        {/* Carousel dots */}
        <div className="flex justify-center gap-1.5 mt-2.5">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "var(--text-muted)", opacity: 0.35 }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "#703AE6" }}
          />
        </div>

        {/* ── Stats Row 1 — 3 cards ── */}
        <div className="grid grid-cols-3 gap-3 px-5 mt-4">
          <StatCard
            icon={<ShieldIcon />}
            iconBg="rgba(112, 58, 230, 0.10)"
            label="Net Health Factor"
            value="1.55"
          />
          <StatCard
            icon={<CubeIcon />}
            iconBg="rgba(59, 130, 246, 0.10)"
            label="Collateral Left Before Liquidation"
            value="$3,250"
          />
          <StatCard
            icon={<DollarIcon />}
            iconBg="rgba(16, 185, 129, 0.10)"
            label="Net Available Collateral"
            value="$4,250"
          />
        </div>

        {/* ── Stats Row 2 — 2 cards ── */}
        <div className="grid grid-cols-2 gap-3 px-5 mt-3">
          <StatCard
            icon={<WalletIcon />}
            iconBg="rgba(112, 58, 230, 0.10)"
            label="Net Amount Borrowed"
            value="$20,000"
          />
          <StatCard
            icon={<TrendDownIcon />}
            iconBg="rgba(112, 58, 230, 0.10)"
            label="Net Profit & Loss"
            value="-$750"
            valueColor="#FC5457"
            suffix="(15% Loss)"
          />
        </div>

        {/* ── Leverage Section ── */}
        <div className="px-5 mt-5">
          {/* Heading + Network dropdown */}
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-h7"
              style={{ color: "var(--text-primary)" }}
            >
              Leverage Your Collateral
            </h3>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body-3"
              style={{
                border: "1px solid var(--card-border)",
                color: "var(--text-secondary)",
              }}
            >
              Network:{" "}
              <span style={{ color: "#703AE6" }}>⊕</span>
              <ChevronDown />
            </div>
          </div>

          {/* ── Two Columns ── */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* ─ Left: Leverage Form (3/5) ─ */}
            <div className="md:col-span-3">
              {/* Tabs */}
              <div className="flex mb-4">
                <div
                  className="px-4 py-2.5 text-body-2 font-medium rounded-lg"
                  style={{
                    borderLeft: "3px solid #FC5457",
                    border: "1px solid #FC5457",
                    color: "var(--text-primary)",
                    backgroundColor: "var(--card-bg)",
                  }}
                >
                  Leverage your Assets
                </div>
                <div
                  className="px-4 py-2.5 text-body-2 rounded-lg"
                  style={{
                    color: "var(--text-muted)",
                    border: "1px solid var(--card-border)",
                    borderLeft: "none",
                  }}
                >
                  Repay Loan
                </div>
              </div>

              {/* Deposit ↔ Borrow toggle */}
              <div className="flex justify-end items-center gap-2 mb-4">
                <span
                  className="text-body-3"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Deposit
                </span>
                <div
                  className="w-10 h-5 rounded-full relative"
                  style={{ backgroundColor: "#703AE6" }}
                >
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white" />
                </div>
                <span
                  className="text-body-3 font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Borrow
                </span>
              </div>

              {/* ─ Deposit Section ─ */}
              <div className="mb-3">
                <div
                  className="text-body-2 mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Deposit
                </div>
                <div
                  className="rounded-xl p-3"
                  style={{ border: "1px solid var(--card-border)" }}
                >
                  {/* Token + percentage pills */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-body-3 font-medium shrink-0"
                      style={{
                        border: "1px solid var(--card-border)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <span
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: "#26A17B" }}
                      />
                      USDT <ChevronDown />
                    </div>
                    <div className="flex gap-1.5 ml-auto">
                      {["10%", "25%", "50%", "100%"].map((pct, i) => (
                        <span
                          key={pct}
                          className="px-2.5 py-1 rounded-md text-[11px] font-medium"
                          style={{
                            backgroundColor:
                              i === 0 ? "#703AE6" : "transparent",
                            color: i === 0 ? "white" : "var(--text-muted)",
                            border:
                              i === 0
                                ? "none"
                                : "1px solid var(--card-border)",
                          }}
                        >
                          {pct}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Amount */}
                  <div
                    className="text-h5 font-mono mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    2,000
                  </div>
                  <div
                    className="flex items-center justify-between text-[11px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <div>
                      0.00 &nbsp;&nbsp;
                      <span className="underline cursor-pointer">
                        View Sources
                      </span>
                    </div>
                    <div className="font-mono">
                      Unified Balance: 7000 USDT
                    </div>
                  </div>
                </div>
                <div
                  className="mt-2 text-body-3 font-medium cursor-pointer"
                  style={{ color: "#703AE6" }}
                >
                  + Add Collateral
                </div>
              </div>

              {/* ─ Borrow Section ─ */}
              <div>
                <div
                  className="text-body-2 mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Borrow
                </div>
                <div
                  className="rounded-xl p-3"
                  style={{ border: "1px solid var(--card-border)" }}
                >
                  {/* Token + Max Value + Borrowed Amount */}
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-body-3 font-medium"
                        style={{
                          border: "1px solid var(--card-border)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <span
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: "#2775CA" }}
                        />
                        USDC <ChevronDown />
                      </div>
                      <span
                        className="px-2 py-1 rounded-md text-[11px] font-medium"
                        style={{
                          border: "1px solid var(--card-border)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Max Value
                      </span>
                    </div>
                    <div className="text-right">
                      <div
                        className="text-[10px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Borrowed Amount:
                      </div>
                      <div
                        className="text-body-3 font-mono font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        6,000.00 USDC
                      </div>
                    </div>
                  </div>

                  {/* ── Leverage Slider ── */}
                  <div className="mt-4 mb-2">
                    <div
                      className="relative h-2 rounded-full"
                      style={{ backgroundColor: "var(--gauge-track)" }}
                    >
                      {/* Active track (red gradient) */}
                      <div
                        className="absolute top-0 left-0 h-full rounded-full"
                        style={{
                          width: "40%",
                          background:
                            "linear-gradient(90deg, #FC5457, #e85356)",
                        }}
                      />
                      {/* Thumb */}
                      <div
                        className="absolute -top-1.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center"
                        style={{
                          left: "calc(40% - 10px)",
                          background:
                            "linear-gradient(135deg, #703AE6, #FC5457)",
                          boxShadow: "0 2px 6px rgba(112, 58, 230, 0.3)",
                        }}
                      >
                        <span className="text-[6px] text-white font-bold">
                          V
                        </span>
                      </div>
                    </div>
                    {/* Scale marks */}
                    <div
                      className="flex justify-between mt-2.5 text-[10px] font-mono"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <span>0X</span>
                      <span>2X</span>
                      <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>4X</span>
                      <span>6X</span>
                      <span>8X</span>
                      <span>10X</span>
                    </div>
                  </div>
                </div>

                {/* Detail rows */}
                <div className="mt-3 space-y-2 text-body-3">
                  <div className="flex justify-between">
                    <span style={{ color: "var(--text-secondary)" }}>
                      Platform Points
                    </span>
                    <span
                      className="font-mono font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      2.3x
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "var(--text-secondary)" }}>
                      Vanna Points
                    </span>
                    <span
                      className="font-mono font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      4x
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "var(--text-secondary)" }}>
                      You&apos;re depositing
                    </span>
                    <span
                      className="font-mono font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      2000 USDT
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "var(--text-secondary)" }}>
                      Fees
                    </span>
                    <span
                      className="font-mono font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      0.4679 USDT
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "var(--text-secondary)" }}>
                      Total deposit including fees
                    </span>
                    <span
                      className="font-mono font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      2000.4679 USDT
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "var(--text-secondary)" }}>
                      Updated Net Health Factor
                    </span>
                    <span
                      className="font-mono font-semibold"
                      style={{ color: "#32EEE2" }}
                    >
                      1.65
                    </span>
                  </div>
                </div>

                {/* Deposit & Borrow CTA */}
                <div
                  className="mt-4 py-3 rounded-xl text-center text-body-1 font-semibold text-white cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #FC5457, #e04347)",
                  }}
                >
                  Deposit &amp; Borrow
                </div>
              </div>
            </div>

            {/* ─ Right: Margin Account Info (2/5) ─ */}
            <div className="md:col-span-2">
              {/* Header */}
              <div className="flex items-center gap-3 mb-1">
                <MarginInfoSvg />
                <div>
                  <div
                    className="text-body-1 font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Margin Account Info
                  </div>
                  <div
                    className="text-body-3"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Stay updated details and status.
                  </div>
                </div>
              </div>

              {/* Info table */}
              <div
                className="rounded-xl p-3 mt-3"
                style={{ border: "1px solid var(--card-border)" }}
              >
                <div className="space-y-2.5 text-body-3">
                  {[
                    { label: "Total Borrowed value", value: "200,000 USD" },
                    { label: "Total Collateral value", value: "200,000 USD" },
                    { label: "Total Value", value: "100 WBTC" },
                    {
                      label: "Avg Health Factor",
                      value: "1.2",
                      highlight: true,
                    },
                    { label: "Time to liquidation", value: "10m" },
                    { label: "Borrow Rate", value: "from 3.02%" },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex justify-between items-center"
                    >
                      <span style={{ color: "var(--text-secondary)" }}>
                        {row.label}
                      </span>
                      <span
                        className="font-mono font-medium"
                        style={{
                          color: row.highlight
                            ? "#703AE6"
                            : "var(--text-primary)",
                          fontWeight: row.highlight ? 600 : 500,
                        }}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-3 space-y-2">
                <div
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-body-2 font-bold"
                  style={{
                    border: "1px solid var(--card-border)",
                    color: "var(--text-primary)",
                  }}
                >
                  MORE DETAILS <ChevronRight />
                </div>
                <div
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-body-2 font-bold"
                  style={{
                    border: "1px solid var(--card-border)",
                    color: "var(--text-primary)",
                  }}
                >
                  ORACLES AND LTS <ChevronRight />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Positions Table (peek) ── */}
        <div className="px-5 mt-6 pb-8">
          <h3
            className="text-h7 mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Positions Table
          </h3>
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--card-border)" }}
          >
            {/* Table header */}
            <div
              className="grid grid-cols-5 gap-2 px-4 py-2.5 text-[11px] font-medium"
              style={{
                color: "var(--text-muted)",
                borderBottom: "1px solid var(--card-border)",
              }}
            >
              <span>Collateral Deposited</span>
              <span>Borrowed Assets</span>
              <span>Leverage Taken</span>
              <span>Interest accrued till date</span>
              <span>Action</span>
            </div>
            {/* Row 1 */}
            <div
              className="grid grid-cols-5 gap-2 px-4 py-3 text-body-3 items-center"
              style={{ borderBottom: "1px solid var(--card-border)" }}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{ backgroundColor: "#26A17B" }}
                />
                <div>
                  <div
                    className="font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    100 USDT
                  </div>
                  <div
                    className="text-[10px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    $100
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0"
                  style={{ backgroundColor: "#2775CA" }}
                />
                <span
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  100 USDC
                </span>
                <span
                  className="text-[10px] px-1 rounded"
                  style={{
                    backgroundColor: "rgba(112, 58, 230, 0.1)",
                    color: "#703AE6",
                  }}
                >
                  60%
                </span>
              </div>
              <span
                className="font-mono"
                style={{ color: "var(--text-primary)" }}
              >
                5x
              </span>
              <span
                className="font-mono"
                style={{ color: "var(--text-secondary)" }}
              >
                30 USD
              </span>
              <span
                className="px-3 py-1 rounded-lg text-[11px] font-semibold text-white text-center w-fit"
                style={{ backgroundColor: "#FC5457" }}
              >
                Repay
              </span>
            </div>
            {/* Row 2 */}
            <div className="grid grid-cols-5 gap-2 px-4 py-3 text-body-3 items-center">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{ backgroundColor: "#26A17B" }}
                />
                <div>
                  <div
                    className="font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    5000 USDT
                  </div>
                  <div
                    className="text-[10px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    $5000
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0"
                  style={{ backgroundColor: "#2775CA" }}
                />
                <span
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  20,000 USDC
                </span>
              </div>
              <span
                className="font-mono"
                style={{ color: "var(--text-primary)" }}
              >
                5x
              </span>
              <span
                className="font-mono"
                style={{ color: "var(--text-secondary)" }}
              >
                20 USD
              </span>
              <span
                className="px-3 py-1 rounded-lg text-[11px] font-semibold text-center w-fit"
                style={{
                  backgroundColor: "var(--gauge-track)",
                  color: "var(--text-muted)",
                }}
              >
                Repaid
              </span>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, var(--surface), transparent)",
          }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Hero Section V2 — Main Component
   ═══════════════════════════════════════════════════ */
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
