'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform, MotionValue } from 'framer-motion';

const assets = [
  { symbol: 'ETH', name: 'Ethereum', icon: '⟠' },
  { symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
  { symbol: 'USDC', name: 'USD Coin', icon: '$' },
];

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const spring = useSpring(0, { stiffness: 80, damping: 20 });
  const display = useTransform(spring, (v: number) =>
    `${prefix}${Math.round(v).toLocaleString()}${suffix}`
  );
  const [text, setText] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsubscribe = display.on('change', (v: string) => setText(v));
    return unsubscribe;
  }, [display]);

  return <span>{text}</span>;
}

function BarChart({ traditional, vanna }: { traditional: number; vanna: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const maxVal = Math.max(traditional, vanna, 1);

  return (
    <div ref={ref} className="flex items-end justify-center gap-8 h-64 sm:h-80">
      {/* Traditional DeFi Bar */}
      <div className="flex flex-col items-center gap-3 flex-1 max-w-32">
        <span
          className="text-h10 text-center"
          style={{ color: 'var(--text-muted)' }}
        >
          Traditional
        </span>
        <div className="relative w-full flex justify-center">
          <motion.div
            className="w-16 sm:w-20 rounded-t-lg"
            style={{ backgroundColor: 'var(--gauge-track)' }}
            initial={{ height: 0 }}
            animate={isInView ? { height: `${(traditional / maxVal) * 240}px` } : { height: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          />
        </div>
        <span className="text-h9 font-mono" style={{ color: 'var(--text-secondary)' }}>
          <AnimatedNumber value={traditional} prefix="$" />
        </span>
      </div>

      {/* VS Divider */}
      <div className="flex flex-col items-center justify-end pb-10">
        <span className="text-xs font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>
          VS
        </span>
      </div>

      {/* Vanna Bar */}
      <div className="flex flex-col items-center gap-3 flex-1 max-w-32">
        <span className="text-h10 text-center text-violet-500">
          With Vanna
        </span>
        <div className="relative w-full flex justify-center">
          <motion.div
            className="w-16 sm:w-20 rounded-t-lg bg-vanna-gradient relative overflow-hidden"
            initial={{ height: 0 }}
            animate={isInView ? { height: `${(vanna / maxVal) * 240}px` } : { height: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent animate-pulse-glow" />
          </motion.div>
        </div>
        <span className="text-h9 font-mono text-violet-500 font-bold">
          <AnimatedNumber value={vanna} prefix="$" />
        </span>
      </div>
    </div>
  );
}

export default function CalculatorSection() {
  const [deposit, setDeposit] = useState(1000);
  const [asset, setAsset] = useState(0);
  const [leverage, setLeverage] = useState(5);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const totalPower = deposit * leverage;
  const traditionalPower = deposit * 0.7; // 70% LTV
  const multiplier = leverage;
  const estimatedYield = (totalPower * 0.12).toFixed(0);

  return (
    <section
      id="calculator"
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--surface-alt)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-violet-500 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Capital Multiplier
          </p>
          <h2 className="text-h3 text-heading mb-4">
            See the difference yourself
          </h2>
          <p className="text-subtext text-paragraph max-w-xl mx-auto">
            Traditional DeFi locks your capital. Vanna multiplies it.
          </p>
        </motion.div>

        {/* Calculator Grid */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: Calculator Card */}
          <motion.div
            className="rounded-2xl p-8 sm:p-10"
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              boxShadow: 'var(--card-shadow)',
            }}
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            {/* Deposit Amount */}
            <div className="mb-8">
              <label
                className="text-h10 block mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                Deposit Amount
              </label>
              <div
                className="flex items-center rounded-xl px-4 py-3 border transition-colors focus-within:border-violet-500"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  borderColor: 'var(--border-input)',
                }}
              >
                <span className="text-body-1 mr-2" style={{ color: 'var(--text-muted)' }}>$</span>
                <input
                  type="number"
                  value={deposit}
                  onChange={(e) => setDeposit(Math.max(0, Number(e.target.value)))}
                  className="flex-1 bg-transparent text-body-1 font-mono outline-none"
                  style={{ color: 'var(--text-primary)' }}
                  min={0}
                />
              </div>
            </div>

            {/* Asset Type */}
            <div className="mb-8">
              <label
                className="text-h10 block mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                Asset Type
              </label>
              <div className="flex gap-3">
                {assets.map((a, i) => (
                  <button
                    key={a.symbol}
                    onClick={() => setAsset(i)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                      asset === i
                        ? 'border-violet-500 bg-violet-500/10 text-violet-500'
                        : 'hover:border-violet-500/30'
                    }`}
                    style={
                      asset !== i
                        ? {
                            borderColor: 'var(--border-input)',
                            color: 'var(--text-secondary)',
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

            {/* Leverage Slider */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label
                  className="text-h10"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Leverage
                </label>
                <motion.span
                  className="text-h7 text-gradient font-bold font-mono"
                  key={leverage}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
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
              <div className="flex justify-between mt-2">
                <span className="text-body-3" style={{ color: 'var(--text-muted)' }}>1x</span>
                <span className="text-body-3" style={{ color: 'var(--text-muted)' }}>10x</span>
              </div>
            </div>

            {/* Results Panel */}
            <div
              className="rounded-xl p-6 space-y-4"
              style={{ backgroundColor: 'var(--surface-alt)' }}
            >
              <div className="flex justify-between items-center">
                <span className="text-body-2" style={{ color: 'var(--text-secondary)' }}>
                  Total Trading Power
                </span>
                <span className="text-h7 text-gradient font-mono">
                  <AnimatedNumber value={totalPower} prefix="$" />
                </span>
              </div>
              <div
                className="border-t pt-4"
                style={{ borderColor: 'var(--border-default)' }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-body-2" style={{ color: 'var(--text-secondary)' }}>
                    Capital Multiplied
                  </span>
                  <span className="text-h9 text-violet-500 font-mono">
                    {multiplier}x
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-body-2" style={{ color: 'var(--text-secondary)' }}>
                    Est. Annual Yield
                  </span>
                  <span className="text-h9 text-electric-blue-500 font-mono">
                    ${estimatedYield}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Bar Chart Visualization */}
          <motion.div
            className="flex flex-col items-center justify-center"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          >
            <BarChart traditional={traditionalPower} vanna={totalPower} />

            {/* Comparison Callout */}
            <motion.div
              className="mt-8 text-center rounded-xl px-6 py-4"
              style={{ backgroundColor: 'var(--badge-bg)' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <span className="text-h9" style={{ color: 'var(--badge-text)' }}>
                {((totalPower / traditionalPower) || 0).toFixed(1)}x more trading power
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
