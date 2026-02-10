'use client';

/**
 * ProtocolConstellation - Main Section Component
 * Renders 3D scene on desktop, 2D grid on mobile
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Protocol, ProtocolCategory } from './types';
import { protocols } from './protocols-data';
import CategoryFilters from './CategoryFilters';
import DetailPanel from './DetailPanel';
import ProtocolGrid2D from './ProtocolGrid2D';

// Dynamic import of 3D scene (no SSR)
const ProtocolScene3D = dynamic(() => import('./ProtocolScene3D'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-gray-400 animate-pulse">Loading 3D constellation...</div>
    </div>
  ),
});

export default function ProtocolConstellation() {
  // State
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [activeCategory, setActiveCategory] = useState<ProtocolCategory | 'all'>('all');
  const [hoveredProtocol, setHoveredProtocol] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive breakpoint detection (768px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Listen for resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle category change
  const handleCategoryChange = (category: ProtocolCategory | 'all') => {
    setActiveCategory(category);
    setSelectedProtocol(null); // Reset selection on filter change
  };

  // Handle protocol click
  const handleProtocolClick = (protocol: Protocol) => {
    setSelectedProtocol(protocol);
  };

  // Handle close detail panel
  const handleClosePanel = () => {
    setSelectedProtocol(null);
  };

  return (
    <section className="relative w-full min-h-screen bg-vanna-dark overflow-hidden">
      {/* Header Content */}
      <div className="relative z-30 text-center pt-20 pb-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Tagline */}
          <p className="text-violet-400 text-sm font-semibold mb-3 tracking-wide">
            15+ PROTOCOLS. 5 CHAINS. ONE ACCOUNT.
          </p>

          {/* Main Headline */}
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Your Gateway to All of DeFi
          </h2>

          {/* Subheadline */}
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Vanna connects you to the protocols you love - with 10x more capital.
          </p>
        </motion.div>
      </div>

      {/* Category Filters */}
      <CategoryFilters
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* 3D Scene or 2D Grid */}
      <div className="relative w-full h-[600px] md:h-[700px]">
        {isMobile ? (
          <ProtocolGrid2D
            protocols={protocols}
            selectedProtocol={selectedProtocol}
            onProtocolClick={handleProtocolClick}
            activeCategory={activeCategory}
          />
        ) : (
          <ProtocolScene3D
            protocols={protocols}
            selectedProtocol={selectedProtocol}
            onProtocolClick={handleProtocolClick}
            hoveredProtocol={hoveredProtocol}
            onProtocolHover={setHoveredProtocol}
            activeCategory={activeCategory}
          />
        )}
      </div>

      {/* Detail Panel */}
      <DetailPanel protocol={selectedProtocol} onClose={handleClosePanel} />

      {/* Screen Reader Description */}
      <div className="sr-only">
        Vanna integrates with 15+ DeFi protocols across 5 blockchains including
        Hyperliquid, Uniswap, dYdX, Aave, Pendle, and more. Explore the interactive
        visualization to learn about each protocol integration and supported features.
      </div>
    </section>
  );
}
