'use client';

/**
 * Section 5: Protocol Constellation - 2D Ecosystem Map
 * Beautiful animated grid showing 15+ protocol integrations
 * with category filtering and hover interactions
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

const categoryFilters = [
  { id: 'all', label: 'All', color: '#703AE6' },
  { id: 'perps', label: 'Perps', color: '#9F7BEE' },
  { id: 'spot', label: 'Spot', color: '#32EEE2' },
  { id: 'options', label: 'Options', color: '#FB7185' },
  { id: 'yield', label: 'Yield', color: '#E879F9' },
  { id: 'lending', label: 'Lending', color: '#FC5457' },
];

const protocolNodes = [
  { id: 'hyperliquid', name: 'Hyperliquid', category: 'perps', chains: ['Arbitrum'], color: '#9F7BEE', actions: ['Long', 'Short', '50x Leverage'] },
  { id: 'uniswap', name: 'Uniswap', category: 'spot', chains: ['Base', 'Arbitrum', 'Optimism'], color: '#32EEE2', actions: ['Swap', 'Pool', 'Liquidity'] },
  { id: 'dydx', name: 'dYdX', category: 'perps', chains: ['Stellar'], color: '#9F7BEE', actions: ['Perp Trading', 'Margin'] },
  { id: 'gmx', name: 'GMX', category: 'perps', chains: ['Arbitrum'], color: '#9F7BEE', actions: ['Spot', 'Perps'] },
  { id: 'derive', name: 'Derive', category: 'options', chains: ['Base'], color: '#FB7185', actions: ['Options', 'Strategies'] },
  { id: 'pendle', name: 'Pendle', category: 'yield', chains: ['Arbitrum', 'Optimism'], color: '#E879F9', actions: ['Yield Trading', 'Fixed Rates'] },
  { id: 'aave', name: 'Aave', category: 'lending', chains: ['Base', 'Arbitrum'], color: '#FC5457', actions: ['Lend', 'Borrow'] },
  { id: 'morpho', name: 'Morpho', category: 'lending', chains: ['Base', 'Optimism'], color: '#FC5457', actions: ['Optimized Lending'] },
  { id: 'compound', name: 'Compound', category: 'lending', chains: ['Base'], color: '#FC5457', actions: ['Lend', 'Borrow'] },
  { id: 'lyra', name: 'Lyra', category: 'options', chains: ['Optimism'], color: '#FB7185', actions: ['Options AMM'] },
  { id: 'ribbon', name: 'Ribbon', category: 'options', chains: ['Arbitrum'], color: '#FB7185', actions: ['Vaults', 'Theta'] },
  { id: 'yearn', name: 'Yearn', category: 'yield', chains: ['Base', 'Arbitrum'], color: '#E879F9', actions: ['Auto-compound'] },
  { id: 'curve', name: 'Curve', category: 'spot', chains: ['Base', 'Optimism'], color: '#32EEE2', actions: ['Swap', 'LP'] },
  { id: 'maker', name: 'MakerDAO', category: 'lending', chains: ['Base'], color: '#FC5457', actions: ['Mint DAI', 'Vaults'] },
  { id: 'euler', name: 'Euler', category: 'lending', chains: ['Arbitrum'], color: '#FC5457', actions: ['Lend', 'Borrow'] },
  { id: 'convex', name: 'Convex', category: 'yield', chains: ['Base', 'Arbitrum'], color: '#E879F9', actions: ['Boost Rewards'] },
  { id: 'notional', name: 'Notional', category: 'yield', chains: ['Arbitrum'], color: '#E879F9', actions: ['Fixed Rates'] },
  { id: 'angle', name: 'Angle', category: 'spot', chains: ['Base', 'Optimism'], color: '#32EEE2', actions: ['Stablecoins'] },
];

function ProtocolCard({
  protocol,
  index,
  isFiltered,
}: {
  protocol: typeof protocolNodes[0];
  index: number;
  isFiltered: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isFiltered ? 0.15 : 1,
        y: 0,
        scale: isFiltered ? 0.95 : 1,
      }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-xl p-5 cursor-pointer transition-shadow duration-300"
      style={{
        backgroundColor: 'var(--card-bg)',
        border: `1px solid ${hovered ? protocol.color + '40' : 'var(--card-border)'}`,
        boxShadow: hovered ? `0 0 20px ${protocol.color}15, 0 8px 32px rgba(0,0,0,0.08)` : 'none',
      }}
    >
      {/* Category dot */}
      <div
        className="absolute top-3 right-3 w-2 h-2 rounded-full"
        style={{ backgroundColor: protocol.color }}
      />

      {/* Icon placeholder */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 text-lg font-bold text-white"
        style={{ background: `linear-gradient(135deg, ${protocol.color}CC, ${protocol.color})` }}
      >
        {protocol.name.charAt(0)}
      </div>

      <h4 className="text-h10 mb-1" style={{ color: 'var(--text-primary)' }}>
        {protocol.name}
      </h4>
      <p className="text-body-3 capitalize mb-2" style={{ color: 'var(--text-muted)' }}>
        {protocol.category}
      </p>

      {/* Chains badges */}
      <div className="flex flex-wrap gap-1">
        {protocol.chains.map((chain) => (
          <span
            key={chain}
            className="text-[10px] px-1.5 py-0.5 rounded-full"
            style={{
              backgroundColor: 'var(--badge-bg)',
              color: 'var(--badge-text)',
            }}
          >
            {chain}
          </span>
        ))}
      </div>

      {/* Hover actions */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 flex flex-wrap gap-1.5"
            style={{ borderTop: '1px solid var(--card-border)' }}
          >
            {protocol.actions.map((action) => (
              <span
                key={action}
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: protocol.color + '15',
                  color: protocol.color,
                }}
              >
                {action}
              </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ConstellationSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const headerRef = useRef(null);
  const isInView = useInView(headerRef, { once: true, margin: '-100px' });

  return (
    <section
      id="constellation"
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-violet-500 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            15+ Protocols. 5 Chains. One Account.
          </p>
          <h2 className="text-h3 text-heading mb-4">
            Your Gateway to All of DeFi
          </h2>
          <p className="text-subtext text-paragraph max-w-xl mx-auto">
            Vanna connects you to the protocols you love — with 10x more capital.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          {categoryFilters.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'text-white shadow-lg'
                  : 'hover:opacity-80'
              }`}
              style={
                activeCategory === cat.id
                  ? {
                      backgroundColor: cat.color,
                      boxShadow: `0 4px 15px ${cat.color}40`,
                    }
                  : {
                      backgroundColor: 'var(--gauge-bg)',
                      color: 'var(--text-secondary)',
                    }
              }
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Protocol Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {protocolNodes.map((protocol, i) => (
            <ProtocolCard
              key={protocol.id}
              protocol={protocol}
              index={i}
              isFiltered={activeCategory !== 'all' && protocol.category !== activeCategory}
            />
          ))}
        </div>

        {/* Bottom stats */}
        <motion.div
          className="mt-16 flex flex-wrap justify-center gap-8 sm:gap-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {[
            { label: 'Protocols', value: '18+' },
            { label: 'Chains', value: '5' },
            { label: 'Categories', value: '5' },
            { label: 'Total Actions', value: '50+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="text-h5 text-gradient font-mono block">{stat.value}</span>
              <span className="text-body-3" style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
