'use client';

/**
 * Hero Section — Minimalistic Modern
 * Theme-aware (light + dark), no Three.js
 * Framer Motion staggered text reveals, floating orbs, animated grid
 */

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ── Pre-computed floating orb configs (SSR-safe, no Math.random) ── */
const orbConfigs = [
  { size: 320, x: '12%', y: '18%', color: 'violet', blur: 80, delay: 0 },
  { size: 260, x: '75%', y: '25%', color: 'red', blur: 70, delay: 2 },
  { size: 200, x: '55%', y: '70%', color: 'blue', blur: 60, delay: 4 },
  { size: 160, x: '20%', y: '75%', color: 'violet', blur: 50, delay: 1 },
  { size: 120, x: '85%', y: '65%', color: 'red', blur: 40, delay: 3 },
];

const colorMap: Record<string, { light: string; dark: string }> = {
  violet: {
    light: 'rgba(112, 58, 230, 0.08)',
    dark: 'rgba(112, 58, 230, 0.12)',
  },
  red: {
    light: 'rgba(252, 84, 87, 0.06)',
    dark: 'rgba(252, 84, 87, 0.10)',
  },
  blue: {
    light: 'rgba(50, 238, 226, 0.05)',
    dark: 'rgba(50, 238, 226, 0.08)',
  },
};

/* ── Protocol chips that orbit around the hero ── */
const protocols = [
  { name: 'Hyperliquid', category: 'Perps' },
  { name: 'Uniswap', category: 'Spot' },
  { name: 'Derive', category: 'Options' },
  { name: 'Pendle', category: 'Yield' },
  { name: 'Aave', category: 'Lending' },
];

/* ── Stat pills ── */
const stats = [
  { value: '15+', label: 'Protocols' },
  { value: '5', label: 'Chains' },
  { value: '10x', label: 'Leverage' },
  { value: '$0', label: 'Overcollateral' },
];

/* ── Word-by-word headline animation ── */
const headlineVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ── Floating Orb ── */
function FloatingOrb({
  config,
}: {
  config: (typeof orbConfigs)[0];
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: config.size,
        height: config.size,
        left: config.x,
        top: config.y,
        filter: `blur(${config.blur}px)`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: 1,
        scale: [1, 1.15, 1],
        x: [0, 20, -10, 0],
        y: [0, -15, 10, 0],
      }}
      transition={{
        opacity: { duration: 1.2, delay: config.delay * 0.3 },
        scale: { duration: 12 + config.delay, repeat: Infinity, ease: 'easeInOut' },
        x: { duration: 18 + config.delay * 2, repeat: Infinity, ease: 'easeInOut' },
        y: { duration: 15 + config.delay * 2, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      {/* Light mode color */}
      <div
        className="absolute inset-0 rounded-full dark:opacity-0 transition-opacity duration-300"
        style={{ backgroundColor: colorMap[config.color].light }}
      />
      {/* Dark mode color */}
      <div
        className="absolute inset-0 rounded-full opacity-0 dark:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: colorMap[config.color].dark }}
      />
    </motion.div>
  );
}

/* ── Dot Grid Background ── */
function DotGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.35] dark:opacity-[0.15] transition-opacity duration-300"
      style={{
        backgroundImage: `radial-gradient(circle, var(--text-muted) 0.8px, transparent 0.8px)`,
        backgroundSize: '32px 32px',
      }}
    />
  );
}

/* ── Scroll Indicator ── */
function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
    >
      <span className="text-body-3 tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
        Scroll
      </span>
      <motion.div
        className="w-5 h-8 rounded-full flex items-start justify-center p-1"
        style={{ border: '1px solid var(--border-default)' }}
      >
        <motion.div
          className="w-1 h-2 rounded-full"
          style={{ backgroundColor: 'var(--text-muted)' }}
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function HeroSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, -60]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* Dot grid */}
      <DotGrid />

      {/* Floating ambient orbs (parallax) */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        {orbConfigs.map((config, i) => (
          <FloatingOrb key={i} config={config} />
        ))}
      </motion.div>

      {/* Subtle top gradient fade */}
      <div
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, var(--background), transparent)',
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 py-32 text-center"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Tagline chip */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
          style={{
            backgroundColor: 'var(--badge-bg)',
            border: '1px solid var(--card-border)',
          }}
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: '#703AE6' }}
          />
          <span className="text-body-3 font-medium" style={{ color: '#703AE6' }}>
            Composable Credit Infrastructure
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-h1 mb-6"
          style={{ color: 'var(--text-primary)' }}
          variants={headlineVariants}
          initial="hidden"
          animate="visible"
        >
          {['Borrow'].map((word, i) => (
            <motion.span key={i} className="inline-block mr-4" variants={wordVariants}>
              {word}
            </motion.span>
          ))}
          <motion.span className="inline-block mr-4 text-gradient" variants={wordVariants}>
            10x.
          </motion.span>
          <br className="hidden sm:block" />
          {['Trade', 'Anywhere.'].map((word, i) => (
            <motion.span key={i + 2} className="inline-block mr-4" variants={wordVariants}>
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-subtext max-w-2xl mx-auto mb-10"
          style={{ color: 'var(--text-secondary)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Unlock composable credit across 15+ DeFi protocols. Deploy leverage
          across perps, options, spot, and yield — all from one account.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.a
            href="#"
            className="px-8 py-4 text-btn-md text-white rounded-xl bg-vanna-gradient shadow-lg transition-shadow duration-300"
            style={{ boxShadow: '0 8px 30px rgba(112, 58, 230, 0.25)' }}
            whileHover={{ scale: 1.03, boxShadow: '0 12px 40px rgba(112, 58, 230, 0.35)' }}
            whileTap={{ scale: 0.97 }}
          >
            Launch App
          </motion.a>
          <motion.a
            href="#flow"
            className="px-8 py-4 text-btn-md rounded-xl transition-colors duration-200"
            style={{
              color: 'var(--text-primary)',
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--card-bg)',
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            See How It Works
          </motion.a>
        </motion.div>

        {/* Protocol chips */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          {protocols.map((p, i) => (
            <motion.div
              key={p.name}
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + i * 0.08 }}
              whileHover={{ y: -2, boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}
            >
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #703AE6, #FC5457)' }}
              >
                {p.name.charAt(0)}
              </div>
              <span className="text-body-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                {p.name}
              </span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: 'var(--badge-bg)',
                  color: 'var(--badge-text)',
                }}
              >
                {p.category}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center py-4 px-3 rounded-xl"
              style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 + i * 0.08 }}
            >
              <span className="text-h7 text-gradient font-mono block">{stat.value}</span>
              <span className="text-body-3" style={{ color: 'var(--text-muted)' }}>
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <ScrollIndicator />

      {/* SR description */}
      <div className="sr-only">
        Vanna Finance enables 10x leverage across DeFi protocols through
        composable credit infrastructure. Connect to leading protocols like
        Hyperliquid, Uniswap, Aave, dYdX, and more.
      </div>
    </section>
  );
}
