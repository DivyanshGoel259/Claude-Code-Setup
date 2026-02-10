'use client';

/**
 * Section 8: The DeFi Credit Card - Metaphor Visualization
 * CSS 3D card with mouse-tracking tilt, card flip, and 3-step timeline
 * Makes composable credit instantly understandable via credit card metaphor
 */

import { useState, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

const floatingTags = [
  { label: 'Perps', delay: 0, x: -140, y: -80 },
  { label: 'Options', delay: 0.1, x: 140, y: -60 },
  { label: 'Spot', delay: 0.2, x: -120, y: 80 },
  { label: 'Yield', delay: 0.3, x: 130, y: 70 },
];

const steps = [
  {
    step: '01',
    title: 'Deposit Collateral',
    description: 'Connect wallet. Deposit ETH, BTC, or USDC into your margin account.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Get 10x Credit',
    description: 'Vanna issues undercollateralized credit — up to 10x your deposit.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 10h20" />
        <path d="M6 16h.01M10 16h4" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Spend Across DeFi',
    description: 'Deploy credit to perps, options, spot, and yield protocols simultaneously.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
];

function CreditCard({ isFlipped, onFlip }: { isFlipped: boolean; onFlip: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -15, y: x * 15 });
  }, [isFlipped]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative cursor-pointer"
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onFlip}
    >
      <motion.div
        className="relative w-[340px] h-[215px] sm:w-[400px] sm:h-[252px]"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{
          rotateX: isFlipped ? 0 : tilt.x,
          rotateY: isFlipped ? 180 : tilt.y,
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
      >
        {/* Card Front */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16162a 50%, #0f0f1e 100%)',
            border: '1px solid rgba(112, 58, 230, 0.3)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.4), 0 0 30px rgba(112, 58, 230, 0.15)',
          }}
        >
          {/* Gradient edge accent */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: 'linear-gradient(90deg, #FC5457, #703AE6, #32EEE2)' }}
          />

          {/* Card content */}
          <div className="relative h-full p-6 flex flex-col justify-between">
            {/* Top row */}
            <div className="flex justify-between items-start">
              <div>
                <div
                  className="text-xl font-bold tracking-wider"
                  style={{ color: 'white' }}
                >
                  VANNA
                </div>
                <div className="text-[10px] tracking-[0.2em] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  DEFI CREDIT
                </div>
              </div>
              {/* Chip */}
              <div
                className="w-10 h-8 rounded-md"
                style={{
                  background: 'linear-gradient(135deg, #c9a84c 0%, #f0d78c 40%, #c9a84c 100%)',
                  boxShadow: 'inset 0 0 4px rgba(0,0,0,0.2)',
                }}
              >
                <div
                  className="w-full h-full rounded-md"
                  style={{
                    background: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 4px)',
                  }}
                />
              </div>
            </div>

            {/* Card number */}
            <div className="font-mono text-lg tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.7)' }}>
              •••• •••• •••• 1337
            </div>

            {/* Bottom row */}
            <div className="flex justify-between items-end">
              <div>
                <div className="text-[9px] tracking-wider mb-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  CREDIT LIMIT
                </div>
                <div className="font-mono text-sm font-semibold" style={{ color: '#32EEE2' }}>
                  $100,000
                </div>
              </div>
              <div>
                <div className="text-[9px] tracking-wider mb-0.5 text-right" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  MULTIPLIER
                </div>
                <div
                  className="font-mono text-sm font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #FC5457, #703AE6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  10X
                </div>
              </div>
            </div>

            {/* Subtle network pattern */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />
          </div>
        </div>

        {/* Card Back */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16162a 50%, #0f0f1e 100%)',
            border: '1px solid rgba(112, 58, 230, 0.3)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.4), 0 0 30px rgba(112, 58, 230, 0.15)',
          }}
        >
          {/* Magnetic stripe */}
          <div className="mt-8 h-12 bg-gray-800" />

          {/* Signature + CVV area */}
          <div className="p-6 mt-2">
            <div className="flex gap-4 items-center">
              <div
                className="flex-1 h-10 rounded"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
              />
              <div className="text-right">
                <div className="text-[9px] tracking-wider mb-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  CVV
                </div>
                <div className="font-mono text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  •••
                </div>
              </div>
            </div>

            {/* Wallet address bar */}
            <div className="mt-6">
              <div className="text-[9px] tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                WALLET
              </div>
              <div
                className="font-mono text-[11px] px-3 py-2 rounded"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                0x7a3F...c8E2
              </div>
            </div>

            {/* Protocols */}
            <div className="mt-4 flex gap-2">
              {['Perps', 'Options', 'Spot', 'Yield'].map((p) => (
                <span
                  key={p}
                  className="text-[9px] px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: 'rgba(112, 58, 230, 0.15)',
                    color: '#9F7BEE',
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function CreditCardSection() {
  const [isFlipped, setIsFlipped] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="credit-card"
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--surface-alt)' }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(112, 58, 230, 0.08) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-violet-500 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            The DeFi Credit Card
          </p>
          <h2 className="text-h3 text-heading mb-4">
            Think of it like a credit card — for DeFi.
          </h2>
          <p className="text-subtext text-paragraph max-w-xl mx-auto">
            Deposit collateral, get 10x credit, and spend it across every protocol in the ecosystem.
          </p>
        </motion.div>

        {/* Card + Floating Tags */}
        <motion.div
          className="flex justify-center mb-20 relative"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Floating tags */}
          {floatingTags.map((tag) => (
            <motion.span
              key={tag.label}
              className="absolute hidden sm:block px-4 py-1.5 rounded-full text-xs font-medium text-white z-10"
              style={{
                backgroundColor: '#703AE6',
                boxShadow: '0 4px 15px rgba(112, 58, 230, 0.3)',
                left: `calc(50% + ${tag.x}px)`,
                top: `calc(50% + ${tag.y}px)`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? {
                opacity: 1,
                scale: 1,
                y: [0, -8, 0],
              } : {}}
              transition={{
                opacity: { delay: 0.5 + tag.delay },
                scale: { delay: 0.5 + tag.delay, type: 'spring' },
                y: { delay: 0.8 + tag.delay, duration: 3, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              {tag.label}
            </motion.span>
          ))}

          <CreditCard isFlipped={isFlipped} onFlip={() => setIsFlipped((f) => !f)} />

          {/* Click hint */}
          <motion.p
            className="absolute -bottom-8 text-body-3"
            style={{ color: 'var(--text-muted)' }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1 }}
          >
            Click card to flip
          </motion.p>
        </motion.div>

        {/* 3-Step Timeline */}
        <div className="max-w-3xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 relative">
            {/* Connecting lines */}
            <div className="hidden sm:block absolute top-10 left-[16.7%] right-[16.7%]">
              <svg width="100%" height="2" className="overflow-visible">
                <motion.line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="var(--card-border)"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ delay: 0.6, duration: 0.8 }}
                />
              </svg>
            </div>

            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                className="text-center relative"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
              >
                {/* Step icon */}
                <motion.div
                  className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center relative z-10"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    color: '#703AE6',
                  }}
                  whileHover={{ scale: 1.05, borderColor: '#703AE640' }}
                >
                  {step.icon}
                  {/* Step number badge */}
                  <span
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                    style={{ background: 'linear-gradient(135deg, #FC5457, #703AE6)' }}
                  >
                    {step.step}
                  </span>
                </motion.div>

                <h4 className="text-h10 mb-2" style={{ color: 'var(--text-primary)' }}>
                  {step.title}
                </h4>
                <p className="text-body-3" style={{ color: 'var(--text-secondary)' }}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
