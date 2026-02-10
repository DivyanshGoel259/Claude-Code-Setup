'use client';

/**
 * Section 7: The Yield Vault - LP Section with Animated Data
 * Split layout: vault visualization (left) + yield data (right)
 * Animated yield bars, comparison table, deposit CTA
 */

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface YieldBar {
  label: string;
  value: number;
  maxValue: number;
  suffix: string;
  color: string;
}

const yieldBars: YieldBar[] = [
  { label: 'Borrow Interest', value: 12.5, maxValue: 20, suffix: '% APR', color: '#703AE6' },
  { label: 'Liquidation Fees', value: 2.5, maxValue: 20, suffix: '%', color: '#FC5457' },
  { label: 'Revenue Share', value: 3.0, maxValue: 20, suffix: '%', color: '#32EEE2' },
];

const comparisonData = [
  {
    feature: 'Impermanent Loss',
    vanna: { value: 'Zero', positive: true },
    amm: { value: 'High Risk', positive: false },
  },
  {
    feature: 'APY Range',
    vanna: { value: '8-18%', positive: true },
    amm: { value: '2-8%', positive: false },
  },
  {
    feature: 'Capital Lockup',
    vanna: { value: 'Flexible', positive: true },
    amm: { value: 'Locked', positive: false },
  },
  {
    feature: 'Yield Source',
    vanna: { value: 'Real Revenue', positive: true },
    amm: { value: 'Token Emissions', positive: false },
  },
  {
    feature: 'Risk Profile',
    vanna: { value: 'Isolated', positive: true },
    amm: { value: 'Pool-wide', positive: false },
  },
];

function AnimatedBar({ bar, index, isInView }: { bar: YieldBar; index: number; isInView: boolean }) {
  const widthPct = (bar.value / bar.maxValue) * 100;

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-body-2 font-medium" style={{ color: 'var(--text-primary)' }}>
          {bar.label}
        </span>
        <motion.span
          className="text-h10 font-mono"
          style={{ color: bar.color }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 + index * 0.15 }}
        >
          {bar.value}{bar.suffix}
        </motion.span>
      </div>
      <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--gauge-track)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${bar.color}CC, ${bar.color})` }}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${widthPct}%` } : {}}
          transition={{ duration: 0.8, delay: 0.3 + index * 0.15, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

function VaultVisual({ isInView }: { isInView: boolean }) {
  return (
    <div className="relative flex items-center justify-center h-full min-h-[400px]">
      {/* Background glow */}
      <div
        className="absolute w-72 h-72 rounded-full blur-3xl opacity-20"
        style={{ background: 'linear-gradient(135deg, #703AE6, #FC5457)' }}
      />

      {/* Vault door */}
      <motion.div
        className="relative w-64 h-64 rounded-full flex items-center justify-center"
        style={{
          background: 'conic-gradient(from 0deg, #703AE640, #FC545730, #32EEE230, #703AE640)',
          border: '2px solid rgba(112, 58, 230, 0.3)',
        }}
        initial={{ scale: 0.8, opacity: 0, rotate: -30 }}
        animate={isInView ? { scale: 1, opacity: 1, rotate: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Inner ring */}
        <motion.div
          className="absolute w-52 h-52 rounded-full"
          style={{
            border: '1px solid rgba(112, 58, 230, 0.2)',
            background: 'radial-gradient(circle, rgba(112, 58, 230, 0.08) 0%, transparent 70%)',
          }}
          animate={isInView ? { rotate: 360 } : {}}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        />

        {/* Center logo */}
        <motion.div
          className="relative z-10 w-28 h-28 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #703AE6, #FC5457)',
            boxShadow: '0 0 40px rgba(112, 58, 230, 0.4)',
          }}
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          <span className="text-white text-3xl font-bold">V</span>
        </motion.div>

        {/* Orbiting coins */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <motion.div
            key={angle}
            className="absolute w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: i % 2 === 0
                ? 'linear-gradient(135deg, #703AE6, #9F7BEE)'
                : 'linear-gradient(135deg, #32EEE2, #5AF5E9)',
              color: 'white',
              top: `${50 + 42 * Math.sin((angle * Math.PI) / 180)}%`,
              left: `${50 + 42 * Math.cos((angle * Math.PI) / 180)}%`,
              transform: 'translate(-50%, -50%)',
              boxShadow: i % 2 === 0
                ? '0 0 12px rgba(112, 58, 230, 0.4)'
                : '0 0 12px rgba(50, 238, 226, 0.4)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.5 + i * 0.08, type: 'spring', stiffness: 200 }}
          >
            {['$', 'E', '$', 'B', '$', 'U'][i]}
          </motion.div>
        ))}

        {/* Decorative ring segments */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 256">
          <motion.circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="#703AE6"
            strokeWidth="1"
            strokeDasharray="30 20"
            initial={{ strokeDashoffset: 0 }}
            animate={isInView ? { strokeDashoffset: -100 } : {}}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
        </svg>
      </motion.div>
    </div>
  );
}

export default function YieldVaultSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const totalYield = yieldBars.reduce((sum, b) => sum + b.value, 0);

  return (
    <section
      id="yield"
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--background)' }}
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
            Yield Vault
          </p>
          <h2 className="text-h3 text-heading mb-4">
            Earn real yield. No IL. No ponzinomics.
          </h2>
          <p className="text-subtext text-paragraph max-w-xl mx-auto">
            Provide liquidity to Vanna and earn from real protocol revenue — not token emissions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Vault Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <VaultVisual isInView={isInView} />
          </motion.div>

          {/* Right: Yield Data */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Total APY */}
            <div
              className="rounded-2xl p-6 mb-6"
              style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-h10" style={{ color: 'var(--text-primary)' }}>
                  Yield Breakdown
                </span>
                <span className="text-h6 text-gradient font-mono">
                  {totalYield}% APY
                </span>
              </div>

              {yieldBars.map((bar, i) => (
                <AnimatedBar key={bar.label} bar={bar} index={i} isInView={isInView} />
              ))}
            </div>

            {/* Comparison Table */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
              }}
            >
              {/* Table header */}
              <div
                className="grid grid-cols-3 gap-4 px-5 py-3"
                style={{ backgroundColor: 'var(--surface-alt)' }}
              >
                <span className="text-body-3 font-medium" style={{ color: 'var(--text-muted)' }}>
                  Feature
                </span>
                <span className="text-body-3 font-semibold text-center" style={{ color: '#703AE6' }}>
                  Vanna LP
                </span>
                <span className="text-body-3 font-medium text-center" style={{ color: 'var(--text-muted)' }}>
                  AMM LP
                </span>
              </div>

              {/* Table rows */}
              {comparisonData.map((row, i) => (
                <motion.div
                  key={row.feature}
                  className="grid grid-cols-3 gap-4 px-5 py-3 transition-colors duration-200"
                  style={{
                    borderTop: '1px solid var(--card-border)',
                    backgroundColor: hoveredRow === i ? 'var(--surface-alt)' : 'transparent',
                  }}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.08 }}
                >
                  <span className="text-body-2" style={{ color: 'var(--text-secondary)' }}>
                    {row.feature}
                  </span>
                  <span className="text-body-2 text-center font-medium flex items-center justify-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="7" fill="#32EEE220" />
                      <path d="M4 7l2 2 4-4" stroke="#32EEE2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ color: '#32EEE2' }}>{row.vanna.value}</span>
                  </span>
                  <span className="text-body-2 text-center flex items-center justify-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="7" fill="#FC545720" />
                      <path d="M4.5 4.5l5 5M9.5 4.5l-5 5" stroke="#FC5457" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span style={{ color: 'var(--text-muted)' }}>{row.amm.value}</span>
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
            >
              <motion.a
                href="#"
                className="inline-flex px-8 py-3.5 rounded-xl text-btn-md text-white bg-vanna-gradient hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Start Earning
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
