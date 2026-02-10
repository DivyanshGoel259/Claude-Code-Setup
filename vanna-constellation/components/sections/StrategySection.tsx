'use client';

/**
 * Section 6: Strategy Architect - Interactive Strategy Builder
 * Users select pre-built strategy templates and see live P&L + Greeks
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

interface StrategyBlock {
  id: string;
  label: string;
  category: 'perps' | 'options' | 'spot' | 'yield';
  icon: string;
  color: string;
  deltaImpact: number;
  thetaImpact: number;
  vegaImpact: number;
  yieldPct: number;
}

const allBlocks: StrategyBlock[] = [
  { id: 'spot-long', label: 'Spot Long', category: 'spot', icon: '↗', color: '#32EEE2', deltaImpact: 5, thetaImpact: 0, vegaImpact: 0, yieldPct: 0 },
  { id: 'perp-long', label: 'Perp Long', category: 'perps', icon: '⬆', color: '#703AE6', deltaImpact: 10, thetaImpact: -20, vegaImpact: 0, yieldPct: -2 },
  { id: 'perp-short', label: 'Perp Short', category: 'perps', icon: '⬇', color: '#703AE6', deltaImpact: -10, thetaImpact: -20, vegaImpact: 0, yieldPct: -2 },
  { id: 'buy-call', label: 'Buy Call', category: 'options', icon: '📈', color: '#FB7185', deltaImpact: 4, thetaImpact: -50, vegaImpact: 150, yieldPct: -5 },
  { id: 'sell-put', label: 'Sell Put', category: 'options', icon: '📉', color: '#FB7185', deltaImpact: 3, thetaImpact: 40, vegaImpact: -100, yieldPct: 8 },
  { id: 'yield-farm', label: 'Yield Farm', category: 'yield', icon: '🌾', color: '#E879F9', deltaImpact: 0, thetaImpact: 0, vegaImpact: 0, yieldPct: 20 },
  { id: 'lend', label: 'Lend', category: 'yield', icon: '🏦', color: '#E879F9', deltaImpact: 0, thetaImpact: 0, vegaImpact: 0, yieldPct: 10 },
];

interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  blocks: string[];
}

const templates: StrategyTemplate[] = [
  {
    id: 'basis',
    name: 'Basis Trade',
    description: 'Market neutral. Profit from funding rates.',
    blocks: ['spot-long', 'perp-short'],
  },
  {
    id: 'covered-calls',
    name: 'Covered Calls',
    description: 'Earn premium while holding spot.',
    blocks: ['spot-long', 'sell-put'],
  },
  {
    id: 'delta-neutral',
    name: 'Delta Neutral Farm',
    description: 'Leveraged yield with zero directional risk.',
    blocks: ['yield-farm', 'perp-short'],
  },
  {
    id: 'leveraged-long',
    name: 'Leveraged Long',
    description: 'Amplified upside via perps + options.',
    blocks: ['perp-long', 'buy-call'],
  },
];

const categoryColorMap: Record<string, string> = {
  perps: '#703AE6',
  options: '#FB7185',
  spot: '#32EEE2',
  yield: '#E879F9',
};

function MiniGreek({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div className="text-center">
      <span className="text-body-3 block mb-1" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className="text-h9 font-mono block" style={{ color }}>
        {value > 0 ? '+' : ''}{value}{unit}
      </span>
    </div>
  );
}

export default function StrategySection() {
  const [activeBlocks, setActiveBlocks] = useState<string[]>(['spot-long', 'perp-short']);
  const [activeTemplate, setActiveTemplate] = useState('basis');
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const selectedBlocks = activeBlocks
    .map((id) => allBlocks.find((b) => b.id === id))
    .filter(Boolean) as StrategyBlock[];

  const totals = selectedBlocks.reduce(
    (acc, b) => ({
      delta: acc.delta + b.deltaImpact,
      theta: acc.theta + b.thetaImpact,
      vega: acc.vega + b.vegaImpact,
      yield: acc.yield + b.yieldPct,
    }),
    { delta: 0, theta: 0, vega: 0, yield: 0 }
  );

  const selectTemplate = (template: StrategyTemplate) => {
    setActiveTemplate(template.id);
    setActiveBlocks(template.blocks);
  };

  const toggleBlock = (blockId: string) => {
    setActiveTemplate('');
    setActiveBlocks((prev) =>
      prev.includes(blockId) ? prev.filter((id) => id !== blockId) : [...prev, blockId]
    );
  };

  return (
    <section
      id="strategy"
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--surface-alt)' }}
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
            Compose multi-protocol strategies with composable leverage and see live Greeks impact.
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
                  ? 'border-violet-500 bg-violet-500/10 text-violet-500'
                  : ''
              }`}
              style={
                activeTemplate !== t.id
                  ? {
                      borderColor: 'var(--card-border)',
                      color: 'var(--text-secondary)',
                      backgroundColor: 'var(--card-bg)',
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
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
            }}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-h10 mb-4" style={{ color: 'var(--text-primary)' }}>
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
                      isActive ? 'border-opacity-50' : ''
                    }`}
                    style={{
                      borderColor: isActive ? block.color : 'var(--card-border)',
                      backgroundColor: isActive ? block.color + '10' : 'transparent',
                    }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className="w-1 h-8 rounded-full shrink-0"
                      style={{ backgroundColor: categoryColorMap[block.category] }}
                    />
                    <span className="text-lg">{block.icon}</span>
                    <span className="text-body-2 font-medium" style={{ color: 'var(--text-primary)' }}>
                      {block.label}
                    </span>
                    {isActive && (
                      <motion.span
                        className="ml-auto text-body-3"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{ color: block.color }}
                      >
                        ✓
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
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-h10 mb-4" style={{ color: 'var(--text-primary)' }}>
              Active Strategy
            </h3>

            <AnimatePresence mode="popLayout">
              {selectedBlocks.length === 0 ? (
                <motion.div
                  key="empty"
                  className="flex items-center justify-center h-48 rounded-xl border-2 border-dashed"
                  style={{ borderColor: 'var(--card-border)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-body-2" style={{ color: 'var(--text-muted)' }}>
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
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className="flex items-center gap-3 p-4 rounded-xl relative overflow-hidden"
                      style={{
                        backgroundColor: block.color + '08',
                        border: `1px solid ${block.color}25`,
                      }}
                    >
                      {/* Left stripe */}
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1"
                        style={{ backgroundColor: block.color }}
                      />

                      <span className="text-xl ml-2">{block.icon}</span>
                      <div className="flex-1">
                        <span className="text-body-2 font-semibold block" style={{ color: 'var(--text-primary)' }}>
                          {block.label}
                        </span>
                        <span className="text-body-3 capitalize" style={{ color: 'var(--text-muted)' }}>
                          {block.category}
                        </span>
                      </div>

                      {/* Connection arrow to next */}
                      {i < selectedBlocks.length - 1 && (
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10">
                          <svg width="16" height="12" viewBox="0 0 16 12" className="animate-dash">
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
                style={{ color: 'var(--text-muted)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={activeTemplate}
              >
                {templates.find((t) => t.id === activeTemplate)?.description}
              </motion.p>
            )}
          </motion.div>

          {/* Right: Live P&L + Greeks */}
          <motion.div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
            }}
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-h10 mb-6" style={{ color: 'var(--text-primary)' }}>
              Simulated P&L
            </h3>

            {/* Yield display */}
            <div className="text-center mb-8">
              <motion.span
                className="text-h3 font-mono block"
                style={{ color: totals.yield >= 0 ? '#32EEE2' : '#FC5457' }}
                key={totals.yield}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                {totals.yield >= 0 ? '+' : ''}{totals.yield}%
              </motion.span>
              <span className="text-body-3" style={{ color: 'var(--text-muted)' }}>
                Estimated Annual Yield
              </span>
            </div>

            {/* Greeks panel */}
            <div
              className="rounded-xl p-5 mb-6"
              style={{ backgroundColor: 'var(--surface-alt)' }}
            >
              <span className="text-body-3 block mb-4" style={{ color: 'var(--text-muted)' }}>
                Portfolio Greeks
              </span>
              <div className="grid grid-cols-3 gap-4">
                <MiniGreek label="Delta" value={totals.delta} unit="" color={totals.delta > 0 ? '#32EEE2' : '#FC5457'} />
                <MiniGreek label="Theta" value={totals.theta} unit="$/d" color={totals.theta > 0 ? '#32EEE2' : '#FC5457'} />
                <MiniGreek label="Vega" value={totals.vega} unit="" color={totals.vega > 0 ? '#32EEE2' : '#703AE6'} />
              </div>
            </div>

            {/* Risk level */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-body-3" style={{ color: 'var(--text-muted)' }}>Risk Level</span>
                <span
                  className="text-h11 font-mono"
                  style={{
                    color: Math.abs(totals.delta) > 8 ? '#FC5457' : Math.abs(totals.delta) > 4 ? '#703AE6' : '#32EEE2',
                  }}
                >
                  {Math.abs(totals.delta) > 8 ? 'High' : Math.abs(totals.delta) > 4 ? 'Medium' : 'Low'}
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--gauge-track)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, #32EEE2, #703AE6, #FC5457)`,
                  }}
                  animate={{ width: `${Math.min(100, (Math.abs(totals.delta) / 15) * 100)}%` }}
                  transition={{ type: 'spring', stiffness: 100 }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
