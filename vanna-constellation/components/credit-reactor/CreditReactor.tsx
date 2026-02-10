'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const ReactorScene3D = dynamic(() => import('./ReactorScene3D'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-base-dark">
      <div className="w-16 h-16 rounded-full bg-vanna-gradient animate-pulse-glow" />
    </div>
  ),
});

function MobileFallback() {
  return (
    <div className="absolute inset-0 w-full h-full bg-base-dark overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-base-dark via-violet-900/20 to-base-dark" />
      {/* Central glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-br from-imperial-red-500/20 to-violet-500/20 blur-3xl animate-pulse-glow" />
      {/* Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              background: i % 2 === 0 ? '#703AE6' : '#FC5457',
              opacity: 0.4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
              ['--random-x' as string]: (Math.random() - 0.5) * 2,
              ['--random-y' as string]: (Math.random() - 0.5) * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
    >
      <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
      <motion.div
        className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1"
        initial={{ opacity: 0.6 }}
      >
        <motion.div
          className="w-1 h-2 rounded-full bg-white/50"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function CreditReactor() {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const staggerDelay = prefersReducedMotion ? 0 : 0.08;

  return (
    <section
      id="hero"
      className="relative w-full h-screen overflow-hidden bg-base-dark"
    >
      {/* 3D Scene / Mobile Fallback - always dark */}
      <div className="absolute inset-0 w-full h-full">
        {isMobile ? <MobileFallback /> : <ReactorScene3D />}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pointer-events-none">
        {/* Tagline */}
        <motion.p
          className="text-violet-400 text-sm font-semibold tracking-[0.2em] uppercase mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          Composable Credit Infrastructure
        </motion.p>

        {/* Headline */}
        <motion.h1
          className="text-h1 text-white mb-6 max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: staggerDelay, delayChildren: 0.2 },
            },
          }}
        >
          {['Borrow', '10x.'].map((word, i) => (
            <motion.span
              key={i}
              className={`inline-block mr-4 ${i === 1 ? 'text-gradient' : ''}`}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              {word}
            </motion.span>
          ))}
          <br className="hidden sm:block" />
          {['Trade', 'Anywhere.'].map((word, i) => (
            <motion.span
              key={i + 2}
              className="inline-block mr-4"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-subtext text-gray-400 max-w-2xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Unlock composable credit across 15+ DeFi protocols. Deploy leverage
          across perps, options, spot, and yield farming.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.button
            className="px-8 py-4 text-btn-md text-white rounded-xl bg-vanna-gradient shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow duration-300"
            whileHover={{ scale: prefersReducedMotion ? 1 : 1.03 }}
            whileTap={{ scale: prefersReducedMotion ? 1 : 0.97 }}
          >
            Launch App
          </motion.button>
          <motion.button
            className="px-8 py-4 text-btn-md text-white/90 rounded-xl border border-white/20 hover:bg-white/5 transition-colors duration-300"
            whileHover={{ scale: prefersReducedMotion ? 1 : 1.03 }}
            whileTap={{ scale: prefersReducedMotion ? 1 : 0.97 }}
          >
            See How It Works
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator />

      {/* Screen Reader Description */}
      <div className="sr-only">
        Vanna Finance enables 10x leverage across DeFi protocols through
        composable credit infrastructure. Connect to leading protocols like
        Hyperliquid, Uniswap, Aave, dYdX, and more.
      </div>
    </section>
  );
}
