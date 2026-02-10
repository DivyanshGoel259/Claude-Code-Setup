'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const steps = [
  {
    phase: '01',
    title: 'Deposit Collateral',
    description: 'Start with what you have. Deposit ETH, BTC, or USDC into your Vanna margin account.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
      </svg>
    ),
    accent: '#703AE6',
  },
  {
    phase: '02',
    title: 'Borrow 10x Credit',
    description: 'Vanna multiplies your capital up to 10x through undercollateralized credit. No overcollateralization trap.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    accent: '#FC5457',
  },
  {
    phase: '03',
    title: 'Deploy Anywhere',
    description: 'Trade perps on Hyperliquid, buy options on Derive, yield farm on Pendle — all from one account.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
    accent: '#32EEE2',
  },
  {
    phase: '04',
    title: 'Manage Everything',
    description: 'One account. One dashboard. Track Greeks, monitor health factor, and optimize your strategy in real-time.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    accent: '#8D61EB',
  },
];

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      className="relative flex gap-6 sm:gap-10"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.1,
      }}
    >
      {/* Timeline */}
      <div className="flex flex-col items-center">
        {/* Icon circle */}
        <motion.div
          className="relative w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 z-10"
          style={{
            backgroundColor: `${step.accent}15`,
            color: step.accent,
            border: `1px solid ${step.accent}30`,
          }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{
            duration: 0.5,
            delay: index * 0.1 + 0.2,
            type: 'spring',
            stiffness: 200,
          }}
        >
          {step.icon}
          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{ border: `1px solid ${step.accent}` }}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={isInView ? { scale: 1.4, opacity: 0 } : {}}
            transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
          />
        </motion.div>

        {/* Connecting line */}
        {index < steps.length - 1 && (
          <motion.div
            className="w-px flex-1 my-2"
            style={{ backgroundColor: 'var(--border-default)' }}
            initial={{ scaleY: 0, originY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
          />
        )}
      </div>

      {/* Content */}
      <div className={`pb-14 ${index === steps.length - 1 ? 'pb-0' : ''}`}>
        <span
          className="text-body-3 font-mono tracking-wider mb-2 block"
          style={{ color: step.accent }}
        >
          PHASE {step.phase}
        </span>
        <h3
          className="text-h6 mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          {step.title}
        </h3>
        <p
          className="text-body-1 max-w-md"
          style={{ color: 'var(--text-secondary)' }}
        >
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function FlowSection() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });

  return (
    <section
      id="flow"
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* Subtle background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-[0.03] pointer-events-none"
        style={{ background: 'linear-gradient(135deg, #FC5457, #703AE6)' }}
      />

      <div className="max-w-4xl mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-violet-500 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            How It Works
          </p>
          <h2 className="text-h3 text-heading mb-4">
            From deposit to deployment
          </h2>
          <p className="text-subtext text-paragraph max-w-xl mx-auto">
            Here&apos;s how your $1,000 becomes $10,000 of trading power across DeFi.
          </p>
        </motion.div>

        {/* Steps Timeline */}
        <div className="max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <StepCard key={step.phase} step={step} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p
            className="text-body-1 mb-6"
            style={{ color: 'var(--text-secondary)' }}
          >
            Ready to multiply your capital?
          </p>
          <a
            href="#"
            className="inline-flex px-8 py-4 rounded-xl text-btn-md text-white bg-vanna-gradient hover:opacity-90 transition-opacity"
          >
            Start Trading
          </a>
        </motion.div>
      </div>
    </section>
  );
}
