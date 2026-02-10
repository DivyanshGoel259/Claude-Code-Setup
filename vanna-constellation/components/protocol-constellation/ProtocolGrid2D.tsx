'use client';

/**
 * ProtocolGrid2D Component
 * Mobile fallback - beautiful grid with Framer Motion animations
 */

import { motion } from 'framer-motion';
import { Protocol, ProtocolCategory } from './types';
import { getCategoryConfig } from './protocols-data';

interface ProtocolGrid2DProps {
  protocols: Protocol[];
  selectedProtocol: Protocol | null;
  onProtocolClick: (protocol: Protocol) => void;
  activeCategory: ProtocolCategory | 'all';
}

export default function ProtocolGrid2D({
  protocols,
  selectedProtocol,
  onProtocolClick,
  activeCategory,
}: ProtocolGrid2DProps) {
  // Filter protocols by active category
  const filteredProtocols =
    activeCategory === 'all'
      ? protocols
      : protocols.filter((p) => p.category === activeCategory);

  return (
    <motion.div
      className="grid grid-cols-2 gap-4 p-6 md:grid-cols-3 lg:grid-cols-4"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: { staggerChildren: 0.05 },
        },
      }}
    >
      {filteredProtocols.map((protocol) => {
        const categoryConfig = getCategoryConfig(protocol.category);
        const isSelected = selectedProtocol?.id === protocol.id;
        const isDimmed =
          activeCategory !== 'all' && protocol.category !== activeCategory;

        return (
          <motion.div
            key={protocol.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onProtocolClick(protocol)}
            className={`
              relative p-4 rounded-xl backdrop-blur-sm
              border transition-all cursor-pointer
              ${
                isDimmed
                  ? 'bg-gray-800/20 border-gray-800 opacity-30'
                  : 'bg-gray-800/60 border-gray-700 opacity-100'
              }
              ${isSelected ? 'ring-2 ring-violet-500' : ''}
            `}
          >
            {/* Category indicator dot */}
            <div
              className="absolute top-2 right-2 w-2 h-2 rounded-full"
              style={{ backgroundColor: categoryConfig.color }}
            />

            {/* Protocol icon placeholder */}
            <div
              className="w-12 h-12 rounded-full bg-gradient-to-br mb-3"
              style={{
                backgroundImage: `linear-gradient(135deg, ${categoryConfig.color}60, ${categoryConfig.color}FF)`,
              }}
            />

            {/* Protocol name */}
            <h4 className="text-white font-semibold mb-1 text-sm">
              {protocol.name}
            </h4>

            {/* Category */}
            <p className="text-gray-400 text-xs capitalize">
              {protocol.category}
            </p>

            {/* Supported chains count */}
            <div className="mt-2 text-xs text-gray-500">
              {protocol.chains.length} chain{protocol.chains.length > 1 ? 's' : ''}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
