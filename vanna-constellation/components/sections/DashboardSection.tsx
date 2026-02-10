'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView, useSpring, useTransform } from 'framer-motion';

const tabs = ['Portfolio Greeks', 'Payoff Graph', 'Alerts'];

const greeks = [
  {
    name: 'Delta',
    value: 12.5,
    max: 30,
    label: '+12.5 ETH',
    sublabel: 'Moderately bullish',
    color: '#703AE6',
    gradient: 'from-violet-500 to-violet-400',
  },
  {
    name: 'Gamma',
    value: 0.8,
    max: 3,
    label: '0.8',
    sublabel: 'Low acceleration',
    color: '#32EEE2',
    gradient: 'from-electric-blue-500 to-electric-blue-400',
  },
  {
    name: 'Theta',
    value: 120,
    max: 300,
    label: '-$120/day',
    sublabel: 'Time decay',
    color: '#FC5457',
    gradient: 'from-imperial-red-500 to-imperial-red-400',
  },
  {
    name: 'Vega',
    value: 300,
    max: 500,
    label: '+$300/vol',
    sublabel: 'Vol sensitive',
    color: '#8D61EB',
    gradient: 'from-violet-400 to-violet-300',
  },
];

function SVGGauge({
  name,
  value,
  max,
  label,
  sublabel,
  color,
  isInView,
  delay,
}: {
  name: string;
  value: number;
  max: number;
  label: string;
  sublabel: string;
  color: string;
  isInView: boolean;
  delay: number;
}) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = value / max;
  const springVal = useSpring(0, { stiffness: 60, damping: 20 });
  const dashOffset = useTransform(springVal, (v: number) => circumference * (1 - v));
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => springVal.set(progress), delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, progress, springVal, delay]);

  useEffect(() => {
    const unsubscribe = dashOffset.on('change', (v: number) => setOffset(v));
    return unsubscribe;
  }, [dashOffset]);

  return (
    <motion.div
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      <div className="relative w-24 h-24 sm:w-28 sm:h-28">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full -rotate-90"
        >
          {/* Track */}
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="var(--gauge-track)"
            strokeWidth="6"
          />
          {/* Progress */}
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'none' }}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-xs font-mono font-bold"
            style={{ color }}
          >
            {label}
          </span>
        </div>
      </div>
      <div className="text-center">
        <span className="text-h10 block" style={{ color: 'var(--text-primary)' }}>
          {name}
        </span>
        <span className="text-body-3" style={{ color: 'var(--text-muted)' }}>
          {sublabel}
        </span>
      </div>
    </motion.div>
  );
}

function PayoffGraph({ isInView }: { isInView: boolean }) {
  const points = [
    { x: 0, y: 180 }, { x: 30, y: 160 }, { x: 60, y: 145 },
    { x: 100, y: 130 }, { x: 140, y: 100 }, { x: 180, y: 60 },
    { x: 220, y: 90 }, { x: 260, y: 50 }, { x: 300, y: 30 },
    { x: 340, y: 45 }, { x: 380, y: 20 },
  ];

  const pathD = points
    .map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`))
    .join(' ');

  const areaD = `${pathD} L380,200 L0,200 Z`;

  return (
    <div className="w-full h-48 sm:h-56 relative">
      <svg viewBox="0 0 380 200" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FC5457" />
            <stop offset="100%" stopColor="#703AE6" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#703AE6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#703AE6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[50, 100, 150].map((y) => (
          <line
            key={y}
            x1="0" y1={y} x2="380" y2={y}
            stroke="var(--gauge-track)"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
        ))}

        {/* Area fill */}
        <motion.path
          d={areaD}
          fill="url(#areaGrad)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* Line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* End dot */}
        <motion.circle
          cx="380" cy="20" r="4"
          fill="#703AE6"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.3, delay: 1.5 }}
        />
      </svg>

      {/* Labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
        <span className="text-body-3" style={{ color: 'var(--text-muted)' }}>$2,500</span>
        <span className="text-body-3" style={{ color: 'var(--text-muted)' }}>$3,000</span>
        <span className="text-body-3" style={{ color: 'var(--text-muted)' }}>$3,500</span>
      </div>
    </div>
  );
}

function HealthFactor({ isInView }: { isInView: boolean }) {
  const healthValue = 1.45;
  const progress = healthValue / 2.5;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-h10" style={{ color: 'var(--text-primary)' }}>
          Health Factor
        </span>
        <span className="text-h9 font-mono text-electric-blue-500">
          {healthValue}
        </span>
      </div>
      <div className="relative h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--gauge-track)' }}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: 'linear-gradient(90deg, #32EEE2, #703AE6, #FC5457)',
          }}
          initial={{ width: '0%' }}
          animate={isInView ? { width: `${progress * 100}%` } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />
        {/* Position marker */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-electric-blue-500 shadow-lg"
          initial={{ left: '0%' }}
          animate={isInView ? { left: `${progress * 100}%` } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          style={{ marginLeft: '-8px' }}
        />
      </div>
      <div className="flex justify-between">
        <span className="text-body-3 text-imperial-red-500">Liquidation</span>
        <span className="text-body-3 text-electric-blue-500">Safe</span>
      </div>
    </div>
  );
}

function AlertsPanel({ isInView }: { isInView: boolean }) {
  const alerts = [
    { type: 'warning', message: 'Delta exceeds threshold (+12.5 > 10)', time: '2m ago', color: '#FC5457' },
    { type: 'info', message: 'Health Factor stable at 1.45', time: '5m ago', color: '#32EEE2' },
    { type: 'info', message: 'Theta decay accelerating on position #3', time: '12m ago', color: '#703AE6' },
  ];

  return (
    <div className="space-y-3">
      {alerts.map((alert, i) => (
        <motion.div
          key={i}
          className="flex items-start gap-3 p-3 rounded-xl"
          style={{ backgroundColor: 'var(--gauge-bg)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: i * 0.1 + 0.2 }}
        >
          <div
            className="w-2 h-2 rounded-full mt-1.5 shrink-0"
            style={{ backgroundColor: alert.color }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-body-2" style={{ color: 'var(--text-primary)' }}>
              {alert.message}
            </p>
            <p className="text-body-3 mt-1" style={{ color: 'var(--text-muted)' }}>
              {alert.time}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function DashboardSection() {
  const [activeTab, setActiveTab] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="dashboard"
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--surface-alt)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-violet-500 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              Greeks Command Center
            </p>
            <h2 className="text-h3 text-heading mb-6">
              TradFi precision.{' '}
              <span className="text-gradient">DeFi freedom.</span>
            </h2>
            <p className="text-subtext text-paragraph mb-10 max-w-lg">
              The first DeFi protocol with portfolio-level Greeks tracking across
              all your positions.
            </p>

            {/* Feature bullets */}
            <div className="space-y-5">
              {[
                { icon: '◎', text: 'Real-time Greeks across ALL positions' },
                { icon: '◎', text: 'Visual payoff graphs at a glance' },
                { icon: '◎', text: 'Smart alerts before you\'re at risk' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <span className="text-violet-500 text-lg">{item.icon}</span>
                  <span className="text-body-1" style={{ color: 'var(--text-primary)' }}>
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Dashboard Preview */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 40, rotateX: 5 }}
            animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            style={{ perspective: '1000px' }}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                boxShadow: 'var(--card-shadow)',
              }}
            >
              {/* Tab Bar */}
              <div
                className="flex border-b px-4"
                style={{ borderColor: 'var(--border-default)' }}
              >
                {tabs.map((tab, i) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(i)}
                    className={`relative py-3 px-4 text-body-2 font-medium transition-colors ${
                      activeTab === i ? 'text-violet-500' : ''
                    }`}
                    style={activeTab !== i ? { color: 'var(--text-muted)' } : undefined}
                  >
                    {tab}
                    {activeTab === i && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500"
                        layoutId="dashboardTab"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  {activeTab === 0 && (
                    <motion.div
                      key="greeks"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Greeks Gauges */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                        {greeks.map((g, i) => (
                          <SVGGauge
                            key={g.name}
                            {...g}
                            isInView={isInView && activeTab === 0}
                            delay={i * 0.15}
                          />
                        ))}
                      </div>
                      {/* Health Factor */}
                      <HealthFactor isInView={isInView && activeTab === 0} />
                    </motion.div>
                  )}
                  {activeTab === 1 && (
                    <motion.div
                      key="payoff"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-4">
                        <span className="text-h10" style={{ color: 'var(--text-primary)' }}>
                          ETH Portfolio P&L
                        </span>
                        <span className="text-body-2 ml-3 text-electric-blue-500">
                          +$2,340
                        </span>
                      </div>
                      <PayoffGraph isInView={isInView && activeTab === 1} />
                    </motion.div>
                  )}
                  {activeTab === 2 && (
                    <motion.div
                      key="alerts"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AlertsPanel isInView={isInView && activeTab === 2} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Decorative glow behind card */}
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-violet-500/5 to-imperial-red-500/5 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
